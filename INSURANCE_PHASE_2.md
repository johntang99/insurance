# BAAM System I — Insurance Brokerage Platform
# Phase 2: Conversion Engine + Authority Pages

> **System:** BAAM System I — Insurance Brokerage Platform
> **Reference files:** `@INSURANCE_COMPLETE_PLAN.md` + `@INSURANCE_PHASE_0.md` + `@INSURANCE_PHASE_1.md`
> **Prototype files:** `prototypes/quote.html` · `prototypes/blog.html` · `prototypes/agents.html` · `prototypes/service-auto.html` (all remaining service pages follow same template)
> **Prerequisite:** Phase 1 gate fully passed. All 7 core pages render. Quote form creates records. SEO baseline in place. `v0.1-phase1-complete` tagged.
> **Method:** One Cursor prompt per session. BUILD → WIRE → VERIFY every page before moving on.
> **Rule:** A page is only "done" when all three steps pass AND layout matches `prototypes/[page].html`. Never skip a done-gate.

---

## Phase 2 Overview

**Duration:** Week 3–4
**Goal:** Build the conversion engine (Quote page), the admin lead dashboard, and all Tier 2 authority pages that move prospects from CONSIDERATION → DECISION → ACTION. Complete all 15 insurance service pages. After Phase 2, the site has every page needed for a full launch.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|--------|-------|-----------|
| 2A | Quote Page — 3-Step Form | Primary conversion page — the #1 goal of the entire site | 120 min |
| 2B | Admin: Quote Request Dashboard | Lead management — view, filter, assign, update status | 90 min |
| 2C | Agents Page | Full agent roster with specialty + language filter | 60 min |
| 2D | Testimonials Page | Social proof hub with coverage-type filter | 60 min |
| 2E | Blog / Resources System | Article listing + individual article pages | 90 min |
| 2F | FAQ Page | Objection handling + category filter + SEO | 60 min |
| 2G | Remaining 12 Service Pages | Wire all remaining /insurance/[slug] content entries | 90 min |

---

## Build → Wire → Verify Checklist (Every Page)

| Check | How to Verify |
|---|---|
| **Renders from DB** | Change field in Supabase directly → reload page → change appears |
| **Form submits** | Submit test data → check quote_requests table in Supabase |
| **Admin visible** | New record visible in admin dashboard within 5 seconds |
| **Filter/search works** | Apply filter → results change without page reload |
| **Mobile** | 375px — forms usable, no overflow, all CTAs tap-friendly |
| **No hardcoded strings** | All text from DB or site.json |
| **Quote CTA reachable** | Every page links to /quote |
| **SEO tags present** | generateMetadata() returns title + description + OG |

---

## Prompt 2A — Quote Page: 3-Step Multi-Step Form

**Goal:** Build `/quote` — the primary conversion page of the entire platform. This is the most important page. It must be fast, friction-free, and mobile-perfect. Every step must feel like progress. The form submits to the database and triggers a notification to the agent team.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A3.2 Get a Quote Page, A4.2 QuoteForm spec

File: app/[locale]/quote/page.tsx
Component: components/quote/QuoteForm.tsx
API: app/api/quote/request/route.ts (extend existing from Phase 1)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 0 — Page Shell
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/quote/page.tsx

Minimal page layout — this page is ONLY the quote form. No other sections.
- No hero image (waste of time for conversion-intent visitors)
- Top: compact header with logo + phone number only (no full nav)
  OR reuse full header — whichever the site.json quote.simplifiedHeader controls (default: false)
- Center: QuoteForm component
- Right sidebar (desktop only, 30% width): Trust signals panel
- Footer: minimal (phone + license number only, or full footer — site.json controlled)
- Background: var(--color-bg-subtle) — off-white #F7F8FA — slightly different from pages

