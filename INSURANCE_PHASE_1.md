# BAAM System I — Insurance Brokerage Platform
# Phase 1: Core Pages — Build / Wire / Verify

> **System:** BAAM System I — Insurance Brokerage Platform
> **Reference files:** `@INSURANCE_COMPLETE_PLAN.md` + `@INSURANCE_PHASE_0.md`
> **Prototype files:** `prototypes/home.html` · `prototypes/service-auto.html` · `prototypes/about.html` · `prototypes/contact.html` · `prototypes/theme.css`
> **Prerequisite:** Phase 0 gate fully passed. All DB tables exist. All content contracts defined. Demo seed data in DB. **All prototypes approved (A-Gate-8 passed).** `v0.0-phase0-complete` tagged.
> **Method:** One Cursor prompt per session. BUILD → WIRE → VERIFY every page before moving on.
> **Rule:** A page is only "done" when all three steps pass AND layout matches `prototypes/[page].html`. Never skip a done-gate.

---

## Phase 1 Overview

**Duration:** Week 1–2
**Goal:** Build all core Tier 1 pages for Peerless Brokerage — every page a prospect will visit before calling. Every page must render from Supabase DB, be fully editable in admin, and drive quote conversions.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|--------|-------|-----------|
| 1A | Header + Footer + MobileStickyPhoneBar | Insurance-extended shared layout | 90 min |
| 1B | Home Page — All 10 Sections | Visual language, trust signals, conversion | 150 min |
| 1C | Insurance Lines Hub `/insurance` | Master services overview page | 90 min |
| 1D | Service Page Template + 3 Featured Pages | `/insurance/auto`, `/insurance/tlc`, `/insurance/homeowner` | 120 min |
| 1E | About Page | Trust: story, credentials, licenses, agents | 60 min |
| 1F | Contact Page | Office info, form, map | 45 min |
| 1G | SEO Baseline Pass | title, meta description, OG per page | 30 min |

---

## Build → Wire → Verify Checklist (Every Page)

| Check | How to Verify |
|---|---|
| **Renders from DB** | Change field in Supabase directly → reload page → change appears |
| **Form edit** | Admin → Content Editor → edit field → Save → frontend shows change |
| **JSON edit** | Admin → JSON tab → edit value → Save → Form tab reflects change |
| **Variant switch** | Admin → change section variant → Save → layout changes on frontend |
| **Theme compliance** | `grep -r "color:" app/components/` — no hex values in new insurance components |
| **Mobile** | 375px — no overflow, nav collapses, phone number click-to-call works |
| **Quote CTA reachable** | Every page has at least one path to `/quote` |
| **Phone visible** | Phone number visible on every page on mobile without scrolling |
| **No hardcoded strings** | All text comes from DB content_entries or site.json |

---

## Prompt 1A — Header + Footer + MobileStickyPhoneBar

**Goal:** Extend the Meridian header/footer from the forked codebase with insurance-specific features: license number display, sticky mobile phone bar, carrier count in nav, multi-language badge, compliance footer.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A4 Component Inventory

The forked codebase already has RestaurantHeader, RestaurantFooter, and StickyBookingBar.
RENAME and EXTEND them for insurance — DO NOT rebuild from scratch.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 0 — Rename for insurance context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rename (or alias) these components:
- RestaurantHeader.tsx → InsuranceHeader.tsx (or update in place)
- RestaurantFooter.tsx → InsuranceFooter.tsx
- StickyBookingBar.tsx → MobileStickyPhoneBar.tsx

Update all imports across the codebase after renaming.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXTENSION 1 — InsuranceHeader.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/layout/InsuranceHeader.tsx (existing — extend)

Insurance-specific additions:

1. TOP BAR (if header.top_bar enabled in site.json)
   Show a slim top bar above the main nav with:
   - Left: License number pill — "NY Lic. #XXXXXXXX" | "Licensed in NY · NJ · CT · PA"
     Read from: site.json → licenseNumbers (array of { state, number })
     Display format: "Licensed in [state list]" — clicking expands to show individual license numbers
   - Right: Phone number (click-to-call) + hours summary "Mon–Sat 9am–6pm"
   - Background: var(--color-brand-700) (dark navy) — distinguishes from main nav
   - Text: white/80%, small (12px)

2. MAIN NAV
   Primary navigation items (read from navigation.json):
   - Home | Insurance | Quote | About | Contact
   - "Get a Free Quote" CTA button — uses var(--color-gold-500) background, white text
   - On scroll (>80px): nav shrinks slightly (py-4 → py-2), adds drop shadow
   - Active page: underline using var(--color-brand-500)

3. CARRIER COUNT BADGE (optional, variant-controlled)
   In the top bar or nav, show a small trust signal:
   "Access to 30+ Carriers"
   Read from: site.json → carrierCount (number)
   Only show if carrierCount > 0
   Style: Small badge, var(--color-gold-500) text on transparent background

4. LANGUAGE BADGE
   If site.json → languagesServed is non-empty, show a languages pill in top bar:
   "English · Spanish · 中文" (or whatever languages are configured)
   Read from: site.json → languagesServed (array of strings)
   Style: Same top bar, left side after license numbers

5. MOBILE NAV
   On mobile (< 768px):
   - Hamburger menu → full-screen slide-in panel
   - Show phone number prominently at top of mobile menu
   - "Get a Free Quote" button full-width at bottom of mobile menu
   - Language badge below quote button if languagesServed non-empty
   - Hide top bar on mobile (handled by MobileStickyPhoneBar instead)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXTENSION 2 — InsuranceFooter.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/layout/InsuranceFooter.tsx (existing — extend)

4-column footer layout:

COLUMN 1 — Brand
  - Logo + brokerage name
  - Short tagline (site.json → footerTagline)
  - Founded year: "Serving [city] since [year]"
  - Google review stars + count (if site.json → googleReviewUrl non-empty)
    Display as: ★★★★★ 4.9 (127 reviews) — link to Google

COLUMN 2 — Insurance Lines
  - Heading: "Our Services"
  - Links to top 8 insurance pages (read from navigation.json → footer_services)
  - "View All Coverage Types →" link at bottom → /insurance

COLUMN 3 — Contact
  - Heading: "Contact Us"
  - Phone (click-to-call) with phone icon
  - Email with mail icon
  - Office address (formatted, links to Google Maps)
  - Business hours (Mon–Fri, Sat)
  - Languages spoken pill

COLUMN 4 — Company
  - Heading: "Company"
  - Links: About | Agents | Carriers | Blog/Resources | FAQ | Contact
  - "Get a Free Quote" button (gold, full-width)

