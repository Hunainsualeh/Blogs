import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SidebarWidget({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section aria-label={title} className={cn("rounded-md border border-line bg-white", className)}>
      <h2 className="border-b border-line px-5 py-3.5 text-[17px] font-semibold tracking-[-0.015em] text-ink">
        <span className="mr-2.5 inline-block h-4 w-[3px] translate-y-[3px] bg-brand" aria-hidden />
        {title}
      </h2>
      <div className="p-5">{children}</div>
    </section>
  );
}
