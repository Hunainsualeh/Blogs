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

export function SectionHeading({ title, description, href, linkLabel = "View all", as: Tag = "h2", className, aside, id }: SectionHeadingProps) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4 border-b border-line", className)}>
      <div className="-mb-px">
        <Tag id={id} className="inline-block border-b-2 border-brand pb-3 text-[18px] font-semibold leading-none tracking-[-0.01em] text-ink">
          {title}
        </Tag>
      </div>
      {description ? <p className="hidden pb-3 text-[13.5px] text-ink-subtle md:block">{description}</p> : null}
      {aside}
      {href ? (
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1.5 pb-3 text-[13.5px] font-medium text-brand hover:text-brand-strong">
          {linkLabel}
          <ArrowRightIcon size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
