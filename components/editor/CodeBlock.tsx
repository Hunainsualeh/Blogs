"use client";

import type { CodeBlock as CodeBlockType } from "@/types/article";
import type { BlockEditorProps } from "./types";

export function CodeBlock({ block, onChange }: BlockEditorProps<CodeBlockType>) {
  return (
    <div className="overflow-hidden rounded-md bg-[#071a33]">
      <input value={block.language} onChange={(event) => onChange({ language: event.target.value })} placeholder="Language (e.g. javascript)" aria-label="Code language" className="w-full border-b border-white/10 bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/70 placeholder:text-white/40 focus:outline-none" />
      <textarea value={block.content} onChange={(event) => onChange({ content: event.target.value })} placeholder="Paste or write code" aria-label="Code" rows={6} spellCheck={false} className="w-full resize-y bg-transparent p-4 font-mono text-[13.5px] leading-relaxed text-[#dbe7f7] placeholder:text-white/40 focus:outline-none" />
    </div>
  );
}
