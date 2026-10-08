import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { latestHref } from "@/lib/routes";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LatestSection({ articles, hasMore }: { articles: ArticleWithRelations[]; hasMore: boolean }) {
  const first = articles.slice(0, 3);
  const rest = articles.slice(3);
  return (
    <section aria-labelledby="latest-heading" className="min-w-0">
      <SectionHeading title="Latest Posts" id="latest-heading" href={latestHref()} linkLabel="All articles" />
      <div className="space-y-5">
        {first.map((article, index) => (
          <ArticleCard key={article.id} article={article} variant="list" size="md" priority={index === 0} />
        ))}
      </div>
      {rest.length > 0 ? (
        <>
          <AdSlot placement="home-in-latest" />
          <div className="space-y-5">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} variant="list" size="md" />
            ))}
          </div>
        </>
      ) : null}
      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <Link href={latestHref(2)} className="inline-flex h-11 items-center gap-2 rounded-sm bg-brand px-6 text-sm font-medium text-white hover:bg-brand-strong">
            Load More <ArrowRightIcon size={16} />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
