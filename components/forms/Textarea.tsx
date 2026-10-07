import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Field, controlClasses, fieldDescribedBy } from "./Field";

type TextareaProps = Omit<ComponentPropsWithoutRef<"textarea">, "id"> & {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  maxCount?: number;
  hideLabel?: boolean;
  fieldClassName?: string;
};

export function Textarea({ id, label, hint, error, optional, required, maxCount, hideLabel, fieldClassName, className, value, rows = 4, ...props }: TextareaProps) {
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      hideLabel={hideLabel}
      counter={maxCount ? { value: String(value ?? "").length, max: maxCount } : undefined}
      className={fieldClassName}
    >
      <textarea
        id={id}
        value={value}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescribedBy(id, error, hint)}
        className={cn(controlClasses(error), "resize-y py-3 leading-relaxed", className)}
        {...props}
      />
    </Field>
  );
}
