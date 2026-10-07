import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "neutral" | "success" | "warning" | "danger" | "inverse";

const tones: Record<BadgeTone, string> = {
  brand: "bg-brand-soft text-brand",
  neutral: "bg-surface-muted text-ink-muted",
  success: "bg-[#E7F5EE] text-success",
  warning: "bg-[#FDF3E1] text-warning",
  danger: "bg-[#FDECEA] text-danger",
  inverse: "bg-white/15 text-white",
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return (
    <span className={cn("kicker inline-flex items-center gap-1.5 rounded-sm px-2 py-1 !text-[10px]", tones[tone], className)}>
      {children}
    </span>
  );
}

export function CategoryLabel({
  name,
  href,
  inverse = false,
  className,
}: {
  name: string;
  href?: string;
  inverse?: boolean;
  className?: string;
}) {
  const classes = cn("kicker inline-flex items-center gap-2", inverse ? "text-white" : "text-brand", className);
  const content = (
    <>
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", inverse ? "bg-white" : "bg-accent")} />
      {name}
    </>
  );
  if (!href) {
    return <span className={classes}>{content}</span>;
  }
  return (
    <Link href={href} className={cn(classes, "hover:opacity-75 transition-opacity relative z-10")}>
      {content}
    </Link>
  );
}
