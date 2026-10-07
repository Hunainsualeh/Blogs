import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <rect width="32" height="32" rx="6" fill={inverse ? "#FFFFFF" : "var(--theme-brand)"} />
      <path d="M9 23V9l14 14V9" fill="none" stroke={inverse ? "var(--theme-brand)" : "#FFFFFF"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label={`${siteConfig.name} home`}>
      <LogoMark inverse={inverse} />
      <span className={cn("text-[22px] font-semibold tracking-[-0.04em]", inverse ? "text-white" : "text-brand")}>{siteConfig.name}</span>
    </Link>
  );
}