FOOTER BOTTOM BAR (compliance — REQUIRED for insurance sites):
  - Copyright © [year] [Brokerage Name]. All rights reserved.
  - License display: "Licensed Insurance Broker | [State] Lic. #XXXXXXXX" (read from site.json licenseNumbers)
  - "Insurance products and services are subject to state availability and individual circumstances."
  - Links: Privacy Policy | Terms of Service | Disclaimer
  - Read from: site.json → complianceDisclaimer (text) — if non-empty, show after standard text
  - Font: 11px, var(--color-text-muted) — legally required, must be readable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXTENSION 3 — MobileStickyPhoneBar.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/layout/MobileStickyPhoneBar.tsx (replaces StickyBookingBar)

Visible ONLY on mobile (< 768px). Fixed at bottom of screen. Always on top (z-50).

Layout — two equal-width buttons side by side:
  [ 📞 Call Us Now ]   [ Get a Free Quote → ]

Left button:
  - Icon: phone (SVG or emoji)
  - Label: "Call Us Now" (read from site.json → stickyBar.callLabel, default "Call Us Now")
  - Action: tel:[site.json phone]
  - Background: var(--color-brand-500) (navy)
  - Text: white

Right button:
  - Icon: document/form SVG
  - Label: "Get a Free Quote" (read from site.json → stickyBar.quoteLabel)
  - Action: navigate to /quote
  - Background: var(--color-gold-500)
  - Text: white (or dark if gold is light)

Both buttons: equal width (50%), height 56px, touch-friendly.
Safe area inset: add padding-bottom: env(safe-area-inset-bottom) for iOS home bar.
Background: white (not transparent) to avoid content bleed-through.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin Site Settings (existing), add these fields:

License & Compliance:
- "License Numbers" — repeatable row: { state (text), number (text) }
  → site.json.licenseNumbers
- "Licensed States (display)" — text input, e.g. "NY, NJ, CT, PA"
  → site.json.licensedStates
- "Compliance Disclaimer" — textarea (shown in footer bottom bar)
  → site.json.complianceDisclaimer

Trust & Social:
- "Carrier Count" — number input → site.json.carrierCount
- "Google Review URL" — text input → site.json.googleReviewUrl
- "Google Review Score" — number input (4.9) → site.json.googleReviewScore
- "Google Review Count" — number input (127) → site.json.googleReviewCount

Contact & Hours:
- "Business Hours" — repeatable: { day, openTime, closeTime }
  → site.json.businessHours
- "Languages Served" — comma-separated or tag input
  → site.json.languagesServed

