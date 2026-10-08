import "server-only";
import type { Article } from "@/types/article";
import { loadAllArticles, loadAuthors, loadCategories, loadSettings, loadSubmissions, loadViewCounts } from "./content-store";
import { isArticleVisible } from "./content-store";

export type AdminArticleRow = {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  authorName: string;
  status: "published" | "scheduled" | "draft";
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  popularRank: number | null;
  views: number;
  source: Article["source"];
  hidden: boolean;
};

export async function getAdminArticleRows(): Promise<AdminArticleRow[]> {
  const [articles, categories, authors, views, settings] = await Promise.all([loadAllArticles(), loadCategories(), loadAuthors(), loadViewCounts(), loadSettings()]);
  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  const authorNames = new Map(authors.map((author) => [author.id, author.name]));
  const now = Date.now();
  return articles.map((article) => {
    const scheduled = article.status === "published" && Date.parse(article.publishedAt) > now;
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      categoryName: categoryNames.get(article.category) ?? article.category,
      authorName: authorNames.get(article.authorId) ?? "Unknown",
      status: article.status !== "published" ? "draft" : scheduled ? "scheduled" : "published",
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      featured: article.featured,
      popularRank: article.popularRank ?? null,
      views: (views[article.id] ?? 0) + article.views,
      source: article.source,
      hidden: article.status === "published" && !scheduled && !isArticleVisible(article, settings, now),
    };
  });
}

export async function getAdminDashboard() {
  const [rows, submissions] = await Promise.all([getAdminArticleRows(), loadSubmissions()]);
  return {
    published: rows.filter((row) => row.status === "published" && !row.hidden).length,
    scheduled: rows.filter((row) => row.status === "scheduled").length,
    drafts: rows.filter((row) => row.status === "draft").length,
    samples: rows.filter((row) => row.source === "sample").length,
    pending: submissions.filter((item) => item.status === "submitted" || item.status === "under-review"),
    recent: rows.slice(0, 5),
  };
}
