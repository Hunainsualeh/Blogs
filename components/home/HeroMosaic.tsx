import type { ArticleWithRelations } from "@/types/article";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { cn } from "@/lib/utils";

const tileClasses = [
  "col-span-2 row-span-2 lg:col-span-2 lg:row-span-2",
  "col-span-2 lg:col-span-2",
  "col-span-1",
  "col-span-1",
];

export function HeroMosaic({ articles }: { articles: ArticleWithRelations[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="featured-heading" className="container-site pt-6">
      <h2 id="featured-heading" className="sr-only">Featured articles</h2>
      <div className="grid grid-cols-2 gap-1 sm:gap-1.5 lg:h-[480px] lg:grid-cols-4 lg:grid-rows-2">
        {articles.slice(0, 4).map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="overlay"
            size={index === 0 ? "lg" : index === 1 ? "md" : "sm"}
            ratio={index === 0 ? "16/10" : "3/2"}
            headingLevel="h3"
            priority={index < 2}
            sizes={index === 0 ? "(min-width: 1024px) 590px, 100vw" : "(min-width: 1024px) 295px, 50vw"}
            className={cn("h-full rounded-none [&_img]:object-cover [&>div:first-child]:!aspect-auto [&>div:first-child]:h-full", tileClasses[index], index === 0 ? "aspect-[16/10] lg:aspect-auto" : index === 1 ? "aspect-[16/9] lg:aspect-auto" : "aspect-square lg:aspect-auto", index > 1 && "[&_h3]:line-clamp-3 [&_h3]:text-[15px]")}
          />
        ))}
      </div>
    </section>
  );
}
