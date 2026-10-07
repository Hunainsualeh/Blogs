import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "inverse" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong border border-brand hover:border-brand-strong",
  secondary: "bg-brand-soft text-brand hover:bg-[#dbe5f1] border border-transparent",
  outline: "bg-white text-ink border border-line-strong hover:border-ink",
  ghost: "bg-transparent text-ink hover:bg-surface-muted border border-transparent",
  inverse: "bg-white text-brand hover:bg-brand-soft border border-white",
  danger: "bg-white text-danger border border-line-strong hover:border-danger",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2.5",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex select-none items-center justify-center whitespace-nowrap rounded-md font-medium tracking-[-0.01em] transition-colors duration-200 disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  children?: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };
type ButtonAsLink = CommonProps & Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", icon, iconPosition = "end", children, className, ...rest } = props;
  const content = (
    <>
      {icon && iconPosition === "start" ? icon : null}
      {children}
      {icon && iconPosition === "end" ? icon : null}
    </>
  );
  const classes = buttonClasses(variant, size, className);

  if (typeof rest.href === "string") {
    const { href, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as ComponentPropsWithoutRef<"button">;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
