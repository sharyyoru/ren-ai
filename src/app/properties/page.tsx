"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { PropertyCard, PropertyFilters, PropertyListItem } from "@/components/properties";
import { CardSkeleton, ListItemSkeleton } from "@/components/ui";
import { mockProperties } from "@/data/mock";
import { useProperties } from "@/hooks/useSupabase";

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [useRealData, setUseRealData] = useState(false);
  
  // Try to fetch from Supabase, fallback to mock data
  const { properties: dbProperties, loading } = useProperties({ limit: 50 });
  
  // Use real data if available, otherwise mock
  const properties = useRealData && dbProperties.length > 0 ? dbProperties : mockProperties;
  
  // Check if we should use real data
  useEffect(() => {
    if (dbProperties.length > 0) {
      setUseRealData(true);
    }
  }, [dbProperties]);

  return (
    <div className="min-h-screen">
      <Header
        title="Properties"
        subtitle={`${mockProperties.length} properties across 5 countries`}
      />

      <div className="p-6 space-y-6">
        <PropertyFilters viewMode={viewMode} onViewModeChange={setViewMode} />

        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <ListItemSkeleton key={i} />
              ))}
            </div>
          )
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <PropertyListItem key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && properties.length > 0 && (
          <div className="flex justify-center pt-6">
            <button className="px-6 py-3 bg-background-secondary hover:bg-background-tertiary border border-border rounded-lg font-medium transition-colors">
              Load More Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
