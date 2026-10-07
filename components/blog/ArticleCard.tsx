import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref, categoryHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/Badge";
import { ArticleImage } from "./ArticleImage";
import { ArticleMeta } from "./ArticleMeta";

export type ArticleCardVariant = "stacked" | "horizontal" | "overlay";

type ArticleCardProps = {
  article: ArticleWithRelations;
  variant?: ArticleCardVariant;
  size?: "sm" | "md" | "lg";
  showExcerpt?: boolean;
  showCategory?: boolean;
  showAuthor?: boolean;
  priority?: boolean;
  sizes?: string;
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

const titleSizes = {
  sm: "text-[17px] leading-snug",
  md: "text-[20px] leading-[1.25]",
  lg: "text-[26px] leading-[1.15] sm:text-[30px]",
};

export function ArticleCard({
  article,
  variant = "stacked",
  size = "md",
  showExcerpt = true,
  showCategory = true,
  showAuthor = true,
  priority = false,
  sizes,
  headingLevel: Heading = "h3",
  className,
}: ArticleCardProps) {
  const href = articleHref(article.slug);
  const title = (
    <Heading className={cn("font-semibold tracking-[-0.02em]", titleSizes[size], variant === "overlay" ? "text-white" : "text-ink")}>
      <Link href={href} className="after:absolute after:inset-0 focus:outline-none">
        <span className="link-underline">{article.title}</span>
      </Link>
    </Heading>
  );

  if (variant === "overlay") {
    return (
      <article className={cn("group relative overflow-hidden rounded-sm", className)}>
        <ArticleImage src={article.featuredImage.src} alt={article.featuredImage.alt} ratio="4/5" sizes={sizes ?? "(min-width: 1024px) 33vw, 100vw"} priority={priority} className="rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001226]/90 via-[#001226]/30 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-6">
          {showCategory ? <CategoryLabel name={article.categoryInfo.name} href={categoryHref(article.category)} inverse /> : null}
          {title}
          <ArticleMeta authorName={showAuthor ? article.author.name : undefined} publishedAt={article.publishedAt} readingTime={article.readingTime} inverse />
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className={cn("group relative grid grid-cols-[112px_1fr] gap-4 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-6", className)}>
        <ArticleImage src={article.featuredImage.src} alt={article.featuredImage.alt} ratio="3/2" sizes={sizes ?? "(min-width: 640px) 240px, 112px"} priority={priority} />
        <div className="flex min-w-0 flex-col gap-2">
          {showCategory ? <CategoryLabel name={article.categoryInfo.name} href={categoryHref(article.category)} /> : null}
          {title}
          {showExcerpt ? <p className="hidden text-[15px] leading-relaxed text-ink-muted sm:line-clamp-2">{article.excerpt}</p> : null}
          <ArticleMeta authorName={showAuthor ? article.author.name : undefined} publishedAt={article.publishedAt} readingTime={article.readingTime} className="mt-auto pt-1" />
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group relative flex flex-col gap-4", className)}>
      <ArticleImage src={article.featuredImage.src} alt={article.featuredImage.alt} ratio={size === "lg" ? "16/10" : "3/2"} sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"} priority={priority} />
      <div className="flex flex-col gap-2.5">
        {showCategory ? <CategoryLabel name={article.categoryInfo.name} href={categoryHref(article.category)} /> : null}
        {title}
        {showExcerpt ? <p className={cn("leading-relaxed text-ink-muted line-clamp-3", size === "lg" ? "text-[17px]" : "text-[15px]")}>{article.excerpt}</p> : null}
        <ArticleMeta authorName={showAuthor ? article.author.name : undefined} publishedAt={article.publishedAt} readingTime={article.readingTime} />
      </div>
    </article>
  );
}
