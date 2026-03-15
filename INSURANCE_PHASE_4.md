# BAAM System I — Insurance Brokerage Platform
# Phase 4: Content Population + QA + First Brokerage Launch

> **System:** BAAM System I — Insurance Brokerage Platform
> **Reference files:** `@INSURANCE_COMPLETE_PLAN.md` + `@INSURANCE_PHASE_0.md` through `@INSURANCE_PHASE_3.md`
> **Prerequisite:** Phase 3 gate fully passed. Core Web Vitals passing. All pages render. Onboarding wizard works. `v0.3-phase3-complete` tagged.
> **Method:** One Cursor prompt per session. Verify done-gate before next prompt.
> **Rule:** This phase is launch-critical. Nothing ships with a known blocker. Every gate is mandatory.

---

## Phase 4 Overview

**Duration:** Week 7–8
**Goal:** Replace all demo seed content with real Peerless Brokerage content. Upload real media assets. Execute a full QA pass across devices and browsers. Deploy to production on Vercel. Configure domain, SSL, analytics, and monitoring. Submit to Google. After Phase 4, the first brokerage client site is live and receiving real quote requests.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|--------|-------|-----------|
| 4A | Content Population — Site Config + Copy | Real brokerage name, phone, address, licenses, taglines, all JSON pages | 90 min |
| 4B | Media Assets — Upload + Assign | Real photos: agents, office, hero images, carrier logos | 60 min |
| 4C | Real Data — Agents, Carriers, Testimonials | Populate DB tables with actual brokerage data | 60 min |
| 4D | Cross-Browser + Device QA Pass | Systematic test on 6 browsers/devices — log and fix all blockers | 90 min |
| 4E | Staging Deploy + Smoke Test | Vercel preview deployment, full smoke test, final fixes | 60 min |
| 4F | Production Launch + Domain + Analytics | Vercel production deploy, domain DNS, SSL, GA4, GSC, error monitoring | 90 min |

---

## Pre-Phase Checklist

Before starting 4A, confirm ALL of the following with the brokerage client:

| Item | Who Provides | Format |
|------|-------------|--------|
| Brokerage legal name | Client | Text |
| DBA name (if different) | Client | Text |
| Primary phone number | Client | e.g. (718) 555-0100 |
| Secondary/fax phone | Client | Optional |
| Email address | Client | e.g. info@peerless.com |
| Office address (full) | Client | Street, City, State, ZIP |
| Business hours | Client | Mon–Fri: 9am–6pm, etc. |
| Founded year | Client | e.g. 1999 |
| State license numbers | Client | e.g. NY: LA-000001 |
| States licensed in | Client | NY, NJ, CT, PA |
| Google Business Profile URL | Client | Google Maps link |
| Current Google review score + count | Client | e.g. 4.9 / 127 |
| Notification email for new leads | Client | e.g. leads@peerless.com |
| Agent list (names, titles, specialties) | Client | Spreadsheet or doc |
| Agent headshots | Client | JPG/PNG, min 400×400px |
| Office / team photo (for About page) | Client | JPG, landscape, min 1200px wide |
| Hero image (or approval to use stock) | Client | JPG, min 1600px wide |
| List of carrier partners | Client | Names only — logos sourced separately |
| Any existing testimonials | Client | Text + reviewer names |
| Service area (cities served) | Client | List of city names |
| Languages spoken by staff | Client | e.g. English, Spanish, Chinese |

**Do not start 4A until all required items are collected.** Mark each as received before proceeding.

---

## Prompt 4A — Content Population: Site Config + All Page Copy

**Goal:** Replace every piece of demo seed content with real Peerless Brokerage data. After this prompt, no demo placeholder text remains anywhere on the site.

