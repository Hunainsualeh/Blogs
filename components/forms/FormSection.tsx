"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/ui/Icons";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  badge?: ReactNode;
  className?: string;
};

export function FormSection({ title, description, children, collapsible = false, defaultOpen = true, badge, className }: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section className={cn("border-b border-line py-6 first:pt-0 last:border-b-0", className)}>
      {collapsible ? (
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={contentId} className="flex w-full items-center justify-between gap-4 text-left">
          <span>
            <span className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-ink">{title}{badge}</span>
            {description ? <span className="mt-0.5 block text-[13px] text-ink-subtle">{description}</span> : null}
          </span>
          <ChevronDownIcon size={18} className={cn("shrink-0 text-ink-subtle transition-transform", open && "rotate-180")} />
        </button>
      ) : (
        <div>
          <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-ink">{title}{badge}</h3>
          {description ? <p className="mt-0.5 text-[13px] text-ink-subtle">{description}</p> : null}
        </div>
      )}
      <div id={contentId} hidden={collapsible && !open} className="mt-5 space-y-5">
        {children}
      </div>
    </section>
  );
}
