import type { ArticleWithRelations } from "@/types/article";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";

export function FeaturedSection({ lead, secondary }: { lead: ArticleWithRelations; secondary: ArticleWithRelations[] }) {
  return (
    <section aria-labelledby="featured-heading" className="container-site pt-6 sm:pt-8">
      <h2 id="featured-heading" className="sr-only">Featured articles</h2>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
        <FeaturedArticle article={lead} priority />
        <div>
          <p className="kicker mb-4 border-b border-ink pb-3 text-ink">More featured</p>
          <div className="divide-y divide-line">
            {secondary.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="horizontal"
                size="sm"
                showExcerpt={false}
                showAuthor={false}
                priority
                className="py-4 first:pt-0 !grid-cols-[112px_1fr] sm:!grid-cols-[132px_1fr]"
                sizes="132px"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
