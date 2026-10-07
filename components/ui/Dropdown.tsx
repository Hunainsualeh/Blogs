"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DropdownItem = {
  key: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  onSelect: () => void;
};

type DropdownProps = {
  trigger: (props: { open: boolean; toggle: () => void; id: string }) => ReactNode;
  items: DropdownItem[];
  align?: "start" | "end" | "center";
  label: string;
  className?: string;
  columns?: 1 | 2;
};

export function Dropdown({ trigger, items, align = "start", label, className, columns = 1 }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const buttons = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>("button[role='menuitem']") ?? [])];
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === "ArrowDown" ? (index + 1) % buttons.length : (index - 1 + buttons.length) % buttons.length;
        buttons[next]?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    menuRef.current?.querySelector<HTMLButtonElement>("button[role='menuitem']")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {trigger({ open, toggle: () => setOpen((value) => !value), id })}
      {open ? (
        <div
          ref={menuRef}
          id={id}
          role="menu"
          aria-label={label}
          className={cn(
            "absolute top-full z-50 mt-2 w-[min(92vw,320px)] rounded-lg border border-line bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(0,27,61,0.25)] [animation:slide-down_180ms_ease_both]",
            columns === 2 && "sm:w-[460px] sm:grid sm:grid-cols-2",
            align === "end" && "right-0",
            align === "start" && "left-0",
            align === "center" && "left-1/2 -translate-x-1/2",
          )}
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left hover:bg-surface-muted focus:bg-surface-muted focus:outline-none"
            >
              {item.icon ? <span className="mt-0.5 text-brand">{item.icon}</span> : null}
              <span>
                <span className="block text-sm font-medium text-ink">{item.label}</span>
                {item.description ? <span className="block text-xs text-ink-subtle">{item.description}</span> : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