Mobile Bar:
- "Sticky Bar — Call Label" → site.json.stickyBar.callLabel
- "Sticky Bar — Quote Label" → site.json.stickyBar.quoteLabel
```

**Done-Gate 1A:**
- Top bar shows license numbers and phone on desktop
- Carrier count badge "30+ Carriers" visible in top bar
- Languages pill shows configured languages
- Footer has 4 columns — last column has gold "Get a Free Quote" button
- Footer bottom bar shows license number and compliance disclaimer
- On mobile (375px): top bar hidden, MobileStickyPhoneBar visible at bottom
- Sticky bar: left = call (navy), right = quote (gold)
- iOS safe area inset respected on sticky bar
- All new site.json fields editable in admin Site Settings

---

## Prompt 1B — Home Page: All 10 Sections

**Goal:** Build the complete insurance brokerage home page with all sections from the A3.2 section stack. Every section renders from DB, is admin-editable, and drives quote conversions.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A3.2 Home Page Section Stack

Build the home page at app/[locale]/page.tsx.
Reads from content_entries path: 'pages/home.json' + site.json.
All content: DB-first. No hardcoded strings. No hardcoded colors.

The section stack (in order):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — HeroSection (REUSE existing, extend for insurance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend existing HeroSection. No rebuild.

Insurance hero requires a stats bar below the headline — NOT found in the medical hero.

Add InsuranceHeroStats sub-component:
File: components/sections/hero/InsuranceHeroStats.tsx

  4 stats displayed horizontally (2×2 on mobile):
  Each stat: { value: string, label: string }
  e.g.: "25+ Years" | "30+ Carriers" | "5,000+ Clients" | "10,000+ Policies"

  Read from: home.json hero.stats (array of { value, label })
  Style:
  - Background: white/10% backdrop-blur pill strip below headline
  - Value: var(--font-display), 1.5rem, var(--color-gold-400) or white
  - Label: 0.75rem, white/70%
  - Dividers between stats: white/20% vertical line

Add TrustBadge sub-component:
  A small badge below the CTAs: "Licensed · Independent · Local"
  Read from: home.json hero.trustBadge (string)
  Style: Small pill, outline style, white border, white text

Home.json data shape for hero:
{
  "_type": "hero",
  "_variant": "fullscreen",
  "image": "/uploads/peerless/hero/team-photo.jpg",
  "imageMobile": "/uploads/peerless/hero/team-photo-mobile.jpg",
  "headline": "Your Trusted Local Insurance Broker",
  "subline": "Fast quotes from 30+ carriers. Personal. Business. Specialty.",
  "stats": [
    { "value": "25+", "label": "Years in Business" },
    { "value": "30+", "label": "Carrier Partners" },
    { "value": "5,000+", "label": "Clients Served" },
    { "value": "10,000+", "label": "Policies Written" }
  ],
  "ctaPrimary": { "label": "Get a Free Quote", "href": "/quote" },
  "ctaSecondary": { "label": "Call Us Now", "href": "tel:[phone]" },
  "trustBadge": "Licensed · Independent · Local",
  "overlayEnabled": true
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — InsuranceLineGrid (NEW component)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/InsuranceLineGrid.tsx

NEW component. This is the core insurance-specific component.

Purpose: Show all 15 insurance types in a scannable grid.
The visitor must be able to find their coverage type within 5 seconds.

Layout:
- Desktop: 5 columns × 3 rows = 15 tiles
- Tablet: 3 columns
- Mobile: 2 columns

Each InsuranceLineTile:
┌────────────────────┐
│  [ICON 40×40px]    │
│  Auto Insurance    │  ← title: var(--font-heading), 0.9rem
│  Compare rates     │  ← tagline: 0.75rem, var(--color-text-muted)
│  from 20+ carriers │
│                    │
│  [Learn More →]    │  ← link to /insurance/[slug]
└────────────────────┘

- Featured tiles (featured=true in insurance_lines table): slightly larger, gold border
  Highlight 3 featured: auto, homeowner, business
- On hover: tile border changes to var(--color-brand-500), icon color shifts to gold
- Active tile (current page): filled navy background

Data source: insurance_lines table — all enabled lines
Fields needed: { id, name, slug, icon, tagline, featured, display_order }

Section data in home.json:
{
  "_type": "insurance_line_grid",
  "_variant": "grid",
  "heading": "We Cover Everything",
  "subheading": "From personal to commercial — one broker for all your coverage needs",
  "showAll": true,
  "featuredFirst": true
}

Admin can reorder lines in admin/insurance-lines/ (uses existing drag-to-reorder pattern).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — WhyIndependentSection (NEW component)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/WhyIndependentSection.tsx

NEW component. Two variants: 'columns' (3-column explainer) and 'comparison' (table).

VARIANT 'columns' (default):
  - Heading: "Why Choose an Independent Broker?"
  - 3 reason cards, each: { icon, headline, body }

Default content in home.json:
{
  "_type": "why_independent",
  "_variant": "columns",
  "heading": "Why Choose an Independent Broker?",
  "subheading": "We work for you — not the insurance company",
  "reasons": [
    {
      "icon": "store",
      "headline": "We Shop 30+ Carriers",
      "body": "We compare rates from every major carrier to find your best deal — not just the one that pays us the most commission."
    },
    {
      "icon": "handshake",
      "headline": "We Work For You",
      "body": "Captive agents can only offer one company's policies. We represent you, advocate for your claim, and advise without bias."
    },
    {
      "icon": "stack",
      "headline": "One Broker for Everything",
      "body": "Auto, home, business, life — bundle all your coverage with one trusted broker. Fewer headaches, often better rates."
    }
  ],
  "cta": { "label": "See How Much You Could Save →", "href": "/quote" }
}

VARIANT 'comparison':
  A simple 2-column table: "Independent Broker" vs "Captive Agent"
  Rows: Number of carriers | Who they work for | Can bundle across types | Rate shopping
  Used as an alternative to columns for sites wanting a more analytical tone.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — StatsStrip (REUSE existing — adapt)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reuse existing StatsStrip/AnimatedCounters component from medical.

Data source: home.json stats section OR site.json globalStats
Use same animated counter logic (IntersectionObserver trigger).

Background: var(--color-brand-800) — dark navy, full-width section.
Text: white stats value, white/70% label.

home.json data shape:
{
  "_type": "stats_strip",
  "_variant": "dark",
  "stats": [
    { "value": 25, "suffix": "+", "label": "Years in Business" },
    { "value": 30, "suffix": "+", "label": "Carrier Partners" },
    { "value": 5000, "suffix": "+", "label": "Clients Served" },
    { "value": 10000, "suffix": "+", "label": "Policies Written" }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 — CarrierLogoCarousel (NEW component)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/CarrierLogoCarousel.tsx

NEW component. Auto-scrolling horizontal logo strip.

Behavior:
- Infinite scroll loop (CSS animation, no JS library needed)
- Logos scroll left continuously at a slow pace (40s per cycle)
- On hover: pause animation
- Mobile: same scroll, touch-friendly

Data source: carriers table — all carriers with logo_url, WHERE show_on_home = true (or show_on_carousel = true)
Falls back to all enabled carriers if no flag.

Logo display:
- Each logo: max-height 48px, max-width 120px
- Grayscale by default (filter: grayscale(100%) opacity(0.6))
- On hover: full color (filter: none, opacity: 1), 200ms transition
- White background (avoid logo clash issues)

Section data in home.json:
{
  "_type": "carrier_carousel",
  "_variant": "scroll",
  "heading": "Carriers We Work With",
  "subheading": "We shop them all to get you the best rate",
  "logoCount": 16
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 — HowItWorksSection (REUSE existing — adapt)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reuse existing HowItWorks/ProcessSteps component.

3-step process. Steps read from home.json:
{
  "_type": "how_it_works",
  "_variant": "steps",
  "heading": "How It Works — 3 Simple Steps",
  "steps": [
    {
      "number": "01",
      "headline": "Tell Us What You Need",
      "body": "Fill out our 2-minute form or call us. Tell us what coverage you're looking for.",
      "time": "2 minutes"
    },
    {
      "number": "02",
      "headline": "We Shop 30+ Carriers",
      "body": "Our brokers compare rates from every relevant carrier and prepare your quote comparison.",
      "time": "Same day"
    },
    {
      "number": "03",
      "headline": "You Pick the Best Rate",
      "body": "Review your options. We explain the differences. You make the final call — no pressure.",
      "time": "You decide"
    }
  ],
  "cta": { "label": "Start My Quote", "href": "/quote" }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7 — TestimonialsSection (REUSE existing — minor adapt)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reuse existing TestimonialsSection. No major changes needed.

Show 3 featured testimonials from DB (featured=true).
Each testimonial card: { quote, name, coverage_type, star_rating }
- Show "coverage_type" as a badge below the name (e.g., "Auto Insurance · TLC Insurance")
- Star rating: ★★★★★ in var(--color-gold-500)
- Link below section: "See all our reviews →" → /testimonials

home.json data shape:
{
  "_type": "testimonials",
  "_variant": "cards",
  "heading": "What Our Clients Say",
  "subheading": "5,000+ clients served — see why they choose Peerless",
  "count": 3,
  "filterFeatured": true,
  "reviewLink": { "label": "See all reviews →", "href": "/testimonials" }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8 — AgentSpotlightSection (REUSE TeamSection — minor adapt)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reuse existing TeamSection component, add insurance-specific agent data fields.

Show 2–3 agents from agents table (WHERE show_on_home = true OR spotlight = true).
Each agent card: photo, name, title, specialties (array), years_experience, direct phone.
- "Direct Quote" button on each card: links to /quote?agent=[id]
- Languages spoken as small pills below specialties

home.json data shape:
{
  "_type": "agent_spotlight",
  "_variant": "cards",
  "heading": "Meet Your Insurance Experts",
  "subheading": "Real people. Real expertise. No bots.",
  "agentCount": 3,
  "showDirectContact": true,
  "cta": { "label": "View All Our Agents →", "href": "/agents" }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9 — BlogPreviewSection (REUSE existing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Shows 3 latest published blog posts. Reuse existing component — no changes needed.
Section heading: "From Our Resource Center"
Link: "View All Resources →" → /resources

home.json:
{
  "_type": "blog_preview",
  "_variant": "cards",
  "heading": "From Our Resource Center",
  "count": 3,
  "cta": { "label": "View All Resources →", "href": "/resources" }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10 — QuoteCTASection (NEW component)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/QuoteCTASection.tsx

NEW component. Full-width conversion band at the bottom of home page (and reusable on every page).

Two variants:
VARIANT 'form-inline' (home page default):
  - Left: headline + subline
  - Right: mini quote form — Name (text), Phone (tel), Coverage Type (dropdown from insurance_lines), Submit button
  - Form submits to /api/quote/request (creates quote_request record in DB)
  - Below form: "Or call us: [phone]" + "We respond within 2 business hours"
  - Background: var(--color-brand-800) — dark navy, white text

VARIANT 'cta-only' (reusable on interior pages):
  - Centered headline + subline
  - Two buttons: "Get a Free Quote" (gold) + "Call [phone]" (outline white)
  - Background: var(--color-brand-700) navy

Inline form fields:
- Name: text input, placeholder "Your name"
- Phone: tel input, placeholder "Your phone number", required
- Coverage Type: select, options from insurance_lines (all enabled lines)
- Submit: "Get My Free Quote" button

On submit:
- POST to /api/quote/request with { name, phone, coverage_type, source: 'home_cta' }
- Success: Show "✓ Request received! We'll call you within 2 business hours." in place of form
- Error: Show "Something went wrong — please call us at [phone]" + phone link

home.json:
{
  "_type": "quote_cta",
  "_variant": "form-inline",
  "heading": "Ready to Save on Insurance?",
  "subline": "Takes 2 minutes. No obligation. We shop 30+ carriers for you.",
  "responsePromise": "We respond within 2 business hours",
  "submitLabel": "Get My Free Quote"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING — Home Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin Content Editor for pages/home.json, ensure Form mode has:

Hero section:
- Headline (text input)
- Subline (text input)
- Stats: repeatable row — { value (text), label (text) }
- CTA Primary: label + href
- CTA Secondary: label + href
- Trust Badge text
- Hero image picker (desktop + mobile)
- Overlay toggle checkbox

InsuranceLineGrid:
- Heading, subheading
- ShowAll toggle
- FeaturedFirst toggle

WhyIndependent:
- Heading, subheading
- Reasons: repeatable — { icon, headline, body }
- CTA label + href

StatsStrip:
- Stats: repeatable — { value (number), suffix (text), label (text) }
- Background variant: dark | light

CarrierCarousel:
- Heading, subheading
- Carrier list managed separately in admin/carriers/

HowItWorks:
- Heading
- Steps: repeatable — { number, headline, body, time }
- CTA label + href

Testimonials:
- Heading, subheading
- Count (number input)
- Review link label + href

AgentSpotlight:
- Heading, subheading
- Agent count
- Show direct contact toggle
- CTA label + href

BlogPreview:
- Heading
- Count
- CTA label + href

QuoteCTA:
- Heading
- Subline
- Response promise text
- Submit button label
- Variant selector: form-inline | cta-only
```

