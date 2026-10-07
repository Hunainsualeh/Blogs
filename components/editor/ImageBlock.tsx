"use client";

import type { ImageBlock as ImageBlockType } from "@/types/article";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Input } from "@/components/forms/Input";
import type { BlockEditorProps } from "./types";

export function ImageBlock({ block, onChange, error }: BlockEditorProps<ImageBlockType>) {
  return (
    <div className="space-y-4">
      <ImageUploader value={block.src || null} onChange={(src) => onChange({ src: src ?? "" })} ratio="3/2" label="Add an image here" error={!block.src ? error : undefined} />
      {block.src ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id={`${block.id}-alt`} label="Alt text" required value={block.alt} onChange={(event) => onChange({ alt: event.target.value })} placeholder="Describe what the image shows" error={block.src && !block.alt.trim() ? error : undefined} hint="Helps screen reader users and search engines." />
          <Input id={`${block.id}-caption`} label="Caption" optional value={block.caption ?? ""} onChange={(event) => onChange({ caption: event.target.value })} placeholder="Shown below the image" />
        </div>
      ) : null}
    </div>
  );
}
