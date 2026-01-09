"use client";

import { Property } from "@/types";
import { Card, Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Bed, Bath, Maximize, MapPin, Heart, Share2, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const statusVariant = {
    "off-plan": "info",
    ready: "success",
    sold: "danger",
    reserved: "warning",
    available: "success",
  } as const;

  return (
    <Card hover className="group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images_urls[0] || "/placeholder.jpg"}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={statusVariant[property.status] || "default"}>
            {property.status}
          </Badge>
          {property.metadata_json?.roi && (
            <Badge variant="purple">{property.metadata_json.roi}% ROI</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-2xl font-bold text-white">
            {formatCurrency(property.price_aed)}
          </p>
          {property.payment_plan_json && (
            <p className="text-sm text-white/80">
              {property.payment_plan_json.downPayment}% Down Payment
            </p>
          )}
        </div>
      </div>

      <Link href={`/properties/${property.id}`} className="block p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1 text-foreground-muted mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{property.area}, {property.city}, {property.country}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-foreground-muted mb-3">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            {property.size_sqft.toLocaleString()} sqft
          </span>
        </div>

        {property.completion_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-accent" />
            <span className="text-foreground-muted">Completion:</span>
            <span className="text-accent font-medium">{property.completion_date}</span>
          </div>
        )}

        {property.developer && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-background-tertiary flex items-center justify-center text-xs font-medium">
              {property.developer.name[0]}
            </div>
            <span className="text-sm text-foreground-muted">{property.developer.name}</span>
          </div>
        )}
      </Link>
    </Card>
  );
}
