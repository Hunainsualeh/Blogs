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
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11px] font-semibold uppercase tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}

export function CategoryLabel({ name, href, className }: { name: string; href?: string; inverse?: boolean; className?: string }) {
  const classes = cn("relative z-10 inline-flex w-fit items-center rounded-sm bg-brand px-2.5 py-1 text-[12px] font-medium leading-none text-white", className);
  if (!href) return <span className={classes}>{name}</span>;
  return (
    <Link href={href} className={cn(classes, "hover:bg-brand-strong")}>
      {name}
    </Link>
  );
}
