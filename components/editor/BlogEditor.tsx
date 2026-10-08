"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Category } from "@/types/category";
import type { FieldErrors, SubmissionDraft, SubmissionReceipt } from "@/types/submission";
import { DRAFT_STORAGE_KEY, SUBMISSION_LIMITS } from "@/lib/constants";
import { editorReducer, emptyDraft, templateBlocks, templates, type TemplateKey } from "@/lib/editor";
import { cn, contentWordCount, readingTime } from "@/lib/utils";
import { validateSubmission } from "@/lib/validation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { TagInput } from "@/components/forms/TagInput";
import { Textarea } from "@/components/forms/Textarea";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SubmissionConfirmation } from "@/components/submission/SubmissionConfirmation";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { AlertIcon, CheckIcon, ChevronDownIcon, EyeIcon, PenIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { BlockList } from "./BlockList";

const fieldAnchors: Record<string, string> = {
  authorName: "author-name",
  authorEmail: "author-email",
  authorBio: "author-bio",
  authorProfile: "author-profile",
  title: "article-title",
  category: "category",
  excerpt: "article-excerpt",
  tags: "tags",
  featuredImage: "field-featuredImage",
  content: "article-content",
  agreed: "agreement",
};

function readStoredDraft(): SubmissionDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SubmissionDraft;
    return parsed && Array.isArray(parsed.content) && parsed.author ? parsed : null;
  } catch {
    return null;
  }
}

function SectionTitle({ step, title, description }: { step: number; title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="flex items-center gap-3 text-[26px] font-bold leading-tight tracking-[-0.03em] text-ink sm:text-[28px]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-white" aria-hidden>{step}</span>
        {title}
      </h2>
      {description ? <p className="mt-2 text-[15.5px] leading-relaxed text-ink-muted sm:pl-11">{description}</p> : null}
    </div>
  );
}

