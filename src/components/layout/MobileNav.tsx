"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Home" },
  { href: "/properties", icon: Building2, label: "Properties" },
  { href: "/contacts", icon: Users, label: "Contacts" },
  { href: "/deals", icon: TrendingUp, label: "Deals" },
  { href: "/communications", icon: MessageSquare, label: "Messages" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-secondary border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-foreground-muted"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
