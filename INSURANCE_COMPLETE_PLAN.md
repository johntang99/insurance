# BAAM System I — Insurance Brokerage Platform: Complete Plan

> **System Code:** INSURANCE (System I)
> **Version:** 1.0
> **Date:** March 2026
> **Author:** BAAM Platform Team
> **Reference Codebase:** `medical-clinic` (chinese-medicine) — fork and adapt
> **Architecture Model:** Multi-tenant Next.js — one codebase, many brokerage sites
> **Phase Files:** `INSURANCE_PHASE_0.md` through `INSURANCE_PHASE_5.md` (generated separately, one per phase)

---

## Table of Contents

- [Stage A — Strategy & Design](#stage-a--strategy--design)
  - [A1: Industry Deep Dive](#a1-industry-deep-dive)
  - [A2: Brand Positioning & Differentiation](#a2-brand-positioning--differentiation)
  - [A3: Site Architecture & Page Design](#a3-site-architecture--page-design)
  - [A4: Component Inventory & Unique Features](#a4-component-inventory--unique-features)
  - [A5: Visual Design Direction](#a5-visual-design-direction)
  - [A6: Content Strategy & Conversion Funnel](#a6-content-strategy--conversion-funnel)
  - [Stage A Acceptance Gates](#stage-a-acceptance-gates)
- [Stage B — Implementation](#stage-b--implementation)
  - [Architecture Overview](#architecture-overview)
  - [Phase Overview](#phase-overview)
- [Implementation Checklists](#implementation-checklists)
  - [Frontend Functions, Pages & Content Checklist](#frontend-functions-pages--content-checklist)
  - [Backend Admin Function Checklist](#backend-admin-function-checklist)
  - [Design and Layout Checklist](#design-and-layout-checklist)
- [Database Schema](#database-schema)
- [Content Contracts](#content-contracts)

---

## Stage A — Strategy & Design

---

## A1: Industry Deep Dive

### 1.1 Industry Overview

Independent insurance brokerages are the local face of the insurance industry. Unlike direct carriers (State Farm, Allstate), brokers represent **multiple carriers** and find the best rate for each client. Their key value proposition: **independent advice + competitive shopping across 10–30+ carriers**.

The insurance buyer journey:
1. Trigger event (new car, new home, business startup, renewal)
2. Searches Google for "insurance broker near me" or "[type] insurance [city]"
3. Visits 2–3 broker sites, compares trust signals
4. Submits quote request or calls — **decision made within 10 minutes of arriving**
5. Receives quote comparison within hours
6. Binds policy

**Key insight:** Insurance is a phone/form conversion business. Most visitors decide in under 3 minutes. The site must communicate: *trustworthy local expert + fast quote + many carriers + I handle your type of insurance.*

### 1.2 Service Lines (Based on Peerless Brokerage Model)

| Service | Client Type | Complexity | Volume |
|---------|------------|------------|--------|
| **Auto Insurance** | Personal | Low | Very High |
| **TLC Insurance** | NYC taxi/livery/rideshare drivers | Medium | High (NYC-specific) |
| **Commercial Auto** | Fleets, delivery, contractors | Medium | Medium |
| **Homeowner Insurance** | Homeowners, landlords | Low | High |
| **Business Insurance / BOP** | Small businesses | Medium | High |
| **Workers Compensation** | Employers | Medium | Medium |
| **Disability Insurance** | Professionals, businesses | Medium | Low |
| **Construction Insurance** | Contractors, developers | High | Medium |
| **Motorcycle Insurance** | Riders | Low | Medium |
| **Boat Insurance** | Boat owners | Low | Low |
| **Travel Insurance** | Individuals, groups | Low | Medium |
| **Group Health Insurance** | Employers, associations | High | Low |
| **Claim Service** | Existing clients | N/A | Support |
| **Notary Service** | General | Low | Add-on |
| **DMV Service** | Vehicle owners | Low | Add-on |

### 1.3 Target Customer Profiles

**Profile 1 — Personal Lines Buyer**
- Homeowner or renter, car owner, age 28–65
- Shopping at renewal or after life event (new car, new home, marriage)
- Top questions: "How much will it cost?" "Are you better than my current broker?"
- Trust signals: Google reviews, years in business, local address, carrier logos
- Conversion preference: Quick quote form or phone call

**Profile 2 — TLC / Livery Driver (NYC-specific)**
- Uber/Lyft/taxi driver or car service owner
- Needs TLC-compliant insurance quickly (DMV/TLC deadline pressure)
- Speaks multiple languages (Chinese, Spanish, Bengali, Urdu common)
- Trust signals: TLC specialist badge, bilingual staff, fast turnaround
- Conversion: Phone call (urgent), form (if after hours)

**Profile 3 — Small Business Owner**
- Restaurant, retail, contractor, professional service
- Needs BOP, workers comp, commercial auto
- Often buying multiple policies at once
- Trust signals: Knows my industry, understands compliance, one broker for all
- Conversion: Consultation form or phone

**Profile 4 — Contractor / Construction**
- General contractor, subcontractor, developer
- Needs GL + workers comp + builders risk
- Certificate of Insurance (COI) requests are frequent and urgent
- Trust signals: Construction specialist, fast COI turnaround
- Conversion: Call or email (complex needs)

### 1.4 Industry-Specific Requirements

**Licensing & Compliance:**
- State insurance license number must be displayed on site (legal requirement)
- "Licensed in NY, NJ, CT..." (states served)
- Disclaimer: "Insurance products and services are subject to state availability..."
- E&O (Errors & Omissions) insurance is expected

**Trust Signals Specific to Insurance:**
- License number (with link to verify on state DOI website)
- Years in business
- Number of carriers represented (e.g., "Access to 30+ carriers")
- Number of clients served
- Google Reviews rating and count (most trusted)
- BBB rating / NAIC membership
- Carrier partner logos (Travelers, Nationwide, Progressive, etc.)
- Physical office address (critical — people don't trust online-only brokers)

**Language Considerations:**
- NYC-area brokerages typically serve: English, Spanish, Chinese, Bengali
- TLC drivers are often non-native English speakers
- Bilingual staff is itself a trust signal and should be featured

**Seasonal / Timing:**
- Auto and home renewals drive traffic spikes
- Tax season drives business insurance inquiries
- Hurricane/storm season (June–November) drives home insurance urgency

### 1.5 SEO Landscape

**High-volume keywords:**
- "[city] insurance broker" / "insurance agent near me"
- "[type] insurance [city]" (e.g., "auto insurance brooklyn")
- "TLC insurance NYC" / "livery insurance"
- "commercial auto insurance [city]"
- "workers comp insurance [city]"
- "cheap car insurance [city]"
- "business insurance quote"

**Content that ranks:**
- "How much does [type] insurance cost in [city]?"
- "What is TLC insurance and do I need it?"
- "What does general liability insurance cover?"
- "Workers comp requirements in [state]"
- Comparison: "Independent broker vs captive agent"

**Programmatic page opportunities:**
- `/insurance/[type]` — service pages (15+ pages)
- `/locations/[city]` — location pages for service area
- `/carriers/[name]` — carrier partner pages
- `/resources/[topic]` — educational guides

---

## A2: Brand Positioning & Differentiation

### 2.1 Platform Positioning

The insurance platform template is positioned as:

> **"[Brokerage Name] is the trusted independent insurance expert for [city/region] — delivering fast quotes from 20+ carriers with personalized service for personal, business, and specialty coverage."**

The template must flex to accommodate brokerages ranging from 1-person shops to 20-person agencies.

### 2.2 Five Pillars of Differentiation

| Pillar | Claim | How Site Communicates It | Evidence |
|--------|-------|--------------------------|----------|
| **1. Independent Advice** | We work for you, not the insurance company | "Independent Broker" badge in hero; explainer section on why independence matters | No carrier logos in hero (shows no bias) |
| **2. Speed** | Fast quote, fast service, fast COI | "Quote in 2 hours" promise; phone number always visible; "Same-day service" badge | Testimonials about speed |
| **3. Coverage Breadth** | One broker for all your needs | Service grid showing all 15 lines; "One call covers it all" messaging | 15 service tiles |
| **4. Local Expertise** | We know your city, your industry | Office address + map; TLC specialist (for NYC); industry-specific pages | Years in business; client count |
| **5. Best Rate** | We shop 20+ carriers for the lowest rate | Carrier logo carousel; savings stat ("Clients save average 23%"); | Quote comparison promise |

### 2.3 Scale Perception Numbers

Every brokerage site should display (real or realistic estimates):
- Years in business (e.g., "25+ years")
- Clients served (e.g., "5,000+ clients")
- Carriers accessed (e.g., "30+ carriers")
- Policies written (e.g., "10,000+ policies")
- States licensed (e.g., "Licensed in NY, NJ, CT, PA")

### 2.4 Primary Conversion Path

```
Primary CTA:   "Get a Free Quote" → /quote
Secondary CTA: "Call Us Now" → tel:[phone]
Emergency:     Sticky phone number in header on mobile
Promise:       "Quote within 2 hours during business hours"
```

---

## A3: Site Architecture & Page Design

### 3.1 Complete Page Map

**Tier 1 — Core (launch required)**

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Hook + differentiation + all service overview |
| Insurance Lines Hub | `/insurance` | Master services overview |
| Individual Service Pages | `/insurance/[type]` | 15 pages — one per coverage type |
| Get a Quote | `/quote` | Primary lead capture — multi-step form |
| About | `/about` | Trust: story, team, licenses, carriers |
| Contact | `/contact` | Secondary conversion — address, phone, form, map |

**Tier 2 — Authority & SEO**

| Page | Route | Purpose |
|------|-------|---------|
| Our Agents | `/agents` | Agent profiles with direct contact links |
| Carrier Partners | `/carriers` | Trust via known carrier names + logos |
| Testimonials | `/testimonials` | Social proof hub |
| Blog / Resources | `/resources` | SEO engine + educational authority |
| Blog Post | `/resources/[slug]` | Individual article |
| FAQ | `/faq` | Objection handling + SEO |
| Claims Help | `/claims` | Existing client retention + trust |

**Tier 3 — Specialty**

| Page | Route | Purpose |
|------|-------|---------|
| TLC Insurance | `/insurance/tlc` | NYC-specific specialty service |
| DMV Services | `/services/dmv` | Add-on service page |
| Notary Services | `/services/notary` | Add-on service page |
| Client Portal | `/portal` | (Phase 2+) Login for existing clients |

**Tier 4 — Programmatic SEO**

| Template | Route Pattern | Volume |
|----------|---------------|--------|
| Service × Location | `/insurance/[type]/[city]` | ~50 pages |
| Carrier Profile | `/carriers/[slug]` | ~15 pages |
| Resource Guides | `/resources/[slug]` | ~30 articles |

---

### 3.2 Page Design — Tier 1 Pages

---

#### Page: Home

```
Route: /
Purpose: First impression — communicate trust, breadth, speed. Drive quote requests.
Conversion role: HOOK → CONVINCE → CONVERT
Target visitor: New prospect searching for broker in area

Sections (in order):
1. Hero
   — Headline: "Your Trusted Local Insurance Broker"
   — Subline: "Fast quotes from 30+ carriers. Personal. Business. Specialty."
   — Stats: [Years in Business] | [Carriers] | [Clients Served] | [Policies Written]
   — CTAs: "Get a Free Quote" (primary) + "Call Us Now" (secondary)
   — Background: Professional photo of team or local landmark
   — Trust badge: "Licensed • Independent • Local"

2. InsuranceLineGrid
   — Section headline: "We Cover Everything"
   — 15 service tiles with icon, name, one-line description, "Learn More" link
   — Organized in 3 columns desktop / 2 tablet / 1 mobile
   — Highlight 3 "featured" lines (auto, home, business)

3. WhyIndependent
   — Headline: "Why Choose an Independent Broker?"
   — 3-column explainer: "We shop 30+ carriers" / "We work for you, not the insurer" / "One call for all your needs"
   — Mini CTA: "See how much you could save →"

4. StatsStrip
   — Animated counter: Years in Business | Carriers | Clients | Policies
   — Dark background section (navy or dark green)

5. FeaturedCarriers
   — Headline: "Carriers We Work With"
   — Scrolling/auto-carousel: 10–20 carrier logos (Travelers, Progressive, Nationwide, etc.)
   — Subline: "We shop them all to get you the best rate"

6. HowItWorks
   — Headline: "How It Works — 3 Simple Steps"
   — Step 1: Tell us what you need (2 min)
   — Step 2: We shop 30+ carriers (same day)
   — Step 3: You pick the best rate (you decide)
   — CTA: "Start My Quote"

7. Testimonials (featured — 3 cards)
   — Quote + name + coverage type + star rating
   — Link: "See all reviews →"

8. AgentSpotlight (optional — 2–3 agents)
   — Photo, name, specialties, years of experience, direct contact button

9. BlogPreview (3 recent articles)
   — "From Our Resource Center"

10. QuoteCTA (bottom of page)
    — Full-width band: "Ready to Save on Insurance?"
    — Headline + subline + prominent form (name, phone, coverage type) + submit
    — Alternative: phone number for those who prefer to call

CTA strategy:
- Primary: "Get a Free Quote" → /quote (hero + bottom)
- Secondary: "Call Us" → tel:[phone] (hero + sticky header mobile)
- Tertiary: "Learn More" per service line

SEO:
- Target: "[city] insurance broker", "insurance agent [city]"
- Title: "[Brokerage Name] — Independent Insurance Broker in [City] | Free Quotes"
- Description: "Get free insurance quotes for auto, home, business & more. [Brokerage Name] shops 30+ carriers to find your best rate. Serving [City] since [Year]."
```

---

#### Page: Individual Insurance Service Page (Template for all 15 types)

```
Route: /insurance/[type]  (e.g., /insurance/auto, /insurance/tlc, /insurance/workers-comp)
Purpose: Educate + convince + convert for a specific coverage type
Conversion role: EDUCATE → CONVINCE → CONVERT
Target visitor: Someone actively shopping for this specific type of insurance

Sections (in order):
1. ServiceHero
   — Headline: "[Type] Insurance"
   — Subline: Service-specific value prop (e.g., "Get TLC-compliant coverage fast")
   — Stats relevant to this type
   — CTA: "Get a [Type] Insurance Quote"

2. WhatItCovers
   — Headline: "What [Type] Insurance Covers"
   — Coverage breakdown with icons (what's included / what's excluded)
   — Who needs it

3. WhyUs (service-specific)
   — Why choose our brokerage for this specific type
   — Carrier options for this type
   — Specialist credentials if applicable (e.g., "TLC-certified broker")

4. QuoteProcess
   — What info you need to provide for a quote
   — How long it takes
   — What happens next

5. RateFactors
   — What affects your rate for this coverage type
   — Tips to lower your premium

6. ServiceTestimonials
   — 2–3 testimonials specifically about this coverage type

7. FAQ (service-specific)
   — 5–8 questions specific to this coverage type

8. RelatedServices
   — "Clients with [Type] insurance often also need..."
   — 3 related service cards

9. QuoteFormInline
   — Embedded mini quote form at bottom of page
   — Pre-filled with coverage type

CTA strategy:
- Primary: "Get a [Type] Quote" → /quote?type=[type]
- Secondary: "Call for Fast Quote" → tel:[phone]

SEO:
- Target: "[type] insurance [city]", "[type] insurance quotes"
- Title: "[Type] Insurance in [City] | [Brokerage Name]"
```

---

#### Page: Get a Quote (Primary Conversion)

```
Route: /quote
Purpose: Capture lead information — the #1 conversion goal of the entire site
Conversion role: CONVERT
Target visitor: Ready-to-buy prospect

Multi-step form (3 steps, no page reload):

Step 1 — Coverage Selection
  - What type of insurance? (checkbox multi-select — all 15 types)
  - "Do you need multiple types?" (Yes/No)
  - State / location

Step 2 — Contact Information
  - First Name, Last Name
  - Phone Number (required)
  - Email Address
  - Best time to contact (Morning/Afternoon/Evening)
  - Preferred language (English / Spanish / Chinese / Other)

Step 3 — Additional Details (optional, improves quote accuracy)
  - Coverage type specific questions (loaded dynamically based on Step 1)
  - Auto: Year/Make/Model, current insurer, drivers
  - Home: Address, year built, current insurer
  - Business: Business type, employees, annual revenue
  - Any message

Confirmation page:
  - "Thank you! We'll contact you within 2 hours."
  - Phone number to call if urgent
  - What happens next (3 steps)
  - Social proof: "Join 5,000+ satisfied clients"

CTA strategy:
- "Submit Quote Request" → confirmation
- "Prefer to call? [phone]" at every step

SEO:
- Target: "get insurance quote [city]", "free insurance quote"
- Title: "Get a Free Insurance Quote | [Brokerage Name]"
```

---

#### Page: About

```
Route: /about
Purpose: Build deep trust — credentials, history, team, mission
Conversion role: TRUST BUILDER
Target visitor: Prospect doing due diligence before calling

Sections:
1. AboutHero
   — Team photo or office photo
   — Est. year badge + license numbers
   — "About [Brokerage Name]"

2. OurStory
   — Founding story (when, why, by whom)
   — Growth milestones
   — Local community connection

3. OurMission
   — Why independence matters to clients
   — Commitment to finding best rates + best service

4. LicensesCredentials
   — State license numbers (NY, NJ, CT, PA, etc.)
   — "Verify our license" link to state DOI
   — Professional memberships (PIANY, IIABNY, BBB)
   — E&O insurance holder statement

5. TeamSection
   — Agent cards: photo, name, title, specialties, languages spoken, license #, years experience
   — Link to full Agents page

6. CarrierPartners
   — "We work with the best carriers"
   — Grid of carrier logos

7. CommunityInvolvement
   — Local sponsorships, charity, community (if applicable)

8. AboutCTA
   — "Meet with us today"
   — Quote CTA + phone

SEO:
- Target: "[brokerage name] reviews", "independent insurance broker [city]"
- Title: "About [Brokerage Name] | Licensed Insurance Broker Since [Year]"
```

---

#### Page: Contact

```
Route: /contact
Purpose: Make it trivially easy to reach the brokerage
Conversion role: CONVERT (secondary)
Target visitor: Ready to contact, looking for specific info

Sections:
1. ContactHero — Headline + subline
2. ContactGrid
   — Phone (click-to-call)
   — Email
   — Office address
   — Business hours (include weekend hours if applicable)
   — Languages spoken
3. ContactForm — Name, phone, email, message, coverage type, submit
4. MapEmbed — Google Maps embed of office location
5. ServiceAreaNote — "Serving clients in [City], [Surrounding areas]"

CTA:
- Primary: "Send Message" (form submit)
- Always visible: phone number
```

---

### 3.3 Service Page Index (all 15 types)

| Slug | Page Title | Key Differentiator |
|------|-----------|-------------------|
| `/insurance/auto` | Auto Insurance | Multi-carrier comparison, safe driver discounts |
| `/insurance/tlc` | TLC Insurance | NYC TLC-compliant, fast turnaround, multilingual |
| `/insurance/commercial-auto` | Commercial Auto Insurance | Fleets, contractors, delivery vehicles |
| `/insurance/homeowner` | Homeowner Insurance | Bundle discounts, all carrier options |
| `/insurance/business` | Business Insurance (BOP) | GL + property + business income, one policy |
| `/insurance/workers-comp` | Workers Compensation | Required by law, fast binding, audit support |
| `/insurance/disability` | Disability Insurance | Short-term and long-term options |
| `/insurance/construction` | Construction Insurance | GL, builders risk, contractor coverage |
| `/insurance/motorcycle` | Motorcycle Insurance | Year-round or seasonal, full/liability |
| `/insurance/boat` | Boat Insurance | Marine coverage, agreed value policies |
| `/insurance/travel` | Travel Insurance | Trip cancellation, medical, group rates |
| `/insurance/group-health` | Group Health Insurance | Employer-sponsored, ACA-compliant plans |
| `/insurance/commercial-property` | Commercial Property Insurance | Buildings, equipment, inventory |
| `/services/claims` | Claims Assistance | Help navigating the claims process |
| `/services/dmv` | DMV Services | Registration, title transfers (add-on) |
| `/services/notary` | Notary Services | Document notarization (add-on) |

---

## A4: Component Inventory & Unique Features

### 4.1 Components — REUSE vs NEW

| Component | Status | Description | Source |
|-----------|--------|-------------|--------|
| Hero (split-image, stats, centered variants) | REUSE adapt | Same pattern as medical — adapt content | medical |
| StatsStrip | REUSE adapt | Animated counters — same logic | medical |
| TeamSection | REUSE adapt | Agent profiles = doctor profiles | medical |
| Testimonials | REUSE adapt | Same pattern | medical |
| BlogPreview | REUSE adapt | Resource articles = blog posts | medical |
| FAQ Accordion | REUSE adapt | Same component | medical |
| ContactSection | REUSE adapt | Form + address + map | medical |
| CTABanner | REUSE adapt | Full-width conversion band | medical |
| Footer | REUSE adapt | Links + compliance + license numbers | medical |
| Header | REUSE adapt | Nav + CTA + phone number | medical |
| MediaSystem | REUSE | Image upload, provider search | medical |
| AdminCMS | REUSE | Content editor, site settings, media | medical |
| ThemeSystem | REUSE | theme.json → CSS variables | medical |
| DomainMiddleware | REUSE | Multi-site domain routing | medical |
| **InsuranceLineGrid** | **NEW** | 15-tile service grid with icons and hover | — |
| **QuoteForm** | **NEW** | Multi-step lead capture form (3 steps) | — |
| **CarrierLogoCarousel** | **NEW** | Auto-scrolling carrier logo strip | — |
| **WhyIndependent** | **NEW** | 3-column broker independence explainer | — |
| **HowItWorks** | **NEW** | 3-step process with visual icons | — |
| **AgentCard** | **NEW** | Agent profile with license, photo, specialties, languages | — |
| **WhatItCovers** | **NEW** | Coverage breakdown (included/excluded) with icons | — |
| **RateFactors** | **NEW** | "What affects your rate" explainer | — |
| **ServiceTestimonials** | **NEW** | Testimonials filtered by coverage type | — |
| **LicenseCredentialPanel** | **NEW** | License numbers + verify links + memberships | — |
| **QuoteLeadDashboard** | **NEW** | Admin view of all quote requests with status | — |
| **ServiceAreaMap** | **NEW** | Visual map of states/counties served | — |
| **LanguageBadge** | **NEW** | "We speak [languages]" trust component | — |

### 4.2 New Component Specifications

#### InsuranceLineGrid
- **Purpose:** Show all 15 coverage types in a scannable grid
- **Data:** `{ services: [{ slug, name, icon, description, featured, enabled }] }`
- **Variants:** `grid-3col` | `grid-4col` | `list` | `featured-3-plus-grid`
- **Behavior:** Featured services have visual accent; hover shows "Get Quote" button

#### QuoteForm
- **Purpose:** Multi-step lead capture — primary conversion component
- **Data:** Submitted to `/api/quote-requests` → stored in DB + email notification
- **Steps:** Coverage Selection → Contact Info → Details → Confirmation
- **Behavior:** Dynamic fields in Step 3 based on coverage type selected in Step 1
- **Admin:** Leads visible in admin dashboard with status (New/Contacted/Quoted/Bound/Closed)

#### CarrierLogoCarousel
- **Purpose:** Trust signal — shows recognized carrier brands
- **Data:** `{ carriers: [{ name, logoUrl, website }] }`
- **Variants:** `auto-scroll` | `static-grid` | `hover-name`
- **Behavior:** Continuous horizontal scroll (CSS animation, no JS dependency)

#### AgentCard
- **Purpose:** Personalize the brokerage, build trust through human faces
- **Data:** `{ name, photo, title, specialties[], languages[], licenseNumber, yearsExperience, phone, email, bio }`
- **Variants:** `compact` | `full` | `featured`

#### QuoteLeadDashboard (Admin)
- **Purpose:** Manage incoming quote requests
- **Columns:** Date | Name | Phone | Coverage Types | Status | Assigned Agent | Actions
- **Actions:** Mark as Contacted, Quoted, Bound; Add notes; Assign to agent
- **Filters:** By status, by coverage type, by date range, by agent
- **Notifications:** Email alert to assigned agent on new lead

---

## A5: Visual Design Direction

### 5.1 Color Palette

**Primary:** Deep Navy Blue `#0B1F3A`
- Conveys: Authority, trustworthiness, stability, professionalism
- Insurance is about protection and security — deep navy is the industry standard for a reason (Lloyd's, Chubb, AIG, AXA all use navy)

**Secondary / Accent:** Warm Gold `#C9933A`
- Conveys: Premium, valuable, established, excellence
- Creates distinction from "cheap insurance" competitors who use cheap greens/reds
- Used for CTAs, highlights, badges

**Supporting Colors:**
- Success / Trust: `#1A7A4A` (green — for "covered", "active", badges)
- Warning / Urgency: `#C74B4B` (red — for deadlines, "required by law" callouts)
- Light Background: `#F7F8FA` (off-white — cleaner than pure white)
- Dark Section BG: `#0B1F3A` (navy — for stats strips, CTAs)
- Neutral Text: `#2C3E50` (dark blue-grey)
- Muted Text: `#7A8A9A`
- Border: `#E2E8F0`

**Color Psychology Rationale:**
Navy + gold is the "established professional" palette in financial services. It signals: "We have been here 20+ years, we are not a fly-by-night operation, you can trust us with your most important assets." This is exactly what insurance buyers need to feel.

### 5.2 Typography

**Heading Font:** `Playfair Display` (serif)
- Conveys: Established, trustworthy, premium, traditional
- Used: Page headlines, section headings, hero text

**Body Font:** `Inter` (sans-serif)
- Conveys: Modern, readable, professional, clean
- Used: Body text, UI, forms, navigation, small text

**Weight Hierarchy:**
- Display (hero headline): 700, 56–72px
- H1 (page title): 700, 40–48px
- H2 (section heading): 600, 28–36px
- H3 (card/subsection): 600, 20–24px
- Body: 400, 16–18px
- Caption / label: 400, 12–14px

### 5.3 Photography Direction

- **Agent photos:** Professional headshots, warm lighting, suit or business casual
- **Office photos:** Clean, modern interior; reception desk; team meeting
- **Action photos:** Handshake, family in front of home, car keys, business meeting
- **Avoid:** Generic stock photos with obvious staged quality; overly aggressive "SAVE MONEY" banner imagery
- **Treatment:** Subtle navy overlay on hero images (50% opacity → reinforces brand color)
- **Icons:** Line icons, consistent stroke weight, navy or gold color

### 5.4 Layout Principles

- **Spacious but information-dense:** Insurance buyers are practical — they want information quickly, but not cluttered
- **Mobile-first:** 60%+ of insurance searches are on mobile. Phone number must be tap-to-call everywhere on mobile.
- **Forms must be clean:** Multi-step quote form should feel fast and easy, not like a tax return
- **Trust signals everywhere:** License number, Google rating, carrier logos — appear in header, footer, and page body
- **Dark sections sparingly:** Navy background for StatsStrip and bottom CTAs only; rest of site is light

### 5.5 Competitor Visual Analysis

| Competitor Type | Visual Style | Our Differentiation |
|-----------------|-------------|---------------------|
| Most local brokers | Outdated, cluttered, clip-art icons | Modern, premium, clean |
| Direct carriers (Geico, State Farm) | Bright primary colors, aggressive savings messaging | Professional, independent advisor — not a salesperson |
| National aggregators (Insurance.com) | Clean but generic | Local, personal, human faces |

### 5.6 Reference Design Sites

- **Hiscox.com** — professional tone, clean service pages, strong credentials display
- **Proload Express (BAAM)** — stats strip, carrier logos, conversion-focused layout
- **Mercury Insurance** — good mobile quote form UX
- **Chubb.com** — premium, navy/gold palette, excellent typography
- **Lemonade.com** — (reference only for form UX simplicity — NOT the brand style)

---

## A6: Content Strategy & Conversion Funnel

### 6.1 Launch Content Requirements

| Content Type | Minimum | Target | Notes |
|-------------|---------|--------|-------|
| Testimonials | 20 | 50 | Mix of personal + business + TLC clients |
| Agent profiles | 3 | 8 | Real photos required |
| Blog/resource articles | 8 | 15 | SEO-focused, 800–1500 words each |
| FAQ items | 25 | 50 | Mix of general + per-service type |
| Carrier logos | 10 | 25 | Only legitimate carrier partners |
| Service pages | 15 | 16 | All types listed in A3 |

### 6.2 Conversion Funnel Map

```
AWARENESS
├── Google search: "[type] insurance [city]"
├── Blog article: "How much does auto insurance cost in NYC?"
└── Google My Business listing

INTEREST
├── Home page: trust + service breadth + carriers
├── Service page: detailed coverage + why us
└── About page: credentials + team + history

CONSIDERATION
├── Testimonials page: 50+ reviews
├── FAQ page: objection handling
└── Carrier partners: recognized brand names

DECISION
├── Quote page: 3-step form (PRIMARY CONVERSION)
├── Phone call: sticky phone number on mobile
└── Contact page: form + address + walk-in option

ACTION
├── Quote submitted → email notification → agent calls within 2 hours
├── Phone call received → immediate conversation
└── Walk-in → office visit

RETENTION
├── Client portal (Phase 2+): view policies, request COI, report claims
├── Annual renewal reminders (email)
└── "We got your claim" → claims assistance page
```

### 6.3 CTA Placement Strategy

| Location | CTA | Mobile |
|----------|-----|--------|
| Header | "Get a Quote" button + phone | Phone number (tap-to-call) prominent |
| Hero | "Get a Free Quote" + "Call Now" | Both visible above fold |
| Every service page (bottom) | "Get [Type] Quote" | Same |
| InsuranceLineGrid | Hover → "Get Quote" | Tap → service page |
| Blog post (middle + end) | "Get a free quote today" | Same |
| FAQ (bottom) | "Still have questions? Call us." | |
| Sticky header (mobile scroll) | Phone number always visible | Critical |
| Footer | Quote form or phone + email | |

### 6.4 Blog Content Plan (Launch Articles)

1. "How Much Does Auto Insurance Cost in [City]? (2026 Guide)"
2. "What Is TLC Insurance and Who Needs It in NYC?"
3. "Independent Broker vs Captive Agent: Which Is Better for You?"
4. "How to Save Money on Your Business Insurance (Without Reducing Coverage)"
5. "Workers Compensation: What New York Employers Are Required to Know"
6. "Home Insurance Checklist: What to Review at Renewal"
7. "What Does Commercial Auto Insurance Cover? (Fleet Owner Guide)"
8. "Top 5 Mistakes People Make When Buying Insurance"

### 6.5 Post-Launch Content Velocity

- Blog: 2 posts/month (AI-assisted drafting, agent review)
- Testimonials: Collect 5/month via post-service email request
- Programmatic pages: Add 2 location pages/month until service area covered

---

## Stage A Acceptance Gates

| Gate | Criteria | Status |
|------|----------|--------|
| **A-Gate-1: Page Map** | 16 Tier 1-2 pages defined with route, purpose, conversion role, sections, CTAs, SEO | ✅ PASS |
| **A-Gate-2: Conversion Funnel** | Full funnel mapped (Awareness → Retention). Primary CTA = /quote. Secondary = phone. Both defined per page. | ✅ PASS |
| **A-Gate-3: Content Contracts** | All 15 service pages + quote form + home + about + contact have section definitions. JSON contracts defined in Stage B Phase 0. | ✅ PASS |
| **A-Gate-4: Variant Registry** | Hero: 3 variants. InsuranceLineGrid: 4 variants. AgentCard: 3 variants. QuoteForm: step variants. Carrier carousel: 3 variants. | ✅ PASS |
| **A-Gate-5: Content Minimums** | 20 testimonials, 8 blog posts, 15 service pages, 25 FAQ items, 10 carrier logos, 3 agent profiles confirmed as launch targets. | ✅ PASS |
| **A-Gate-6: Visual Direction** | Navy #0B1F3A + Gold #C9933A palette. Playfair Display + Inter. 5 reference sites identified. | ✅ PASS |
| **A-Gate-7: Component Inventory** | 8 NEW components specified with data shape and variants. 14 REUSE components from medical codebase identified. | ✅ PASS |
| **A-Gate-8: Prototypes Complete** | All key-page HTML prototypes generated in `prototypes/` folder. All 5 P-Gates passed. Approved before Phase 0 implementation begins. | ✅ PASS |

---

## Stage A-P: Prototype Design ← Required Before Any Implementation

> **Trigger:** All 7 Stage A gates passed AND all phase plans (Phase 0–5 documents) are written and approved.
> **Gate:** All 8 key-page prototypes approved before Phase 0 implementation begins.
> **Purpose:** Prototypes are the visual contract. They prevent "not as expected" results during implementation and eliminate layout rework across phases. Every page built in Phase 1–3 must match its approved prototype.

### Why Prototypes Are Required

Implementation prompts describe *what* to build. Prototypes show *exactly how it should look*. Without this step:
- Developers interpret layouts differently from the design intent
- Phase-by-phase reviews require constant visual correction
- Clients see unexpected results and request rebuilds

With this step:
- Every Cursor prompt can reference `prototypes/[page].html` as the layout target
- Visual QA in Phase 4 has a clear reference standard
- Second brokerage onboarding (Phase 5E) reuses the same approved design system

### Prototype Scope

| Prototype File | Pages Guided | Referenced In |
|---------------|-------------|---------------|
| `prototypes/theme.css` | All pages | All phase prompts |
| `prototypes/home.html` | `/` (Home) | Phase 1B |
| `prototypes/service-auto.html` | All 15 `/insurance/[slug]` pages | Phase 1D, 2G |
| `prototypes/quote.html` | `/quote` | Phase 2A |
| `prototypes/about.html` | `/about` | Phase 1E |
| `prototypes/contact.html` | `/contact` | Phase 1F |
| `prototypes/blog.html` | `/resources` | Phase 2E |
| `prototypes/agents.html` | `/agents` | Phase 2C |
| `prototypes/carriers.html` | `/carriers` | Phase 3A |

### Prototype Generation Instructions

1. **Design system first** — Create `prototypes/theme.css` with all CSS custom properties, typography, layout utilities, component classes, header/footer, and mobile sticky bar. This file is linked by every prototype.
2. **Key pages in order** — Generate each prototype as a fully self-contained HTML file that opens directly in a browser with no build step. Use `<link rel="stylesheet" href="theme.css">` plus page-specific styles in `<style>` tags.
3. **Premium UI standards** — Every prototype must meet:
   - Navy `#0B1F3A` + Gold `#C9933A` palette throughout
   - Playfair Display for headings, Inter for body text
   - All interactive states shown (hover, active, form field focus, accordion open)
   - Mobile-responsive layout (all sections stack gracefully at 375px)
   - Realistic placeholder content (not Lorem Ipsum — use actual insurance copy)
   - Image placeholders as colored gradient `<div>` blocks, not broken `<img>` tags
4. **Functional JS only** — Use vanilla JS for interactive states (tab switching, accordion, multi-step form navigation, counter animation). No frameworks, no CDN dependencies beyond Google Fonts.
5. **Reference fidelity** — Each prototype is the binding layout target. What is in the prototype is what gets built. Any section not in the prototype will not be built.

### Prototype Acceptance Gates

| Gate | Criteria |
|------|----------|
| **P-Gate-1: Design Consistency** | All pages share identical header, footer, typography, color, spacing — visually a single cohesive site |
| **P-Gate-2: Mobile Verified** | Every prototype reviewed at 375px width — no horizontal scroll, no broken layouts |
| **P-Gate-3: Section Coverage** | Every section listed in Stage A page designs (A3.2) appears in the corresponding prototype |
| **P-Gate-4: Interactive States** | Quote form multi-step navigation works; accordion opens/closes; tabs switch; stats animate on scroll |
| **P-Gate-5: Content Realism** | All text is real insurance copy (no Lorem Ipsum); phone/address/license are realistic demo values |

### How Prototypes Are Used in Each Phase

| Phase | How Prototype Is Referenced |
|-------|-----------------------------|
| **Phase 1** | Each page prompt starts with: *"Match the layout in `prototypes/[page].html` exactly."* |
| **Phase 2** | Service pages all follow `prototypes/service-auto.html` — swap content, keep structure |
| **Phase 3** | Programmatic location pages inherit service page layout from prototype |
| **Phase 4 QA** | Visual QA checklist compares live staging URL against prototype screenshot side-by-side |
| **Phase 5 (2nd brokerage)** | Prototype design system (`theme.css`) reused; only brand colors and content swapped |

---

## Stage B — Implementation

---

## Architecture Overview

```
insurance-platform  (Next.js, port 3007)
    │
    │  Middleware resolves domain → brokerage (DB lookup, same as medical)
    │  One running instance serves all brokerage sites
    │  Each site has own branding, agents, services, content
    ▼
Supabase DB  (new isolated project for insurance)
    ├── sites                    (brokerage sites — same as medical)
    ├── site_domains             (domain → site mapping)
    ├── admin_users              (brokerage admins)
    ├── content_entries          (CMS content — same as medical)
    ├── media_assets             (images — same as medical)
    ├── agents                   (NEW — agent profiles per brokerage)
    ├── carriers                 (NEW — carrier logo catalog, shared)
    ├── site_carriers            (NEW — which carriers a site displays)
    ├── insurance_lines          (NEW — which service lines are enabled per site)
    ├── quote_requests           (NEW — lead capture from quote form)
    └── testimonials             (same as medical)
```

**Fork from:** `medical-clinic/chinese-medicine`

**Keep intact from medical:**
- Admin CMS (ContentEditor, SiteSettings, Media, Variants, Users, Sites)
- Content loading system (`lib/content.ts`, `lib/contentDb.ts`)
- Media system (upload, list, delete, provider search/import)
- Theme system (`theme.json` → CSS variables)
- Domain routing middleware
- Auth and RBAC
- Blog system
- Testimonials system

**Remove from medical fork:**
- Booking/appointment system
- TCM/medical-specific content
- Bilingual (zh) routing (start English-only; add Spanish/Chinese as Phase 2+)
- Herb store integration

**Add new for insurance:**
- Quote request system (form + admin dashboard + email notifications)
- Agent profiles (CRUD admin)
- Carrier catalog (CRUD admin + site assignment)
- Insurance line toggle per site
- Lead management (quote_requests dashboard)

---

## Phase Overview

| Phase | Duration | Focus | File |
|-------|----------|-------|------|
| **Phase 0** | Day 1–3 | Fork + Infrastructure + Content Contracts | `INSURANCE_PHASE_0.md` |
| **Phase 1** | Week 1–2 | Core Pages: Home, Services Hub, 3 Sample Service Pages, About, Contact | `INSURANCE_PHASE_1.md` |
| **Phase 2** | Week 3 | Remaining 12 Service Pages + Quote Form + Agents + Carriers + Blog | `INSURANCE_PHASE_2.md` |
| **Phase 3** | Week 4 | Admin Hardening + Quote Lead Dashboard + SEO + Programmatic Pages | `INSURANCE_PHASE_3.md` |
| **Phase 4** | Week 5 | QA + Content Population + First Brokerage Launch | `INSURANCE_PHASE_4.md` |
| **Phase 5** | Ongoing | 12-Month Growth Plan + Pipeline B (Client Onboarding) | `INSURANCE_PHASE_5.md` |

> **Phase files are generated ONE AT A TIME.** Do not generate all phases at once.
> Start with `INSURANCE_PHASE_0.md` after this plan is approved.

> **Prototype requirement:** After all phase plan documents (Phase 0–5) are written, generate all key-page HTML prototypes (see Stage A-P above) **before beginning Phase 0 implementation.** No implementation prompt should run until the corresponding prototype is approved.

---

## Implementation Checklists

---

### Frontend Functions, Pages & Content Checklist

#### Public Pages

| Page | Route | Conversion Role | Key Sections | Dynamic? |
|------|-------|----------------|--------------|---------|
| Home | `/` | HOOK + CONVERT | Hero, InsuranceLineGrid, WhyIndependent, StatsStrip, CarrierCarousel, HowItWorks, Testimonials, AgentSpotlight, BlogPreview, QuoteCTA | No |
| Insurance Hub | `/insurance` | EDUCATE | Hero, ServiceGrid (all 15), WhyUs, FAQ | No |
| Service Page (template) | `/insurance/[slug]` | EDUCATE + CONVERT | ServiceHero, WhatItCovers, WhyUs, QuoteProcess, RateFactors, Testimonials, FAQ, RelatedServices, InlineQuoteForm | Yes — 15 pages |
| Get a Quote | `/quote` | CONVERT | 3-step form, confirmation | No |
| About | `/about` | TRUST | AboutHero, OurStory, Mission, LicensesCredentials, TeamSection, Carriers, CommunityCTA | No |
| Agents | `/agents` | TRUST | Grid of AgentCards, each with full profile | No |
| Carriers | `/carriers` | TRUST | Logo grid + brief description + "why we chose them" | No |
| Testimonials | `/testimonials` | SOCIAL PROOF | Filter by coverage type, paginated grid | No |
| Resources (Blog Hub) | `/resources` | SEO + AUTHORITY | Hero, featured, article grid, newsletter | No |
| Blog Post | `/resources/[slug]` | SEO | Article, author, related articles, inline CTA | Yes |
| FAQ | `/faq` | RETAIN | Accordion, filterable by category | No |
| Claims Help | `/claims` | RETAIN | Process explainer, contact | No |
| DMV Services | `/services/dmv` | INFORM | Service description, requirements, CTA | No |
| Notary Services | `/services/notary` | INFORM | Service description, hours, pricing, CTA | No |
| Contact | `/contact` | CONVERT | ContactGrid, Form, Map, Hours | No |
| Location pages (SEO) | `/insurance/[type]/[city]` | SEO | Localized service page template | Yes — programmatic |

#### Frontend Features & Runtime Behaviors

| Feature | Description |
|---------|-------------|
| Multi-step quote form | 3 steps, dynamic fields, validation, DB submission, email notification |
| Insurance line toggle | Admin enables/disables service lines per site; disabled lines don't appear |
| Carrier carousel | Auto-scrolling CSS animation, admin-managed logos |
| Agent profiles | DB-driven, filterable by specialty/language |
| Testimonials filter | Filter by coverage type; paginated |
| Blog | Full CMS-managed blog with categories, tags, author |
| FAQ accordion | Filterable by category, expandable |
| Google Maps embed | Contact page |
| Click-to-call | All phone numbers link `tel:` |
| Sticky mobile header | Phone number always visible on mobile scroll |
| Quote form pre-fill | `/quote?type=auto` pre-selects coverage type in Step 1 |
| Domain-based multi-site | Middleware reads domain → serves correct brokerage data |
| Theme per site | Each brokerage gets own logo, colors, fonts via `theme.json` |

---

### Backend Admin Function Checklist

#### Inherited from Medical (REUSE — baseline unchanged or field-mapped)

| Module | Status | Notes |
|--------|--------|-------|
| Admin Auth (login, sessions, RBAC) | REUSE unchanged | Same auth system |
| Sites management | REUSE unchanged | Same site CRUD |
| Site Domains | REUSE unchanged | Same domain alias system |
| Content Editor (pages, sections, variants) | REUSE unchanged | Same CMS |
| Media Library (upload, search, delete, provider import) | REUSE unchanged | Same media system |
| Admin Users (roles: platform_super_admin, site_admin, editor) | REUSE unchanged | Same RBAC |
| Blog Posts Editor | REUSE — field mapped | Same structure, insurance-specific categories |
| Testimonials Editor | REUSE — field mapped | Add `coverage_type` filter field |
| Theme / Site Settings | REUSE unchanged | Same settings panels |
| Site Onboarding Wizard | REUSE adapt | Update fields for insurance brokerage profile |

#### New Admin Modules (Insurance-Specific)

| Module | Description | CRUD | Key Fields |
|--------|-------------|------|------------|
| **Quote Requests Dashboard** | View + manage all incoming quote leads | R/U (no create in admin) | Name, phone, email, coverage types, status (New/Contacted/Quoted/Bound/Closed), assigned agent, notes, date |
| **Agents Manager** | Add/edit/delete agent profiles | Full CRUD | Name, photo, title, specialties, languages, license #, years exp, phone, email, bio, active |
| **Carriers Manager** | Manage global carrier catalog | Full CRUD | Name, logo URL, description, website, active |
| **Site Carriers** | Toggle which carriers show on this site | Update | Site → Carriers assignment (checkbox list), display order |
| **Insurance Lines** | Toggle which service lines are active per site | Update | 15 toggles per site, custom description override |
| **Lead Notifications** | Email routing for new quote requests | Update | Email recipients per site, notification template |

#### Admin Navigation Structure (Sidebar)

```
Site Related:
├── Dashboard
├── Content Editor
├── Blog Posts
├── Testimonials
├── Agents
├── Insurance Lines
├── Carriers
├── Quote Leads ← NEW
└── Site Settings

System:
├── All Sites
├── Domains
├── Media Library
├── Admin Users
└── System Settings
```

#### RBAC Expectations

| Role | Access |
|------|--------|
| `platform_super_admin` | All sites, all modules, system settings |
| `site_admin` | Own site only — all modules including Quote Leads |
| `editor` | Own site only — Content Editor, Blog, Testimonials only |

#### Database Tables (New)

```sql
-- agents: per-site agent profiles
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT,
  photo_url TEXT,
  bio TEXT,
  specialties TEXT[],           -- e.g. ['auto', 'tlc', 'commercial']
  languages TEXT[],             -- e.g. ['English', 'Spanish', 'Chinese']
  license_number TEXT,
  years_experience INTEGER,
  phone TEXT,
  email TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- carriers: global catalog of insurance carriers
CREATE TABLE carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- site_carriers: which carriers a brokerage site displays
CREATE TABLE site_carriers (
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  carrier_id UUID REFERENCES carriers(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  PRIMARY KEY (site_id, carrier_id)
);

-- insurance_lines: which service lines are enabled per site + custom content
CREATE TABLE insurance_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  line_slug TEXT NOT NULL,       -- 'auto', 'tlc', 'homeowner', etc.
  is_enabled BOOLEAN DEFAULT true,
  custom_description TEXT,       -- override default description
  sort_order INTEGER DEFAULT 0,
  UNIQUE(site_id, line_slug)
);

-- quote_requests: incoming leads from quote form
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  coverage_types TEXT[],         -- ['auto', 'home']
  preferred_language TEXT DEFAULT 'English',
  best_contact_time TEXT,
  message TEXT,
  details JSONB,                 -- dynamic per coverage type
  status TEXT DEFAULT 'new',     -- new | contacted | quoted | bound | closed
  assigned_agent_id UUID REFERENCES agents(id),
  notes TEXT,
  source TEXT DEFAULT 'website', -- website | phone | referral
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Design and Layout Checklist

#### Theme Requirements

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#0B1F3A` (Deep Navy) | Headers, dark sections, nav |
| `--color-accent` | `#C9933A` (Warm Gold) | CTAs, highlights, badges, borders |
| `--color-success` | `#1A7A4A` (Green) | "Active", "Covered", trust badges |
| `--color-danger` | `#C74B4B` (Red) | Required by law callouts, urgency |
| `--color-bg` | `#F7F8FA` | Page background |
| `--color-bg-dark` | `#0B1F3A` | Stats strips, bottom CTAs |
| `--color-text` | `#2C3E50` | Body text |
| `--color-text-muted` | `#7A8A9A` | Captions, labels |
| `--font-heading` | `Playfair Display` | All headings |
| `--font-body` | `Inter` | All body text, UI |

#### Hero Types

| Variant | Used On | Description |
|---------|---------|-------------|
| `animated-stats` | Home | Stats counters + headline + dual CTA |
| `split-image` | Service pages, About | Text left + image right |
| `centered` | Contact, FAQ, Blog Hub | Full-width centered text + CTA |
| `service-hero` | Insurance line pages | Specialty variant with coverage type badge |

#### Layout System

- Grid: 12-column, max-width 1280px, gutter 24px
- Section padding: 80px vertical desktop / 48px mobile
- Card radius: 12px
- Button radius: 8px
- Shadow: `0 2px 12px rgba(11,31,58,0.08)`
- Dark sections (navy bg): stats strip, bottom CTAs
- Light sections: everything else — `#F7F8FA` or `#FFFFFF`

#### Service Presentation Rules

- All 15 insurance lines must have: icon, name, description, CTA
- Icons: consistent line style, navy or gold color, 48×48px
- Service page pages must include: WhatItCovers section with included/excluded breakdown
- Featured services (auto, home, business) get accent treatment in grid

#### Section-Level Design Constraints

| Section | Constraint |
|---------|------------|
| Header | Phone number always visible on desktop; tap-to-call on mobile |
| Hero | Stats strip must be part of or immediately after hero on home page |
| InsuranceLineGrid | Must show all enabled lines; disabled lines hidden not greyed |
| CarrierCarousel | Must loop infinitely; show at minimum 8 logos before repeating |
| QuoteForm | Step indicator (1/3, 2/3, 3/3) always visible; phone visible at every step |
| AgentCard | License number required field; photo required — no initials placeholder |
| LicenseCredentialPanel | License numbers must appear on About page; verify link required |
| Footer | License number, disclaimer text, and "Licensed in [states]" required |
| Mobile | Phone number must be sticky on mobile scroll (top or bottom bar) |
| QuoteLeads Admin | New leads must show visual badge; email notification within 5 minutes |

---

## Content Contracts (Summary)

Full contracts with JSON schemas are defined in `INSURANCE_CONTENT_CONTRACTS.md` (generated as companion to Phase 0).

### Pages and their primary content files

| Page | Content Path | Key Sections |
|------|-------------|--------------|
| Home | `pages/home.json` | hero, insuranceLines, whyIndependent, stats, carriers, howItWorks, testimonials, agents, blog, cta |
| Insurance Hub | `pages/insurance.json` | hero, serviceGrid, whyUs, faq, cta |
| Service (template) | `pages/insurance/[slug].json` | serviceHero, whatItCovers, whyUs, quoteProcess, rateFactors, testimonials, faq, related, inlineForm |
| Quote | `pages/quote.json` | formConfig, steps, confirmation |
| About | `pages/about.json` | hero, story, mission, licenses, team, carriers, cta |
| Agents | `pages/agents.json` | hero, grid |
| Carriers | `pages/carriers.json` | hero, grid |
| Testimonials | `pages/testimonials.json` | hero, filters, grid |
| Resources Hub | `pages/resources.json` | hero, featured, grid |
| FAQ | `pages/faq.json` | hero, categories, items |
| Claims | `pages/claims.json` | hero, process, contact |
| Contact | `pages/contact.json` | hero, contactInfo, form, map, hours |

### Collection Files

| Collection | Path | Fields |
|------------|------|--------|
| Blog Posts | `blog/[slug].json` | title, slug, excerpt, body, author, date, category, coverImage, tags |
| Agents | DB table `agents` | name, photo, title, specialties, languages, license, bio, phone |
| Testimonials | DB table `testimonials` | quote, name, coverage_type, rating, date |
| Carriers | DB table `carriers` + `site_carriers` | name, logo, website |
| Insurance Lines | DB table `insurance_lines` | slug, enabled, description, sort_order |
| Quote Requests | DB table `quote_requests` | all lead fields + status + notes |

---

## First Client: Peerless Brokerage Configuration

When onboarding Peerless Brokerage Inc as the first site on this platform:

**Site slug:** `peerless-brokerage`
**Domain:** `pbiny.com`
**Services to enable:** All 15 lines (they offer the full set)
**TLC specialty:** Yes — feature prominently
**Languages:** English, Spanish, Chinese (based on NYC market)
**Service area:** NY, NJ, CT, PA

**Agents to create:** Staff profiles from pbiny.com
**Carriers to add:** Travelers, Progressive, Nationwide, Liberty Mutual, Chubb, Hartford, Zurich, and others they represent
**Stats:**
- Years in business: 20+
- Carriers: 30+
- Clients: 5,000+

---

## Phase File Generation Order

After this Complete Plan is approved:

1. Generate `INSURANCE_CONTENT_CONTRACTS.md` — JSON schema for all sections
2. Generate `INSURANCE_PHASE_0.md` — Fork + setup + theme + contracts
3. Review Phase 0 → approve → generate `INSURANCE_PHASE_1.md`
4. Continue one phase at a time

**Never generate multiple phase files in one session.**

---

*BAAM System I — Insurance Platform — Complete Plan v1.0*
*Ready for Phase 0 generation upon approval.*
