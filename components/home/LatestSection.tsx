import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { latestHref } from "@/lib/routes";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LatestSection({ articles, hasMore }: { articles: ArticleWithRelations[]; hasMore: boolean }) {
  const first = articles.slice(0, 4);
  const rest = articles.slice(4);
  return (
    <section aria-labelledby="latest-heading" className="min-w-0">
      <SectionHeading title="Latest Articles" id="latest-heading" href={latestHref()} linkLabel="All articles" className="mb-6" />
      <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2">
        {first.map((article) => (
          <ArticleCard key={article.id} article={article} size="md" showAuthor={false} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 100vw" />
        ))}
      </div>
      {rest.length > 0 ? (
        <>
          <AdSlot placement="home-in-latest" />
          <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} size="md" showAuthor={false} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 100vw" />
            ))}
          </div>
        </>
      ) : null}
      {hasMore ? (
        <div className="mt-10 flex justify-center border-t border-line pt-8">
          <Link href={latestHref(2)} className="inline-flex h-11 items-center gap-2 rounded-md border border-line-strong px-5 text-sm font-medium text-ink hover:border-ink">
            Older articles <ArrowRightIcon size={16} />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
