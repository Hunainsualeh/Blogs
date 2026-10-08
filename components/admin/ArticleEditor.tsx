"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ArticleFull, ContentBlock } from "@/types/article";
import type { Category } from "@/types/category";
import type { Author } from "@/types/user";
import { readingTime } from "@/lib/utils";
import { BlockList } from "@/components/editor/BlockList";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { TagInput } from "@/components/forms/TagInput";
import { Textarea } from "@/components/forms/Textarea";
import { Button } from "@/components/ui/Button";
import { createBlock } from "@/lib/editor";
import { adminRequest } from "./api";

type Props = {
  article: Omit<ArticleFull, "author" | "categoryInfo"> | null;
  categories: Category[];
  authors: Author[];
};

function toLocalInput(iso: string) {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function ArticleEditor({ article, categories, authors }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [category, setCategory] = useState(article?.category ?? "");
  const [authorId, setAuthorId] = useState(article?.authorId ?? authors[0]?.id ?? "");
  const [tags, setTags] = useState<string[]>(article?.tags ?? []);
  const [image, setImage] = useState(article?.featuredImage ?? { src: "", alt: "", caption: "", credit: "" });
  const [content, setContent] = useState<ContentBlock[]>(article?.content ?? [createBlock("paragraph")]);
  const [status, setStatus] = useState<"draft" | "published">(article?.status === "published" ? "published" : "draft");
  const [publishedAt, setPublishedAt] = useState(article && article.status === "published" ? toLocalInput(article.publishedAt) : "");
  const [featured, setFeatured] = useState(article?.featured ?? false);
  const [editorsPick, setEditorsPick] = useState(article?.editorsPick ?? false);
  const [popularRank, setPopularRank] = useState(article?.popularRank ? String(article.popularRank) : "");
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(article?.seoDescription ?? "");
  const [noIndex, setNoIndex] = useState(article?.noIndex ?? false);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const blockErrors = useMemo(() => ({}), []);
  const category_ = categories.find((item) => item.slug === category);
  const author = authors.find((item) => item.id === authorId);

  async function save(nextStatus: "draft" | "published") {
    setBusy(true);
    setMessage(null);
    setErrors({});
    const body = {
      title,
      slug,
      excerpt,
      category,
      authorId,
      tags,
      featuredImage: image.src ? image : null,
      content,
      status: nextStatus,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : "",
      featured,
      editorsPick,
      popularRank: popularRank === "" ? null : Number(popularRank),
      seoTitle,
      seoDescription,
      noIndex,
    };
    const result = article ? await adminRequest<{ article: { id: string } }>("PATCH", `/api/admin/articles/${article.id}`, body) : await adminRequest<{ article: { id: string } }>("POST", "/api/admin/articles", body);
    setBusy(false);
    if (!result.ok) {
      setErrors(result.errors ?? {});
      setMessage({ tone: "error", text: result.error ?? "The article could not be saved." });
      return;
    }
    setStatus(nextStatus);
    setMessage({ tone: "ok", text: nextStatus === "published" ? "Saved and published." : "Draft saved." });
    if (!article && result.data?.article?.id) {
      router.replace(`/admin/articles/${result.data.article.id}`);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">{article ? "Edit article" : "New article"}</h1>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md bg-white p-1" role="tablist" aria-label="Editor mode">
            {(["write", "preview"] as const).map((value) => (
              <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => setMode(value)} className={`h-8 rounded-[4px] px-3 text-[13px] font-medium capitalize ${mode === value ? "bg-brand-soft text-brand" : "text-ink-muted"}`}>
                {value}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => save("draft")}>Save as draft</Button>
          <Button size="sm" disabled={busy} onClick={() => save("published")}>{status === "published" ? "Update" : "Publish"}</Button>
        </div>
      </div>
      {message ? (
        <p role={message.tone === "error" ? "alert" : "status"} className={`mt-4 rounded-md border p-3 text-sm ${message.tone === "error" ? "border-danger/30 bg-[#FDF5F4] text-danger" : "border-success/30 bg-[#EEF8F3] text-success"}`}>
          {message.text} {Object.values(errors).join(" ")}
        </p>
      ) : null}

      {mode === "preview" ? (
        <div className="mx-auto mt-8 max-w-[860px] rounded-md bg-white p-6 sm:p-10">
          <ArticleHeader title={title} excerpt={excerpt} category={category_} author={{ name: author?.name ?? "" }} readingTime={readingTime(content)} image={image.src ? image : null} linkCategory={false} />
          <ArticleBody blocks={content} className="mt-8" />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-5 rounded-md border border-line bg-white p-5 sm:p-6">
            <Input id="title" label="Title" required value={title} onChange={(event) => setTitle(event.target.value)} error={errors.title} maxLength={200} />
            <Textarea id="excerpt" label="Short description" required rows={3} maxCount={300} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} error={errors.excerpt} hint="Shown on cards and used as the default meta description." />
            <div className="border-t border-line pt-4">
              {errors.content ? <p className="mb-3 text-[13px] text-danger">{errors.content}</p> : null}
              <BlockList
                blocks={content}
                errors={blockErrors}
                onInsert={(index, block) => setContent((current) => [...current.slice(0, index), block, ...current.slice(index)])}
                onUpdate={(id, patch) => setContent((current) => current.map((block) => (block.id === id ? ({ ...block, ...patch } as ContentBlock) : block)))}
                onRemove={(id) => setContent((current) => current.filter((block) => block.id !== id))}
                onMove={(id, direction) =>
                  setContent((current) => {
                    const index = current.findIndex((block) => block.id === id);
                    const target = index + direction;
                    if (index < 0 || target < 0 || target >= current.length) return current;
                    const next = [...current];
                    [next[index], next[target]] = [next[target], next[index]];
                    return next;
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-5">
            <section className="space-y-4 rounded-md border border-line bg-white p-5">
              <h2 className="text-[15px] font-semibold text-ink">Publishing</h2>
              <p className="text-[13px] text-ink-muted">Status: <strong className="text-ink">{status === "published" ? "Published" : "Draft"}</strong></p>
              <Input id="publishedAt" type="datetime-local" label="Publish date" optional value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} error={errors.publishedAt} hint="A future date schedules the article." />
              <Input id="slug" label="URL slug" optional value={slug} onChange={(event) => setSlug(event.target.value)} error={errors.slug} hint="Leave blank to generate it from the title." />
            </section>
            <section className="space-y-4 rounded-md border border-line bg-white p-5">
              <h2 className="text-[15px] font-semibold text-ink">Organisation</h2>
              <Select id="category" label="Category" required placeholder="Choose a category" value={category} onChange={(event) => setCategory(event.target.value)} options={categories.map((item) => ({ value: item.slug, label: item.name }))} error={errors.category} />
              <Select id="author" label="Author" required value={authorId} onChange={(event) => setAuthorId(event.target.value)} options={authors.map((item) => ({ value: item.id, label: item.name }))} error={errors.authorId} />
              <TagInput id="tags" label="Tags" tags={tags} onChange={setTags} suggestions={category_?.topics ?? []} />
            </section>
            <section className="space-y-4 rounded-md border border-line bg-white p-5">
              <h2 className="text-[15px] font-semibold text-ink">Featured image</h2>
              <ImageUploader value={image.src || null} onChange={(src) => setImage(src ? { ...image, src } : { src: "", alt: "", caption: "", credit: "" })} label="Upload featured image" error={errors.featuredImage} />
              {image.src ? (
                <>
                  <Input id="image-alt" label="Alt text" required value={image.alt} onChange={(event) => setImage({ ...image, alt: event.target.value })} />
                  <Input id="image-caption" label="Caption" optional value={image.caption ?? ""} onChange={(event) => setImage({ ...image, caption: event.target.value })} />
                  <Input id="image-credit" label="Credit" optional value={image.credit ?? ""} onChange={(event) => setImage({ ...image, credit: event.target.value })} />
                </>
              ) : null}
            </section>
            <section className="space-y-3 rounded-md border border-line bg-white p-5">
              <h2 className="text-[15px] font-semibold text-ink">Placement</h2>
              <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> Featured on the homepage</label>
              <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={editorsPick} onChange={(event) => setEditorsPick(event.target.checked)} /> Editor&apos;s pick</label>
              <Input id="popular-rank" type="number" min={1} max={999} label="Popular Posts rank" optional value={popularRank} onChange={(event) => setPopularRank(event.target.value)} hint="Lower numbers appear first in the Popular Posts sidebar." />
            </section>
            <section className="space-y-4 rounded-md border border-line bg-white p-5">
              <h2 className="text-[15px] font-semibold text-ink">Search engines</h2>
              <Input id="seo-title" label="SEO title" optional maxCount={70} value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
              <Textarea id="seo-description" label="Meta description" optional rows={3} maxCount={170} value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} />
              <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={noIndex} onChange={(event) => setNoIndex(event.target.checked)} /> Ask search engines not to index this article</label>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
