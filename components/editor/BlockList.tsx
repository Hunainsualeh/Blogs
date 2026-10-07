"use client";

import type { ContentBlock } from "@/types/article";
import type { FieldErrors } from "@/types/submission";
import { blockTypeLabels } from "@/lib/editor";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@/components/ui/Icons";
import { CalloutBlock } from "./CalloutBlock";
import { CodeBlock } from "./CodeBlock";
import { EmbedBlock } from "./EmbedBlock";
import { HeadingBlock } from "./HeadingBlock";
import { ImageBlock } from "./ImageBlock";
import { InsertBlockMenu } from "./InsertBlockMenu";
import { LinkBlock } from "./LinkBlock";
import { ListBlock } from "./ListBlock";
import { ParagraphBlock } from "./ParagraphBlock";
import { QuoteBlock } from "./QuoteBlock";

type BlockListProps = {
  blocks: ContentBlock[];
  errors: FieldErrors;
  onInsert: (index: number, block: ContentBlock) => void;
  onUpdate: (id: string, patch: Partial<ContentBlock>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
};

function BlockEditor({ block, onChange, error }: { block: ContentBlock; onChange: (patch: Partial<ContentBlock>) => void; error?: string }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock block={block} onChange={onChange} />;
    case "heading":
      return <HeadingBlock block={block} onChange={onChange} />;
    case "image":
      return <ImageBlock block={block} onChange={onChange} error={error} />;
    case "quote":
      return <QuoteBlock block={block} onChange={onChange} />;
    case "list":
      return <ListBlock block={block} onChange={onChange} />;
    case "code":
      return <CodeBlock block={block} onChange={onChange} />;
    case "callout":
      return <CalloutBlock block={block} onChange={onChange} />;
    case "link":
      return <LinkBlock block={block} onChange={onChange} error={error} />;
    case "embed":
      return <EmbedBlock block={block} onChange={onChange} error={error} />;
    case "divider":
      return (
        <div className="flex justify-center gap-3 py-4" aria-label="Divider">
          <span className="h-1 w-1 rounded-full bg-ink-subtle" />
          <span className="h-1 w-1 rounded-full bg-ink-subtle" />
          <span className="h-1 w-1 rounded-full bg-ink-subtle" />
        </div>
      );
  }
}

export function BlockList({ blocks, errors, onInsert, onUpdate, onRemove, onMove }: BlockListProps) {
  const controlClass = "inline-flex h-7 w-7 items-center justify-center rounded-sm text-ink-subtle hover:bg-surface-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div>
      <InsertBlockMenu onInsert={(block) => onInsert(0, block)} />
      {blocks.map((block, index) => {
        const error = errors[`block:${block.id}`];
        return (
          <div key={block.id}>
            <div id={`block-${block.id}`} className={cn("group/block relative rounded-md border px-4 pb-4 pt-9 transition-colors sm:px-5", error ? "border-danger/50 bg-[#FFFBFA]" : "border-transparent hover:border-line focus-within:border-line")}>
              <div className="absolute inset-x-3 top-1.5 flex items-center justify-between">
                <span className="kicker !text-[10px] text-ink-subtle">
                  {block.type === "heading" ? `Heading ${block.level}` : block.type === "list" ? (block.style === "ordered" ? "Numbered list" : "Bulleted list") : blockTypeLabels[block.type]}
                </span>
                <div className="flex items-center gap-0.5 opacity-100 transition-opacity lg:opacity-0 lg:group-hover/block:opacity-100 lg:group-focus-within/block:opacity-100">
                  <button type="button" className={controlClass} onClick={() => onMove(block.id, -1)} disabled={index === 0} aria-label="Move block up">
                    <ArrowUpIcon size={15} />
                  </button>
                  <button type="button" className={controlClass} onClick={() => onMove(block.id, 1)} disabled={index === blocks.length - 1} aria-label="Move block down">
                    <ArrowDownIcon size={15} />
                  </button>
                  <button type="button" className={cn(controlClass, "hover:text-danger")} onClick={() => onRemove(block.id)} aria-label="Delete block">
                    <TrashIcon size={15} />
                  </button>
                </div>
              </div>
              <BlockEditor block={block} onChange={(patch) => onUpdate(block.id, patch)} error={error} />
              {error && block.type !== "image" && block.type !== "link" && block.type !== "embed" ? <p className="mt-2 text-[13px] text-danger">{error}</p> : null}
            </div>
            <InsertBlockMenu onInsert={(newBlock) => onInsert(index + 1, newBlock)} />
          </div>
        );
      })}
      {blocks.length === 0 ? (
        <div className="py-6">
          <InsertBlockMenu variant="button" label="Add your first block" onInsert={(block) => onInsert(0, block)} />
        </div>
      ) : null}
    </div>
  );
}
