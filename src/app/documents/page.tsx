"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Card, CardContent, CardHeader, Badge, Select } from "@/components/ui";
import { 
  Search, Plus, FileText, Image, Download, Trash2, 
  MoreVertical, Sparkles, Upload, FolderOpen, Eye
} from "lucide-react";

const mockDocuments = [
  { id: "doc-1", name: "Creek Vista Brochure", type: "brochure", property: "Creek Vista Heights", createdAt: "2024-01-25", size: "2.4 MB" },
  { id: "doc-2", name: "Palm Jumeirah Villa - Flyer", type: "flyer", property: "Palm Jumeirah Villa", createdAt: "2024-01-24", size: "1.8 MB" },
  { id: "doc-3", name: "Investment Analysis Report", type: "report", property: "Business Bay Tower", createdAt: "2024-01-23", size: "450 KB" },
  { id: "doc-4", name: "Commission Invoice - Ahmed", type: "invoice", property: null, createdAt: "2024-01-22", size: "120 KB" },
  { id: "doc-5", name: "Property Comparison Sheet", type: "comparison", property: "Multiple", createdAt: "2024-01-21", size: "890 KB" },
];

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const typeIcon = {
    brochure: <FileText className="w-5 h-5 text-primary" />,
    flyer: <Image className="w-5 h-5 text-accent" />,
    report: <FileText className="w-5 h-5 text-success" />,
    invoice: <FileText className="w-5 h-5 text-warning" />,
    comparison: <FileText className="w-5 h-5 text-purple-500" />,
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Documents"
        subtitle="AI-powered document generation and management"
      />

      <div className="p-6 space-y-6">
        {/* AI Document Generator */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">AI Document Generator</h3>
                <p className="text-foreground-muted mb-4">
                  Create professional brochures, flyers, and reports with a simple prompt. 
                  AI will select the best images and generate compelling content.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    placeholder="e.g., Create a luxury 2-page flyer for Palm Villa highlighting ROI and beach proximity..."
                    className="flex-1"
                  />
                  <Button variant="primary" className="flex items-center gap-2 whitespace-nowrap">
                    <Sparkles className="w-4 h-4" />
                    Generate Document
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Property Brochure</p>
                <p className="text-xs text-foreground-muted">Multi-page PDF</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Image className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Property Flyer</p>
                <p className="text-xs text-foreground-muted">Single page</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <FileText className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Investment Report</p>
                <p className="text-xs text-foreground-muted">ROI Analysis</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                <FolderOpen className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">Comparison Sheet</p>
                <p className="text-xs text-foreground-muted">Multi-property</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search documents..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              options={[
                { value: "all", label: "All Types" },
                { value: "brochure", label: "Brochures" },
                { value: "flyer", label: "Flyers" },
                { value: "report", label: "Reports" },
                { value: "invoice", label: "Invoices" },
              ]}
              className="w-36"
            />

            <Button variant="secondary" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>

            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Document</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden md:table-cell">Property</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden lg:table-cell">Created</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden sm:table-cell">Size</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-foreground-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-background-secondary/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-background-tertiary flex items-center justify-center">
                          {typeIcon[doc.type as keyof typeof typeIcon]}
                        </div>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">{doc.name}</p>
                          <Badge variant="default" className="mt-1">{doc.type}</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-foreground-muted hidden md:table-cell">
                      {doc.property || "-"}
                    </td>
                    <td className="px-5 py-4 text-foreground-muted hidden lg:table-cell">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-foreground-muted hidden sm:table-cell">
                      {doc.size}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
