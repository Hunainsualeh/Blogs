"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon } from "./Icons";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  hideTitle?: boolean;
  children: ReactNode;
  placement?: "center" | "top";
  className?: string;
};

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

export function Modal({ open, onClose, title, hideTitle = false, children, placement = "center", className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusable = panel?.querySelector<HTMLElement>("input, textarea, button, a[href], [tabindex]:not([tabindex='-1'])");
    focusable?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab" && panel) {
        const items = [...panel.querySelectorAll<HTMLElement>("input, textarea, select, button, a[href], [tabindex]:not([tabindex='-1'])")].filter(
          (element) => !element.hasAttribute("disabled"),
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-[80] flex justify-center", placement === "center" ? "items-center p-4" : "items-start")}>
      <div className="absolute inset-0 bg-[#00142b]/55 [animation:fade-in_200ms_ease_both]" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full bg-white [animation:slide-down_260ms_cubic-bezier(0.2,0.7,0.2,1)_both]",
          placement === "center" ? "max-w-lg rounded-lg p-6" : "max-h-[100dvh] overflow-y-auto",
          className,
        )}
      >
        {!hideTitle ? (
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <button type="button" onClick={onClose} className="-m-2 rounded-md p-2 text-ink-muted hover:text-ink" aria-label="Close dialog">
              <CloseIcon />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