**Done-Gate 1B:**
- All 10 sections render on home page from DB content
- Hero shows animated stats bar with 4 numbers
- InsuranceLineGrid shows all 15 tiles — 3 featured with gold border
- CarrierLogoCarousel auto-scrolls, logos show grayscale/color on hover
- QuoteCTASection mini form submits and creates a quote_request record
- Testimonials show coverage_type badge and star rating in gold
- AgentSpotlight shows agent photo, specialties, direct quote link
- Mobile (375px): all sections stack correctly, no overflow
- All sections editable in admin Form mode and JSON mode
- Lighthouse performance ≥ 90

---

## Prompt 1C — Insurance Lines Hub Page `/insurance`

**Goal:** Build the master insurance services overview page. Every visitor searching for any type of insurance should find their coverage type here and navigate to the right service page.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A3.2 Insurance Lines Hub

File: app/[locale]/insurance/page.tsx
Reads from: content_entries 'pages/insurance.json' + insurance_lines table

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — PageHero
  Reuse existing PageHero component.
  - Headline: "All Insurance Services" (read from insurance.json)
  - Subline: "Personal · Commercial · Specialty — One independent broker for everything"
  - CTA: "Get a Free Quote" → /quote
  - Background: professional photo or var(--color-brand-700) navy gradient

SECTION 2 — InsuranceCategoryTabs
  NEW component: components/sections/InsuranceCategoryTabs.tsx

  Horizontal tab bar filtering the insurance grid:
  - Tabs: "All" | "Personal" | "Commercial" | "Specialty" | "Services"
  - Active tab: var(--color-brand-500) underline
  - Each tab click filters the grid below WITHOUT page reload (client-side state)
  - Categories map to: insurance_lines.category field
  - Mobile: horizontally scrollable tab row

SECTION 3 — InsuranceLineGrid (REUSE component from 1B)
  Same InsuranceLineGrid component as home page.
  Differences for hub page:
  - Show ALL lines (not just featured)
  - Larger tiles: 4 columns desktop (vs 5 on home)
  - Each tile shows a longer tagline (2 lines instead of 1)
  - "Get a Quote" secondary link on each tile in addition to "Learn More"
  - Respects the category filter from InsuranceCategoryTabs

Extended tile data shape for hub page:
{
  "_type": "insurance_line_grid",
  "_variant": "hub",
  "heading": "All Coverage Types",
  "filterEnabled": true
}

SECTION 4 — WhyUsStrip (REUSE WhyIndependentSection)
  Compact 3-column version.
  Variant: 'columns' with condensed text.

SECTION 5 — QuoteCTASection (REUSE — variant 'cta-only')
  Centered headline + quote + call buttons.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Editor for pages/insurance.json:
- Hero: headline, subline, CTA, image picker
- Grid: heading text
- QuoteCTA: heading, subline, variant

