# BAAM System I — Insurance Brokerage Platform
# Phase 3: Authority Expansion + Programmatic SEO + Admin Hardening

> **System:** BAAM System I — Insurance Brokerage Platform
> **Reference files:** `@INSURANCE_COMPLETE_PLAN.md` + `@INSURANCE_PHASE_0.md` + `@INSURANCE_PHASE_1.md` + `@INSURANCE_PHASE_2.md`
> **Prototype files:** `prototypes/carriers.html` · `prototypes/service-auto.html` (location pages follow same layout, localized content)
> **Prerequisite:** Phase 2 gate fully passed. All 17 pages live. Quote pipeline end-to-end working. All 15 service pages wired. `v0.2-phase2-complete` tagged.
> **Method:** One Cursor prompt per session. BUILD → WIRE → VERIFY every deliverable before moving on.
> **Rule:** A deliverable is only "done" when all three steps pass AND layout matches `prototypes/[page].html`. Never skip a done-gate.

---

## Phase 3 Overview

**Duration:** Week 5–6
**Goal:** Transform the site from a working platform into a dominant local SEO presence. Build the Carrier Partners page, the full programmatic location page system (up to 50 city-level pages), admin hardening (email notifications, onboarding wizard, multi-site controls), and pass a full Core Web Vitals performance audit. After Phase 3, the site is ready for its first client launch.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|--------|-------|-----------|
| 3A | Carrier Partners Page + Individual Carrier Pages | `/carriers` hub + `/carriers/[slug]` trust pages | 90 min |
| 3B | Programmatic Location Pages | `/insurance/[type]/[city]` — 50+ SEO pages from template | 120 min |
| 3C | Service Area Hub | `/locations` index + city overview pages | 60 min |
| 3D | Admin Hardening | Email notifications, site onboarding wizard, Carriers + Insurance Lines admin | 90 min |
| 3E | Google Reviews Integration | Display Google rating, review import, review request workflow | 60 min |
| 3F | Performance Audit + Core Web Vitals | LCP, CLS, INP pass on all key pages, image optimization, Lighthouse ≥ 95 | 90 min |

---

## Build → Wire → Verify Checklist (Every Deliverable)

| Check | How to Verify |
|---|---|
| **Renders from DB** | Change record in Supabase → reload → change appears |
| **No hardcoded content** | All names, addresses, phone numbers from site.json or DB |
| **Mobile** | 375px — no overflow, tap targets ≥ 44px |
| **SEO tags** | View source — title, description, OG, canonical all present |
| **Performance** | Chrome DevTools Lighthouse ≥ 90 on tested page |
| **Admin editable** | Every user-facing string has an admin UI edit path |
| **Multi-site safe** | Content scoped to site_id — no data leaks across sites |

---

## Prompt 3A — Carrier Partners Page + Individual Carrier Pages

**Goal:** Build `/carriers` and `/carriers/[slug]`. These pages are pure trust signals — when a prospect sees Travelers, Progressive, Nationwide logos and knows the brokerage represents them all, it converts doubt into confidence.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A4.1 Component Inventory — CarrierLogoCarousel

Files:
  app/[locale]/carriers/page.tsx
  app/[locale]/carriers/[slug]/page.tsx
Reads from: carriers table + site_carriers table + content_entries 'pages/carriers.json'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 1 — Carriers Hub: /carriers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — CarriersHero
  Reuse existing PageHero component.
  Heading: "Our Carrier Partners" (from carriers.json)
  Subline: "We represent [count]+ leading insurance carriers — so you get the most competitive rates, not just one company's price."
    Replace [count] with live count from site_carriers for this site.
  CTA: "Get a Free Quote" → /quote
  Background: navy gradient (no image needed — keep it clean and fast)

SECTION 2 — CarrierPhilosophyStrip
  NEW compact section: components/sections/CarrierPhilosophyStrip.tsx

  3-column strip (reuses WhyIndependentSection layout — variant 'compact'):
  - "We Shop All of Them": "We compare rates across every carrier we represent — not just the first one that qualifies."
  - "No Carrier Bias": "Our commission structure doesn't incentivize one carrier over another. Your best rate wins."
  - "You Stay in Control": "You see the comparison. You choose. We just do the shopping."
  Read from carriers.json philosophy (array of { headline, body }).
  Background: var(--color-bg-subtle), padding top/bottom 48px.

SECTION 3 — CarrierGrid
  Display all carriers for this site (JOIN carriers + site_carriers WHERE site_id = current).
  Order by: site_carriers.sort_order ASC.

  Filter bar above grid (client-side):
  - Insurance Type (select): All | Auto | Home | Business | Commercial | Specialty
    Maps to: carriers.types_covered (jsonb array of insurance_line slugs) — show only types with ≥1 carrier
  - Search (text): searches carrier name

  CarrierCard component:
  File: components/carriers/CarrierCard.tsx

  ┌──────────────────────────────────┐
  │  [LOGO — max 160×80px, centered] │
  │                                  │
  │  Travelers                       │  ← name: bold, var(--font-heading)
  │  Commercial · Auto · Home        │  ← type badges (resolved names)
  │                                  │
  │  "One of the largest commercial  │  ← short description (1 sentence)
  │   insurers in the US since 1853" │    — optional, from carriers.description
  │                                  │
  │  [Learn More →]                  │  ← links to /carriers/[slug]
  └──────────────────────────────────┘

  Layout: 4 columns desktop, 3 tablet, 2 mobile.
  Logo treatment: white background card, light border, logo grayscale by default → color on hover.
  Featured carriers (site_carriers.is_featured = true): slightly larger card, gold border.

  Fallback if no logo_url: grey rectangle with carrier name initial in center.
  Never show a broken <img> tag.

SECTION 4 — CarrierCountCTA
  Simple callout: "Can't find your current carrier?"
  Body: "We work with [count]+ carriers — if yours isn't listed here, call us and we'll check if we can match or beat your current rate."
  CTA: "Call Us" + "Get a Quote"
  Background: var(--color-brand-800) navy, white text.

