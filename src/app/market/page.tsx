"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Card, CardContent, CardHeader, Badge, Select, StatsSkeleton, TableRowSkeleton } from "@/components/ui";
import { useDLDTransactions } from "@/hooks/useSupabase";
import { formatCurrency } from "@/lib/utils";
import { 
  Search, RefreshCw, TrendingUp, Building2, MapPin, 
  Calendar, DollarSign, Download
} from "lucide-react";

interface DLDTransaction {
  transaction_number?: string;
  area_name?: string;
  property_type?: string;
  transaction_type?: string;
  transaction_date?: string;
  amount_aed?: number;
}

export default function MarketPage() {
  const [areaFilter, setAreaFilter] = useState("");
  const { transactions: rawTransactions, loading, source, refetch } = useDLDTransactions({ 
    area: areaFilter || undefined,
    limit: 50 
  });

  // Cast transactions to proper type
  const transactions = rawTransactions as DLDTransaction[];

  // Calculate stats from transactions
  const stats = {
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, t) => sum + (t.amount_aed || 0), 0),
    avgPrice: transactions.length > 0 
      ? Math.round(transactions.reduce((sum, t) => sum + (t.amount_aed || 0), 0) / transactions.length)
      : 0,
  };

  // Get unique areas for filter
  const areas = [...new Set(transactions.map(t => t.area_name))].filter(Boolean) as string[];

  return (
    <div className="min-h-screen">
      <Header
        title="DLD Market Data"
        subtitle="Real-time Dubai Land Department transaction data"
      />

      <div className="p-6 space-y-6">
        {/* Data Source Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={source === "dubai_pulse" ? "success" : "warning"}>
            Source: {source === "dubai_pulse" ? "Dubai Pulse API" : "Fallback Data"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            <>
              <StatsSkeleton />
              <StatsSkeleton />
              <StatsSkeleton />
            </>
          ) : (
            <>
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Total Transactions</p>
                    <p className="text-2xl font-bold">{stats.totalTransactions}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Total Volume</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalVolume)}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Average Price</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.avgPrice)}</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by area..."
              icon={<Search className="w-4 h-4" />}
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              options={[
                { value: "", label: "All Areas" },
                ...areas.slice(0, 10).map(area => ({ value: area, label: area }))
              ]}
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-48"
            />

            <Button variant="secondary" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Recent Transactions</h3>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Transaction</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Area</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden md:table-cell">Type</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden lg:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-foreground-muted">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={5} />
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-foreground-muted">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((t, i) => (
                    <tr key={t.transaction_number || i} className="hover:bg-background-secondary/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{t.transaction_number}</p>
                            <p className="text-xs text-foreground-muted">{t.property_type || "Property"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-foreground-muted" />
                          <span className="text-sm">{t.area_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <Badge variant="default">{t.transaction_type || "Sale"}</Badge>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-sm text-foreground-muted">
                          <Calendar className="w-3 h-3" />
                          {t.transaction_date}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-success">
                        {formatCurrency(t.amount_aed || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* API Info */}
        <Card className="bg-background-secondary/50">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">About DLD Data</h4>
            <p className="text-sm text-foreground-muted">
              This data is fetched from the Dubai Land Department via the Dubai Pulse Open Data API. 
              The API provides real-time transaction data for all property sales and rentals in Dubai.
              Data is cached for 1 hour and automatically refreshed.
            </p>
            <div className="flex gap-2 mt-3">
              <Badge variant="info">No API Key Required</Badge>
              <Badge variant="success">Open Data</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
