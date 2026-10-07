"use client";

import type { QuoteBlock as QuoteBlockType } from "@/types/article";
import { AutoTextarea } from "./AutoTextarea";
import type { BlockEditorProps } from "./types";

export function QuoteBlock({ block, onChange }: BlockEditorProps<QuoteBlockType>) {
  return (
    <div className="border-l-[3px] border-brand pl-5">
      <AutoTextarea value={block.content} onChange={(event) => onChange({ content: event.target.value })} placeholder="Quote text" aria-label="Quote text" className="font-serif text-[22px] italic leading-snug text-ink placeholder:text-ink-subtle/70" />
      <input value={block.attribution ?? ""} onChange={(event) => onChange({ attribution: event.target.value })} placeholder="Who said it? (optional)" aria-label="Quote attribution" className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink-muted placeholder:text-ink-subtle/70 focus:outline-none" />
    </div>
  );
}
