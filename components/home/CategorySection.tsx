import type { ArticleWithRelations } from "@/types/article";
import type { Category } from "@/types/category";
import { categoryHref } from "@/lib/routes";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CompactArticle } from "@/components/blog/CompactArticle";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type CategorySectionLayout = "lead-left" | "columns" | "split" | "overlay" | "mosaic";

type CategorySectionProps = {
  category: Category;
  articles: ArticleWithRelations[];
  layout: CategorySectionLayout;
};

export function CategorySection({ category, articles, layout }: CategorySectionProps) {
  if (articles.length === 0) return null;
  const [lead, ...rest] = articles;

  return (
    <section aria-label={category.name} className="container-site mt-20">
      <SectionHeading title={category.name} eyebrow={category.tagline} href={categoryHref(category.slug)} linkLabel={`View all ${category.name}`} />

      {layout === "lead-left" ? (
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <ArticleCard article={lead} size="lg" sizes="(min-width: 1024px) 55vw, 100vw" headingLevel="h3" />
          <div className="divide-y divide-line border-t border-line lg:border-t-0">
            {rest.slice(0, 4).map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" size="sm" showExcerpt={false} showCategory={false} className="py-5 lg:first:pt-0 !grid-cols-[100px_1fr] sm:!grid-cols-[140px_1fr]" sizes="140px" />
            ))}
          </div>
        </div>
      ) : null}

      {layout === "columns" ? (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {articles.slice(0, 4).map((article) => (
            <ArticleCard key={article.id} article={article} size="sm" showCategory={false} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          ))}
        </div>
      ) : null}

      {layout === "split" ? (
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
          <div className="order-2 divide-y divide-line border-y border-line lg:order-1">
            {rest.slice(0, 4).map((article) => (
              <CompactArticle key={article.id} article={article} showCategory={false} size="md" className="py-5" />
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <ArticleCard article={lead} size="lg" sizes="(min-width: 1024px) 55vw, 100vw" showCategory={false} />
          </div>
        </div>
      ) : null}

      {layout === "overlay" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} variant="overlay" size="md" showCategory={false} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          ))}
        </div>
      ) : null}

      {layout === "mosaic" ? (
        <div className="space-y-10">
          <FeaturedArticle article={lead} layout="split" headingLevel="h3" />
          <div className="grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 3).map((article) => (
              <CompactArticle key={article.id} article={article} showCategory={false} size="md" />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
