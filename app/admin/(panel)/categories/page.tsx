import { requireAdminPage } from "@/lib/admin-auth";
import { loadAllArticles, loadCategories } from "@/lib/content-store";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  await requireAdminPage();
  const [categories, articles] = await Promise.all([loadCategories(), loadAllArticles()]);
  const counts: Record<string, number> = {};
  for (const article of articles) counts[article.category] = (counts[article.category] ?? 0) + 1;
  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">Categories</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">Categories appear in the menus, the sidebar and on the homepage. A category that still contains articles cannot be removed or have its URL changed.</p>
      <CategoryManager categories={categories} counts={counts} />
    </div>
  );
}
