"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/types/article";
import { cn } from "@/lib/utils";

export function TableOfContents({ items, className }: { items: TocItem[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const elements = items.map((item) => document.getElementById(item.id)).filter((element): element is HTMLElement => Boolean(element));
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -65% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={className}>
      <p className="kicker mb-4 text-ink-subtle">In this article</p>
      <ol className="space-y-1 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1.5 text-[13.5px] leading-snug transition-colors",
                item.level === 3 ? "pl-7" : "pl-4",
                active === item.id ? "border-brand font-medium text-brand" : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
