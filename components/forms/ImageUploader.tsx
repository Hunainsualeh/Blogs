"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { validateImageFile } from "@/lib/validation";
import { ImageIcon, TrashIcon, UploadIcon } from "@/components/ui/Icons";

const MAX_DIMENSION = 1920;

async function optimizeImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    return blob && blob.type === "image/webp" && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", await optimizeImage(file), file.name);
  const response = await fetch("/api/upload", { method: "POST", body });
  const data = (await response.json()) as { ok: boolean; url?: string; error?: string };
  if (!data.ok || !data.url) throw new Error(data.error ?? "That image could not be uploaded.");
  return data.url;
}

type ImageUploaderProps = {
  value: string | null;
  onChange: (src: string | null, file?: File) => void;
  label?: string;
  error?: string;
  ratio?: "16/9" | "3/2";
  compact?: boolean;
};

export function ImageUploader({ value, onChange, label = "Upload image", error, ratio = "16/9", compact = false }: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const issue = validateImageFile(file);
    if (issue) {
      setProblem(issue);
      return;
    }
    setBusy(true);
    try {
      const url = await uploadImage(file);
      setProblem(null);
      onChange(url, file);
    } catch (error) {
      setProblem(error instanceof Error ? error.message : "That image could not be uploaded. Try another file.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const message = problem ?? error;
  const aspect = ratio === "16/9" ? "aspect-[16/9]" : "aspect-[3/2]";

  return (
    <div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {value ? (
        <div className="group relative">
          <div className={cn("relative overflow-hidden rounded-sm bg-surface-muted", aspect)}>
            <Image src={value} alt="Uploaded preview" fill sizes="(min-width: 1024px) 680px, 100vw" className="object-cover" />
          </div>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-white px-3 text-[13px] font-medium text-ink hover:border-ink">
              <UploadIcon size={14} /> Replace
            </button>
            <button type="button" onClick={() => onChange(null)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-white px-3 text-[13px] font-medium text-danger hover:border-danger">
              <TrashIcon size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFile(event.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed text-center transition-colors",
            compact ? "px-4 py-6" : cn(aspect, "px-6"),
            dragging ? "border-brand bg-brand-soft" : message ? "border-danger/50 bg-[#FDF5F4]" : "border-line-strong bg-surface-muted hover:border-brand hover:bg-brand-soft/50",
          )}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-sm">
            {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" /> : <ImageIcon size={20} />}
          </span>
          <span className="text-[14px] font-medium text-ink">{busy ? "Uploading image..." : label}</span>
          <span className="text-[12.5px] text-ink-subtle">Drag and drop or click to browse. JPG, PNG or WebP up to 4 MB.</span>
        </label>
      )}
      {message ? (
        <p className="mt-2 text-[13px] text-danger" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
