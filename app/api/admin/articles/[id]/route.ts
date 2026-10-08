import { NextResponse } from "next/server";
import { badRequest, guard, readJson, refreshContent } from "@/lib/admin-api";
import { parseArticleInput } from "@/lib/admin-articles";
import { loadAllArticles, loadAuthors, loadCategories, loadStoredArticles, patchSubmission, removeArticle, upsertArticle } from "@/lib/content-store";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/articles/[id]">) {
  const denied = await guard(request);
  if (denied) return denied;
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return badRequest("The article could not be read.");
  const [categories, authors, all] = await Promise.all([loadCategories(), loadAuthors(), loadAllArticles()]);
  const existing = all.find((article) => article.id === id);
  if (!existing) return NextResponse.json({ ok: false, error: "Article not found." }, { status: 404 });
  const result = parseArticleInput(body, { existing, categories, authors, takenSlugs: new Set(all.map((article) => article.slug)) });
  if (!result.ok) return badRequest("Please fix the highlighted fields.", result.errors);
  await upsertArticle(result.article);
  if (result.article.submissionId && result.article.status === "published") {
    await patchSubmission(result.article.submissionId, { status: "published" });
  }
  refreshContent();
  return NextResponse.json({ ok: true, article: { id: result.article.id, slug: result.article.slug, status: result.article.status } });
}

export async function DELETE(request: Request, { params }: RouteContext<"/api/admin/articles/[id]">) {
  const denied = await guard(request);
  if (denied) return denied;
  const { id } = await params;
  const stored = await loadStoredArticles();
  const target = stored.find((article) => article.id === id);
  if (!target) {
    return badRequest("Sample articles cannot be deleted. Unpublish them or hide all sample content in Settings.");
  }
  await removeArticle(id);
  refreshContent();
  return NextResponse.json({ ok: true });
}
