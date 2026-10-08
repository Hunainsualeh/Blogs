import type { ArticleWithRelations } from "@/types/article";
import { cn } from "@/lib/utils";
import { ArticleCard } from "./ArticleCard";

type ArticleGridProps = {
  articles: ArticleWithRelations[];
  columns?: 2 | 3 | 4;
  showExcerpt?: boolean;
  className?: string;
};

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function ArticleGrid({ articles, columns = 3, showExcerpt = true, className }: ArticleGridProps) {
  return (
    <div className={cn("grid gap-x-5 gap-y-8", columnClasses[columns], className)}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} showExcerpt={showExcerpt} size="sm" sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw" />
      ))}
    </div>
  );
}
