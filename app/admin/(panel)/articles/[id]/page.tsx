import { requireAdminPage } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import { loadAllArticles, loadAuthors, loadCategories } from "@/lib/content-store";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export default async function EditArticlePage({ params }: PageProps<"/admin/articles/[id]">) {
  await requireAdminPage();
  const { id } = await params;
  const [articles, categories, authors] = await Promise.all([loadAllArticles(), loadCategories(), loadAuthors()]);
  const article = articles.find((item) => item.id === id);
  if (!article) notFound();
  return <ArticleEditor key={article.updatedAt} article={article} categories={categories} authors={authors} />;
}
