import { requireAdminPage } from "@/lib/admin-auth";
import { getAdminArticleRows } from "@/lib/admin-data";
import { ArticleTable } from "@/components/admin/ArticleTable";
import { Button } from "@/components/ui/Button";

export default async function AdminArticlesPage() {
  await requireAdminPage();
  const rows = await getAdminArticleRows();
  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">Articles</h1>
        <Button href="/admin/articles/new" size="sm">New article</Button>
      </div>
      <ArticleTable rows={rows} />
    </div>
  );
}
