import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAllSlugs, getArticleBySlug, getRelatedArticles, getSettings, getTableOfContents } from "@/lib/blog";
import { articleHref, categoryHref, searchHref } from "@/lib/routes";
import { absoluteUrl, articleJsonLd, articleMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { AuthorInfo } from "@/components/blog/AuthorInfo";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ShareActions } from "@/components/blog/ShareActions";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ViewTracker } from "@/components/blog/ViewTracker";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Badge } from "@/components/ui/Badge";
import { ArticleListSkeleton } from "@/components/ui/Skeleton";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found", robots: { index: false } };
  return articleMetadata(article);
}

export default function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="container-site pt-10"><ArticleListSkeleton count={3} /></div>}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, settings] = await Promise.all([getRelatedArticles(article, 3), getSettings()]);
  const toc = getTableOfContents(article);
  const url = absoluteUrl(articleHref(article.slug));

  return (
    <div className="container-site pt-6 sm:pt-8">
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: article.categoryInfo.name, path: categoryHref(article.category) },
          { name: article.title, path: articleHref(article.slug) },
        ])}
      />
      <ViewTracker slug={article.slug} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <article className="min-w-0">
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
                className="!mb-3"
              />
            }
            actions={<ShareActions url={url} title={article.title} />}
          />

          <AdSlot placement="article-top" />

          {toc.length >= 4 ? (
            <details className="mb-8 mt-8 rounded-md border border-line px-5 py-4">
              <summary className="cursor-pointer text-sm font-semibold text-ink">In this article</summary>
              <TableOfContents items={toc} className="mt-4" />
            </details>
          ) : null}

          <ArticleBody
            blocks={article.content}
            className="mt-8"
            ads={{ node: <AdSlot placement="article-in-content" />, afterParagraphs: settings.ads.inContentAfterParagraphs, max: settings.ads.inContentMax }}
          />

          <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link key={tag} href={searchHref(tag)}>
                  <Badge tone="neutral" className="hover:bg-brand-soft hover:text-brand">{tag}</Badge>
                </Link>
              ))}
            </div>
            <ShareActions url={url} title={article.title} />
          </div>

          <AuthorInfo author={article.author} className="mt-8" />

          <AdSlot placement="article-end" />

          <div className="mt-12">
            <RelatedArticles articles={related} columns={3} />
          </div>
        </article>

        <Sidebar variant="article" excludeSlug={article.slug} activeCategory={article.category} />
      </div>
    </div>
  );
}
