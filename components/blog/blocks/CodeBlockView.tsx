"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/Icons";

export function CodeBlockView({ language, content }: { language: string; content: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-[#0f2a4a] bg-[#071a33]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="kicker text-white/60">{language || "code"}</span>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white">
          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13.5px] leading-relaxed text-[#dbe7f7]">
        <code className="font-mono">{content}</code>
      </pre>
    </div>
  );
}
