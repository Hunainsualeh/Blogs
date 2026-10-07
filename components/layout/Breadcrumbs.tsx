import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@/components/ui/Icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-subtle sm:justify-center">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? <ChevronRightIcon size={13} aria-hidden /> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand">{item.label}</Link>
            ) : (
              <span aria-current="page" className="line-clamp-1 max-w-[52vw] text-ink-muted">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
