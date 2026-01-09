export interface Property {
  id: string;
  title: string;
  developer_id: string | null;
  developer?: Developer;
  country: string;
  city: string;
  area: string;
  price_aed: number;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  completion_date: string | null;
  payment_plan_json: PaymentPlan | null;
  images_urls: string[];
  metadata_json: PropertyMetadata | null;
  property_type: PropertyType;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface PaymentPlan {
  downPayment: number;
  duringConstruction: number;
  onHandover: number;
  postHandover?: number;
  installments?: number;
}

export interface PropertyMetadata {
  amenities?: string[];
  description?: string;
  roi?: number;
  serviceCharge?: number;
  parkingSpaces?: number;
  floorNumber?: number;
  totalFloors?: number;
}

export type PropertyType = "apartment" | "villa" | "townhouse" | "penthouse" | "duplex" | "land";
export type PropertyStatus = "available" | "sold" | "reserved" | "off-plan" | "ready";

export interface Developer {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  country_origin: string;
  created_at: string;
}

export interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone_whatsapp: string | null;
  source: ContactSource;
  lead_score: number;
  ai_summary: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ContactSource = "website" | "referral" | "whatsapp" | "social" | "exhibition" | "other";

export interface Deal {
  id: string;
  contact_id: string;
  contact?: Contact;
  property_id: string | null;
  property?: Property;
  stage_id: string;
  stage?: FunnelStage;
  value_aed: number;
  probability: number;
  created_at: string;
  updated_at: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  order_index: number;
  color_code: string;
}

export interface Communication {
  id: string;
  contact_id: string;
  contact?: Contact;
  type: "whatsapp" | "email";
  content: string;
  direction: "in" | "out";
  status: string;
  created_at: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger_type: AutomationTrigger;
  conditions_json: AutomationCondition[];
  actions_json: AutomationAction[];
  is_active: boolean;
  created_at: string;
}

export type AutomationTrigger = 
  | "price_drop"
  | "lead_inactive"
  | "new_project"
  | "stage_change"
  | "new_lead";

export interface AutomationCondition {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: string | number;
}

export interface AutomationAction {
  type: "send_whatsapp" | "send_email" | "create_task" | "update_stage" | "notify";
  config: Record<string, unknown>;
}

export interface Invoice {
  id: string;
  deal_id: string;
  deal?: Deal;
  type: "invoice" | "quote";
  total_aed: number;
  branding_json: BrandingConfig | null;
  status: InvoiceStatus;
  pdf_url: string | null;
  created_at: string;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface BrandingConfig {
  logo_url?: string;
  primary_color?: string;
  company_name?: string;
  company_address?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
}

export type UserRole = "admin" | "agent" | "manager" | "viewer";

export interface DashboardStats {
  totalProperties: number;
  totalContacts: number;
  activeDeals: number;
  totalRevenue: number;
  conversionRate: number;
  avgDealValue: number;
}
