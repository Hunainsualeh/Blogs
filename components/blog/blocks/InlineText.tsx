import { Fragment, type ReactNode } from "react";

const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function isSafeHref(href: string) {
  return /^(https?:\/\/|\/|#|mailto:)/i.test(href);
}

export function InlineText({ text }: { text: string }) {
  const parts = text.split(pattern).filter((part) => part !== "");
  const nodes: ReactNode[] = parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="rounded-sm bg-surface-muted px-1.5 py-0.5 font-mono text-[0.85em] text-brand">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link && isSafeHref(link[2])) {
      const external = /^https?:\/\//i.test(link[2]);
      return (
        <a key={index} href={link[2]} className="text-brand underline decoration-brand/30 underline-offset-[3px] hover:decoration-brand" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {link[1]}
        </a>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
  return <>{nodes}</>;
}
