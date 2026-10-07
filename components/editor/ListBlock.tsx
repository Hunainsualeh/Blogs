"use client";

import type { ListBlock as ListBlockType } from "@/types/article";
import { cn } from "@/lib/utils";
import { CloseIcon, PlusIcon } from "@/components/ui/Icons";
import type { BlockEditorProps } from "./types";

export function ListBlock({ block, onChange }: BlockEditorProps<ListBlockType>) {
  function update(index: number, value: string) {
    onChange({ items: block.items.map((item, i) => (i === index ? value : item)) });
  }
  return (
    <div>
      <div className="mb-3 flex overflow-hidden rounded-sm border border-line text-xs font-medium w-fit" role="group" aria-label="List style">
        {(["unordered", "ordered"] as const).map((style) => (
          <button key={style} type="button" onClick={() => onChange({ style })} aria-pressed={block.style === style} className={cn("px-2.5 py-1", block.style === style ? "bg-brand text-white" : "bg-white text-ink-muted")}>
            {style === "ordered" ? "Numbered" : "Bulleted"}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {block.items.map((item, index) => (
          <li key={index} className="flex items-center gap-3">
            <span className="w-6 shrink-0 text-right font-mono text-sm text-brand">{block.style === "ordered" ? `${index + 1}.` : "•"}</span>
            <input
              value={item}
              onChange={(event) => update(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const items = [...block.items];
                  items.splice(index + 1, 0, "");
                  onChange({ items });
                  window.requestAnimationFrame(() => {
                    const inputs = event.currentTarget.closest("ul")?.querySelectorAll("input");
                    inputs?.[index + 1]?.focus();
                  });
                }
              }}
              placeholder="List item"
              aria-label={`List item ${index + 1}`}
              className="flex-1 border-0 border-b border-transparent bg-transparent py-1 font-serif text-[18px] text-ink placeholder:text-ink-subtle/70 focus:border-line focus:outline-none"
            />
            {block.items.length > 1 ? (
              <button type="button" onClick={() => onChange({ items: block.items.filter((_, i) => i !== index) })} aria-label={`Remove item ${index + 1}`} className="rounded-sm p-1 text-ink-subtle hover:text-danger">
                <CloseIcon size={14} />
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onChange({ items: [...block.items, ""] })} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
        <PlusIcon size={14} /> Add item
      </button>
    </div>
  );
}