```
You are building BAAM System I — Insurance Brokerage Platform.
Client: Peerless Brokerage (first production client)
This prompt ONLY modifies content_entries and site.json records in Supabase.
Do NOT modify any component code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Update site.json (Site Settings)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin Site Settings (or directly in Supabase sites table → settings jsonb),
replace ALL demo values in site.json with the real brokerage data collected in the
pre-phase checklist. Every field must be verified against the client-supplied data.

Fields to update:

IDENTITY:
  name: "[Real brokerage legal name]"
  dba: "[DBA name if different, else omit]"
  tagline: "[Approved tagline — or use: 'Your Trusted Independent Insurance Broker']"
  footerTagline: "[2-line footer tagline]"
  foundedYear: [year]

CONTACT:
  phone: "[primary phone]"
  phoneSecondary: "[secondary phone, optional]"
  email: "[primary email]"
  address: {
    street: "[street]",
    city: "[city]",
    state: "[state]",
    zip: "[zip]",
    googleMapsUrl: "[Google Maps link to office]"
  }
  businessHours: [
    { day: "Monday",    open: "9:00 AM", close: "6:00 PM" },
    { day: "Tuesday",   open: "9:00 AM", close: "6:00 PM" },
    { day: "Wednesday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Thursday",  open: "9:00 AM", close: "6:00 PM" },
    { day: "Friday",    open: "9:00 AM", close: "6:00 PM" },
    { day: "Saturday",  open: "10:00 AM", close: "4:00 PM" },
    { day: "Sunday",    open: null, close: null }
  ]
  languagesServed: ["English", "Spanish", "中文"]  // update to match actual
  parkingNote: "[Parking instructions if applicable]"

LICENSES:
  licenseNumbers: [
    { state: "NY", number: "[actual NY license #]" },
    { state: "NJ", number: "[actual NJ license #]" },
    // add all licensed states
  ]
  licensedStates: ["NY", "NJ", "CT", "PA"]  // update to match actual

SCALE / TRUST:
  carrierCount: [actual number, or conservative estimate]
  clientsServed: "[e.g. 5000]"  // used in hero stats
  yearsInBusiness: [calculated from foundedYear]
  policiesWritten: "[e.g. 10000]"  // optional

REVIEWS:
  googleReviewScore: [actual score, e.g. 4.9]
  googleReviewCount: [actual count, e.g. 127]
  googleReviewUrl: "[actual Google Business profile URL]"

NOTIFICATIONS:
  notificationEmail: "[leads@realbrokeragemail.com]"
  notificationFromEmail: "[noreply@realdomain.com]"

LOCATION PAGES:
  activeLocationSlugs: ["brooklyn", "queens", "flushing", ...]  // actual service area

STICKY BAR:
  stickyBar: {
    callLabel: "Call Us Now",
    quoteLabel: "Get a Free Quote"
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Update pages/home.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Open admin Content Editor → pages/home.json.
Update every section with approved copy:

hero:
  headline: "[Approved hero headline — e.g. 'New York's Trusted Independent Insurance Broker']"
  subline: "[Approved subline — e.g. 'Free quotes from 30+ carriers. Personal, business & specialty coverage.']"
  stats: [
    { value: "[X]+", label: "Years in Business" },
    { value: "[X]+", label: "Carrier Partners" },
    { value: "[X,000]+", label: "Clients Served" },
    { value: "[X,000]+", label: "Policies Written" }
  ]
  trustBadge: "Licensed · Independent · Local"

whyIndependent:
  heading: "Why Choose an Independent Broker?"
  subheading: "We work for you — not the insurance company"
  reasons: [3 reasons with approved copy from client or BAAM standard copy]

howItWorks:
  heading: "How It Works — 3 Simple Steps"
  steps: [verify copy matches brokerage's actual process]

quoteCta:
  heading: "[Approved bottom CTA headline]"
  subline: "[Approved subline]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Update pages/about.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

story:
  founderName: "[Actual founder name]"
  foundedYear: [year]
  body: "[3 paragraphs of real founding story — provided by client or drafted and approved]"
  milestones: [
    { year: [year], event: "[actual milestone]" },
    ...
  ]

mission:
  heading: "Our Mission"
  body: "[1-2 paragraphs on the brokerage's mission — approved by client]"

community:
  enabled: [true/false based on whether client has community involvement to share]
  heading: "In the Community"
  body: "[if enabled — real community info]"

credentials:
  memberships: [
    { name: "PIANY", logoUrl: "/uploads/memberships/piany.png", link: "https://www.piany.org" },
    // add actual memberships
  ]
  enoStatement: true  // verify they carry E&O

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Update pages/contact.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify all contact page sections reference the live site.json fields.
Contact info grid should auto-pull from site.json phone, email, address, hours.
Update Google Maps Embed URL in admin Site Settings if not yet configured:
  - Go to maps.google.com → search the office address → Share → Embed a map → copy the src URL
  - Paste in admin Site Settings → "Google Maps Embed URL"

serviceArea:
  heading: "Our Service Area"
  body: "[Confirmed service area description from client]"
  areas: ["Brooklyn", "Queens", "Flushing", ...]  // update to actual

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Update All Service Page Copy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each of the 15 service pages (pages/insurance/[slug].json):
  - Replace "[Brokerage Name]" placeholder with actual name
  - Replace "[City]" placeholder with primary city
  - Replace "[phone]" placeholder with actual phone number
  - Verify whyUs.reasons contains brokerage-specific claims (not generic placeholders)
  - Verify all CTA hrefs use actual phone number (tel:[phone])

Fastest approach: use admin Content Editor → JSON tab for each page.
Do a Find + Replace in the JSON for common placeholders:
  "[Brokerage Name]" → "Peerless Brokerage"
  "[City]" → "Brooklyn"
  "[phone]" → "(718) 555-0100"
  "[year]" → "1999"

Verify auto, tlc, homeowner, and workers-comp pages individually (highest traffic).
Spot-check 3 more random pages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — Update FAQ + Blog
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FAQ (pages/faq.json):
  Replace any placeholder brokerage name/phone references.
  Review all 30 questions for accuracy — flag any that need client approval:
  - License-specific claims (e.g. "NY Lic. #XXX") must use real license number
  - Hours-based claims (e.g. "We're open Mon–Sat") must match actual hours

Blog (admin/blog/):
  Review all 8 seeded draft articles:
  - Set status to 'draft' (NOT published) until content is reviewed and approved
  - Replace all "[Brokerage Name]" and "[City]" placeholders in each article
  - Set real publish dates (back-date to spread over last 6 months for content velocity appearance)
  - Assign real author name (or use brokerage name as author)
  - Publish articles one at a time after client reviews each

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — Verification Sweep
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After updating all content, do a full text search for any remaining placeholders.
In browser: visit each page and use Ctrl+F to search for:
  - "[Brokerage Name]" — should return 0 results on any page
  - "PLACEHOLDER" — should return 0
  - "[phone]" — should return 0
  - "[City]" — should return 0
  - "Lorem ipsum" — should return 0
  - "Demo" — should return 0 (except in admin UI)
  - "peerless-demo" — should return 0 in URLs or content (only used in demo seed)

Log any found placeholder in the QA issue tracker before proceeding to 4B.
```

**Done-Gate 4A:**
- Every page shows real brokerage name (not "Peerless Brokerage Demo")
- Header top bar shows real phone number
- Footer shows real address and real license number
- About page shows real founding year and real founder name
- Contact page Google Maps embed shows correct office location
- All service pages have real brokerage name in CTAs
- 0 placeholder strings found in any public page
- Blog articles set to draft (not published) until approved
- site.json.notificationEmail is a real monitored inbox

---

## Prompt 4B — Media Assets: Upload + Assign

**Goal:** Replace all demo/stock image placeholders with real brokerage photos. Every above-fold image must be real. This is the single biggest trust signal upgrade from demo → production.

