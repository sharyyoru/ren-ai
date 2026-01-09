"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { PropertyCard, PropertyFilters, PropertyListItem } from "@/components/properties";
import { mockProperties } from "@/data/mock";

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen">
      <Header
        title="Properties"
        subtitle={`${mockProperties.length} properties across 5 countries`}
      />

      <div className="p-6 space-y-6">
        <PropertyFilters viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mockProperties.map((property) => (
              <PropertyListItem key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="flex justify-center pt-6">
          <button className="px-6 py-3 bg-background-secondary hover:bg-background-tertiary border border-border rounded-lg font-medium transition-colors">
            Load More Properties
          </button>
        </div>
      </div>
    </div>
  );
}
