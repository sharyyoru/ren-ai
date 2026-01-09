"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Property, Contact, Deal, FunnelStage, Developer, Communication } from "@/types";

// Create Supabase client for browser
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const supabase = createClient();

// ==========================================
// PROPERTIES
// ==========================================

export async function getProperties(filters?: {
  country?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  developerId?: string;
  limit?: number;
  offset?: number;
}): Promise<Property[]> {
  let query = supabase
    .from("properties")
    .select(`
      *,
      developer:developers(*)
    `)
    .order("created_at", { ascending: false });

  if (filters?.country) query = query.eq("country", filters.country);
  if (filters?.city) query = query.eq("city", filters.city);
  if (filters?.propertyType) query = query.eq("property_type", filters.propertyType);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.developerId) query = query.eq("developer_id", filters.developerId);
  if (filters?.minPrice) query = query.gte("price_aed", filters.minPrice);
  if (filters?.maxPrice) query = query.lte("price_aed", filters.maxPrice);
  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
  
  return data || [];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      developer:developers(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data;
}

export async function createProperty(property: Partial<Property>): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .insert(property)
    .select()
    .single();

  if (error) {
    console.error("Error creating property:", error);
    return null;
  }

  return data;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating property:", error);
    return null;
  }

  return data;
}

// ==========================================
// CONTACTS
// ==========================================

export async function getContacts(filters?: {
  source?: string;
  minLeadScore?: number;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Contact[]> {
  let query = supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.source) query = query.eq("source", filters.source);
  if (filters?.minLeadScore) query = query.gte("lead_score", filters.minLeadScore);
  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }

  return data || [];
}

export async function getContactById(id: string): Promise<Contact | null> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching contact:", error);
    return null;
  }

  return data;
}

export async function createContact(contact: Partial<Contact>): Promise<Contact | null> {
  const { data, error } = await supabase
    .from("contacts")
    .insert(contact)
    .select()
    .single();

  if (error) {
    console.error("Error creating contact:", error);
    return null;
  }

  return data;
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
  const { data, error } = await supabase
    .from("contacts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating contact:", error);
    return null;
  }

  return data;
}

// ==========================================
// DEALS
// ==========================================

export async function getDeals(filters?: {
  stageId?: string;
  contactId?: string;
  limit?: number;
}): Promise<Deal[]> {
  let query = supabase
    .from("deals")
    .select(`
      *,
      contact:contacts(*),
      property:properties(*),
      stage:funnel_stages(*)
    `)
    .order("created_at", { ascending: false });

  if (filters?.stageId) query = query.eq("stage_id", filters.stageId);
  if (filters?.contactId) query = query.eq("contact_id", filters.contactId);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching deals:", error);
    return [];
  }

  return data || [];
}

export async function getFunnelStages(): Promise<FunnelStage[]> {
  const { data, error } = await supabase
    .from("funnel_stages")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching funnel stages:", error);
    return [];
  }

  return data || [];
}

export async function updateDealStage(dealId: string, stageId: string): Promise<Deal | null> {
  const { data, error } = await supabase
    .from("deals")
    .update({ stage_id: stageId })
    .eq("id", dealId)
    .select()
    .single();

  if (error) {
    console.error("Error updating deal stage:", error);
    return null;
  }

  return data;
}

// ==========================================
// DEVELOPERS
// ==========================================

export async function getDevelopers(): Promise<Developer[]> {
  const { data, error } = await supabase
    .from("developers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching developers:", error);
    return [];
  }

  return data || [];
}

// ==========================================
// COMMUNICATIONS
// ==========================================

export async function getCommunications(contactId: string): Promise<Communication[]> {
  const { data, error } = await supabase
    .from("communications")
    .select("*")
    .eq("contact_id", contactId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching communications:", error);
    return [];
  }

  return data || [];
}

export async function sendMessage(communication: {
  contact_id: string;
  type: "whatsapp" | "email";
  content: string;
  direction: "out";
}): Promise<Communication | null> {
  const { data, error } = await supabase
    .from("communications")
    .insert({
      ...communication,
      status: "sent",
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }

  return data;
}

// ==========================================
// DASHBOARD STATS
// ==========================================

export async function getDashboardStats() {
  const [
    { count: totalProperties },
    { count: totalContacts },
    { count: activeDeals },
    { data: dealsData },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("contacts").select("*", { count: "exact", head: true }),
    supabase.from("deals").select("*", { count: "exact", head: true }),
    supabase.from("deals").select("value_aed"),
  ]);

  const totalRevenue = dealsData?.reduce((sum, d) => sum + (d.value_aed || 0), 0) || 0;
  const avgDealValue = dealsData?.length ? totalRevenue / dealsData.length : 0;

  return {
    totalProperties: totalProperties || 0,
    totalContacts: totalContacts || 0,
    activeDeals: activeDeals || 0,
    totalRevenue,
    conversionRate: 23.5, // Calculate from actual data
    avgDealValue,
  };
}

// ==========================================
// DLD TRANSACTIONS
// ==========================================

export async function getDLDTransactions(filters?: {
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}) {
  let query = supabase
    .from("dld_transactions")
    .select("*")
    .order("transaction_date", { ascending: false });

  if (filters?.area) query = query.ilike("area_name", `%${filters.area}%`);
  if (filters?.minPrice) query = query.gte("amount_aed", filters.minPrice);
  if (filters?.maxPrice) query = query.lte("amount_aed", filters.maxPrice);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching DLD transactions:", error);
    return [];
  }

  return data || [];
}

export async function saveDLDTransactions(transactions: Array<{
  transaction_number: string;
  transaction_date: string;
  amount_aed: number;
  transaction_type: string;
  area_name: string;
  property_type?: string;
  raw_data?: object;
}>) {
  const { data, error } = await supabase
    .from("dld_transactions")
    .upsert(transactions, { onConflict: "transaction_number" })
    .select();

  if (error) {
    console.error("Error saving DLD transactions:", error);
    return [];
  }

  return data || [];
}