```
You are building BAAM System I — Insurance Brokerage Platform.
Client: Peerless Brokerage (production launch)
This prompt ONLY handles media uploads and image assignments.
Do NOT modify component code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Image Preparation (before uploading)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before uploading, optimize all client-provided images:

HERO IMAGES:
  Desktop hero: resize to 1920×1080px max. Convert to WebP. Target < 300KB.
  Mobile hero: resize to 768×1024px (portrait). Convert to WebP. Target < 150KB.
  If client provides JPG only: convert via squoosh.app (free, browser-based)
  Required images:
  - Home page hero (team photo or NYC landmark + brokerage)
  - About page hero (team or office exterior)
  - Insurance hub hero (can reuse home hero)
  - TLC page hero (taxi/livery specific image)
  - Each service page hero (can use category-specific stock if client has none)

AGENT HEADSHOTS:
  Resize to 400×400px (square crop). Convert to WebP. Target < 80KB each.
  If portrait photos provided: crop to square centered on face.
  Background: ideally solid or soft-blurred. Reject harsh backgrounds.
  Minimum resolution accepted: 200×200px (will look blurry at 400px — note to client)

OFFICE PHOTOS:
  Resize to 1200×800px. Convert to WebP. Target < 200KB.
  Used: About page OurStory section (left column), Contact page (optional background)

MEMBERSHIP / CERTIFICATION LOGOS:
  Resize to 200×100px max. PNG with transparency preferred. Convert to WebP.
  Used: About page LicensesCredentials section

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Upload via Admin Media Library
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use admin Media Library (admin/media/) to upload all images.
Organize into folders:
  /uploads/peerless/hero/           ← hero images
  /uploads/peerless/agents/         ← agent headshots
  /uploads/peerless/about/          ← office + team photos
  /uploads/peerless/memberships/    ← PIANY, BBB, etc.
  /uploads/peerless/services/       ← service-specific images (optional)

Name files clearly:
  hero-home-desktop.webp
  hero-home-mobile.webp
  agent-john-smith.webp
  agent-maria-rodriguez.webp
  office-exterior.webp
  office-reception.webp

Note all uploaded URLs — you will need them in Step 3.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Assign Images to Content
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each image, update the relevant content_entry or DB record:

HOME PAGE HERO:
  Admin → Content Editor → pages/home.json → Hero section
  hero.image: "/uploads/peerless/hero/hero-home-desktop.webp"
  hero.imageMobile: "/uploads/peerless/hero/hero-home-mobile.webp"
  Save → verify on frontend

ABOUT PAGE HERO:
  pages/about.json → hero.image: "/uploads/peerless/about/team-photo.webp"

ABOUT PAGE STORY PHOTO (founder / office):
  pages/about.json → story.photo: "/uploads/peerless/about/office-exterior.webp"

AGENT HEADSHOTS:
  Admin → Agents → each agent → Photo field → pick from media library
  Assign the correct headshot to each agent.

MEMBERSHIP LOGOS:
  Admin → Content Editor → pages/about.json → credentials.memberships
  Each membership: { name, logoUrl: "/uploads/peerless/memberships/piany.webp", link }

SERVICE PAGE HEROES (where provided):
  For auto, tlc, homeowner (the 3 highest-traffic pages):
  pages/insurance/auto.json → hero.image: "[uploaded service image URL]"
  pages/insurance/tlc.json → hero.image: "[taxi/livery image URL]"
  pages/insurance/homeowner.json → hero.image: "[home exterior image URL]"
  For remaining service pages: leave as navy gradient fallback (no image required)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — OG Image Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Open Graph image appears when the site is shared on social media.
Create one branded OG image:
  Size: 1200×630px
  Content: Brokerage logo + name + tagline + phone number on navy background
  Tool: Canva, Figma, or any design tool
  File: og-default.webp — upload to /uploads/peerless/og-default.webp

  Update in admin Site Settings → SEO section:
  "Default OG Image" → pick og-default.webp from media library

  Also create service-specific OG images for top 3 pages (optional but recommended):
  /uploads/peerless/og-auto.webp       — auto insurance branding
  /uploads/peerless/og-tlc.webp        — TLC/livery branding
  /uploads/peerless/og-home.webp       — homeowner branding

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Carrier Logos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each carrier in the brokerage's actual carrier list:
  Source the logo from:
  a) Carrier's official brand/press kit (preferred — highest quality)
  b) Carrier's website (right-click → save image)
  c) High-resolution Google image search for "[carrier name] logo white background"

  IMPORTANT: Only use logos for carriers the brokerage actually represents.
  Do NOT use logos of carriers they don't have appointments with.
  This is a regulatory trust issue — misrepresentation of carrier relationships.

  Optimize each logo: PNG with transparency OR WebP, max 300×150px, < 50KB.
  Upload to /uploads/peerless/carriers/[carrier-slug].webp

  For each carrier in admin/carriers/:
  - Find or create the carrier record in the global catalog
  - Set logo_url to the uploaded file
  - Enable the carrier
  - Assign to the Peerless site (check in site carriers assignment)
  - Mark the top 5–8 as featured (is_featured = true)

  Minimum for launch: 10 carrier logos uploaded and displaying on /carriers
  Target: all actual carrier appointments (typically 15–25 for a mid-size brokerage)
```

**Done-Gate 4B:**
- Home page hero shows a real brokerage photo (not stock/placeholder)
- About page shows real office or team photo in OurStory section
- All agent cards show real headshots (not placeholder silhouettes)
- /carriers shows real carrier logos
- CarrierLogoCarousel on home page shows real carrier logos, auto-scrolling
- All logos show correctly in WebP format
- No broken images — check browser dev tools Network tab for any 404 image requests
- OG image set — test by pasting site URL into https://opengraph.xyz
- Agent headshots are square, ≥ 200px, not distorted

---

## Prompt 4C — Real Data: Agents, Carriers, Testimonials

**Goal:** Populate all database tables with verified real brokerage data. After this prompt, all dynamic content (agents, testimonials, carriers) reflects the real brokerage.

