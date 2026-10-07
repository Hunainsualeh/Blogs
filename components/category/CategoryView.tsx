import Link from "next/link";
import type { Category } from "@/types/category";
import { getAllCategories, getCategoryFeed, getPopularArticles, getArticlesByCategory } from "@/lib/blog";
import { categoryHref, searchHref } from "@/lib/routes";
import { breadcrumbJsonLd, categoryJsonLd, JsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { Newsletter } from "@/components/home/Newsletter";
import { PopularStories } from "@/components/home/PopularStories";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CategoryView({ category, page }: { category: Category; page: number }) {
  const feed = getCategoryFeed(category.slug, page);
  const popularInCategory = [...getArticlesByCategory(category.slug)].sort((a, b) => b.views - a.views).slice(0, 5);
  const popular = popularInCategory.length >= 3 ? popularInCategory : getPopularArticles(5);
  const others = getAllCategories().filter((item) => item.slug !== category.slug);

  return (
    <div className="pt-8 sm:pt-12">
      <JsonLd data={categoryJsonLd(category)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: category.name, path: categoryHref(category.slug) }])} />
      <header className="container-site">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.name }]} className="[&_ol]:justify-start" />
        <div className="grid gap-6 border-b border-ink pb-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="kicker mb-3 text-brand">Section · {feed.total} stories</p>
            <h1 className="text-[44px] font-semibold leading-none tracking-[-0.045em] text-ink sm:text-[64px] lg:text-[80px]">{category.name}</h1>
          </div>
          <div>
            <p className="font-serif text-[18px] leading-relaxed text-ink-muted sm:text-[20px]">{category.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.topics.map((topic) => (
                <Link key={topic} href={searchHref(topic)} className="rounded-sm border border-line px-2.5 py-1 text-[13px] text-ink-muted hover:border-brand hover:text-brand">
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <nav aria-label="Other sections" className="no-scrollbar -mx-4 mt-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {others.map((item) => (
            <Link key={item.slug} href={categoryHref(item.slug)} className="shrink-0 rounded-sm px-2.5 py-1.5 text-[13px] text-ink-subtle hover:bg-surface-muted hover:text-ink">
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      {feed.lead ? (
        <div className="container-site mt-10">
          {page === 1 ? <FeaturedArticle article={feed.lead} layout="split" priority headingLevel="h2" /> : null}
          <div className={cn("grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]", page === 1 && "mt-16")}>
            <section aria-label={`Latest in ${category.name}`}>
              <SectionHeading title={page === 1 ? "Latest" : `Latest, page ${page}`} as="h2" />
              {feed.items.length > 0 ? (
                <div className="divide-y divide-line">
                  {feed.items.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" showCategory={false} className="py-6 first:pt-0" />
                  ))}
                </div>
              ) : (
                <EmptyState title="More stories are on the way" description={`Our editors are working on new ${category.name} coverage. Check back soon.`} />
              )}
              <Pagination page={feed.page} totalPages={feed.totalPages} hrefForPage={(number) => categoryHref(category.slug, number)} className="mt-10" />
            </section>
            <aside className="lg:sticky lg:top-[calc(var(--header-height,120px)+24px)] lg:self-start">
              <PopularStories articles={popular} title={`Popular in ${category.name}`} />
            </aside>
          </div>
        </div>
      ) : (
        <div className="container-site mt-10">
          <EmptyState title="No stories yet" description="This section is new. The first stories will appear here soon." />
        </div>
      )}

      <div className="container-site mt-20">
        <Newsletter title={`Get the best of ${category.name}`} description={`A weekly roundup of the most useful ${category.name.toLowerCase()} stories, plus our top reporting across Northline.`} />
      </div>
    </div>
  );
}
