import Image from "next/image";
import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref } from "@/lib/routes";
import { formatDate } from "@/lib/utils";
import { ClockIcon } from "@/components/ui/Icons";

export function PostList({ articles, ranked = false }: { articles: ArticleWithRelations[]; ranked?: boolean }) {
  if (articles.length === 0) return <p className="text-sm text-ink-subtle">Articles will appear here soon.</p>;
  return (
    <ol className="space-y-4">
      {articles.map((article, index) => (
        <li key={article.id} className="group relative flex gap-3.5">
          <span className="relative h-[75px] w-[75px] shrink-0 overflow-visible">
            <span className="relative block h-full w-full overflow-hidden rounded-sm bg-surface-muted">
              <Image src={article.featuredImage.src} alt="" fill sizes="75px" className="object-cover" />
            </span>
            {ranked ? (
              <span className="absolute -left-2 -top-2 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-white" aria-hidden>
                {index + 1}
              </span>
            ) : null}
          </span>
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-semibold leading-snug text-ink">
              <Link href={articleHref(article.slug)} className="line-clamp-3 after:absolute after:inset-0 group-hover:text-brand">
                {article.title}
              </Link>
            </h3>
            <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-ink-subtle">
              <ClockIcon size={12} />
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, "long")}</time>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
