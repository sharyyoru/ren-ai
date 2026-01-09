"use client";

import { Button, Input, Select } from "@/components/ui";
import { Search, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { useState } from "react";

interface PropertyFiltersProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function PropertyFilters({ viewMode, onViewModeChange }: PropertyFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search properties..."
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            options={[
              { value: "all", label: "All Countries" },
              { value: "uae", label: "UAE" },
              { value: "turkey", label: "Turkey" },
              { value: "thailand", label: "Thailand" },
              { value: "indonesia", label: "Indonesia" },
              { value: "cyprus", label: "Cyprus" },
            ]}
            className="w-40"
          />
          
          <Select
            options={[
              { value: "all", label: "All Types" },
              { value: "apartment", label: "Apartment" },
              { value: "villa", label: "Villa" },
              { value: "townhouse", label: "Townhouse" },
              { value: "penthouse", label: "Penthouse" },
            ]}
            className="w-40"
          />
          
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>

          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-background-secondary text-foreground-muted hover:text-foreground"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2.5 transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-background-secondary text-foreground-muted hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Extended Filters */}
      {showFilters && (
        <div className="p-4 bg-background-secondary rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Advanced Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-background-tertiary rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-2">Price Range (AED)</label>
              <div className="flex gap-2">
                <Input placeholder="Min" type="number" />
                <Input placeholder="Max" type="number" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-foreground-muted mb-2">Bedrooms</label>
              <Select
                options={[
                  { value: "any", label: "Any" },
                  { value: "0", label: "Studio" },
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4+" },
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm text-foreground-muted mb-2">Status</label>
              <Select
                options={[
                  { value: "all", label: "All" },
                  { value: "off-plan", label: "Off-Plan" },
                  { value: "ready", label: "Ready" },
                  { value: "sold", label: "Sold" },
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm text-foreground-muted mb-2">Developer</label>
              <Select
                options={[
                  { value: "all", label: "All Developers" },
                  { value: "emaar", label: "Emaar" },
                  { value: "damac", label: "Damac" },
                  { value: "sobha", label: "Sobha" },
                  { value: "meraas", label: "Meraas" },
                  { value: "nakheel", label: "Nakheel" },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
            <Button variant="ghost">Reset</Button>
            <Button variant="primary">Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
}
