-- Ren.Ai Database Schema
-- AI-Powered Real Estate CRM

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- MODULE: Properties & Feeds
-- =====================================================

-- Developers table
CREATE TABLE developers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website VARCHAR(255),
  country_origin VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE developers IS 'Real estate developers (Emaar, Damac, Sobha, etc.)';

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  developer_id UUID REFERENCES developers(id) ON DELETE SET NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  area VARCHAR(255) NOT NULL,
  price_aed DECIMAL(15, 2) NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  size_sqft DECIMAL(10, 2) NOT NULL,
  completion_date VARCHAR(50),
  payment_plan_json JSONB,
  images_urls TEXT[] DEFAULT '{}',
  metadata_json JSONB,
  property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartment', 'villa', 'townhouse', 'penthouse', 'duplex', 'land')),
  status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'off-plan', 'ready')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE properties IS 'Property listings across UAE and international markets';
COMMENT ON COLUMN properties.price_aed IS 'Price in AED (primary currency)';
COMMENT ON COLUMN properties.payment_plan_json IS 'JSON structure: {downPayment, duringConstruction, onHandover, postHandover, installments}';
COMMENT ON COLUMN properties.metadata_json IS 'JSON structure: {amenities[], description, roi, serviceCharge, parkingSpaces, floorNumber, totalFloors}';

-- DLD Transactions (Dubai Land Department)
CREATE TABLE dld_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  transaction_number VARCHAR(100) UNIQUE NOT NULL,
  transaction_date DATE NOT NULL,
  amount_aed DECIMAL(15, 2) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('sale', 'lease', 'mortgage')),
  area_name VARCHAR(255),
  property_type VARCHAR(100),
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE dld_transactions IS 'Real-time DLD transaction data synced from Dubai Pulse API';

-- =====================================================
-- MODULE: CRM & Funnels
-- =====================================================

-- Contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_whatsapp VARCHAR(50),
  source VARCHAR(50) NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'referral', 'whatsapp', 'social', 'exhibition', 'other')),
  lead_score INTEGER NOT NULL DEFAULT 50 CHECK (lead_score >= 0 AND lead_score <= 100),
  ai_summary TEXT,
  avatar_url TEXT,
  tags TEXT[] DEFAULT '{}',
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE contacts IS 'CRM contacts and leads';
COMMENT ON COLUMN contacts.lead_score IS 'AI-calculated score from 0-100 based on engagement';
COMMENT ON COLUMN contacts.ai_summary IS 'AI-generated summary of contact preferences and behavior';

-- Funnel Stages
CREATE TABLE funnel_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  order_index INTEGER NOT NULL,
  color_code VARCHAR(7) NOT NULL DEFAULT '#8b5cf6'
);

COMMENT ON TABLE funnel_stages IS 'Sales pipeline stages';

-- Insert default funnel stages
INSERT INTO funnel_stages (name, order_index, color_code) VALUES
  ('New Lead', 0, '#8b5cf6'),
  ('Contacted', 1, '#06b6d4'),
  ('Viewing', 2, '#f59e0b'),
  ('Offer', 3, '#3b82f6'),
  ('SPA Signed', 4, '#10b981'),
  ('Closed Won', 5, '#22c55e'),
  ('Closed Lost', 6, '#ef4444');

-- Deals table
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  stage_id UUID NOT NULL REFERENCES funnel_stages(id) ON DELETE RESTRICT,
  value_aed DECIMAL(15, 2) NOT NULL DEFAULT 0,
  probability INTEGER NOT NULL DEFAULT 20 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE deals IS 'Sales deals linked to contacts and properties';

-- =====================================================
-- MODULE: Automations & Communication
-- =====================================================

-- Automations
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('price_drop', 'lead_inactive', 'new_project', 'stage_change', 'new_lead')),
  conditions_json JSONB NOT NULL DEFAULT '[]',
  actions_json JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  run_count INTEGER NOT NULL DEFAULT 0,
  last_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE automations IS 'AI-powered workflow automations';
COMMENT ON COLUMN automations.conditions_json IS 'Array of {field, operator, value} conditions';
COMMENT ON COLUMN automations.actions_json IS 'Array of {type, config} actions';

-- Communications
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('whatsapp', 'email', 'call', 'sms')),
  content TEXT NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('in', 'out')),
  status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed', 'pending')),
  metadata_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE communications IS 'All communication logs (WhatsApp, Email, etc.)';

-- Email Templates
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  category VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MODULE: Financials
-- =====================================================

-- Invoices & Quotes
CREATE TABLE invoices_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('invoice', 'quote')),
  number VARCHAR(50) NOT NULL UNIQUE,
  client_name VARCHAR(255) NOT NULL,
  total_aed DECIMAL(15, 2) NOT NULL,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  branding_json JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE invoices_quotes IS 'Financial documents - invoices and quotes';
