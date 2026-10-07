import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacentArticles, getAllSlugs, getArticleBySlug, getRelatedArticles, getTableOfContents } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { absoluteUrl, articleJsonLd, articleMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { articleHref } from "@/lib/routes";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleNavigation } from "@/components/blog/ArticleNavigation";
import { AuthorInfo } from "@/components/blog/AuthorInfo";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ShareActions } from "@/components/blog/ShareActions";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Newsletter } from "@/components/home/Newsletter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { searchHref } from "@/lib/routes";
import Link from "next/link";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return articleMetadata(article);
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const toc = getTableOfContents(article);
  const related = getRelatedArticles(article, 3);
  const { previous, next } = getAdjacentArticles(article);
  const url = absoluteUrl(articleHref(article.slug));

  return (
    <article className="pt-8 sm:pt-12">
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: article.categoryInfo.name, path: categoryHref(article.category) },
          { name: article.title, path: articleHref(article.slug) },
        ])}
      />
      <div className="container-site">
        <ArticleHeader
          title={article.title}
          excerpt={article.excerpt}
          category={article.categoryInfo}
          author={article.author}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
          readingTime={article.readingTime}
          image={article.featuredImage}
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: article.categoryInfo.name, href: categoryHref(article.category) },
                { label: article.title },
              ]}
            />
          }
          actions={<ShareActions url={url} title={article.title} />}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_220px] lg:gap-8 xl:grid-cols-[240px_minmax(0,1fr)_240px]">
          <aside className="hidden lg:block">
            <TableOfContents items={toc} className="sticky top-[calc(var(--header-height,120px)+24px)]" />
          </aside>
          <div className="min-w-0">
            <details className="mb-8 rounded-md border border-line px-5 py-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold text-ink">In this article</summary>
              <TableOfContents items={toc} className="mt-4" />
            </details>
            <ArticleBody blocks={article.content} />
            <div className="mx-auto mt-12 max-w-[var(--theme-reading-width)] space-y-10">
              <div className="flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link key={tag} href={searchHref(tag)}>
                      <Badge tone="neutral" className="hover:bg-brand-soft hover:text-brand">{tag}</Badge>
                    </Link>
                  ))}
                </div>
                <ShareActions url={url} title={article.title} />
              </div>
              <AuthorInfo author={article.author} />
              <ArticleNavigation previous={previous} next={next} />
            </div>
          </div>
          <div className="hidden lg:block" aria-hidden />
        </div>
      </div>

      <div className="container-site mt-20">
        <RelatedArticles articles={related} />
      </div>
      <div className="container-site mt-20">
        <Newsletter title="Enjoyed this story?" description="Get our best reporting and guides in your inbox every weekday. No noise, just the stories worth your time." />
      </div>
    </article>
  );
}
