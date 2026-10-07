import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref } from "@/lib/routes";
import { cn, formatNumber, padRank } from "@/lib/utils";

export function PopularStories({ articles, title = "Most popular", className }: { articles: ArticleWithRelations[]; title?: string; className?: string }) {
  return (
    <section aria-labelledby="popular-heading" className={className}>
      <h2 id="popular-heading" className="border-t border-ink pt-3 text-[22px] font-semibold tracking-[-0.025em] text-ink">{title}</h2>
      <ol className="mt-2 divide-y divide-line">
        {articles.map((article, index) => (
          <li key={article.id} className="group relative flex gap-5 py-5">
            <span className={cn("w-10 shrink-0 font-mono text-[30px] font-medium leading-none tracking-tighter", index < 3 ? "text-brand" : "text-line-strong")}>{padRank(index)}</span>
            <div className="min-w-0">
              <Link href={articleHref(article.slug)} className="text-[16.5px] font-semibold leading-snug tracking-tight text-ink after:absolute after:inset-0">
                <span className="link-underline">{article.title}</span>
              </Link>
              <p className="mt-1.5 text-[12.5px] text-ink-subtle">
                {article.categoryInfo.name} · {formatNumber(article.views)} reads
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