Insurance Lines are managed in admin/insurance-lines/:
- Display order (drag to reorder)
- Category assignment
- Enable/disable toggle
- Icon selection
- Featured toggle
```

**Done-Gate 1C:**
- `/insurance` renders all 15 lines from DB
- Category tabs filter tiles in real-time without page reload
- "Personal" tab shows 5 tiles, "Commercial" shows 5, etc.
- Each tile links to correct `/insurance/[slug]` page
- "Get a Quote" on each tile passes type param to /quote?type=[slug]
- Admin insurance-lines page shows reorder + category + enable controls
- Mobile: tabs scroll horizontally, grid shows 2 columns

---

## Prompt 1D — Service Page Template + 3 Featured Pages

**Goal:** Build the insurance service page template and wire it for `/insurance/auto`, `/insurance/tlc`, and `/insurance/homeowner`. This template becomes the blueprint for all 15 service pages.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A3.2 Service Page Template

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Dynamic Route
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/insurance/[slug]/page.tsx

This page is dynamic — one route handles all 15 insurance types.

Data loading:
1. Look up insurance_lines record WHERE slug = params.slug
2. Load content_entries WHERE path = 'pages/insurance/[slug].json'
3. If no content entry exists for this slug: fallback to a default template structure
   (so new service pages work immediately after adding to DB with zero content-entry work)
4. 404 if insurance_lines record not found or is disabled

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Service Page Section Stack
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9-section stack (all sections read from [slug].json):

SECTION 1 — ServiceHero
  NEW sub-variant of HeroSection: 'service'
  Layout: split — left text, right image (or full-bleed with overlay if no split image)

  Content:
  - Headline: "[Insurance Line Name] Insurance" (from insurance_lines.name)
  - Subline: service-specific value prop (from [slug].json hero.subline)
  - Stats bar: 2–3 stats relevant to this type (e.g., "Starting at $X/mo" | "Same-day quote")
    Read from: [slug].json hero.stats
  - CTA Primary: "Get a [Type] Quote" → /quote?type=[slug]
  - CTA Secondary: "Call for Instant Quote" → tel:[phone]

SECTION 2 — WhatItCoversSection
  NEW component: components/sections/WhatItCoversSection.tsx

  File: components/sections/WhatItCoversSection.tsx

  Two-column layout:
  Left: What's COVERED — list with green checkmarks
  Right: Common questions — "Who needs this?" / "Is it required by law?"

  Content from [slug].json whatItCovers:
  {
    "heading": "What Auto Insurance Covers",
    "coveredItems": [
      { "label": "Liability coverage", "description": "Pays others if you cause an accident" },
      { "label": "Collision coverage", "description": "Repairs your car after an accident" },
      ...
    ],
    "notCoveredItems": [
      { "label": "Intentional damage" },
      ...
    ],
    "whoNeedsIt": "Required for all registered vehicles in New York State.",
    "isRequired": true,
    "requiredNote": "NY law requires minimum liability coverage."
  }

  Visual treatment:
  - Covered items: ✓ in var(--color-brand-500) (navy) circle
  - Not covered: ✕ in grey circle
  - "Required by law" badge if isRequired = true: gold pill badge

SECTION 3 — WhyUsForThisSection
  Reuse WhyIndependentSection — VARIANT 'columns'.
  Text is service-specific. Read from [slug].json whyUs:
  {
    "heading": "Why Choose [Brokerage Name] for Auto Insurance?",
    "reasons": [
      { "icon": "compare", "headline": "20+ Auto Carriers", "body": "..." },
      { "icon": "speed", "headline": "Same-Day Quotes", "body": "..." },
      { "icon": "award", "headline": "TLC Specialist", "body": "..." }  (TLC only)
    ]
  }

  TLC-only extra callout:
  For /insurance/tlc, add a "TLC Specialist" badge block above the columns:
  A gold-bordered callout box:
  "⚡ TLC Deadline Pressure? We Specialize in Fast TLC Compliance Coverage.
   Same-day binding for TLC plate renewals. Speak to a TLC specialist now."
  Read from: [slug].json tlcSpecialist (boolean) — only render if true

SECTION 4 — RateFactorsSection
  NEW component: components/sections/RateFactorsSection.tsx

  Accordion-style expandable list of what affects your rate.
  Read from [slug].json rateFactors:
  {
    "heading": "What Affects Your [Type] Insurance Rate?",
    "factors": [
      { "factor": "Driving record", "impact": "Major impact — clean record saves 15–30%" },
      { "factor": "Vehicle age & type", "impact": "Newer/expensive cars cost more to insure" },
      ...
    ],
    "savingsTip": "Bundling auto + home can save up to 20% with most carriers."
  }

  Visual: simple card grid (2 columns desktop, 1 mobile)
  Each card: factor name (bold) + impact description
  Savings tip at bottom: gold-background callout block

SECTION 5 — QuoteProcessSection (REUSE HowItWorks — minor adapt)
  3-step process specific to getting a quote for this type.
  Read from [slug].json quoteProcess:
  {
    "heading": "How to Get Your [Type] Insurance Quote",
    "steps": [
      { "number": "01", "headline": "Tell us about your [vehicle/home/business]", "body": "..." },
      { "number": "02", "headline": "We compare [20+] carrier rates", "body": "..." },
      { "number": "03", "headline": "Bind your policy — same day", "body": "..." }
    ],
    "cta": { "label": "Start My [Type] Quote", "href": "/quote?type=[slug]" }
  }

SECTION 6 — ServiceTestimonialsSection (REUSE TestimonialsSection)
  Show testimonials filtered by coverage_type matching current slug.
  Fallback: show featured testimonials if no type-specific ones exist.
  Count: 2–3 cards.
  Read from testimonials table WHERE coverage_type = slug AND featured = true.

SECTION 7 — ServiceFAQSection (NEW component)
  File: components/sections/ServiceFAQSection.tsx

  Accordion FAQ — 5–8 questions.
  Read from [slug].json faq (array of { question, answer }).
  Accordion: clicking a question expands the answer (no page reload).
  Schema.org FAQPage structured data injected in <script type="application/ld+json">

SECTION 8 — RelatedServicesSection
  "Clients with [Type] insurance often also need..."
  3 related service tiles — link to their /insurance/[slug] pages.
  Read from [slug].json relatedServices (array of slugs).
  Component: small version of InsuranceLineTile.

SECTION 9 — ServiceQuoteCTA (REUSE QuoteCTASection — 'form-inline' variant)
  Same as home page bottom CTA but with type pre-selected in dropdown.
  Pass coverageType prop to pre-select the dropdown:
  <QuoteCTASection coverageType="auto" ... />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Wire 3 Featured Service Pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add content entries for these 3 pages to DB (already seeded in Phase 0E):
- content_entries path: 'pages/insurance/auto.json'
- content_entries path: 'pages/insurance/tlc.json'
- content_entries path: 'pages/insurance/homeowner.json'

Verify each file has all 9 sections populated.
The remaining 12 service pages will use the fallback template until their JSON is added.

TLC page special requirements:
- Hero: add urgency subline "TLC plate renewal deadline? We bind same-day."
- WhyUs: add TLC Specialist callout box (see SECTION 3 above)
- Add to FAQ: "How fast can you bind TLC insurance?" / "What documents do I need for TLC?"
- Add language note in hero: "We speak English, Spanish, and Chinese — no language barrier"
  Read from site.json languagesServed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Editor for pages/insurance/[slug].json (per service page):
- Hero: headline, subline, stats (repeatable), image, CTA labels
- WhatItCovers: heading, coveredItems (repeatable), notCoveredItems, whoNeedsIt, requiredNote
- WhyUs: heading, reasons (repeatable with icon picker)
- RateFactors: heading, factors (repeatable), savingsTip
- QuoteProcess: heading, steps (repeatable), CTA
- FAQ: questions array (repeatable — question + answer)
- RelatedServices: 3-item slug selector (dropdown from insurance_lines list)
- QuoteCTA: heading, subline
```

