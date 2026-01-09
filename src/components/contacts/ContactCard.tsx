"use client";

import { Contact } from "@/types";
import { Card, Badge, Avatar, Progress } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { Phone, Mail, MessageSquare, MoreVertical } from "lucide-react";
import Link from "next/link";

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  const scoreVariant = contact.lead_score >= 80 ? "success" : contact.lead_score >= 50 ? "warning" : "danger";

  return (
    <Card hover className="group">
      <Link href={`/contacts/${contact.id}`} className="block p-5">
        <div className="flex items-start gap-4">
          <Avatar name={contact.full_name} size="lg" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                {contact.full_name}
              </h3>
              <button 
                className="p-1 hover:bg-background-tertiary rounded transition-colors opacity-0 group-hover:opacity-100"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="w-4 h-4 text-foreground-muted" />
              </button>
            </div>
            
            <p className="text-sm text-foreground-muted truncate mb-2">{contact.email}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={scoreVariant === "success" ? "success" : scoreVariant === "warning" ? "warning" : "danger"}>
                Score: {contact.lead_score}
              </Badge>
              <Badge variant="default">{contact.source}</Badge>
            </div>

            {contact.ai_summary && (
              <p className="text-sm text-foreground-muted line-clamp-2 mb-3">
                {contact.ai_summary}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {contact.phone_whatsapp && (
                  <button 
                    className="p-2 bg-success/10 hover:bg-success/20 rounded-lg transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MessageSquare className="w-4 h-4 text-success" />
                  </button>
                )}
                <button 
                  className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <Mail className="w-4 h-4 text-primary" />
                </button>
                {contact.phone_whatsapp && (
                  <button 
                    className="p-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Phone className="w-4 h-4 text-accent" />
                  </button>
                )}
              </div>
              <span className="text-xs text-foreground-muted">
                {formatRelativeTime(contact.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
