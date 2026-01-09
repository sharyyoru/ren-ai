"use client";

import { Header } from "@/components/layout";
import { StatsCard, RecentDeals, PropertyHighlights, ActivityFeed } from "@/components/dashboard";
import { mockDashboardStats } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Building2, Users, TrendingUp, DollarSign, Percent, Target } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your properties."
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard
            title="Total Properties"
            value={mockDashboardStats.totalProperties}
            icon={Building2}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Contacts"
            value={mockDashboardStats.totalContacts}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Active Deals"
            value={mockDashboardStats.activeDeals}
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(mockDashboardStats.totalRevenue)}
            icon={DollarSign}
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard
            title="Conversion Rate"
            value={`${mockDashboardStats.conversionRate}%`}
            icon={Percent}
            trend={{ value: 2.3, isPositive: true }}
          />
          <StatsCard
            title="Avg Deal Value"
            value={formatCurrency(mockDashboardStats.avgDealValue)}
            icon={Target}
            trend={{ value: 4, isPositive: false }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <RecentDeals />
            <PropertyHighlights />
          </div>

          {/* Right Column - 1/3 width on large screens */}
          <div className="space-y-6">
            <ActivityFeed />
            
            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-6 border border-primary/30">
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-foreground-muted mb-4">
                Generate property brochures, analyze leads, or automate your workflow.
              </p>
              <button className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                Start AI Chat
              </button>
            </div>

            {/* Market Overview */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">Market Overview</h3>
              <div className="space-y-3">
                {[
                  { country: "UAE", properties: 89, growth: 12 },
                  { country: "Turkey", properties: 34, growth: 8 },
                  { country: "Thailand", properties: 18, growth: 15 },
                  { country: "Indonesia", properties: 12, growth: 22 },
                  { country: "Cyprus", properties: 3, growth: 5 },
                ].map((market) => (
                  <div key={market.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {market.country === "UAE" && "🇦🇪"}
                        {market.country === "Turkey" && "🇹🇷"}
                        {market.country === "Thailand" && "🇹🇭"}
                        {market.country === "Indonesia" && "🇮🇩"}
                        {market.country === "Cyprus" && "🇨🇾"}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{market.country}</p>
                        <p className="text-xs text-foreground-muted">{market.properties} properties</p>
                      </div>
                    </div>
                    <span className="text-sm text-success">+{market.growth}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
