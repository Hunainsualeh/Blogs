"use client";

import { blockCatalog, createBlock } from "@/lib/editor";
import type { ContentBlock } from "@/types/article";
import { cn } from "@/lib/utils";
import { Dropdown } from "@/components/ui/Dropdown";
import { PlusIcon } from "@/components/ui/Icons";
import { BlockIcon } from "./BlockIcon";

type InsertBlockMenuProps = {
  onInsert: (block: ContentBlock) => void;
  variant?: "line" | "button";
  label?: string;
};

export function InsertBlockMenu({ onInsert, variant = "line", label = "Add block" }: InsertBlockMenuProps) {
  const items = blockCatalog.map((entry) => ({
    key: entry.kind,
    label: entry.label,
    description: entry.description,
    icon: <BlockIcon kind={entry.kind} />,
    onSelect: () => onInsert(createBlock(entry.kind)),
  }));

  return (
    <Dropdown
      label="Insert a block"
      items={items}
      columns={2}
      align={variant === "line" ? "center" : "start"}
      className={variant === "line" ? "flex w-full justify-center" : "block w-full"}
      trigger={({ open, toggle, id }) =>
        variant === "line" ? (
          <div className="group/insert relative flex h-8 w-full items-center justify-center">
            <span className={cn("absolute inset-x-0 top-1/2 h-px bg-brand/30 transition-opacity", open ? "opacity-100" : "opacity-0 group-hover/insert:opacity-100 group-focus-within/insert:opacity-100")} />
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={id}
              aria-label="Insert block here"
              className={cn("relative z-10 inline-flex h-7 items-center gap-1 rounded-full border bg-white px-2.5 text-xs font-medium transition-all", open ? "border-brand text-brand opacity-100" : "border-line text-ink-subtle opacity-60 hover:border-brand hover:text-brand hover:opacity-100 focus:opacity-100")}
            >
              <PlusIcon size={14} /> Insert
            </button>
          </div>
        ) : (
          <button type="button" onClick={toggle} aria-expanded={open} aria-controls={id} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-line-strong text-sm font-medium text-ink-muted hover:border-brand hover:text-brand">
            <PlusIcon size={16} /> {label}
          </button>
        )
      }
    />
  );
}