Page data from: content_entries 'pages/quote.json'
{
  "seo": {
    "title": "Get a Free Insurance Quote | [Brokerage Name]",
    "description": "Get a free insurance quote in minutes. We compare 30+ carriers to find your best rate. [Brokerage Name] — [City]."
  },
  "simplifiedHeader": false,
  "trustPanel": {
    "enabled": true,
    "headline": "Why Get a Quote From Us?",
    "points": [
      { "icon": "clock", "text": "We respond within 2 business hours" },
      { "icon": "shield", "text": "No obligation — 100% free" },
      { "icon": "store", "text": "30+ carriers compared for you" },
      { "icon": "star", "text": "4.9★ rating — 127 reviews" }
    ],
    "phoneLabel": "Prefer to call?",
    "responsePromise": "We respond within 2 business hours during business hours."
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — QuoteForm Component
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/quote/QuoteForm.tsx
This is a NEW client component ('use client').

3-step form. NO page reload between steps. All state in React useState.
Progress bar at top: Step 1 / 2 / 3 with step labels.

Progress bar visual:
  [●──────●──────●]
  Coverage  Contact  Details
  33%       66%       100%
  Each step node: filled circle when complete, ring when current, grey when future.
  Progress line: fills proportionally — var(--color-brand-500) fill.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORM — STEP 1: Coverage Selection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Heading: "What coverage are you looking for?"
Subline: "Select all that apply — we'll find your best rates for everything."

Coverage type selector:
- Show all enabled insurance_lines as selectable tiles (2-column grid, mobile: 2 col)
- Each tile: icon + name + short tagline
- State: unselected (white border) / selected (navy border + checkmark + gold bg tint)
- Multi-select: any number of tiles can be selected
- Min 1 required before Next button enables

URL param support:
- If URL has ?type=[slug]: pre-select that tile (e.g. from service page CTA)
- If URL has ?agent=[id]: store agent_id in form state for Step 2

Below tiles:
- "Not sure what you need?" link → expands a short helper accordion:
  "Tell us your situation and we'll recommend the right coverage"
  Options: "I'm a new homeowner" / "I just got a new car" / "I run a business" / "I'm a TLC driver" / "Other"
  These are soft suggestions — clicking pre-selects likely tiles but user can adjust.

Next button: "Next: Your Contact Info →" (disabled until ≥1 tile selected)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORM — STEP 2: Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Heading: "How should we reach you?"
Subline: "We'll only contact you about your quote — no spam, ever."

Fields:
- First Name (text, required) — autofocus on mount
- Last Name (text, required)
- Phone Number (tel, required)
  → format as user types: "(555) 555-5555" (US format)
  → validation: must be 10 digits
- Email Address (email, required)
  → validation: standard email format
- Best Time to Contact (radio group — large clickable options):
  ○ Morning (8am–12pm)  ○ Afternoon (12pm–5pm)  ○ Evening (5pm–8pm)  ○ Anytime
- Language Preference (select — only show if site.json.languagesServed has 2+ options):
  Options populated from site.json.languagesServed
  Default: first language in list

Layout: 2-col grid on desktop (first/last name side by side), 1-col on mobile.

Validation: show inline error below each field on blur (not on submit).
Error style: red border + error message in var(--color-danger) — same as medical codebase pattern.

Buttons:
- "← Back" (text button, returns to Step 1 — preserves Step 1 state)
- "Next: Additional Details →" (primary — disabled until all required fields valid)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORM — STEP 3: Additional Details (optional — improves quote accuracy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Heading: "A few more details (optional)"
Subline: "This helps us prepare a more accurate quote — skip anything you're not sure about."

Dynamic fields — rendered based on which coverage types were selected in Step 1.
Only show the relevant section(s). If multiple types selected, show each section with a heading.

AUTO / COMMERCIAL AUTO section (show if auto or commercial-auto selected):
  - Current Insurance Provider (text, optional, placeholder "e.g. Geico, State Farm")
  - Approx. Number of Vehicles (select: 1 / 2 / 3 / 4 / 5+)
  - Any recent accidents or violations? (radio: No / Yes)

TLC section (show if tlc selected):
  - TLC License Number (text, optional)
  - TLC Plate Renewal Due Date (date, optional)
  - Vehicle Year (text, optional)
  - Current TLC Insurer (text, optional)

HOMEOWNER section (show if homeowner selected):
  - Property Address (text, optional) — just city/zip is fine
  - Year Built (text, optional)
  - Are you currently insured? (radio: Yes / No)

BUSINESS / WORKERS COMP / CONSTRUCTION section (show if any business line selected):
  - Business Type / Industry (text, optional, placeholder "e.g. restaurant, contractor, retail")
  - Number of Employees (select: 1–5 / 6–20 / 21–50 / 51–100 / 100+)
  - Annual Revenue Estimate (select: Under $100K / $100K–$500K / $500K–$2M / Over $2M / Prefer not to say)

DEFAULT section (show for all other types / always visible):
  - Any message or questions? (textarea, optional, 4 rows)
  - How did you hear about us? (select: Google Search / Google Maps / Referral / Social Media / Existing Client / Other)

Buttons:
- "← Back" (returns to Step 2)
- "Submit My Quote Request" (gold button, full-width on mobile)
  → shows loading spinner on click
  → disabled after first click (prevent double-submit)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORM — CONFIRMATION (Step 4 — not a step, replaces form on success)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

On successful API response: replace form with confirmation panel.
Do NOT navigate away (stay on /quote).

Confirmation panel:
  ✓ (large checkmark — green circle, white checkmark)
  "Quote Request Received!"
  "Thank you, [firstName]! We'll contact you within 2 business hours."
  "We'll reach you at [phone] [email]"
  "Your coverage: [list of selected types]"

  ── What Happens Next ──
  ① We review your information
  ② We shop 30+ carriers for your best rates
  ③ We call or email you with your quote options

  [Browse Our Insurance Services]  [Return to Home]

On API error: keep form visible, show error banner at top:
  "Something went wrong — please try again or call us directly at [phone]"
  Include click-to-call phone link in error message.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API ROUTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/api/quote/request/route.ts (extend from Phase 1)

POST body:
{
  siteId: string,
  coverageTypes: string[],          // slugs from insurance_lines
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  contactTime: string,
  languagePreference?: string,
  details: {
    currentInsurer?: string,
    vehicleCount?: string,
    hasIncidents?: boolean,
    tlcLicenseNumber?: string,
    tlcRenewalDate?: string,
    propertyAddress?: string,
    businessType?: string,
    employeeCount?: string,
    annualRevenue?: string,
    message?: string,
    referralSource?: string,
  },
  source: string,                    // 'quote_page' | 'home_cta' | 'contact_form' | 'service_page'
  agentId?: string,                  // from ?agent= URL param
}

DB write: INSERT into quote_requests table (from Phase 0C schema):
{
  site_id, first_name, last_name, phone, email,
  coverage_types (jsonb array of slugs),
  contact_time, language_preference,
  details (jsonb — all Step 3 fields),
  source, agent_id,
  status: 'new',
  created_at: now()
}

Notification (if site.json notificationEmail is set):
  Send email to notificationEmail using existing email utility from medical codebase.
  Subject: "New Quote Request — [coverageTypes] — [firstName] [lastName]"
  Body: all form fields in plain text + link to admin dashboard record.
  NOTE: Only send if SMTP/Resend config exists. Skip silently if not configured.

Rate limiting: max 10 quote requests per IP per hour (use existing rate-limit util if present, or simple in-memory Map check).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRUST PANEL (desktop sidebar)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/quote/QuoteTrustPanel.tsx

Sticky sidebar on desktop (position: sticky, top: 2rem).
Shows while form is visible, hides on confirmation.

Content (read from quote.json trustPanel):
  Headline: "Why Get a Quote From Us?"
  4 trust points with icons (from quote.json trustPanel.points)
  Google rating display: "★★★★★ 4.9 (127 reviews)" — links to googleReviewUrl
  Phone callout:
    "Prefer to call?"
    [phone number — large, click-to-call]
    "Mon–Sat 9am–6pm"
  Response promise:
    "We respond to all quote requests within 2 business hours."
  License display: "Licensed in [states]"

Mobile: trust panel collapses — shown as a compact strip above the form (not sidebar).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Editor for pages/quote.json:
- Trust panel: headline, 4 points (repeatable — icon + text), phone label, response promise
- Simplified header: toggle
- SEO: title, description

In admin Site Settings, add:
- "Notification Email" — email address for new quote alerts → site.json.notificationEmail
```

**Done-Gate 2A:**
- `/quote` renders with 3-step form
- Step 1: coverage tiles load from insurance_lines DB
- ?type=auto pre-selects Auto tile
- Step 2: phone formats as user types, inline validation on blur
- Step 3: shows TLC fields only when TLC was selected in Step 1
- Submitting creates a quote_requests record in Supabase
- Confirmation panel shows with first name and selected coverage types
- Error banner appears if API fails
- Trust panel visible on desktop (sticky), compact on mobile
- Google rating shows from site.json data
- Mobile (375px): form usable with thumb, submit button full-width
- Double-submit prevented (button disabled after first click)
- Back button preserves form state

---

## Prompt 2B — Admin: Quote Request Lead Dashboard

**Goal:** Build the admin lead management dashboard at `/admin/quote-requests`. This is where the brokerage team sees, filters, and manages all incoming quote requests.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A4.2 QuoteLeadDashboard spec

File: app/admin/(protected)/quote-requests/page.tsx
This is an ADMIN page — protected by existing auth middleware. Reuse admin layout patterns exactly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DASHBOARD LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Page heading: "Quote Requests"
Sub-heading: "Manage incoming quote requests — [count] total, [count] new"

SUMMARY CARDS ROW (4 cards):
  [ New: X ] [ Contacted: X ] [ Quoted: X ] [ Bound: X ]
  Each card: count + label + colored dot (New=red, Contacted=yellow, Quoted=blue, Bound=green)
  Clicking a card filters the table to that status.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILTER BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Horizontal filter row above the table:
- Status (select): All | New | Contacted | Quoted | Bound | Closed
- Coverage Type (select): All | [insurance_lines list]
- Assigned Agent (select): All | [agents list]
- Date Range (date picker): From — To (defaults to last 30 days)
- Search (text input): searches name, phone, email
- [Clear Filters] button

Filters apply immediately (no separate Apply button).
URL params: update ?status=&type=&agent= so filter state is bookmarkable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEADS TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Columns:
| Date ↕ | Name | Phone | Coverage Types | Source | Assigned Agent | Status | Actions |

- Date: formatted "Mar 14, 2026 · 2:34pm", sortable
- Name: "First Last"
- Phone: click-to-call link (tel:)
- Coverage Types: pill badges for each type (e.g., "Auto" "TLC") — truncate at 3, show "+X more" if longer
- Source: small badge — "Quote Page" | "Home CTA" | "Contact Form" | "Service Page"
- Assigned Agent: dropdown (inline editable) — agents list + "Unassigned"
- Status: colored badge — dropdown (inline editable):
  New (red) | Contacted (yellow) | Quoted (blue) | Bound (green) | Closed (grey)
- Actions: "View" button → opens detail drawer

Pagination: 25 rows per page, page navigation at bottom.
Default sort: newest first (created_at DESC).

"New" rows: bold text + light yellow row background until status changes from 'new'.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETAIL DRAWER (slide-in panel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clicking "View" opens a right-side drawer (40% width desktop, full-screen mobile).
Drawer closes with X button or Escape key.

Drawer sections:

CONTACT INFO:
  Name: [First Last]
  Phone: [click-to-call]
  Email: [mailto: link]
  Best Contact Time: [time]
  Language Preference: [language]
  Submitted: [date/time]
  Source: [source]

COVERAGE REQUESTED:
  Pill badges for each coverage type

ADDITIONAL DETAILS:
  All Step 3 fields in a clean label → value layout
  Skip empty fields.
  Show "message" in a styled blockquote if present.

MANAGEMENT:
  Status dropdown (save on change)
  Assigned Agent dropdown (save on change)
  Notes textarea — free text notes by the agent
    [Save Notes] button
  Internal notes display: show all saved notes in reverse-chronological order
    Each note: timestamp + note text (future: could be per-admin but MVP is one shared notes field)

  "Mark as Contacted" quick button (sets status to 'contacted' + timestamps)
  "Mark as Quoted" quick button
  "Mark as Bound" quick button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API ROUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GET  /api/admin/quote-requests
  Query params: status, coverage_type, agent_id, from_date, to_date, search, page, per_page
  Returns: { data: QuoteRequest[], total: number, page: number }
  Auth: admin session required

PATCH /api/admin/quote-requests/[id]
  Body: { status?, agent_id?, notes? }
  Updates status, assigned agent, or notes
  Auth: admin session required

The quote_requests table schema (from Phase 0C) already has:
  id, site_id, first_name, last_name, phone, email, coverage_types (jsonb),
  contact_time, language_preference, details (jsonb), source, agent_id,
  status, notes, created_at, updated_at

Add migration if notes column doesn't exist:
  ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS notes text;
  ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add "Quote Requests" to admin sidebar navigation:
- Position: after "Content" group, before "Blog"
- Icon: document or inbox icon
- Badge: show count of 'new' status records (live count from API)
  Badge turns red if count > 0.
  This count refreshes every 60 seconds (simple setInterval in admin layout).
```

**Done-Gate 2B:**
- `/admin/quote-requests` accessible with admin login
- Summary cards show correct counts per status
- Table shows all quote_requests records for this site
- Status filter works — "New" shows only new records
- Coverage type filter shows only records with that type
- Inline status dropdown saves immediately
- Inline agent assignment saves immediately
- Detail drawer opens on "View" click
- Notes can be saved in drawer
- "New" rows have yellow background and bold text
- Sidebar badge shows count of new leads
- Test: submit quote from /quote → appears in admin within 5 seconds

---

## Prompt 2C — Agents Page

**Goal:** Build `/agents` — the full agent roster page. Prospects should be able to find the right agent for their specific need (language, specialty) and contact them directly.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A4.2 AgentCard spec

File: app/[locale]/agents/page.tsx
Reads from: agents table + content_entries 'pages/agents.json'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — PageHero
  Heading: "Meet Our Team" (from agents.json)
  Subline: "Licensed professionals with deep expertise in every coverage type"
  CTA: "Get a Free Quote" → /quote

SECTION 2 — AgentFilterBar (NEW client component)
  File: components/agents/AgentFilterBar.tsx

  Filter controls:
  - Specialty (select): All | [insurance_lines list — fetched from DB]
  - Language (select): All | [unique languages from all agents.languages field]
  - Search (text): name or title
  Filters update the grid below immediately (client-side filtering of preloaded data).

SECTION 3 — AgentGrid
  All active agents (agents table WHERE active = true ORDER BY display_order).
  Preload all agents on page load (not paginated — typically < 20 agents).
  Filter client-side using AgentFilterBar state.

  AgentCard component (FULL variant):
  File: components/agents/AgentCard.tsx

  ┌──────────────────────────────────────┐
  │  [PHOTO — 120×120 round]             │
  │  John Smith                          │  ← name: Playfair Display, 1.2rem
  │  Senior Insurance Broker             │  ← title: Inter, 0.875rem, muted
  │                                      │
  │  Specialties:                        │
  │  [Auto] [TLC] [Commercial Auto]      │  ← pill badges, var(--color-brand-100)
  │                                      │
  │  Languages:                          │
  │  [English] [Spanish]                 │  ← pill badges, var(--color-gold-100)
  │                                      │
  │  12 years experience                 │  ← small text
  │  NY Lic. #LA-000000                  │  ← small text, grey
  │                                      │
  │  [Get a Quote →]  [📞 Direct Line]   │  ← two action buttons
  └──────────────────────────────────────┘

  Props mapped from agents table:
  - photo: agents.photo_url
  - name: agents.name
  - title: agents.title
  - specialties: agents.specialties (jsonb array of insurance_line slugs → resolve to names)
  - languages: agents.languages (jsonb array of strings)
  - yearsExperience: agents.years_experience
  - licenseNumber: agents.license_number (show only if agents.show_license = true)
  - quoteLink: /quote?agent=[id]
  - directPhone: agents.direct_phone (only show if non-empty)

  "Get a Quote" → /quote?agent=[id]
  "Direct Line" → tel:[directPhone] (only render if directPhone set)

  Desktop: 3-column grid
  Tablet: 2-column
  Mobile: 1-column (full-width cards)

SECTION 4 — AgentsCTA (REUSE QuoteCTASection — 'cta-only' variant)
  "Not sure which agent to work with?"
  "Call our main line and we'll match you with the right specialist."
  CTA: "Call Us" + "Get a Quote"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Admin Agents page (admin/agents/ — already exists from medical codebase as Doctors):
  Rename or adapt to "Agents".
  Fields to verify/add:
  - Name (text)
  - Title (text, e.g. "Senior Broker")
  - Photo (image picker)
  - Bio (textarea)
  - Direct Phone (text)
  - Specialties (multi-select from insurance_lines — using tag picker)
  - Languages (tag input — free text)
  - Years Experience (number)
  - License Number (text)
  - Show License on Public Page (checkbox)
  - Show on Home Spotlight (checkbox — links to Phase 1 home AgentSpotlight)
  - Active (checkbox)
  - Display Order (drag to reorder)

Content Editor for pages/agents.json:
  - Hero: heading, subline, CTA
  - CTA section: heading, subline
```

**Done-Gate 2C:**
- `/agents` renders with all active agents
- Specialty filter: select "TLC" → only agents with TLC specialty shown
- Language filter: select "Spanish" → only Spanish-speaking agents
- Combined filters work together
- "Get a Quote" links correctly include agent param
- "Direct Line" button absent when no direct_phone
- Admin agents page allows adding/editing all fields
- New agent added in admin → appears on /agents after reload
- Mobile: full-width cards, all content legible

---

## Prompt 2D — Testimonials Page

**Goal:** Build `/testimonials` — the full social proof hub. Prospects in the CONSIDERATION phase need to see volume (25+ reviews) and relevance (reviews for their specific coverage type).

```
You are building BAAM System I — Insurance Brokerage Platform.

File: app/[locale]/testimonials/page.tsx
Reads from: testimonials table + content_entries 'pages/testimonials.json'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — TestimonialsHero
  Heading: "What Our Clients Say" (from testimonials.json)
  Subline: "[count]+ reviews — real clients, real results"
    Replace [count] with actual testimonials count from DB.
  Star aggregate: ★★★★★ — Google average rating from site.json.googleReviewScore
  "Read our Google Reviews →" link if site.json.googleReviewUrl set

SECTION 2 — TestimonialsFilterBar (NEW client component)
  File: components/testimonials/TestimonialsFilterBar.tsx

  Filter controls:
  - Coverage Type (select): All | [insurance_lines list from DB — show only types that have at least 1 testimonial]
  - Rating (select): All | 5 Stars | 4+ Stars
  - Search (text): search quote text and reviewer name
  Filters update the grid below immediately (client-side).

SECTION 3 — TestimonialsGrid
  Load all published testimonials (published = true) ordered by featured DESC, created_at DESC.
  Preload all (typically < 100) for client-side filtering.

  TestimonialCard component:
  Each card:
  ┌──────────────────────────────────┐
  │  ★★★★★                           │  ← gold stars
  │  "The team at Peerless helped    │
  │   me get TLC insurance same-day  │
  │   when I was panicking about     │
  │   my plate renewal..."          │
  │                                  │
  │  — Maria Rodriguez               │  ← bold name
  │  Auto · TLC Insurance            │  ← coverage type badge(s)
  │  [Google] [Yelp]                 │  ← source badge if set
  └──────────────────────────────────┘

  Fields from testimonials table:
  - quote (text)
  - reviewer_name (string)
  - star_rating (1–5)
  - coverage_type (string — single slug, shown as resolved name)
  - source (string: 'google' | 'yelp' | 'direct' — badge style)
  - featured (boolean — featured cards get a subtle gold border)

  Layout: 3 columns desktop, 2 tablet, 1 mobile (masonry-style optional — CSS columns, not JS)
  Featured testimonials: appear first regardless of filter state.

  Empty state (when filter returns 0 results):
  "No reviews found for this filter. [Clear Filter] to see all reviews."

SECTION 4 — GoogleReviewCTA (show if site.json.googleReviewUrl set)
  Callout box:
  "Satisfied with our service? Leave us a Google review — it takes 30 seconds and means the world to us."
  [Leave a Google Review →] button → googleReviewUrl

SECTION 5 — QuoteCTASection (REUSE — 'cta-only')
  "Ready to join our satisfied clients?"
  "Get a Free Quote" + "Call Us"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Admin Testimonials page (admin/testimonials/ — reuse from medical codebase):
  Fields to verify/add:
  - Quote text (textarea)
  - Reviewer Name (text)
  - Star Rating (1–5 star picker)
  - Coverage Type (select from insurance_lines — REQUIRED for filter to work)
  - Source (select: Google | Yelp | Direct | Other)
  - Featured (checkbox)
  - Published (checkbox)
  - Display Order (drag to reorder)

Content Editor for pages/testimonials.json:
  - Hero heading, subline
  - Google review CTA: enabled toggle, button label
  - Bottom CTA heading, subline
```

**Done-Gate 2D:**
- `/testimonials` shows 25+ testimonials from DB
- Coverage type filter: selecting "TLC" shows only TLC-tagged reviews
- Search: type "fast" → cards matching "fast" in quote text filter correctly
- Featured testimonials have gold border distinction
- Aggregate star rating shows in hero from site.json
- Google Review CTA link opens correct URL
- Empty state message shows when filter returns 0 results
- Admin testimonials: coverage_type field is selectable dropdown (not freetext)

---

## Prompt 2E — Blog / Resources System

**Goal:** Build the full blog system: listing page at `/resources`, individual article page at `/resources/[slug]`. Insurance buyers search for educational content — this is the SEO engine.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: @INSURANCE_COMPLETE_PLAN.md A6.4 Blog Content Plan

This is a REUSE of the medical blog system. The codebase already has a working blog.
DO NOT rebuild. Extend and adapt for insurance context.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Verify existing blog system
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The existing codebase should have:
- app/[locale]/blog/[slug]/page.tsx — OR — app/[locale]/resources/[slug]/page.tsx
- Admin blog editor at admin/blog/
- blog_posts table in Supabase

ACTION: Verify these exist. If blog routes are at /blog, ADD REDIRECTS for /resources → /blog
and /resources/[slug] → /blog/[slug] (301 redirects via next.config.js redirects array).
Preferred: rename the route to /resources if the blog route doesn't yet exist.
Do NOT duplicate the blog codebase — just point /resources to existing blog system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Adapt Blog Listing (/resources)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/resources/page.tsx (rename or alias from /blog)

Page content from: content_entries 'pages/resources.json'

SECTION 1 — ResourcesHero
  Heading: "Insurance Resource Center" (from resources.json)
  Subline: "Guides, tips, and explainers to help you make the best coverage decisions"
  CTA: "Get a Free Quote" → /quote

SECTION 2 — CategoryTabsBar (NEW — insurance-specific blog categories)
  File: components/blog/BlogCategoryTabs.tsx (new or extend if exists)

  Tabs for blog_post categories relevant to insurance:
  All | Auto | Home | Business | TLC | Commercial | Tips & Guides
  Filter updates the article grid below immediately (client-side OR server-side with URL param).
  Read categories from: blog_posts.category field — show only categories with published posts.

SECTION 3 — FeaturedArticle (REUSE existing if it exists)
  Show the most recent published post with featured = true.
  Large card: full-width banner image, large headline, excerpt, date, "Read Article →"

SECTION 4 — ArticleGrid
  Show remaining published articles (exclude the featured one).
  ArticleCard (reuse existing blog card component):
  - Cover image (with fallback if no image: pattern background using category color)
  - Category badge
  - Title
  - Excerpt (2 lines)
  - Date + estimated read time
  - "Read More →"

  Layout: 3-column grid desktop, 2 tablet, 1 mobile.
  Pagination: 9 articles per page (or infinite scroll if already implemented).

SECTION 5 — NewsletterOrCTA
  "Stay informed — get insurance tips in your inbox" (if email newsletter configured)
  OR: REUSE QuoteCTASection 'cta-only'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Adapt Article Page (/resources/[slug])
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/resources/[slug]/page.tsx (extend existing blog article page)

Insurance-specific additions to the existing article layout:

1. ARTICLE SIDEBAR (desktop — 30% width, sticky):
   - "Get a free quote" gold CTA button
   - Phone number + call label
   - Related insurance type: if article has a related_type field (slug), show that service tile
     Read from: blog_posts.related_type (insurance_line slug)
   - "Related Articles" — 3 articles from same category

2. INLINE CTA (between content sections — approx. midpoint of article):
   - Gold-background callout box:
     "Ready to get coverage? We'll find your best rate in 2 hours."
     [Get a Free Quote] button
   - Injected after the 3rd paragraph (or after the first <h2> tag) in rendered markdown

3. RELATED ARTICLES (below article, above footer):
   - "You might also like" — 3 articles from same category
   - Reuse ArticleCard component

4. ARTICLE SEO:
   - Article schema.org: Article type with author, datePublished, publisher
   - Read author from: blog_posts.author_name (or site.json defaultAuthor if empty)
   - OG type: 'article'
   - Twitter card: summary_large_image

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Insurance Blog Categories in Admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin Blog Editor (admin/blog/):
  Add these fields to the post form:
  - "Category" (select): Auto | Home | Business | TLC | Commercial | Tips & Guides | Other
    → blog_posts.category
  - "Related Insurance Type" (select from insurance_lines):
    → blog_posts.related_type (insurance_line slug)
    → Used in article sidebar to show the related service tile
  - "Estimated Read Time" (number, minutes):
    → blog_posts.read_time (auto-calculate from word count if empty: Math.ceil(wordCount / 200))
  - "Featured" (checkbox): appears in FeaturedArticle spot on listing page
```

**Done-Gate 2E:**
- `/resources` renders with all 8 seeded blog posts
- Category tabs: clicking "TLC" shows only TLC-tagged articles
- Featured article (featured=true) renders as large card
- Article grid shows remaining articles in 3-column layout
- `/resources/auto-insurance-cost-guide` (or any slug) renders full article
- Sidebar shows "Get a Free Quote" CTA and related service tile
- Inline CTA appears midway through article content
- "Related Articles" shows 3 same-category articles below content
- Article schema.org JSON-LD in page head
- Admin blog editor shows Category + Related Insurance Type fields
- /resources and /blog both work (redirect in place if /blog is the existing route)

---

## Prompt 2F — FAQ Page

**Goal:** Build `/faq` — the full objection-handling page. Organized by topic, with search, and optimized for SEO (FAQPage schema).

```
You are building BAAM System I — Insurance Brokerage Platform.

File: app/[locale]/faq/page.tsx
Reads from: content_entries 'pages/faq.json'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — FAQHero
  Heading: "Frequently Asked Questions" (from faq.json)
  Subline: "Everything you need to know about working with us"
  Search box: "Search FAQ..." — filters questions below as user types

SECTION 2 — FAQCategoryTabs (client component)
  Tabs: All | General | Auto | Home | Business | TLC | Claims | About Us
  Tabs read from faq.json categories array (admin-configurable).
  Clicking a tab filters the accordion below.
  Search overrides the tab filter (shows matching across all categories).

SECTION 3 — FAQAccordion (client component)
  File: components/faq/FAQAccordion.tsx

  Questions load from faq.json → questions array:
  [
    {
      "category": "general",
      "question": "What is an independent insurance broker?",
      "answer": "An independent broker works for you..."
    },
    ...
  ]

  Group questions by category.
  Each category shows as a sub-heading if "All" tab is selected.
  Each question: accordion row (question text as trigger, answer expands on click).
  Only one question open at a time within a category (close others on open).
  Smooth CSS transition (max-height 0 → auto).

  Accordion item anatomy:
  [▼] What is an independent insurance broker?   ← clickable row
      An independent broker works for you, not      ← expanded answer
      the insurance company. We represent your...
      [Still have questions? Call us: [phone]]    ← link at end of each answer

  Empty state (search returns 0 results):
  "No results for '[query]'. Try a shorter search or [browse all questions]."

SECTION 4 — FAQContactStrip
  Below the accordion:
  "Still have questions? We're here to help."
  3-column mini grid:
  [ 📞 Call Us | [phone] ] [ ✉ Email | [email] ] [ 💬 Get a Quote | Get a Free Quote → ]

SECTION 5 — QuoteCTASection (REUSE — 'cta-only')

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEO — FAQPage Schema
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inject FAQPage structured data covering ALL questions (not just visible ones):
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[question text]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[answer text — plain text, no HTML]"
      }
    },
    ...
  ]
}
</script>

Include ALL questions from faq.json in the schema, regardless of current tab filter.
Max 50 questions in schema (Google's practical limit for FAQ rich results).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEED DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add these 30 questions to faq.json in the Phase 0E seed data (or add now if not done):

GENERAL (8 questions):
- What is an independent insurance broker?
- How is an independent broker different from a captive agent?
- How do you make money if quotes are free?
- How many insurance companies do you work with?
- What states do you serve?
- Can I bundle multiple types of insurance with you?
- How long does it take to get a quote?
- What information do I need to get a quote?

AUTO (4 questions):
- What is the minimum auto insurance required in New York?
- Does my credit score affect my auto insurance rate?
- Can I get coverage if I have accidents or violations?
- What is uninsured motorist coverage and do I need it?

HOME (4 questions):
- What does homeowner insurance typically not cover?
- Is flood insurance included in homeowner insurance?
- How much homeowner insurance do I need?
- Should I bundle home and auto insurance?

BUSINESS (4 questions):
- What is a BOP (Business Owner Policy)?
- Is workers compensation insurance required in New York?
- What is general liability insurance and who needs it?
- How much does business insurance typically cost?

TLC (4 questions):
- What is TLC insurance and who needs it?
- How fast can you bind TLC insurance?
- What documents do I need for TLC insurance?
- What happens if my TLC plate expires without insurance?

CLAIMS (3 questions):
- What do I do after an accident or loss?
- How do I file a claim?
- Will filing a claim raise my rates?

ABOUT US (3 questions):
- How long have you been in business?
- Are you licensed in my state?
- Do you have an office I can visit?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Editor for pages/faq.json:
- Categories array: repeatable — { id (slug), label }
- Questions array: repeatable — { category (select), question (text), answer (textarea) }
  Questions reorderable within each category by drag.
- Hero: heading, subline
- Contact strip: heading

IMPORTANT: faq.json is likely to grow large (50+ questions).
Ensure the admin Content Editor renders the questions list with
virtual scrolling or at minimum collapses by category for manageability.
```

**Done-Gate 2F:**
- `/faq` renders with 30 seeded questions
- Category tabs: "Auto" tab shows only 4 auto questions
- Search: type "broker" → shows all questions with "broker" in question or answer
- Accordion: clicking question expands answer, clicking again collapses
- Only one accordion item open at a time within a category
- FAQ schema.org JSON-LD in page source (view source → search "FAQPage")
- Schema includes ALL 30 questions text
- Contact strip shows phone and email as click-to-call/mail links
- Admin FAQ editor: question/answer/category all editable

---

## Prompt 2G — Remaining 12 Insurance Service Pages

**Goal:** Wire content entries for the 12 remaining service pages so they all render correctly using the template built in Phase 1D. Every page needs its own JSON in the DB.

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: Phase 1D — the service page template at app/[locale]/insurance/[slug]/page.tsx already exists.

This prompt ONLY adds content_entries JSON to the DB.
DO NOT modify the template component.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REMAINING SERVICE PAGES TO WIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1D already wired:
✅ /insurance/auto
✅ /insurance/tlc
✅ /insurance/homeowner

Wire these 12 remaining pages by creating content_entries in Supabase:
Path: 'pages/insurance/[slug].json'

For each page, create a JSON following the exact schema defined in Phase 1D.
Use the insurance_lines seed data from Phase 0E as the source for icon, name, and tagline.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT ENTRY TEMPLATE (applies to all 12)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each JSON follows this structure (adapt content per insurance type):
{
  "seo": {
    "title": "[Type] Insurance in [City] | [Brokerage Name]",
    "description": "[Type-specific 155-char description with city and phone]"
  },
  "hero": {
    "_variant": "service",
    "subline": "[Type-specific value proposition — 1 sentence]",
    "stats": [
      { "value": "[relevant stat]", "label": "[label]" },
      { "value": "Same-Day", "label": "Quote Available" }
    ],
    "image": "/uploads/peerless/services/[slug]-hero.jpg"
  },
  "whatItCovers": {
    "heading": "What [Type] Insurance Covers",
    "coveredItems": [...],
    "notCoveredItems": [...],
    "whoNeedsIt": "[1-2 sentences]",
    "isRequired": [true/false],
    "requiredNote": "[if required — the legal note]"
  },
  "whyUs": {
    "heading": "Why Choose [Brokerage Name] for [Type] Insurance?",
    "reasons": [
      { "icon": "compare", "headline": "[X]+ Carrier Options", "body": "[1 sentence]" },
      { "icon": "speed", "headline": "[Speed claim]", "body": "[1 sentence]" },
      { "icon": "expert", "headline": "[Expertise claim]", "body": "[1 sentence]" }
    ]
  },
  "rateFactors": {
    "heading": "What Affects Your [Type] Insurance Rate?",
    "factors": [
      { "factor": "[Factor 1]", "impact": "[Impact description]" },
      ...
    ],
    "savingsTip": "[Type-specific saving tip]"
  },
  "quoteProcess": {
    "heading": "How to Get Your [Type] Quote",
    "steps": [...],
    "cta": { "label": "Get My [Type] Quote", "href": "/quote?type=[slug]" }
  },
  "faq": [
    { "question": "[Q1]", "answer": "[A1]" },
    { "question": "[Q2]", "answer": "[A2]" },
    { "question": "[Q3]", "answer": "[A3]" },
    { "question": "[Q4]", "answer": "[A4]" },
    { "question": "[Q5]", "answer": "[A5]" }
  ],
  "relatedServices": ["[slug1]", "[slug2]", "[slug3]"],
  "quoteCta": {
    "heading": "Get Your [Type] Insurance Quote Today",
    "subline": "Free quote. No obligation. We shop [X]+ carriers for your best rate."
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT SPECS — PER PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Write complete JSON for all 12 pages. Key differentiators per type:

/insurance/commercial-auto:
  Hero subline: "Coverage for fleets, delivery vehicles, contractors, and commercial drivers"
  IsRequired: true (commercial plates require commercial auto)
  Required note: "Commercial vehicles cannot use personal auto policies — required by NY DMV"
  Rate factors: vehicle type/GVWR, driver history, annual mileage, cargo type
  Related: auto, business, workers-comp
  FAQ: fleet discounts / named driver policies / hired & non-owned auto / COI requests

/insurance/business:
  Hero subline: "Business Owner Policy — GL + commercial property + business income in one policy"
  Who needs it: Any business with a physical location, employees, or client-facing operations
  IsRequired: false (but required by most commercial leases)
  Required note: "Most commercial landlords require GL coverage as a lease condition"
  Rate factors: industry type, annual revenue, location, claims history
  Related: workers-comp, construction, commercial-property
  FAQ: what BOP covers / GL vs BOP / how much GL coverage / certificate of insurance turnaround

/insurance/workers-comp:
  Hero subline: "Required for all employers in New York — we make compliance fast and affordable"
  IsRequired: true
  Required note: "New York State law requires all employers with 1+ employees to carry workers compensation insurance (NY WCL §10)"
  Hero stats: "Required by NY Law" + "Same-Day Binding Available"
  Rate factors: payroll, class code (job type), claims history, industry
  Related: business, disability, construction
  FAQ: what jobs require it / sole proprietor exemption / audit process / ghost policies

/insurance/disability:
  Hero subline: "Protect your income if injury or illness keeps you from working"
  IsRequired: false
  Who needs it: Self-employed, professionals, business owners, employees not covered by employer
  Rate factors: age, occupation, elimination period, benefit period, health history
  Related: group-health, workers-comp, life (if added later)
  FAQ: short vs long term / own-occupation definition / elimination period / employer-provided vs individual

/insurance/construction:
  Hero subline: "GL + builders risk + workers comp — full coverage for contractors and developers"
  IsRequired: false (but required for most contracts and permits)
  Required note: "Most general contractors and developers require subcontractors to carry GL + workers comp as a contract condition"
  Hero stats: "Fast COI Turnaround" + "All Trades Covered"
  Rate factors: project type, contract value, subcontractor status, claims history
  Related: workers-comp, business, commercial-auto
  FAQ: what GL covers for contractors / builders risk / certificate of insurance / wrap-up policies / subcontractor requirements
  Special callout (like TLC): "⚡ Need a COI Fast? We issue certificates of insurance same-day."
    Add this to whyUs section as a highlighted callout box.
    Read from: construction.json whyUs.coiCallout (boolean)

/insurance/motorcycle:
  Hero subline: "Year-round or seasonal coverage — full or liability-only options"
  IsRequired: true (liability required for street use in NY)
  Rate factors: bike type/cc, rider age, riding history, storage/garage
  Related: auto, boat
  FAQ: year-round vs seasonal / liability-only vs full / storage rates / helmet laws and insurance

/insurance/boat:
  Hero subline: "Agreed value marine coverage — protect your vessel on and off the water"
  IsRequired: false (marinas often require it)
  Rate factors: vessel type/length, value, usage area, experience, storage
  Related: motorcycle, homeowner (watercraft rider)
  FAQ: what marine covers / agreed vs actual cash value / winterization coverage / liability on water

/insurance/travel:
  Hero subline: "Trip cancellation, medical emergency, and baggage coverage — individual and group rates"
  IsRequired: false
  Rate factors: trip cost, destination, trip length, traveler age, adventure activities
  Related: group-health
  FAQ: what trip cancellation covers / medical evacuation / pre-existing conditions / group rates / COVID coverage

/insurance/group-health:
  Hero subline: "ACA-compliant employer-sponsored health plans for small and mid-size businesses"
  IsRequired: false (required under ACA for 50+ FTE employers)
  Required note: "Under the ACA, employers with 50+ full-time employees must offer qualifying health coverage"
  Rate factors: group size, age mix, plan tier (Bronze/Silver/Gold), state
  Related: disability, workers-comp, business
  FAQ: minimum contribution rules / how group rates compare to individual / COBRA / dental and vision add-ons / open enrollment

/insurance/commercial-property:
  Hero subline: "Cover your building, equipment, and inventory against fire, theft, and more"
  IsRequired: false (required by most commercial mortgages and leases)
  Required note: "Most commercial lenders and landlords require property insurance as a loan or lease condition"
  Rate factors: building age/construction, location, occupancy type, coverage amount
  Related: business, construction, workers-comp
  FAQ: BOP vs standalone property / replacement cost vs actual cash value / flood exclusion / equipment breakdown / business interruption

/services/claims:
  Note: This is NOT an /insurance/[slug] page — it's at /services/claims
  File: app/[locale]/services/claims/page.tsx (new static-ish page)
  Simpler structure — 5 sections only:
  1. PageHero: "Claims Assistance" — "We're in your corner when you need to file a claim"
  2. ClaimsProcessSection: 4-step process — Report → Document → Submit → Follow Up
  3. WhatWeDoSection: 3-col — "We guide you through the process" / "We communicate with the carrier" / "We advocate for fair settlement"
  4. FAQAccordion (inline, no separate component): 3-5 claims-specific questions
  5. ClaimsCTASection: "Need to report a claim? Call us immediately."
     Phone (prominent) + email + "or submit your claim info" form (name, phone, policy type, brief description)
     Form submits to /api/quote/request with source: 'claims'

/services/dmv:
  Note: At /services/dmv — simpler add-on services page
  File: app/[locale]/services/dmv/page.tsx
  3 sections: PageHero + ServicesList (title registration, plate transfers, renewal, etc.) + ContactCTA

/services/notary:
  Note: At /services/notary
  File: app/[locale]/services/notary/page.tsx
  3 sections: PageHero + ServicesList (document notarization, hours, cost) + ContactCTA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Create /services/* pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For /services/claims, /services/dmv, /services/notary:
Create simple new page files (3–5 sections each).
These are NOT insurance service pages — they use simpler layouts.
Reuse existing section components (PageHero, QuoteCTASection, FAQ accordion).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All 12 /insurance/[slug] pages are already wired via the Phase 1D template.
Only content_entries JSON needs to exist in DB — no new admin UI needed.

For /services/* pages:
Add content_entries for pages/services/claims.json, pages/services/dmv.json, pages/services/notary.json.
Admin editable via existing Content Editor (same path-based routing as other pages).
```

**Done-Gate 2G:**
- All 15 /insurance/[slug] pages render without 500 errors
- `/insurance/workers-comp` shows "Required by NY Law" in hero stats
- `/insurance/construction` shows COI callout box in WhyUs section
- `/insurance/commercial-auto` shows "commercial vehicles cannot use personal policies" note
- `/services/claims` renders 5 sections, claim submission form works
- `/services/dmv` and `/services/notary` render 3-section layout
- All 15 service page FAQ sections have 5+ questions
- All 15 pages have generateMetadata() returning correct title/description
- Admin Content Editor accessible for every service page JSON
- Sitemap.xml updated to include all 15 service pages + 3 /services/ pages

---

## Phase 2 Completion Gate

Before tagging `v0.2-phase2-complete` and moving to Phase 3, verify ALL of the following:

| Check | Page(s) | How to Verify |
|-------|---------|---------------|
| Quote form: 3 steps, no page reload | `/quote` | Step through form |
| TLC tile pre-selected from service page CTA | `/quote?type=tlc` | Check tile state |
| Quote submit → DB record created | `/quote` | Submit test → Supabase table |
| Confirmation panel shows selected types | `/quote` | Read confirmation text |
| Admin quote-requests table shows new record | `/admin/quote-requests` | Check within 10s |
| Status dropdown saves immediately | `/admin/quote-requests` | Change status → refresh → persists |
| Drawer opens and shows all form data | `/admin/quote-requests` | Click View on any record |
| Agents filter by specialty | `/agents` | Select "TLC" specialty |
| Agents filter by language | `/agents` | Select "Spanish" language |
| Testimonials coverage filter works | `/testimonials` | Select "Auto" type |
| Search filter on FAQ works | `/faq` | Type "broker" in search |
| FAQ schema.org in page source | `/faq` | View source → FAQPage |
| Blog category tabs filter articles | `/resources` | Click "TLC" tab |
| Inline quote CTA appears in article | `/resources/[any-slug]` | Scroll article midpoint |
| All 15 /insurance/ pages render | All slugs | Test 5 random slugs |
| /services/claims form submits | `/services/claims` | Submit test claim |
| Workers comp shows "Required by Law" | `/insurance/workers-comp` | Check hero stats |
| Construction shows COI callout | `/insurance/construction` | Check WhyUs section |
| Sitemap includes all 18 pages | `/sitemap.xml` | Count insurance + services entries |
| Mobile (375px): quote form usable | `/quote` | Step through on mobile viewport |
| Phone format auto-formats on Step 2 | `/quote` | Type 10 digits — check format |
| Double-submit prevented | `/quote` | Click submit twice rapidly |
| Admin sidebar "Quote Requests" badge | Admin | Log in → count shows on sidebar |

---

## Phase 2 → Phase 3 Handoff

After Phase 2 is clean:

**What Phase 3 will build:**
- Carrier Partners page (`/carriers`) — full carrier roster with logo, description, and linked service types
- Programmatic SEO pages — `/insurance/[type]/[city]` location pages for service area
- Location-based content templates for up to 20 city/neighborhood pages
- Reviews integration — Google My Business API or manual import system
- Performance audit — Core Web Vitals pass on all pages
- Tag `v0.3-phase3-complete` when done

**What should exist after Phase 2:**
- ALL Tier 1 and Tier 2 pages functional (17 pages total)
- Full quote-to-lead pipeline: form → DB → admin dashboard → agent assignment
- 30+ FAQ items, 25+ testimonials, 8+ blog articles — all filterable
- All 15 insurance service pages + 3 services pages live
- Admin team can manage leads, agents, testimonials, blog, FAQ without touching code
