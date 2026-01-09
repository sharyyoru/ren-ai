"use client";

import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-primary hover:bg-primary-hover text-white": variant === "primary",
            "bg-background-secondary hover:bg-background-tertiary text-foreground border border-border": variant === "secondary",
            "bg-transparent hover:bg-background-secondary text-foreground-muted hover:text-foreground": variant === "ghost",
            "bg-danger hover:bg-danger/90 text-white": variant === "danger",
            "border border-primary text-primary hover:bg-primary hover:text-white": variant === "outline",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
            "p-2 aspect-square": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
