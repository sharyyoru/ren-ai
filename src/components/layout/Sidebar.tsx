"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Zap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  TrendingUp,
  Globe,
  Receipt,
} from "lucide-react";
import { useState } from "react";

const mainNavItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/properties", icon: Building2, label: "Properties" },
  { href: "/market", icon: TrendingUp, label: "DLD Market" },
  { href: "/contacts", icon: Users, label: "Contacts" },
  { href: "/deals", icon: TrendingUp, label: "Deals" },
  { href: "/communications", icon: MessageSquare, label: "Communications" },
];

const toolsNavItems = [
  { href: "/automations", icon: Zap, label: "Automations" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/financials", icon: Receipt, label: "Financials" },
  { href: "/ai-test", icon: Zap, label: "AI Test" },
  { href: "/admin/properties", icon: Building2, label: "Manage Properties" },
];

const bottomNavItems = [
  { href: "/docs", icon: BookOpen, label: "Documentation" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-primary text-white"
            : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
        )}
      >
        <Icon className={cn("w-5 h-5 shrink-0", isActive && "animate-pulse-glow rounded")} />
        {!isCollapsed && (
          <span className="text-sm font-medium truncate">{label}</span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-background-secondary border-r border-border flex flex-col transition-all duration-300 sticky top-0",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold gradient-text">Ren.Ai</span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-background-tertiary text-foreground-muted hover:text-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        {!isCollapsed && (
          <div className="pt-4 pb-2">
            <span className="px-3 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              Tools
            </span>
          </div>
        )}
        {isCollapsed && <div className="my-4 mx-3 border-t border-border" />}
        
        <div className="space-y-1">
          {toolsNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </nav>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="mx-3 mb-3 p-3 bg-background-tertiary rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-foreground-muted">Markets</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {["UAE", "Turkey", "Thailand", "Indonesia", "Cyprus"].map((country) => (
              <span
                key={country}
                className="px-2 py-0.5 text-xs bg-background-secondary rounded-full text-foreground-muted"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-border space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-border">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-background-tertiary transition-colors cursor-pointer",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Agent Demo</p>
              <p className="text-xs text-foreground-muted truncate">agent@renai.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