export function BlogEditor({ categories }: { categories: Category[] }) {
  const [draft, dispatch] = useReducer(editorReducer, undefined, emptyDraft);
  const [preview, setPreview] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const [saveStatus, setSaveStatus] = useState("Your draft saves automatically in this browser.");
  const [honeypot, setHoneypot] = useState("");
  const [pendingTemplate, setPendingTemplate] = useState<TemplateKey | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const stored = readStoredDraft();
    if (stored) dispatch({ type: "load", draft: stored });
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        setSaveStatus(`Draft saved in this browser at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
      } catch {
        setSaveStatus("Draft too large to save in this browser. Keep this tab open.");
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [draft]);

  const categorySlugs = useMemo(() => categories.map((item) => item.slug), [categories]);
  const computeErrors = useCallback(
    (value: SubmissionDraft, accepted: boolean): FieldErrors => {
      const found = validateSubmission(value, categorySlugs);
      if (!accepted) found.agreed = "Please confirm the statement above before submitting.";
      return found;
    },
    [categorySlugs],
  );
  const errors: FieldErrors = useMemo(() => (showErrors ? computeErrors(draft, agreed) : {}), [draft, agreed, showErrors, computeErrors]);
  const category = useMemo(() => categories.find((item) => item.slug === draft.category), [categories, draft.category]);
  const words = contentWordCount(draft.content);
  const wordProgress = Math.min(100, Math.round((words / SUBMISSION_LIMITS.minWords) * 100));

  const focusFirstError = useCallback((found: FieldErrors) => {
    const order = Object.keys(fieldAnchors);
    const firstKey = Object.keys(found).sort((a, b) => {
      const ai = a.startsWith("block:") ? order.indexOf("content") + 0.5 : order.indexOf(a);
      const bi = b.startsWith("block:") ? order.indexOf("content") + 0.5 : order.indexOf(b);
      return ai - bi;
    })[0];
    if (!firstKey) return;
    const anchor = firstKey.startsWith("block:") ? `block-${firstKey.slice(6)}` : fieldAnchors[firstKey];
    window.requestAnimationFrame(() => {
      const element = anchor ? document.getElementById(anchor) : null;
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) element.focus({ preventScroll: true });
    });
  }, []);

  async function submit() {
    setServerError(null);
    setShowErrors(true);
    const found = computeErrors(draft, agreed);
    if (Object.keys(found).length > 0) {
      setPreview(false);
      focusFirstError(found);
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, website: honeypot, agreed }),
      });
      const data = (await response.json()) as { ok: boolean; receipt?: SubmissionReceipt; error?: string; errors?: FieldErrors };
      if (!data.ok || !data.receipt) {
        setServerError(data.error ?? "The submission could not be completed. Please try again.");
        if (data.errors) focusFirstError(data.errors);
        return;
      }
      setReceipt(data.receipt);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError("We could not reach the server. Your draft is safe in this browser. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function startNew() {
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      setSaveStatus("Your draft saves automatically in this browser.");
    }
    dispatch({ type: "load", draft: emptyDraft() });
    setReceipt(null);
    setShowErrors(false);
    setAgreed(false);
    setPreview(false);
  }

  if (receipt) {
    return (
      <div className="container-site pt-4">
        <SubmissionConfirmation
          receipt={receipt}
          onEdit={() => {
            setReceipt(null);
            setPreview(false);
          }}
          onStartNew={startNew}
        />
      </div>
    );
  }

  const checklist = [
    { label: "Your details are complete", done: Boolean(draft.author.name.trim() && draft.author.email.trim() && draft.author.bio.trim()) },
    { label: "Title, category and tags are set", done: draft.title.trim().length >= SUBMISSION_LIMITS.titleMin && Boolean(draft.category) && draft.tags.length > 0 },
    { label: "Short description is written", done: draft.excerpt.trim().length >= SUBMISSION_LIMITS.excerptMin },
    { label: "Featured image has alt text", done: Boolean(draft.featuredImage?.src && draft.featuredImage.alt.trim()) },
    { label: `Article has at least ${SUBMISSION_LIMITS.minWords} words (${words})`, done: words >= SUBMISSION_LIMITS.minWords },
    { label: "Article uses section headings", done: draft.content.some((block) => block.type === "heading" && block.content.trim()) },
  ];
  const errorCount = Object.keys(errors).length;

  return (
    <div className="container-site pt-6 sm:pt-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Write for Us", href: "/write-for-us" }, { label: "Submit an Article" }]} className="mb-5" />
      <h1 className="text-[36px] font-bold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[56px]">Submit an Article</h1>

      <div className="mx-auto mt-8 max-w-[820px] pb-4">
        <p className="text-[19px] leading-relaxed text-ink-muted">
          Send us your original article for editorial review. It takes about ten minutes to set up, and you can leave and come back because your draft saves in this browser.
        </p>

        <div className="mt-6 rounded-sm border border-line bg-surface-muted p-5">
          <p className="text-[15px] font-semibold text-ink">Before you start</p>
          <ul className="mt-2 grid gap-1.5 text-[14.5px] leading-relaxed text-ink-muted sm:grid-cols-2">
            <li className="flex gap-2"><CheckIcon size={16} className="mt-1 shrink-0 text-success" /> At least {SUBMISSION_LIMITS.minWords} words of original writing</li>
            <li className="flex gap-2"><CheckIcon size={16} className="mt-1 shrink-0 text-success" /> A featured image you have the right to use</li>
            <li className="flex gap-2"><CheckIcon size={16} className="mt-1 shrink-0 text-success" /> No promotional content or paid links</li>
            <li className="flex gap-2"><CheckIcon size={16} className="mt-1 shrink-0 text-success" /> A short bio and a valid email address</li>
          </ul>
          <p className="mt-3 text-[14px] text-ink-muted">
            Read the full <Link href="/write-for-us" className="font-medium text-brand underline underline-offset-2">Write for Us guidelines</Link> first.
          </p>
        </div>

        {showErrors && errorCount > 0 ? (
          <div className="mt-6 flex items-start gap-3 rounded-sm border border-danger/30 bg-[#FDF5F4] p-4 text-[14px] text-danger" role="alert">
            <AlertIcon size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Please fix {errorCount} {errorCount === 1 ? "issue" : "issues"} before submitting.</p>
              <p className="mt-0.5 text-danger/80">The fields that need attention are marked below.</p>
            </div>
          </div>
        ) : null}
        {serverError ? <p className="mt-6 rounded-sm border border-danger/30 bg-[#FDF5F4] p-4 text-[14px] text-danger" role="alert">{serverError}</p> : null}

        {preview ? (
          <div className="mt-10">
            <p className="mb-8 flex items-center gap-2 rounded-sm bg-brand-soft px-4 py-3 text-[14px] text-brand">
              <EyeIcon size={16} /> This is how your article will look. Empty blocks are hidden.
            </p>
            <ArticleHeader
              title={draft.title}
              excerpt={draft.excerpt}
              category={category}
              author={{ name: draft.author.name || "Your name" }}
              readingTime={readingTime(draft.content)}
              image={draft.featuredImage}
              linkCategory={false}
            />
            <ArticleBody blocks={draft.content} className="mt-8" />
            <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row">
              <Button variant="outline" onClick={() => setPreview(false)} icon={<PenIcon size={16} />} iconPosition="start">Back to editing</Button>
              <Button onClick={submit} disabled={submitting}>{submitting ? "Submitting..." : "Submit for review"}</Button>
            </div>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <section className="mt-12" aria-labelledby="step-details">
              <div id="step-details" className="sr-only">Your details</div>
              <SectionTitle step={1} title="Your Details:" description="This is how we credit you. Your email is seen only by our editors and is never published." />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input id="author-name" label="Full name" required value={draft.author.name} onChange={(event) => dispatch({ type: "setAuthor", field: "name", value: event.target.value })} autoComplete="name" error={errors.authorName} />
                <Input id="author-email" label="Email address" type="email" required value={draft.author.email} onChange={(event) => dispatch({ type: "setAuthor", field: "email", value: event.target.value })} autoComplete="email" error={errors.authorEmail} />
              </div>
              <div className="mt-5 space-y-5">
                <Textarea id="author-bio" label="Short author bio" required rows={3} maxCount={SUBMISSION_LIMITS.bioMax} value={draft.author.bio} onChange={(event) => dispatch({ type: "setAuthor", field: "bio", value: event.target.value })} placeholder="One or two sentences about your expertise" error={errors.authorBio} />
                <Input id="author-profile" label="Website or social profile" optional type="url" value={draft.author.profileUrl ?? ""} onChange={(event) => dispatch({ type: "setAuthor", field: "profileUrl", value: event.target.value })} placeholder="https://" hint="Shown in your bio and marked so it does not pass search ranking credit." error={errors.authorProfile} />
              </div>
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website-url">Leave this field empty</label>
                <input id="website-url" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
              </div>
            </section>

            <section className="mt-14" aria-labelledby="step-article">
              <div id="step-article" className="sr-only">Article details</div>
              <SectionTitle step={2} title="Article Details:" description="Help readers and editors understand what your article is about." />
              <div className="space-y-5">
                <Input id="article-title" label="Article title" required value={draft.title} maxLength={SUBMISSION_LIMITS.titleMax + 20} maxCount={SUBMISSION_LIMITS.titleMax} onChange={(event) => dispatch({ type: "set", field: "title", value: event.target.value.replace(/\n/g, " ") })} placeholder="A clear, specific headline" error={errors.title} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select id="category" label="Category" required placeholder="Choose a category" value={draft.category} onChange={(event) => dispatch({ type: "set", field: "category", value: event.target.value })} options={categories.map((item) => ({ value: item.slug, label: item.name }))} error={errors.category} />
                  <TagInput id="tags" label="Tags" tags={draft.tags} onChange={(tags) => dispatch({ type: "setTags", tags })} suggestions={category?.topics ?? []} error={errors.tags} />
                </div>
                <Textarea id="article-excerpt" label="Short description" required rows={3} maxCount={SUBMISSION_LIMITS.excerptMax} value={draft.excerpt} onChange={(event) => dispatch({ type: "set", field: "excerpt", value: event.target.value.replace(/\n/g, " ") })} placeholder="One or two sentences that summarize the article" hint="Shown on article cards and in search results." error={errors.excerpt} />
                <div id="field-featuredImage" className="space-y-4">
                  <p className="text-[13.5px] font-medium text-ink">Featured image <span className="text-danger" aria-hidden>*</span></p>
                  <ImageUploader
                    value={draft.featuredImage?.src ?? null}
                    onChange={(src) => dispatch({ type: "setFeaturedImage", image: src ? { src, alt: draft.featuredImage?.alt ?? "", caption: draft.featuredImage?.caption ?? "" } : null })}
                    label="Upload featured image"
                    compact
                    error={!draft.featuredImage?.src ? errors.featuredImage : undefined}
                  />
                  {draft.featuredImage?.src ? (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input id="featured-alt" label="Alt text" required value={draft.featuredImage.alt} onChange={(event) => dispatch({ type: "setFeaturedImage", image: { ...draft.featuredImage!, alt: event.target.value } })} placeholder="Describe what the image shows" error={draft.featuredImage.alt.trim() ? undefined : errors.featuredImage} />
                      <Input id="featured-caption" label="Caption or credit" optional value={draft.featuredImage.caption ?? ""} onChange={(event) => dispatch({ type: "setFeaturedImage", image: { ...draft.featuredImage!, caption: event.target.value } })} />
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="mt-14" aria-labelledby="step-content">
              <div id="step-content" className="sr-only">Your article</div>
              <SectionTitle step={3} title="Your Article:" description="Write in short paragraphs and use headings to organize your points. Add images, lists or quotes with the button below the last block." />
              <div id="article-content">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-surface-muted px-4 py-3">
                  <div className="min-w-[200px] flex-1">
                    <p className="flex justify-between text-[13px] text-ink-muted">
                      <span><strong className="text-ink">{words}</strong> of {SUBMISSION_LIMITS.minWords} words minimum</span>
                      {words >= SUBMISSION_LIMITS.minWords ? <span className="font-medium text-success">Length reached</span> : null}
                    </p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={SUBMISSION_LIMITS.minWords} aria-valuenow={Math.min(words, SUBMISSION_LIMITS.minWords)} aria-label="Word count progress">
                      <div className={cn("h-full transition-all", words >= SUBMISSION_LIMITS.minWords ? "bg-success" : "bg-brand")} style={{ width: `${wordProgress}%` }} />
                    </div>
                  </div>
                  <Dropdown
                    label="Article templates"
                    align="end"
                    items={templates.map((template) => ({ key: template.key, label: template.label, description: template.description, onSelect: () => setPendingTemplate(template.key) }))}
                    trigger={({ open, toggle, id }) => (
                      <button type="button" onClick={toggle} aria-expanded={open} aria-controls={id} className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line-strong bg-white px-3 text-[13px] font-medium text-ink hover:border-ink">
                        Start from a template <ChevronDownIcon size={14} />
                      </button>
                    )}
                  />
                </div>
                {errors.content ? <p className="mb-3 rounded-sm bg-[#FDF5F4] px-3 py-2 text-[13.5px] text-danger" role="alert">{errors.content}</p> : null}
                <BlockList
                  mode="end"
                  blocks={draft.content}
                  errors={errors}
                  onInsert={(index, block) => dispatch({ type: "insertBlock", index, block })}
                  onUpdate={(id, patch) => dispatch({ type: "updateBlock", id, patch })}
                  onRemove={(id) => dispatch({ type: "removeBlock", id })}
                  onMove={(id, direction) => dispatch({ type: "moveBlock", id, direction })}
                />
              </div>
            </section>

            <section className="mt-14" aria-labelledby="step-submit">
              <div id="step-submit" className="sr-only">Review and submit</div>
              <SectionTitle step={4} title="Review and Submit:" description="Check the list, confirm the statement and send your article to our editors." />
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {checklist.map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5 text-[14.5px]">
                    <span className={cn("mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border", item.done ? "border-success bg-success text-white" : "border-line-strong")}>
                      {item.done ? <CheckIcon size={12} /> : null}
                    </span>
                    <span className={item.done ? "text-ink" : "text-ink-muted"}>{item.label}</span>
                  </li>
                ))}
              </ul>

              <div id="agreement" className={cn("mt-6 rounded-sm border p-4", errors.agreed ? "border-danger bg-[#FFFBFA]" : "border-line bg-surface-muted")}>
                <label className="flex cursor-pointer items-start gap-3 text-[14.5px] leading-relaxed text-ink">
                  <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--theme-brand)]" />
                  <span>
                    I confirm this article is my own original work, it has not been published elsewhere, and I have the right to use every image in it. I understand that submitting does not guarantee publication and that editors may edit my article.
                  </span>
                </label>
                {errors.agreed ? <p className="mt-2 pl-7 text-[13px] text-danger">{errors.agreed}</p> : null}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" size="lg" disabled={submitting}>{submitting ? "Submitting..." : "Submit for review"}</Button>
                <Button type="button" size="lg" variant="outline" onClick={() => setPreview(true)} icon={<EyeIcon size={16} />} iconPosition="start">Preview article</Button>
              </div>
              <p className="mt-4 text-[13px] text-ink-subtle" role="status">{saveStatus}</p>
              <p className="mt-1 text-[13px] text-ink-subtle">We aim to reply within 5 to 7 working days. Nothing is published until an editor approves it.</p>
            </section>
          </form>
        )}
      </div>

      <Modal open={pendingTemplate !== null} onClose={() => setPendingTemplate(null)} title="Replace article content?">
        <p className="text-[15px] leading-relaxed text-ink-muted">Applying the {templates.find((item) => item.key === pendingTemplate)?.label.toLowerCase()} template replaces the blocks you have written. Your details and article settings stay the same.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setPendingTemplate(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (pendingTemplate) dispatch({ type: "replaceContent", blocks: templateBlocks(pendingTemplate) });
              setPendingTemplate(null);
            }}
          >
            Apply template
          </Button>
        </div>
      </Modal>
    </div>
  );
}
