import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SidebarWidget({ title, children, className, variant = "plain" }: { title: string; children: ReactNode; className?: string; variant?: "plain" | "card" }) {
  if (variant === "card") {
    return (
      <section aria-label={title} className={cn("overflow-hidden rounded-sm border border-line bg-white", className)}>
        <h2 className="border-b border-line bg-brand-soft px-5 py-3.5 text-[16px] font-semibold text-ink">{title}</h2>
        <div className="px-5 py-1">{children}</div>
      </section>
    );
  }
  return (
    <section aria-label={title} className={className}>
      <div className="mb-4 border-b border-line">
        <h2 className="-mb-px inline-block border-b-2 border-ink pb-3 text-[15px] font-semibold leading-none text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}