SECTION 5 — QuoteCTASection (REUSE — 'cta-only' variant)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 2 — Individual Carrier Page: /carriers/[slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/carriers/[slug]/page.tsx

Data loading:
1. Fetch carriers record WHERE slug = params.slug AND is_active = true
2. Verify this carrier is assigned to the current site (site_carriers join) — if not: 404
3. Load content from carriers record (name, logo_url, description, website, types_covered)

These pages are intentionally SIMPLE — 4 sections only.
They exist for SEO (people search "[carrier] vs [broker]") and trust, not as rich content pages.

SECTION 1 — CarrierHero (compact)
  Layout: 2-column — left: carrier logo (large, 200×100), right: text
  Heading: "[Carrier Name] Insurance through [Brokerage Name]"
  Subline: "Access [Carrier Name] rates — plus comparisons from [count]+ other carriers. We find your best deal."
  CTA: "Get a [Carrier Name] Quote" → /quote

SECTION 2 — AboutCarrierSection
  Heading: "About [Carrier Name]"
  Body: carriers.description (from DB)
  Types covered: "Available coverage types through [Carrier Name]:" — pill badges for types_covered
  Website link: "Visit [Carrier Name] official site →" → carriers.website (opens new tab)
    Only render if website is non-empty.

SECTION 3 — WhyBrokerVsDirectSection
  "Why get [Carrier Name] insurance through a broker?"
  3-point explainer (REUSE WhyIndependentSection — 'compact' variant):
  - "We compare [Carrier Name] against [count]+ other carriers"
  - "If [Carrier Name] isn't your best option, we'll tell you"
  - "One broker for all your coverage — even if [Carrier Name] doesn't cover everything"

SECTION 4 — CarrierQuoteCTA (REUSE QuoteCTASection — 'cta-only')
  "Get a [Carrier Name] quote — and see how it compares to the rest."

SEO for /carriers/[slug]:
  Title: "[Carrier Name] Insurance Quotes in [City] | [Brokerage Name]"
  Description: "Get [Carrier Name] insurance quotes through [Brokerage Name] — [City]'s independent broker. We compare [Carrier Name] against 20+ carriers to find your best rate."
  Target keywords: "[carrier name] insurance [city]", "[carrier name] broker"

404 handling:
  - Carrier slug not found in carriers table → Next.js 404
  - Carrier found but not assigned to this site → 404 (don't reveal platform structure)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING — Carriers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Admin Carriers page: admin/carriers/
(This was listed in Phase 0C DB schema — verify the admin CRUD exists. If not, build it now.)

Global Carrier Catalog (platform_super_admin only — admin/carriers/catalog):
  Table of all carriers (across all sites):
  - Carrier name, slug, logo URL, description, website, types covered, active toggle
  - Add Carrier button → modal form
  - Edit: inline or modal
  - Logo: image picker (upload or URL)
  - types_covered: multi-select from fixed list of insurance_line slugs

Site Carriers Assignment (site_admin — admin/carriers/):
  "Choose which carriers to display on your site"
  Paginated list of all active global carriers:
  - Checkbox to include/exclude for this site
  - Drag to reorder (sort_order)
  - "Featured" star toggle (appears with gold border on /carriers page)
  Save button at bottom (batch update site_carriers rows).

Content Editor for pages/carriers.json:
  - Hero: heading, subline, CTA
  - Philosophy strip: 3 reasons (repeatable — headline + body)
  - Filter bar: enabled toggle
  - CarrierCountCTA: heading, body text

Insurance Lines Admin (admin/insurance-lines/ — verify exists from Phase 0C):
  Per-site toggles for all 15 insurance lines:
  - Enable/disable per line (is_enabled)
  - Custom description override (optional)
  - Display order (drag to reorder)
  - Category assignment (auto / commercial / specialty / services)
  - Icon selection (pick from icon library)
  - Featured toggle (shows with gold border on InsuranceLineGrid)
```

**Done-Gate 3A:**
- `/carriers` renders with all carriers assigned to this site
- Insurance Type filter shows only types that at least one carrier covers
- Featured carriers have gold border
- Logos show grayscale by default, color on hover
- `/carriers/travelers` (or any slug) renders 4-section page
- `/carriers/unknown-slug` returns 404
- Carrier slug for a different site returns 404 (multi-site isolation)
- All SEO title/description on `/carriers/[slug]` include carrier name + city
- Admin: platform admin can add/edit global carrier catalog
- Admin: site admin can toggle which carriers show, reorder, mark featured
- New carrier added in admin → appears on /carriers after reload

---

## Prompt 3B — Programmatic Location Pages

**Goal:** Build the `/insurance/[type]/[city]` programmatic SEO page system. This is the highest-leverage SEO investment — 50+ targeted pages that each rank for "[type] insurance [city]" searches. Every page renders from a template with localized content; no manual content entry needed per city.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A3.1 Tier 4 Programmatic SEO

Files:
  app/[locale]/insurance/[slug]/[city]/page.tsx    ← NEW dynamic route
  lib/insurance/locations.ts                        ← NEW — location data utility
  content/locations/[city].json                     ← NEW — per-city data files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Location Data Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location data is stored in TWO ways:

A) Global location registry (site-independent):
   File: lib/insurance/locations.ts
   A static TypeScript object — NOT in DB. Locations don't change per site.

   Type definition:
   interface InsuranceLocation {
     slug: string;           // 'brooklyn' | 'queens' | 'flushing' | etc.
     name: string;           // 'Brooklyn'
     state: string;          // 'NY'
     stateCode: string;      // 'NY'
     county?: string;        // 'Kings County'
     metro?: string;         // 'New York City'
     population?: number;    // 2.7M
     neighborhoodOf?: string; // 'New York City' — for sub-areas
     lat?: number;
     lng?: number;
   }

   const LOCATIONS: Record<string, InsuranceLocation> = {
     brooklyn: { slug: 'brooklyn', name: 'Brooklyn', state: 'New York', stateCode: 'NY', county: 'Kings County', metro: 'New York City', population: 2700000 },
     queens: { slug: 'queens', name: 'Queens', state: 'New York', stateCode: 'NY', county: 'Queens County', metro: 'New York City', population: 2300000 },
     flushing: { slug: 'flushing', name: 'Flushing', state: 'New York', stateCode: 'NY', county: 'Queens County', metro: 'New York City', neighborhoodOf: 'Queens' },
     bronx: { slug: 'bronx', name: 'The Bronx', state: 'New York', stateCode: 'NY', county: 'Bronx County', metro: 'New York City' },
     'staten-island': { slug: 'staten-island', name: 'Staten Island', state: 'New York', stateCode: 'NY', county: 'Richmond County', metro: 'New York City' },
     manhattan: { slug: 'manhattan', name: 'Manhattan', state: 'New York', stateCode: 'NY', county: 'New York County', metro: 'New York City' },
     'new-york-city': { slug: 'new-york-city', name: 'New York City', state: 'New York', stateCode: 'NY' },
     'jersey-city': { slug: 'jersey-city', name: 'Jersey City', state: 'New Jersey', stateCode: 'NJ', county: 'Hudson County' },
     newark: { slug: 'newark', name: 'Newark', state: 'New Jersey', stateCode: 'NJ', county: 'Essex County' },
     hoboken: { slug: 'hoboken', name: 'Hoboken', state: 'New Jersey', stateCode: 'NJ', county: 'Hudson County' },
     'white-plains': { slug: 'white-plains', name: 'White Plains', state: 'New York', stateCode: 'NY', county: 'Westchester County' },
     yonkers: { slug: 'yonkers', name: 'Yonkers', state: 'New York', stateCode: 'NY', county: 'Westchester County' },
     stamford: { slug: 'stamford', name: 'Stamford', state: 'Connecticut', stateCode: 'CT', county: 'Fairfield County' },
     bridgeport: { slug: 'bridgeport', name: 'Bridgeport', state: 'Connecticut', stateCode: 'CT', county: 'Fairfield County' },
     philadelphia: { slug: 'philadelphia', name: 'Philadelphia', state: 'Pennsylvania', stateCode: 'PA', county: 'Philadelphia County' },
   };

   Export utility functions:
   - getLocation(slug: string): InsuranceLocation | null
   - getAllLocationSlugs(): string[]
   - getLocationsByState(stateCode: string): InsuranceLocation[]

B) Site-specific active locations (in DB):
   Add a simple JSON field to site.json (site-level config):
   site.json → activeLocationSlugs: string[] (array of location slugs active for this site)
   e.g. ["brooklyn", "queens", "flushing", "bronx", "staten-island", "new-york-city", "jersey-city"]

   Only locations in activeLocationSlugs get pages generated for this site.
   A site in NJ would have a different activeLocationSlugs than a NYC broker.

   Default for new sites: empty array → NO location pages until explicitly configured.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Dynamic Route
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/insurance/[slug]/[city]/page.tsx

generateStaticParams():
  Read from: insurance_lines (enabled, for this site) × site.json.activeLocationSlugs
  Returns all [slug, city] combinations for static generation.
  Example: 15 insurance types × 7 locations = 105 pages.

Data loading in page component:
  1. const location = getLocation(params.city) — if null → notFound()
  2. const insuranceLine = await getInsuranceLine(siteId, params.slug) — if not enabled → notFound()
  3. const siteConfig = await getSiteConfig(siteId)
  4. If params.city NOT in siteConfig.activeLocationSlugs → notFound()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Location Page Template
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/location/InsuranceLocationPage.tsx

This component renders ALL location pages. It accepts:
Props:
  insuranceLine: InsuranceLine (from DB — slug, name, icon, category)
  location: InsuranceLocation
  siteConfig: SiteConfig (name, phone, address, licenseNumbers)
  servicePageContent: any (the base /insurance/[slug].json — reused for WhatItCovers, FAQ, etc.)

5-section layout (DELIBERATELY SIMPLER than the service page):
These pages are SEO landing pages — they must load fast and convert fast.

SECTION 1 — LocationServiceHero
  Heading: "[Insurance Type] Insurance in [City], [State]"
  Subline: "Get [type] insurance quotes from [brokerage name] — [city]'s trusted independent broker. We compare [count]+ carriers for your best rate."
  Stats bar: 3 stats — "Serving [City] Since [year]" | "[count]+ Carriers" | "Free Quote"
  CTA Primary: "Get a [Type] Quote in [City]" → /quote?type=[slug]
  CTA Secondary: "Call [phone]"
  Trust badge: "Licensed in [state] · Independent Broker"
  All values: dynamic from location + insuranceLine + siteConfig — zero hardcoded text.

SECTION 2 — LocalExpertiseSection (NEW)
  File: components/location/LocalExpertiseSection.tsx

  Heading: "Local [Type] Insurance Experts in [City]"
  2-column layout:
  Left: body text (template-generated):
    "[Brokerage Name] has been serving [City] residents and businesses since [year].
    We understand the specific [type] insurance requirements in [state] — from [state]-required
    minimums to [city]-specific risks. Our independent brokers compare [count]+ carriers
    to find your best rate — not just the first one that qualifies."

    For TLC pages in NYC: add a paragraph about TLC/FHV requirements specific to NYC/TLC Commission.
    For flood-risk cities (Jersey City, Hoboken, etc.): note flood insurance considerations.
    Special location notes are controlled by a per-city config in locations.ts:
      specialNotes?: Record<string, string>; // { 'tlc': 'TLC-specific note...', 'homeowner': '...' }

  Right: mini stats block:
    - "[count]+ clients served in [county/metro]" (from site.json stats)
    - "Licensed in [state]" (from site.json licenseNumbers — filter to this state)
    - "[Office address]" + "Get Directions →"
    - Phone (click-to-call)

SECTION 3 — WhatItCoversSection (REUSE from Phase 1D)
  Reuse the exact same component from the base service page.
  Load from: the base /insurance/[slug].json whatItCovers data.
  Add location-specific intro: "In [State], [type] insurance requires..." (from locations.ts specialNotes)
  No content duplication — shares the DB content entry from the base service page.

SECTION 4 — LocationFAQSection (REUSE ServiceFAQSection)
  Use the same FAQ data from the base /insurance/[slug].json faq array.
  Prepend 1–2 location-specific questions:
  Q: "Do you serve [City] residents for [type] insurance?"
  A: "Yes — [Brokerage Name] serves all of [City] and surrounding [county/metro area]. Call [phone] or submit a quote request and we'll get back to you within 2 hours."

  Q: "What is the minimum [type] insurance required in [State]?" (only if isRequired = true for this type)
  A: Pull from base service page requiredNote field.

  Include FAQPage schema.org for all questions (same as base service page).

SECTION 5 — LocationQuoteCTA (REUSE QuoteCTASection — 'form-inline' variant)
  Heading: "Get Your [Type] Insurance Quote in [City] Today"
  Subline: "Free. No obligation. We respond within 2 hours."
  Form: pre-populate coverage type from slug.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — SEO for Location Pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

generateMetadata() for /insurance/[slug]/[city]:

title: "[Type] Insurance in [City], [State] | [Brokerage Name]"
  Example: "Auto Insurance in Brooklyn, NY | Peerless Brokerage"

description: "Get [type] insurance quotes in [City]. [Brokerage Name] compares [count]+ carriers to find your best rate. Licensed in [State]. Free quotes — call [phone]."
  Max 155 chars. Dynamic values from location + siteConfig.

canonical: "https://[domain]/insurance/[slug]/[city]"
  CRITICAL: Every location page must have canonical pointing to itself (not to the base service page).
  Without canonical, Google may treat these as duplicates.

OG image: use base service page hero image (site.json serviceOgImage or specific /insurance/[slug].json hero.image)

Schema.org:
  LocalBusiness + Service (same as base page) but include:
  "areaServed": { "@type": "City", "name": "[City]", "addressRegion": "[StateCode]" }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Sitemap Update
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update app/sitemap.ts to include all location pages:

const locationPages = activeLocationSlugs.flatMap(city =>
  enabledInsuranceLines.map(line => ({
    url: `https://${domain}/insurance/${line.slug}/${city}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
);

Return combined: staticPages + servicePages + locationPages + blogPages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING — Location Pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin Site Settings, add "Location Pages" section:
  "Active Service Locations" — multi-select from LOCATIONS registry
  UI: checklist with search — each location shows name + state + county
  Checking/unchecking locations:
  - Updates site.json.activeLocationSlugs
  - Triggers Next.js revalidation of affected routes (revalidatePath for each slug/city combo)
  - Shows count: "X location pages will be generated"

  Warning when no locations selected:
  "No location pages are active. Enable at least one location to start generating city-level SEO pages."
```

**Done-Gate 3B:**
- `/insurance/auto/brooklyn` renders with "Auto Insurance in Brooklyn, NY" headline
- All dynamic values (city, state, brokerage name, phone) are from location data / siteConfig — zero hardcoded text
- `/insurance/tlc/brooklyn` shows TLC-specific local note in LocalExpertiseSection
- `/insurance/homeowner/hoboken` shows flood insurance consideration note
- `/insurance/auto/unknown-city` returns 404
- `/insurance/auto/philadelphia` returns 404 if philadelphia not in activeLocationSlugs
- FAQPage schema includes the location-specific Q&A
- Canonical tag present and points to the location page URL
- Sitemap.xml includes all active [type]/[city] combinations
- Admin Site Settings: enable/disable locations via checklist
- Enabling "Queens" in admin → /insurance/auto/queens renders after revalidation
- Lighthouse ≥ 90 on `/insurance/auto/brooklyn` (location pages must be fast)

---

## Prompt 3C — Service Area Hub Page

**Goal:** Build `/locations` — the service area index page. This provides internal linking to all location pages, helps users find their city, and gives Google a crawlable entry point to all programmatic pages.

```
You are building BAAM System I — Insurance Brokerage Platform.

File: app/[locale]/locations/page.tsx
Reads from: site.json.activeLocationSlugs + lib/insurance/locations.ts + content_entries 'pages/locations.json'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE LAYOUT — 4 sections
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — LocationsHero
  Heading: "We Serve [City/Metro] and Surrounding Areas" (from locations.json)
    Default: "We Serve New York City and Surrounding Areas"
  Subline: "Licensed insurance broker serving [list of cities] — free quotes for auto, home, business, and more."
  Background: navy gradient
  CTA: "Get a Free Quote" → /quote

SECTION 2 — ServiceAreaMap (optional — show if site.json.serviceAreaMapEnabled = true)
  NEW component: components/location/ServiceAreaMap.tsx

  A static SVG or image-based map (NOT Google Maps — too slow):
  Option A: Simple SVG outline of the service states (NY, NJ, CT, PA)
    Colored regions for each active state. States not in activeLocationSlugs left grey.
    No interactivity required — purely decorative.

  Option B (simpler): A text-based "states served" display:
  "Licensed and Serving:"
  [NY — New York] [NJ — New Jersey] [CT — Connecticut] [PA — Pennsylvania]
  Large pill badges, one per licensed state, var(--color-brand-500) background.

  Read from: site.json.licenseNumbers (states array) for licensed states.
  Read from: site.json.activeLocationSlugs → derive unique states for "serving" list.

  Default to Option B — implement Option A only if explicitly requested.

SECTION 3 — LocationGrid
  Heading: "Browse Insurance by Your City"
  Sub-heading: "Click your city to see [type] insurance options and get a quote"

  Group locations by state:
  NEW YORK:
  [Brooklyn] [Queens] [Flushing] [The Bronx] [Staten Island] [Manhattan] [Yonkers] [White Plains]

  NEW JERSEY:
  [Jersey City] [Newark] [Hoboken]

  CONNECTICUT:
  [Stamford] [Bridgeport]

  Each city shows as a link tile:
  ┌────────────────────┐
  │  Brooklyn, NY      │  ← city + state
  │  15 pages →        │  ← count of enabled insurance types for this city
  └────────────────────┘

  Clicking a city tile → does NOT go to /locations/[city]. Instead:
  Expand below the city (or navigate to) a list of insurance types available for that city:
  "Auto Insurance in Brooklyn →" | "Home Insurance in Brooklyn →" | etc.

  Implementation choice: accordion expand (no page load) OR navigate to /locations/[city]:
  Default: accordion expand on click — faster UX, no extra route needed.
  Admin controls via locations.json locationClickBehavior: 'expand' | 'city-page'

SECTION 4 — LocationsCTA (REUSE QuoteCTASection — 'cta-only')
  "Not sure if we serve your area? Call us."
  Phone + Quote CTA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: "Insurance Broker Serving [Metro Area] | [Brokerage Name]"
Description: "Independent insurance broker serving [city list]. Free auto, home, business & specialty insurance quotes in [states]. [Brokerage Name] — [phone]."

Add BreadcrumbList schema.org for internal linking signals.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERNAL LINKING — CRITICAL FOR SEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add links to /locations from:
1. Footer — add "Service Areas" link in Company column
2. About page — add "Serving [city list]" in OurStory section, link to /locations
3. Contact page — ServiceAreaNote section: link "see all areas →" → /locations
4. Every /insurance/[slug] base page — add to RelatedServicesSection bottom:
   "Also serving: [Brooklyn] [Queens] [Flushing] [+X more →]" links row

These internal links are how Googlebot discovers and values the location pages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Editor for pages/locations.json:
- Hero heading, subline, CTA
- Service area map: enabled toggle, option variant
- Location grid: heading, sub-heading
- Click behavior: expand | city-page
- CTA section: heading, subline
```

**Done-Gate 3C:**
- `/locations` renders with all active cities grouped by state
- Clicking "Brooklyn" expands list of insurance type links for Brooklyn
- Each link goes to the correct /insurance/[slug]/brooklyn URL
- Footer has "Service Areas" link pointing to /locations
- Every /insurance/[slug] base page has city links at the bottom
- SEO: title includes metro area name
- BreadcrumbList schema.org in page source

---

## Prompt 3D — Admin Hardening

**Goal:** Harden the admin experience for real brokerage use. Email notification system for new leads, site onboarding wizard for adding new brokerage clients, and complete Insurance Lines + Carriers admin modules. After this prompt, a new brokerage site can be fully configured without developer involvement.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md Backend Admin Function Checklist

This prompt covers 4 independent sub-tasks. Do them in order.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUB-TASK 1 — Email Notification System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Phase 2A quote form API already has a stub for email notification.
This sub-task fully implements it.

File: lib/notifications/quoteNotification.ts (NEW)

Email is sent when:
a) A new quote_request is created (from /quote, home CTA, contact form, service pages)
b) Status changes to 'bound' (optional — celebrate a win)

Email provider: use existing email utility from the medical codebase.
If the medical codebase uses Resend: use Resend.
If it uses Nodemailer/SendGrid: use the same.
DO NOT introduce a new email provider.

Notification email content (new quote):
  Subject: "New Quote Request — [coverage types] — [firstName] [lastName]"
  To: site.json.notificationEmail (comma-separated list supported)
  From: site.json.notificationFromEmail (or platform default if not set)

  Body (HTML email):
  ┌──────────────────────────────────────────────────────┐
  │ 🔔 New Quote Request                                  │
  │ [Brokerage Name]                                      │
  ├──────────────────────────────────────────────────────┤
  │ Name:     [First Last]                                │
  │ Phone:    [phone] — tap to call                       │
  │ Email:    [email]                                     │
  │ Coverage: Auto Insurance, TLC Insurance               │
  │ Contact:  Afternoons                                  │
  │ Language: Spanish                                     │
  │ Source:   Quote Page                                  │
  │ Submitted: Mar 14, 2026 at 2:34pm                     │
  ├──────────────────────────────────────────────────────┤
  │ Additional Details:                                   │
  │ Vehicle count: 2   Current insurer: Geico             │
  │ Message: "Need TLC renewal ASAP"                      │
  ├──────────────────────────────────────────────────────┤
  │ [View in Admin →]                                     │
  │ Direct link: https://admin.[domain]/admin/quote-requests/[id] │
  └──────────────────────────────────────────────────────┘

  Plain text fallback: all fields in plain text format (for email clients that block HTML).

Error handling:
  Email failure MUST NOT cause the quote API to fail.
  Wrap in try/catch — log error to console, proceed with 200 response.
  The lead is saved to DB regardless of email success.

Admin settings for notifications (admin/site-settings/ → "Notifications" section):
  - "New Quote Notification Email(s)" — text input, comma-separated
    → site.json.notificationEmail
  - "From Email Address" — text input (must be verified domain)
    → site.json.notificationFromEmail
  - "Send notification for:" — checkboxes:
    ☑ New quote request
    ☑ Quote status changed to "Bound"
    ☐ Quote status changed to "Quoted"
  - [Send Test Email] button → sends a test notification to the configured email(s)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUB-TASK 2 — Insurance Lines Admin Module
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/admin/(protected)/insurance-lines/page.tsx
(Verify this exists from Phase 0C. Build it now if it doesn't.)

Purpose: Let each brokerage site admin manage which insurance lines they offer and how they appear on the site.

Page layout:
  Heading: "Insurance Lines"
  Sub-heading: "Control which coverage types appear on your site. Enable, reorder, and customize each line."

  Toggle list (all 15 lines + 3 service lines = 18 items):
  Each row:
  ┌────────────────────────────────────────────────────┐
  │ ⠿ (drag) │ [ICON] Auto Insurance │ [●enabled] │ ★featured │ [Edit ▾] │
  └────────────────────────────────────────────────────┘

  "Edit" expands an inline form:
  - Custom Name Override (text — use if brokerage calls it something different)
  - Custom Description Override (textarea — overrides default tagline on InsuranceLineGrid)
  - Category (select: Personal | Commercial | Specialty | Services)
  - Icon (icon picker — from fixed set of 30 insurance icons)
  - CTA Label Override (text — "Get Auto Quote" vs "Get a Quote")

  Bulk actions at top:
  - "Enable All" / "Disable All" buttons
  - Filter by category: All | Personal | Commercial | Specialty | Services

  Save: changes save immediately on toggle (PATCH /api/admin/insurance-lines/[id]).
  Reorder: drag-to-reorder saves on drop.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUB-TASK 3 — Site Onboarding Wizard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/admin/onboarding/page.tsx (NEW — platform_super_admin only)

When a platform admin creates a new brokerage client, this wizard guides the setup.
After completing the wizard, the brokerage site is fully configured with no gaps.

5-step wizard:

STEP 1 — Brokerage Profile
  - Brokerage Name (text, required)
  - Primary Domain (text, e.g. "peerlessbrokerage.com")
  - Phone Number (tel, required — used everywhere on the site)
  - Email Address
  - Office Address (textarea)
  - Founded Year (number)
  - Tagline (text, optional)
  Preview panel on right: shows how the header will look as user types.

STEP 2 — Theme & Branding
  - Logo (image upload)
  - Primary Color (color picker, default: #0B1F3A navy)
  - Accent Color (color picker, default: #C9933A gold)
  - Heading Font (select: Playfair Display | Georgia | Merriweather | other)
  - Body Font (select: Inter | Open Sans | Lato | other)
  Preview panel: live theme preview showing header + button + card in chosen colors.

STEP 3 — License & Compliance
  - License Numbers (repeatable: state + number)
  - Licensed States (multi-select from US states)
  - Compliance Disclaimer (textarea — pre-filled with standard NY insurance disclaimer)
  - Notification Email (text — where new quote requests are sent)

STEP 4 — Insurance Lines
  - Toggle which of the 15 lines this brokerage offers (same as Insurance Lines admin — embedded here)
  - Default: all 15 enabled (uncheck what they don't offer)

STEP 5 — Review & Launch
  Summary of all configured values.
  Checklist of minimum requirements:
    ✅ Name and domain configured
    ✅ Phone number set
    ✅ At least 1 license number
    ✅ At least 5 insurance lines enabled
    ⚠ No notification email — leads will not be emailed (warning, not blocker)
    ⚠ No logo uploaded (warning, not blocker)

  "Create Site" button → creates:
  - sites record
  - site_domains record for primary domain
  - insurance_lines records (15 rows with enabled=true for selected lines)
  - content_entries for pages/home.json, pages/insurance.json, pages/quote.json, etc.
    (Uses template JSON from lib/templates/default-content.ts — a static file of default content structures)
  - Admin user account for the brokerage (email + temp password, forced change on first login)
  - Sends welcome email to brokerage admin with login credentials

On completion: redirect to /admin/sites/[newSiteId] — the new site's admin dashboard.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUB-TASK 4 — Admin Navigation + RBAC Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify the admin sidebar matches the spec from @INSURANCE_COMPLETE_PLAN.md:

SITE-LEVEL (visible to site_admin and editor):
  Dashboard | Content Editor | Blog Posts | Testimonials | Agents | Insurance Lines | Carriers | Quote Leads | Site Settings

SYSTEM-LEVEL (visible to platform_super_admin only):
  All Sites | Domains | Media Library | Admin Users | Onboarding Wizard | System Settings

Access control checks:
  - A site_admin for site A CANNOT access admin pages for site B
    Test: log in as site_admin, manually navigate to /admin/quote-requests for a different site → should get 403 or redirect
  - An editor CANNOT access Quote Leads, Agents, Insurance Lines, Carriers
    Test: log in as editor → these sidebar items should not be visible
  - platform_super_admin can see and access all sites and all modules

If any of these checks fail: fix the middleware/RBAC logic before proceeding.

Quote Leads sidebar badge:
  The "Quote Leads" sidebar item should show a red badge with count of 'new' status leads.
  Refreshes every 60 seconds using a simple setInterval in the admin layout component.
  Badge disappears when count = 0.
```

**Done-Gate 3D:**
- Submit quote from /quote → email received at notificationEmail within 60 seconds
- Email contains clickable phone + direct link to admin record
- Email failure does NOT break the quote form (test by using invalid email config temporarily)
- "Send Test Email" button in admin settings sends a test email
- Insurance Lines admin: disable "Boat Insurance" → boat tile disappears from InsuranceLineGrid on frontend
- Insurance Lines admin: drag-to-reorder → order reflected on /insurance page
- Custom description override → appears on InsuranceLineGrid tile
- Onboarding Wizard: complete all 5 steps → new site created in DB
- New site accessible at configured domain (or via site switcher in admin)
- site_admin for site A cannot access site B's quote requests → test verifies 403
- Editor role: Quote Leads + Agents + Carriers hidden from sidebar

---

## Prompt 3E — Google Reviews Integration

**Goal:** Display Google Reviews rating and recent reviews on the site, and implement a review collection workflow to grow review count over time.

```
You are building BAAM System I — Insurance Brokerage Platform.

This prompt has two parts:
A) Display layer — show Google rating on site from stored data
B) Review collection — prompt satisfied clients to leave a review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART A — Google Rating Display
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO NOT call the Google Places API in real-time — it's expensive and can be slow.
Store the rating and count manually in site.json and refresh it periodically.

Data already exists in site.json (from Phase 1A):
  site.json.googleReviewScore: number  (e.g. 4.9)
  site.json.googleReviewCount: number  (e.g. 127)
  site.json.googleReviewUrl: string    (link to Google Business profile)

Create a shared GoogleRatingBadge component:
File: components/ui/GoogleRatingBadge.tsx

Variants:
'inline' — small badge: ★ 4.9  (127 Google reviews)
  Used in: header top bar, agent cards
'card' — medium: Google logo + ★★★★★ + "4.9 / 5" + "127 reviews" + "Read reviews →"
  Used in: about page, testimonials page hero, quote page trust panel
'mini' — just: ★ 4.9 ★  (no text)
  Used in: footer

Props:
  score: number (from site.json)
  count: number
  url: string (links to Google)
  variant: 'inline' | 'card' | 'mini'

Star rendering:
  Filled star ★ for whole numbers.
  Half star ½ for x.5 scores.
  Use Unicode or SVG — NOT font icons.
  Color: var(--color-gold-500) — gold stars.

Usage placement:
  - Header top bar (inline variant) — if site.json.googleReviewScore > 0
  - Quote page trust panel (card variant) — already wired in Phase 2A
  - Testimonials page hero (card variant) — already wired in Phase 2D
  - About page (card variant) — LicensesCredentials section
  - Footer (mini variant) — brand column

Admin refresh path:
  Admin Site Settings → "Reviews" section:
  - Google Review Score: number input
  - Google Review Count: number input
  - Google Business Profile URL: text input
  - [Update from Google] button: (MVP — opens Google Business URL in new tab so admin can check and manually update)
  - Note: "Update these numbers whenever you refresh your Google Business listing"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART B — Review Collection Workflow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When a quote_request status is changed to 'bound' in the admin dashboard:
  Show a prompt in the detail drawer:
  ┌─────────────────────────────────────────────────────┐
  │ 🎉 Policy Bound! Ask for a review?                  │
  │ Send [Client Name] a review request email.          │
  │ [Send Review Request Email] button                  │
  └─────────────────────────────────────────────────────┘

  "Send Review Request Email" button:
  POST /api/admin/quote-requests/[id]/review-request
  Sends a simple email to the client:
    Subject: "Thank you for choosing [Brokerage Name] — we'd love your feedback"
    Body:
      "Hi [firstName],
      Thank you for trusting [Brokerage Name] for your [coverage type] insurance.
      If you have a moment, we'd truly appreciate a Google review — it only takes 30 seconds
      and helps other [city] residents find a trustworthy broker.
      [Leave a Google Review] button → site.json.googleReviewUrl
      Thank you,
      [Agent Name or Brokerage Name]"

  After sending: button changes to "✓ Review request sent on [date]"
  Store in DB: quote_requests.review_request_sent_at = now()
  Only one review request per quote_request (button hidden if already sent).

File: app/api/admin/quote-requests/[id]/review-request/route.ts (NEW)

Admin Testimonials importer:
  If a client leaves a Google review and you want to feature it on the site,
  add an "Import from Google" helper in admin/testimonials/:
  - Input: paste the Google review text + reviewer name
  - Auto-fills: quote, reviewer_name, star_rating (select), source='google'
  - Pre-fills coverage_type as 'general' (admin edits before saving)
  - Save: creates a new testimonial record

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin Site Settings → "Reviews" section (add to existing Site Settings):
  - Google Review Score (number, e.g. 4.9)
  - Google Review Count (number, e.g. 127)
  - Google Business Profile URL (text)
  - Review Request Email Template — editable textarea with placeholders:
    {firstName}, {coverageType}, {agentName}, {brokerageName}, {reviewUrl}
    Shows a preview below the textarea.
```

**Done-Gate 3E:**
- GoogleRatingBadge 'inline' visible in header top bar (if score > 0)
- GoogleRatingBadge 'card' visible in testimonials hero with star rendering
- Updating score in admin Site Settings → frontend reflects new score after reload
- Admin: change a quote status to 'bound' → review request prompt appears in drawer
- Clicking "Send Review Request Email" → email delivered to test address
- Button changes to "✓ sent" after clicking, cannot be clicked again
- Admin testimonials: "Import from Google" pre-fills quote fields correctly

---

## Prompt 3F — Performance Audit + Core Web Vitals

**Goal:** Achieve Lighthouse Performance ≥ 95 on home page and key service pages. Pass Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms). Fix all identified blockers. This is a prerequisite for launch.