```
You are building BAAM System I — Insurance Brokerage Platform.
Client: Peerless Brokerage (production launch)
This prompt ONLY adds/edits DB records via the admin interface.
Do NOT modify component code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Agents
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin/agents/, create a record for each real agent using the data collected in the pre-phase checklist.

For each agent, fill:
  Name: [Full legal name as on license]
  Title: [e.g. "Senior Insurance Broker", "Licensed Insurance Agent"]
  Photo: [select from uploaded headshots in 4B]
  Bio: [2–3 sentences — approved by agent or drafted and approved]
  Direct Phone: [direct line if they have one, otherwise leave empty]
  Specialties: [select from insurance_lines — pick 2–5 per agent]
  Languages: [add each language as a tag]
  License Number: [actual state license number]
  Years Experience: [number]
  Show License on Public Page: ✓ checked
  Show on Home Spotlight: ✓ for the top 2–3 agents
  Active: ✓ checked
  Display Order: [set order — typically owner/principal first, then senior brokers]

Minimum agents for launch: 3 (1 principal + 2 agents)
If fewer than 3 real agents: set "Show on Home Spotlight" for only 1–2, disable AgentSpotlight section on home if < 2.

VALIDATION:
  License number format verification:
  - NY: typically "LA-XXXXXXX" (7 digits with LA prefix) or "XXXXXXX"
  - NJ: "XXXXXXXX" (8 digits)
  Confirm with client that license numbers are current and active before publishing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Carriers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin/carriers/ (global catalog):
  Verify that all carriers the brokerage represents are in the global catalog.
  For any missing carriers:
  - Create a new record: name, slug, description (1 sentence), website
  - Upload logo (from Step 4B)
  - Set types_covered (which insurance types this carrier offers)
  - Set is_active = true

In admin/carriers/ (site carriers for Peerless):
  Check the checkbox for each carrier the brokerage actually represents.
  Set sort_order to put the most recognized brands first:
    1. Travelers   2. Nationwide   3. Progressive   4. Liberty Mutual   5. Chubb
    etc. (based on what the brokerage actually has — not this list)

  Mark as featured (is_featured = true): top 6–8 carriers by brand recognition.
  Featured carriers get gold border treatment on the /carriers page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Testimonials
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOURCE OPTIONS (in priority order):
  A) Real Google Reviews — copy + paste from Google Business profile
  B) Real reviews from Yelp or other platforms
  C) Testimonials collected directly from clients (written permission implied when submitting)
  D) Demo seed testimonials (lowest priority — only use if no real ones yet)

For each testimonial, in admin/testimonials/:
  Quote: [actual review text — do not alter the client's words]
  Reviewer Name: [as they appear in the review, or first name + last initial]
  Star Rating: [actual rating]
  Coverage Type: [select the insurance type they reviewed about]
  Source: [google | yelp | direct]
  Featured: ✓ for the 3 strongest, most specific testimonials
  Published: ✓ after verifying accuracy

MINIMUM for launch: 15 published testimonials
TARGET: 25 (aim to import all available Google reviews + any direct ones)

QUALITY GUIDELINES:
  - Featured testimonials must mention a specific coverage type or outcome
    Good: "John helped me get TLC insurance same-day when my plate was about to be suspended"
    Weak: "Great service, very helpful" (still publish but don't feature)
  - Include a mix of personal (auto, home) and business (TLC, commercial) reviews
  - At least 3 testimonials mentioning speed or responsiveness
  - At least 1 testimonial in Spanish or Chinese if the brokerage serves those communities

REMOVING DEMO TESTIMONIALS:
  In admin/testimonials/ — filter to show only demo/seed testimonials.
  These have names like "Maria Rodriguez (Demo)" or similar.
  Set published = false for all demo testimonials before launch.
  Do NOT delete them — they may be useful for testing in the future.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — FAQ Review + Accuracy Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The 30 FAQ questions from Phase 2F are generic insurance questions.
Review each one with the client and flag any that need brokerage-specific answers:

HIGH PRIORITY for client review:
  - "How long have you been in business?" → update with real year
  - "Are you licensed in my state?" → update with actual states
  - "Do you have an office I can visit?" → update with actual address + hours
  - "How long does it take to get a quote?" → update with actual response time
  - "How do you make money if quotes are free?" → confirm this is accurate and they're comfortable with the answer
  - Any question mentioning a specific number (carriers, years, clients) → verify the number

Client approval checklist:
  ☐ All factual claims verified
  ☐ All license-specific claims verified
  ☐ Hours and contact information correct
  ☐ Response time promise matches actual capacity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Demo Data Cleanup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After all real data is populated, clean up remaining demo data:

QUOTE REQUESTS:
  In admin/quote-requests/ — filter by created_at before [today].
  These are all test submissions from development.
  Set status = 'closed' on all (do NOT delete — they document testing history).
  Add a note: "test submission — development phase"

DEMO AGENTS:
  Any agent records with placeholder names (e.g. "Agent Name (Demo)"):
  Set active = false. They will disappear from the public agents page.

DEMO BLOG POSTS:
  Review each of the 8 seeded articles.
  Articles reviewed and approved by client: set published = true, set real publish date.
  Articles not yet reviewed: leave as draft.
  Target: at least 3 articles published at launch.

DEMO CARRIERS:
  Any carriers in the global catalog that the brokerage does NOT represent:
  Uncheck them from site carriers (they remain in the global catalog for other sites).
```

**Done-Gate 4C:**
- Admin agents list shows only real agents (no demo names)
- /agents page shows real photos, real specialties, real license numbers
- Agent spotlight on home page shows 2–3 real agents
- /carriers shows only real carrier logos (minimum 10)
- CarrierLogoCarousel on home has real logos — no placeholder grey boxes
- /testimonials shows ≥ 15 published testimonials from real sources
- Featured testimonials have Google/Yelp source badge
- All demo quote_requests marked as closed with test notation
- All demo testimonials set to unpublished
- At least 3 blog posts published (reviewed + approved)
- FAQ: all factual claims verified by client

