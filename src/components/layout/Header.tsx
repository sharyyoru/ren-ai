"use client";

import { Input } from "@/components/ui";
import { Search, Bell, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, actions, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-background-secondary rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-foreground-muted">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:block w-64">
            <Input
              placeholder="Search..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          </Button>

          {/* Quick Add */}
          <Button variant="primary" size="sm" className="hidden sm:flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </Button>

          {/* Mobile Add */}
          <Button variant="primary" size="icon" className="sm:hidden">
            <Plus className="w-4 h-4" />
          </Button>

          {actions}
        </div>
      </div>
    </header>
  );
}
