"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Card, CardContent, CardHeader, Badge, Select, Modal } from "@/components/ui";
import { mockProperties, mockDevelopers } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { SUPPORTED_MARKETS, DEVELOPERS_BY_MARKET, generateCSVTemplate } from "@/lib/property-feed";
import {
  Search, Plus, Upload, Download, Edit2, Trash2, Eye,
  Building2, MapPin, Bed, Bath, Square, DollarSign, Calendar
} from "lucide-react";

export default function AdminPropertiesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState("UAE");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProperty, setNewProperty] = useState({
    title: "",
    developer: "",
    country: "UAE",
    city: "Dubai",
    area: "",
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 0,
    priceAED: 0,
    completionDate: "",
    status: "off-plan",
    images: "",
    amenities: "",
    downPayment: 20,
    duringConstruction: 50,
    onHandover: 30,
  });

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "property_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Parse CSV and add properties
      console.log("Uploading file:", file.name);
      setIsImportModalOpen(false);
    }
  };

  const selectedMarketData = SUPPORTED_MARKETS.find(m => m.code === selectedMarket);
  const developers = DEVELOPERS_BY_MARKET[selectedMarket] || [];

  return (
    <div className="min-h-screen">
      <Header
        title="Property Management"
        subtitle="Add, edit, and manage property listings"
      />

      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search properties..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex gap-2">
            <Select
              options={SUPPORTED_MARKETS.map(m => ({ value: m.code, label: m.name }))}
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-40"
            />

            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import CSV</span>
            </Button>

            <Button
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Property</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-foreground-muted">Total Properties</p>
            <p className="text-2xl font-bold">{mockProperties.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-foreground-muted">Off-Plan</p>
            <p className="text-2xl font-bold">{mockProperties.filter(p => p.status === "off-plan").length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-foreground-muted">Ready</p>
            <p className="text-2xl font-bold">{mockProperties.filter(p => p.status === "ready").length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-foreground-muted">Developers</p>
            <p className="text-2xl font-bold">{mockDevelopers.length}</p>
          </Card>
        </div>

        {/* Properties Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted">Property</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden md:table-cell">Location</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-foreground-muted hidden lg:table-cell">Details</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-foreground-muted">Price</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-foreground-muted">Status</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-foreground-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg bg-background-tertiary overflow-hidden">
                          {property.images_urls[0] && (
                            <img
                              src={property.images_urls[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-xs text-foreground-muted">
                            {mockDevelopers.find(d => d.id === property.developer_id)?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm text-foreground-muted">
                        <MapPin className="w-3 h-3" />
                        {property.area}, {property.city}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-sm text-foreground-muted">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" /> {property.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3" /> {property.bathrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="w-3 h-3" /> {property.size_sqft} sqft
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">
                      {formatCurrency(property.price_aed)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={property.status === "off-plan" ? "purple" : "success"}>
                        {property.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit2 className="w-4 h-4" />
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

      {/* Add Property Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Property"
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Property Title *</label>
              <Input
                placeholder="e.g., Creek Vista 2BR Apartment"
                value={newProperty.title}
                onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country *</label>
              <Select
                options={SUPPORTED_MARKETS.map(m => ({ value: m.code, label: m.name }))}
                value={newProperty.country}
                onChange={(e) => setNewProperty({ ...newProperty, country: e.target.value, city: SUPPORTED_MARKETS.find(m => m.code === e.target.value)?.cities[0] || "" })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <Select
                options={(SUPPORTED_MARKETS.find(m => m.code === newProperty.country)?.cities || []).map(c => ({ value: c, label: c }))}
                value={newProperty.city}
                onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Developer *</label>
              <Select
                options={(DEVELOPERS_BY_MARKET[newProperty.country] || []).map(d => ({ value: d, label: d }))}
                value={newProperty.developer}
                onChange={(e) => setNewProperty({ ...newProperty, developer: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Area/District *</label>
              <Input
                placeholder="e.g., Dubai Creek Harbour"
                value={newProperty.area}
                onChange={(e) => setNewProperty({ ...newProperty, area: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Property Type</label>
              <Select
                options={[
                  { value: "apartment", label: "Apartment" },
                  { value: "villa", label: "Villa" },
                  { value: "townhouse", label: "Townhouse" },
                  { value: "penthouse", label: "Penthouse" },
                  { value: "duplex", label: "Duplex" },
                ]}
                value={newProperty.propertyType}
                onChange={(e) => setNewProperty({ ...newProperty, propertyType: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select
                options={[
                  { value: "off-plan", label: "Off-Plan" },
                  { value: "ready", label: "Ready" },
                  { value: "available", label: "Available" },
                ]}
                value={newProperty.status}
                onChange={(e) => setNewProperty({ ...newProperty, status: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <Input
                type="number"
                min={0}
                value={newProperty.bedrooms}
                onChange={(e) => setNewProperty({ ...newProperty, bedrooms: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bathrooms</label>
              <Input
                type="number"
                min={0}
                value={newProperty.bathrooms}
                onChange={(e) => setNewProperty({ ...newProperty, bathrooms: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size (sqft)</label>
              <Input
                type="number"
                min={0}
                value={newProperty.sizeSqft}
                onChange={(e) => setNewProperty({ ...newProperty, sizeSqft: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price (AED) *</label>
              <Input
                type="number"
                min={0}
                value={newProperty.priceAED}
                onChange={(e) => setNewProperty({ ...newProperty, priceAED: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Completion Date</label>
              <Input
                placeholder="e.g., Q4 2025"
                value={newProperty.completionDate}
                onChange={(e) => setNewProperty({ ...newProperty, completionDate: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Image URLs (one per line)</label>
              <textarea
                className="w-full bg-background-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                value={newProperty.images}
                onChange={(e) => setNewProperty({ ...newProperty, images: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Payment Plan</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-foreground-muted mb-1">Down Payment %</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={newProperty.downPayment}
                    onChange={(e) => setNewProperty({ ...newProperty, downPayment: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground-muted mb-1">During Construction %</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={newProperty.duringConstruction}
                    onChange={(e) => setNewProperty({ ...newProperty, duringConstruction: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground-muted mb-1">On Handover %</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={newProperty.onHandover}
                    onChange={(e) => setNewProperty({ ...newProperty, onHandover: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import CSV Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Properties from CSV"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-muted">
            Upload a CSV file with property data. Download our template to ensure correct formatting.
          </p>

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-10 h-10 text-foreground-muted mx-auto mb-3" />
            <p className="font-medium mb-1">Drop your CSV file here</p>
            <p className="text-sm text-foreground-muted mb-4">or click to browse</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Select File
            </Button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={handleDownloadTemplate}
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
            <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
