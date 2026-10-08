import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref, categoryHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/Badge";
import { ArticleImage } from "./ArticleImage";
import { ArticleMeta } from "./ArticleMeta";

type FeaturedArticleProps = {
  article: ArticleWithRelations;
  priority?: boolean;
  headingLevel?: "h1" | "h2" | "h3";
  sizes?: string;
  className?: string;
};

export function FeaturedArticle({ article, priority = false, headingLevel: Heading = "h2", sizes = "(min-width: 1024px) 62vw, 100vw", className }: FeaturedArticleProps) {
  return (
    <article className={cn("group relative flex flex-col gap-4", className)}>
      <ArticleImage src={article.featuredImage.src} alt={article.featuredImage.alt} ratio="16/10" sizes={sizes} priority={priority} />
      <div className="flex flex-col gap-3">
        <CategoryLabel name={article.categoryInfo.name} href={categoryHref(article.category)} />
        <Heading className="text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[34px]">
          <Link href={articleHref(article.slug)} className="after:absolute after:inset-0 focus:outline-none">
            <span className="link-underline">{article.title}</span>
          </Link>
        </Heading>
        <p className="line-clamp-3 max-w-2xl font-serif text-[17px] leading-relaxed text-ink-muted">{article.excerpt}</p>
        <ArticleMeta authorName={article.author.name} publishedAt={article.publishedAt} readingTime={article.readingTime} />
      </div>
    </article>
  );
}