```
You are building BAAM System I — Insurance Brokerage Platform.

This is a performance audit and fix session — not new feature work.
Run Lighthouse, identify all failing metrics, fix them in priority order.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Audit Run
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run Lighthouse audits on these 5 pages (mobile and desktop):
1. / (home page) — most critical
2. /insurance/auto (most visited service page)
3. /quote (conversion page — must be fast or users drop off)
4. /insurance/auto/brooklyn (location page — programmatic pages must be fast)
5. /admin/quote-requests (admin — less critical but note any major issues)

For each page record:
  Performance score, LCP, CLS, INP, TTFB
  Top 3 Lighthouse "Opportunities" items
  Top 3 Lighthouse "Diagnostics" items

Fix all items with Performance score < 90 before proceeding.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Common Insurance Site Performance Fixes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Apply ALL of the following regardless of audit results — these are universally needed:

1. HERO IMAGE OPTIMIZATION (LCP fix)
   The LCP element on all pages with heroes is the hero image.
   - Convert all hero images to WebP (if using Next.js Image — this is automatic)
   - Ensure hero images use <Image priority /> (not lazy loaded)
   - Add fetchpriority="high" attribute
   - Use sizes prop: sizes="(max-width: 768px) 100vw, 100vw"
   - Mobile hero image should be a DIFFERENT, smaller file (use imageMobile field from content JSON)
   - Target: LCP image should start loading within 500ms of navigation

2. CARRIER LOGO CAROUSEL OPTIMIZATION (CLS + LCP fix)
   The CarrierLogoCarousel loads multiple logos — if not properly sized, causes CLS.
   - Give each logo img a fixed height (48px) and fixed width container (120px)
   - Add aspect-ratio: 120/48 to container (prevents reflow)
   - Lazy load logos: add loading="lazy" (these are below the fold)
   - Use next/image with fixed width+height for each logo
   - The scroll animation: use CSS animation, NOT JavaScript scrollLeft manipulation

3. GOOGLE FONTS PRELOAD (render-blocking fix)
   Playfair Display and Inter are loaded via Google Fonts.
   - Use next/font/google (if not already) — this inlines critical font CSS
   - Add font-display: swap to prevent invisible text during font load
   - Preload only the weights actually used (700 for Playfair Display, 400+600 for Inter)

4. QUOTE FORM CODE SPLITTING (JS bundle fix)
   The quote form (QuoteForm.tsx) is a large client component.
   - Use dynamic import with ssr: false for QuoteForm
   - Add a skeleton/loading state shown while the form chunk loads
   - The /quote page should show the trust panel and heading immediately, form loads 200ms after

   File: app/[locale]/quote/page.tsx
   const QuoteForm = dynamic(() => import('@/components/quote/QuoteForm'), {
     ssr: false,
     loading: () => <QuoteFormSkeleton />
   });

   QuoteFormSkeleton: simple grey placeholder boxes matching the form layout.
   This prevents the "blank white area" flash on /quote.

5. INSURANCE LINE GRID DEFERRED LOADING (TTI fix)
   InsuranceLineGrid has 15 tiles — loads data from DB on the home page.
   - Ensure this data is fetched at page level (server component), NOT client-side
   - The grid should be part of the SSR render — no client fetch for the tile data
   - Tile hover effects: CSS-only (no JS event listeners needed)

6. ADMIN BUNDLE SEPARATION
   The admin bundle should NOT be included in any public-facing page.
   - Verify no admin components imported in app/[locale]/* routes
   - Verify next.config.js has no unexpected transpile rules pulling in admin code
   - Run: next build → check .next/analyze (if bundle analyzer is set up)

7. IMAGE LAZY LOADING AUDIT
   All images below the fold must have loading="lazy".
   All images above the fold (hero, agent photos on about page) must NOT have lazy loading.
   Check: carrier logos (below fold → lazy), agent photos (below fold → lazy), hero (above fold → priority).

8. META VIEWPORT AND MOBILE OPTIMIZATION
   Ensure: <meta name="viewport" content="width=device-width, initial-scale=1" /> in layout.tsx
   Ensure: no fixed-width elements wider than 375px in mobile view
   Check: MobileStickyPhoneBar safe-area-inset-bottom padding

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Core Web Vitals Pass Criteria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Must achieve on MOBILE Lighthouse for /  (home page):
  Performance: ≥ 90
  LCP: < 2.5s
  CLS: < 0.1
  INP: < 200ms
  FCP: < 1.8s
  TTFB: < 600ms (dependent on hosting — note if Vercel cold start is the cause)

Must achieve on MOBILE Lighthouse for /insurance/auto:
  Performance: ≥ 90

Must achieve on MOBILE Lighthouse for /quote:
  Performance: ≥ 88 (form-heavy pages are inherently heavier — 88 is acceptable)

Must achieve on DESKTOP Lighthouse for all pages:
  Performance: ≥ 95

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — SEO + Accessibility Final Pass
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

While Lighthouse is open, fix any failing SEO and Accessibility items:

SEO checklist (Lighthouse SEO score must be 100):
  ✓ All <img> have alt text — use carrier name for carrier logos, meaningful alts for photos
  ✓ All pages have <title> and <meta name="description">
  ✓ <html lang="en"> set in layout
  ✓ No broken links (run `next build` — TypeScript errors catch most)
  ✓ robots.txt accessible at /robots.txt
  ✓ sitemap.xml accessible at /sitemap.xml
  ✓ All links have descriptive text (no "click here")

Accessibility checklist (Lighthouse A11y score ≥ 90):
  ✓ All buttons have aria-label or visible text
  ✓ Form inputs have associated <label> elements
  ✓ Color contrast: navy on white ≥ 4.5:1, gold on navy ≥ 3:1 (large text)
  ✓ Interactive elements reachable by keyboard (Tab order)
  ✓ Quote form: error messages associated with inputs via aria-describedby
  ✓ AccordionFAQ: aria-expanded, aria-controls on each trigger
  ✓ CarrierLogoCarousel: aria-label="Carrier partners" on the scroll container, aria-hidden on decorative elements
  ✓ MobileStickyPhoneBar: buttons have aria-label="Call us" and aria-label="Get a free quote"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Performance Regression Guard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add a Lighthouse CI configuration to prevent future regressions:

File: .lighthouserc.json (project root):
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3007/",
        "http://localhost:3007/insurance/auto",
        "http://localhost:3007/quote"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.88}],
        "categories:seo": ["error", {"minScore": 1.0}],
        "categories:accessibility": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}

Add to package.json scripts:
  "lighthouse": "lhci autorun"

This runs Lighthouse CI in the same way Vercel would.
Developers run npm run lighthouse before PRs to catch regressions.
```

