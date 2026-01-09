import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          title: string;
          developer_id: string | null;
          country: string;
          city: string;
          area: string;
          price_aed: number;
          bedrooms: number;
          bathrooms: number;
          size_sqft: number;
          completion_date: string | null;
          payment_plan_json: Record<string, unknown> | null;
          images_urls: string[];
          metadata_json: Record<string, unknown> | null;
          property_type: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["properties"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["properties"]["Insert"]>;
      };
      developers: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website: string | null;
          country_origin: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["developers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["developers"]["Insert"]>;
      };
      contacts: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_whatsapp: string | null;
          source: string;
          lead_score: number;
          ai_summary: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contacts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["contacts"]["Insert"]>;
      };
      deals: {
        Row: {
          id: string;
          contact_id: string;
          property_id: string | null;
          stage_id: string;
          value_aed: number;
          probability: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["deals"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["deals"]["Insert"]>;
      };
      funnel_stages: {
        Row: {
          id: string;
          name: string;
          order_index: number;
          color_code: string;
        };
        Insert: Omit<Database["public"]["Tables"]["funnel_stages"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["funnel_stages"]["Insert"]>;
      };
      communications: {
        Row: {
          id: string;
          contact_id: string;
          type: "whatsapp" | "email";
          content: string;
          direction: "in" | "out";
          status: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["communications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["communications"]["Insert"]>;
      };
      automations: {
        Row: {
          id: string;
          name: string;
          trigger_type: string;
          conditions_json: Record<string, unknown>;
          actions_json: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["automations"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["automations"]["Insert"]>;
      };
      invoices_quotes: {
        Row: {
          id: string;
          deal_id: string;
          type: "invoice" | "quote";
          total_aed: number;
          branding_json: Record<string, unknown> | null;
          status: string;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["invoices_quotes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["invoices_quotes"]["Insert"]>;
      };
    };
  };
};
