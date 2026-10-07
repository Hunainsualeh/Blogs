"use client";

import type { LinkBlock as LinkBlockType } from "@/types/article";
import { Input } from "@/components/forms/Input";
import type { BlockEditorProps } from "./types";

export function LinkBlock({ block, onChange, error }: BlockEditorProps<LinkBlockType>) {
  return (
    <div className="grid gap-4 rounded-md border border-line p-4 sm:grid-cols-2">
      <Input id={`${block.id}-href`} label="URL" type="url" value={block.href} onChange={(event) => onChange({ href: event.target.value.trim() })} placeholder="https://" error={error} />
      <Input id={`${block.id}-label`} label="Link title" value={block.label} onChange={(event) => onChange({ label: event.target.value })} placeholder="Name of the resource" />
      <Input id={`${block.id}-description`} label="Description" optional fieldClassName="sm:col-span-2" value={block.description ?? ""} onChange={(event) => onChange({ description: event.target.value })} placeholder="Why it is worth reading" />
    </div>
  );
}
