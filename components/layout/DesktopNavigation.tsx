"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function DesktopNavigation({ items, className }: { items: NavItem[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Sections" className={cn("relative", className)}>
      <ul className="no-scrollbar -mx-4 flex items-center gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:justify-between">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-11 items-center px-2.5 text-[13.5px] font-medium transition-colors lg:px-1.5 xl:px-2.5",
                  "after:absolute after:inset-x-2.5 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100 lg:after:inset-x-1.5 xl:after:inset-x-2.5",
                  active ? "text-brand after:scale-x-100" : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
