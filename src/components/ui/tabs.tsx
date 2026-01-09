"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={cn("flex gap-1 p-1 bg-background-secondary rounded-lg", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-primary text-white"
              : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                "px-1.5 py-0.5 text-xs rounded-full",
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-background-tertiary text-foreground-muted"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