**Done-Gate 1D:**
- `/insurance/auto` renders all 9 sections from DB content
- `/insurance/tlc` renders with TLC Specialist callout box
- `/insurance/homeowner` renders with correct copy
- WhatItCoversSection shows green check / grey X items correctly
- ServiceFAQSection: clicking question expands/collapses answer
- FAQ page has FAQPage schema.org JSON-LD in source
- RelatedServices shows 3 tiles linking to other insurance pages
- QuoteCTASection has "Auto Insurance" pre-selected in coverage type dropdown
- `/insurance/unknown-slug` returns 404 page
- A 4th slug with no content_entry (e.g., /insurance/motorcycle) renders fallback template — no 500 error
- All 9 sections editable in admin for each of the 3 pages

---

## Prompt 1E — About Page

**Goal:** Build the About page — the trust-building deep dive that prospects visit before making contact.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A3.2 About Page

File: app/[locale]/about/page.tsx
Reads from: content_entries 'pages/about.json' + agents table + carriers table + site.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE LAYOUT — 8 sections
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — AboutHero
  Reuse PageHero component.
  - Headline: "About [Brokerage Name]"
  - Subline: tagline from about.json
  - Background: team photo or office photo
  - Two trust badges below headline (pill style):
    "Est. [year]" | "Licensed in NY · NJ · CT · PA"

SECTION 2 — OurStorySection
  NEW simple section: components/sections/OurStorySection.tsx

  Two-column layout:
  - Left: photo (founder or office exterior)
  - Right: rich text story

  Read from about.json:
  {
    "story": {
      "heading": "Our Story",
      "foundedYear": 1999,
      "founderName": "John Smith",
      "body": "...(2-3 paragraphs of founding story and growth)...",
      "photo": "/uploads/peerless/about/founder-photo.jpg",
      "milestones": [
        { "year": 1999, "event": "Founded in Brooklyn, NY" },
        { "year": 2008, "event": "Expanded to NJ and CT" },
        { "year": 2015, "event": "Reached 2,000 active clients" },
        { "year": 2023, "event": "5,000+ clients served" }
      ]
    }
  }

  Milestones display: vertical timeline, left side, alternating dots.

SECTION 3 — OurMissionSection
  Clean centered section: icon + heading + body paragraph.
  Read from about.json mission.
  Background: var(--color-brand-50) — light navy tint.

SECTION 4 — LicensesCredentialsSection
  NEW component: components/sections/LicensesCredentialsSection.tsx

  CRITICAL for insurance sites — builds legal trust.

  Layout:
  - Heading: "Licenses & Credentials"
  - License table:
    | State | License Number | License Type | Status |
    | NY    | #LA-XXXXXXX    | Broker       | Active |
    | NJ    | #XXXXXXXX      | Broker       | Active |
    ...
    "Verify our license →" link next to each state (links to state DOI website)
    State DOI URLs from a static lookup: NY→ https://myportal.dfs.ny.gov, NJ→ https://sbs.nj.gov, etc.

  - Professional memberships: icon grid
    PIANY | IIABNY | BBB | NAIC (whichever are configured in about.json)

  - E&O statement: small callout box
    "We carry Errors & Omissions (E&O) insurance — protecting our clients and our professional standards."

  Read from about.json credentials + site.json licenseNumbers (already defined in 1A).

SECTION 5 — TeamSection (REUSE existing — adapt for agents)
  Show all agents from agents table (WHERE active = true) ordered by display_order.
  Each agent card:
  - Photo (100×100 round crop)
  - Name (bold)
  - Title (e.g., "Senior Broker")
  - Specialties: tags (e.g., "Auto · TLC · Commercial")
  - Languages: pills (e.g., "English · Spanish")
  - License number: small text "NY Lic. #XXXXX"
  - Years of experience: "12 years"
  - "Get a Quote with [Name]" button → /quote?agent=[id]

  Agents page CTA below: "View all agents →" → /agents

  about.json:
  {
    "_type": "team",
    "_variant": "cards",
    "heading": "Meet Our Team",
    "subheading": "Licensed professionals dedicated to finding you the best coverage",
    "agentCount": 6,
    "showLicenseNumbers": true,
    "cta": { "label": "View All Agents →", "href": "/agents" }
  }

SECTION 6 — CarrierPartnersSection
  "We Work With the Best Carriers"
  Reuse CarrierLogoCarousel (from 1B) — variant 'grid' (static grid, not scrolling).
  Show all carriers with logo_url.
  Subline: "We shop [count] carriers to find your best rate — not just the one that pays us the most."

  about.json:
  {
    "_type": "carrier_partners",
    "_variant": "grid",
    "heading": "Our Carrier Partners",
    "subheading": "..."
  }

SECTION 7 — CommunitySection (optional — show if about.json community.enabled = true)
  Simple text + optional image section.
  Heading: "Our Community"
  Body: paragraph about community involvement.
  Read from about.json community.

SECTION 8 — AboutCTASection (REUSE QuoteCTASection — 'cta-only' variant)
  "Ready to Work with a Broker Who Puts You First?"
  Buttons: "Get a Free Quote" + "Call Us: [phone]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Editor for pages/about.json:
- Story: heading, founderName, foundedYear, body (rich text), photo picker, milestones (repeatable)
- Mission: heading, body
- Credentials: memberships (repeatable — name + logo URL + link), E&O statement toggle
- Team: heading, count, showLicenseNumbers toggle
- Carriers: heading, subheading
- Community: enabled toggle, heading, body, photo picker
- CTA: heading, subline

