import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Field, controlClasses, fieldDescribedBy } from "./Field";

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "id"> & {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  maxCount?: number;
  hideLabel?: boolean;
  fieldClassName?: string;
};

export function Input({ id, label, hint, error, optional, required, maxCount, hideLabel, fieldClassName, className, value, ...props }: InputProps) {
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
      <input
        id={id}
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescribedBy(id, error, hint)}
        className={cn(controlClasses(error), "h-11", className)}
        {...props}
      />
    </Field>
  );
}
