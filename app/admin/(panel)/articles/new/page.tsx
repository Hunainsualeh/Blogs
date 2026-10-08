import { requireAdminPage } from "@/lib/admin-auth";
import { loadAuthors, loadCategories } from "@/lib/content-store";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export default async function NewArticlePage() {
  await requireAdminPage();
  const [categories, authors] = await Promise.all([loadCategories(), loadAuthors()]);
  return <ArticleEditor article={null} categories={categories} authors={authors} />;
}
