import type { Metadata } from "next";
import type { ArticleFull } from "@/types/article";
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
      ...(image ? { images: [image] } : {}),
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

export function collectionJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
  };
}

export function articleImageUrl(src: string, width = 1600) {
  if (src.startsWith("https://images.unsplash.com/")) return `${src}?auto=format&fit=crop&w=${width}&q=80`;
  return src.startsWith("/") ? absoluteUrl(src) : src;
}

export function articleMetadata(article: Omit<ArticleFull, "content">): Metadata {
  const base = buildMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: articleHref(article.slug),
    image: articleImageUrl(article.featuredImage.src, 1200),
    type: "article",
    noIndex: article.noIndex,
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

export function articleJsonLd(article: Omit<ArticleFull, "content">) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    image: [articleImageUrl(article.featuredImage.src, 1600)],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    articleSection: article.categoryInfo.name,
    keywords: article.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(articleHref(article.slug)) },
    author: [{ "@type": article.author.kind === "contributor" ? "Person" : "Organization", name: article.author.name }],
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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    description: siteConfig.description,
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
