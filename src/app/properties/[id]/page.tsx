"use client";

import { Header } from "@/components/layout";
import { Button, Badge, Card, CardContent, Progress } from "@/components/ui";
import { mockProperties } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { 
  Bed, Bath, Maximize, MapPin, Calendar, TrendingUp, 
  Heart, Share2, Phone, MessageSquare, Mail, ChevronLeft,
  Building2, Check, FileText, Calculator
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const property = mockProperties.find((p) => p.id === id) || mockProperties[0];

  const statusVariant = {
    "off-plan": "info",
    ready: "success",
    sold: "danger",
    reserved: "warning",
    available: "success",
  } as const;

  return (
    <div className="min-h-screen">
      <Header
        title={property.title}
        subtitle={`${property.area}, ${property.city}`}
        actions={
          <Link href="/properties">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
              <Image
                src={property.images_urls[0] || "/placeholder.jpg"}
                alt={property.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant={statusVariant[property.status] || "default"} size="md">
                  {property.status}
                </Badge>
                {property.metadata_json?.roi && (
                  <Badge variant="purple" size="md">
                    {property.metadata_json.roi}% ROI
                  </Badge>
                )}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Property Info */}
            <Card>
              <CardContent>
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-primary" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-primary" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-primary" />
                    <span>{property.size_sqft.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{property.country}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-foreground-muted leading-relaxed">
                  {property.metadata_json?.description || 
                    `Experience luxury living in this stunning ${property.property_type} located in the heart of ${property.area}. 
                    This property offers ${property.bedrooms} spacious bedrooms, ${property.bathrooms} modern bathrooms, and 
                    ${property.size_sqft.toLocaleString()} sqft of premium living space. Perfect for families and investors alike.`}
                </p>

                {property.metadata_json?.amenities && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.metadata_json.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-background-secondary rounded-full text-sm"
                        >
                          <Check className="w-4 h-4 text-success" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Plan */}
            {property.payment_plan_json && (
              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-4">Payment Plan</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-background-secondary rounded-xl text-center">
                      <p className="text-3xl font-bold text-primary mb-1">
                        {property.payment_plan_json.downPayment}%
                      </p>
                      <p className="text-sm text-foreground-muted">Down Payment</p>
                      <p className="text-sm font-medium mt-2">
                        {formatCurrency(property.price_aed * property.payment_plan_json.downPayment / 100)}
                      </p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-xl text-center">
                      <p className="text-3xl font-bold text-accent mb-1">
                        {property.payment_plan_json.duringConstruction}%
                      </p>
                      <p className="text-sm text-foreground-muted">During Construction</p>
                      <p className="text-sm font-medium mt-2">
                        {formatCurrency(property.price_aed * property.payment_plan_json.duringConstruction / 100)}
                      </p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-xl text-center">
                      <p className="text-3xl font-bold text-success mb-1">
                        {property.payment_plan_json.onHandover}%
                      </p>
                      <p className="text-sm text-foreground-muted">On Handover</p>
                      <p className="text-sm font-medium mt-2">
                        {formatCurrency(property.price_aed * property.payment_plan_json.onHandover / 100)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="sticky top-24">
              <CardContent>
                <p className="text-3xl font-bold mb-1">{formatCurrency(property.price_aed)}</p>
                {property.metadata_json?.serviceCharge && (
                  <p className="text-sm text-foreground-muted mb-4">
                    Service Charge: AED {property.metadata_json.serviceCharge}/sqft
                  </p>
                )}

                {property.completion_date && (
                  <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg mb-4">
                    <Calendar className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Completion Date</p>
                      <p className="text-accent font-semibold">{property.completion_date}</p>
                    </div>
                  </div>
                )}

                {property.metadata_json?.roi && (
                  <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg mb-4">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-sm font-medium">Expected ROI</p>
                      <p className="text-success font-semibold">{property.metadata_json.roi}% annually</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mt-6">
                  <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Inquire via WhatsApp
                  </Button>
                  <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Schedule Viewing
                  </Button>
                  <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Inquiry
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1">
                      <FileText className="w-4 h-4" />
                      Brochure
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1">
                      <Calculator className="w-4 h-4" />
                      Calculator
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Developer Card */}
            {property.developer && (
              <Card>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-background-tertiary flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{property.developer.name}</p>
                      <p className="text-sm text-foreground-muted">{property.developer.country_origin}</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full">
                    View Developer Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