---

## Prompt 4D — Cross-Browser + Device QA Pass

**Goal:** Systematically test every core user flow on the 6 most important browser/device combinations. Every blocker must be fixed before staging deployment.

```
You are building BAAM System I — Insurance Brokerage Platform.
This is a QA pass — identify bugs, classify severity, fix all Critical and High issues.
Do NOT add new features during QA. Fix only what is broken.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEST MATRIX — 6 Environments
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| # | Environment | Why It Matters |
|---|-------------|---------------|
| 1 | iPhone (iOS Safari, latest) | ~40% of insurance search traffic |
| 2 | Android Chrome (latest) | ~35% of mobile traffic |
| 3 | Desktop Chrome (latest) | Developer default — baseline |
| 4 | Desktop Safari (macOS) | Mac users common in NYC professional market |
| 5 | Desktop Firefox (latest) | 3–5% of users, catches CSS edge cases |
| 6 | Desktop Edge (latest) | Windows default browser, older clients |

Tools:
  Physical devices for #1 and #2 (preferred) OR BrowserStack/LambdaTest.
  Chrome DevTools device emulation acceptable for #2 if no physical Android available.
  All desktop browsers should be real installs, not emulated.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEST SCRIPT — Execute on EVERY environment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLOW 1 — Anonymous Visitor → Home → Quote (Primary Path)
  [ ] Home page loads without errors (no console errors)
  [ ] Hero image loads above the fold (not blank/placeholder)
  [ ] InsuranceLineGrid shows all 15 tiles
  [ ] Tiles are tappable/clickable — tap "Auto Insurance" → goes to /insurance/auto
  [ ] Back to home — tap "Get a Free Quote" → goes to /quote
  [ ] Step 1: all 15 coverage tiles visible, can select multiple
  [ ] "Get a Free Quote" pre-selects "Auto" if ?type=auto param present
  [ ] Step 1 → Next only works after selecting at least 1 tile
  [ ] Step 2: all fields visible, keyboard opens on mobile
  [ ] Phone number auto-formats "(555) 555-5555" as typed
  [ ] Inline validation shows on blur (not just on submit)
  [ ] Step 2 → Next only works when all required fields valid
  [ ] Step 3: dynamic fields show for selected coverage types
  [ ] Submit button: submits, shows loading spinner
  [ ] Confirmation panel appears — shows first name and selected types
  [ ] Double-tap submit: second tap does nothing (disabled)

FLOW 2 — Anonymous Visitor → Service Page → Quote
  [ ] /insurance/auto loads all 9 sections
  [ ] WhatItCovers shows green ✓ and grey ✕ items
  [ ] FAQ accordion: tap question → expands; tap again → collapses
  [ ] RelatedServices shows 3 tiles
  [ ] Bottom QuoteCTA inline form: "Auto Insurance" pre-selected in dropdown
  [ ] Submit mini form → quote_requests record created

FLOW 3 — Testimonials + About (Trust Path)
  [ ] /testimonials loads; coverage type filter works; search works
  [ ] /about loads all 8 sections — milestones timeline visible
  [ ] LicensesCredentials table renders with real license numbers
  [ ] "Verify our license →" link opens in new tab

FLOW 4 — Contact Page
  [ ] /contact loads — 3-column ContactInfoGrid visible
  [ ] Phone number is click-to-call (tap on mobile — verify phone dialer opens)
  [ ] Google Maps embed loads (or address card if embed missing)
  [ ] Contact form submits — success message appears

FLOW 5 — Mobile Sticky Bar
  [ ] MobileStickyPhoneBar visible at bottom of screen on mobile (not desktop)
  [ ] "Call Us Now" tap → phone dialer opens
  [ ] "Get a Free Quote" tap → /quote page loads
  [ ] iOS home bar area: sticky bar not cut off by home indicator

FLOW 6 — Navigation
  [ ] Header: all nav links work
  [ ] Mobile hamburger menu opens and closes
  [ ] Mobile menu shows phone number prominently
  [ ] Mobile menu "Get a Free Quote" button works
  [ ] Footer: all links work — check "Service Areas" → /locations
  [ ] /locations page shows city grid; city expand shows insurance type links

FLOW 7 — Carriers Page
  [ ] /carriers loads with real logos
  [ ] Logos: grayscale by default, color on hover (desktop)
  [ ] Insurance type filter works
  [ ] /carriers/[real-slug] loads 4-section page
  [ ] /carriers/fake-slug → 404 page (not 500 error)

FLOW 8 — Location Pages (if active)
  [ ] /insurance/auto/brooklyn loads with "Brooklyn, NY" in headline
  [ ] /insurance/auto/unknown-city → 404

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUG SEVERITY CLASSIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL — blocks launch:
  - Quote form does not submit on any browser
  - Phone click-to-call does not work on iOS Safari
  - Page throws 500 error
  - Form validation allows invalid data through to DB
  - Text content shows placeholder strings (not real brokerage data)
  - MobileStickyPhoneBar not visible on mobile
  - Any page returns blank white screen

HIGH — fix before launch:
  - Visual layout broken on any tier-1 page on any tested environment
  - Hero image missing/broken on home or top service pages
  - Navigation links broken (404 on valid pages)
  - Quote form step navigation broken on mobile keyboard
  - Carrier logos not displaying

MEDIUM — fix within 48 hours of launch:
  - Minor visual misalignment on non-critical pages
  - FAQ accordion animation choppy on older devices
  - CarrierCarousel scroll not smooth on Firefox

LOW — fix in next sprint:
  - Minor cosmetic issues on admin pages
  - Blog post formatting edge cases

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA TRACKING LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Log every bug found using this format:
  ID: QA-001
  Environment: iPhone / iOS Safari 17
  Page: /quote
  Flow: Flow 1 — Step 2
  Description: Phone keyboard pushes layout up, covering the "Next" button — user cannot proceed
  Severity: CRITICAL
  Fix: Add padding-bottom to form container equal to keyboard height estimate (or use visualViewport API)
  Status: OPEN → FIXED → VERIFIED

Do not proceed to 4E until all CRITICAL and HIGH bugs are VERIFIED fixed.
```

