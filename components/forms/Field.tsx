import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertIcon } from "@/components/ui/Icons";

type FieldProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  optional?: boolean;
  counter?: { value: number; max: number };
  hideLabel?: boolean;
  children: ReactNode;
  className?: string;
};

export function Field({ id, label, hint, error, required, optional, counter, hideLabel, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn("flex items-baseline justify-between gap-3", hideLabel && "sr-only")}>
        <label htmlFor={id} className="text-[13.5px] font-medium text-ink">
          {label}
          {required ? <span className="ml-0.5 text-danger" aria-hidden>*</span> : null}
          {optional ? <span className="ml-1.5 text-xs font-normal text-ink-subtle">Optional</span> : null}
        </label>
        {counter ? (
          <span className={cn("font-mono text-[11px] tabular-nums", counter.value > counter.max ? "text-danger" : "text-ink-subtle")}>
            {counter.value}/{counter.max}
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-[13px] text-danger" role="alert">
          <AlertIcon size={14} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] leading-relaxed text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export function fieldDescribedBy(id: string, error?: string, hint?: ReactNode) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export const controlClasses = (error?: string) =>
  cn(
    "w-full rounded-md border bg-white px-3.5 text-[15px] text-ink placeholder:text-ink-subtle transition-shadow focus:outline-none focus:ring-4",
    error ? "border-danger focus:ring-danger/10" : "border-line-strong focus:border-brand focus:ring-brand-soft",
  );
