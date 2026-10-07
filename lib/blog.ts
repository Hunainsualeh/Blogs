import type { Article, ArticleWithRelations, TocItem } from "@/types/article";
import type { Category } from "@/types/category";
import type { Author } from "@/types/user";
import { articles } from "@/data/articles";
import { authors } from "@/data/authors";
import { categories } from "@/data/categories";
import { getCategoryBySlug } from "@/data/category-lookup";
import { buildTableOfContents } from "./toc";


export const ARTICLES_PER_PAGE = 6;

const authorMap = new Map<string, Author>(authors.map((author) => [author.id, author]));
const articleMap = new Map<string, Article>(articles.map((article) => [article.slug, article]));

function withRelations(article: Article): ArticleWithRelations {
  return {
    ...article,
    author: getAuthor(article.authorId),
    categoryInfo: getCategoryBySlug(article.category),
  };
}

export function getAuthor(id: string): Author {
  const author = authorMap.get(id);
  if (!author) {
    throw new Error(`Unknown author ${id}`);
  }
  return author;
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string) {
  return getCategoryBySlug(slug);
}

export function getAllArticles(): ArticleWithRelations[] {
  return articles.map(withRelations);
}

export function getAllSlugs() {
  return articles.map((article) => article.slug);
}

export function getArticleBySlug(slug: string): ArticleWithRelations | undefined {
  const article = articleMap.get(slug);
  return article ? withRelations(article) : undefined;
}

export function getLatestArticles(limit = 10, exclude: string[] = []) {
  return articles
    .filter((article) => !exclude.includes(article.slug))
    .slice(0, limit)
    .map(withRelations);
}

export function getFeaturedArticles(limit = 5) {
  return articles.filter((article) => article.featured).slice(0, limit).map(withRelations);
}

export function getTrendingArticles(limit = 5) {
  return articles
    .filter((article) => article.trending)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map(withRelations);
}

export function getEditorsPicks(limit = 5) {
  return articles.filter((article) => article.editorsPick).slice(0, limit).map(withRelations);
}

export function getPopularArticles(limit = 6) {
  return [...articles].sort((a, b) => b.views - a.views).slice(0, limit).map(withRelations);
}

export function getArticlesByCategory(slug: string) {
  return articles.filter((article) => article.category === slug).map(withRelations);
}

export function getCategoryFeed(slug: string, page: number) {
  const all = getArticlesByCategory(slug);
  const lead = all.find((article) => article.featured) ?? all[0];
  const rest = all.filter((article) => article.slug !== lead?.slug);
  const totalPages = Math.max(1, Math.ceil(rest.length / ARTICLES_PER_PAGE));
  const start = (page - 1) * ARTICLES_PER_PAGE;
  return {
    lead,
    items: rest.slice(start, start + ARTICLES_PER_PAGE),
    total: all.length,
    totalPages,
    page,
  };
}

export function getCategoryPageCount(slug: string) {
  return getCategoryFeed(slug, 1).totalPages;
}

export function getRelatedArticles(article: Article, limit = 3) {
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
    .map(({ candidate }) => withRelations(candidate));
}

export function getAdjacentArticles(article: Article) {
  const inCategory = articles.filter((candidate) => candidate.category === article.category);
  const index = inCategory.findIndex((candidate) => candidate.slug === article.slug);
  const newer = index > 0 ? inCategory[index - 1] : undefined;
  const older = index < inCategory.length - 1 ? inCategory[index + 1] : undefined;
  return {
    previous: older ? withRelations(older) : undefined,
    next: newer ? withRelations(newer) : undefined,
  };
}

export function getPopularTopics(limit = 12) {
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

export function searchArticles(query: string, limit?: number) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return [];
  }
  const scored = articles
    .map((article) => {
      const author = getAuthor(article.authorId);
      const category = getCategoryBySlug(article.category);
      const fields = {
        title: normalize(article.title),
        excerpt: normalize(article.excerpt),
        category: normalize(`${category.name} ${category.slug}`),
        tags: normalize(article.tags.join(" ")),
        author: normalize(author.name),
      };
      let score = 0;
      for (const term of terms) {
        let matched = false;
        if (fields.title.includes(term)) { score += 6; matched = true; }
        if (fields.tags.includes(term)) { score += 4; matched = true; }
        if (fields.category.includes(term)) { score += 3; matched = true; }
        if (fields.author.includes(term)) { score += 3; matched = true; }
        if (fields.excerpt.includes(term)) { score += 2; matched = true; }
        if (!matched) {
          return { article, score: 0 };
        }
      }
      return { article, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.article.views - a.article.views)
    .map(({ article }) => withRelations(article));
  return typeof limit === "number" ? scored.slice(0, limit) : scored;
}

export function getTableOfContents(article: Pick<Article, "content">): TocItem[] {
  return buildTableOfContents(article.content);
}
