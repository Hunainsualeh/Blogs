"use client";

import { useSyncExternalStore } from "react";
import type { AdFormat } from "@/types/settings";
import { cn } from "@/lib/utils";
import { readAdPreview, subscribeAdPreview } from "./adPreviewStore";

export function AdPreview({ placement, format, className }: { placement: string; format: AdFormat; className?: string }) {
  const enabled = useSyncExternalStore(subscribeAdPreview, readAdPreview, () => false);
  if (!enabled) return null;
  return (
    <aside className={cn("ad-slot", className)} data-format={format} data-placement={placement} aria-label="Advertisement placement preview">
      <p className="ad-label">Advertisement</p>
      <div className="ad-box flex items-center justify-center border border-dashed border-line-strong">
        <p className="px-4 text-[13px] text-ink-subtle">Ad placement preview: {placement}. Only you can see this in this browser.</p>
      </div>
    </aside>
  );
}
