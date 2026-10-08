"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { primaryNavigation } from "@/config/navigation";
import { BoltIcon, SearchIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { DesktopNavigation } from "./DesktopNavigation";
import { MenuButton } from "./MenuButton";
import { MobileNavigation } from "./MobileNavigation";
import { SearchOverlay } from "./SearchOverlay";

export type NavCategory = { slug: string; name: string };

const dateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

function subscribeNothing() {
  return () => undefined;
}

function readToday() {
  return dateFormatter.format(new Date());
}

export function HeaderClient({ categories, breaking }: { categories: NavCategory[]; breaking: { title: string; href: string } | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const today = useSyncExternalStore(subscribeNothing, readToday, () => "");
  const stickyRef = useRef<HTMLDivElement>(null);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const bottom = stickyRef.current?.getBoundingClientRect().bottom ?? 96;
    document.documentElement.style.setProperty("--menu-top", `${bottom}px`);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    const element = stickyRef.current;
    if (!element) return;
    const update = () => document.documentElement.style.setProperty("--header-height", `${element.getBoundingClientRect().height}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const menuId = "site-menu";

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="border-b border-line bg-white">
        <div className="container-site flex h-10 items-center gap-4 text-[13px]">
          <span className="hidden shrink-0 text-ink-muted md:block md:min-w-[190px]" suppressHydrationWarning>{today}</span>
          {breaking ? (
            <div className="flex min-w-0 flex-1 items-center">
              <span className="flex h-10 shrink-0 items-center gap-1.5 bg-brand px-3 text-[12px] font-medium text-white">
                <BoltIcon size={14} />
                <span className="hidden sm:inline">Breaking News</span>
              </span>
              <Link href={breaking.href} className="truncate pl-3 text-ink hover:text-brand">{breaking.title}</Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden bg-white py-6 text-center lg:block">
        <Logo size="lg" />
      </div>

      <div ref={stickyRef} className="sticky top-0 z-50 bg-white">
        <div className="flex h-14 items-center justify-between border-b border-line px-4 lg:hidden">
          <MenuButton open={menuOpen} onClick={() => setMenuOpen((value) => !value)} controls={menuId} />
          <Logo size="sm" />
          <button type="button" onClick={() => setSearchOpen(true)} className="inline-flex h-10 w-10 items-center justify-center text-ink hover:text-brand" aria-label="Search articles">
            <SearchIcon size={20} />
          </button>
        </div>
        <div className="container-site hidden lg:block">
          <div className="flex items-stretch justify-between bg-dark">
            <DesktopNavigation items={primaryNavigation} categories={categories} />
            <button type="button" onClick={() => setSearchOpen(true)} className="my-2.5 mr-3 flex w-[240px] items-center justify-between rounded-full bg-white/10 px-4 text-[13px] text-white/70 hover:bg-white/15" aria-label="Search articles">
              Search for
              <SearchIcon size={16} />
            </button>
          </div>
        </div>
        {menuOpen ? <MobileNavigation id={menuId} items={primaryNavigation} categories={categories} onNavigate={closeMenu} /> : null}
      </div>
      <SearchOverlay open={searchOpen} onClose={closeSearch} categories={categories} />
    </>
  );
}
