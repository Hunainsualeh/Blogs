"use client";

import { cn } from "@/lib/utils";

export function MenuButton({ open, onClick, controls }: { open: boolean; onClick: () => void; controls: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Close menu" : "Open menu"}
      className="group inline-flex h-10 items-center gap-3 rounded-md pr-2 pl-1 text-ink hover:text-brand"
    >
      <span className="relative block h-3.5 w-6" aria-hidden>
        <span className={cn("absolute left-0 top-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300", open && "top-1/2 -translate-y-1/2 rotate-45")} />
        <span className={cn("absolute bottom-0 left-0 h-[2px] rounded-full bg-current transition-all duration-300", open ? "bottom-1/2 w-6 translate-y-1/2 -rotate-45" : "w-4 group-hover:w-6")} />
      </span>
      <span className="kicker hidden sm:inline">{open ? "Close" : "Menu"}</span>
    </button>
  );
}
