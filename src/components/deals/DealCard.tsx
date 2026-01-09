"use client";

import { Deal } from "@/types";
import { Card, Avatar, Badge, Progress } from "@/components/ui";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Building2, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <Card hover className="group">
      <Link href={`/deals/${deal.id}`} className="block p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={deal.contact?.full_name || "Unknown"} size="md" />
            <div>
              <p className="font-semibold group-hover:text-primary transition-colors">
                {deal.contact?.full_name}
              </p>
              <p className="text-sm text-foreground-muted">
                {deal.contact?.email}
              </p>
            </div>
          </div>
          {deal.stage && (
            <Badge
              variant="purple"
              className="shrink-0"
              style={{ backgroundColor: `${deal.stage.color_code}20`, color: deal.stage.color_code }}
            >
              {deal.stage.name}
            </Badge>
          )}
        </div>

        {deal.property && (
          <div className="flex items-center gap-2 p-3 bg-background-secondary rounded-lg mb-4">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm truncate">{deal.property.title}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(deal.value_aed)}
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${deal.probability >= 50 ? 'text-success' : 'text-warning'}`} />
            <span className="text-sm font-medium">{deal.probability}% probability</span>
          </div>
        </div>

        <Progress 
          value={deal.probability} 
          variant={deal.probability >= 70 ? "success" : deal.probability >= 40 ? "warning" : "default"}
          size="sm"
        />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-foreground-muted">
            <Calendar className="w-3 h-3" />
            <span>Updated {formatRelativeTime(deal.updated_at)}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
