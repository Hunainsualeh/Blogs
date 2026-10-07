import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllArticles, getAllCategories } from "@/lib/blog";
import { articleHref, categoryHref } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  return [
    { url: base, changeFrequency: "hourly", priority: 1 },
    ...getAllCategories().map((category) => ({ url: `${base}${categoryHref(category.slug)}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...getAllArticles().map((article) => ({ url: `${base}${articleHref(article.slug)}`, lastModified: article.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
