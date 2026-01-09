"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Select, Tabs } from "@/components/ui";
import { ContactCard, ContactList } from "@/components/contacts";
import { mockContacts } from "@/data/mock";
import { Search, Plus, Grid3X3, List, Upload, Download } from "lucide-react";

export default function ContactsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Contacts", count: mockContacts.length },
    { id: "hot", label: "Hot Leads", count: mockContacts.filter(c => c.lead_score >= 80).length },
    { id: "warm", label: "Warm", count: mockContacts.filter(c => c.lead_score >= 50 && c.lead_score < 80).length },
    { id: "cold", label: "Cold", count: mockContacts.filter(c => c.lead_score < 50).length },
  ];

  const filteredContacts = mockContacts.filter(contact => {
    if (activeTab === "hot") return contact.lead_score >= 80;
    if (activeTab === "warm") return contact.lead_score >= 50 && contact.lead_score < 80;
    if (activeTab === "cold") return contact.lead_score < 50;
    return true;
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Contacts"
        subtitle="Manage your leads and clients"
      />

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab="all" onChange={setActiveTab} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search contacts..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              options={[
                { value: "all", label: "All Sources" },
                { value: "website", label: "Website" },
                { value: "referral", label: "Referral" },
                { value: "whatsapp", label: "WhatsApp" },
                { value: "social", label: "Social" },
                { value: "exhibition", label: "Exhibition" },
              ]}
              className="w-40"
            />

            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-foreground-muted hover:text-foreground"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-foreground-muted hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button variant="secondary" className="hidden sm:flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>

            <Button variant="secondary" className="hidden sm:flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>

            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Contact</span>
            </Button>
          </div>
        </div>

        {/* Contact List/Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <ContactList contacts={filteredContacts} />
        )}

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground-muted">No contacts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
