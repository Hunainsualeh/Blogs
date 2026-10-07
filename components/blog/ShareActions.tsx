"use client";

import { useState } from "react";
import { CheckIcon, LinkIcon, MailIcon, ShareIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function ShareActions({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const buttonClass = "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-brand hover:text-brand";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        return;
      }
    } else {
      await copy();
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="kicker mr-1 text-ink-subtle">Share</span>
      <a className={buttonClass} href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <span className="text-[13px] font-semibold">X</span>
      </a>
      <a className={buttonClass} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
        <span className="text-[12px] font-semibold">in</span>
      </a>
      <a className={buttonClass} href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} aria-label="Share by email">
        <MailIcon size={16} />
      </a>
      <button type="button" className={buttonClass} onClick={copy} aria-label={copied ? "Link copied" : "Copy link"}>
        {copied ? <CheckIcon size={16} /> : <LinkIcon size={16} />}
      </button>
      <button type="button" className={cn(buttonClass, "sm:hidden")} onClick={nativeShare} aria-label="More sharing options">
        <ShareIcon size={16} />
      </button>
      <span className="sr-only" role="status">{copied ? "Link copied to clipboard" : ""}</span>
    </div>
  );
}
