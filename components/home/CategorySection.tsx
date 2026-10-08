import type { ArticleWithRelations } from "@/types/article";
import type { Category } from "@/types/category";
import { categoryHref } from "@/lib/routes";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CategorySection({ category, articles }: { category: Category; articles: ArticleWithRelations[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby={`cat-${category.slug}`} className="container-site">
      <SectionHeading title={category.name} id={`cat-${category.slug}`} eyebrow={category.tagline} href={categoryHref(category.slug)} linkLabel={`More in ${category.name}`} className="mb-6" />
      <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} size="sm" showExcerpt={false} showCategory={false} showAuthor={false} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        ))}
      </div>
    </section>
  );
}
