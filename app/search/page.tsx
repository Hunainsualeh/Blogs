import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { trendingSearches } from "@/config/navigation";
import { getAllCategories, getPopularArticles, searchArticles } from "@/lib/blog";
import { categoryHref, searchHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { PopularStories } from "@/components/home/PopularStories";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchIcon } from "@/components/ui/Icons";
import { SearchInput } from "@/components/ui/SearchInput";
import { ArticleListSkeleton, Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search Northline stories by title, topic, category, tag or author.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="container-site pt-10 sm:pt-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="kicker mb-3 text-brand">Search</p>
        <h1 className="text-[36px] font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-[52px]">Find a story</h1>
        <p className="mt-3 text-[16px] text-ink-muted">Search by headline, description, category, tag or author.</p>
      </header>
      <Suspense fallback={<SearchFallback />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function SearchFallback() {
  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <Skeleton className="h-14 w-full" />
      <div className="mt-12">
        <ArticleListSkeleton count={4} />
      </div>
    </div>
  );
}

async function SearchResults({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 100);
  const results = query ? searchArticles(query) : [];

  return (
    <>
      <div className="mx-auto mt-8 max-w-3xl">
        <SearchInput key={query} defaultValue={query} size="lg" />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="kicker mr-1 text-ink-subtle">Trending</span>
          {trendingSearches.map((term) => (
            <Link key={term} href={searchHref(term)} className="rounded-sm border border-line px-2.5 py-1 text-[13px] text-ink-muted hover:border-brand hover:text-brand">
              {term}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-live="polite">
          {query ? (
            <>
              <p className="border-b border-ink pb-3 text-[15px] text-ink-muted">
                {results.length > 0 ? (
                  <>
                    <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? "result" : "results"} for <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
                  </>
                ) : (
                  <>No results for <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span></>
                )}
              </p>
              {results.length > 0 ? (
                <div className="divide-y divide-line">
                  {results.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" className="py-6" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  className="mt-8"
                  icon={<SearchIcon />}
                  title="We could not find a match"
                  description="Try a broader term, check the spelling or browse one of our sections below."
                  action={
                    <div className="flex flex-wrap justify-center gap-2">
                      {getAllCategories().map((category) => (
                        <Link key={category.slug} href={categoryHref(category.slug)} className="rounded-sm bg-surface-muted px-3 py-1.5 text-sm text-ink hover:bg-brand-soft hover:text-brand">
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  }
                />
              )}
            </>
          ) : (
            <>
              <p className="border-b border-ink pb-3 text-[15px] font-semibold text-ink">Browse by section</p>
              <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {getAllCategories().map((category) => (
                  <Link key={category.slug} href={categoryHref(category.slug)} className="group bg-white p-5 hover:bg-surface-muted">
                    <span className="block text-[17px] font-semibold tracking-tight text-ink group-hover:text-brand">{category.name}</span>
                    <span className="mt-1 block text-[13px] leading-snug text-ink-subtle">{category.tagline}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
        <aside>
          <PopularStories articles={getPopularArticles(5)} />
        </aside>
      </div>
    </>
  );
}
