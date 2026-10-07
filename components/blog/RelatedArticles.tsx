import type { ArticleWithRelations } from "@/types/article";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleGrid } from "./ArticleGrid";

export function RelatedArticles({ articles, title = "Related stories" }: { articles: ArticleWithRelations[]; title?: string }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <SectionHeading title={title} eyebrow="Keep reading" />
      <span id="related-heading" className="sr-only">{title}</span>
      <ArticleGrid articles={articles} columns={3} showExcerpt={false} />
    </section>
  );
}
