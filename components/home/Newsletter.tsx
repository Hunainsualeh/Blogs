"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { isValidEmail } from "@/lib/validation";
import { CheckIcon, MailIcon } from "@/components/ui/Icons";

type NewsletterProps = {
  title?: string;
  description?: string;
  variant?: "band" | "inline";
  className?: string;
};

type Status = { type: "idle" | "loading" | "success" | "error"; message?: string };

export function Newsletter({
  title = "Stay ahead of what matters.",
  description = "The most important stories in technology, business, health, travel and culture, delivered to your inbox every weekday morning.",
  variant = "band",
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setStatus({ type: "error", message: "Enter a valid email address." });
      return;
    }
    setStatus({ type: "loading" });
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string; alreadySubscribed?: boolean };
      if (!data.ok) {
        setStatus({ type: "error", message: data.error ?? "Something went wrong. Please try again." });
        return;
      }
      setStatus({ type: "success", message: data.alreadySubscribed ? "You are already on the list. Thanks for reading." : "Thanks for subscribing. Look out for the next edition." });
      setEmail("");
    } catch {
      setStatus({ type: "error", message: "We could not reach the server. Please try again." });
    }
  }

  const band = variant === "band";

  return (
    <section aria-label="Newsletter signup" className={cn(band ? "rounded-md bg-brand px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14" : "rounded-md border border-line bg-surface-muted p-6 sm:p-8", className)}>
      <div className={cn("grid gap-8", band && "lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16")}>
        <div>
          <p className={cn("kicker mb-3 flex items-center gap-2", band ? "text-white/60" : "text-ink-subtle")}>
            <MailIcon size={14} /> The Northline Brief
          </p>
          <h2 className={cn("font-semibold tracking-[-0.035em]", band ? "text-[32px] leading-[1.05] sm:text-[44px]" : "text-[24px] leading-tight text-ink")}>{title}</h2>
          <p className={cn("mt-3 max-w-lg text-[15.5px] leading-relaxed", band ? "text-white/75" : "text-ink-muted")}>{description}</p>
        </div>
        <div>
          {status.type === "success" ? (
            <p className={cn("flex items-start gap-3 rounded-md p-4 text-[15px]", band ? "bg-white/10 text-white" : "bg-white text-ink")} role="status">
              <CheckIcon className="mt-0.5 shrink-0" /> {status.message}
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor={`newsletter-${variant}`} className="sr-only">
                Email address
              </label>
              <input
                id={`newsletter-${variant}`}
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status.type === "error") setStatus({ type: "idle" });
                }}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={status.type === "error"}
                className={cn(
                  "h-12 flex-1 rounded-md border px-4 text-[15px] focus:outline-none focus:ring-4",
                  band ? "border-white/25 bg-white/10 text-white placeholder:text-white/50 focus:border-white focus:ring-white/15" : "border-line-strong bg-white text-ink focus:border-brand focus:ring-brand-soft",
                )}
              />
              <button
                type="submit"
                disabled={status.type === "loading"}
                className={cn("h-12 rounded-md px-6 text-[15px] font-medium transition-colors disabled:opacity-60", band ? "bg-white text-brand hover:bg-brand-soft" : "bg-brand text-white hover:bg-brand-strong")}
              >
                {status.type === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          {status.type === "error" ? (
            <p className={cn("mt-2 text-[13px]", band ? "text-[#ffd2cc]" : "text-danger")} role="alert">
              {status.message}
            </p>
          ) : (
            <p className={cn("mt-3 text-[12.5px]", band ? "text-white/50" : "text-ink-subtle")}>Free. One email a day. Unsubscribe anytime.</p>
          )}
        </div>
      </div>
    </section>
  );
}
