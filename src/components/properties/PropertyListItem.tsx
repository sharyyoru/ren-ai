"use client";

import { Property } from "@/types";
import { Card, Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Bed, Bath, Maximize, MapPin, Heart, Share2, Calendar, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyListItemProps {
  property: Property;
}

export function PropertyListItem({ property }: PropertyListItemProps) {
  const statusVariant = {
    "off-plan": "info",
    ready: "success",
    sold: "danger",
    reserved: "warning",
    available: "success",
  } as const;

  return (
    <Card hover className="group">
      <Link href={`/properties/${property.id}`} className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0 overflow-hidden">
          <Image
            src={property.images_urls[0] || "/placeholder.jpg"}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={statusVariant[property.status] || "default"}>
              {property.status}
            </Badge>
          </div>
        </div>

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 text-foreground-muted mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.area}, {property.city}, {property.country}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                <Heart className="w-4 h-4 text-foreground-muted" />
              </button>
              <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                <Share2 className="w-4 h-4 text-foreground-muted" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted my-4">
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
            {property.completion_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-accent">{property.completion_date}</span>
              </span>
            )}
            {property.metadata_json?.roi && (
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-success">{property.metadata_json.roi}% ROI</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(property.price_aed)}
              </p>
              {property.payment_plan_json && (
                <p className="text-sm text-foreground-muted">
                  {property.payment_plan_json.downPayment}% down · {property.payment_plan_json.duringConstruction}% during · {property.payment_plan_json.onHandover}% handover
                </p>
              )}
            </div>
            
            {property.developer && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background-secondary rounded-lg">
                <div className="w-5 h-5 rounded bg-background-tertiary flex items-center justify-center text-xs font-medium">
                  {property.developer.name[0]}
                </div>
                <span className="text-sm">{property.developer.name}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
