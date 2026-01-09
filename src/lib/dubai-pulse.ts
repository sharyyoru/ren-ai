// Dubai Pulse Open Data API - DLD Transactions
// No API key required - Open Data
// Documentation: https://www.dubaipulse.gov.ae/

const DUBAI_PULSE_BASE = process.env.DUBAI_PULSE_BASE_URL || "https://www.dubaipulse.gov.ae";

// DLD Open Data endpoints
const DLD_ENDPOINTS = {
  // Real estate transactions dataset
  transactions: "https://gateway.dubaipulse.gov.ae/open-data/DLD/dld_transactions/json",
  // Alternative: Direct CSV download
  transactionsCsv: "https://www.dubaipulse.gov.ae/dataset/25e7cfc2-24e4-4956-8643-96515afc2227/resource/d65e12f0-9f8f-4f87-ade6-a7dbcde27f8d/download/dld_transactions.csv",
};

export interface DLDTransaction {
  transaction_id: string;
  transaction_date: string;
  registration_type: string;
  transaction_type: string;
  trans_group: string;
  usage: string;
  area_name: string;
  building_name?: string;
  project_name?: string;
  property_type: string;
  property_sub_type?: string;
  amount: number;
  transaction_size_sqm?: number;
  no_of_rooms?: string;
  is_offplan: boolean;
  is_free_hold: boolean;
  nearest_metro?: string;
  nearest_mall?: string;
  nearest_landmark?: string;
}

export interface DLDFilters {
  area?: string;
  propertyType?: string;
  transactionType?: string;
  minPrice?: number;
  maxPrice?: number;
  fromDate?: string;
  toDate?: string;
  isOffplan?: boolean;
  limit?: number;
  offset?: number;
}

// Fetch DLD transactions from Dubai Pulse Open Data REST API
export async function fetchDLDTransactions(filters: DLDFilters = {}): Promise<DLDTransaction[]> {
  try {
    // Try fetching from Dubai Pulse API
    const response = await fetch(DLD_ENDPOINTS.transactions, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const data = await response.json();
      
      // Transform API response to our format
      const transactions: DLDTransaction[] = (data.result?.records || data.records || data || [])
        .map((record: Record<string, unknown>) => ({
          transaction_id: String(record.TRANSACTION_ID || record.transaction_id || `DLD-${Date.now()}`),
          transaction_date: String(record.INSTANCE_DATE || record.transaction_date || new Date().toISOString()),
          registration_type: String(record.REGISTRATION_TYPE || record.reg_type || "Sales"),
          transaction_type: String(record.TRANSACTION_TYPE || record.trans_type || "Sale"),
          trans_group: String(record.TRANS_GROUP || record.trans_group || "Sales"),
          usage: String(record.USAGE_EN || record.usage || "Residential"),
          area_name: String(record.AREA_EN || record.area_name || "Dubai"),
          building_name: record.BUILDING_EN ? String(record.BUILDING_EN) : undefined,
          project_name: record.PROJECT_EN ? String(record.PROJECT_EN) : undefined,
          property_type: String(record.PROPERTY_TYPE_EN || record.property_type || "Unit"),
          property_sub_type: record.PROPERTY_SUB_TYPE_EN ? String(record.PROPERTY_SUB_TYPE_EN) : undefined,
          amount: Number(record.ACTUAL_WORTH || record.amount || 0),
          transaction_size_sqm: record.PROCEDURE_AREA ? Number(record.PROCEDURE_AREA) : undefined,
          no_of_rooms: record.ROOMS_EN ? String(record.ROOMS_EN) : undefined,
          is_offplan: Boolean(record.IS_OFFPLAN_EN === "Yes" || record.is_offplan),
          is_free_hold: Boolean(record.IS_FREE_HOLD_EN === "Yes" || record.is_free_hold !== false),
          nearest_metro: record.NEAREST_METRO_EN ? String(record.NEAREST_METRO_EN) : undefined,
          nearest_mall: record.NEAREST_MALL_EN ? String(record.NEAREST_MALL_EN) : undefined,
          nearest_landmark: record.NEAREST_LANDMARK_EN ? String(record.NEAREST_LANDMARK_EN) : undefined,
        }));

      return applyFilters(transactions, filters);
    }
  } catch (error) {
    console.warn("Dubai Pulse API unavailable, using fallback data:", error);
  }

  // Fallback to sample data if API is unavailable
  return applyFilters(getFallbackTransactions(), filters);
}

// Apply filters to transactions
function applyFilters(transactions: DLDTransaction[], filters: DLDFilters): DLDTransaction[] {
  let filtered = [...transactions];

  if (filters.area) {
    filtered = filtered.filter(t => 
      t.area_name.toLowerCase().includes(filters.area!.toLowerCase())
    );
  }

  if (filters.propertyType) {
    filtered = filtered.filter(t => 
      t.property_type.toLowerCase() === filters.propertyType!.toLowerCase()
    );
  }

  if (filters.transactionType) {
    filtered = filtered.filter(t => 
      t.transaction_type.toLowerCase() === filters.transactionType!.toLowerCase()
    );
  }

  if (filters.minPrice) {
    filtered = filtered.filter(t => t.amount >= filters.minPrice!);
  }

  if (filters.maxPrice) {
    filtered = filtered.filter(t => t.amount <= filters.maxPrice!);
  }

  if (filters.fromDate) {
    filtered = filtered.filter(t => t.transaction_date >= filters.fromDate!);
  }

  if (filters.toDate) {
    filtered = filtered.filter(t => t.transaction_date <= filters.toDate!);
  }

  if (filters.isOffplan !== undefined) {
    filtered = filtered.filter(t => t.is_offplan === filters.isOffplan);
  }

  if (filters.limit) {
    filtered = filtered.slice(filters.offset || 0, (filters.offset || 0) + filters.limit);
  }

  return filtered;
}

