-- ============================================================
-- QFLOW — application tables, RLS, indexes, triggers (Day 6)
-- Run in the Supabase SQL editor, AFTER schema.sql (which creates
-- public.profiles — every table below references it).
--
-- This script is idempotent: re-running it will not error. Tables use
-- CREATE ... IF NOT EXISTS; policies/triggers/indexes are dropped first.
-- ============================================================

-- ---------------------------- PROPOSALS ----------------------------
CREATE TABLE IF NOT EXISTS proposals (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_name         text NOT NULL,
  client_email        text,
  project_type        text,
  project_description text,
  budget_range        text,
  timeline            text,
  deliverables        text,
  generated_content   jsonb,
  status              text DEFAULT 'draft' CHECK (status IN ('draft','sent','viewed','accepted','declined')),
  amount              decimal(10,2),
  view_count          integer DEFAULT 0,
  last_viewed_at      timestamp,
  share_token         text UNIQUE DEFAULT encode(gen_random_bytes(16),'hex'),
  created_at          timestamp DEFAULT now(),
  updated_at          timestamp DEFAULT now()
);

-- --------------------------- SCOPE ALERTS --------------------------
CREATE TABLE IF NOT EXISTS scope_alerts (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES profiles(id) ON DELETE CASCADE,
  proposal_id      uuid REFERENCES proposals(id),
  client_message   text NOT NULL,
  original_scope   text,
  is_out_of_scope  boolean DEFAULT false,   -- (spec typo "s_out_of_scope" corrected)
  confidence       integer DEFAULT 0,
  category         text,
  flagged_phrases  text[],
  explanation      text,
  extra_hours      decimal(6,2),
  extra_cost       decimal(10,2),
  response_firm    text,
  response_gentle  text,
  resolved         boolean DEFAULT false,
  created_at       timestamp DEFAULT now()
);

-- ---------------------------- CONTRACTS ----------------------------
CREATE TABLE IF NOT EXISTS contracts (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             uuid REFERENCES profiles(id) ON DELETE CASCADE,
  proposal_id         uuid REFERENCES proposals(id),
  title               text,
  parties             jsonb,
  content             jsonb,
  status              text DEFAULT 'draft' CHECK (status IN ('draft','sent','signed','expired')),
  opensign_request_id text,
  signed_pdf_url      text,
  signed_at           timestamp,
  client_name         text,
  client_email        text,
  created_at          timestamp DEFAULT now()
);

-- ----------------------------- INVOICES ----------------------------
CREATE TABLE IF NOT EXISTS invoices (
  id                       uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                  uuid REFERENCES profiles(id) ON DELETE CASCADE,
  proposal_id              uuid REFERENCES proposals(id),
  client_name              text NOT NULL,
  client_email             text NOT NULL,
  invoice_number           text UNIQUE,
  line_items               jsonb DEFAULT '[]',
  subtotal                 decimal(10,2) DEFAULT 0,
  tax_rate                 decimal(5,2) DEFAULT 0,
  tax_amount               decimal(10,2) DEFAULT 0,
  discount                 decimal(10,2) DEFAULT 0,
  total                    decimal(10,2) NOT NULL DEFAULT 0,
  currency                 text DEFAULT 'USD',
  status                   text DEFAULT 'draft' CHECK (status IN ('draft','sent','viewed','paid','overdue')),
  due_date                 date,
  paid_at                  timestamp,
  stripe_payment_link      text,
  stripe_payment_intent_id text,
  notes                    text,
  reminder_count           integer DEFAULT 0,
  created_at               timestamp DEFAULT now()
);

-- ----------------------------- CLIENTS -----------------------------
CREATE TABLE IF NOT EXISTS clients (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name           text NOT NULL,
  email          text,
  company        text,
  phone          text,
  website        text,
  industry       text,
  notes          text,
  tags           text[],
  total_revenue  decimal(10,2) DEFAULT 0,
  project_count  integer DEFAULT 0,
  status         text DEFAULT 'active',
  source         text,
  created_at     timestamp DEFAULT now()
);

-- -------------------------- PORTAL TOKENS --------------------------
CREATE TABLE IF NOT EXISTS portal_tokens (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES profiles(id) ON DELETE CASCADE,
  proposal_id  uuid REFERENCES proposals(id),
  token        text UNIQUE DEFAULT encode(gen_random_bytes(16),'hex'),
  revoked      boolean DEFAULT false,
  created_at   timestamp DEFAULT now()
);

-- ---------------------------- ACTIVITIES ---------------------------
CREATE TABLE IF NOT EXISTS activities (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type         text NOT NULL,
  description  text,
  metadata     jsonb,
  created_at   timestamp DEFAULT now()
);

-- ---------------------------- TEMPLATES ----------------------------
CREATE TABLE IF NOT EXISTS templates (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  project_type  text,
  content       jsonb,
  is_public     boolean DEFAULT false,
  use_count     integer DEFAULT 0,
  created_at    timestamp DEFAULT now()
);

-- ----------------------------- FEEDBACK ----------------------------
CREATE TABLE IF NOT EXISTS feedback (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES profiles(id),
  rating      integer CHECK (rating BETWEEN 1 AND 5),
  message     text,
  page        text,
  created_at  timestamp DEFAULT now()
);

-- ------------------------- RLS ON ALL TABLES -----------------------
ALTER TABLE proposals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_alerts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices      ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities    ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback      ENABLE ROW LEVEL SECURITY;

-- ----------- RLS POLICIES (users see only their own data) ----------
-- FOR ALL with only USING: Postgres reuses the USING expression as the
-- INSERT/UPDATE WITH CHECK, so writes are constrained to user_id = auth.uid().
DROP POLICY IF EXISTS "proposals_own"  ON proposals;
CREATE POLICY "proposals_own"  ON proposals     FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "scope_own"      ON scope_alerts;
CREATE POLICY "scope_own"      ON scope_alerts  FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "contracts_own"  ON contracts;
CREATE POLICY "contracts_own"  ON contracts     FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "invoices_own"   ON invoices;
CREATE POLICY "invoices_own"   ON invoices      FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "clients_own"    ON clients;
CREATE POLICY "clients_own"    ON clients       FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "portal_own"     ON portal_tokens;
CREATE POLICY "portal_own"     ON portal_tokens FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "activities_own" ON activities;
CREATE POLICY "activities_own" ON activities    FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "templates_own"  ON templates;
CREATE POLICY "templates_own"  ON templates     FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "feedback_own"   ON feedback;
CREATE POLICY "feedback_own"   ON feedback      FOR ALL USING (auth.uid() = user_id);

-- PORTAL TOKENS: public read by token (for the client portal)
DROP POLICY IF EXISTS "portal_public_read" ON portal_tokens;
CREATE POLICY "portal_public_read" ON portal_tokens FOR SELECT USING (NOT revoked);

-- ------------------------ PERFORMANCE INDEXES ----------------------
CREATE INDEX IF NOT EXISTS idx_proposals_user_created  ON proposals(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_user_status    ON invoices(user_id, status);
CREATE INDEX IF NOT EXISTS idx_clients_user            ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_created ON activities(user_id, created_at DESC);

-- -------------------- AUTO-UPDATE updated_at -----------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS proposals_updated_at ON proposals;
CREATE TRIGGER proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -------------------- AUTO-INCREMENT invoice # ---------------------
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$ BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number = 'QFLOW-' || LPAD(nextval('invoice_number_seq')::text, 3, '0');
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_invoice_number ON invoices;
CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();
