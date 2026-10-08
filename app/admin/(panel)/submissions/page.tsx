import { requireAdminPage } from "@/lib/admin-auth";
import Link from "next/link";
import { STATUS_LABELS } from "@/lib/constants";
import { loadCategories, loadSubmissions } from "@/lib/content-store";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default async function SubmissionsPage() {
  await requireAdminPage();
  const [submissions, categories] = await Promise.all([loadSubmissions(), loadCategories()]);
  const names = new Map(categories.map((category) => [category.slug, category.name]));
  return (
    <div className="max-w-5xl">
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">Contributor submissions</h1>
      <p className="mt-2 text-sm text-ink-muted">Nothing here is public. Approving a submission creates a draft article that you edit and publish yourself.</p>
      <div className="mt-6 overflow-x-auto rounded-md border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-[13.5px]">
          <thead className="border-b border-line bg-surface-muted text-[12px] uppercase tracking-wide text-ink-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Contributor</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {submissions.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3"><Link href={`/admin/submissions/${item.id}`} className="font-medium text-ink hover:text-brand">{item.title}</Link><p className="font-mono text-[11px] text-ink-subtle">{item.id}</p></td>
                <td className="px-4 py-3 text-ink-muted">{item.author.name}</td>
                <td className="px-4 py-3 text-ink-muted">{names.get(item.category) ?? item.category}</td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-3"><Badge tone={item.status === "rejected" ? "danger" : item.status === "published" || item.status === "approved" ? "success" : "brand"}>{STATUS_LABELS[item.status]}</Badge></td>
              </tr>
            ))}
            {submissions.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-muted">No submissions yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
