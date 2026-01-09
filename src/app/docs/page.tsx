"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Card, CardContent, Badge, Input } from "@/components/ui";
import { 
  Search, Database, Zap, MessageSquare, FileText, 
  TrendingUp, Mail, Palette, Receipt, Calculator,
  Building2, Users, Globe, Shield, ChevronRight
} from "lucide-react";

const features = [
  {
    category: "Data Feed",
    items: [
      {
        name: "DLD Real-time Sync",
        description: "Automatic tracking of every sale and rental registration in Dubai via official government APIs.",
        icon: Database,
        status: "active",
      },
      {
        name: "Multi-Nation Off-plan",
        description: "Access to project details in UAE, Indonesia, Thailand, Turkey, and Cyprus.",
        icon: Globe,
        status: "active",
      },
    ],
  },
  {
    category: "AI CRM",
    items: [
      {
        name: "Smart Lead Scoring",
        description: "AI analyzes lead behavior to predict closing probability based on interactions and engagement patterns.",
        icon: TrendingUp,
        status: "active",
      },
      {
        name: "WhatsApp Mirroring",
        description: "Sync your own WhatsApp to log conversations and automate replies inside the contact profile.",
        icon: MessageSquare,
        status: "active",
      },
    ],
  },
  {
    category: "Sales Funnels",
    items: [
      {
        name: "AI Deal Automations",
        description: "Trigger custom actions (Emails/Tasks) based on deal stage changes or price drops.",
        icon: Zap,
        status: "active",
      },
      {
        name: "HTML Email Architect",
        description: "Professional drag-and-drop or AI-prompted email builder with open/click tracking.",
        icon: Mail,
        status: "beta",
      },
    ],
  },
  {
    category: "Marketing",
    items: [
      {
        name: "Prompt-to-PDF",
        description: "Type a prompt to generate a branded, localized property brochure in seconds.",
        icon: FileText,
        status: "active",
      },
      {
        name: "Branding Controller",
        description: "Admin-level control to skin the platform and all exports with company assets.",
        icon: Palette,
        status: "active",
      },
    ],
  },
  {
    category: "Financials",
    items: [
      {
        name: "Automated Invoicing",
        description: "Auto-generate commission invoices in AED upon deal completion with customizable rules.",
        icon: Receipt,
        status: "active",
      },
      {
        name: "Quotation Engine",
        description: "Dynamic quote builder for international properties including local taxes and fees.",
        icon: Calculator,
        status: "active",
      },
    ],
  },
];

const apiEndpoints = [
  { method: "GET", path: "/api/properties", description: "List all properties with filters" },
  { method: "GET", path: "/api/properties/:id", description: "Get property details" },
  { method: "POST", path: "/api/properties", description: "Create a new property" },
  { method: "GET", path: "/api/contacts", description: "List all contacts" },
  { method: "POST", path: "/api/contacts", description: "Create a new contact" },
  { method: "GET", path: "/api/deals", description: "List all deals" },
  { method: "POST", path: "/api/deals", description: "Create a new deal" },
  { method: "PATCH", path: "/api/deals/:id/stage", description: "Update deal stage" },
  { method: "POST", path: "/api/documents/generate", description: "Generate AI document" },
  { method: "GET", path: "/api/dld/transactions", description: "Fetch DLD transactions" },
];

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", ...features.map(f => f.category)];

  const filteredFeatures = features.filter(category => {
    if (activeCategory !== "all" && category.category !== activeCategory) return false;
    if (searchTerm) {
      return category.items.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Documentation"
        subtitle="Explore Ren.Ai features and API reference"
      />

      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-primary/30">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-4">Welcome to Ren.Ai</h1>
            <p className="text-lg text-foreground-muted mb-6">
              An AI-powered real estate CRM with unified dashboard for UAE and international 
              off-plan properties. Explore our comprehensive feature set and API documentation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="purple" size="md">Next.js</Badge>
              <Badge variant="info" size="md">Supabase</Badge>
              <Badge variant="success" size="md">AED Currency</Badge>
              <Badge variant="warning" size="md">AI-Powered</Badge>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search features..."
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-foreground-muted hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All Features" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          {filteredFeatures.map((category) => (
            <div key={category.category}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {category.category}
                <Badge variant="default">{category.items.length} features</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items
                  .filter(item => 
                    !searchTerm || 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card key={item.name} hover className="group cursor-pointer">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                  {item.name}
                                </h3>
                                <Badge variant={item.status === "active" ? "success" : "warning"}>
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground-muted">
                                {item.description}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* API Reference */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            API Reference
            <Badge variant="info">REST</Badge>
          </h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-secondary border-b border-border">
                  <tr>
                    <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Method</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Endpoint</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {apiEndpoints.map((endpoint, index) => (
                    <tr key={index} className="hover:bg-background-secondary/50 transition-colors">
                      <td className="px-5 py-3">
                        <Badge 
                          variant={
                            endpoint.method === "GET" ? "success" : 
                            endpoint.method === "POST" ? "info" : 
                            endpoint.method === "PATCH" ? "warning" : "default"
                          }
                        >
                          {endpoint.method}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <code className="text-sm bg-background-tertiary px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                      </td>
                      <td className="px-5 py-3 text-foreground-muted">
                        {endpoint.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Next.js 15", desc: "React Framework" },
                { name: "Supabase", desc: "Database & Auth" },
                { name: "Tailwind CSS", desc: "Styling" },
                { name: "TypeScript", desc: "Type Safety" },
                { name: "Lucide Icons", desc: "Icon Library" },
                { name: "Framer Motion", desc: "Animations" },
                { name: "React Hook Form", desc: "Form Handling" },
                { name: "Zod", desc: "Validation" },
              ].map((tech) => (
                <div key={tech.name} className="p-4 bg-background-secondary rounded-lg text-center">
                  <p className="font-medium">{tech.name}</p>
                  <p className="text-xs text-foreground-muted">{tech.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
