import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllArticles, getAllCategories, getCategoryCounts } from "@/lib/blog";
import { ARTICLES_PER_PAGE } from "@/lib/constants";
import { articleHref, categoryHref } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const [articles, categories, counts] = await Promise.all([getAllArticles(), getAllCategories(), getCategoryCounts()]);
  const newest = articles[0]?.updatedAt;
  const categoryPages = categories.flatMap((category) => {
    const pages = Math.max(1, Math.ceil((counts[category.slug] ?? 0) / ARTICLES_PER_PAGE));
    return Array.from({ length: pages }, (_, index) => ({
      url: `${base}${categoryHref(category.slug, index + 1)}`,
      changeFrequency: "daily" as const,
      priority: index === 0 ? 0.8 : 0.5,
    }));
  });
  return [
    { url: base, lastModified: newest, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/latest`, lastModified: newest, changeFrequency: "hourly", priority: 0.7 },
    { url: `${base}/categories`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/write-for-us`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    ...categoryPages,
    ...articles.filter((article) => !article.noIndex).map((article) => ({ url: `${base}${articleHref(article.slug)}`, lastModified: article.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
