import { Fragment, Suspense, type ReactNode } from "react";
import type { ArticleWithRelations } from "@/types/article";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";

type ArchiveViewProps = {
  title: string;
  kicker: string;
  description: string;
  crumbs: Crumb[];
  articles: ArticleWithRelations[];
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  activeCategory?: string;
  extra?: ReactNode;
  emptyTitle: string;
  emptyDescription: string;
};

export function ArchiveView({ title, kicker, description, crumbs, articles, page, totalPages, hrefForPage, activeCategory, extra, emptyTitle, emptyDescription }: ArchiveViewProps) {
  const groupSize = 6;
  const groups: ArticleWithRelations[][] = [];
  for (let index = 0; index < articles.length; index += groupSize) groups.push(articles.slice(index, index + groupSize));

  return (
    <div className="container-site pt-6 sm:pt-8">
      <header className="border-b border-ink pb-6">
        <Breadcrumbs items={crumbs} className="mb-4" />
        <p className="kicker mb-2 text-brand">{kicker}</p>
        <h1 className="text-[36px] font-semibold leading-none tracking-[-0.04em] text-ink sm:text-[48px]">{title}</h1>
        <p className="mt-3 max-w-3xl font-serif text-[18px] leading-relaxed text-ink-muted">{description}</p>
        {extra}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-12">
        <section aria-label={title} className="min-w-0">
          {articles.length > 0 ? (
            <>
              {groups.map((group, index) => (
                <Fragment key={index}>
                  {index > 0 ? <AdSlot placement="archive-between" /> : null}
                  <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2">
                    {group.map((article) => (
                      <ArticleCard key={article.id} article={article} size="md" showAuthor={false} showCategory={!activeCategory} priority={page === 1 && index === 0 && group.indexOf(article) < 2} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 100vw" />
                    ))}
                  </div>
                </Fragment>
              ))}
              <Pagination page={page} totalPages={totalPages} hrefForPage={hrefForPage} className="mt-12" />
            </>
          ) : (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          )}
        </section>
        <Suspense>
          <Sidebar variant="archive" activeCategory={activeCategory} />
        </Suspense>
      </div>
    </div>
  );
}
