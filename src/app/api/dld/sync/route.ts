import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Dubai Pulse DLD Open Data endpoints
const DLD_API_URL = "https://gateway.dubaipulse.gov.ae/open-data/DLD/dld_transactions/json";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100");
    const area = searchParams.get("area");

    // Fetch from Dubai Pulse API
    const response = await fetch(DLD_API_URL, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      // Return fallback data if API is unavailable
      return NextResponse.json({
        success: true,
        source: "fallback",
        data: getFallbackData(limit, area),
        message: "Using fallback data - Dubai Pulse API temporarily unavailable"
      });
    }

    const apiData = await response.json();
    const records = apiData.result?.records || apiData.records || apiData || [];

    // Transform and filter data
    let transactions = records.map((record: Record<string, unknown>) => ({
      transaction_number: String(record.TRANSACTION_ID || record.transaction_id || `DLD-${Date.now()}-${Math.random()}`),
      transaction_date: formatDate(record.INSTANCE_DATE || record.transaction_date),
      amount_aed: Number(record.ACTUAL_WORTH || record.amount || 0),
      transaction_type: String(record.TRANSACTION_TYPE || "Sale"),
      area_name: String(record.AREA_EN || record.area_name || "Dubai"),
      property_type: String(record.PROPERTY_TYPE_EN || record.property_type || "Unit"),
      raw_data: record,
    }));

    // Apply filters
    if (area) {
      transactions = transactions.filter((t: { area_name: string }) => 
        t.area_name.toLowerCase().includes(area.toLowerCase())
      );
    }

    transactions = transactions.slice(0, limit);

    // Save to Supabase
    if (transactions.length > 0) {
      const { error } = await supabase
        .from("dld_transactions")
        .upsert(transactions, { onConflict: "transaction_number" });

      if (error) {
        console.error("Error saving to Supabase:", error);
      }
    }

    return NextResponse.json({
      success: true,
      source: "dubai_pulse",
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("DLD sync error:", error);
    
    // Return fallback data on error
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: getFallbackData(50, null),
      message: "Using fallback data due to error"
    });
  }
}

function formatDate(dateValue: unknown): string {
  if (!dateValue) return new Date().toISOString().split("T")[0];
  
  try {
    const date = new Date(String(dateValue));
    return date.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

function getFallbackData(limit: number, area: string | null) {
  const areas = [
    "Business Bay", "Dubai Marina", "Downtown Dubai", "Palm Jumeirah",
    "Dubai Creek Harbour", "JBR", "DIFC", "Dubai Hills Estate",
    "Arabian Ranches", "Jumeirah Village Circle", "Dubai South"
  ];

  const propertyTypes = ["Apartment", "Villa", "Townhouse", "Penthouse", "Office"];
  
  let data = Array.from({ length: 100 }, (_, i) => {
    const areaName = areas[Math.floor(Math.random() * areas.length)];
    const basePrice = Math.floor(Math.random() * 10000000) + 500000;
    
    return {
      transaction_number: `DLD-2024-${String(i + 1).padStart(6, "0")}`,
      transaction_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount_aed: basePrice,
      transaction_type: "Sale",
      area_name: areaName,
      property_type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      raw_data: null,
    };
  });

  if (area) {
    data = data.filter(t => t.area_name.toLowerCase().includes(area.toLowerCase()));
  }

  return data.slice(0, limit);
}

// POST endpoint to manually add DLD transaction
export async function POST(request: NextRequest) {
  try {
    const transaction = await request.json();

    const { data, error } = await supabase
      .from("dld_transactions")
      .insert({
        transaction_number: transaction.transaction_number || `DLD-${Date.now()}`,
        transaction_date: transaction.transaction_date || new Date().toISOString().split("T")[0],
        amount_aed: transaction.amount_aed,
        transaction_type: transaction.transaction_type || "Sale",
        area_name: transaction.area_name,
        property_type: transaction.property_type,
        raw_data: transaction,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 });
  }
}
