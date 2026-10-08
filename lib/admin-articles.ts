import "server-only";
import type { Article, ArticleStatus } from "@/types/article";
import type { Category } from "@/types/category";
import type { Author } from "@/types/user";
import { cleanImage, cleanLine, cleanText, sanitizeBlocks, sanitizeTags } from "./sanitize";
import { createId, readingTime, slugify } from "./utils";

export type ArticleInputResult = { ok: true; article: Article } | { ok: false; errors: Record<string, string> };

function uniqueSlug(base: string, taken: Set<string>) {
  let candidate = base || "article";
  let counter = 2;
  while (taken.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export function parseArticleInput(
  raw: Record<string, unknown>,
  context: { existing?: Article; categories: Category[]; authors: Author[]; takenSlugs: Set<string>; source?: Article["source"] },
): ArticleInputResult {
  const errors: Record<string, string> = {};
  const { existing, categories, authors } = context;
  const pick = <T,>(key: string, fallback: T) => (key in raw ? raw[key] : fallback);

  const title = cleanLine(pick("title", existing?.title), 200);
  if (title.length < 5) errors.title = "Add a title of at least 5 characters.";

  const excerpt = cleanLine(pick("excerpt", existing?.excerpt), 400);
  if (!excerpt) errors.excerpt = "Add a short description.";

  const category = cleanLine(pick("category", existing?.category), 80);
  if (!categories.some((item) => item.slug === category)) errors.category = "Choose a category.";

  const authorId = cleanLine(pick("authorId", existing?.authorId), 80);
  if (!authors.some((item) => item.id === authorId)) errors.authorId = "Choose an author.";

  const requestedStatus = pick<unknown>("status", existing?.status ?? "draft");
  const status: ArticleStatus = requestedStatus === "published" ? "published" : "draft";

  const featuredImage = "featuredImage" in raw ? cleanImage(raw.featuredImage, { allowExternalImages: true }) : (existing?.featuredImage ?? null);
  const content = "content" in raw ? sanitizeBlocks(raw.content, { allowExternalImages: true }) : (existing?.content ?? []);

  if (status === "published") {
    if (!featuredImage?.src) errors.featuredImage = "Add a featured image before publishing.";
    else if (!featuredImage.alt.trim()) errors.featuredImage = "Add alt text to the featured image before publishing.";
    if (!content.some((block) => block.type === "paragraph" && block.content.trim())) errors.content = "Add some content before publishing.";
  }

  const slugSource = cleanLine(pick("slug", existing?.slug ?? ""), 120);
  const baseSlug = slugify(slugSource || title);
  const taken = new Set(context.takenSlugs);
  if (existing) taken.delete(existing.slug);
  if (slugSource && taken.has(baseSlug)) errors.slug = "That URL is already used by another article.";
  const slug = existing && !slugSource ? existing.slug : uniqueSlug(baseSlug, taken);

  const now = new Date().toISOString();
  const rawPublishedAt = cleanLine(pick("publishedAt", existing?.publishedAt ?? ""), 40);
  let publishedAt = existing?.publishedAt ?? now;
  if (rawPublishedAt) {
    const parsed = Date.parse(rawPublishedAt);
    if (Number.isNaN(parsed)) errors.publishedAt = "Enter a valid publish date.";
    else publishedAt = new Date(parsed).toISOString();
  } else if (status === "published") {
    publishedAt = existing?.status === "published" ? existing.publishedAt : now;
  }

  const rank = pick<unknown>("popularRank", existing?.popularRank);
  const popularRank = rank === null || rank === "" || rank === undefined ? undefined : Math.max(1, Math.min(999, Math.round(Number(rank)) || 0)) || undefined;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const article: Article = {
    id: existing?.id ?? createId("art"),
    slug,
    title,
    excerpt,
    content,
    category,
    tags: sanitizeTags(pick("tags", existing?.tags ?? [])),
    authorId,
    status,
    createdAt: existing?.createdAt ?? now,
    publishedAt,
    updatedAt: now,
    readingTime: readingTime(content),
    featuredImage: featuredImage ?? { src: "", alt: "" },
    featured: Boolean(pick("featured", existing?.featured ?? false)),
    trending: existing?.trending ?? false,
    editorsPick: Boolean(pick("editorsPick", existing?.editorsPick ?? false)),
    popularRank,
    views: existing?.views ?? 0,
    seoTitle: cleanLine(pick("seoTitle", existing?.seoTitle ?? ""), 90) || undefined,
    seoDescription: cleanText(pick("seoDescription", existing?.seoDescription ?? ""), 200).replace(/\s+/g, " ") || undefined,
    noIndex: Boolean(pick("noIndex", existing?.noIndex ?? false)),
    source: existing ? (existing.source === "sample" ? "admin" : existing.source) : (context.source ?? "admin"),
    submissionId: existing?.submissionId,
  };
  return { ok: true, article };
}
