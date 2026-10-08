"use client";

import type { Dispatch } from "react";
import type { Category } from "@/types/category";
import type { FieldErrors, SubmissionDraft } from "@/types/submission";
import type { EditorAction } from "@/lib/editor";
import { SUBMISSION_LIMITS } from "@/lib/constants";
import { cn, contentWordCount } from "@/lib/utils";
import { FormSection } from "@/components/forms/FormSection";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { TagInput } from "@/components/forms/TagInput";
import { Textarea } from "@/components/forms/Textarea";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";

type EditorSidebarProps = {
  draft: SubmissionDraft;
  dispatch: Dispatch<EditorAction>;
  errors: FieldErrors;
  categories: Category[];
  submitting: boolean;
  onSubmit: () => void;
  honeypot: string;
  onHoneypot: (value: string) => void;
};

export function EditorSidebar({ draft, dispatch, errors, categories, submitting, onSubmit, honeypot, onHoneypot }: EditorSidebarProps) {
  const category = categories.find((item) => item.slug === draft.category);
  const words = contentWordCount(draft.content);
  const checklist = [
    { label: "Title and description", done: draft.title.trim().length >= SUBMISSION_LIMITS.titleMin && draft.excerpt.trim().length >= SUBMISSION_LIMITS.excerptMin },
    { label: "Category and tags", done: Boolean(draft.category) && draft.tags.length > 0 },
    { label: "Featured image with alt text", done: Boolean(draft.featuredImage?.src && draft.featuredImage.alt.trim()) },
    { label: `At least ${SUBMISSION_LIMITS.minWords} words (${words})`, done: words >= SUBMISSION_LIMITS.minWords },
    { label: "Uses section headings", done: draft.content.some((block) => block.type === "heading" && block.content.trim()) },
    { label: "Author details", done: Boolean(draft.author.name.trim() && draft.author.email.trim() && draft.author.bio.trim()) },
  ];
  const completed = checklist.filter((item) => item.done).length;

  return (
    <div className="rounded-md border border-line bg-white p-5 sm:p-6" id="article-settings">
      <FormSection title="Article settings" description="Where your article will appear">
        <Select
          id="category"
          label="Category"
          required
          placeholder="Choose a category"
          value={draft.category}
          onChange={(event) => dispatch({ type: "set", field: "category", value: event.target.value })}
          options={categories.map((item) => ({ value: item.slug, label: item.name }))}
          error={errors.category}
        />
        <TagInput id="tags" label="Tags" tags={draft.tags} onChange={(tags) => dispatch({ type: "setTags", tags })} suggestions={category?.topics ?? []} error={errors.tags} />
      </FormSection>

      <FormSection title="Featured image" description="Shown at the top of your article and on cards" collapsible>
        <div id="field-featuredImage">
          <ImageUploader
            value={draft.featuredImage?.src ?? null}
            onChange={(src) => dispatch({ type: "setFeaturedImage", image: src ? { src, alt: draft.featuredImage?.alt ?? "", caption: draft.featuredImage?.caption ?? "" } : null })}
            label="Upload featured image"
            error={!draft.featuredImage?.src ? errors.featuredImage : undefined}
          />
        </div>
        {draft.featuredImage?.src ? (
          <>
            <Input id="featured-alt" label="Alt text" required value={draft.featuredImage.alt} onChange={(event) => dispatch({ type: "setFeaturedImage", image: { ...draft.featuredImage!, alt: event.target.value } })} placeholder="Describe the image" error={draft.featuredImage.alt.trim() ? undefined : errors.featuredImage} />
            <Input id="featured-caption" label="Caption" optional value={draft.featuredImage.caption ?? ""} onChange={(event) => dispatch({ type: "setFeaturedImage", image: { ...draft.featuredImage!, caption: event.target.value } })} />
          </>
        ) : null}
      </FormSection>

      <FormSection title="About you" description="Shown with your article" collapsible>
        <Input id="author-name" label="Full name" required value={draft.author.name} onChange={(event) => dispatch({ type: "setAuthor", field: "name", value: event.target.value })} autoComplete="name" error={errors.authorName} />
        <Input id="author-email" label="Email" type="email" required value={draft.author.email} onChange={(event) => dispatch({ type: "setAuthor", field: "email", value: event.target.value })} autoComplete="email" hint="Only our editors will see this." error={errors.authorEmail} />
        <Textarea id="author-bio" label="Short bio" required rows={3} maxCount={SUBMISSION_LIMITS.bioMax} value={draft.author.bio} onChange={(event) => dispatch({ type: "setAuthor", field: "bio", value: event.target.value })} placeholder="One or two sentences about your expertise" error={errors.authorBio} />
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website-url">Leave this field empty</label>
          <input id="website-url" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => onHoneypot(event.target.value)} />
        </div>
        <Input id="author-profile" label="Website or social profile" optional type="url" value={draft.author.profileUrl ?? ""} onChange={(event) => dispatch({ type: "setAuthor", field: "profileUrl", value: event.target.value })} placeholder="https://" error={errors.authorProfile} />
      </FormSection>

      <FormSection title="Submission checklist" badge={<span className="font-mono text-[11px] font-normal text-ink-subtle">{completed}/{checklist.length}</span>}>
        <ul className="space-y-2.5">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-start gap-2.5 text-[13.5px]">
              <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", item.done ? "border-success bg-success text-white" : "border-line-strong")}>
                {item.done ? <CheckIcon size={11} /> : null}
              </span>
              <span className={item.done ? "text-ink" : "text-ink-muted"}>{item.label}</span>
            </li>
          ))}
        </ul>
        <Button onClick={onSubmit} disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Submit for review"}
        </Button>
        <p className="text-[12.5px] leading-relaxed text-ink-subtle">Editors review every submission before anything is published. We aim to reply within 5 to 7 working days.</p>
      </FormSection>
    </div>
  );
}
