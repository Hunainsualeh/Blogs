"use client";

import type { HeadingBlock as HeadingBlockType } from "@/types/article";
import { cn } from "@/lib/utils";
import { AutoTextarea } from "./AutoTextarea";
import type { BlockEditorProps } from "./types";

export function HeadingBlock({ block, onChange }: BlockEditorProps<HeadingBlockType>) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex shrink-0 overflow-hidden rounded-sm border border-line text-[11px] font-semibold" role="group" aria-label="Heading level">
        {([2, 3] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange({ level })}
            aria-pressed={block.level === level}
            className={cn("px-2 py-1", block.level === level ? "bg-brand text-white" : "bg-white text-ink-muted hover:text-ink")}
          >
            H{level}
          </button>
        ))}
      </div>
      <AutoTextarea
        value={block.content}
        onChange={(event) => onChange({ content: event.target.value.replace(/\n/g, " ") })}
        placeholder={block.level === 2 ? "Section heading" : "Subheading"}
        aria-label="Heading text"
        className={cn("font-semibold tracking-[-0.025em] text-ink placeholder:text-ink-subtle/70", block.level === 2 ? "text-[26px] leading-tight" : "text-[20px] leading-snug")}
      />
    </div>
  );
}
