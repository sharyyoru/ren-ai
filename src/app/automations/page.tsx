"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Card, CardContent, CardHeader, Badge, Select } from "@/components/ui";
import { 
  Search, Plus, Zap, Play, Pause, Settings, Trash2,
  Mail, MessageSquare, Bell, Tag, ArrowRight, Clock
} from "lucide-react";

const mockAutomations = [
  {
    id: "auto-1",
    name: "New Lead Welcome",
    description: "Send welcome WhatsApp message when a new lead is created",
    trigger: "New Lead Created",
    action: "Send WhatsApp",
    isActive: true,
    runs: 156,
    lastRun: "2024-01-25T10:30:00",
  },
  {
    id: "auto-2",
    name: "Price Drop Alert",
    description: "Notify interested contacts when property price drops by more than 5%",
    trigger: "Price Drop > 5%",
    action: "Send Email + WhatsApp",
    isActive: true,
    runs: 23,
    lastRun: "2024-01-24T15:00:00",
  },
  {
    id: "auto-3",
    name: "Inactive Lead Follow-up",
    description: "Send follow-up message if lead is inactive for 3 days",
    trigger: "Lead Inactive 3 Days",
    action: "Create Task + Send Email",
    isActive: false,
    runs: 89,
    lastRun: "2024-01-20T09:00:00",
  },
  {
    id: "auto-4",
    name: "SPA Commission Invoice",
    description: "Auto-generate 2% commission invoice when deal reaches SPA Signed",
    trigger: "Deal Stage: SPA Signed",
    action: "Generate Invoice",
    isActive: true,
    runs: 12,
    lastRun: "2024-01-25T11:00:00",
  },
  {
    id: "auto-5",
    name: "New Off-Plan Project Alert",
    description: "Notify agents when new off-plan projects are added to the feed",
    trigger: "New Project Added",
    action: "Notify Team",
    isActive: true,
    runs: 34,
    lastRun: "2024-01-23T14:00:00",
  },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(mockAutomations);

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a)
    );
  };

  const getActionIcon = (action: string) => {
    if (action.includes("WhatsApp")) return <MessageSquare className="w-4 h-4 text-success" />;
    if (action.includes("Email")) return <Mail className="w-4 h-4 text-accent" />;
    if (action.includes("Invoice")) return <Tag className="w-4 h-4 text-primary" />;
    if (action.includes("Notify")) return <Bell className="w-4 h-4 text-warning" />;
    return <Zap className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Automations"
        subtitle="AI-powered workflow automation"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Total Automations</p>
                <p className="text-xl font-bold">{automations.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Play className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Active</p>
                <p className="text-xl font-bold">{automations.filter(a => a.isActive).length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Total Runs</p>
                <p className="text-xl font-bold">{automations.reduce((sum, a) => sum + a.runs, 0)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Today&apos;s Runs</p>
                <p className="text-xl font-bold">24</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search automations..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              className="w-36"
            />

            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Automation</span>
            </Button>
          </div>
        </div>

        {/* Automation List */}
        <div className="space-y-4">
          {automations.map((automation) => (
            <Card key={automation.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center gap-4 p-5">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    automation.isActive ? "bg-success/10" : "bg-background-tertiary"
                  }`}>
                    <Zap className={`w-6 h-6 ${automation.isActive ? "text-success" : "text-foreground-muted"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{automation.name}</h3>
                      <Badge variant={automation.isActive ? "success" : "default"}>
                        {automation.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground-muted">{automation.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-2 px-3 py-2 bg-background-secondary rounded-lg">
                    <span className="text-xs text-foreground-muted">Trigger:</span>
                    <span className="text-sm font-medium">{automation.trigger}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground-muted hidden sm:block" />
                  <div className="flex items-center gap-2 px-3 py-2 bg-background-secondary rounded-lg">
                    {getActionIcon(automation.action)}
                    <span className="text-sm font-medium">{automation.action}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-4 hidden lg:block">
                    <p className="text-sm font-medium">{automation.runs} runs</p>
                    <p className="text-xs text-foreground-muted">
                      Last: {new Date(automation.lastRun).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant={automation.isActive ? "secondary" : "primary"}
                    size="icon"
                    onClick={() => toggleAutomation(automation.id)}
                  >
                    {automation.isActive ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-danger" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Automation CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="py-8 text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Create Custom Automation</h3>
            <p className="text-foreground-muted mb-4 max-w-md mx-auto">
              Build powerful workflows with our AI-powered automation builder. 
              Connect triggers to actions and let the system work for you.
            </p>
            <Button variant="primary" className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Create New Automation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
