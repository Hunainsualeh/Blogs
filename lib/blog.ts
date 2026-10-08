import { cacheLife, cacheTag } from "next/cache";
import type { ArticleFull, ArticleWithRelations, TocItem } from "@/types/article";
import type { Category } from "@/types/category";
import type { SiteSettings } from "@/types/settings";
import { ARTICLES_PER_PAGE } from "./constants";
import { attachRelations, isArticleVisible, loadAllArticles, loadAuthors, loadCategories, loadSettings, loadViewCounts } from "./content-store";
import { buildTableOfContents } from "./toc";

export { ARTICLES_PER_PAGE };

type Snapshot = {
  settings: SiteSettings;
  categories: Category[];
  articles: ArticleWithRelations[];
  counts: Record<string, number>;
};

async function getSnapshot(): Promise<Snapshot> {
  "use cache";
  cacheTag("content");
  cacheLife({ stale: 30, revalidate: 60, expire: 3600 });

  const [settings, categories, authors, all, views] = await Promise.all([loadSettings(), loadCategories(), loadAuthors(), loadAllArticles(), loadViewCounts()]);
  const authorMap = new Map(authors.map((author) => [author.id, author]));
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const now = Date.now();
  const articles: ArticleWithRelations[] = [];
  const counts: Record<string, number> = {};
  for (const article of all) {
    if (!isArticleVisible(article, settings, now)) continue;
    const related = attachRelations(article, authorMap, categoryMap, views);
    if (!related) continue;
    const { content, ...summary } = related as typeof related & { content?: unknown };
    void content;
    articles.push(summary);
    counts[article.category] = (counts[article.category] ?? 0) + 1;
  }
  return { settings, categories, articles, counts };
}

export async function getSettings() {
  return (await getSnapshot()).settings;
}

export async function getAllCategories() {
  return (await getSnapshot()).categories;
}

export async function getNavCategories() {
  return (await getSnapshot()).categories.filter((category) => category.showInNav);
}

export async function getHomeCategories() {
  const { categories, counts } = await getSnapshot();
  return categories.filter((category) => category.showOnHome && (counts[category.slug] ?? 0) > 0);
}

export async function getCategory(slug: string) {
  return (await getSnapshot()).categories.find((category) => category.slug === slug);
}

export async function getCategoryCounts() {
  return (await getSnapshot()).counts;
}

export async function getAllArticles() {
  return (await getSnapshot()).articles;
}

export async function getAllSlugs() {
  return (await getSnapshot()).articles.map((article) => article.slug);
}

export async function getArticleBySlug(slug: string): Promise<ArticleFull | undefined> {
  "use cache";
  cacheTag("content");
  cacheLife({ stale: 30, revalidate: 60, expire: 3600 });

  const [settings, categories, authors, all, views] = await Promise.all([loadSettings(), loadCategories(), loadAuthors(), loadAllArticles(), loadViewCounts()]);
  const article = all.find((item) => item.slug === slug);
  if (!article || !isArticleVisible(article, settings)) return undefined;
  const related = attachRelations(
    article,
    new Map(authors.map((author) => [author.id, author])),
    new Map(categories.map((category) => [category.slug, category])),
    views,
  );
  return related ? ({ ...related, content: article.content } as ArticleFull) : undefined;
}

export async function getLatestArticles(limit = 10, exclude: string[] = []) {
  const { articles } = await getSnapshot();
  return articles.filter((article) => !exclude.includes(article.slug)).slice(0, limit);
}

export async function getLatestPage(page: number, perPage = ARTICLES_PER_PAGE, exclude: string[] = []) {
  const articles = (await getSnapshot()).articles.filter((article) => !exclude.includes(article.slug));
  const totalPages = Math.max(1, Math.ceil(articles.length / perPage));
  return { items: articles.slice((page - 1) * perPage, page * perPage), total: articles.length, totalPages, page };
}

export async function getFeaturedArticles(limit = 5) {
  const { articles } = await getSnapshot();
  const featured = articles.filter((article) => article.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  const filler = articles.filter((article) => !article.featured);
  return [...featured, ...filler].slice(0, limit);
}

export async function getPopularArticles(limit = 6) {
  const { articles } = await getSnapshot();
  const ranked = articles.filter((article) => article.popularRank !== undefined).sort((a, b) => (a.popularRank ?? 0) - (b.popularRank ?? 0));
  const rest = articles
    .filter((article) => article.popularRank === undefined)
    .sort((a, b) => b.views - a.views || b.publishedAt.localeCompare(a.publishedAt));
  return [...ranked, ...rest].slice(0, limit);
}

export async function getArticlesByCategory(slug: string, limit?: number) {
  const { articles } = await getSnapshot();
  const list = articles.filter((article) => article.category === slug);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function getCategoryFeed(slug: string, page: number) {
  const items = await getArticlesByCategory(slug);
  const totalPages = Math.max(1, Math.ceil(items.length / ARTICLES_PER_PAGE));
  const start = (page - 1) * ARTICLES_PER_PAGE;
  return { items: items.slice(start, start + ARTICLES_PER_PAGE), total: items.length, totalPages, page };
}

export async function getCategoryPageCount(slug: string) {
  return (await getCategoryFeed(slug, 1)).totalPages;
}

export async function getRelatedArticles(article: Pick<ArticleWithRelations, "slug" | "category" | "tags">, limit = 3) {
  const { articles } = await getSnapshot();
  return articles
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => article.tags.includes(tag)).length;
      const score = (candidate.category === article.category ? 3 : 0) + sharedTags * 2;
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.publishedAt.localeCompare(a.candidate.publishedAt))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export async function getAdjacentArticles(article: Pick<ArticleWithRelations, "slug" | "category">) {
  const inCategory = await getArticlesByCategory(article.category);
  const index = inCategory.findIndex((candidate) => candidate.slug === article.slug);
  return {
    next: index > 0 ? inCategory[index - 1] : undefined,
    previous: index >= 0 && index < inCategory.length - 1 ? inCategory[index + 1] : undefined,
  };
}

export async function getPopularTopics(limit = 12) {
  const { articles } = await getSnapshot();
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

export async function searchArticles(query: string, limit?: number) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const { articles } = await getSnapshot();
  const scored = articles
    .map((article) => {
      const fields = {
        title: normalize(article.title),
        excerpt: normalize(article.excerpt),
        category: normalize(`${article.categoryInfo.name} ${article.categoryInfo.slug}`),
        tags: normalize(article.tags.join(" ")),
        author: normalize(article.author.name),
      };
      let score = 0;
      for (const term of terms) {
        let matched = false;
        if (fields.title.includes(term)) { score += 6; matched = true; }
        if (fields.tags.includes(term)) { score += 4; matched = true; }
        if (fields.category.includes(term)) { score += 3; matched = true; }
        if (fields.author.includes(term)) { score += 3; matched = true; }
        if (fields.excerpt.includes(term)) { score += 2; matched = true; }
        if (!matched) return { article, score: 0 };
      }
      return { article, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.article.publishedAt.localeCompare(a.article.publishedAt))
    .map(({ article }) => article);
  return typeof limit === "number" ? scored.slice(0, limit) : scored;
}

export function getTableOfContents(article: Pick<ArticleFull, "content">): TocItem[] {
  return buildTableOfContents(article.content);
}
