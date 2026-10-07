"use client";

import { useState } from "react";
import { SUBMISSION_LIMITS } from "@/lib/constants";
import { validateTag } from "@/lib/validation";
import { CloseIcon } from "@/components/ui/Icons";
import { Field, controlClasses } from "./Field";

type TagInputProps = {
  id: string;
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  error?: string;
};

export function TagInput({ id, label, tags, onChange, suggestions = [], error }: TagInputProps) {
  const [value, setValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  function add(tag: string) {
    const problem = validateTag(tag, tags);
    if (problem) {
      setLocalError(problem);
      return;
    }
    onChange([...tags, tag.trim()]);
    setValue("");
    setLocalError(null);
  }

  const available = suggestions.filter((suggestion) => !tags.some((tag) => tag.toLowerCase() === suggestion.toLowerCase())).slice(0, 6);

  return (
    <Field id={id} label={label} error={localError ?? error} hint={`Press Enter to add. Up to ${SUBMISSION_LIMITS.maxTags} tags.`} required counter={{ value: tags.length, max: SUBMISSION_LIMITS.maxTags }}>
      <div className={controlClasses(localError ?? error) + " flex min-h-11 flex-wrap items-center gap-1.5 px-2 py-1.5"}>
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-sm bg-brand-soft py-1 pl-2.5 pr-1 text-[13px] font-medium text-brand">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter((item) => item !== tag))} className="rounded-sm p-0.5 hover:bg-white" aria-label={`Remove tag ${tag}`}>
              <CloseIcon size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={value}
          disabled={tags.length >= SUBMISSION_LIMITS.maxTags}
          onChange={(event) => {
            setValue(event.target.value);
            setLocalError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              if (value.trim()) add(value);
            } else if (event.key === "Backspace" && !value && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          placeholder={tags.length >= SUBMISSION_LIMITS.maxTags ? "Tag limit reached" : tags.length ? "Add another" : "e.g. Nutrition"}
          className="h-8 min-w-[120px] flex-1 border-0 bg-transparent px-1.5 text-[15px] focus:outline-none"
        />
      </div>
      {available.length > 0 && tags.length < SUBMISSION_LIMITS.maxTags ? (
        <div className="flex flex-wrap gap-1.5">
          {available.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => add(suggestion)} className="rounded-sm border border-dashed border-line-strong px-2 py-0.5 text-[12.5px] text-ink-muted hover:border-brand hover:text-brand">
              + {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </Field>
  );
}
