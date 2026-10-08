"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/config/navigation";
import { categoryHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/ui/Icons";

type DesktopNavigationProps = {
  items: NavItem[];
  categories: { slug: string; name: string }[];
  className?: string;
};

export function DesktopNavigation({ items, categories, className }: DesktopNavigationProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const containerRef = useRef<HTMLLIElement>(null);
  const menuId = useId();

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkClasses = (active: boolean) =>
    cn(
      "inline-flex h-[52px] items-center px-4 text-[13.5px] font-semibold uppercase tracking-wide text-white transition-colors",
      active ? "bg-brand" : "hover:bg-white/10",
    );

  return (
    <nav aria-label="Main" className={className}>
      <ul className="flex items-stretch">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          if (item.href === "/categories") {
            return (
              <li key={item.href} ref={containerRef} className="relative">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={menuId}
                  onClick={() => setOpen((value) => !value)}
                  className={cn(linkClasses(active || pathname.startsWith("/category")), "gap-1")}
                >
                  {item.label}
                  <ChevronDownIcon size={14} className={cn("transition-transform", open && "rotate-180")} />
                </button>
                {open ? (
                  <div id={menuId} className="absolute left-0 top-full z-50 w-[520px] border border-line bg-white p-3 text-ink shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)]">
                    <ul className="grid grid-cols-2 gap-x-2">
                      {categories.map((category) => (
                        <li key={category.slug}>
                          <Link href={categoryHref(category.slug)} className="block rounded-sm px-3 py-2 text-[14.5px] text-ink hover:bg-surface-muted hover:text-brand">
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 border-t border-line pt-2">
                      <Link href="/categories" className="block rounded-sm px-3 py-2 text-[13.5px] font-medium text-brand hover:bg-surface-muted">
                        Browse all categories
                      </Link>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          }
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={active ? "page" : undefined} className={linkClasses(active)}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
