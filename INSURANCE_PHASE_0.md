# BAAM System I — Insurance Brokerage Platform
# Phase 0: Fork Medical + Infrastructure + Theme + DB + Content Contracts

> **System:** BAAM System I — Insurance Brokerage Platform
> **Reference files:** `@INSURANCE_COMPLETE_PLAN.md`
> **Baseline codebase:** `medical-clinic/chinese-medicine` — fork this workspace
> **Prerequisite:** Stage A all 6 artifacts complete, all 7 A-Gates passed ✅
> **Method:** One Cursor prompt per session. Verify done-gate before next prompt.
> **Rule:** Never skip a done-gate. Never run the next prompt until the current one is clean.

---

## Phase 0 Overview

**Duration:** Day 1–3
**Goal:** Fork `chinese-medicine` into a clean insurance brokerage codebase. Strip all medical/TCM-specific code. Keep all reusable admin, CMS, media, theme, and middleware systems. Add insurance-specific DB tables, apply the navy+gold theme, define all content contracts for every page and section, and seed the Peerless Brokerage demo site — so Phase 1 can build insurance pages immediately without any setup work.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|--------|-------|-----------|
| 0A | Fork Medical → Insurance Platform | New codebase, strip TCM content, setup `peerless-brokerage` site | 60 min |
| 0B | Theme Setup — Navy + Gold | `theme.json`, Tailwind extension, Playfair Display + Inter fonts, global settings JSON | 45 min |
| 0C | DB Schema — Insurance Tables | 5 new tables: agents, carriers, site_carriers, insurance_lines, quote_requests | 45 min |
| 0D | Content Contracts — All Sections | TypeScript interfaces + JSON schemas + variant registry for every section type | 90 min |
| 0E | Seed Content — Peerless Brokerage Demo | Site config, 15 insurance line definitions, 8 agents, 20 carriers, 25 testimonials, 8 blog posts, all page JSON | 90 min |

---

## Prompt 0A — Fork Medical → Insurance Brokerage Codebase

**Goal:** Establish the insurance brokerage codebase from `medical-clinic/chinese-medicine`. Remove all medical/TCM-specific content and components. Keep every reusable platform component intact: admin CMS, content loading system, media system, theme system, domain middleware, auth/RBAC, blog system, testimonials.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md

START FROM: The medical-clinic/chinese-medicine codebase.
This is a FORK — NOT a rebuild from scratch.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Remove medical/TCM-specific code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Delete these directories and files (content + components specific to medical):

