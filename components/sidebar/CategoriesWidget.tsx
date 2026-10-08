import Link from "next/link";
import { categoryHref } from "@/lib/routes";
import { getAllCategories, getCategoryCounts } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { SidebarWidget } from "./SidebarWidget";

export async function CategoriesWidget({ activeSlug }: { activeSlug?: string }) {
  const [categories, counts] = await Promise.all([getAllCategories(), getCategoryCounts()]);
  return (
    <SidebarWidget title="Categories">
      <ul className="-my-1 divide-y divide-line">
        {categories.map((category) => {
          const active = category.slug === activeSlug;
          return (
            <li key={category.slug}>
              <Link
                href={categoryHref(category.slug)}
                aria-current={active ? "page" : undefined}
                className={cn("group flex items-center justify-between gap-3 py-2.5 text-[15px] hover:text-brand", active ? "font-semibold text-brand" : "text-ink")}
              >
                <span className="flex items-center gap-2">
                  <ChevronRightIcon size={14} className="text-ink-subtle group-hover:text-brand" />
                  {category.name}
                </span>
                <span className="font-mono text-[12px] tabular-nums text-ink-subtle">{counts[category.slug] ?? 0}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SidebarWidget>
  );
}
