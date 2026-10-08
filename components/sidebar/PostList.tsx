import Image from "next/image";
import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref } from "@/lib/routes";
import { cn, formatDate } from "@/lib/utils";

export function PostList({ articles, ranked = false }: { articles: ArticleWithRelations[]; ranked?: boolean }) {
  if (articles.length === 0) return <p className="text-sm text-ink-subtle">Articles will appear here soon.</p>;
  return (
    <ol className="divide-y divide-line">
      {articles.map((article, index) => (
        <li key={article.id} className="group relative flex gap-3.5 py-3.5 first:pt-0 last:pb-0">
          <span className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-sm bg-surface-muted">
            <Image src={article.featuredImage.src} alt="" fill sizes="68px" className="object-cover" />
            {ranked ? (
              <span className={cn("absolute left-0 top-0 flex h-5 w-5 items-center justify-center bg-brand font-mono text-[11px] font-medium text-white")} aria-hidden>
                {index + 1}
              </span>
            ) : null}
          </span>
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-ink">
              <Link href={articleHref(article.slug)} className="line-clamp-3 after:absolute after:inset-0 group-hover:text-brand">
                {article.title}
              </Link>
            </h3>
            <p className="mt-1 text-[12.5px] text-ink-subtle">
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
