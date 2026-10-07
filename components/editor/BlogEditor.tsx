"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Category } from "@/types/category";
import type { FieldErrors, SubmissionDraft, SubmissionReceipt } from "@/types/submission";
import { DRAFT_STORAGE_KEY, SUBMISSION_LIMITS } from "@/lib/constants";
import { editorReducer, emptyDraft, templateBlocks, templates, type TemplateKey } from "@/lib/editor";
import { contentWordCount } from "@/lib/utils";
import { validateSubmission } from "@/lib/validation";
import { AutoTextarea } from "./AutoTextarea";
import { BlockList } from "./BlockList";
import { EditorSidebar } from "./EditorSidebar";
import { EditorToolbar, type EditorMode } from "./EditorToolbar";
import { PreviewPanel } from "./PreviewPanel";
import { SubmissionConfirmation } from "@/components/submission/SubmissionConfirmation";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { AlertIcon, ChevronDownIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";

const fieldAnchors: Record<string, string> = {
  title: "article-title",
  excerpt: "article-excerpt",
  category: "category",
  tags: "tags",
  featuredImage: "field-featuredImage",
  authorName: "author-name",
  authorEmail: "author-email",
  authorBio: "author-bio",
  authorProfile: "author-profile",
  content: "article-content",
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

export function BlogEditor({ categories }: { categories: Category[] }) {
  const [draft, dispatch] = useReducer(editorReducer, undefined, emptyDraft);
  const [mode, setMode] = useState<EditorMode>("write");
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const [saveStatus, setSaveStatus] = useState("Draft not saved yet");
  const [pendingTemplate, setPendingTemplate] = useState<TemplateKey | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const stored = readStoredDraft();
    if (stored) {
      dispatch({ type: "load", draft: stored });
    }
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

  const errors: FieldErrors = useMemo(() => (showErrors ? validateSubmission(draft) : {}), [draft, showErrors]);

  const category = useMemo(() => categories.find((item) => item.slug === draft.category), [categories, draft.category]);
  const wordCount = contentWordCount(draft.content);

  const focusFirstError = useCallback((found: FieldErrors) => {
    const firstKey = Object.keys(found)[0];
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
    const found = validateSubmission(draft);
    if (Object.keys(found).length > 0) {
      setMode("write");
      focusFirstError(found);
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
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
      setSaveStatus("Draft not saved yet");
    }
    dispatch({ type: "load", draft: emptyDraft() });
    setReceipt(null);
    setShowErrors(false);
    setMode("write");
  }

  if (receipt) {
    return <SubmissionConfirmation receipt={receipt} onEdit={() => { setReceipt(null); setMode("write"); }} onStartNew={startNew} />;
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div>
      <EditorToolbar mode={mode} onModeChange={setMode} wordCount={wordCount} saveStatus={saveStatus} submitting={submitting} onSubmit={submit} />

      {showErrors && errorCount > 0 ? (
        <div className="mt-6 flex items-start gap-3 rounded-md border border-danger/30 bg-[#FDF5F4] p-4 text-[14px] text-danger" role="alert">
          <AlertIcon size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Please fix {errorCount} {errorCount === 1 ? "issue" : "issues"} before submitting.</p>
            <p className="mt-0.5 text-danger/80">Fields that need attention are highlighted below.</p>
          </div>
        </div>
      ) : null}
      {serverError ? (
        <p className="mt-4 rounded-md border border-danger/30 bg-[#FDF5F4] p-4 text-[14px] text-danger" role="alert">{serverError}</p>
      ) : null}

      {mode === "preview" ? (
        <div className="py-10">
          <PreviewPanel draft={draft} category={category} />
        </div>
      ) : (
        <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="kicker text-ink-subtle">{category ? category.name : "New article"}</p>
              <Dropdown
                label="Article templates"
                align="end"
                items={templates.map((template) => ({ key: template.key, label: template.label, description: template.description, onSelect: () => setPendingTemplate(template.key) }))}
                trigger={({ open, toggle, id }) => (
                  <button type="button" onClick={toggle} aria-expanded={open} aria-controls={id} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-3 text-[13px] font-medium text-ink-muted hover:border-ink hover:text-ink">
                    Templates <ChevronDownIcon size={14} />
                  </button>
                )}
              />
            </div>
            <label htmlFor="article-title" className="sr-only">Article title</label>
            <AutoTextarea
              id="article-title"
              value={draft.title}
              onChange={(event) => dispatch({ type: "set", field: "title", value: event.target.value.replace(/\n/g, " ") })}
              placeholder="Article title"
              maxLength={SUBMISSION_LIMITS.titleMax + 20}
              aria-invalid={Boolean(errors.title)}
              className="text-[34px] font-semibold leading-[1.1] tracking-[-0.04em] text-ink placeholder:text-line-strong sm:text-[44px]"
            />
            {errors.title ? <p className="mt-2 text-[13px] text-danger">{errors.title}</p> : null}
            <label htmlFor="article-excerpt" className="sr-only">Short description</label>
            <AutoTextarea
              id="article-excerpt"
              value={draft.excerpt}
              onChange={(event) => dispatch({ type: "set", field: "excerpt", value: event.target.value.replace(/\n/g, " ") })}
              placeholder="Write a short description that makes readers want to continue..."
              aria-invalid={Boolean(errors.excerpt)}
              className="mt-4 font-serif text-[20px] leading-relaxed text-ink-muted placeholder:text-line-strong"
            />
            <div className="mt-1 flex justify-between text-[12px]">
              <span className="text-danger">{errors.excerpt}</span>
              <span className={draft.excerpt.length > SUBMISSION_LIMITS.excerptMax ? "font-mono text-danger" : "font-mono text-ink-subtle"}>{draft.excerpt.length}/{SUBMISSION_LIMITS.excerptMax}</span>
            </div>

            <div id="article-content" className="mt-8 border-t border-line pt-4">
              {errors.content ? <p className="mb-3 rounded-md bg-[#FDF5F4] px-3 py-2 text-[13px] text-danger" role="alert">{errors.content}</p> : null}
              <BlockList
                blocks={draft.content}
                errors={errors}
                onInsert={(index, block) => dispatch({ type: "insertBlock", index, block })}
                onUpdate={(id, patch) => dispatch({ type: "updateBlock", id, patch })}
                onRemove={(id) => dispatch({ type: "removeBlock", id })}
                onMove={(id, direction) => dispatch({ type: "moveBlock", id, direction })}
              />
            </div>
          </div>
          <aside className="lg:sticky lg:top-[calc(var(--header-height,120px)+80px)] lg:max-h-[calc(100vh-var(--header-height,120px)-100px)] lg:self-start lg:overflow-y-auto">
            <EditorSidebar draft={draft} dispatch={dispatch} errors={errors} categories={categories} submitting={submitting} onSubmit={submit} />
          </aside>
        </div>
      )}

      <Modal open={pendingTemplate !== null} onClose={() => setPendingTemplate(null)} title="Replace article content?">
        <p className="text-[15px] leading-relaxed text-ink-muted">Applying the {templates.find((item) => item.key === pendingTemplate)?.label.toLowerCase()} template replaces the blocks you have written. Your title, description and settings stay the same.</p>
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