**Done-Gate 4D:**
- All 8 test flows complete with 0 CRITICAL bugs on all 6 environments
- All 8 test flows complete with 0 HIGH bugs on all 6 environments
- QA log documents all bugs found — all Critical/High marked as VERIFIED fixed
- Phone click-to-call tested on a real iOS device (not just emulator)
- Quote form submit tested on iOS Safari — confirmation panel appears
- MobileStickyPhoneBar visible and functional on both iOS and Android

---

## Prompt 4E — Staging Deploy + Smoke Test

**Goal:** Deploy to a Vercel preview/staging environment that mirrors production exactly. Run the full smoke test on the staged URL. Confirm all environment variables are set correctly before production.

```
You are building BAAM System I — Insurance Brokerage Platform.
This is a staging deployment — NOT production. The goal is to catch any
environment-specific issues before the real launch.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Vercel Project Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If not already connected to Vercel:
  vercel link  (link to existing project or create new)
  vercel env pull .env.local  (pull existing env vars to local)

Verify the Vercel project:
  Framework Preset: Next.js (auto-detected)
  Root Directory: [path to insurance platform — e.g. ./stores/insurance or ./]
  Node.js Version: 20.x (LTS)
  Build Command: next build
  Output Directory: .next (default)
  Install Command: npm install (or pnpm install if using pnpm)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Environment Variables Audit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In Vercel Project Settings → Environment Variables, verify ALL of the following are set
for both "Preview" and "Production" environments:

REQUIRED — site will not work without these:
  NEXT_PUBLIC_SUPABASE_URL            Supabase project URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY       Supabase anon/public key
  SUPABASE_SERVICE_ROLE_KEY           Supabase service role (server-only — NOT NEXT_PUBLIC_)
  NEXTAUTH_SECRET                     Random string ≥ 32 chars (for auth sessions)
  NEXTAUTH_URL                        Full URL of deployed site (https://yourdomain.com)

EMAIL (required for lead notifications):
  RESEND_API_KEY                      Or equivalent for your email provider
  EMAIL_FROM_ADDRESS                  Verified sender address

OPTIONAL — graceful degradation if missing:
  ANTHROPIC_API_KEY                   Only needed if AI chat is enabled
  GOOGLE_MAPS_API_KEY                 Only needed if using Maps JS API (not for embed)
  NEXT_PUBLIC_GA_MEASUREMENT_ID       Google Analytics — can add post-launch

SECURITY CHECK:
  Verify that SUPABASE_SERVICE_ROLE_KEY is NOT prefixed with NEXT_PUBLIC_.
  If it is: rename it immediately — NEXT_PUBLIC_ variables are exposed in browser bundle.
  The service role key gives full DB access — must never be exposed to clients.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Build + Deploy to Preview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Push current branch to Git:
  git add -A
  git commit -m "Phase 4: Content population complete — ready for staging review"
  git push origin main

Vercel auto-deploys on push to main (or configured branch).
Monitor the build in Vercel Dashboard → Deployments.

If build fails:
  Read the full build log — DO NOT skip to the bottom.
  Build errors are almost always one of:
  a) Missing environment variable
  b) TypeScript type error
  c) ESLint error (treated as build error in Next.js production builds)
  d) Dynamic import of server-only module in client component
  Fix the root cause. Do NOT suppress TypeScript or ESLint to force a build.

If build succeeds:
  Copy the preview URL: https://[project]-[hash]-[team].vercel.app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Staging Smoke Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run this abbreviated smoke test on the Vercel preview URL.
This is NOT the full QA — just verifying the deployed environment works.

  [ ] Home page loads — no blank screen, no 500 error
  [ ] Real brokerage name in header (not "Demo")
  [ ] Real phone number in header top bar
  [ ] /quote page loads — Step 1 shows coverage tiles
  [ ] Submit a test quote:
      Name: QA Test
      Phone: (555) 000-0001
      Email: qa@test.com (or real monitored test email)
      Coverage: Auto
      Submit
      → Confirmation panel appears
      → Check Supabase: quote_requests has new record with site_id = peerless site
      → Check notificationEmail inbox: notification email received
  [ ] /about page loads — real agent names visible
  [ ] /carriers loads — real carrier logos visible
  [ ] /admin login page loads — login with admin credentials works
  [ ] Admin → Quote Requests — test submission visible
  [ ] Change test quote status to "Bound" → review request prompt appears
  [ ] robots.txt accessible: https://[preview-url]/robots.txt
  [ ] sitemap.xml accessible: https://[preview-url]/sitemap.xml
  [ ] /insurance/auto/brooklyn loads with "Brooklyn" in headline
  [ ] Open browser console on home page — 0 JavaScript errors, 0 failed network requests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Supabase Row Level Security Audit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before production, verify Supabase RLS is configured correctly.
This prevents data leaks between brokerage sites on the multi-tenant platform.

Run these checks in Supabase SQL Editor:

-- Test 1: Public read on content_entries should only work for a specific site_id
-- (verify RLS is enabled and policies are correct)
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('sites', 'content_entries', 'agents', 'testimonials',
                  'quote_requests', 'carriers', 'site_carriers', 'insurance_lines');
-- Expected: rowsecurity = true for ALL tables above.

-- Test 2: Verify quote_requests is not publicly readable without auth
-- Run this with the ANON key (not service role) in a client context:
-- SELECT * FROM quote_requests LIMIT 1;
-- Expected: 0 rows or permission denied (NOT all quote requests for all sites)

If any table has rowsecurity = false: STOP. Enable RLS before deploying to production.
Quote requests contain PII (names, phones, emails) — RLS is not optional.

If RLS policies are missing or incorrect, add them now following the same patterns
as the medical codebase (which already has correct RLS).
```

