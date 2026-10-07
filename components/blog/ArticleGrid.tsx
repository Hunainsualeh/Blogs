import type { ArticleWithRelations } from "@/types/article";
import { cn } from "@/lib/utils";
import { ArticleCard, type ArticleCardVariant } from "./ArticleCard";

type ArticleGridProps = {
  articles: ArticleWithRelations[];
  variant?: ArticleCardVariant;
  columns?: 1 | 2 | 3 | 4;
  showExcerpt?: boolean;
  className?: string;
};

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function ArticleGrid({ articles, variant = "stacked", columns = 3, showExcerpt = true, className }: ArticleGridProps) {
  if (variant === "horizontal") {
    return (
      <div className={cn("divide-y divide-line border-y border-line", className)}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="horizontal" showExcerpt={showExcerpt} className="py-6" />
        ))}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-x-8 gap-y-12", columnClasses[columns], className)}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant={variant} showExcerpt={showExcerpt} />
      ))}
    </div>
  );
}
