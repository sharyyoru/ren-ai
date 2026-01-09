// Internal Property Feed System
// Replaces external APIs like Reelly with our own data management

import { convertToAED } from "./exchange-rate";

export interface PropertyFeedItem {
  id: string;
  title: string;
  developer: string;
  country: string;
  city: string;
  area: string;
  propertyType: "apartment" | "villa" | "townhouse" | "penthouse" | "duplex" | "land";
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  priceAED: number;
  originalPrice?: number;
  originalCurrency?: string;
  completionDate?: string;
  status: "available" | "sold" | "reserved" | "off-plan" | "ready";
  images: string[];
  paymentPlan?: {
    downPayment: number;
    duringConstruction: number;
    onHandover: number;
    postHandover?: number;
    installmentYears?: number;
  };
  amenities: string[];
  description?: string;
  roi?: number;
  serviceCharge?: number;
  source: "manual" | "csv" | "scraper" | "developer_api";
  createdAt: string;
  updatedAt: string;
}

export interface CSVPropertyRow {
  title: string;
  developer: string;
  country: string;
  city: string;
  area: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  size_sqft: string;
  price: string;
  currency: string;
  completion_date?: string;
  status?: string;
  images?: string;
  amenities?: string;
  down_payment?: string;
  during_construction?: string;
  on_handover?: string;
}

// Parse CSV data into PropertyFeedItem format
export async function parseCSVProperties(csvData: string): Promise<PropertyFeedItem[]> {
  const lines = csvData.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
  
  const properties: PropertyFeedItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || "";
    });

    // Convert price to AED if needed
    const originalPrice = parseFloat(row.price) || 0;
    const currency = row.currency?.toUpperCase() || "AED";
    const priceAED = currency === "AED" 
      ? originalPrice 
      : await convertToAED(originalPrice, currency);

    const property: PropertyFeedItem = {
      id: `prop-${Date.now()}-${i}`,
      title: row.title || "Untitled Property",
      developer: row.developer || "Unknown Developer",
      country: row.country || "UAE",
      city: row.city || "Dubai",
      area: row.area || "",
      propertyType: validatePropertyType(row.property_type),
      bedrooms: parseInt(row.bedrooms) || 0,
      bathrooms: parseInt(row.bathrooms) || 0,
      sizeSqft: parseFloat(row.size_sqft) || 0,
      priceAED,
      originalPrice: currency !== "AED" ? originalPrice : undefined,
      originalCurrency: currency !== "AED" ? currency : undefined,
      completionDate: row.completion_date,
      status: validateStatus(row.status),
      images: row.images?.split(";").filter(Boolean) || [],
      amenities: row.amenities?.split(";").filter(Boolean) || [],
      paymentPlan: row.down_payment ? {
        downPayment: parseFloat(row.down_payment) || 0,
        duringConstruction: parseFloat(row.during_construction) || 0,
        onHandover: parseFloat(row.on_handover) || 0,
      } : undefined,
      source: "csv",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    properties.push(property);
  }

  return properties;
}

// Helper to parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

function validatePropertyType(type: string): PropertyFeedItem["propertyType"] {
  const validTypes = ["apartment", "villa", "townhouse", "penthouse", "duplex", "land"];
  const normalized = type?.toLowerCase().trim();
  return validTypes.includes(normalized) 
    ? normalized as PropertyFeedItem["propertyType"]
    : "apartment";
}

function validateStatus(status: string): PropertyFeedItem["status"] {
  const validStatuses = ["available", "sold", "reserved", "off-plan", "ready"];
  const normalized = status?.toLowerCase().trim();
  return validStatuses.includes(normalized)
    ? normalized as PropertyFeedItem["status"]
    : "available";
}

// Generate CSV template for bulk upload
export function generateCSVTemplate(): string {
  const headers = [
    "title",
    "developer", 
    "country",
    "city",
    "area",
    "property_type",
    "bedrooms",
    "bathrooms",
    "size_sqft",
    "price",
    "currency",
    "completion_date",
    "status",
    "images",
    "amenities",
    "down_payment",
    "during_construction",
    "on_handover",
  ];

  const exampleRow = [
    "Creek Vista 2BR Apartment",
    "Emaar",
    "UAE",
    "Dubai",
    "Dubai Creek Harbour",
    "apartment",
    "2",
    "2",
    "1200",
    "2500000",
    "AED",
    "Q4 2025",
    "off-plan",
    "https://example.com/img1.jpg;https://example.com/img2.jpg",
    "Pool;Gym;Parking;Concierge",
    "20",
    "50",
    "30",
  ];

  return [headers.join(","), exampleRow.join(",")].join("\n");
}

// Supported markets configuration
export const SUPPORTED_MARKETS = [
  { code: "UAE", name: "United Arab Emirates", currency: "AED", cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"] },
  { code: "TUR", name: "Turkey", currency: "TRY", cities: ["Istanbul", "Antalya", "Bodrum", "Izmir"] },
  { code: "THA", name: "Thailand", currency: "THB", cities: ["Bangkok", "Phuket", "Pattaya", "Chiang Mai"] },
  { code: "IDN", name: "Indonesia", currency: "IDR", cities: ["Bali", "Jakarta", "Lombok"] },
  { code: "CYP", name: "Cyprus", currency: "EUR", cities: ["Limassol", "Paphos", "Larnaca", "Nicosia"] },
];

// Popular developers by market
export const DEVELOPERS_BY_MARKET: Record<string, string[]> = {
  UAE: ["Emaar", "DAMAC", "Nakheel", "Sobha", "Meraas", "Dubai Properties", "Aldar", "Azizi", "Danube"],
  TUR: ["Ağaoğlu", "Emlak Konut", "Sinpaş", "Kalyon", "Tahincioğlu"],
  THA: ["Sansiri", "SC Asset", "AP Thailand", "Land & Houses", "Ananda"],
  IDN: ["Ciputra", "Agung Podomoro", "Lippo", "Summarecon", "Pakuwon"],
  CYP: ["Leptos Estates", "Pafilia", "Imperio", "Aristo Developers"],
};
