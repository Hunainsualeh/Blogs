import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ inverse = false, size = "md", className }: { inverse?: boolean; size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "text-[20px]", md: "text-[24px]", lg: "text-[44px]" };
  return (
    <Link href="/" className={cn("inline-block font-bold leading-none tracking-[-0.035em]", sizes[size], className)} aria-label={`${siteConfig.name} home`}>
      <span className={inverse ? "text-white" : "text-brand"}>Global Insights</span>{" "}
      <span className={inverse ? "text-white/80" : "text-ink"}>Daily</span>
    </Link>
  );
}
