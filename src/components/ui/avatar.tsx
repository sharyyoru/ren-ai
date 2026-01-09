"use client";

import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size], className)}>
        <Image src={src} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-semibold text-white",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
