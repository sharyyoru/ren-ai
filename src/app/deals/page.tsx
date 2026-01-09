"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Select, Tabs } from "@/components/ui";
import { DealPipeline, DealCard } from "@/components/deals";
import { mockDeals, mockFunnelStages } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Search, Plus, LayoutGrid, Columns3, Filter } from "lucide-react";

export default function DealsPage() {
  const [viewMode, setViewMode] = useState<"pipeline" | "grid">("pipeline");

  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value_aed, 0);
  const weightedValue = mockDeals.reduce((sum, deal) => sum + (deal.value_aed * deal.probability / 100), 0);

  return (
    <div className="min-h-screen">
      <Header
        title="Deals"
        subtitle="Track and manage your sales pipeline"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-card border border-border rounded-xl">
            <p className="text-sm text-foreground-muted">Total Deals</p>
            <p className="text-2xl font-bold">{mockDeals.length}</p>
          </div>
          <div className="p-4 bg-card border border-border rounded-xl">
            <p className="text-sm text-foreground-muted">Pipeline Value</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</p>
          </div>
          <div className="p-4 bg-card border border-border rounded-xl">
            <p className="text-sm text-foreground-muted">Weighted Value</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(weightedValue)}</p>
          </div>
          <div className="p-4 bg-card border border-border rounded-xl">
            <p className="text-sm text-foreground-muted">Avg Probability</p>
            <p className="text-2xl font-bold">
              {Math.round(mockDeals.reduce((sum, d) => sum + d.probability, 0) / mockDeals.length)}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search deals..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              options={[
                { value: "all", label: "All Stages" },
                ...mockFunnelStages.map(s => ({ value: s.id, label: s.name }))
              ]}
              className="w-40"
            />

            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("pipeline")}
                className={`p-2.5 transition-colors ${
                  viewMode === "pipeline"
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-foreground-muted hover:text-foreground"
                }`}
              >
                <Columns3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-foreground-muted hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Button variant="secondary" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>

            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Deal</span>
            </Button>
          </div>
        </div>

        {/* Pipeline / Grid View */}
        {viewMode === "pipeline" ? (
          <DealPipeline deals={mockDeals} stages={mockFunnelStages.slice(0, 6)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
