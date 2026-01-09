"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  size?: "sm" | "md";
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = "default", size = "sm", className, style }: BadgeProps) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        {
          "bg-background-tertiary text-foreground-muted": variant === "default",
          "bg-success/20 text-success": variant === "success",
          "bg-warning/20 text-warning": variant === "warning",
          "bg-danger/20 text-danger": variant === "danger",
          "bg-accent/20 text-accent": variant === "info",
          "bg-primary/20 text-primary": variant === "purple",
        },
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
