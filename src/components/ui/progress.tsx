"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger" | "gradient";
  showLabel?: boolean;
  className?: string;
}

export function Progress({ 
  value, 
  max = 100, 
  size = "md", 
  variant = "default",
  showLabel = false,
  className 
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-foreground-muted">Progress</span>
          <span className="text-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-background-tertiary rounded-full overflow-hidden",
          {
            "h-1": size === "sm",
            "h-2": size === "md",
            "h-3": size === "lg",
          }
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            {
              "bg-primary": variant === "default",
              "bg-success": variant === "success",
              "bg-warning": variant === "warning",
              "bg-danger": variant === "danger",
              "bg-gradient-to-r from-primary to-accent": variant === "gradient",
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
