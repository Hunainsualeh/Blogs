"use client";

import { useState } from "react";
import { CheckIcon, LinkIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function ShareActions({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const base = "inline-flex h-9 items-center justify-center rounded-sm px-3.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: "bg-[#1b64d6]" },
    { label: "X", href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`, color: "bg-black" },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: "bg-[#0a66c2]" },
    { label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`, color: "bg-[#cc1f2e]" },
    { label: "Reddit", href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, color: "bg-[#c93d00]" },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {links.map((link) => (
        <a key={link.label} className={cn(base, link.color)} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${link.label}`}>
          {link.label}
        </a>
      ))}
      <button type="button" className={cn(base, "gap-1.5 bg-dark")} onClick={copy} aria-label={copied ? "Link copied" : "Copy link"}>
        {copied ? <CheckIcon size={15} /> : <LinkIcon size={15} />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <span className="sr-only" role="status">{copied ? "Link copied to clipboard" : ""}</span>
    </div>
  );
}