// Fallback sample data when API is unavailable
function getFallbackTransactions(): DLDTransaction[] {
  return [
    {
      transaction_id: "DLD-2024-001234",
      transaction_date: "2024-01-25",
      registration_type: "Sales",
      transaction_type: "Sale",
      trans_group: "Sales",
      usage: "Residential",
      area_name: "Business Bay",
      building_name: "The Opus",
      project_name: "The Opus by Omniyat",
      property_type: "Unit",
      property_sub_type: "Flat",
      amount: 4500000,
      transaction_size_sqm: 185,
      no_of_rooms: "2 B/R",
      is_offplan: false,
      is_free_hold: true,
      nearest_metro: "Business Bay Metro",
      nearest_mall: "Dubai Mall",
      nearest_landmark: "Burj Khalifa",
    },
    {
      transaction_id: "DLD-2024-001235",
      transaction_date: "2024-01-25",
      registration_type: "Sales",
      transaction_type: "Sale",
      trans_group: "Sales",
      usage: "Residential",
      area_name: "Dubai Marina",
      building_name: "Marina Gate",
      project_name: "Marina Gate Tower 1",
      property_type: "Unit",
      property_sub_type: "Flat",
      amount: 2800000,
      transaction_size_sqm: 120,
      no_of_rooms: "1 B/R",
      is_offplan: false,
      is_free_hold: true,
      nearest_metro: "DMCC Metro",
      nearest_mall: "Dubai Marina Mall",
      nearest_landmark: "Marina Walk",
    },
    {
      transaction_id: "DLD-2024-001236",
      transaction_date: "2024-01-24",
      registration_type: "Sales",
      transaction_type: "Sale",
      trans_group: "Sales",
      usage: "Residential",
      area_name: "Palm Jumeirah",
      building_name: "Atlantis The Royal",
      project_name: "Atlantis The Royal Residences",
      property_type: "Unit",
      property_sub_type: "Flat",
      amount: 15000000,
      transaction_size_sqm: 350,
      no_of_rooms: "3 B/R",
      is_offplan: false,
      is_free_hold: true,
      nearest_metro: "N/A",
      nearest_mall: "Nakheel Mall",
      nearest_landmark: "Atlantis The Palm",
    },
    {
      transaction_id: "DLD-2024-001237",
      transaction_date: "2024-01-24",
      registration_type: "Sales",
      transaction_type: "Sale",
      trans_group: "Sales",
      usage: "Residential",
      area_name: "Downtown Dubai",
      building_name: "Burj Vista",
      project_name: "Burj Vista by Emaar",
      property_type: "Unit",
      property_sub_type: "Flat",
      amount: 3200000,
      transaction_size_sqm: 145,
      no_of_rooms: "2 B/R",
      is_offplan: true,
      is_free_hold: true,
      nearest_metro: "Burj Khalifa Metro",
      nearest_mall: "Dubai Mall",
      nearest_landmark: "Burj Khalifa",
    },
    {
      transaction_id: "DLD-2024-001238",
      transaction_date: "2024-01-23",
      registration_type: "Sales",
      transaction_type: "Sale",
      trans_group: "Sales",
      usage: "Residential",
      area_name: "Dubai Creek Harbour",
      building_name: "Creek Vista",
      project_name: "Creek Vista Heights",
      property_type: "Unit",
      property_sub_type: "Flat",
      amount: 1850000,
      transaction_size_sqm: 95,
      no_of_rooms: "1 B/R",
      is_offplan: true,
      is_free_hold: true,
      nearest_metro: "Creek Metro",
      nearest_mall: "Festival City Mall",
      nearest_landmark: "Dubai Creek Tower",
    },
  ];
}

// Get market statistics from DLD data
export async function getDLDMarketStats(): Promise<{
  totalTransactions: number;
  totalVolume: number;
  avgPrice: number;
  topAreas: { area: string; count: number; volume: number }[];
  recentTransactions: DLDTransaction[];
}> {
  const transactions = await fetchDLDTransactions({ limit: 100 });
  
  const areaStats: Record<string, { count: number; volume: number }> = {};
  let totalVolume = 0;

  transactions.forEach(t => {
    totalVolume += t.amount;
    if (!areaStats[t.area_name]) {
      areaStats[t.area_name] = { count: 0, volume: 0 };
    }
    areaStats[t.area_name].count++;
    areaStats[t.area_name].volume += t.amount;
  });

  const topAreas = Object.entries(areaStats)
    .map(([area, stats]) => ({ area, ...stats }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  return {
    totalTransactions: transactions.length,
    totalVolume,
    avgPrice: transactions.length > 0 ? Math.round(totalVolume / transactions.length) : 0,
    topAreas,
    recentTransactions: transactions.slice(0, 10),
  };
}

// Get DLD data download URLs
export function getDLDDataUrls(): { json: string; csv: string; portal: string } {
  return {
    json: DLD_ENDPOINTS.transactions,
    csv: DLD_ENDPOINTS.transactionsCsv,
    portal: "https://www.dubaipulse.gov.ae/data/dld-transactions/dld_transactions-open",
  };
}
