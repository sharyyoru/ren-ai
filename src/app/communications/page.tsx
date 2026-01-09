"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Card, CardContent, Avatar, Badge, Tabs } from "@/components/ui";
import { mockContacts, mockCommunications } from "@/data/mock";
import { formatRelativeTime, truncate } from "@/lib/utils";
import { 
  Search, MessageSquare, Mail, Phone, Send, 
  Paperclip, Smile, MoreVertical, Check, CheckCheck,
  Filter, Plus
} from "lucide-react";

export default function CommunicationsPage() {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
  ];

  const contactMessages = mockCommunications.filter(
    (c) => c.contact_id === selectedContact.id
  );

  return (
    <div className="min-h-screen">
      <Header
        title="Communications"
        subtitle="WhatsApp & Email Hub"
      />

      <div className="h-[calc(100vh-140px)] flex">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-border flex flex-col bg-background-secondary hidden md:flex">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <Input
              placeholder="Search conversations..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Tabs */}
          <div className="p-2 border-b border-border">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-foreground-muted hover:bg-background-tertiary"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {mockContacts.map((contact) => {
              const lastMessage = mockCommunications.find(
                (c) => c.contact_id === contact.id
              );
              const isSelected = selectedContact.id === contact.id;

              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-background-tertiary transition-colors border-b border-border ${
                    isSelected ? "bg-background-tertiary" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar name={contact.full_name} size="md" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background-secondary" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{contact.full_name}</p>
                      {lastMessage && (
                        <span className="text-xs text-foreground-muted">
                          {formatRelativeTime(lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-foreground-muted truncate">
                        {lastMessage.direction === "out" && (
                          <CheckCheck className="inline w-3 h-3 mr-1 text-accent" />
                        )}
                        {truncate(lastMessage.content, 40)}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={selectedContact.full_name} size="md" />
              <div>
                <p className="font-semibold">{selectedContact.full_name}</p>
                <p className="text-sm text-foreground-muted">
                  {selectedContact.phone_whatsapp || selectedContact.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {contactMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
                  <p className="text-foreground-muted">No messages yet</p>
                  <p className="text-sm text-foreground-muted">Start a conversation with {selectedContact.full_name}</p>
                </div>
              </div>
            ) : (
              contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === "out" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.direction === "out"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-card border border-border rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      msg.direction === "out" ? "text-white/70" : "text-foreground-muted"
                    }`}>
                      <span className="text-xs">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.direction === "out" && (
                        <CheckCheck className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-background-secondary border border-border rounded-full px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <Button variant="primary" size="icon" className="rounded-full">
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <Badge variant="purple" className="cursor-pointer hover:opacity-80">
                📋 Send Brochure
              </Badge>
              <Badge variant="info" className="cursor-pointer hover:opacity-80">
                📅 Schedule Viewing
              </Badge>
              <Badge variant="success" className="cursor-pointer hover:opacity-80">
                💰 Send Quote
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact Details Sidebar */}
        <div className="w-80 border-l border-border bg-background-secondary hidden lg:block overflow-y-auto">
          <div className="p-6 text-center border-b border-border">
            <Avatar name={selectedContact.full_name} size="xl" className="mx-auto mb-3" />
            <h3 className="font-semibold text-lg">{selectedContact.full_name}</h3>
            <p className="text-sm text-foreground-muted">{selectedContact.email}</p>
            {selectedContact.phone_whatsapp && (
              <p className="text-sm text-foreground-muted">{selectedContact.phone_whatsapp}</p>
            )}
            
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="secondary" size="sm">View Profile</Button>
              <Button variant="primary" size="sm">Create Deal</Button>
            </div>
          </div>

          <div className="p-4">
            <h4 className="font-medium mb-3">Lead Score</h4>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 bg-background-tertiary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedContact.lead_score >= 80
                      ? "bg-success"
                      : selectedContact.lead_score >= 50
                      ? "bg-warning"
                      : "bg-danger"
                  }`}
                  style={{ width: `${selectedContact.lead_score}%` }}
                />
              </div>
              <span className="font-semibold">{selectedContact.lead_score}</span>
            </div>

            {selectedContact.ai_summary && (
              <>
                <h4 className="font-medium mb-2">AI Summary</h4>
                <p className="text-sm text-foreground-muted p-3 bg-background-tertiary rounded-lg">
                  {selectedContact.ai_summary}
                </p>
              </>
            )}

            <h4 className="font-medium mt-4 mb-2">Source</h4>
            <Badge variant="default">{selectedContact.source}</Badge>

            <h4 className="font-medium mt-4 mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Generate Reply
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                <Mail className="w-4 h-4" />
                Send Email Template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
