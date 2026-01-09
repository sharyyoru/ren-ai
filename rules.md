# Ren.Ai Project Rules & Architecture

## 1. Project Overview
Ren.Ai is an AI-powered real estate CRM.
- **Core Goal**: Provide a unified dashboard for UAE and international off-plan properties with deep AI automations.
- **Tech Stack**: Next.js (Frontend), Supabase (Database/Auth/Edge Functions), Tailwind CSS (UI).
- **Primary Currency**: AED (All monetary values MUST be stored and displayed in AED).

## 2. Database Schema (Supabase)
Follow this modular schema design. Use UUIDs for all IDs.

### Module: Properties & Feeds
- `properties`: (id, title, developer_id, country, city, area, price_aed, completion_date, payment_plan_json, images_urls[], metadata_json).
- `developers`: (id, name, logo_url, website, country_origin).
- `dld_transactions`: (id, property_id, transaction_number, date, amount_aed, type [sale/lease]).

### Module: CRM & Funnels
- `contacts`: (id, full_name, email, phone_whatsapp, source, lead_score, ai_summary).
- `deals`: (id, contact_id, property_id, stage_id, value_aed, probability).
- `funnel_stages`: (id, name, order_index, color_code).

### Module: Automations & Communication
- `automations`: (id, name, trigger_type, conditions_json, actions_json, is_active).
- `communications`: (id, contact_id, type [whatsapp, email], content, direction [in/out], status).

### Module: Financials
- `invoices_quotes`: (id, deal_id, type [invoice/quote], total_aed, branding_json, status, pdf_url).

## 3. API Integration Strategy (Step 2)
Windsurf must prioritize these data sources:
1. **UAE Official**: Connect to [Dubai Pulse API](https://www.dubaipulse.gov.ae/) for DLD Transaction Open Data.
2. **Global Off-Plan**: Use the **Reelly API** (reelly.ai/api) for structured project data across UAE and International (Thailand, Indonesia, etc.).
3. **Currency Conversion**: Use an Exchange Rate API to normalize all non-AED property prices to AED before saving to the DB.

## 4. Feature Implementation Rules
- **Modular Access**: Every feature must check `user_roles` and `permissions` tables before rendering or executing.
- **AI PDF Generation**: Use Supabase Edge Functions + Puppeteer to generate PDFs. AI prompts should influence the `content_selection` logic.
- **WhatsApp Integration**: Use a bridge for `whatsapp-web.js`. All incoming/outgoing messages must be UPSERTed into the `communications` table.
- **Email**: Use **Resend** or **SendGrid** API. Store HTML templates in the `email_templates` table.

## 5. Development Workflow
1. **Step 1 (Database)**: Build the Supabase schema and Auth.
2. **Step 2 (Feed)**: Create the ingestion cron jobs (Edge Functions) to fetch and sync DLD/Reelly data.
3. **Step 3 (UI/UX)**: Build the property grid and lead management dashboard.
4. **Step 4 (AI Content)**: Integrate LLM for PDF generation and funnel automation logic.

## 6. UI/UX Standards
- Theme: Professional, High-contrast, Real-estate focused.
- All lists must be searchable and filterable.
- Provide a dedicated `/docs` route that auto-generates documentation based on the SQL schema comments.

## 7. Markets Supported
- **UAE** (Primary)
- **Turkey**
- **Thailand**
- **Indonesia**
- **Cyprus**

## 8. Key Features
| Category | Function Name | Description |
|----------|--------------|-------------|
| Data Feed | DLD Real-time Sync | Automatic tracking of every sale and rental registration in Dubai via official govt APIs. |
| Data Feed | Multi-Nation Off-plan | Access to project details in UAE, Indonesia, Thailand, Turkey, and Cyprus. |
| AI CRM | Smart Lead Scoring | AI analyzes lead behavior to predict closing probability. |
| AI CRM | WhatsApp Mirroring | Sync your own WhatsApp to log conversations and automate replies inside the profile. |
| Sales Funnels | AI Deal Automations | Trigger custom actions (Emails/Tasks) based on deal stage changes or price drops. |
| Sales Funnels | HTML Email Architect | Professional drag-and-drop or AI-prompted email builder with tracking. |
| Marketing | Prompt-to-PDF | Type a prompt to generate a branded, localized property brochure in seconds. |
| Marketing | Branding Controller | Admin-level control to skin the platform and all exports with company assets. |
| Financials | Automated Invoicing | Auto-generate commission invoices in AED upon deal completion. |
| Financials | Quotation Engine | Dynamic quote builder for international properties including local taxes. |
