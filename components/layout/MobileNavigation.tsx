"use client";

import Link from "next/link";
import type { NavItem } from "@/config/navigation";
import { categoryHref } from "@/lib/routes";

type MobileNavigationProps = {
  id: string;
  items: NavItem[];
  categories: { slug: string; name: string }[];
  onNavigate: () => void;
};

export function MobileNavigation({ id, items, categories, onNavigate }: MobileNavigationProps) {
  return (
    <div id={id} className="fixed inset-x-0 bottom-0 top-[var(--header-height,64px)] z-40 overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden">
      <div className="container-site flex flex-col gap-8 py-6">
        <nav aria-label="Main">
          <ul className="divide-y divide-line border-y border-line">
            {items
              .filter((item) => item.href !== "/categories")
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={onNavigate} className="block py-3.5 text-[18px] font-semibold tracking-tight text-ink active:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <nav aria-label="Categories">
          <p className="kicker mb-3 text-ink-subtle">Categories</p>
          <ul className="grid grid-cols-2 gap-x-4">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={categoryHref(category.slug)} onClick={onNavigate} className="block py-2.5 text-[15.5px] text-ink-muted active:text-brand">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
