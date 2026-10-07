import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref, categoryHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/Badge";
import { ArticleImage } from "./ArticleImage";
import { ArticleMeta } from "./ArticleMeta";

type FeaturedArticleProps = {
  article: ArticleWithRelations;
  layout?: "stacked" | "split";
  priority?: boolean;
  headingLevel?: "h1" | "h2" | "h3";
  className?: string;
};

export function FeaturedArticle({ article, layout = "stacked", priority = false, headingLevel: Heading = "h2", className }: FeaturedArticleProps) {
  const href = articleHref(article.slug);
  return (
    <article className={cn("group relative", layout === "split" ? "grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-10 lg:items-center" : "flex flex-col gap-5", className)}>
      <ArticleImage
        src={article.featuredImage.src}
        alt={article.featuredImage.alt}
        ratio="16/10"
        sizes={layout === "split" ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 62vw, 100vw"}
        priority={priority}
      />
      <div className="flex flex-col gap-3.5">
        <CategoryLabel name={article.categoryInfo.name} href={categoryHref(article.category)} />
        <Heading className="text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[40px] lg:text-[46px]">
          <Link href={href} className="after:absolute after:inset-0 focus:outline-none">
            <span className="link-underline">{article.title}</span>
          </Link>
        </Heading>
        <p className="max-w-2xl font-serif text-[18px] leading-relaxed text-ink-muted sm:text-[20px]">{article.excerpt}</p>
        <ArticleMeta authorName={article.author.name} authorAvatar={article.author.avatar} publishedAt={article.publishedAt} readingTime={article.readingTime} size="md" className="pt-1" />
      </div>
    </article>
  );
}
