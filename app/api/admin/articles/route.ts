import { NextResponse } from "next/server";
import { badRequest, guard, readJson, refreshContent } from "@/lib/admin-api";
import { parseArticleInput } from "@/lib/admin-articles";
import { loadAllArticles, loadAuthors, loadCategories, upsertArticle } from "@/lib/content-store";

export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  const body = await readJson(request);
  if (!body) return badRequest("The article could not be read.");
  const [categories, authors, all] = await Promise.all([loadCategories(), loadAuthors(), loadAllArticles()]);
  const result = parseArticleInput(body, { categories, authors, takenSlugs: new Set(all.map((article) => article.slug)) });
  if (!result.ok) return badRequest("Please fix the highlighted fields.", result.errors);
  await upsertArticle(result.article);
  refreshContent();
  return NextResponse.json({ ok: true, article: { id: result.article.id, slug: result.article.slug, status: result.article.status } }, { status: 201 });
}
