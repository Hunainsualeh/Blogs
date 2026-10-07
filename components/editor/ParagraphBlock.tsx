"use client";

import type { ParagraphBlock as ParagraphBlockType } from "@/types/article";
import { AutoTextarea } from "./AutoTextarea";
import type { BlockEditorProps } from "./types";

export function ParagraphBlock({ block, onChange }: BlockEditorProps<ParagraphBlockType>) {
  return (
    <AutoTextarea
      value={block.content}
      onChange={(event) => onChange({ content: event.target.value })}
      placeholder="Write your paragraph. Use **bold**, *italic* or [link text](https://example.com)."
      aria-label="Paragraph text"
      className="min-h-[3.5rem] font-serif text-[18px] leading-[1.75] text-ink placeholder:text-ink-subtle/70"
    />
  );
}
