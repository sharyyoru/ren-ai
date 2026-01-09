"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Card, CardContent, CardHeader, Badge, Spinner } from "@/components/ui";
import { useAIGenerate } from "@/hooks/useSupabase";
import { 
  Sparkles, Send, FileText, Mail, MessageSquare, 
  Building2, User, RefreshCw
} from "lucide-react";

export default function AITestPage() {
  const { generate, loading, error } = useAIGenerate();
  const [result, setResult] = useState<string>("");
  const [activeTest, setActiveTest] = useState<string>("");

  // Test property description
  const testPropertyDescription = async () => {
    setActiveTest("property");
    const response = await generate("property_description", {
      title: "Creek Vista 2BR Apartment",
      area: "Dubai Creek Harbour",
      city: "Dubai",
      bedrooms: 2,
      bathrooms: 2,
      sizeSqft: 1200,
      price: 2500000,
      developer: "Emaar",
      amenities: ["Pool", "Gym", "Concierge", "Parking"],
      completionDate: "Q4 2025"
    });
    setResult(response || "No response");
  };

  // Test lead summary
  const testLeadSummary = async () => {
    setActiveTest("lead");
    const response = await generate("lead_summary", {
      name: "Ahmed Al Maktoum",
      source: "WhatsApp",
      messageCount: 15,
      propertiesViewed: ["Creek Vista", "Palm Villa", "Marina Gate"],
      budget: "AED 2-4 million",
      preferences: "Sea view, 2+ bedrooms, off-plan"
    });
    setResult(response || "No response");
  };

  // Test email reply
  const testEmailReply = async () => {
    setActiveTest("email");
    const response = await generate("email_reply", {
      clientName: "Sarah Johnson",
      inquiry: "Hi, I'm interested in the 2BR apartment in Creek Vista. What's the payment plan and when is the expected handover?",
      propertyName: "Creek Vista Heights",
      context: "Initial inquiry from website form"
    });
    setResult(response || "No response");
  };

  // Test WhatsApp reply
  const testWhatsAppReply = async () => {
    setActiveTest("whatsapp");
    const response = await generate("whatsapp_reply", {
      clientName: "Mohammed",
      message: "Is the Palm villa still available? I'd like to schedule a viewing",
      context: "Hot lead, viewed property 3 times online"
    });
    setResult(response || "No response");
  };

  // Test brochure content
  const testBrochureContent = async () => {
    setActiveTest("brochure");
    const response = await generate("brochure_content", {
      title: "The Palm Villa Collection",
      developer: "Nakheel",
      location: "Palm Jumeirah, Dubai",
      price: 15000000,
      features: ["Private beach", "Infinity pool", "Smart home", "6 bedrooms", "Staff quarters"],
      paymentPlan: "20% down, 40% during construction, 40% on handover"
    });
    setResult(typeof response === "object" ? JSON.stringify(response, null, 2) : response || "No response");
  };

  return (
    <div className="min-h-screen">
      <Header
        title="AI Functions Test"
        subtitle="Test Gemini AI integrations for content generation"
      />

      <div className="p-6 space-y-6">
        {/* API Status */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Google Gemini AI</h3>
              <p className="text-sm text-foreground-muted">
                Using Gemini 1.5 Flash for content generation
              </p>
            </div>
            <Badge variant="success">Connected</Badge>
          </CardContent>
        </Card>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${activeTest === "property" ? "border-primary" : ""}`}
            onClick={testPropertyDescription}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Property Description</p>
                <p className="text-xs text-foreground-muted">Generate listing copy</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              disabled={loading && activeTest === "property"}
            >
              {loading && activeTest === "property" ? <Spinner size="sm" /> : "Test"}
            </Button>
          </Card>

          <Card 
            className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${activeTest === "lead" ? "border-primary" : ""}`}
            onClick={testLeadSummary}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Lead Summary</p>
                <p className="text-xs text-foreground-muted">Analyze lead behavior</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              disabled={loading && activeTest === "lead"}
            >
              {loading && activeTest === "lead" ? <Spinner size="sm" /> : "Test"}
            </Button>
          </Card>

          <Card 
            className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${activeTest === "email" ? "border-primary" : ""}`}
            onClick={testEmailReply}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Email Reply</p>
                <p className="text-xs text-foreground-muted">Auto-generate responses</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              disabled={loading && activeTest === "email"}
            >
              {loading && activeTest === "email" ? <Spinner size="sm" /> : "Test"}
            </Button>
          </Card>

          <Card 
            className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${activeTest === "whatsapp" ? "border-primary" : ""}`}
            onClick={testWhatsAppReply}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium">WhatsApp Reply</p>
                <p className="text-xs text-foreground-muted">Quick message generation</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              disabled={loading && activeTest === "whatsapp"}
            >
              {loading && activeTest === "whatsapp" ? <Spinner size="sm" /> : "Test"}
            </Button>
          </Card>

          <Card 
            className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${activeTest === "brochure" ? "border-primary" : ""}`}
            onClick={testBrochureContent}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">Brochure Content</p>
                <p className="text-xs text-foreground-muted">Marketing materials</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              disabled={loading && activeTest === "brochure"}
            >
              {loading && activeTest === "brochure" ? <Spinner size="sm" /> : "Test"}
            </Button>
          </Card>
        </div>

        {/* Result */}
        {(result || error) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold">
                {error ? "Error" : "Generated Result"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setResult(""); setActiveTest(""); }}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg text-danger">
                  {error}
                </div>
              ) : (
                <pre className="p-4 bg-background-secondary rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  {result}
                </pre>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-background-secondary/50">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">How to Use AI Functions</h4>
            <ul className="text-sm text-foreground-muted space-y-1">
              <li>• <strong>Property Description</strong>: Auto-generates compelling listing copy from property data</li>
              <li>• <strong>Lead Summary</strong>: Analyzes contact behavior to predict conversion likelihood</li>
              <li>• <strong>Email Reply</strong>: Creates professional email responses to inquiries</li>
              <li>• <strong>WhatsApp Reply</strong>: Generates quick, conversational message replies</li>
              <li>• <strong>Brochure Content</strong>: Creates marketing copy for PDF generation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
