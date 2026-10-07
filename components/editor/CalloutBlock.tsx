"use client";

import type { CalloutBlock as CalloutBlockType } from "@/types/article";
import { cn } from "@/lib/utils";
import { AutoTextarea } from "./AutoTextarea";
import type { BlockEditorProps } from "./types";

const variants = [
  { value: "info", label: "Note", className: "border-brand bg-brand-soft/60" },
  { value: "tip", label: "Tip", className: "border-success bg-[#EEF8F3]" },
  { value: "warning", label: "Important", className: "border-warning bg-[#FDF6E9]" },
] as const;

export function CalloutBlock({ block, onChange }: BlockEditorProps<CalloutBlockType>) {
  const current = variants.find((variant) => variant.value === block.variant) ?? variants[0];
  return (
    <div className={cn("rounded-sm border-l-[3px] px-5 py-4", current.className)}>
      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Callout style">
        {variants.map((variant) => (
          <button key={variant.value} type="button" onClick={() => onChange({ variant: variant.value })} aria-pressed={block.variant === variant.value} className={cn("rounded-sm px-2 py-0.5 text-xs font-medium", block.variant === variant.value ? "bg-ink text-white" : "bg-white/70 text-ink-muted")}>
            {variant.label}
          </button>
        ))}
      </div>
      <input value={block.title ?? ""} onChange={(event) => onChange({ title: event.target.value })} placeholder="Callout title (optional)" aria-label="Callout title" className="w-full border-0 bg-transparent p-0 text-sm font-semibold uppercase tracking-wide text-ink placeholder:text-ink-subtle/70 focus:outline-none" />
      <AutoTextarea value={block.content} onChange={(event) => onChange({ content: event.target.value })} placeholder="What should readers know?" aria-label="Callout text" className="mt-2 text-[16px] leading-relaxed text-ink-muted placeholder:text-ink-subtle/70" />
    </div>
  );
}
