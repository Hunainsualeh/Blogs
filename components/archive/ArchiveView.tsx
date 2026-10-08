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
  const groupSize = 5;
  const groups: ArticleWithRelations[][] = [];
  for (let index = 0; index < articles.length; index += groupSize) groups.push(articles.slice(index, index + groupSize));

  return (
    <div className="container-site pt-6 sm:pt-8">
      <header className="mb-8 rounded-sm border border-line bg-surface-muted p-5 sm:p-7">
        <Breadcrumbs items={crumbs} className="mb-3" />
        <p className="kicker mb-1.5 text-brand">{kicker}</p>
        <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[38px]">{title}</h1>
        <p className="mt-2 max-w-3xl text-[16px] leading-relaxed text-ink-muted">{description}</p>
        {extra}
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <section aria-label={title} className="min-w-0">
          {articles.length > 0 ? (
            <>
              {groups.map((group, index) => (
                <Fragment key={index}>
                  {index > 0 ? <AdSlot placement="archive-between" /> : null}
                  <div className="space-y-5">
                    {group.map((article, position) => (
                      <ArticleCard key={article.id} article={article} variant="list" size="md" showCategory={!activeCategory} priority={page === 1 && index === 0 && position === 0} />
                    ))}
                  </div>
                </Fragment>
              ))}
              <Pagination page={page} totalPages={totalPages} hrefForPage={hrefForPage} className="mt-10" />
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
