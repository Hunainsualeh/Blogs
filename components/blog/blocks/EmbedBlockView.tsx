"use client";

import { useState } from "react";
import type { EmbedBlock } from "@/types/article";
import { ArrowUpRightIcon, PlayIcon } from "@/components/ui/Icons";

export function getEmbedSource(url: string, provider: EmbedBlock["provider"]) {
  try {
    const parsed = new URL(url);
    if (provider === "youtube") {
      const id = parsed.hostname.includes("youtu.be") ? parsed.pathname.slice(1) : parsed.searchParams.get("v") ?? parsed.pathname.split("/").pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : null;
    }
    if (provider === "vimeo") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
  } catch {
    return null;
  }
  return null;
}

const providerNames: Record<EmbedBlock["provider"], string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  x: "X post",
  other: "External media",
};

export function EmbedBlockView({ block }: { block: EmbedBlock }) {
  const [loaded, setLoaded] = useState(false);
  const source = getEmbedSource(block.url, block.provider);

  if (loaded && source) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-sm bg-black">
        <iframe src={source} title={block.title ?? "Embedded media"} className="absolute inset-0 h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      </div>
    );
  }

  return (
    <div className="relative flex aspect-video flex-col items-center justify-center gap-4 overflow-hidden rounded-sm bg-brand px-6 text-center text-white">
      <span className="kicker text-white/70">{providerNames[block.provider]}</span>
      <p className="max-w-md text-lg font-semibold tracking-tight">{block.title || "Embedded media"}</p>
      {source ? (
        <button type="button" onClick={() => setLoaded(true)} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-brand hover:bg-brand-soft">
          <PlayIcon size={16} /> Load media
        </button>
      ) : (
        <a href={block.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-brand hover:bg-brand-soft">
          Open media <ArrowUpRightIcon size={16} />
        </a>
      )}
      <p className="text-xs text-white/60">Media loads only when you choose to play it.</p>
    </div>
  );
}
