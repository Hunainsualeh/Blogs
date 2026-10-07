"use client";

import { useLayoutEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function AutoTextarea({ className, value, ...props }: ComponentPropsWithoutRef<"textarea">) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);
  return <textarea ref={ref} rows={1} value={value} className={cn("w-full resize-none overflow-hidden border-0 bg-transparent p-0 focus:outline-none focus:ring-0", className)} {...props} />;
}
