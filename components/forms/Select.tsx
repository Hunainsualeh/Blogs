import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { Field, controlClasses, fieldDescribedBy } from "./Field";

type SelectProps = Omit<ComponentPropsWithoutRef<"select">, "id"> & {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  hint?: ReactNode;
  error?: string;
  hideLabel?: boolean;
  fieldClassName?: string;
};

export function Select({ id, label, options, placeholder, hint, error, required, hideLabel, fieldClassName, className, ...props }: SelectProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} hideLabel={hideLabel} className={fieldClassName}>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={fieldDescribedBy(id, error, hint)}
          className={cn(controlClasses(error), "h-11 appearance-none pr-10", className)}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
      </div>
    </Field>
  );
}
