import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref } from "@/lib/routes";
import { cn, padRank } from "@/lib/utils";
import { ArticleMeta } from "./ArticleMeta";

type CompactArticleProps = {
  article: ArticleWithRelations;
  rank?: number;
  showCategory?: boolean;
  showMeta?: boolean;
  inverse?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function CompactArticle({ article, rank, showCategory = true, showMeta = true, inverse = false, size = "sm", className }: CompactArticleProps) {
  return (
    <article className={cn("group relative flex gap-4", className)}>
      {typeof rank === "number" ? (
        <span className={cn("font-mono text-[13px] font-medium leading-6 tabular-nums", inverse ? "text-white/60" : "text-accent")} aria-hidden>
          {padRank(rank)}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        {showCategory ? <p className={cn("kicker mb-1.5", inverse ? "text-white/60" : "text-ink-subtle")}>{article.categoryInfo.name}</p> : null}
        <h3 className={cn("font-semibold tracking-[-0.015em]", size === "md" ? "text-[19px] leading-snug" : "text-[16px] leading-snug", inverse ? "text-white" : "text-ink")}>
          <Link href={articleHref(article.slug)} className="after:absolute after:inset-0 focus:outline-none">
            <span className="link-underline">{article.title}</span>
          </Link>
        </h3>
        {showMeta ? <ArticleMeta publishedAt={article.publishedAt} readingTime={article.readingTime} inverse={inverse} className="mt-2" /> : null}
      </div>
    </article>
  );
}