Agents are managed in admin/agents/ (existing from Phase 0C).
```

**Done-Gate 1E:**
- `/about` renders all 8 sections from DB
- Milestones timeline shows 4+ dates with correct styling
- LicensesCredentials table shows each license with "Verify →" link
- Team section shows 3+ agents with license numbers and language pills
- Agent "Get a Quote" links go to /quote?agent=[id]
- CarrierPartners grid shows 10+ carrier logos
- CommunitySection hidden if community.enabled = false
- All sections editable in admin

---

## Prompt 1F — Contact Page

**Goal:** Build the Contact page — the final conversion touchpoint for prospects who need to reach the brokerage directly.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A3.2 Contact Page

File: app/[locale]/contact/page.tsx
Reads from: content_entries 'pages/contact.json' + site.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE LAYOUT — 5 sections
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — ContactHero
  Compact PageHero (no full-screen image — just headline + subline on navy background).
  - Headline: "Contact Us" (from contact.json)
  - Subline: "We're here to help — call, email, or stop by our office"

SECTION 2 — ContactInfoGrid
  NEW component: components/sections/ContactInfoGrid.tsx

  3-column grid (mobile: stacked):

  Column 1 — Call or Text:
  - Heading: "Call or Text"
  - Phone number (large, click-to-call link)
  - Subline: "Available Mon–Sat 9am–6pm"
  - "Prefer text? Text this number"
  - Languages spoken pills

  Column 2 — Visit Our Office:
  - Heading: "Our Office"
  - Full address (formatted for readability)
  - "Get Directions" link → Google Maps URL
  - Business hours table: Mon | 9am–6pm, Tue–Fri | 9am–6pm, Sat | 10am–4pm, Sun | Closed
    Read from: site.json businessHours
  - Parking note if configured: site.json parkingNote

  Column 3 — Email or Quote:
  - Heading: "Email or Quote"
  - Email address (mailto: link)
  - "Get a Free Quote" gold button → /quote
  - Response time note: "We respond to emails within 1 business day"

  Read from: contact.json + site.json (phone, address, hours, languages, email)

SECTION 3 — ContactFormSection
  NEW component: components/sections/ContactFormSection.tsx

  Full-width section, two-column layout:
  Left (60%): Contact form
  Right (40%): Summary of office info + hours (condensed repeat of column data)

  Form fields:
  - First Name (text, required)
  - Last Name (text, required)
  - Phone Number (tel, required)
  - Email Address (email, required)
  - Coverage Type of Interest (select — from insurance_lines)
  - Message / Question (textarea, optional)
  - Best Time to Contact (select: Morning / Afternoon / Evening / Anytime)
  - Language Preference (select: English / Spanish / 中文 / Other) — if languagesServed > 1
  - Submit: "Send My Message"

  On submit:
  - POST to /api/quote/request with source: 'contact_form'
  - Creates a quote_request record in DB (same table as QuoteCTASection)
  - Admin sees all requests in admin/quote-requests/ (Phase 2)
  - Success: "✓ Message sent! We'll get back to you within 1 business day."
  - Error: "Something went wrong — please call us directly at [phone]"

  Right panel:
  - "Office Hours" — formatted hours table
  - "We speak:" language pills
  - "Emergency contact" note if site.json emergencyPhone is set

SECTION 4 — MapEmbed
  Google Maps embed.
  Read from: site.json → googleMapsEmbedUrl (admin-configured embed URL)

  If googleMapsEmbedUrl is empty: show a plain address card with "Get Directions" link
  (never show a broken iframe).

  Above map: "Find Us" heading + full address + parking note.

SECTION 5 — ServiceAreaNote
  Simple text section.
  "We serve clients throughout [service area description]."
  Bulleted list of cities/areas served.
  Read from contact.json serviceArea: { heading, body, areas (array of strings) }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Editor for pages/contact.json:
- Hero: headline, subline
- Info Grid: headings and notes (phone, address, hours pulled from site.json)
- Form: heading, submit label, success message, error message
- Map: embed URL (text input for Google Maps embed src)
- ServiceArea: heading, body, areas (repeatable tag)

In admin Site Settings, ensure these fields exist (from 1A, carried over):
- Phone, Email, Office Address
- Business Hours (repeatable)
- Google Maps Embed URL (text)
- Languages Served
- Emergency Phone (optional)
- Parking Note (optional)
```

**Done-Gate 1F:**
- `/contact` renders all 5 sections
- Phone number is click-to-call on mobile
- ContactForm submits successfully → creates record in quote_requests table
- Form validation: phone and name are required — shows inline error if empty
- Map embeds correctly if googleMapsEmbedUrl is set; shows address card if empty
- Business hours match what's in site.json
- Language preference dropdown only appears if languagesServed has 2+ languages
- Form success message appears after submit (no page reload)

---

## Prompt 1G — SEO Baseline Pass

**Goal:** Add title tags, meta descriptions, Open Graph tags, and schema.org markup to every Phase 1 page. All values must come from DB — no hardcoded SEO strings.

