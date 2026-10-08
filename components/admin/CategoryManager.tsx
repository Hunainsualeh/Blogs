"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/types/category";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Button } from "@/components/ui/Button";
import { adminRequest } from "./api";

type Row = Category & { key: string; count: number; topicsText: string };

export function CategoryManager({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(categories.map((category) => ({ ...category, key: category.slug, count: counts[category.slug] ?? 0, topicsText: category.topics.join(", ") })));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  function update(key: string, patch: Partial<Row>) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function move(index: number, direction: -1 | 1) {
    setRows((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function add() {
    const key = `new-${Date.now()}`;
    setRows((current) => [...current, { key, slug: "", name: "", shortName: "", tagline: "", description: "", topics: [], topicsText: "", order: current.length, showOnHome: true, showInNav: true, count: 0 }]);
  }

  async function save() {
    setBusy(true);
    setMessage(null);
    const payload = rows.map((row) => ({
      slug: row.slug || slugify(row.name),
      name: row.name,
      shortName: row.shortName,
      tagline: row.tagline,
      description: row.description,
      topics: row.topicsText.split(",").map((topic) => topic.trim()).filter(Boolean),
      showOnHome: row.showOnHome,
      showInNav: row.showInNav,
    }));
    const result = await adminRequest("PUT", "/api/admin/categories", { categories: payload });
    setBusy(false);
    if (!result.ok) {
      setMessage({ tone: "error", text: result.error ?? "The categories could not be saved." });
      return;
    }
    setMessage({ tone: "ok", text: "Categories saved." });
    router.refresh();
  }

  return (
    <div className="mt-6 max-w-4xl">
      <ul className="space-y-4">
        {rows.map((row, index) => (
          <li key={row.key} className="rounded-md border border-line bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id={`name-${row.key}`} label="Name" required value={row.name} onChange={(event) => update(row.key, { name: event.target.value })} />
              <Input id={`slug-${row.key}`} label="URL slug" value={row.slug} onChange={(event) => update(row.key, { slug: event.target.value })} hint={row.count > 0 ? "Changing the slug of a category that has articles is blocked." : "Leave blank to generate it from the name."} />
              <Input id={`tagline-${row.key}`} label="Tagline" value={row.tagline} onChange={(event) => update(row.key, { tagline: event.target.value })} fieldClassName="sm:col-span-2" />
              <Textarea id={`desc-${row.key}`} label="Description" rows={2} value={row.description} onChange={(event) => update(row.key, { description: event.target.value })} fieldClassName="sm:col-span-2" hint="Used as the meta description of the category page." />
              <Input id={`topics-${row.key}`} label="Topics (comma separated)" optional value={row.topicsText} onChange={(event) => update(row.key, { topicsText: event.target.value })} fieldClassName="sm:col-span-2" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink">
              <label className="flex items-center gap-2"><input type="checkbox" checked={row.showOnHome} onChange={(event) => update(row.key, { showOnHome: event.target.checked })} /> Show on homepage</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={row.showInNav} onChange={(event) => update(row.key, { showInNav: event.target.checked })} /> Show in menus</label>
              <span className="text-ink-subtle">{row.count} published {row.count === 1 ? "article" : "articles"}</span>
              <span className="ml-auto flex gap-2">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded-sm border border-line-strong px-2 py-1 text-[12px] disabled:opacity-40">Move up</button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === rows.length - 1} className="rounded-sm border border-line-strong px-2 py-1 text-[12px] disabled:opacity-40">Move down</button>
                <button type="button" onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))} className="rounded-sm border border-line-strong px-2 py-1 text-[12px] text-danger">Remove</button>
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={add}>Add category</Button>
        <Button size="sm" disabled={busy} onClick={save}>{busy ? "Saving..." : "Save categories"}</Button>
        {message ? <p role={message.tone === "error" ? "alert" : "status"} className={message.tone === "error" ? "text-sm text-danger" : "text-sm text-success"}>{message.text}</p> : null}
      </div>
    </div>
  );
}
