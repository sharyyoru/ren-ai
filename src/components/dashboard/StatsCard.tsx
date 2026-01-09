"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-foreground-muted mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-danger"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-foreground-muted">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
