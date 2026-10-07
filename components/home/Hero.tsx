import type { ArticleWithRelations } from "@/types/article";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";

export function Hero({ lead, secondary }: { lead: ArticleWithRelations; secondary: ArticleWithRelations[] }) {
  const [first, ...rest] = secondary;
  return (
    <section aria-label="Top stories" className="container-site pt-8 sm:pt-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-0">
        <div className="lg:border-r lg:border-line lg:pr-10">
          <FeaturedArticle article={lead} priority headingLevel="h2" />
        </div>
        <div className="flex flex-col lg:pl-10">
          <p className="kicker mb-5 border-t border-ink pt-3 text-ink-subtle lg:border-t-0 lg:pt-0">Top stories</p>
          {first ? <ArticleCard article={first} size="sm" showExcerpt={false} priority sizes="(min-width: 1024px) 30vw, 100vw" /> : null}
          <div className="mt-6 divide-y divide-line border-t border-line">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" size="sm" showExcerpt={false} showAuthor={false} className="py-5 !grid-cols-[96px_1fr] sm:!grid-cols-[120px_1fr]" sizes="120px" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
