"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Card, CardContent, CardHeader, Badge, Select, Avatar } from "@/components/ui";
import { 
  User, Building2, Bell, Shield, Palette, Globe, 
  Key, Users, Mail, MessageSquare, Save, Upload
} from "lucide-react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "team", label: "Team", icon: Users },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="min-h-screen">
      <Header
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Navigation */}
          <div className="lg:w-64 shrink-0">
            <Card className="p-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-white"
                        : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </Card>
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-6">
            {activeSection === "profile" && (
              <>
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Profile Information</h3>
                    <p className="text-sm text-foreground-muted">Update your personal details</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar name="Agent Demo" size="xl" />
                      <div>
                        <Button variant="secondary" size="sm" className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload Photo
                        </Button>
                        <p className="text-xs text-foreground-muted mt-1">JPG, PNG or GIF. Max 2MB.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input defaultValue="Agent Demo" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input defaultValue="agent@renai.com" type="email" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <Input defaultValue="+971 50 123 4567" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">WhatsApp</label>
                        <Input defaultValue="+971 50 123 4567" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button variant="primary" className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "company" && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Company Information</h3>
                  <p className="text-sm text-foreground-muted">Your brokerage details</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company Name</label>
                      <Input defaultValue="Ren.Ai Real Estate" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">License Number</label>
                      <Input defaultValue="RERA-12345" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <Input defaultValue="Business Bay, Dubai, UAE" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Default Currency</label>
                      <Select
                        options={[
                          { value: "AED", label: "AED - UAE Dirham" },
                          { value: "USD", label: "USD - US Dollar" },
                          { value: "EUR", label: "EUR - Euro" },
                        ]}
                        defaultValue="AED"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Commission Rate</label>
                      <Input defaultValue="2%" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button variant="primary" className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "notifications" && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Notification Preferences</h3>
                  <p className="text-sm text-foreground-muted">Choose how you want to be notified</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "New Lead Alerts", description: "Get notified when a new lead is created" },
                    { label: "Deal Updates", description: "Notifications when deal stages change" },
                    { label: "Price Drop Alerts", description: "Alert when property prices change" },
                    { label: "New Messages", description: "WhatsApp and email notifications" },
                    { label: "Task Reminders", description: "Remind me about upcoming tasks" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-foreground-muted">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === "security" && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Security Settings</h3>
                  <p className="text-sm text-foreground-muted">Manage your account security</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-background-secondary rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Password</p>
                          <p className="text-sm text-foreground-muted">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">Change Password</Button>
                    </div>
                  </div>
                  <div className="p-4 bg-background-secondary rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-success" />
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-foreground-muted">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "branding" && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">White-Label Branding</h3>
                  <p className="text-sm text-foreground-muted">Customize the platform appearance</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Color</label>
                      <div className="flex gap-2">
                        <input type="color" defaultValue="#8b5cf6" className="w-12 h-10 rounded border border-border cursor-pointer" />
                        <Input defaultValue="#8b5cf6" className="flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Accent Color</label>
                      <div className="flex gap-2">
                        <input type="color" defaultValue="#06b6d4" className="w-12 h-10 rounded border border-border cursor-pointer" />
                        <Input defaultValue="#06b6d4" className="flex-1" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Logo</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 text-foreground-muted mx-auto mb-2" />
                      <p className="text-sm text-foreground-muted">Drag and drop or click to upload</p>
                      <p className="text-xs text-foreground-muted mt-1">PNG, SVG. Recommended 200x50px</p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button variant="primary" className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Branding
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "integrations" && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Integrations</h3>
                  <p className="text-sm text-foreground-muted">Connect external services</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "WhatsApp Business", icon: MessageSquare, status: "connected", color: "success" },
                    { name: "SendGrid", icon: Mail, status: "connected", color: "success" },
                    { name: "Dubai Pulse API", icon: Globe, status: "connected", color: "success" },
                    { name: "Reelly API", icon: Building2, status: "pending", color: "warning" },
                  ].map((integration, index) => {
                    const Icon = integration.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-background-tertiary flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <Badge variant={integration.color as "success" | "warning"}>{integration.status}</Badge>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm">Configure</Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {activeSection === "team" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Team Members</h3>
                    <p className="text-sm text-foreground-muted">Manage access and permissions</p>
                  </div>
                  <Button variant="primary" size="sm" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Invite Member
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Agent Demo", email: "agent@renai.com", role: "Admin" },
                      { name: "Sarah Agent", email: "sarah@renai.com", role: "Agent" },
                      { name: "John Manager", email: "john@renai.com", role: "Manager" },
                    ].map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar name={member.name} size="md" />
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-foreground-muted">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={member.role === "Admin" ? "purple" : "default"}>
                            {member.role}
                          </Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
