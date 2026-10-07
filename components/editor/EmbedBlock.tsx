"use client";

import type { EmbedBlock as EmbedBlockType } from "@/types/article";
import { detectEmbedProvider } from "@/lib/editor";
import { Input } from "@/components/forms/Input";
import { PlayIcon } from "@/components/ui/Icons";
import type { BlockEditorProps } from "./types";

export function EmbedBlock({ block, onChange, error }: BlockEditorProps<EmbedBlockType>) {
  return (
    <div className="rounded-md border border-dashed border-line-strong bg-surface-muted p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-medium text-ink"><PlayIcon size={16} /> Media embed</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id={`${block.id}-url`} label="Media URL" type="url" value={block.url} onChange={(event) => onChange({ url: event.target.value.trim(), provider: detectEmbedProvider(event.target.value) })} placeholder="YouTube or Vimeo link" error={error} hint="Readers load the media only when they press play." />
        <Input id={`${block.id}-title`} label="Title" optional value={block.title ?? ""} onChange={(event) => onChange({ title: event.target.value })} placeholder="What is this media?" />
      </div>
    </div>
  );
}