**Done-Gate 4E:**
- Vercel build succeeds with 0 errors, 0 suppressed TypeScript errors
- SUPABASE_SERVICE_ROLE_KEY is NOT prefixed with NEXT_PUBLIC_
- All required env vars confirmed set in Vercel (Preview + Production)
- Staging smoke test: all 12 checklist items pass
- Test quote request visible in admin within 5 seconds
- Notification email delivered to notificationEmail inbox
- RLS enabled on all 8 tables (rowsecurity = true)
- Test quote_requests not readable via anon key
- 0 JavaScript console errors on home page in staging environment
- Client has reviewed the staging URL and given written approval to proceed to production

---

## Prompt 4F — Production Launch + Domain + Analytics + Monitoring

**Goal:** Deploy to production, configure the real domain, set up analytics and error monitoring, submit to Google Search Console, and complete the launch checklist. After this prompt, the site is live and being monitored.

```
You are building BAAM System I — Insurance Brokerage Platform.
Client: Peerless Brokerage — PRODUCTION LAUNCH
Prerequisite: Client has given written sign-off on staging (Step 4E done-gate).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Production Deployment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tag the release:
  git tag v0.4-phase4-launch
  git push origin v0.4-phase4-launch

In Vercel Dashboard:
  Deployments → find the staging build that passed all smoke tests
  Click "Promote to Production" (do NOT force a new build — promote the tested one)
  OR: ensure main branch is deployed to production automatically.

Verify production deployment:
  https://[your-project].vercel.app (Vercel default domain) shows the real site

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Custom Domain Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In Vercel Project Settings → Domains:
  Add custom domain: [realdomain.com]
  Vercel will show you the required DNS records.

DNS Records to add at the domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

For apex domain (realdomain.com):
  Type: A
  Name: @
  Value: 76.76.21.21  (Vercel's IP — confirm in Vercel dashboard)
  TTL: 300 (or lowest available for faster propagation)

For www subdomain:
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  TTL: 300

NEXTAUTH_URL environment variable update:
  In Vercel → Environment Variables → Production:
  NEXTAUTH_URL: https://realdomain.com  (update to real domain, not vercel.app URL)

SSL Certificate:
  Vercel auto-provisions Let's Encrypt SSL. Wait for "Valid Configuration" status.
  Usually takes 2–5 minutes after DNS propagates.
  DNS propagation: typically 5–30 minutes. Can take up to 24 hours for some registrars.

Verify:
  https://realdomain.com loads site with padlock (SSL)
  https://www.realdomain.com redirects to https://realdomain.com (or vice versa — pick one and be consistent)
  http://realdomain.com redirects to https://realdomain.com (Vercel handles this automatically)

Middleware domain routing update:
  The multi-tenant middleware reads the request hostname to determine which site to load.
  Verify that realdomain.com is registered in the site_domains table:
  In Supabase: INSERT INTO site_domains (site_id, domain) VALUES ('[peerless-site-id]', 'realdomain.com');
  Also add: ('www.realdomain.com') if www is used.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Google Analytics 4 Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If GA4 not already configured:

  a) Create GA4 Property at analytics.google.com:
     - Account: [Brokerage name] or agency account
     - Property name: [Brokerage Name] Website
     - Industry: Finance & Insurance
     - Business size: Small (1–10 employees) or Medium
     - Measurement ID: G-XXXXXXXXXX (copy this)

  b) Add Measurement ID to Vercel env vars:
     NEXT_PUBLIC_GA_MEASUREMENT_ID: G-XXXXXXXXXX

  c) GA4 script injection in Next.js:
     File: app/layout.tsx — add GoogleAnalytics component:

     import { GoogleAnalytics } from '@next/third-parties/google'

     In the <body> of layout.tsx (after <html> and <body> open tags):
     <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />

     Note: @next/third-parties is the recommended pattern — it handles script loading
     strategy automatically (afterInteractive) without a custom useEffect.

  d) Verify GA4 is receiving data:
     Visit site → GA4 → Reports → Realtime
     Should show 1 active user (yourself) within 30 seconds.

Key GA4 events to verify are firing:
  page_view: automatic — fires on every page load ✓
  Click on "Get a Free Quote" button: set up as a GA4 event
    (Next.js: add onClick={() => gtag('event', 'quote_cta_click', { page: pathname })} to the primary CTA buttons)
  Quote form submission: already handled in the quote API — add:
    In the browser after successful submit: gtag('event', 'quote_submitted', { coverage_types: [...] })
  Phone click: add onClick tracking to all tel: links

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Google Search Console
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

a) Add property at search.google.com/search-console:
   Property type: URL prefix — https://realdomain.com
   Verification method: HTML tag OR Google Analytics (easiest if GA4 already connected)

b) Submit sitemap:
   Search Console → Sitemaps → Enter sitemap URL: https://realdomain.com/sitemap.xml → Submit
   Status should become "Success" within a few minutes.
   Initial index count will be 0 — indexing takes days to weeks.

c) Request indexing for priority pages:
   In Search Console → URL Inspection:
   Enter each priority URL → "Request Indexing" button:
   - https://realdomain.com/
   - https://realdomain.com/insurance/auto
   - https://realdomain.com/insurance/tlc
   - https://realdomain.com/insurance/homeowner
   - https://realdomain.com/quote
   - https://realdomain.com/about
   - https://realdomain.com/contact
   Limit: Google allows about 10 URL inspection requests per day.
   Spread across multiple days if more than 10 priority URLs.

d) Set preferred domain:
   Search Console → Settings → Geographic target: United States (or primary state)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Error Monitoring Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option A — Sentry (recommended for production):
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs

  Add to Vercel env vars:
  SENTRY_DSN: [from Sentry project settings]
  SENTRY_AUTH_TOKEN: [for source map uploads]

  Sentry configuration (sentry.client.config.ts and sentry.server.config.ts):
  - Set tracesSampleRate: 0.1 (10% sampling — sufficient for small site)
  - Set environment: process.env.VERCEL_ENV (development/preview/production)

  Test: trigger a fake error in a non-critical page → verify it appears in Sentry dashboard.

Option B — Vercel built-in (simpler, less detailed):
  Vercel Dashboard → Project → Analytics → Enable
  Also enable: Speed Insights (for real-user performance data)
  No code changes needed — works automatically.

  Recommendation: Start with Vercel built-ins (Option B) for launch speed.
  Add Sentry in Phase 5 if error volume justifies it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — Post-Launch Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run these checks on the LIVE production URL (not preview):

  [ ] https://realdomain.com loads — padlock visible, correct content
  [ ] SSL certificate valid — click padlock → certificate issued to realdomain.com
  [ ] www.realdomain.com redirects correctly (→ apex or www, whichever is canonical)
  [ ] Submit a REAL test quote with real contact info → receive the notification email
  [ ] The test quote appears in admin → mark as "closed" immediately after verification
  [ ] GA4 Realtime shows a user (wait 30 seconds after visiting)
  [ ] GSC sitemap shows "Success" status
  [ ] Run mobile Lighthouse on production URL — Performance ≥ 90
  [ ] Check https://realdomain.com/robots.txt — shows correct allow/disallow rules
  [ ] Check https://realdomain.com/sitemap.xml — shows all pages
  [ ] Test click-to-call from a real mobile phone → phone dialer opens with correct number
  [ ] Test "Get a Free Quote" from mobile sticky bar → /quote loads
  [ ] Check admin login: https://realdomain.com/admin → login with production admin credentials

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — Launch Notifications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After all checks pass, send launch confirmation to stakeholders:

To: Client (brokerage owner/manager)
Subject: "Your new website is live — [realdomain.com]"
Body:
  - Confirmation that the site is live
  - Login credentials for admin dashboard (separate secure message)
  - Link to the Google Search Console property (add client as owner)
  - Link to Google Analytics property (add client as editor)
  - "What to do in the first 7 days" brief:
    1. Update your Google Business Profile website URL to [realdomain.com]
    2. Share your new site URL on your social media channels
    3. Ask your top 5 clients to leave a Google review (link to your review request email template)
    4. Check admin/quote-requests every morning for new leads
    5. Reply to any leads within 2 business hours (per your site's promise)

Internal (dev team):
  - Tag git repository: v0.4-phase4-launch
  - Update project tracker: Phase 4 complete
  - Schedule Phase 5 kickoff (30-day growth plan)
```

