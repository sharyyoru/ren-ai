"use client";

import { cn } from "@/lib/utils";

// Main page loading spinner with Ren.Ai branding
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse" />
        </div>
        
        {/* Logo text */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-lg font-bold gradient-text">Ren.Ai</span>
          <span className="ml-2 text-sm text-foreground-muted animate-pulse">Loading...</span>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden animate-pulse", className)}>
      <div className="h-48 bg-background-tertiary" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-background-tertiary rounded w-3/4" />
        <div className="h-3 bg-background-tertiary rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-background-tertiary rounded w-16" />
          <div className="h-6 bg-background-tertiary rounded w-16" />
        </div>
        <div className="h-5 bg-background-tertiary rounded w-1/3" />
      </div>
    </div>
  );
}

// Skeleton loader for property list items
export function ListItemSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-32 h-24 bg-background-tertiary rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-background-tertiary rounded w-3/4" />
          <div className="h-3 bg-background-tertiary rounded w-1/2" />
          <div className="flex gap-4 mt-2">
            <div className="h-3 bg-background-tertiary rounded w-16" />
            <div className="h-3 bg-background-tertiary rounded w-16" />
            <div className="h-3 bg-background-tertiary rounded w-20" />
          </div>
        </div>
        <div className="h-6 bg-background-tertiary rounded w-24" />
      </div>
    </div>
  );
}

// Skeleton for stats cards
export function StatsSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-background-tertiary rounded-xl" />
        <div className="space-y-2">
          <div className="h-3 bg-background-tertiary rounded w-20" />
          <div className="h-5 bg-background-tertiary rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for table rows
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-background-tertiary rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

// Skeleton for contact cards
export function ContactSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-background-tertiary rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-background-tertiary rounded w-32" />
          <div className="h-3 bg-background-tertiary rounded w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-background-tertiary rounded w-full" />
        <div className="h-3 bg-background-tertiary rounded w-3/4" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 bg-background-tertiary rounded flex-1" />
        <div className="h-8 bg-background-tertiary rounded flex-1" />
      </div>
    </div>
  );
}

// Skeleton for deal pipeline columns
export function PipelineSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-72 shrink-0 bg-background-secondary rounded-xl p-4 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-background-tertiary rounded w-24" />
            <div className="h-6 bg-background-tertiary rounded-full w-6" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="bg-card border border-border rounded-lg p-3">
                <div className="h-4 bg-background-tertiary rounded w-3/4 mb-2" />
                <div className="h-3 bg-background-tertiary rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Chat message skeleton
export function MessageSkeleton({ direction = "in" }: { direction?: "in" | "out" }) {
  return (
    <div className={cn("flex", direction === "out" ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[70%] p-3 rounded-2xl animate-pulse",
        direction === "out" ? "bg-primary/50 rounded-br-md" : "bg-card border border-border rounded-bl-md"
      )}>
        <div className="h-4 bg-background-tertiary rounded w-48 mb-2" />
        <div className="h-4 bg-background-tertiary rounded w-32" />
      </div>
    </div>
  );
}

// Full page skeleton wrapper
export function PageSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen animate-in fade-in duration-300">
      {children}
    </div>
  );
}

// Inline loading spinner
export function Spinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div className={cn(
      "rounded-full border-primary/20 border-t-primary animate-spin",
      sizeClasses[size],
      className
    )} />
  );
}

// Loading button state
export function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </span>
  );
}