**Done-Gate 3F:**
- Mobile Lighthouse for `/` → Performance ≥ 90, LCP < 2.5s, CLS < 0.1
- Mobile Lighthouse for `/insurance/auto` → Performance ≥ 90
- Mobile Lighthouse for `/quote` → Performance ≥ 88
- Desktop Lighthouse for all 5 tested pages → Performance ≥ 95
- Lighthouse SEO score → 100 on all public pages
- Lighthouse Accessibility score → ≥ 90 on all public pages
- Hero image uses `<Image priority />` — no lazy on above-fold images
- CarrierLogoCarousel logos have fixed dimensions — no CLS
- QuoteForm uses dynamic import with loading skeleton
- GoogleFonts loaded via next/font (no render-blocking link tag)
- `npm run lighthouse` passes without errors
- .lighthouserc.json committed to project root

---

## Phase 3 Completion Gate

Before tagging `v0.3-phase3-complete` and moving to Phase 4, verify ALL of the following:

| Check | Page / Location | How to Verify |
|-------|----------------|---------------|
| Carrier grid loads from DB | `/carriers` | Add new carrier in admin → appears |
| Carrier type filter works | `/carriers` | Select "Auto" → only auto carriers shown |
| Individual carrier page renders | `/carriers/travelers` | 4-section layout visible |
| Carrier not in site_carriers → 404 | `/carriers/[any-unassigned]` | Expect 404 |
| Location page renders | `/insurance/auto/brooklyn` | Full 5 sections, city in headline |
| TLC location page has TLC note | `/insurance/tlc/brooklyn` | TLC-specific paragraph visible |
| Unknown city → 404 | `/insurance/auto/unknowncity` | Expect 404 |
| City not in activeLocationSlugs → 404 | `/insurance/auto/philadelphia` (if not active) | Expect 404 |
| Sitemap includes location pages | `/sitemap.xml` | Count entries — should include [type]/[city] combos |
| /locations page shows active cities | `/locations` | Click "Brooklyn" → insurance type links expand |
| Footer has "Service Areas" link | All pages | Check footer |
| Every service page has city links | `/insurance/auto` | Scroll to bottom |
| Email sent on new quote | `/quote` → submit | Check notificationEmail inbox |
| Email failure doesn't break form | Set invalid email in admin → submit | Form succeeds, error logged |
| Insurance Lines admin: disable line | Admin → disable "Boat" → check `/insurance` | Boat tile gone from grid |
| Onboarding wizard creates site | Admin → Onboarding → complete 5 steps | New site in sites table |
| site_admin isolation | Log in as site A admin → try site B → 403 | Access denied |
| Google rating badge in header | Any page (if score > 0) | "★ 4.9" visible in top bar |
| Bound status → review request prompt | Admin → set status to Bound | Prompt appears in drawer |
| Review request email delivered | Click "Send Review Request" | Email in client inbox |
| Mobile Lighthouse home ≥ 90 | `/` | Chrome DevTools → Lighthouse → Mobile |
| Mobile LCP < 2.5s | `/` | Lighthouse LCP metric |
| CLS < 0.1 | `/` | Lighthouse CLS metric |
| Lighthouse SEO = 100 | `/`, `/insurance/auto` | Lighthouse SEO tab |
| Lighthouse A11y ≥ 90 | `/`, `/quote` | Lighthouse Accessibility tab |
| `.lighthouserc.json` in repo | Project root | `ls .lighthouserc.json` |

---

## Phase 3 → Phase 4 Handoff

After Phase 3 is clean:

**What Phase 4 will build:**
- Full content population for the first real brokerage client (Peerless Brokerage demo → replace with real content)
- Real agent photos + bios loaded
- Real carrier logos uploaded and assigned
- Real testimonials imported (from Google + direct collection)
- Final QA pass — cross-browser testing (Chrome, Safari, Firefox, iOS Safari, Android Chrome)
- Staging → Production deployment to Vercel
- Domain configuration + SSL verification
- Google Search Console submission + initial indexing check
- Tag `v0.4-phase4-ready` when done

**What should exist after Phase 3:**
- Full platform: 20+ pages, quote pipeline, admin lead management, email notifications
- 50+ programmatic location pages live
- Carrier partners section fully built
- Core Web Vitals passing on all key pages
- New brokerage sites can be created via onboarding wizard with no developer intervention
- Platform ready for first client launch
