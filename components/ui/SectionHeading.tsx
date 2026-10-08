import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "./Icons";

type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  as?: "h2" | "h3";
  inverse?: boolean;
  className?: string;
  aside?: ReactNode;
  id?: string;
};

export function SectionHeading({ title, eyebrow, description, href, linkLabel = "View all", as: Tag = "h2", inverse = false, className, aside, id }: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-end sm:justify-between", inverse ? "border-white/25" : "border-ink", className)}>
      <div>
        {eyebrow ? <p className={cn("kicker mb-2", inverse ? "text-white/70" : "text-ink-subtle")}>{eyebrow}</p> : null}
        <Tag id={id} className={cn("text-[28px] font-semibold leading-none tracking-[-0.03em] sm:text-[34px]", inverse ? "text-white" : "text-ink")}>{title}</Tag>
        {description ? <p className={cn("mt-3 max-w-xl text-[15px] leading-relaxed", inverse ? "text-white/75" : "text-ink-muted")}>{description}</p> : null}
      </div>
      {aside}
      {href ? (
        <Link href={href} className={cn("group inline-flex shrink-0 items-center gap-2 text-sm font-medium", inverse ? "text-white" : "text-brand")}>
          <span className="link-underline">{linkLabel}</span>
          <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
