-- ============================================================
-- BAAM System I — Insurance Brokerage Platform
-- Migration: Insurance-specific tables
-- Run in the BAAM-Insurance Supabase project (separate from medical)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- MIGRATION 1 — agents: per-site agent profiles
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.agents (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id          TEXT        NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  slug             TEXT        NOT NULL,
  title            TEXT,
  photo_url        TEXT,
  bio              TEXT,
  specialties      TEXT[]      DEFAULT '{}',
  languages        TEXT[]      DEFAULT '{"English"}',
  license_number   TEXT,
  years_experience INTEGER     DEFAULT 0,
  phone            TEXT,
  email            TEXT,
  sort_order       INTEGER     DEFAULT 0,
  is_active        BOOLEAN     DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (site_id, slug)
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active agents"  ON public.agents FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write agents"         ON public.agents FOR ALL   USING (true);

CREATE INDEX IF NOT EXISTS idx_agents_site_id  ON public.agents (site_id);
CREATE INDEX IF NOT EXISTS idx_agents_slug     ON public.agents (site_id, slug);

-- ────────────────────────────────────────────────────────────
-- MIGRATION 2 — carriers: global catalog of insurance carriers
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.carriers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  logo_url    TEXT,
  website     TEXT,
  description TEXT,
  category    TEXT        DEFAULT 'general',  -- personal | commercial | specialty | general
  is_active   BOOLEAN     DEFAULT true,
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read carriers" ON public.carriers FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write carriers" ON public.carriers FOR ALL   USING (true);

-- ────────────────────────────────────────────────────────────
-- MIGRATION 3 — site_carriers: brokerage ↔ carrier assignments
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.site_carriers (
  site_id     TEXT    NOT NULL REFERENCES public.sites(id)    ON DELETE CASCADE,
  carrier_id  UUID    NOT NULL REFERENCES public.carriers(id) ON DELETE CASCADE,
  sort_order  INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  PRIMARY KEY (site_id, carrier_id)
);

ALTER TABLE public.site_carriers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_carriers"  ON public.site_carriers FOR SELECT USING (true);
CREATE POLICY "Admin write site_carriers"  ON public.site_carriers FOR ALL   USING (true);

CREATE INDEX IF NOT EXISTS idx_site_carriers_site_id ON public.site_carriers (site_id);

-- ────────────────────────────────────────────────────────────
-- MIGRATION 4 — insurance_lines: service line toggles per site
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.insurance_lines (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id            TEXT        NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  line_slug          TEXT        NOT NULL,
  is_enabled         BOOLEAN     DEFAULT true,
  is_featured        BOOLEAN     DEFAULT false,
  custom_description TEXT,
  sort_order         INTEGER     DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (site_id, line_slug)
);

ALTER TABLE public.insurance_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read insurance_lines"  ON public.insurance_lines FOR SELECT USING (true);
CREATE POLICY "Admin write insurance_lines"  ON public.insurance_lines FOR ALL   USING (true);

CREATE INDEX IF NOT EXISTS idx_insurance_lines_site_id ON public.insurance_lines (site_id);

-- ────────────────────────────────────────────────────────────
-- MIGRATION 5 — quote_requests: lead capture from quote form
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.quote_requests (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id             TEXT        NOT NULL REFERENCES public.sites(id),
  first_name          TEXT        NOT NULL,
  last_name           TEXT        NOT NULL,
  phone               TEXT        NOT NULL,
  email               TEXT,
  coverage_types      TEXT[]      DEFAULT '{}',
  preferred_language  TEXT        DEFAULT 'English',
  best_contact_time   TEXT,
  message             TEXT,
  details             JSONB       DEFAULT '{}',
  status              TEXT        DEFAULT 'new',
  assigned_agent_id   UUID        REFERENCES public.agents(id),
  notes               TEXT,
  source              TEXT        DEFAULT 'website',
  ip_address          TEXT,
  user_agent          TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT quote_status_check CHECK (
    status IN ('new', 'contacted', 'quoted', 'bound', 'closed', 'lost')
  )
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert quote_requests"  ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read quote_requests"     ON public.quote_requests FOR SELECT USING (true);
CREATE POLICY "Admin update quote_requests"   ON public.quote_requests FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_quote_requests_site_id ON public.quote_requests (site_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status  ON public.quote_requests (site_id, status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON public.quote_requests (created_at DESC);

-- ────────────────────────────────────────────────────────────
-- MIGRATION 6 — Seed 20 carriers into global catalog
-- ────────────────────────────────────────────────────────────

INSERT INTO public.carriers (name, slug, category, description, sort_order) VALUES
  ('Travelers',        'travelers',        'general',    'One of the largest US property casualty insurers',               1),
  ('Progressive',      'progressive',      'personal',   'Leading personal auto and commercial auto insurer',               2),
  ('Nationwide',       'nationwide',       'general',    'Comprehensive coverage for personal and business needs',          3),
  ('Liberty Mutual',   'liberty-mutual',   'general',    'Full range of personal and commercial insurance',                 4),
  ('The Hartford',     'the-hartford',     'commercial', 'Specialist in commercial insurance and workers comp',             5),
  ('Chubb',            'chubb',            'specialty',  'Premium personal and commercial insurance solutions',             6),
  ('Zurich',           'zurich',           'commercial', 'Global commercial and specialty lines insurance',                 7),
  ('Hanover Insurance','hanover',          'general',    'Personal and commercial insurance solutions',                     8),
  ('Employers',        'employers',        'commercial', 'Specialty workers compensation for small businesses',             9),
  ('AmTrust',          'amtrust',          'commercial', 'Workers comp and commercial insurance specialist',               10),
  ('Hiscox',           'hiscox',           'specialty',  'Small business and professional liability specialist',           11),
  ('Markel',           'markel',           'specialty',  'Specialty insurance for unique risks',                           12),
  ('Foremost',         'foremost',         'specialty',  'Specialty coverage for motorcycles, boats, and more',           13),
  ('National General', 'national-general', 'personal',   'Personal auto and homeowner coverage',                          14),
  ('Mercury Insurance','mercury',          'personal',   'Competitive personal auto insurance',                            15),
  ('Bristol West',     'bristol-west',     'personal',   'Non-standard auto insurance solutions',                         16),
  ('Dairyland',        'dairyland',        'specialty',  'Motorcycle and non-standard auto insurance',                    17),
  ('GEICO',            'geico',            'personal',   'Government Employees Insurance Company',                        18),
  ('State Auto',       'state-auto',       'general',    'Personal and commercial property insurance',                    19),
  ('Berkley One',      'berkley-one',      'specialty',  'High net worth personal lines insurance',                       20)
ON CONFLICT (slug) DO NOTHING;
