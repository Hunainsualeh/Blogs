"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { AdminArticleRow } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { adminRequest } from "./api";

type Filter = "all" | "published" | "scheduled" | "draft";

export function ArticleTable({ rows }: { rows: AdminArticleRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter((row) => (filter === "all" || row.status === filter) && (!term || row.title.toLowerCase().includes(term) || row.categoryName.toLowerCase().includes(term)));
  }, [rows, filter, query]);

  async function patch(row: AdminArticleRow, body: Record<string, unknown>) {
    setBusy(row.id);
    setMessage(null);
    const result = await adminRequest("PATCH", `/api/admin/articles/${row.id}`, body);
    setBusy(null);
    if (!result.ok) {
      setMessage(`${row.title}: ${result.errors ? Object.values(result.errors).join(" ") : (result.error ?? "Could not save.")}`);
      return;
    }
    router.refresh();
  }

  async function remove(row: AdminArticleRow) {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setBusy(row.id);
    const result = await adminRequest("DELETE", `/api/admin/articles/${row.id}`);
    setBusy(null);
    if (!result.ok) {
      setMessage(result.error ?? "Could not delete.");
      return;
    }
    router.refresh();
  }

  const tone = { published: "success", scheduled: "warning", draft: "neutral" } as const;
  const button = "rounded-sm border border-line-strong px-2 py-1 text-[12px] font-medium text-ink hover:border-ink disabled:opacity-50";

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="article-filter">Search articles</label>
        <input id="article-filter" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles" className="h-10 w-full max-w-xs rounded-md border border-line-strong bg-white px-3 text-sm" />
        <div className="flex gap-1" role="group" aria-label="Filter by status">
          {(["all", "published", "scheduled", "draft"] as const).map((value) => (
            <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`h-9 rounded-md px-3 text-[13px] font-medium capitalize ${filter === value ? "bg-brand text-white" : "bg-white text-ink-muted hover:text-ink"}`}>
              {value}
            </button>
          ))}
        </div>
        <span className="text-[13px] text-ink-subtle">{visible.length} of {rows.length}</span>
      </div>
      {message ? <p className="mt-4 rounded-md border border-danger/30 bg-[#FDF5F4] p-3 text-sm text-danger" role="alert">{message}</p> : null}
      <div className="mt-4 overflow-x-auto rounded-md border border-line bg-white">
        <table className="w-full min-w-[860px] text-left text-[13.5px]">
          <thead className="border-b border-line bg-surface-muted text-[12px] uppercase tracking-wide text-ink-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Popular rank</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((row) => (
              <tr key={row.id} className={busy === row.id ? "opacity-50" : undefined}>
                <td className="max-w-[320px] px-4 py-3">
                  <Link href={`/admin/articles/${row.id}`} className="font-medium text-ink hover:text-brand">{row.title}</Link>
                  <p className="text-[12px] text-ink-subtle">{row.authorName}{row.source === "sample" ? " · sample" : ""}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{row.categoryName}</td>
                <td className="px-4 py-3">
                  <Badge tone={tone[row.status]}>{row.status}</Badge>
                  {row.hidden ? <span className="ml-1 text-[11px] text-ink-subtle">hidden</span> : null}
                </td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(row.publishedAt)}</td>
                <td className="px-4 py-3 tabular-nums text-ink-muted">{row.views}</td>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={row.featured} aria-label={`Feature ${row.title}`} onChange={(event) => patch(row, { featured: event.target.checked })} />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={1}
                    max={999}
                    defaultValue={row.popularRank ?? ""}
                    aria-label={`Popular rank for ${row.title}`}
                    onBlur={(event) => {
                      const next = event.target.value === "" ? null : Number(event.target.value);
                      if (next !== row.popularRank) patch(row, { popularRank: next });
                    }}
                    className="h-8 w-16 rounded-sm border border-line-strong px-2 text-[13px]"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" className={button} onClick={() => patch(row, { status: row.status === "draft" ? "published" : "draft" })}>
                      {row.status === "draft" ? "Publish" : "Unpublish"}
                    </button>
                    <Link href={`/admin/articles/${row.id}`} className={button}>Edit</Link>
                    {row.status === "published" ? <a href={`/blog/${row.slug}`} target="_blank" rel="noopener noreferrer" className={button}>View</a> : null}
                    {row.source !== "sample" ? <button type="button" className={`${button} text-danger`} onClick={() => remove(row)}>Delete</button> : null}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-ink-muted">No articles match.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
