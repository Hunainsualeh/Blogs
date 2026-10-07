"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { articleHref, searchHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { SearchSuggestion } from "@/types/search";
import { ArrowUpRightIcon, CloseIcon, SearchIcon } from "./Icons";

type SearchInputProps = {
  defaultValue?: string;
  placeholder?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function SearchInput({ defaultValue = "", placeholder = "Search stories, topics or authors", size = "md", autoFocus, onNavigate, className }: SearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`, { signal: controller.signal });
        const data = (await response.json()) as { results: SearchSuggestion[] };
        setSuggestions(data.results);
        setActive(-1);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 180);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (active >= 0 && suggestions[active]) {
      go(articleHref(suggestions[active].slug));
      return;
    }
    const query = value.trim();
    if (query) go(searchHref(query));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const visibleSuggestions = value.trim().length >= 2 ? suggestions : [];
  const showList = open && visibleSuggestions.length > 0;
  const large = size === "lg";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form role="search" onSubmit={submit} className="relative">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search
        </label>
        <SearchIcon size={large ? 22 : 18} className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-subtle", large ? "left-4" : "left-3.5")} />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          value={value}
          autoComplete="off"
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full rounded-md border border-line-strong bg-white text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand-soft [&::-webkit-search-cancel-button]:hidden",
            large ? "h-14 pl-12 pr-28 text-lg" : "h-11 pl-10 pr-24 text-[15px]",
          )}
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {value ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setValue("");
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              className="rounded-md p-1.5 text-ink-subtle hover:text-ink"
            >
              <CloseIcon size={16} />
            </button>
          ) : null}
          <button type="submit" className={cn("rounded-md bg-brand font-medium text-white hover:bg-brand-strong", large ? "h-11 px-4 text-sm" : "h-8 px-3 text-[13px]")}>
            Search
          </button>
        </div>
      </form>
      {showList ? (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-lg border border-line bg-white py-1.5 shadow-[0_16px_40px_-16px_rgba(0,27,61,0.3)]">
          {visibleSuggestions.map((item, index) => (
            <li key={item.slug} id={`${listId}-${index}`} role="option" aria-selected={active === index}>
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onClick={() => go(articleHref(item.slug))}
                className={cn("flex w-full items-center gap-3 px-3 py-2.5 text-left", active === index && "bg-surface-muted")}
              >
                <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                  <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{item.title}</span>
                  <span className="block text-xs text-ink-subtle">
                    {item.categoryName} · {item.authorName}
                  </span>
                </span>
                <ArrowUpRightIcon size={16} className="shrink-0 text-ink-subtle" />
              </button>
            </li>
          ))}
          <li className="border-t border-line px-3 pt-2 pb-1">
            <button type="button" onClick={() => go(searchHref(value.trim()))} className="text-sm font-medium text-brand hover:underline">
              See all results for &ldquo;{value.trim()}&rdquo;
            </button>
          </li>
        </ul>
      ) : null}
      {loading && open && value.trim().length >= 2 && visibleSuggestions.length === 0 ? (
        <p className="absolute left-0 top-full mt-2 text-xs text-ink-subtle" role="status">
          Searching...
        </p>
      ) : null}
    </div>
  );
}
