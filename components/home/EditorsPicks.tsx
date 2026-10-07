import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref, categoryHref } from "@/lib/routes";
import { ArticleImage } from "@/components/blog/ArticleImage";
import { ArticleMeta } from "@/components/blog/ArticleMeta";
import { CategoryLabel } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function EditorsPicks({ articles }: { articles: ArticleWithRelations[] }) {
  const [lead, ...rest] = articles;
  if (!lead) return null;
  return (
    <section aria-label="Editor's picks" className="mt-24 bg-brand py-16 text-white sm:py-20">
      <div className="container-site">
        <SectionHeading title="Editor's picks" eyebrow="Chosen by our editors" description="The stories our editors think are most worth your time this week." inverse />
        <div className="grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
          <article className="group relative">
            <ArticleImage src={lead.featuredImage.src} alt={lead.featuredImage.alt} ratio="16/10" sizes="(min-width: 1024px) 58vw, 100vw" />
            <div className="mt-6 flex flex-col gap-3">
              <CategoryLabel name={lead.categoryInfo.name} href={categoryHref(lead.category)} inverse />
              <h3 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[36px]">
                <Link href={articleHref(lead.slug)} className="after:absolute after:inset-0">
                  <span className="link-underline">{lead.title}</span>
                </Link>
              </h3>
              <p className="max-w-2xl font-serif text-[18px] leading-relaxed text-white/75">{lead.excerpt}</p>
              <ArticleMeta authorName={lead.author.name} publishedAt={lead.publishedAt} readingTime={lead.readingTime} inverse />
            </div>
          </article>
          <div className="divide-y divide-white/15 border-t border-white/15 lg:border-t-0">
            {rest.map((article, index) => (
              <article key={article.id} className="group relative grid grid-cols-[1fr_96px] gap-5 py-6 first:pt-6 lg:first:pt-0 sm:grid-cols-[1fr_140px]">
                <div>
                  <p className="kicker mb-2 text-white/55">
                    {String(index + 2).padStart(2, "0")} · {article.categoryInfo.name}
                  </p>
                  <h3 className="text-[18px] font-semibold leading-snug tracking-tight sm:text-[20px]">
                    <Link href={articleHref(article.slug)} className="after:absolute after:inset-0">
                      <span className="link-underline">{article.title}</span>
                    </Link>
                  </h3>
                  <ArticleMeta authorName={article.author.name} readingTime={article.readingTime} inverse className="mt-3" />
                </div>
                <ArticleImage src={article.featuredImage.src} alt={article.featuredImage.alt} ratio="1/1" sizes="140px" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
