"use client";

import { Deal, FunnelStage } from "@/types";
import { Card, Avatar, Badge } from "@/components/ui";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { MoreVertical, Plus } from "lucide-react";
import Link from "next/link";

interface DealPipelineProps {
  deals: Deal[];
  stages: FunnelStage[];
}

export function DealPipeline({ deals, stages }: DealPipelineProps) {
  const getDealsByStage = (stageId: string) => 
    deals.filter((deal) => deal.stage_id === stageId);

  const getStageTotal = (stageId: string) =>
    getDealsByStage(stageId).reduce((sum, deal) => sum + deal.value_aed, 0);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.id);
        const stageTotal = getStageTotal(stage.id);

        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80 bg-background-secondary rounded-xl border border-border"
          >
            {/* Stage Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color_code }}
                  />
                  <h3 className="font-semibold">{stage.name}</h3>
                  <span className="px-2 py-0.5 bg-background-tertiary rounded-full text-xs">
                    {stageDeals.length}
                  </span>
                </div>
                <button className="p-1 hover:bg-background-tertiary rounded transition-colors">
                  <MoreVertical className="w-4 h-4 text-foreground-muted" />
                </button>
              </div>
              <p className="text-sm text-foreground-muted">
                {formatCurrency(stageTotal)} total
              </p>
            </div>

            {/* Deals */}
            <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {stageDeals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="block p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={deal.contact?.full_name || "Unknown"} size="sm" />
                      <div>
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">
                          {deal.contact?.full_name}
                        </p>
                        <p className="text-xs text-foreground-muted truncate max-w-[150px]">
                          {deal.property?.title || "No property assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-primary">
                      {formatCurrency(deal.value_aed)}
                    </p>
                    <Badge
                      variant={
                        deal.probability >= 70
                          ? "success"
                          : deal.probability >= 40
                          ? "warning"
                          : "default"
                      }
                    >
                      {deal.probability}%
                    </Badge>
                  </div>

                  <p className="text-xs text-foreground-muted mt-2">
                    Updated {formatRelativeTime(deal.updated_at)}
                  </p>
                </Link>
              ))}

              {/* Add Deal Button */}
              <button className="w-full p-3 border border-dashed border-border rounded-lg text-foreground-muted hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Deal
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
