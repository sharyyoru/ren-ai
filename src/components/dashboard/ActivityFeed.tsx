"use client";

import { Card, CardHeader, CardContent, Avatar } from "@/components/ui";
import { mockCommunications } from "@/data/mock";
import { formatRelativeTime, truncate } from "@/lib/utils";
import { MessageSquare, Mail, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ActivityFeed() {
  const recentActivity = mockCommunications.slice(0, 5);

  const getIcon = (type: string) => {
    switch (type) {
      case "whatsapp":
        return <MessageSquare className="w-4 h-4 text-success" />;
      case "email":
        return <Mail className="w-4 h-4 text-accent" />;
      default:
        return <Phone className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold">Recent Activity</h3>
          <p className="text-sm text-foreground-muted">Latest communications</p>
        </div>
        <Link
          href="/communications"
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-background-secondary transition-colors cursor-pointer"
          >
            <Avatar name={activity.contact?.full_name || "Unknown"} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {activity.contact?.full_name}
                </span>
                {getIcon(activity.type)}
                <span className="text-xs text-foreground-muted capitalize">
                  {activity.direction === "in" ? "received" : "sent"}
                </span>
              </div>
              <p className="text-sm text-foreground-muted mt-1">
                {truncate(activity.content, 60)}
              </p>
            </div>
            <span className="text-xs text-foreground-muted shrink-0">
              {formatRelativeTime(activity.created_at)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
