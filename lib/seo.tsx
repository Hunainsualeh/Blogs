import type { Metadata } from "next";
import type { ArticleWithRelations } from "@/types/article";
import type { Category } from "@/types/category";
import { siteConfig } from "@/config/site";
import { articleHref, categoryHref } from "./routes";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const images = image ? [{ url: image, width: 1600, height: 900, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteConfig.twitterHandle,
      ...(image ? { images: [image] } : {}),
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

export function articleImageUrl(src: string, width = 1600) {
  return src.startsWith("https://images.unsplash.com/") ? `${src}?auto=format&fit=crop&w=${width}&q=80` : src;
}

export function articleMetadata(article: ArticleWithRelations): Metadata {
  const base = buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: articleHref(article.slug),
    image: articleImageUrl(article.featuredImage.src, 1200),
    type: "article",
  });
  return {
    ...base,
    authors: [{ name: article.author.name }],
    keywords: article.tags,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      section: article.categoryInfo.name,
      tags: article.tags,
    },
  };
}

export function articleJsonLd(article: ArticleWithRelations) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [articleImageUrl(article.featuredImage.src, 1600)],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    articleSection: article.categoryInfo.name,
    keywords: article.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(articleHref(article.slug)) },
    author: [{ "@type": "Person", name: article.author.name, jobTitle: article.author.role }],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function categoryJsonLd(category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} | ${siteConfig.name}`,
    description: category.description,
    url: absoluteUrl(categoryHref(category.slug)),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
