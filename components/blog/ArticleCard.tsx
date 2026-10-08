import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref, categoryHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/Badge";
import { ArticleImage } from "./ArticleImage";
import { ArticleMeta } from "./ArticleMeta";

export type ArticleCardVariant = "stacked" | "list" | "overlay" | "thumb";

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
  ratio?: "16/9" | "3/2" | "4/3" | "1/1" | "16/10" | "4/5";
  className?: string;
};

const titleSizes = {
  sm: "text-[15.5px] leading-snug",
  md: "text-[19px] leading-[1.3]",
  lg: "text-[24px] leading-[1.2] sm:text-[28px]",
};

export function ArticleCard({
  article,
  variant = "stacked",
  size = "md",
  showExcerpt = true,
  showCategory = true,
  showAuthor = false,
  priority = false,
  sizes,
  headingLevel: Heading = "h3",
  ratio,
  className,
}: ArticleCardProps) {
  const href = articleHref(article.slug);
  const author = showAuthor ? article.author.name : undefined;
  const title = (inverse: boolean) => (
    <Heading className={cn("font-semibold tracking-[-0.015em]", titleSizes[size], inverse ? "text-white" : "text-ink")}>
      <Link href={href} className="after:absolute after:inset-0 focus:outline-none">
        <span className="link-underline">{article.title}</span>
      </Link>
    </Heading>
  );

  if (variant === "overlay") {
    return (
      <article className={cn("group relative overflow-hidden rounded-sm bg-dark", className)}>
        <ArticleImage src={article.featuredImage.src} alt={article.featuredImage.alt} ratio={ratio ?? "4/5"} sizes={sizes ?? "(min-width: 1024px) 33vw, 100vw"} priority={priority} className="rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2.5 p-4 sm:p-5">
          {showCategory ? <CategoryLabel name={article.categoryInfo.name} href={categoryHref(article.category)} /> : null}
          {title(true)}
          <ArticleMeta authorName={author} publishedAt={article.publishedAt} inverse />
        </div>
      </article>
    );
  }

  if (variant === "thumb") {
    return (
      <article className={cn("group relative grid grid-cols-[104px_1fr] gap-4 sm:grid-cols-[110px_1fr]", className)}>
        <ArticleImage src={article.featuredImage.src} alt={article.featuredImage.alt} ratio="4/3" sizes="110px" priority={priority} />
        <div className="flex min-w-0 flex-col justify-center gap-1.5">
          <ArticleMeta publishedAt={article.publishedAt} authorName={author} />
          {title(false)}
        </div>
      </article>
    );
  }

  if (variant === "list") {
    return (
      <article className={cn("group relative grid gap-4 rounded-sm border border-line bg-white p-3.5 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:gap-5 sm:p-4", className)}>
        <ArticleImage src={article.featuredImage.src} alt={article.featuredImage.alt} ratio={ratio ?? "3/2"} sizes={sizes ?? "(min-width: 1024px) 300px, (min-width: 640px) 40vw, 100vw"} priority={priority} />
        <div className="flex min-w-0 flex-col gap-2.5">
          {showCategory ? <CategoryLabel name={article.categoryInfo.name} href={categoryHref(article.category)} /> : null}
          {title(false)}
          <ArticleMeta authorName={article.author.name} publishedAt={article.publishedAt} readingTime={article.readingTime} />
          {showExcerpt ? <p className="line-clamp-3 text-[14.5px] leading-relaxed text-ink-muted">{article.excerpt}</p> : null}
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group relative flex flex-col gap-3.5", className)}>
      <div className="relative">
        <ArticleImage src={article.featuredImage.src} alt={article.featuredImage.alt} ratio={ratio ?? "3/2"} sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"} priority={priority} />
        {showCategory ? <CategoryLabel name={article.categoryInfo.name} href={categoryHref(article.category)} className="absolute bottom-3 right-3" /> : null}
      </div>
      <div className="flex flex-col gap-2">
        <ArticleMeta authorName={author} publishedAt={article.publishedAt} />
        {title(false)}
        {showExcerpt ? <p className="line-clamp-3 text-[14.5px] leading-relaxed text-ink-muted">{article.excerpt}</p> : null}
      </div>
    </article>
  );
}
