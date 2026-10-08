import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8 shrink-0", className)} aria-hidden>
      <rect width="32" height="32" rx="4" fill={inverse ? "#FFFFFF" : "var(--theme-brand)"} />
      <circle cx="16" cy="16" r="8.5" fill="none" stroke={inverse ? "var(--theme-brand)" : "#FFFFFF"} strokeWidth="1.8" />
      <path d="M7.5 16h17M16 7.5c-3 2.4-4.4 5.2-4.4 8.5s1.4 6.1 4.4 8.5c3-2.4 4.4-5.2 4.4-8.5S19 9.9 16 7.5Z" fill="none" stroke={inverse ? "var(--theme-brand)" : "#FFFFFF"} strokeWidth="1.4" />
    </svg>
  );
}

export function Logo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label={`${siteConfig.name} home`}>
      <LogoMark inverse={inverse} />
      <span className={cn("text-[18px] font-semibold leading-none tracking-[-0.03em] sm:text-[21px]", inverse ? "text-white" : "text-brand")}>
        Global Insights <span className={cn("font-normal", inverse ? "text-white/70" : "text-ink-muted")}>Daily</span>
      </span>
    </Link>
  );
}
