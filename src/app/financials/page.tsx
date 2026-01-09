"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Card, CardContent, CardHeader, Badge, Tabs, Select } from "@/components/ui";
import { mockDeals } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Search, Plus, FileText, Receipt, Download, Send, 
  MoreVertical, Filter, TrendingUp, DollarSign, Clock, CheckCircle
} from "lucide-react";

const mockInvoices = [
  { id: "inv-1", dealId: "deal-3", type: "invoice", number: "INV-2024-001", clientName: "Mohammed Khan", amount: 49000, status: "paid", date: "2024-01-25", dueDate: "2024-02-25" },
  { id: "inv-2", dealId: "deal-1", type: "invoice", number: "INV-2024-002", clientName: "Ahmed Al Maktoum", amount: 370000, status: "pending", date: "2024-01-22", dueDate: "2024-02-22" },
  { id: "inv-3", dealId: "deal-2", type: "quote", number: "QUO-2024-001", clientName: "Sarah Johnson", amount: 17800, status: "sent", date: "2024-01-20", dueDate: "2024-02-20" },
  { id: "inv-4", dealId: "deal-4", type: "invoice", number: "INV-2024-003", clientName: "Elena Petrova", amount: 24000, status: "overdue", date: "2024-01-10", dueDate: "2024-01-25" },
];

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All", count: mockInvoices.length },
    { id: "invoices", label: "Invoices", count: mockInvoices.filter(i => i.type === "invoice").length },
    { id: "quotes", label: "Quotes", count: mockInvoices.filter(i => i.type === "quote").length },
  ];

  const filteredItems = mockInvoices.filter(item => {
    if (activeTab === "invoices") return item.type === "invoice";
    if (activeTab === "quotes") return item.type === "quote";
    return true;
  });

  const totalPending = mockInvoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = mockInvoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = mockInvoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);

  const statusVariant = {
    paid: "success",
    pending: "warning",
    sent: "info",
    overdue: "danger",
    draft: "default",
  } as const;

  return (
    <div className="min-h-screen">
      <Header
        title="Financials"
        subtitle="Manage invoices, quotes, and commission tracking"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Total Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Pending</p>
                <p className="text-xl font-bold">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-danger" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Overdue</p>
                <p className="text-xl font-bold">{formatCurrency(totalOverdue)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Commission Rate</p>
                <p className="text-xl font-bold">2%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab="all" onChange={setActiveTab} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search invoices..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              options={[
                { value: "all", label: "All Status" },
                { value: "paid", label: "Paid" },
                { value: "pending", label: "Pending" },
                { value: "overdue", label: "Overdue" },
              ]}
              className="w-36"
            />

            <Button variant="secondary" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>

            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Invoice</span>
            </Button>
          </div>
        </div>

        {/* Invoice List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Invoice</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Client</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden lg:table-cell">Due Date</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-foreground-muted">Amount</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-foreground-muted">Status</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-foreground-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.type === "invoice" ? "bg-primary/10" : "bg-accent/10"
                        }`}>
                          {item.type === "invoice" ? (
                            <Receipt className="w-5 h-5 text-primary" />
                          ) : (
                            <FileText className="w-5 h-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.number}</p>
                          <p className="text-xs text-foreground-muted capitalize">{item.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{item.clientName}</p>
                    </td>
                    <td className="px-5 py-4 text-foreground-muted hidden md:table-cell">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-5 py-4 text-foreground-muted hidden lg:table-cell">
                      {formatDate(item.dueDate)}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={statusVariant[item.status as keyof typeof statusVariant]}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Invoice Generator */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">AI Invoice Generator</h3>
            <p className="text-sm text-foreground-muted">
              Automatically generate invoices based on deal stage changes
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background-secondary rounded-lg">
                <h4 className="font-medium mb-2">Auto-Generate Rule</h4>
                <p className="text-sm text-foreground-muted mb-3">
                  When a deal moves to &quot;SPA Signed&quot;, automatically generate a 2% commission invoice
                </p>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="p-4 bg-background-secondary rounded-lg">
                <h4 className="font-medium mb-2">Payment Reminder</h4>
                <p className="text-sm text-foreground-muted mb-3">
                  Send automatic reminder 3 days before due date
                </p>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
