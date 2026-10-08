import Link from "next/link";
import { categoryHref } from "@/lib/routes";
import { getAllCategories, getCategoryCounts } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { SidebarWidget } from "./SidebarWidget";

export async function CategoriesWidget({ activeSlug }: { activeSlug?: string }) {
  const [categories, counts] = await Promise.all([getAllCategories(), getCategoryCounts()]);
  return (
    <SidebarWidget title="Categories" variant="card">
      <ul className="divide-y divide-line">
        {categories.map((category) => {
          const active = category.slug === activeSlug;
          return (
            <li key={category.slug}>
              <Link
                href={categoryHref(category.slug)}
                aria-current={active ? "page" : undefined}
                className={cn("group flex items-center justify-between gap-3 py-3 text-[15px] hover:text-brand", active ? "font-semibold text-brand" : "text-ink")}
              >
                <span className="flex items-center gap-2">
                  <ChevronRightIcon size={14} className="text-ink-subtle group-hover:text-brand" />
                  {category.name}
                </span>
                <span className="min-w-[30px] rounded-[3px] bg-brand px-2 py-0.5 text-center text-[12px] font-medium tabular-nums text-white">{counts[category.slug] ?? 0}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SidebarWidget>
  );
}