COMMENT ON COLUMN invoices_quotes.branding_json IS '{logo_url, primary_color, company_name, company_address}';

-- =====================================================
-- MODULE: Users & RBAC
-- =====================================================

-- User Roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO user_roles (name, permissions) VALUES
  ('admin', '{"all": true}'),
  ('manager', '{"properties": true, "contacts": true, "deals": true, "reports": true, "team": true}'),
  ('agent', '{"properties": true, "contacts": true, "deals": true}'),
  ('viewer', '{"properties": "read", "contacts": "read"}');

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role_id UUID REFERENCES user_roles(id) ON DELETE SET NULL,
  phone VARCHAR(50),
  commission_rate DECIMAL(5, 2) DEFAULT 2.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MODULE: Documentation
-- =====================================================

-- Features documentation
CREATE TABLE documentation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL,
  feature_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'beta', 'coming_soon', 'deprecated')),
  icon_name VARCHAR(50),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert documentation entries
INSERT INTO documentation (category, feature_name, description, status, icon_name, order_index) VALUES
  ('Data Feed', 'DLD Real-time Sync', 'Automatic tracking of every sale and rental registration in Dubai via official govt APIs.', 'active', 'Database', 1),
  ('Data Feed', 'Multi-Nation Off-plan', 'Access to project details in UAE, Indonesia, Thailand, Turkey, and Cyprus.', 'active', 'Globe', 2),
  ('AI CRM', 'Smart Lead Scoring', 'AI analyzes lead behavior to predict closing probability.', 'active', 'TrendingUp', 3),
  ('AI CRM', 'WhatsApp Mirroring', 'Sync your own WhatsApp to log conversations and automate replies inside the profile.', 'active', 'MessageSquare', 4),
  ('Sales Funnels', 'AI Deal Automations', 'Trigger custom actions (Emails/Tasks) based on deal stage changes or price drops.', 'active', 'Zap', 5),
  ('Sales Funnels', 'HTML Email Architect', 'Professional drag-and-drop or AI-prompted email builder with tracking.', 'beta', 'Mail', 6),
  ('Marketing', 'Prompt-to-PDF', 'Type a prompt to generate a branded, localized property brochure in seconds.', 'active', 'FileText', 7),
  ('Marketing', 'Branding Controller', 'Admin-level control to skin the platform and all exports with company assets.', 'active', 'Palette', 8),
  ('Financials', 'Automated Invoicing', 'Auto-generate commission invoices in AED upon deal completion.', 'active', 'Receipt', 9),
  ('Financials', 'Quotation Engine', 'Dynamic quote builder for international properties including local taxes.', 'active', 'Calculator', 10);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_properties_country ON properties(country);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price_aed);
CREATE INDEX idx_properties_developer ON properties(developer_id);

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_lead_score ON contacts(lead_score);
CREATE INDEX idx_contacts_source ON contacts(source);

CREATE INDEX idx_deals_contact ON deals(contact_id);
CREATE INDEX idx_deals_property ON deals(property_id);
CREATE INDEX idx_deals_stage ON deals(stage_id);

CREATE INDEX idx_communications_contact ON communications(contact_id);
CREATE INDEX idx_communications_type ON communications(type);
CREATE INDEX idx_communications_created ON communications(created_at);

CREATE INDEX idx_dld_transactions_date ON dld_transactions(transaction_date);
CREATE INDEX idx_dld_transactions_property ON dld_transactions(property_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices_quotes ENABLE ROW LEVEL SECURITY;

-- Basic policies (to be customized based on user roles)
CREATE POLICY "Enable read access for authenticated users" ON properties
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON deals
  FOR SELECT TO authenticated USING (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Lead score calculation function (placeholder for AI integration)
CREATE OR REPLACE FUNCTION calculate_lead_score(contact_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 50;
  interaction_count INTEGER;
  days_since_last_activity INTEGER;
BEGIN
  -- Count communications
  SELECT COUNT(*) INTO interaction_count
  FROM communications
  WHERE contact_id = contact_uuid;
  
  -- Add points for interactions (max 30)
  score := score + LEAST(interaction_count * 5, 30);
  
  -- Get days since last activity
  SELECT EXTRACT(DAY FROM NOW() - MAX(created_at))::INTEGER INTO days_since_last_activity
  FROM communications
  WHERE contact_id = contact_uuid;
  
  -- Subtract points for inactivity
  IF days_since_last_activity IS NOT NULL THEN
    score := score - LEAST(days_since_last_activity * 2, 20);
  END IF;
  
  -- Ensure score is between 0 and 100
  RETURN GREATEST(0, LEAST(100, score));
END;
$$ LANGUAGE plpgsql;
