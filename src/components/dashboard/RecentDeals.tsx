"use client";

import { Card, CardHeader, CardContent, Badge, Avatar, Progress } from "@/components/ui";
import { mockDeals } from "@/data/mock";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function RecentDeals() {
  const recentDeals = mockDeals.slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold">Recent Deals</h3>
          <p className="text-sm text-foreground-muted">Track your active deals</p>
        </div>
        <Link
          href="/deals"
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentDeals.map((deal) => (
          <div
            key={deal.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-background-secondary hover:bg-background-tertiary transition-colors cursor-pointer"
          >
            <Avatar name={deal.contact?.full_name || "Unknown"} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium truncate">{deal.contact?.full_name}</p>
                <Badge
                  variant={
                    deal.stage?.name === "Closed Won"
                      ? "success"
                      : deal.stage?.name === "Closed Lost"
                      ? "danger"
                      : "purple"
                  }
                >
                  {deal.stage?.name}
                </Badge>
              </div>
              <p className="text-sm text-foreground-muted truncate">
                {deal.property?.title}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-medium text-primary">
                  {formatCurrency(deal.value_aed)}
                </span>
                <Progress value={deal.probability} size="sm" className="flex-1 max-w-20" />
                <span className="text-xs text-foreground-muted">{deal.probability}%</span>
              </div>
            </div>
            <div className="text-xs text-foreground-muted">
              {formatRelativeTime(deal.updated_at)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
