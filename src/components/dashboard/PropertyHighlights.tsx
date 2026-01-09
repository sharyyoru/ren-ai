"use client";

import { Card, CardHeader, CardContent, Badge } from "@/components/ui";
import { mockProperties } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, Bed, Bath, Maximize, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function PropertyHighlights() {
  const featuredProperties = mockProperties.slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold">Featured Properties</h3>
          <p className="text-sm text-foreground-muted">Hot listings this week</p>
        </div>
        <Link
          href="/properties"
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {featuredProperties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="flex gap-4 p-3 rounded-lg bg-background-secondary hover:bg-background-tertiary transition-colors group"
            >
              <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={property.images_urls[0] || "/placeholder.jpg"}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge
                  variant={property.status === "ready" ? "success" : "info"}
                  className="absolute top-1 left-1"
                >
                  {property.status}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate group-hover:text-primary transition-colors">
                  {property.title}
                </p>
                <div className="flex items-center gap-1 text-sm text-foreground-muted mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{property.area}, {property.city}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="w-3 h-3" />
                    {property.size_sqft.toLocaleString()} sqft
                  </span>
                </div>
                <p className="text-lg font-bold text-primary mt-2">
                  {formatCurrency(property.price_aed)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
