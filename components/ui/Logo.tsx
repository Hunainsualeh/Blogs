import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { mark: 30, text: "text-[19px]", gap: "gap-2" },
  md: { mark: 36, text: "text-[23px]", gap: "gap-2.5" },
  lg: { mark: 56, text: "text-[42px]", gap: "gap-3.5" },
};

export function LogoMark({ size = 32, className, priority = false }: { size?: number; className?: string; priority?: boolean }) {
  return <Image src="/logo-mark-128.png" alt="" width={size} height={size} unoptimized priority={priority} className={cn("shrink-0 rounded-full", className)} />;
}

export function Logo({ inverse = false, size = "md", className }: { inverse?: boolean; size?: "sm" | "md" | "lg"; className?: string }) {
  const config = sizes[size];
  return (
    <Link href="/" className={cn("inline-flex items-center font-bold leading-none tracking-[-0.035em]", config.gap, className)} aria-label={`${siteConfig.name} home`}>
      <LogoMark size={config.mark} priority={size === "lg"} className={inverse ? "bg-white" : undefined} />
      <span className={config.text}>
        <span className={inverse ? "text-white" : "text-brand"}>Global Insights</span>{" "}
        <span className={inverse ? "text-white/80" : "text-ink"}>Daily</span>
      </span>
    </Link>
  );
}
