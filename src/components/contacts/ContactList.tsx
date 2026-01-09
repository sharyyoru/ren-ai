"use client";

import { Contact } from "@/types";
import { Avatar, Badge } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare, Mail, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ContactListProps {
  contacts: Contact[];
}

export function ContactList({ contacts }: ContactListProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-background-secondary border-b border-border">
          <tr>
            <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Contact</th>
            <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden md:table-cell">Source</th>
            <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden lg:table-cell">Score</th>
            <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden sm:table-cell">Last Activity</th>
            <th className="text-right px-5 py-3 text-sm font-medium text-foreground-muted">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-background-secondary/50 transition-colors group">
              <td className="px-5 py-4">
                <Link href={`/contacts/${contact.id}`} className="flex items-center gap-3">
                  <Avatar name={contact.full_name} size="sm" />
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">{contact.full_name}</p>
                    <p className="text-sm text-foreground-muted truncate max-w-[200px]">{contact.email}</p>
                  </div>
                </Link>
              </td>
              <td className="px-5 py-4 hidden md:table-cell">
                <Badge variant="default">{contact.source}</Badge>
              </td>
              <td className="px-5 py-4 hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-background-tertiary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        contact.lead_score >= 80
                          ? "bg-success"
                          : contact.lead_score >= 50
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                      style={{ width: `${contact.lead_score}%` }}
                    />
                  </div>
                  <span className="text-sm">{contact.lead_score}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-foreground-muted hidden sm:table-cell">
                {formatRelativeTime(contact.updated_at)}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  {contact.phone_whatsapp && (
                    <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                      <MessageSquare className="w-4 h-4 text-success" />
                    </button>
                  )}
                  <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                  </button>
                  <Link 
                    href={`/contacts/${contact.id}`}
                    className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
