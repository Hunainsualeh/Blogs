import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getAllCategories, searchArticles } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchIcon } from "@/components/ui/Icons";
import { SearchInput } from "@/components/ui/SearchInput";
import { ArticleListSkeleton, Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search Global Insights Daily by title, topic, category, tag or author.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="container-site pt-8 sm:pt-12">
      <header className="max-w-3xl">
        <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-[44px]">Search</h1>
        <p className="mt-2 text-[16px] text-ink-muted">Search by headline, description, category, tag or author.</p>
      </header>
      <Suspense fallback={<SearchFallback />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function SearchFallback() {
  return (
    <div className="mt-8 max-w-3xl">
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
  const query = (Array.isArray(raw) ? raw[0] : (raw ?? "")).trim().slice(0, 100);
  const [results, categories] = await Promise.all([query ? searchArticles(query) : Promise.resolve([]), getAllCategories()]);

  return (
    <>
      <div className="mt-6 max-w-3xl">
        <SearchInput key={query} defaultValue={query} size="lg" />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-12">
        <section aria-live="polite" className="min-w-0">
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
                  {results.slice(0, 30).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" showAuthor={false} className="py-6" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  className="mt-8"
                  icon={<SearchIcon />}
                  title="We could not find a match"
                  description="Try a broader term or browse one of our categories."
                  action={
                    <div className="flex flex-wrap justify-center gap-2">
                      {categories.map((category) => (
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
              <p className="border-b border-ink pb-3 text-[15px] font-semibold text-ink">Browse by category</p>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
                {categories.map((category) => (
                  <li key={category.slug} className="bg-white">
                    <Link href={categoryHref(category.slug)} className="group block p-5 hover:bg-surface-muted">
                      <span className="block text-[17px] font-semibold tracking-tight text-ink group-hover:text-brand">{category.name}</span>
                      <span className="mt-1 block text-[13px] leading-snug text-ink-subtle">{category.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
        <Sidebar variant="archive" />
      </div>
    </>
  );
}
