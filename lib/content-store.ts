import "server-only";
import type { Article, ArticleFull, ArticleWithRelations } from "@/types/article";
import type { Category } from "@/types/category";
import type { SiteSettings } from "@/types/settings";
import type { Submission } from "@/types/submission";
import type { Author } from "@/types/user";
import { articles as sampleArticles } from "@/data/articles";
import { seedAuthors, editorialAuthor } from "@/data/authors";
import { defaultCategories } from "@/data/categories";
import { mergeSettings } from "./settings-defaults";
import { readCounters, readDoc, updateDoc } from "./storage";

const ARTICLES = "articles";
const AUTHORS = "authors";
const CATEGORIES = "categories";
const SUBMISSIONS = "submissions";
const SETTINGS = "settings";
export const VIEWS = "views";

export async function loadSettings(): Promise<SiteSettings> {
  return mergeSettings(await readDoc<Partial<SiteSettings> | null>(SETTINGS, null));
}

export async function saveSettings(next: SiteSettings) {
  await updateDoc<Partial<SiteSettings> | null>(SETTINGS, null, () => next);
  return next;
}

export async function loadCategories(): Promise<Category[]> {
  const stored = await readDoc<Category[] | null>(CATEGORIES, null);
  const list = stored && stored.length > 0 ? stored : defaultCategories;
  return [...list].sort((a, b) => a.order - b.order);
}

export async function saveCategories(next: Category[]) {
  await updateDoc<Category[] | null>(CATEGORIES, null, () => next);
}

export async function loadAuthors(): Promise<Author[]> {
  const stored = await readDoc<Author[]>(AUTHORS, []);
  return [...seedAuthors, ...stored];
}

export async function saveContributorAuthor(author: Author) {
  await updateDoc<Author[]>(AUTHORS, [], (current) => [...current.filter((item) => item.id !== author.id), author]);
}

export async function loadStoredArticles(): Promise<Article[]> {
  return readDoc<Article[]>(ARTICLES, []);
}

export async function loadAllArticles(): Promise<Article[]> {
  const stored = await loadStoredArticles();
  const storedIds = new Set(stored.map((article) => article.id));
  const samples = sampleArticles.filter((article) => !storedIds.has(article.id));
  return [...stored, ...samples].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function upsertArticle(article: Article) {
  await updateDoc<Article[]>(ARTICLES, [], (current) => {
    const exists = current.some((item) => item.id === article.id);
    return exists ? current.map((item) => (item.id === article.id ? article : item)) : [article, ...current];
  });
}

export async function removeArticle(id: string) {
  await updateDoc<Article[]>(ARTICLES, [], (current) => current.filter((item) => item.id !== id));
}

export async function loadSubmissions(): Promise<Submission[]> {
  const list = await readDoc<Submission[]>(SUBMISSIONS, []);
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addSubmission(submission: Submission) {
  await updateDoc<Submission[]>(SUBMISSIONS, [], (current) => [submission, ...current]);
}

export async function patchSubmission(id: string, patch: Partial<Submission>) {
  let updated: Submission | undefined;
  await updateDoc<Submission[]>(SUBMISSIONS, [], (current) =>
    current.map((item) => {
      if (item.id !== id) return item;
      updated = { ...item, ...patch, updatedAt: new Date().toISOString() };
      return updated;
    }),
  );
  return updated;
}

export async function loadViewCounts() {
  return readCounters(VIEWS);
}

export function isArticleVisible(article: Pick<Article, "status" | "publishedAt" | "source">, settings: SiteSettings, now = Date.now()) {
  if (article.status !== "published") return false;
  if (Date.parse(article.publishedAt) > now) return false;
  if (article.source === "sample" && !settings.showSampleContent) return false;
  return true;
}

export function attachRelations<T extends Article>(
  article: T,
  authors: Map<string, Author>,
  categories: Map<string, Category>,
  views: Record<string, number>,
): (Omit<T, "views"> & { views: number; author: Author; categoryInfo: Category }) | null {
  const categoryInfo = categories.get(article.category);
  if (!categoryInfo) return null;
  return {
    ...article,
    views: (views[article.id] ?? 0) + article.views,
    author: authors.get(article.authorId) ?? editorialAuthor,
    categoryInfo,
  };
}

export type { ArticleFull, ArticleWithRelations };
