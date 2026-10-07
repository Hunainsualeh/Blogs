import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center rounded-lg border border-dashed border-line-strong px-6 py-14 text-center", className)}>
      {icon ? <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">{icon}</div> : null}
      <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
