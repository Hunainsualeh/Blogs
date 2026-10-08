import Link from "next/link";
import type { Category } from "@/types/category";
import { getCategoryFeed } from "@/lib/blog";
import { categoryHref, searchHref } from "@/lib/routes";
import { breadcrumbJsonLd, collectionJsonLd, JsonLd } from "@/lib/seo";
import { ArchiveView } from "@/components/archive/ArchiveView";

export async function CategoryView({ category, page }: { category: Category; page: number }) {
  const feed = await getCategoryFeed(category.slug, page);
  return (
    <>
      <JsonLd data={collectionJsonLd(`${category.name} | Global Insights Daily`, category.description, categoryHref(category.slug, page))} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: category.name, path: categoryHref(category.slug) }])} />
      <ArchiveView
        title={category.name}
        kicker={`Category · ${feed.total} ${feed.total === 1 ? "article" : "articles"}`}
        description={category.description}
        crumbs={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.name }]}
        articles={feed.items}
        page={feed.page}
        totalPages={feed.totalPages}
        hrefForPage={(number) => categoryHref(category.slug, number)}
        activeCategory={category.slug}
        extra={
          category.topics.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {category.topics.map((topic) => (
                <Link key={topic} href={searchHref(topic)} className="rounded-sm border border-line px-2.5 py-1 text-[13px] text-ink-muted hover:border-brand hover:text-brand">
                  {topic}
                </Link>
              ))}
            </div>
          ) : null
        }
        emptyTitle="No articles yet"
        emptyDescription={`New ${category.name} articles are on the way. Check back soon.`}
      />
    </>
  );
}