```
You are building BAAM System I — Insurance Brokerage Platform.
This is a targeted SEO pass — do NOT rewrite page content.
Reference: @INSURANCE_COMPLETE_PLAN.md A6 Content Strategy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEO DATA SOURCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every page's SEO metadata reads from:
1. page-specific JSON: [slug].json → seo.title, seo.description, seo.ogImage
2. Fallback: site.json → seo.defaultTitle, seo.defaultDescription, seo.ogImage
3. Final fallback: constructed from page name + site name

Add a generateMetadata() export to each page file.
Pattern (reuse from existing medical codebase if already there):

  export async function generateMetadata({ params }) {
    const content = await getContentEntry(siteId, `pages/[slug].json`);
    const seo = content?.seo ?? {};
    const site = await getSiteConfig(siteId);
    return {
      title: seo.title ?? `[Page Name] | ${site.name}`,
      description: seo.description ?? site.seo?.defaultDescription,
      openGraph: {
        title: seo.title,
        description: seo.description,
        images: [{ url: seo.ogImage ?? site.seo?.ogImage }],
        type: 'website',
      }
    };
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PER-PAGE SEO TARGETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Home page (/):
  Target keywords: "[city] insurance broker", "insurance agent [city]"
  Title template: "[Brokerage Name] — Independent Insurance Broker in [City] | Free Quotes"
  Description template: "Get free insurance quotes for auto, home, business & more. [Brokerage Name] shops 30+ carriers. Serving [City] since [year]. Call [phone]."
  Schema.org: LocalBusiness + InsuranceAgency

Insurance Hub (/insurance):
  Target: "insurance services [city]", "all types of insurance"
  Title: "All Insurance Services | [Brokerage Name]"
  Description: "Browse all [count] insurance lines we offer — auto, home, business, TLC, commercial & more. Get a free quote from [Brokerage Name] today."
  Schema.org: Service (with hasOfferCatalog listing insurance_lines)

Auto Insurance (/insurance/auto):
  Target: "auto insurance [city]", "car insurance quotes [city]"
  Title: "Auto Insurance in [City] | Free Quotes | [Brokerage Name]"
  Description: "Compare auto insurance quotes from 20+ carriers. [Brokerage Name] finds your best rate in [City]. Call [phone] for a same-day quote."

TLC Insurance (/insurance/tlc):
  Target: "TLC insurance NYC", "livery insurance NYC"
  Title: "TLC Insurance NYC — Same-Day Binding | [Brokerage Name]"
  Description: "TLC-compliant livery insurance for NYC drivers. Same-day binding for plate renewals. English, Spanish, Chinese. Call [phone] for fast service."

Homeowner Insurance (/insurance/homeowner):
  Target: "homeowner insurance [city]", "home insurance quotes"
  Title: "Homeowner Insurance in [City] | [Brokerage Name]"
  Description: "Protect your home with coverage from 20+ carriers. [Brokerage Name] compares homeowner insurance rates to find your best deal in [City]."

About (/about):
  Target: "[brokerage name] reviews", "independent insurance broker [city]"
  Title: "About [Brokerage Name] | Licensed Insurance Broker Since [Year]"
  Description: "[Brokerage Name] is a licensed independent insurance broker serving [city] since [year]. [X] years of experience, [count] carriers, [count]+ clients."

Contact (/contact):
  Target: "contact [brokerage name]", "insurance broker [address city]"
  Title: "Contact [Brokerage Name] | Insurance Broker in [City]"
  Description: "Reach [Brokerage Name] by phone, email, or visit our [city] office. Mon–Sat [hours]. Free insurance quotes. [phone]."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA.ORG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add to layout.tsx (applies to all pages):
  LocalBusiness schema with:
  - @type: ["InsuranceAgency", "LocalBusiness"]
  - name, address, telephone, email, url
  - openingHours (from site.json businessHours)
  - priceRange: "$$"
  - areaServed: service area cities (from site.json)
  - hasOfferCatalog: insurance line names

Service pages (/insurance/[slug]):
  Add Service schema per page (already done in 1D — FAQ schema is there too):
  {
    "@type": "Service",
    "name": "[Insurance Line Name] Insurance",
    "serviceType": "[type]",
    "provider": { "@type": "InsuranceAgency", ... },
    "areaServed": ...,
    "description": seo.description
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROBOTS.TXT AND SITEMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/robots.txt (Next.js Route Handler or static file)
  User-agent: *
  Allow: /
  Disallow: /admin/
  Disallow: /api/
  Sitemap: https://[domain]/sitemap.xml

File: app/sitemap.ts (Next.js sitemap route)
  Dynamically generates sitemap including:
  - Static pages: /, /insurance, /about, /contact, /quote
  - All active insurance service pages: /insurance/[slug] for each insurance_lines row
  - All published blog posts: /resources/[slug]
  Read from DB — do NOT hardcode URLs.
  changeFrequency: home/insurance = 'weekly', service pages = 'monthly', blog = 'weekly'
  priority: home = 1.0, insurance hub = 0.9, service pages = 0.8, blog = 0.6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING — SEO fields
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In Content Editor (every page's JSON editor), add SEO section in Form mode:
- SEO Title (text input, 60-char counter)
- Meta Description (textarea, 160-char counter)
- OG Image (image picker)

In admin Site Settings, add SEO defaults:
- Default Title Template: "[Page] | [Brokerage Name]"
- Default Meta Description
- Default OG Image
- Google Analytics ID (if applicable)
- Google Tag Manager ID (if applicable)
```

**Done-Gate 1G:**
- `<title>` and `<meta name="description">` are correct on all 7 pages
- Open Graph tags present (title, description, image) on all 7 pages
- `<link rel="canonical">` tag present on all pages
- LocalBusiness schema.org JSON-LD in layout `<head>`
- Service schema on each /insurance/[slug] page
- FAQPage schema on /insurance/[slug] pages (carried from 1D)
- robots.txt accessible at /robots.txt
- Sitemap accessible at /sitemap.xml — contains all active insurance slugs
- SEO title + description fields editable in admin Content Editor for each page
- No page has a title exceeding 70 characters in the seeded defaults

---

## Phase 1 Completion Gate

Before tagging `v0.1-phase1-complete` and moving to Phase 2, verify ALL of the following:

| Check | Page(s) | How to Verify |
|-------|---------|---------------|
| Header license number visible | All | Check top bar on desktop |
| MobileStickyPhoneBar visible | All | 375px viewport |
| Sticky bar: left=Call (navy), right=Quote (gold) | All | Screenshot at 375px |
| Home page loads all 10 sections | `/` | Scroll full page |
| InsuranceLineGrid shows 15 tiles | `/`, `/insurance` | Count tiles |
| CarrierCarousel auto-scrolls | `/` | Watch 5 seconds |
| QuoteCTASection form submits | `/`, service pages | Submit test lead → check DB |
| Insurance hub category tabs filter | `/insurance` | Click Personal tab |
| `/insurance/auto` — 9 sections render | `/insurance/auto` | Scroll full page |
| `/insurance/tlc` — TLC callout box visible | `/insurance/tlc` | Check section 3 |
| `/insurance/[unknown-slug]` → 404 | Test with /insurance/xyz | Expect 404 page |
| About page milestones timeline | `/about` | Check section 2 |
| LicensesCredentials table + verify link | `/about` | Check section 4 |
| Contact form submits | `/contact` | Submit test message → check DB |
| Map renders (or address fallback) | `/contact` | Check section 4 |
| SEO title correct on all pages | All 7 | View source or browser tab |
| Schema.org LocalBusiness in head | All | View source, search "InsuranceAgency" |
| sitemap.xml includes insurance slugs | `/sitemap.xml` | Open URL, count service pages |
| No hardcoded hex colors in new components | All new files | `grep -r "#" components/sections/Insurance* components/sections/Carrier* components/sections/Quote*` |
| Lighthouse ≥ 90 | `/`, `/insurance/auto` | Run in Chrome DevTools |
| Admin: change hero headline → frontend updates | `/` | Edit in admin → reload |

---

## Phase 1 → Phase 2 Handoff

After Phase 1 is clean:

**What Phase 2 will build:**
- Quote page (`/quote`) — 3-step multi-step form (the primary conversion goal)
- Agents page (`/agents`) — full agent listing with filter by specialty/language
- Testimonials page (`/testimonials`) — social proof hub with filter by coverage type
- Blog/Resources system — listing + individual article pages
- FAQ page (`/faq`) — objection handling + SEO
- Claims Assistance page (`/claims`)
- Tag `v0.2-phase2-complete` when done

**What should exist after Phase 1:**
- 7 fully functional pages
- 3 NEW components: InsuranceLineGrid, CarrierLogoCarousel, QuoteCTASection
- 4 NEW section components: WhatItCoversSection, RateFactorsSection, ServiceFAQSection, LicensesCredentialsSection
- All admin editors wired for every page
- SEO foundation in place
- Test quote_requests records created from form testing