**Done-Gate 4F:**
- https://realdomain.com loads with SSL (padlock visible)
- www redirect works correctly
- NEXTAUTH_URL updated to production domain
- Domain registered in site_domains table
- Real test quote submitted → notification email received
- GA4 Realtime shows live user
- GSC sitemap submitted and showing "Success"
- Priority pages requested for indexing in GSC
- Vercel Analytics enabled
- Mobile Lighthouse on production ≥ 90
- Admin login works with production credentials
- Launch email sent to client with login credentials and first-week checklist

---

## Phase 4 Completion Gate

Before tagging `v0.4-phase4-complete` and handing off to Phase 5, verify ALL of the following:

| Check | Location | How to Verify |
|-------|----------|---------------|
| 0 placeholder strings on any page | All pages | Browser Ctrl+F on each page |
| Real brokerage name in page titles | All pages | View source → `<title>` tag |
| Real phone number in header + footer | All pages | Visual check |
| Real license number in footer | All pages | Visual check |
| Real agent headshots on /agents | `/agents` | Visual check |
| ≥ 10 real carrier logos on /carriers | `/carriers` | Count logos |
| ≥ 15 published real testimonials | `/testimonials` | Count cards |
| ≥ 3 published blog articles | `/resources` | Count articles |
| All demo testimonials unpublished | Admin/testimonials | Filter published → no demo names |
| Demo quote_requests marked closed | Admin/quote-requests | Filter by status |
| QA log: 0 open Critical bugs | QA log document | Review log |
| QA log: 0 open High bugs | QA log document | Review log |
| Quote form works on iOS Safari | Physical iPhone | Submit test quote |
| Quote form works on Android Chrome | Android device | Submit test quote |
| Staging smoke test: all 12 passed | Vercel preview | Check completed log |
| Production domain loads with SSL | https://realdomain.com | Browser padlock |
| GA4 receiving data | GA4 Realtime | Visit site → check |
| GSC sitemap submitted | Google Search Console | Sitemaps tab |
| Priority pages requested for indexing | Google Search Console | URL Inspection history |
| Error monitoring active | Vercel Analytics | Dashboard shows data |
| Client received login credentials | Email thread | Confirm receipt |
| Google Business Profile URL updated | Client confirms | Ask client |

---

## Phase 4 → Phase 5 Handoff

After Phase 4 is clean and the site is live:

**What Phase 5 will cover (30-Day Growth Plan + Pipeline B):**
- 30-day post-launch SEO monitoring and adjustment
- Content velocity: 2 new blog articles per month (AI-assisted drafting)
- Programmatic SEO expansion: add 5 new location slugs per month
- Testimonial collection automation: post-bind email sequence
- Lead pipeline optimization: A/B test quote form CTAs
- Second brokerage client onboarding (using the onboarding wizard from Phase 3D)
- Client portal foundation: login for existing clients to view policies, request COI, report claims
- Multi-language expansion: Spanish language version for TLC and commercial clients
- Advanced admin: bulk lead export, monthly report email to brokerage owner

**Ongoing operations after launch:**
- Admin checks quote requests daily
- Weekly: review GA4 for top traffic pages and quote conversion rate
- Monthly: update Google review score in Site Settings
- Monthly: publish 2 new blog articles
- Quarterly: run Lighthouse audit to catch performance regressions
- Quarterly: review and update FAQ with new questions from real client inquiries
