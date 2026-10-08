import type { ArticleWithRelations } from "@/types/article";
import type { Category } from "@/types/category";
import { categoryHref } from "@/lib/routes";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CategorySection({ category, articles }: { category: Category; articles: ArticleWithRelations[] }) {
  if (articles.length === 0) return null;
  const [lead, ...rest] = articles;
  return (
    <section aria-labelledby={`cat-${category.slug}`}>
      <SectionHeading title={category.name} id={`cat-${category.slug}`} href={categoryHref(category.slug)} linkLabel="View all" />
      <div className="grid gap-6 md:grid-cols-2">
        <ArticleCard article={lead} variant="overlay" size="md" showCategory={false} ratio="4/5" sizes="(min-width: 1024px) 400px, (min-width: 768px) 45vw, 100vw" className="aspect-[16/10] md:aspect-auto md:[&>div:first-child]:!aspect-[4/5]" />
        <div className="space-y-5">
          {rest.slice(0, 4).map((article) => (
            <ArticleCard key={article.id} article={article} variant="thumb" size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
}
