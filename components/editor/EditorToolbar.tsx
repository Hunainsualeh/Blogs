"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EyeIcon, PenIcon } from "@/components/ui/Icons";

export type EditorMode = "write" | "preview";

type EditorToolbarProps = {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  wordCount: number;
  saveStatus: string;
  submitting: boolean;
  onSubmit: () => void;
};

export function EditorToolbar({ mode, onModeChange, wordCount, saveStatus, submitting, onSubmit }: EditorToolbarProps) {
  return (
    <div className="sticky top-[var(--header-height,64px)] z-30 -mx-4 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-md bg-surface-muted p-1" role="tablist" aria-label="Editor mode">
          {(["write", "preview"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => onModeChange(value)}
              className={cn("inline-flex h-8 items-center gap-1.5 rounded-[4px] px-3 text-[13px] font-medium transition-colors", mode === value ? "bg-white text-brand shadow-sm" : "text-ink-muted hover:text-ink")}
            >
              {value === "write" ? <PenIcon size={14} /> : <EyeIcon size={14} />}
              {value === "write" ? "Write" : "Preview"}
            </button>
          ))}
        </div>
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 text-[12.5px] text-ink-subtle md:flex">
          <span className="font-mono tabular-nums">{wordCount} words</span>
          <span aria-hidden>·</span>
          <span className="truncate" role="status">{saveStatus}</span>
        </div>
        <Button size="sm" onClick={onSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit for review"}
        </Button>
      </div>
      <p className="mt-2 flex gap-3 text-[12px] text-ink-subtle md:hidden">
        <span className="font-mono">{wordCount} words</span>
        <span className="truncate">{saveStatus}</span>
      </p>
    </div>
  );
}
