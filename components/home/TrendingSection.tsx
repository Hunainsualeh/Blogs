import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref } from "@/lib/routes";
import { padRank } from "@/lib/utils";
import { TrendingIcon } from "@/components/ui/Icons";

export function TrendingSection({ articles }: { articles: ArticleWithRelations[] }) {
  return (
    <section aria-labelledby="trending-heading" className="container-site mt-14">
      <div className="border-y border-ink py-6">
        <h2 id="trending-heading" className="kicker mb-5 flex items-center gap-2 text-brand">
          <TrendingIcon size={15} /> Trending now
        </h2>
        <ol className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
          {articles.map((article, index) => (
            <li key={article.id} className="group relative flex gap-3 lg:flex-col lg:gap-2">
              <span className="font-mono text-[22px] font-medium leading-none tracking-tight text-line-strong transition-colors group-hover:text-brand lg:text-[28px]">{padRank(index)}</span>
              <div>
                <p className="kicker mb-1 text-ink-subtle">{article.categoryInfo.name}</p>
                <Link href={articleHref(article.slug)} className="text-[15.5px] font-semibold leading-snug tracking-tight text-ink after:absolute after:inset-0">
                  <span className="link-underline">{article.title}</span>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