Content directories:
- content/ (all existing site demo JSON — we'll create insurance content in 0E)
- public/uploads/ (all demo images)

Medical-specific page components:
- app/[locale]/(site)/booking/         (appointment booking — not needed)
- app/[locale]/(site)/doctors/         (doctors profiles — replaced by agents/)
- app/[locale]/(site)/treatments/      (treatments — replaced by insurance/[slug]/)
- app/[locale]/(site)/tcm/             (TCM-specific pages)
- components/booking/                  (booking widgets)
- components/tcm/                      (TCM-specific components)

Keep ALL of these intact (do NOT delete):
- app/admin/                           (full admin CMS — reuse unchanged)
- app/api/admin/                       (all admin API routes)
- app/api/auth/                        (auth system)
- app/api/content/                     (content loading API)
- app/api/media/                       (media system)
- app/api/sites/                       (site management)
- lib/content.ts                       (content loading system)
- lib/contentDb.ts                     (DB content access)
- lib/supabase/                        (Supabase client)
- lib/auth/                            (auth utilities)
- lib/media/                           (media utilities)
- lib/theme/                           (theme system)
- middleware.ts                        (domain routing — CRITICAL)
- components/admin/                    (admin UI components)
- components/ui/                       (shared UI: Button, Card, Input, etc.)
- components/layout/                   (Header, Footer shells — keep, we'll update content)
- components/blog/                     (blog components — reuse)
- components/testimonials/             (testimonial components — reuse)
- components/sections/hero/            (hero variants — reuse)
- components/sections/stats/           (stats strip — reuse)
- components/sections/cta/             (CTA banner — reuse)
- components/sections/faq/             (FAQ accordion — reuse)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Create demo site: peerless-brokerage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace content/_sites.json with:

{
  "peerless-brokerage": {
    "id": "peerless-brokerage",
    "name": "Peerless Brokerage Inc",
    "domain": "pbiny.local",
    "locale": "en",
    "defaultLocale": "en",
    "enabled": true,
    "type": "insurance-brokerage",
    "phone": "+1-718-555-0100",
    "address": "123 Main Street, Brooklyn, NY 11201",
    "licenseNumber": "LA-1234567",
    "licensedStates": ["NY", "NJ", "CT", "PA"],
    "yearsInBusiness": 25,
    "carriersCount": 30,
    "clientsCount": 5000,
    "features": {
      "quote_form": true,
      "agents_page": true,
      "carriers_page": true,
      "tlc_specialty": true,
      "multilingual_staff": true,
      "claims_assistance": true,
      "dmv_services": true,
      "notary_services": true,
      "blog": true,
      "testimonials": true,
      "programmatic_seo": false
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Create insurance directory structure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create these content directories (populated in 0E):

content/peerless-brokerage/
├── pages/
│   ├── insurance/          (15 service page JSON files)
│   ├── services/           (dmv.json, notary.json, claims.json)
│   └── resources/          (blog hub JSON)
├── blog/                   (8 article JSON files)
├── settings/
│   ├── site.json
│   ├── header.json
│   ├── footer.json
│   ├── seo.json
│   └── navigation.json
└── global/
    ├── carriers.json       (carrier list)
    └── insurance-lines.json (service line config)

Create image directories:
public/uploads/peerless-brokerage/
├── hero/
├── agents/
├── carriers/
├── blog/
└── office/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Create new Supabase project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL: Create a NEW Supabase project named "BAAM-Insurance".
Never reuse the medical-clinic Supabase project. Completely separate DB.

Create .env.local with these placeholders (fill in after Supabase project created):

NEXT_PUBLIC_APP_URL=http://localhost:3007
NEXT_PUBLIC_DEFAULT_SITE=peerless-brokerage
NODE_ENV=development

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_PROJECT_ID=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_STORAGE_BUCKET=media

JWT_SECRET=change-me-insurance-platform

RESEND_API_KEY=
RESEND_FROM=noreply@yourdomain.com
CONTACT_FALLBACK_TO=admin@yourdomain.com
QUOTE_NOTIFICATION_EMAIL=quotes@yourdomain.com

ANTHROPIC_API_KEY=
OPENAI_API_KEY=

UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=

INTERNAL_API_SECRET=insurance-internal-2024

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Update package.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update these fields in package.json:
- "name": "baam-insurance-platform"
- "description": "BAAM System I — Insurance Brokerage Platform Template"
- "scripts.dev": "next dev -p 3007"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — Create insurance-specific app routes (empty shells)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create these empty page files (just `export default function Page() { return null }`)
so Next.js routing is established before Phase 1 builds them out:

app/[locale]/(site)/insurance/page.tsx           (insurance hub)
app/[locale]/(site)/insurance/[slug]/page.tsx    (service page template)
app/[locale]/(site)/quote/page.tsx               (quote form)
app/[locale]/(site)/agents/page.tsx              (agents listing)
app/[locale]/(site)/carriers/page.tsx            (carrier partners)
app/[locale]/(site)/claims/page.tsx              (claims help)
app/[locale]/(site)/services/[slug]/page.tsx     (dmv, notary)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — Add /etc/hosts entry for local dev
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add to /etc/hosts:
127.0.0.1  pbiny.local
```

**Done-Gate 0A:**
- [ ] `npm run dev` starts on port 3007 with no errors
- [ ] `http://localhost:3007` loads (may show 404 — content not seeded yet, that's OK)
- [ ] No `booking/`, `doctors/`, `tcm/` directories remain in app/
- [ ] No `components/booking/` or `components/tcm/` remain
- [ ] `content/peerless-brokerage/` directory structure exists
- [ ] `_sites.json` contains only `peerless-brokerage`
- [ ] Admin at `/admin` loads and login page renders
- [ ] Git commit: `feat: phase-0A — fork medical into insurance platform`

---

## Prompt 0B — Theme Setup: Navy + Gold

**Goal:** Apply the insurance platform visual identity. Configure Deep Navy + Warm Gold color palette with Playfair Display + Inter typography. Create all global settings JSON files that define the site's navigation, branding, and compliance footer.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md — Section A5: Visual Design Direction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1 — Create theme.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create content/peerless-brokerage/settings/theme.json:

{
  "colors": {
    "primary": "#0B1F3A",
    "primaryDark": "#071529",
    "primaryLight": "#1A3352",
    "accent": "#C9933A",
    "accentDark": "#A87830",
    "accentLight": "#DFB060",
    "success": "#1A7A4A",
    "danger": "#C74B4B",
    "warning": "#E8A020",
    "bg": "#F7F8FA",
    "bgDark": "#0B1F3A",
    "bgCard": "#FFFFFF",
    "text": "#2C3E50",
    "textMuted": "#7A8A9A",
    "textOnDark": "#F7F8FA",
    "border": "#E2E8F0",
    "borderSubtle": "#EDF2F7"
  },
  "typography": {
    "fontHeading": "Playfair Display",
    "fontBody": "Inter",
    "fontUi": "Inter",
    "sizeDisplay": "3.5rem",
    "sizeH1": "2.5rem",
    "sizeH2": "2rem",
    "sizeH3": "1.5rem",
    "sizeBody": "1rem",
    "sizeSmall": "0.875rem",
    "sizeCaption": "0.75rem",
    "weightDisplay": "700",
    "weightHeading": "600",
    "weightBody": "400",
    "weightSemibold": "600",
    "lineHeightBody": "1.7",
    "lineHeightHeading": "1.25",
    "trackingHeading": "0.01em",
    "trackingCaps": "0.08em"
  },
  "spacing": {
    "sectionPy": "5rem",
    "sectionPySmall": "3rem",
    "containerMaxWidth": "1280px",
    "containerPx": "1.5rem",
    "cardPadding": "1.5rem",
    "navHeight": "72px",
    "gridGap": "1.5rem",
    "gridGapLarge": "2rem"
  },
  "effects": {
    "cardRadius": "12px",
    "btnRadius": "8px",
    "imageRadius": "8px",
    "inputRadius": "8px",
    "cardShadow": "0 2px 12px rgba(11,31,58,0.08)",
    "cardShadowHover": "0 8px 32px rgba(11,31,58,0.14)",
    "overlayDark": "rgba(7,21,41,0.6)",
    "overlayNavy": "rgba(11,31,58,0.5)",
    "divider": "1px solid #E2E8F0"
  },
  "motion": {
    "durationFast": "150ms",
    "durationBase": "250ms",
    "durationSlow": "500ms",
    "easing": "cubic-bezier(0.4, 0, 0.2, 1)",
    "hoverLift": "translateY(-3px)"
  },
  "googleFontsUrl": "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2 — Update tailwind.config.ts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend theme with insurance colors and fonts. Add to extend block:
- colors.insurance-navy: '#0B1F3A'
- colors.insurance-gold: '#C9933A'
- fontFamily.heading: ['Playfair Display', 'Georgia', 'serif']
- fontFamily.body: ['Inter', 'system-ui', 'sans-serif']

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 3 — Update app/layout.tsx to load fonts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Import and configure fonts via next/font/google:
- playfairDisplay: Playfair_Display — weights: 400, 600, 700; styles: normal, italic
- inter: Inter — weights: 400, 500, 600, 700

Apply as CSS variables: --font-heading, --font-body

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 4 — Create global settings JSON files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create content/peerless-brokerage/settings/site.json:
{
  "name": "Peerless Brokerage Inc",
  "tagline": "Your Trusted Independent Insurance Broker",
  "phone": "+1-718-555-0100",
  "email": "info@pbiny.com",
  "address": "123 Main Street, Brooklyn, NY 11201",
  "hours": "Mon–Fri 9am–6pm, Sat 10am–3pm",
  "licenseNumber": "LA-1234567",
  "licensedStates": ["NY", "NJ", "CT", "PA"],
  "languages": ["English", "Spanish", "Chinese"],
  "yearsInBusiness": 25,
  "carriersCount": 30,
  "clientsCount": 5000,
  "policiesCount": 10000,
  "googleReviewsRating": 4.9,
  "googleReviewsCount": 312,
  "logoUrl": "/uploads/peerless-brokerage/logo.png",
  "faviconUrl": "/favicon.ico",
  "socialLinks": {
    "facebook": "",
    "google": ""
  }
}

Create content/peerless-brokerage/settings/header.json:
{
  "logoText": "Peerless Brokerage",
  "logoUrl": "",
  "nav": [
    { "label": "Insurance", "href": "/insurance", "hasDropdown": true },
    { "label": "Get a Quote", "href": "/quote", "highlight": true },
    { "label": "About", "href": "/about" },
    { "label": "Resources", "href": "/resources" },
    { "label": "Contact", "href": "/contact" }
  ],
  "insuranceDropdown": [
    { "label": "Auto Insurance", "href": "/insurance/auto" },
    { "label": "TLC Insurance", "href": "/insurance/tlc" },
    { "label": "Commercial Auto", "href": "/insurance/commercial-auto" },
    { "label": "Homeowner Insurance", "href": "/insurance/homeowner" },
    { "label": "Business Insurance", "href": "/insurance/business" },
    { "label": "Workers Compensation", "href": "/insurance/workers-comp" },
    { "label": "Disability Insurance", "href": "/insurance/disability" },
    { "label": "Construction Insurance", "href": "/insurance/construction" },
    { "label": "Motorcycle Insurance", "href": "/insurance/motorcycle" },
    { "label": "Boat Insurance", "href": "/insurance/boat" },
    { "label": "Travel Insurance", "href": "/insurance/travel" },
    { "label": "Group Health", "href": "/insurance/group-health" },
    { "label": "View All →", "href": "/insurance", "isViewAll": true }
  ],
  "ctaButton": { "label": "Get a Free Quote", "href": "/quote" },
  "phoneDisplay": "+1 (718) 555-0100",
  "phoneHref": "tel:+17185550100",
  "stickyOnMobile": true,
  "showPhoneInHeader": true
}

Create content/peerless-brokerage/settings/footer.json:
{
  "columns": [
    {
      "heading": "Insurance",
      "links": [
        { "label": "Auto Insurance", "href": "/insurance/auto" },
        { "label": "TLC Insurance", "href": "/insurance/tlc" },
        { "label": "Commercial Auto", "href": "/insurance/commercial-auto" },
        { "label": "Homeowner Insurance", "href": "/insurance/homeowner" },
        { "label": "Business Insurance", "href": "/insurance/business" },
        { "label": "Workers Compensation", "href": "/insurance/workers-comp" },
        { "label": "View All Coverage", "href": "/insurance" }
      ]
    },
    {
      "heading": "Company",
      "links": [
        { "label": "About Us", "href": "/about" },
        { "label": "Our Agents", "href": "/agents" },
        { "label": "Carrier Partners", "href": "/carriers" },
        { "label": "Testimonials", "href": "/testimonials" },
        { "label": "Resources", "href": "/resources" }
      ]
    },
    {
      "heading": "Services",
      "links": [
        { "label": "Get a Quote", "href": "/quote" },
        { "label": "Claims Assistance", "href": "/claims" },
        { "label": "DMV Services", "href": "/services/dmv" },
        { "label": "Notary Services", "href": "/services/notary" },
        { "label": "Contact Us", "href": "/contact" }
      ]
    },
    {
      "heading": "Contact",
      "text": "123 Main Street\nBrooklyn, NY 11201",
      "phone": "+1 (718) 555-0100",
      "email": "info@pbiny.com",
      "hours": "Mon–Fri: 9am–6pm\nSat: 10am–3pm"
    }
  ],
  "legalText": "© {year} Peerless Brokerage Inc. All rights reserved.",
  "licenseText": "Licensed Insurance Broker | License #LA-1234567 | Licensed in NY, NJ, CT, PA",
  "disclaimer": "Insurance products and services subject to state availability, issue limitations, and contractual terms. Not all products available in all states.",
  "links": [
    { "label": "Privacy Policy", "href": "/privacy" },
    { "label": "Terms of Service", "href": "/terms" }
  ]
}

Create content/peerless-brokerage/settings/seo.json:
{
  "titleTemplate": "%s | Peerless Brokerage Inc",
  "defaultTitle": "Peerless Brokerage Inc — Independent Insurance Broker in Brooklyn, NY",
  "defaultDescription": "Get free insurance quotes for auto, home, business & more. Peerless Brokerage shops 30+ carriers to find your best rate. Serving Brooklyn, Queens, NYC since 1999.",
  "ogImage": "/uploads/peerless-brokerage/og-default.jpg",
  "twitterHandle": "",
  "canonicalBase": "https://pbiny.com"
}
```

**Done-Gate 0B:**
- [ ] `theme.json` created at correct path, all color tokens present
- [ ] Tailwind config extended with insurance-navy and insurance-gold
- [ ] Fonts loading: Playfair Display and Inter visible in browser dev tools
- [ ] `site.json`, `header.json`, `footer.json`, `seo.json` all created with correct content
- [ ] CSS variables `--color-primary: #0B1F3A` and `--color-accent: #C9933A` injected
- [ ] Git commit: `feat: phase-0B — navy+gold theme, fonts, global settings JSON`

---

## Prompt 0C — DB Schema: Insurance Tables

**Goal:** Run all insurance-specific SQL migrations in the new Supabase project. Create 5 new tables: `agents`, `carriers`, `site_carriers`, `insurance_lines`, and `quote_requests`. Add RLS policies. Seed the carrier master catalog.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md — Database Schema section

Run this SQL in the BAAM-Insurance Supabase project (SQL Editor).
Run in order — each block is a separate migration.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGRATION 1 — agents table
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS agents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  title       TEXT,
  photo_url   TEXT,
  bio         TEXT,
  specialties TEXT[]   DEFAULT '{}',
  languages   TEXT[]   DEFAULT '{"English"}',
  license_number TEXT,
  years_experience INTEGER DEFAULT 0,
  phone       TEXT,
  email       TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, slug)
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site admin reads agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Site admin writes agents" ON agents FOR ALL USING (true);

CREATE INDEX idx_agents_site_id ON agents(site_id);
CREATE INDEX idx_agents_slug ON agents(site_id, slug);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGRATION 2 — carriers table (global catalog)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS carriers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  logo_url    TEXT,
  website     TEXT,
  description TEXT,
  category    TEXT DEFAULT 'general',  -- personal | commercial | specialty | general
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read carriers" ON carriers FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write carriers" ON carriers FOR ALL USING (true);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGRATION 3 — site_carriers junction table
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS site_carriers (
  site_id     UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  carrier_id  UUID REFERENCES carriers(id) ON DELETE CASCADE NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  PRIMARY KEY (site_id, carrier_id)
);

ALTER TABLE site_carriers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_carriers" ON site_carriers FOR SELECT USING (true);
CREATE POLICY "Admin write site_carriers" ON site_carriers FOR ALL USING (true);

CREATE INDEX idx_site_carriers_site_id ON site_carriers(site_id);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGRATION 4 — insurance_lines table
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS insurance_lines (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id             UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  line_slug           TEXT NOT NULL,
  is_enabled          BOOLEAN DEFAULT true,
  is_featured         BOOLEAN DEFAULT false,
  custom_description  TEXT,
  sort_order          INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, line_slug)
);

ALTER TABLE insurance_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read insurance_lines" ON insurance_lines FOR SELECT USING (true);
CREATE POLICY "Admin write insurance_lines" ON insurance_lines FOR ALL USING (true);

CREATE INDEX idx_insurance_lines_site_id ON insurance_lines(site_id);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGRATION 5 — quote_requests table
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS quote_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id           UUID REFERENCES sites(id) NOT NULL,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  coverage_types    TEXT[]  DEFAULT '{}',
  preferred_language TEXT   DEFAULT 'English',
  best_contact_time  TEXT,
  message           TEXT,
  details           JSONB   DEFAULT '{}',
  status            TEXT    DEFAULT 'new',
  assigned_agent_id UUID    REFERENCES agents(id),
  notes             TEXT,
  source            TEXT    DEFAULT 'website',
  ip_address        TEXT,
  user_agent        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT status_check CHECK (status IN ('new','contacted','quoted','bound','closed','lost'))
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read quote_requests" ON quote_requests FOR SELECT USING (true);
CREATE POLICY "Public insert quote_requests" ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update quote_requests" ON quote_requests FOR UPDATE USING (true);

CREATE INDEX idx_quote_requests_site_id ON quote_requests(site_id);
CREATE INDEX idx_quote_requests_status ON quote_requests(site_id, status);
CREATE INDEX idx_quote_requests_created ON quote_requests(created_at DESC);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGRATION 6 — Seed carrier master catalog (20 carriers)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO carriers (name, slug, category, description, sort_order) VALUES
  ('Travelers', 'travelers', 'general', 'One of the largest US property casualty insurers', 1),
  ('Progressive', 'progressive', 'personal', 'Leading personal auto and commercial auto insurer', 2),
  ('Nationwide', 'nationwide', 'general', 'Comprehensive coverage for personal and business needs', 3),
  ('Liberty Mutual', 'liberty-mutual', 'general', 'Full range of personal and commercial insurance', 4),
  ('The Hartford', 'the-hartford', 'commercial', 'Specialist in commercial insurance and workers comp', 5),
  ('Chubb', 'chubb', 'specialty', 'Premium personal and commercial insurance solutions', 6),
  ('Zurich', 'zurich', 'commercial', 'Global commercial and specialty lines insurance', 7),
  ('Hanover Insurance', 'hanover', 'general', 'Personal and commercial insurance solutions', 8),
  ('Employers', 'employers', 'commercial', 'Specialty workers compensation for small businesses', 9),
  ('AmTrust', 'amtrust', 'commercial', 'Workers comp and commercial insurance specialist', 10),
  ('Hiscox', 'hiscox', 'specialty', 'Small business and professional liability specialist', 11),
  ('Markel', 'markel', 'specialty', 'Specialty insurance for unique risks', 12),
  ('Foremost', 'foremost', 'specialty', 'Specialty coverage for motorcycles, boats, and more', 13),
  ('National General', 'national-general', 'personal', 'Personal auto and homeowner coverage', 14),
  ('Mercury Insurance', 'mercury', 'personal', 'Competitive personal auto insurance', 15),
  ('Bristol West', 'bristol-west', 'personal', 'Non-standard auto insurance solutions', 16),
  ('Dairyland', 'dairyland', 'specialty', 'Motorcycle and non-standard auto insurance', 17),
  ('GEICO', 'geico', 'personal', 'Government Employees Insurance Company', 18),
  ('State Auto', 'state-auto', 'general', 'Personal and commercial property insurance', 19),
  ('Berkley One', 'berkley-one', 'specialty', 'High net worth personal lines insurance', 20)
ON CONFLICT (slug) DO NOTHING;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGRATION 7 — Create API routes for new tables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create these API route files (full CRUD):

app/api/admin/agents/route.ts        — GET list + POST create
app/api/admin/agents/[id]/route.ts   — GET one + PUT update + DELETE
app/api/admin/carriers/route.ts      — GET list + POST create
app/api/admin/carriers/[id]/route.ts — PUT update + DELETE
app/api/admin/site-carriers/route.ts — GET site's carriers + PUT update assignments
app/api/admin/insurance-lines/route.ts — GET site's lines + PUT update enabled/order
app/api/admin/quote-requests/route.ts — GET list (with filters) + stats summary
app/api/admin/quote-requests/[id]/route.ts — PUT update status + notes + assign agent

app/api/quote/route.ts               — POST public endpoint — saves quote request + sends email
```

**Done-Gate 0C:**
- [ ] All 5 tables created in Supabase — visible in Table Editor
- [ ] RLS policies active on all tables
- [ ] 20 carrier rows seeded in `carriers` table
- [ ] All 8 API route files created and return 200 for GET requests
- [ ] `POST /api/quote` inserts a test row into `quote_requests`
- [ ] `GET /api/admin/agents` returns `{ agents: [] }` (empty — seeded in 0E)
- [ ] Git commit: `feat: phase-0C — insurance DB tables and API routes`

---

## Prompt 0D — Content Contracts: All Section Types

**Goal:** Define the complete content model before writing any page code. Create TypeScript interfaces, JSON schemas with variant registries, and admin form field definitions for every section type used across the insurance platform. This is the most critical Phase 0 step.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md — A3 Site Architecture + A4 Component Inventory

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARTIFACT 1 — Page Inventory & Content Contract Map
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create lib/insurance/content-contracts.ts with this page inventory:

| Page               | Route                  | Content Path                           | Sections                                                                    |
|--------------------|------------------------|----------------------------------------|-----------------------------------------------------------------------------|
| Home               | /                      | pages/home.json                        | hero, insuranceLines, whyIndependent, stats, carriers, howItWorks, testimonials, agents, blog, cta |
| Insurance Hub      | /insurance             | pages/insurance.json                   | hero, serviceGrid, whyUs, faq, cta                                          |
| Service Page       | /insurance/[slug]      | pages/insurance/[slug].json            | serviceHero, whatItCovers, whyUs, quoteProcess, rateFactors, testimonials, faq, related, inlineForm |
| Quote              | /quote                 | pages/quote.json                       | formConfig                                                                  |
| About              | /about                 | pages/about.json                       | hero, story, mission, licenses, team, carriers, cta                         |
| Agents             | /agents                | pages/agents.json                      | hero, agentGrid                                                             |
| Carriers           | /carriers              | pages/carriers.json                    | hero, carrierGrid                                                           |
| Testimonials       | /testimonials          | pages/testimonials.json                | hero, testimonialGrid                                                       |
| Resources Hub      | /resources             | pages/resources.json                   | hero, featuredPost, blogGrid, cta                                           |
| FAQ                | /faq                   | pages/faq.json                         | hero, faqCategories                                                         |
| Claims             | /claims                | pages/claims.json                      | hero, process, contact                                                      |
| Contact            | /contact               | pages/contact.json                     | hero, contactInfo, form, map                                                |
| DMV Services       | /services/dmv          | pages/services/dmv.json                | hero, serviceDetail, requirements, cta                                      |
| Notary Services    | /services/notary       | pages/services/notary.json             | hero, serviceDetail, pricing, cta                                           |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARTIFACT 2 — Section Contracts with Variants and Form Fields
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create lib/insurance/sections/ with one file per section type:

--- SECTION: hero ---

Variants:
- animated-stats: centered headline + animated stat counters + dual CTA (home page)
- split-image:    text left, image right + single CTA (service pages, about)
- centered:       centered text + CTA on clean background (contact, faq, resources)
- service-hero:   badge + headline + coverage type icon + quote CTA (insurance/[slug] pages)

JSON Contract:
{
  "hero": {
    "variant": "animated-stats" | "split-image" | "centered" | "service-hero",
    "badge": "string (optional — e.g. 'TLC Specialist' or 'Licensed & Independent')",
    "headline": "string (required)",
    "subline": "string (required)",
    "stats": [{ "value": "string", "label": "string" }],
    "ctaPrimary": { "label": "string", "href": "string" },
    "ctaSecondary": { "label": "string", "href": "string" },
    "backgroundImage": "string (url, optional)",
    "image": "string (url, for split-image variant)",
    "imageAlt": "string"
  }
}

Form Fields:
- variant: select [animated-stats, split-image, centered, service-hero]
- badge: text, optional
- headline: text, required
- subline: textarea, required
- stats: array → { value: text, label: text } (shown only for animated-stats)
- ctaPrimary.label: text; ctaPrimary.href: text
- ctaSecondary.label: text; ctaSecondary.href: text (optional)
- backgroundImage: image picker
- image: image picker (shown only for split-image)

--- SECTION: insuranceLines ---

Variants:
- grid-3col:          3-column grid, all enabled lines
- featured-plus-grid: 3 featured large + remaining in grid
- list:               vertical list with description

JSON Contract:
{
  "insuranceLines": {
    "variant": "grid-3col" | "featured-plus-grid" | "list",
    "headline": "string",
    "subline": "string (optional)",
    "showIcons": true,
    "showDescriptions": true,
    "ctaLabel": "string (e.g. 'Learn More')"
  }
}
(Lines themselves come from DB: insurance_lines table filtered by site_id + is_enabled)

Form Fields:
- variant: select
- headline: text
- subline: textarea, optional
- showIcons: toggle
- showDescriptions: toggle
- ctaLabel: text

--- SECTION: whyIndependent ---

Variants:
- three-columns: 3 feature columns side-by-side
- centered-list: centered headline + bulleted benefits

JSON Contract:
{
  "whyIndependent": {
    "variant": "three-columns" | "centered-list",
    "headline": "string",
    "subline": "string (optional)",
    "points": [
      {
        "icon": "string (icon name)",
        "title": "string",
        "description": "string"
      }
    ]
  }
}

Form Fields:
- variant: select
- headline: text
- points: array → { icon: text, title: text, description: textarea }

--- SECTION: stats ---

Variants:
- dark-band:   dark navy background, large white numbers (default)
- light-cards: white cards on light background

JSON Contract:
{
  "stats": {
    "variant": "dark-band" | "light-cards",
    "items": [
      { "value": "string", "label": "string", "suffix": "string (optional, e.g. '+')" }
    ]
  }
}

Form Fields:
- variant: select
- items: array → { value: text, label: text, suffix: text (optional) }

--- SECTION: carriers ---

Variants:
- auto-scroll: continuous loop carousel
- static-grid: responsive grid of logos

JSON Contract:
{
  "carriers": {
    "variant": "auto-scroll" | "static-grid",
    "headline": "string",
    "subline": "string (optional)"
  }
}
(Carrier logos loaded from DB: site_carriers + carriers tables)

--- SECTION: howItWorks ---

JSON Contract:
{
  "howItWorks": {
    "headline": "string",
    "subline": "string (optional)",
    "steps": [
      {
        "number": "string (e.g. '01')",
        "title": "string",
        "description": "string",
        "duration": "string (optional, e.g. '2 minutes')"
      }
    ],
    "cta": { "label": "string", "href": "string" }
  }
}

Form Fields:
- headline: text
- steps: array → { number: text, title: text, description: textarea, duration: text }
- cta.label: text; cta.href: text

--- SECTION: testimonials ---

Variants:
- featured-3:   3 highlighted cards
- masonry-grid: masonry layout for many testimonials
- slider:       auto-rotating carousel

JSON Contract:
{
  "testimonials": {
    "variant": "featured-3" | "masonry-grid" | "slider",
    "headline": "string (optional)",
    "showRating": true,
    "showCoverageType": true,
    "filterByCoverageType": "string (optional — filters DB results)",
    "limit": 3
  }
}
(Content loaded from DB: testimonials table filtered by site_id)

--- SECTION: whatItCovers (service page only) ---

JSON Contract:
{
  "whatItCovers": {
    "headline": "string",
    "included": [{ "title": "string", "description": "string" }],
    "excluded": [{ "title": "string", "description": "string" }],
    "whoNeedsIt": "string (paragraph)"
  }
}

Form Fields:
- headline: text
- included: array → { title: text, description: textarea }
- excluded: array → { title: text, description: textarea }
- whoNeedsIt: textarea

--- SECTION: rateFactors (service page only) ---

JSON Contract:
{
  "rateFactors": {
    "headline": "string",
    "factors": [{ "factor": "string", "impact": "low|medium|high", "description": "string" }],
    "tips": ["string"]
  }
}

--- SECTION: licenses (about page) ---

JSON Contract:
{
  "licenses": {
    "headline": "string",
    "items": [
      {
        "state": "string",
        "licenseNumber": "string",
        "verifyUrl": "string"
      }
    ],
    "memberships": [{ "name": "string", "logoUrl": "string (optional)" }],
    "disclaimer": "string"
  }
}

--- SECTION: quoteForm (full page) ---

JSON Contract:
{
  "formConfig": {
    "headline": "string",
    "subline": "string",
    "steps": [
      {
        "step": 1,
        "title": "What do you need to insure?",
        "description": "Select all that apply"
      },
      {
        "step": 2,
        "title": "Your Contact Information",
        "description": "We'll reach out within 2 business hours"
      },
      {
        "step": 3,
        "title": "Additional Details",
        "description": "Optional — helps us give you a more accurate quote"
      }
    ],
    "contactTimeOptions": ["Morning (9am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)", "Anytime"],
    "languageOptions": ["English", "Spanish", "Chinese", "Other"],
    "coverageTypes": [
      { "slug": "auto", "label": "Auto Insurance", "icon": "car" },
      { "slug": "tlc", "label": "TLC / Livery Insurance", "icon": "taxi" },
      { "slug": "commercial-auto", "label": "Commercial Auto", "icon": "truck" },
      { "slug": "homeowner", "label": "Homeowner Insurance", "icon": "home" },
      { "slug": "business", "label": "Business Insurance", "icon": "briefcase" },
      { "slug": "workers-comp", "label": "Workers Compensation", "icon": "hard-hat" },
      { "slug": "disability", "label": "Disability Insurance", "icon": "shield" },
      { "slug": "construction", "label": "Construction Insurance", "icon": "hammer" },
      { "slug": "motorcycle", "label": "Motorcycle Insurance", "icon": "motorcycle" },
      { "slug": "boat", "label": "Boat Insurance", "icon": "anchor" },
      { "slug": "travel", "label": "Travel Insurance", "icon": "plane" },
      { "slug": "group-health", "label": "Group Health Insurance", "icon": "heart" }
    ],
    "confirmation": {
      "headline": "Thank You! Your Quote Request Was Received.",
      "subline": "A licensed broker will contact you within 2 business hours.",
      "nextSteps": [
        "We review your coverage needs",
        "We shop 30+ carriers for you",
        "We present your best options"
      ]
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARTIFACT 3 — TypeScript Interfaces
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create lib/insurance/types.ts with interfaces for:
- InsuranceAgent
- Carrier
- InsuranceLine
- QuoteRequest
- InsuranceLineSlug (union type for all 12 slugs)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARTIFACT 4 — Register variants in admin Variants panel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Seed variant definitions into the DB variants table:

Section       | Variant ID        | Label                   | Description
hero          | animated-stats    | Stats Hero              | Homepage: counters + dual CTA
hero          | split-image       | Split Image             | Text left, image right
hero          | centered          | Centered                | Centered text + CTA
hero          | service-hero      | Service Hero            | Insurance type page hero with badge
insuranceLines| grid-3col         | 3-Column Grid           | All lines in 3-column grid
insuranceLines| featured-plus-grid| Featured + Grid         | 3 featured large + rest in grid
stats         | dark-band         | Dark Band               | Navy background, white numbers
stats         | light-cards       | Light Cards             | Cards on light background
carriers      | auto-scroll       | Auto-Scroll Carousel    | Infinite loop animation
carriers      | static-grid       | Static Grid             | Responsive logo grid
testimonials  | featured-3        | Featured 3              | 3 highlighted testimonial cards
testimonials  | masonry-grid      | Masonry Grid            | Full testimonials page layout
whyIndependent| three-columns     | Three Columns           | 3 feature columns
whyIndependent| centered-list     | Centered List           | Centered benefits list
```

**Done-Gate 0D:**
- [ ] `lib/insurance/content-contracts.ts` created — all 14 pages mapped
- [ ] `lib/insurance/types.ts` created — all 5 interfaces defined
- [ ] Section contract JSON schemas created for all 14 section types
- [ ] Variant definitions seeded in DB (visible in admin Variants panel)
- [ ] Admin Content Editor shows variant dropdown for hero, insuranceLines, stats, carriers, testimonials
- [ ] Git commit: `feat: phase-0D — content contracts, TypeScript types, variant registry`

---

## Prompt 0E — Seed Demo Content: Peerless Brokerage

**Goal:** Create all JSON content files for every page, seed realistic demo data for the Peerless Brokerage site, populate insurance lines, assign carriers, create agent profiles, and seed testimonials and blog posts. After this prompt, Phase 1 can build pages immediately using real-looking content.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md — First Client: Peerless Brokerage section

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1 — Seed site record in Supabase
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Insert into sites table:
{
  id: 'peerless-brokerage',
  slug: 'peerless-brokerage',
  name: 'Peerless Brokerage Inc',
  domain: 'pbiny.local',
  is_active: true
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2 — Seed 15 insurance lines
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO insurance_lines (site_id, line_slug, is_enabled, is_featured, sort_order) VALUES
('peerless-brokerage', 'auto',            true, true,  1),
('peerless-brokerage', 'tlc',             true, true,  2),
('peerless-brokerage', 'commercial-auto', true, false, 3),
('peerless-brokerage', 'homeowner',       true, true,  4),
('peerless-brokerage', 'business',        true, false, 5),
('peerless-brokerage', 'workers-comp',    true, false, 6),
('peerless-brokerage', 'disability',      true, false, 7),
('peerless-brokerage', 'construction',    true, false, 8),
('peerless-brokerage', 'motorcycle',      true, false, 9),
('peerless-brokerage', 'boat',            true, false, 10),
('peerless-brokerage', 'travel',          true, false, 11),
('peerless-brokerage', 'group-health',    true, false, 12);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 3 — Assign 15 carriers to Peerless site
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO site_carriers (site_id, carrier_id, is_featured, sort_order)
SELECT 'peerless-brokerage', id, (sort_order <= 6), sort_order
FROM carriers WHERE slug IN (
  'travelers', 'progressive', 'nationwide', 'liberty-mutual',
  'the-hartford', 'chubb', 'employers', 'amtrust',
  'hiscox', 'foremost', 'national-general', 'mercury',
  'bristol-west', 'dairyland', 'geico'
);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 4 — Seed 5 agent profiles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO agents (site_id, name, slug, title, bio, specialties, languages, license_number, years_experience, phone, email, sort_order) VALUES
(
  'peerless-brokerage',
  'Michael Chen',
  'michael-chen',
  'Senior Insurance Broker',
  'Michael has been helping Brooklyn families and businesses find the right insurance coverage for over 18 years. Specializing in TLC and commercial auto, he is fluent in Mandarin and Cantonese.',
  ARRAY['tlc', 'auto', 'commercial-auto'],
  ARRAY['English', 'Mandarin', 'Cantonese'],
  'NY-LIC-0012345',
  18, '+1-718-555-0101', 'michael@pbiny.com', 1
),
(
  'peerless-brokerage',
  'Maria Rodriguez',
  'maria-rodriguez',
  'Business Insurance Specialist',
  'Maria brings 12 years of experience helping small business owners navigate their insurance needs. She specializes in BOP, workers compensation, and commercial liability for restaurant and retail clients.',
  ARRAY['business', 'workers-comp', 'commercial-auto'],
  ARRAY['English', 'Spanish'],
  'NY-LIC-0023456',
  12, '+1-718-555-0102', 'maria@pbiny.com', 2
),
(
  'peerless-brokerage',
  'David Park',
  'david-park',
  'Personal Lines Agent',
  'David focuses on personal auto, homeowner, and umbrella insurance for individuals and families across Brooklyn and Queens. He prides himself on fast turnarounds and clear communication.',
  ARRAY['auto', 'homeowner', 'motorcycle'],
  ARRAY['English', 'Korean'],
  'NY-LIC-0034567',
  8, '+1-718-555-0103', 'david@pbiny.com', 3
),
(
  'peerless-brokerage',
  'Sarah Thompson',
  'sarah-thompson',
  'Construction & Contractor Insurance Specialist',
  'Sarah has 14 years specializing in construction risk, including general liability, builders risk, and workers compensation for contractors and developers throughout New York.',
  ARRAY['construction', 'workers-comp', 'business'],
  ARRAY['English'],
  'NY-LIC-0045678',
  14, '+1-718-555-0104', 'sarah@pbiny.com', 4
),
(
  'peerless-brokerage',
  'James Wilson',
  'james-wilson',
  'TLC & Commercial Auto Specialist',
  'James is a recognized expert in TLC insurance for Uber, Lyft, and traditional taxi and livery drivers. He understands the unique compliance requirements of New York TLC regulations.',
  ARRAY['tlc', 'commercial-auto', 'auto'],
  ARRAY['English', 'Spanish'],
  'NY-LIC-0056789',
  10, '+1-718-555-0105', 'james@pbiny.com', 5
);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 5 — Seed 25 testimonials
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a seed script scripts/seed-insurance-testimonials.ts that inserts 25 testimonials
into the testimonials table with varied coverage types:
- 8 auto insurance testimonials
- 5 TLC/livery testimonials
- 5 business/commercial testimonials
- 4 homeowner testimonials
- 3 workers comp / construction testimonials

Each testimonial: { site_id, name, quote, rating: 5, coverage_type, is_featured }

Example testimonials to include:
1. "Michael helped me find auto insurance that saved me $800 a year. He shopped 8 carriers and explained every option clearly." — Robert K., Auto Insurance
2. "As a TLC driver, I needed TLC-compliant insurance fast. James had me covered the same day. He speaks Spanish which made everything so much easier." — Carlos M., TLC Insurance
3. "We've been using Peerless for our restaurant's BOP and workers comp for 6 years. Maria always finds us the best rates and handles our certificates of insurance within hours." — Linda T., Business Insurance
4. "After our basement flooded, the claims process was overwhelming. Sarah walked us through everything step by step. Best decision we ever made choosing Peerless." — Jennifer H., Homeowner Insurance
5. "I'm a general contractor and I need certificates of insurance constantly. David turns them around same day. I've recommended Peerless to every sub I work with." — Anthony B., Construction Insurance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 6 — Create all page JSON content files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create content/peerless-brokerage/pages/home.json with full content:

{
  "hero": {
    "variant": "animated-stats",
    "badge": "Licensed & Independent",
    "headline": "Your Trusted Independent Insurance Broker",
    "subline": "We shop 30+ carriers to find you the best rate for auto, home, business, and specialty coverage.",
    "stats": [
      { "value": "25", "label": "Years in Business", "suffix": "+" },
      { "value": "30", "label": "Carriers", "suffix": "+" },
      { "value": "5,000", "label": "Clients Served", "suffix": "+" },
      { "value": "10,000", "label": "Policies Written", "suffix": "+" }
    ],
    "ctaPrimary": { "label": "Get a Free Quote", "href": "/quote" },
    "ctaSecondary": { "label": "Call (718) 555-0100", "href": "tel:+17185550100" },
    "backgroundImage": ""
  },
  "insuranceLines": {
    "variant": "featured-plus-grid",
    "headline": "We Cover Everything",
    "subline": "Personal, business, and specialty coverage under one roof.",
    "ctaLabel": "Learn More"
  },
  "whyIndependent": {
    "variant": "three-columns",
    "headline": "Why Choose an Independent Broker?",
    "subline": "Unlike captive agents who represent one company, we work for you.",
    "points": [
      {
        "icon": "search",
        "title": "We Shop 30+ Carriers",
        "description": "We compare rates from over 30 insurance companies to find you the best coverage at the lowest price."
      },
      {
        "icon": "user-check",
        "title": "We Work for You",
        "description": "Our loyalty is to you, not to any single insurance company. We give unbiased advice based on your needs."
      },
      {
        "icon": "phone-call",
        "title": "One Broker for All Your Needs",
        "description": "Auto, home, business, specialty — one call and one trusted relationship handles everything."
      }
    ]
  },
  "stats": {
    "variant": "dark-band",
    "items": [
      { "value": "25", "label": "Years in Business", "suffix": "+" },
      { "value": "30", "label": "Carriers Accessed", "suffix": "+" },
      { "value": "5,000", "label": "Clients Served", "suffix": "+" },
      { "value": "4.9", "label": "Google Rating", "suffix": "★" }
    ]
  },
  "carriers": {
    "variant": "auto-scroll",
    "headline": "Carriers We Work With",
    "subline": "We shop them all to get you the best rate"
  },
  "howItWorks": {
    "headline": "How It Works — 3 Simple Steps",
    "subline": "Getting your best insurance rate has never been easier.",
    "steps": [
      {
        "number": "01",
        "title": "Tell Us What You Need",
        "description": "Fill out our quick quote form or give us a call. Takes less than 2 minutes.",
        "duration": "2 minutes"
      },
      {
        "number": "02",
        "title": "We Shop 30+ Carriers",
        "description": "Our licensed brokers compare rates from over 30 insurance companies on your behalf.",
        "duration": "Same day"
      },
      {
        "number": "03",
        "title": "You Choose the Best Rate",
        "description": "We present your options clearly. You pick the coverage that fits your needs and budget.",
        "duration": "You decide"
      }
    ],
    "cta": { "label": "Start My Free Quote", "href": "/quote" }
  },
  "testimonials": {
    "variant": "featured-3",
    "headline": "What Our Clients Say",
    "showRating": true,
    "showCoverageType": true,
    "limit": 3
  },
  "cta": {
    "headline": "Ready to Save on Insurance?",
    "subline": "Get a free quote in minutes. We'll shop 30+ carriers to find your best rate.",
    "ctaPrimary": { "label": "Get a Free Quote", "href": "/quote" },
    "ctaSecondary": { "label": "Call (718) 555-0100", "href": "tel:+17185550100" },
    "note": "Quote within 2 hours during business hours"
  }
}

Create pages/home.layout.json:
{
  "sections": ["hero", "insuranceLines", "whyIndependent", "stats", "carriers", "howItWorks", "testimonials", "cta"]
}

Create the 3 featured service page JSON files as representative templates:

content/peerless-brokerage/pages/insurance/auto.json
content/peerless-brokerage/pages/insurance/tlc.json
content/peerless-brokerage/pages/insurance/homeowner.json

Each with full content for all 8 sections: serviceHero, whatItCovers, whyUs,
quoteProcess, rateFactors, testimonials, faq (5 items each), related

Create placeholder JSON (just { "title": "[Type] Insurance" }) for remaining 9 service pages.

Create all other page JSON:
- pages/about.json (full content)
- pages/quote.json (full formConfig from contracts)
- pages/contact.json (full contact info)
- pages/insurance.json (hub page)
- pages/agents.json (just hero — agents come from DB)
- pages/carriers.json (just hero — carriers from DB)
- pages/testimonials.json (just hero — testimonials from DB)
- pages/resources.json (blog hub)
- pages/faq.json (25 FAQ items across 4 categories)
- pages/claims.json
- pages/services/dmv.json
- pages/services/notary.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 7 — Seed all page JSON into Supabase content_entries
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create scripts/seed-insurance-content.ts that:
1. Reads all JSON files from content/peerless-brokerage/pages/
2. Upserts each into content_entries table with correct site_id and path
3. Reads all .layout.json files and upserts into content_layouts table
4. Runs seed-insurance-testimonials.ts

Run the script: npx tsx scripts/seed-insurance-content.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 8 — Seed 8 blog post stubs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create content/peerless-brokerage/blog/ with 8 JSON files:

1. how-much-does-auto-insurance-cost-nyc.json
2. what-is-tlc-insurance-and-who-needs-it.json
3. independent-broker-vs-captive-agent.json
4. how-to-save-money-business-insurance.json
5. workers-comp-requirements-new-york.json
6. home-insurance-renewal-checklist.json
7. commercial-auto-insurance-fleet-guide.json
8. top-5-insurance-mistakes.json

Each file: { title, slug, excerpt (2 sentences), publishedAt, author: "Peerless Brokerage Team", category, coverImage: "", body: "[Article content coming in Phase 2]", tags: [] }
```

**Done-Gate 0E:**
- [ ] `peerless-brokerage` site record in Supabase `sites` table
- [ ] 15 rows in `insurance_lines` table for peerless-brokerage
- [ ] 15 rows in `site_carriers` table for peerless-brokerage
- [ ] 5 agent rows in `agents` table
- [ ] 25 testimonials in `testimonials` table
- [ ] `pages/home.json` seeded in `content_entries`
- [ ] All 22 page JSON files exist in `content/peerless-brokerage/pages/`
- [ ] 8 blog stubs exist in `content/peerless-brokerage/blog/`
- [ ] Admin Content Editor shows home.json with form panels and correct fields
- [ ] Git commit: `feat: phase-0E — seed Peerless Brokerage demo content, agents, carriers`

---

## Phase 0 Completion Gate

All items must be checked before starting Phase 1.

| Check | Requirement | Pass? |
|-------|-------------|-------|
| **0A** | App boots on port 3007 with no errors. No medical-specific components remain. | |
| **0A** | Admin CMS loads at `/admin`. Login works. | |
| **0A** | `_sites.json` has only `peerless-brokerage`. Directory structure created. | |
| **0B** | Navy `#0B1F3A` + Gold `#C9933A` visible in browser. Playfair Display + Inter loaded. | |
| **0B** | All 4 global settings JSON files exist with realistic content. | |
| **0C** | 5 new tables exist in Supabase: agents, carriers, site_carriers, insurance_lines, quote_requests. | |
| **0C** | 20 carrier rows seeded. All 8 API routes return 200. POST /api/quote works. | |
| **0D** | All section contracts defined. TypeScript interfaces in lib/insurance/types.ts. | |
| **0D** | Variant dropdown populated in admin for: hero (4 variants), insuranceLines (3), stats (2), carriers (2), testimonials (3). | |
| **0E** | All demo data seeded: 15 lines, 15 carriers, 5 agents, 25 testimonials. | |
| **0E** | home.json visible in admin Content Editor with correct form fields. | |
| **0E** | 22 page JSON files seeded. 8 blog stubs seeded. | |
| **All** | `npm run build` passes with no errors. | |
| **All** | Git tagged: `v0.0-phase0-complete` | |

---

**Phase 0 complete → generate `INSURANCE_PHASE_1.md` for Core Pages build.**

---

*BAAM System I — Insurance Platform — Phase 0 v1.0*
