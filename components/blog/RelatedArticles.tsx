import type { ArticleWithRelations } from "@/types/article";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleGrid } from "./ArticleGrid";

export function RelatedArticles({ articles, title = "Related articles", columns = 3 }: { articles: ArticleWithRelations[]; title?: string; columns?: 2 | 3 }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <SectionHeading title={title} id="related-heading" className="mb-6" />
      <ArticleGrid articles={articles} columns={columns} showExcerpt={false} />
    </section>
  );
}
