import { NextResponse } from "next/server";
import type { Article } from "@/types/article";
import type { Author } from "@/types/user";
import { badRequest, guard, readJson, refreshContent } from "@/lib/admin-api";
import { parseArticleInput } from "@/lib/admin-articles";
import { loadAllArticles, loadAuthors, loadCategories, loadSubmissions, patchSubmission, saveContributorAuthor, upsertArticle } from "@/lib/content-store";
import { cleanText } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/submissions/[id]">) {
  const denied = await guard(request);
  if (denied) return denied;
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return badRequest("The request could not be read.");
  const submission = (await loadSubmissions()).find((item) => item.id === id);
  if (!submission) return NextResponse.json({ ok: false, error: "Submission not found." }, { status: 404 });
  const note = cleanText(body.note, 1000);

  if (body.action === "start-review") {
    await patchSubmission(id, { status: "under-review" });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "reject") {
    await patchSubmission(id, { status: "rejected", reviewNote: note });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "approve") {
    if (submission.articleId) return badRequest("This submission was already approved.");
    const [categories, authors, all] = await Promise.all([loadCategories(), loadAuthors(), loadAllArticles()]);
    const authorId = `a-contrib-${slugify(submission.author.name) || "writer"}-${id.slice(-4).toLowerCase()}`;
    const author: Author = {
      id: authorId,
      slug: authorId.replace(/^a-/, ""),
      name: submission.author.name,
      role: "Contributor",
      bio: submission.author.bio,
      kind: "contributor",
      profileUrl: submission.author.profileUrl || undefined,
    };
    const result = parseArticleInput(
      {
        title: submission.title,
        excerpt: submission.excerpt,
        category: submission.category,
        tags: submission.tags,
        featuredImage: submission.featuredImage,
        content: submission.content,
        authorId,
        status: "draft",
      },
      { categories, authors: [...authors, author], takenSlugs: new Set(all.map((article) => article.slug)), source: "submission" },
    );
    if (!result.ok) return badRequest("This submission needs changes before it can be approved.", result.errors);
    const article: Article = { ...result.article, submissionId: id };
    await saveContributorAuthor(author);
    await upsertArticle(article);
    await patchSubmission(id, { status: "approved", articleId: article.id, reviewNote: note });
    refreshContent();
    return NextResponse.json({ ok: true, articleId: article.id });
  }

  return badRequest("Unknown action.");
}
