"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { categoryHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function CategoryBar({ categories, className }: { categories: { slug: string; name: string }[]; className?: string }) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = activeRef.current;
    const scroller = element?.parentElement?.parentElement;
    if (!element || !scroller) return;
    const target = element.offsetLeft - (scroller.clientWidth - element.clientWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [pathname]);

  return (
    <nav aria-label="Categories" className={cn("relative", className)}>
      <ul className="no-scrollbar flex items-stretch gap-1 overflow-x-auto scroll-smooth px-1 sm:px-2">
        {categories.map((category) => {
          const href = categoryHref(category.slug);
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={category.slug} className="shrink-0">
              <Link
                ref={active ? activeRef : undefined}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-11 items-center px-3 text-[13.5px] font-medium transition-colors",
                  "after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:origin-center after:scale-x-0 after:bg-brand after:transition-transform after:duration-200",
                  active ? "text-brand after:scale-x-100" : "text-ink-muted hover:text-ink hover:after:scale-x-100",
                )}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
