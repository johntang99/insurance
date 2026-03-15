# BAAM System I — Insurance Brokerage Platform
# Phase 5: Growth Engine + Platform Expansion + Pipeline B

> **System:** BAAM System I — Insurance Brokerage Platform
> **Reference files:** `@INSURANCE_COMPLETE_PLAN.md` + `@INSURANCE_PHASE_0.md` through `@INSURANCE_PHASE_4.md`
> **Prerequisite:** Phase 4 gate fully passed. First brokerage site live at production domain. GA4 + GSC active. Client receiving real leads. `v0.4-phase4-complete` tagged.
> **Method:** Phase 5 is ongoing — not a single sprint. Prompts are executed on a monthly cadence, not back-to-back. Read the rhythm schedule before starting any prompt.
> **Rule:** Phase 5 never ends. Each cycle compounds on the last. Track metrics monthly to prove ROI.

---

## Phase 5 Overview

**Duration:** Month 3 onward (12-month rolling plan)
**Goal:** Four simultaneous streams running in parallel after launch:

| Stream | What | Cadence |
|--------|------|---------|
| **Stream A — SEO Growth** | Content velocity, location expansion, programmatic pages, ranking tracking | Monthly |
| **Stream B — Lead Optimization** | Quote form conversion, A/B tests, lead quality, agent response time | Monthly |
| **Stream C — Platform Expansion** | Onboard second + third brokerage clients using the wizard | Per client |
| **Stream D — Product Evolution** | Client portal, multi-language, advanced admin, new features | Quarterly |

## Prompt Index

| # | Prompt | Stream | Cadence |
|---|--------|--------|---------|
| 5A | 30-Day Post-Launch Review | A + B | One-time (Day 30) |
| 5B | Content Velocity Engine | A | Monthly |
| 5C | Programmatic SEO Expansion | A | Monthly |
| 5D | Lead Pipeline Optimization | B | Monthly |
| 5E | Second Brokerage Onboarding | C | Per client |
| 5F | Client Portal — Foundation | D | Quarter 2 |
| 5G | Multi-Language Expansion — Spanish | D | Quarter 2–3 |
| 5H | Advanced Admin + Monthly Reporting | D | Quarter 3 |
| 5I | 12-Month SEO + Growth Review | A + B | Month 12 |

---

## Monthly Rhythm

```
WEEK 1 OF EACH MONTH:
  ├── Review previous month's GA4 + GSC data (Prompt 5A checklist, recurring)
  ├── Check quote_requests volume and conversion rate
  ├── Run Lighthouse on home + top service page (catch regressions)
  └── Plan content for the month (blog topics + location expansion)

WEEK 2 OF EACH MONTH:
  ├── Publish 1–2 new blog articles (Prompt 5B)
  ├── Add 2–3 new location pages if service area expanding (Prompt 5C)
  └── Review and respond to any GSC coverage issues (crawl errors, indexing gaps)

WEEK 3 OF EACH MONTH:
  ├── Client check-in: lead quality review, agent response time audit
  ├── Collect new testimonials from bound policies (review request emails)
  └── A/B test review if running (Prompt 5D)

WEEK 4 OF EACH MONTH:
  ├── Update Google review score in admin if changed
  ├── Publish any pending testimonials
  └── Tag git: v0.5.[month]-growth-[YYYY-MM]
```

---

## Prompt 5A — 30-Day Post-Launch Review

**Goal:** 30 days after launch, conduct a comprehensive review of all systems, SEO progress, and lead performance. Identify what's working, what's broken, and what to prioritize for month 2.

**Run once: approximately Day 30 after Phase 4 launch.**

```
You are managing BAAM System I — Insurance Brokerage Platform.
Client: Peerless Brokerage — site has been live for 30 days.
This is a review + action session — no new feature code unless a critical fix is identified.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — Lead Performance Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pull from Supabase (admin/quote-requests/):

METRICS TO RECORD:
  Total quote requests received: [X]
  By source:
    quote_page:      [X]  ([X]%)
    service_page:    [X]  ([X]%)
    home_cta:        [X]  ([X]%)
    contact_form:    [X]  ([X]%)

  By coverage type (top 5):
    [type]:  [X] requests
    ...

  By status:
    New (uncontacted):   [X]  ← ALERT if > 20% are still 'new' after 48 hours
    Contacted:           [X]
    Quoted:              [X]
    Bound:               [X]  ← conversion rate = Bound / Total = [X]%
    Closed (no sale):    [X]

  Average response time: (review created_at vs first status change timestamp)
    Target: < 2 hours during business hours
    Actual: [X] hours average

  Agent-level breakdown (if multiple agents):
    [Agent name]: X assigned, X bound ([X]% bind rate)

ACTION ITEMS:
  If conversion rate (Bound/Total) < 5%: flag for discussion — may indicate leads are low quality, response time is too slow, or pricing is uncompetitive
  If any 'new' leads > 48 hours old: agent response protocol needs fixing
  If contact_form source > 30% of leads: the contact form CTA is working well — amplify it
  If quote_page source < 50%: consider adding more prominent "Get a Free Quote" CTAs across pages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — Analytics Review (GA4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pull from GA4 → Reports → Last 30 days:

TRAFFIC:
  Total users: [X]
  New users:   [X]  ([X]%)
  Sessions:    [X]
  Avg session duration: [X] min

TOP PAGES by pageviews:
  1. / (home)               [X] views
  2. /insurance/auto         [X] views
  3. /quote                  [X] views
  4. /insurance/tlc          [X] views
  5. [other]                 [X] views

TRAFFIC SOURCES:
  Organic Search:  [X]%  ← Goal: > 40% by month 6
  Direct:          [X]%
  Referral:        [X]%
  Social:          [X]%
  Paid (if any):   [X]%

DEVICE BREAKDOWN:
  Mobile:  [X]%  ← Expected 55–65% for insurance
  Desktop: [X]%
  Tablet:  [X]%

KEY EVENTS:
  quote_cta_click:   [X] events
  quote_submitted:   [X] events
  phone_click:       [X] events

CONVERSION FUNNEL (if GA4 funnel set up):
  Visited /quote:         [X] users
  Completed Step 1:       [X] users  ([X]% of visitors)
  Completed Step 2:       [X] users  ([X]% drop from Step 1)
  Submitted (Step 3):     [X] users  ([X]% drop from Step 2)
  Confirmation shown:     [X] users

  ALERT: If Step 1→2 drop > 40%: something is wrong with the coverage tile selection UX
  ALERT: If Step 2→3 drop > 50%: phone format or required fields causing friction

ACTION ITEMS from analytics review:
  - Top entry pages that are NOT converting: add QuoteCTA section
  - Pages with high bounce rate: may need content improvement or faster load
  - Mobile users dropping off: re-verify MobileStickyPhoneBar is functioning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — Search Console Review (GSC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pull from Google Search Console → Last 28 days:

INDEXING:
  Pages indexed: [X] of [X] submitted
  Pages with issues: [X]
  Common issue types: (list any coverage errors or warnings)

  ALERT if home page not indexed after 30 days: manually request indexing again
  ALERT if > 20% of pages have coverage issues: investigate

TOP QUERIES (keywords bringing traffic):
  Record top 20 queries:
  [query]  |  [impressions]  |  [clicks]  |  [CTR]  |  [avg position]

  Queries with position 4–15 ("page 1 edge"): these are closest to top 3
  Prioritize: create content upgrades or build backlinks for these queries

  Queries you're NOT ranking for yet but should be:
  - "[city] insurance broker" — if not in top 20
  - "TLC insurance NYC" — critical for TLC revenue
  - "independent insurance broker [city]"

TOP PAGES by clicks:
  [page URL]  |  [clicks]  |  [impressions]  |  [CTR]  |  [avg position]

  Pages with high impressions but low CTR (< 2%):
  Rewrite the meta description to be more compelling — a curiosity gap or specific benefit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — Technical Health Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run these checks on the live production site:

  [ ] Lighthouse mobile score on home page: [X] (target: ≥ 90)
  [ ] Lighthouse mobile score on /insurance/auto: [X]
  [ ] Any new JavaScript console errors? (check DevTools on home + /quote)
  [ ] Broken images? (DevTools → Network → filter Images → check for 404s)
  [ ] All service pages still rendering? (spot check 5 random slugs)
  [ ] Location pages rendering? (check /insurance/auto/brooklyn)
  [ ] GSC: any crawl errors in Coverage report?
  [ ] Sitemap still returning 200 at /sitemap.xml?
  [ ] Admin dashboard accessible? Login works?

Fix any issues found before proceeding to month 2 activities.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 — Month 2 Priority Plan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on the data collected above, create a Month 2 priority list:

TEMPLATE:
  TOP 3 WINS (quick actions this week):
  1. [e.g. rewrite meta description for /insurance/tlc — CTR only 0.8%]
  2. [e.g. add location page for Jersey City — 12 impressions already]
  3. [e.g. publish 2 pending blog articles]

  TOP 3 INVESTMENTS (require more work, planned for the month):
  1. [e.g. set up GA4 quote funnel to see where users drop off]
  2. [e.g. add 5 new location pages for Westchester county]
  3. [e.g. collect 10 more real testimonials via review request emails]

  1 PROBLEM TO INVESTIGATE:
  [e.g. mobile users have 72% bounce rate on /quote — investigate form UX on mobile]
```

**Done-Gate 5A:**
- 30-day metrics recorded in a shared document (spreadsheet or Notion)
- All ALERT conditions reviewed and assigned to an owner with a due date
- Month 2 Priority Plan written and shared with client
- All technical health check items pass (0 broken images, 0 JS errors, Lighthouse ≥ 90)
- At least 1 quick win actioned immediately from the Top 3 Wins list

---

## Prompt 5B — Content Velocity Engine

**Goal:** Establish a repeatable monthly content production system for blog articles. Each article targets a specific keyword, includes an inline quote CTA, and is reviewed before publishing.

**Run once per month starting Month 2. Target: 2 articles per month.**

```
You are managing BAAM System I — Insurance Brokerage Platform.
This is the monthly content production cycle for the blog/resources section.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Article Selection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each month, select 2 articles from the content backlog.
Backlog is maintained in a shared spreadsheet (create one if it doesn't exist):

Column headers:
  Title | Target Keyword | Search Volume (est.) | Difficulty | Category | Status | Publish Date

Content backlog — starter list (add to this monthly):

ALREADY SEEDED (Phase 2E — 8 articles):
  Published or pending: see admin/blog/

MONTH 3–6 PIPELINE (add to admin as drafts):
  "How Much Does TLC Insurance Cost in NYC? (2026 Guide)"
    Target: "TLC insurance cost NYC"   Category: TLC
  "What Is the Minimum Auto Insurance in New York State?"
    Target: "minimum auto insurance NY"   Category: Auto
  "How to Get a Certificate of Insurance Fast in NYC"
    Target: "certificate of insurance NYC"   Category: Business/Construction
  "Homeowner Insurance vs Renter Insurance: What's the Difference?"
    Target: "homeowner vs renter insurance"   Category: Home
  "Do I Need Workers Comp If I'm Self-Employed in New York?"
    Target: "workers comp self employed NY"   Category: Business
  "How Does Bundling Auto and Home Insurance Actually Save You Money?"
    Target: "bundle auto home insurance save"   Category: Auto/Home
  "What Does a General Liability Policy Actually Cover? (With Examples)"
    Target: "general liability insurance covers"   Category: Business
  "Uber/Lyft Driver Insurance: What Your Personal Policy Won't Cover"
    Target: "rideshare driver insurance"   Category: TLC/Auto
  "What Is Agreed Value vs Actual Cash Value Insurance?"
    Target: "agreed value actual cash value"   Category: General/Boat
  "Construction Insurance Checklist for New York Contractors"
    Target: "construction insurance checklist NY"   Category: Construction
  "How Long Does It Take to Get Homeowner Insurance?"
    Target: "how long homeowner insurance"   Category: Home
  "What Is an Insurance Broker and How Do They Get Paid?"
    Target: "how does insurance broker get paid"   Category: General
  "Top 10 Reasons People Switch Insurance Brokers"
    Target: "switch insurance broker"   Category: General
  "Group Health Insurance for Small Businesses: A Step-by-Step Guide"
    Target: "group health insurance small business"   Category: Business

Selection criteria for this month (pick the best 2):
  a) GSC queries where you're showing up at position 11–25 (just off page 1) for that keyword
  b) Coverage types that had high quote request volume last month
  c) Seasonal: Q4 = renewal season, Q1 = business starts, Q2 = home buying season

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Article Production
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each selected article:

A) AI-ASSISTED DRAFT (using Claude or similar):
   Prompt template:
   ---
   Write a 1000–1400 word blog article for an independent insurance brokerage
   serving New York City. The article title is "[Title]".
   Target keyword: "[keyword]" — use it in the H1, one H2, and 2–3 times in the body.
   Brokerage name: [Peerless Brokerage]. Phone: [phone].

   Structure:
   - Introduction (150 words): hook with a relatable scenario or stat
   - 3–5 H2 sections (600–900 words): answer the keyword question thoroughly
   - Include one specific call-to-action paragraph in the middle of the article:
     "Ready to [relevant action]? Call [Brokerage Name] at [phone] or [get a free quote]."
   - FAQ section at the bottom: 3 questions with concise answers
   - Conclusion (100 words): reinforce the main point + CTA

   Tone: professional but approachable. Not salesy. Not academic.
   NYC-specific: reference NY state law, NYC regulations, or local context where accurate.
   Do NOT make specific price claims without a qualifier ("rates vary," "starting at," etc.)
   ---

B) HUMAN REVIEW (required before publishing):
   Review checklist:
   [ ] All factual claims are accurate (verify any state law references)
   [ ] No specific price promises that can't be kept
   [ ] License-specific statements are correct for the brokerage's licensed states
   [ ] Inline CTA uses real phone number and links to /quote
   [ ] The article actually helps the reader (passes the "would I share this?" test)
   [ ] A licensed agent has approved any coverage-specific claims

C) ADMIN ENTRY:
   In admin/blog/:
   - Title: [exact title from article]
   - Slug: [auto-generated or manual — use keyword-friendly slug]
   - Category: [from backlog category]
   - Related Insurance Type: [select from insurance_lines — links sidebar tile]
   - Author: [agent name, or brokerage name if no specific author]
   - Read Time: [auto-calculated from word count]
   - Cover Image: [use stock from Unsplash/Pexels or upload a relevant image]
   - Meta Title: [57-char max — include keyword + brokerage name if space]
   - Meta Description: [155-char max — first sentence of article or a summary]
   - Published: ✓ (after review passed)
   - Publish Date: [set to today, or a past date to spread publication history]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Post-Publish Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After each article is published:
  [ ] GSC → URL Inspection → Request Indexing for the new article URL
  [ ] Share on brokerage's Google Business Profile (Posts feature)
  [ ] Share on any social media accounts the brokerage maintains
  [ ] Update the content backlog spreadsheet: Status = Published, Publish Date = today

After publishing, the article automatically appears on:
  - /resources (blog listing page) — newest first
  - Related service page sidebar (if related_type is set)
  - Home page BlogPreviewSection (if it's in the top 3 newest)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TESTIMONIAL COLLECTION (run alongside blog each month)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Goal: collect 5 new real testimonials per month.

SOURCE 1 — From bound policies (automated):
  When a quote_request is marked 'bound', the review request email is sent (Phase 3E).
  Track: how many review emails sent this month vs how many reviews received.
  Target conversion: 1 review per 4 emails sent.

SOURCE 2 — Manual outreach:
  Each month, the brokerage agent identifies 5 long-term satisfied clients.
  Send a personal email (not the automated template):
    "Hi [Name], we've loved working with you for [X] years.
     Would you mind leaving us a Google review? It means a lot to our small team."
  Personal emails from an agent convert 3–5× better than automated ones.

SOURCE 3 — Import from Google:
  Each month, check Google Business Profile for new reviews.
  Import any ≥ 4-star reviews using the "Import from Google" tool (Phase 3E).
  Publish immediately after setting coverage_type.

Monthly target: 5 new published testimonials by end of each month.
```

**Done-Gate 5B (monthly):**
- 2 articles published this month
- Each article has: meta title, meta description, cover image, related_type, read_time
- Each article requested for GSC indexing
- Article appears on /resources listing page
- Article appears in related service page sidebar (if related_type set)
- 5+ new testimonials published this month
- Content backlog updated with current month's work

---

## Prompt 5C — Programmatic SEO Expansion

**Goal:** Systematically expand location coverage — adding 2–5 new city/neighborhood pages each month until the full service area is covered.

**Run once per month starting Month 2.**

```
You are managing BAAM System I — Insurance Brokerage Platform.
This is the monthly location expansion cycle.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Location Expansion Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each month, add 2–5 new location slugs to site.json.activeLocationSlugs.

Prioritization order:
  A) GSC "Queries" report: any queries containing a city name that ISN'T in activeLocationSlugs yet?
     Example: 40 impressions for "auto insurance Flushing" but no Flushing location page → add it.
  B) Carrier / lead data: where are quote requests coming from? Add those cities first.
  C) Bordering neighborhoods: expand ring by ring from the brokerage's primary office.
  D) Strategic high-value areas: add cities where premium coverage (TLC, commercial) is concentrated.

NYC expansion sequence (typical for a Brooklyn-based broker):
  Wave 1 (Phase 3): Brooklyn, Queens, Flushing, Bronx, Staten Island, Manhattan ✅
  Wave 2 (Month 2): Jersey City, Newark, Hoboken
  Wave 3 (Month 3): Yonkers, White Plains, Westchester County neighborhoods
  Wave 4 (Month 4): Stamford CT, Bridgeport CT
  Wave 5 (Month 5): Long Island — Hempstead, Jamaica, Valley Stream
  Wave 6 (Month 6): Specific NYC neighborhoods — Astoria, Jackson Heights, Sunset Park, Bay Ridge

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Add New Locations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each new city to add:

A) Verify the location exists in lib/insurance/locations.ts:
   If not → add it:
   '[slug]': {
     slug: '[slug]',
     name: '[City Name]',
     state: '[State Name]',
     stateCode: '[ST]',
     county: '[County Name]',
     metro: '[Metro Area]',
     population: [number],
     specialNotes: {
       'tlc': '[Any TLC-specific note for this city, or omit]',
       'homeowner': '[Any flood/weather risk note, or omit]',
     }
   }

B) Add the slug to site.json.activeLocationSlugs:
   In admin Site Settings → Location Pages → check the new city.
   After saving: Next.js revalidates the new location pages automatically.

C) Verify the new pages render:
   /insurance/auto/[new-city] → should render with correct city name in headline
   /insurance/tlc/[new-city] → check TLC special note if configured
   /locations → new city should appear in the grid under the correct state group

D) Request indexing for new pages:
   In GSC → URL Inspection:
   Request indexing for:
   /insurance/auto/[new-city]
   /insurance/homeowner/[new-city]
   /insurance/tlc/[new-city]   (if NYC-relevant)
   /insurance/workers-comp/[new-city]
   (4 pages per new city — stays within daily GSC indexing request limit)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Location Content Enrichment (quarterly)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Standard location pages use the template from Phase 3B.
After 3 months, revisit the highest-traffic location pages and enrich them:

For top 5 location pages by GSC impressions:
  A) Add a location-specific paragraph to LocalExpertiseSection:
     "[City] residents and businesses face [specific local context — e.g. 'higher auto theft rates
     than the NY state average' or 'frequent flooding near [landmark] requiring flood insurance riders'].
     Our brokers understand the specific risks and requirements for [City] policyholders."

  B) Add 1–2 location-specific FAQ questions:
     "What is the average cost of auto insurance in [City]?"
     "Do I need flood insurance in [City], [State]?"
     These are added to the location page's FAQ section (not the base service page).

  To support location-specific content, extend the location page system:
  File: content/locations/[slug].json (optional override file)
  If this file exists, its content MERGES with the template-generated content.
  {
    "autoLocalNote": "Brooklyn has one of the highest vehicle theft rates in NYC...",
    "homeownerLocalNote": "Parts of Red Hook and Sunset Park are in FEMA flood zones...",
    "faqExtra": [
      { "question": "What is the average car insurance cost in Brooklyn?",
        "answer": "Brooklyn drivers typically pay 20–35% above the NY state average..." }
    ]
  }
  The page component checks for this file and merges its content before rendering.
```

**Done-Gate 5C (monthly):**
- 2–5 new location slugs added to activeLocationSlugs this month
- All new locations verified rendering with correct city name
- New locations visible in /locations grid
- GSC indexing requested for 4 pages per new city
- Location registry (locations.ts) updated if new entries were needed
- Previous month's location pages checked for first GSC impressions

---

## Prompt 5D — Lead Pipeline Optimization

**Goal:** Improve quote form conversion rate and lead quality through measured A/B testing and agent workflow improvements.

**Run once per month — review data, make one change, measure for 30 days.**

```
You are managing BAAM System I — Insurance Brokerage Platform.
This is the monthly lead pipeline review and optimization session.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MONTHLY METRICS REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pull from DB and GA4. Record in the monthly metrics spreadsheet.

QUOTE FUNNEL (from GA4 and DB):
  /quote visitors this month:         [X]
  Step 1 completions (tile selected):  [X]  ([X]%)
  Step 2 completions (contact info):   [X]  ([X]%)
  Submissions (form completed):        [X]  ([X]%)
  Quote-to-submission rate:            [X]%  (target: > 35%)

LEAD QUALITY (from DB):
  Total quote_requests this month:    [X]
  Avg coverage types per request:     [X]  (> 1.5 = prospect is shopping broadly = good)
  Requests with message in details:   [X]%  (higher = more engaged prospects)
  Requests from mobile:               [X]%

AGENT PERFORMANCE (from DB status transitions):
  Avg hours to first contact:         [X]  (target: < 2 hours business hours)
  Response rate (contacted / total):  [X]%  (target: > 95%)
  Quote rate (quoted / contacted):    [X]%  (target: > 70%)
  Bind rate (bound / quoted):         [X]%  (industry avg: 20–40%)
  Coverage type with highest bind:    [type]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A/B TEST FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run ONE A/B test at a time. Never test two things simultaneously.
Minimum 30 days per test before declaring a winner.
Minimum 50 form submissions per variant before declaring a winner.

Test queue (run in this order, each for one month):

TEST 1 — Hero CTA label (Month 2):
  Control:  "Get a Free Quote"
  Variant:  "Compare Your Rates — Free"
  Metric:   /quote visits from home page (GA4 quote_cta_click events)
  Implementation: content_entries home.json → hero.ctaPrimary.label (change in admin)
  No code change needed — just content change.

TEST 2 — Quote form Step 1 heading (Month 3):
  Control:  "What coverage are you looking for?"
  Variant:  "What do you need to protect?"
  Metric:   Step 1 → Step 2 completion rate (GA4 funnel)
  Implementation: pages/quote.json → form.step1Heading (add this field to quote.json and QuoteForm)

TEST 3 — Bottom CTA variant (Month 4):
  Control:  'form-inline' (mini form at bottom of every page)
  Variant:  'cta-only' (just buttons — no inline form)
  Metric:   quote_requests with source 'service_page' vs 'quote_page'
  Implementation: service page JSON → quoteCta._variant toggle

TEST 4 — Trust panel placement (Month 5):
  Control:  Trust panel on RIGHT side of quote form (desktop sidebar)
  Variant:  Trust panel ABOVE the form (full-width, collapsed on mobile)
  Metric:   Form submission rate on desktop
  Implementation: QuoteForm component — conditional layout based on quote.json trustPanel.position

DECLARING A WINNER:
  A test wins if the variant outperforms control by ≥ 10% on the primary metric
  with ≥ 50 observations per variant.
  After declaring: update the content/code to the winning variant permanently.
  Start the next test in the queue.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT WORKFLOW IMPROVEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If avg response time > 2 hours:
  OPTION A — SMS notification (add to Phase 3D email system):
    When a new quote_request is created, also send an SMS to the assigned agent (or team).
    Use Twilio (add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN env vars).
    File: lib/notifications/smsNotification.ts
    Text message: "New quote request: [firstName] [lastName] — [coverage types] — [phone]
    View in admin: [admin URL]"
    Only send SMS if site.json.notificationSmsNumber is set.

  OPTION B — Mobile admin push notification:
    Requires a PWA wrapper or native app — defer to Phase 5H if needed.
    Simpler short-term: the existing email + SMS covers most workflows.

If bind rate < 15%:
  Review with client: are quotes being followed up on same day?
  Are carriers' rates competitive for the types getting low bind?
  Add a "Close date" field to quote_requests to track time-to-bind.
```

**Done-Gate 5D (monthly):**
- Monthly metrics recorded in spreadsheet
- Active A/B test identified, variant deployed (content-only change)
- Previous month's test results declared (winner or inconclusive)
- If response time > 2 hours: SMS notification implemented or root cause identified
- Lead pipeline metrics trend documented (month-over-month comparison)

---

## Prompt 5E — Second Brokerage Client Onboarding

**Goal:** Onboard a second brokerage client using the Phase 3D onboarding wizard. This validates the multi-tenant platform works for a real second client and identifies any gaps in the wizard or platform architecture.

**Run once per new client. Typically starts Month 3–4 after the first launch.**

```
You are building BAAM System I — Insurance Brokerage Platform.
This is a new brokerage client onboarding session.
New client: [Client 2 Name, e.g. "Metro Shield Insurance"]
Primary domain: [client2domain.com]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRE-ONBOARDING CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Collect the same pre-phase data as Phase 4:
  [ ] Legal name, DBA, phone, email, address, hours
  [ ] Founded year, tagline
  [ ] State license numbers
  [ ] Google Business Profile URL + rating
  [ ] Agent list with headshots
  [ ] Carrier list
  [ ] Service area (cities)
  [ ] Languages spoken
  [ ] Notification email for leads
  [ ] Desired theme: same navy+gold, OR custom colors?
  [ ] Domain DNS access confirmed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Run the Onboarding Wizard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Log in as platform_super_admin.
Navigate to admin/onboarding/.
Complete all 5 wizard steps for the new client:
  Step 1: Brokerage profile (name, domain, phone, etc.)
  Step 2: Theme & branding (logo + colors — if client wants custom palette)
  Step 3: License & compliance
  Step 4: Insurance lines (enable/disable per client's actual offerings)
  Step 5: Review + Create Site

After "Create Site":
  - New site record created in DB
  - New site_domains record
  - 15 insurance_lines records
  - Default content_entries for all pages (from lib/templates/default-content.ts)
  - Admin user account created

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Verify Site Isolation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After wizard creates the new site, verify multi-site isolation:

  [ ] New site has its own site_id in DB — different from Peerless
  [ ] quote_requests for new site have site_id = new_site_id (not Peerless)
  [ ] Visiting new site's domain shows new site content (not Peerless content)
  [ ] Admin login for new site only shows new site's data
  [ ] New site's /carriers shows only carriers assigned to new site
  [ ] Peerless site unaffected — all its data still correct

DATA ISOLATION TEST:
  Submit a test quote on Client 2's site.
  Verify it appears in Client 2's admin/quote-requests, NOT in Peerless's dashboard.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Content Population (Client 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Follow the same process as Phase 4A–4C for the new client:
  4A: Update site.json + all page JSON with real client data
  4B: Upload + assign real media assets
  4C: Add real agents, carriers, testimonials

Time savings vs Phase 4: the wizard pre-populated most of site.json.
Estimate: 3 hours total for content population (vs ~6 hours for the first client).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Custom Theme (if requested)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If Client 2 wants different colors (not the default navy+gold):

  In admin Site Settings → Theme:
  Update theme.json for client 2's site_id:
  {
    "--color-brand-500": "[client hex]",
    "--color-brand-600": "[darker shade]",
    "--color-brand-700": "[darkest shade]",
    "--color-brand-800": "[darkest — for dark sections]",
    "--color-gold-500": "[accent color]",
    "--color-gold-400": "[lighter accent]"
  }

  The theme system (from Phase 0B) applies these CSS variables per site.
  No component code changes needed — all colors reference CSS variables.

  VERIFY: Changing theme.json only affects client 2's site.
  Visit Peerless site — should still show navy+gold unchanged.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — QA + Launch (Client 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run the Phase 4D QA script on client 2's site (abbreviated version):
  [ ] Home page loads with client 2's branding
  [ ] Quote form submits → client 2's quote_requests updated, NOT Peerless
  [ ] Notification email goes to client 2's notificationEmail
  [ ] Admin login: client 2's admin sees only their data
  [ ] Domain configured + SSL verified (Phase 4F steps 1–2)
  [ ] GSC property created for client 2's domain

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WIZARD IMPROVEMENT LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After each new client onboarding, record:
  - What was confusing or required developer help during the wizard?
  - What data still needed manual entry after the wizard?
  - Time taken: [X] hours (target: < 4 hours per client including QA)

Improve the wizard after each onboarding until the target time is met.
By client 5, onboarding should require < 2 hours of developer time.
```

**Done-Gate 5E:**
- Client 2 site live at their domain with SSL
- Test quote on client 2 site appears only in client 2's admin
- Peerless data completely isolated — not visible in client 2's admin
- Client 2's theme (if custom) applied without touching Peerless styles
- Client 2's GSC + GA4 properties created
- Wizard improvement log updated with this onboarding's learnings

---

## Prompt 5F — Client Portal Foundation

**Goal:** Build the foundation of a client-facing portal at `/portal`. Existing clients can log in to view their policy summaries, request certificates of insurance, and report claims.

**Run in Quarter 2 (approximately Month 4–5). This is a new product feature — allocate a full sprint.**

```
You are building BAAM System I — Insurance Brokerage Platform.
This is a new product feature — the client portal.
Reference: @INSURANCE_COMPLETE_PLAN.md Stage B Retention section

Files:
  app/[locale]/portal/                       ← NEW route group
  app/[locale]/portal/page.tsx               ← Dashboard (after login)
  app/[locale]/portal/login/page.tsx         ← Client login
  app/api/portal/                            ← Portal API routes
  lib/portal/                                ← Portal utilities

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCOPE — MVP CLIENT PORTAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MVP (Phase 5F) includes ONLY:
  ✓ Client login (email + password, separate from admin auth)
  ✓ Policy summary view (manually entered by broker admin)
  ✓ Document upload/download (policy PDFs uploaded by broker)
  ✓ COI request form (Certificate of Insurance request)
  ✓ Claims intake form (report a new claim)
  ✗ NOT: integration with carrier systems (Phase 5H+)
  ✗ NOT: automated policy renewal reminders (Phase 5H+)
  ✗ NOT: payment processing (Phase 5H+)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — New DB Tables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Migration: create 4 new tables:

-- portal_clients: client login accounts
CREATE TABLE portal_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, email)
);

-- client_policies: policy summaries (manually entered by broker)
CREATE TABLE client_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id),
  client_id UUID REFERENCES portal_clients(id) ON DELETE CASCADE,
  policy_number TEXT,
  coverage_type TEXT,              -- insurance_line slug
  carrier_name TEXT,
  effective_date DATE,
  expiration_date DATE,
  premium_annual NUMERIC(10,2),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- client_documents: policy PDFs and other documents
CREATE TABLE client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id),
  client_id UUID REFERENCES portal_clients(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES client_policies(id),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,                  -- 'policy', 'coi', 'endorsement', 'other'
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- portal_requests: COI requests and claims intake
CREATE TABLE portal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id),
  client_id UUID REFERENCES portal_clients(id),
  request_type TEXT NOT NULL,      -- 'coi' | 'claim'
  status TEXT DEFAULT 'new',       -- 'new' | 'in-progress' | 'completed'
  details JSONB,                   -- request-specific fields
  notes TEXT,                      -- broker notes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Client Authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use a SEPARATE auth flow from the admin auth.
DO NOT reuse the admin NextAuth setup for clients — keep them completely separate.

Client auth: simple custom implementation:
  - Login: POST /api/portal/auth/login
    Verifies email + password against portal_clients table (bcrypt compare)
    Sets a httpOnly cookie: portal_session (JWT containing client_id + site_id)
  - Logout: POST /api/portal/auth/logout — clears cookie
  - Session: GET /api/portal/auth/session — returns client profile from cookie
  - Portal middleware: app/[locale]/portal/layout.tsx checks for portal_session cookie
    If missing → redirect to /portal/login

Password policy:
  - Min 8 characters, at least 1 number
  - Stored as bcrypt hash (never plaintext)
  - "Forgot password" flow (Phase 5G — use email reset link)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Portal Pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/portal/login (public — no auth required):
  Simple centered card: Email + Password fields + "Log In" button
  "Forgot password?" link (Phase 5G)
  "New client? Contact us to set up your account." + phone link
  No self-service registration — broker creates client accounts

/portal (dashboard — auth required):
  After login: welcome message "Welcome back, [firstName]"
  3-section layout:

  SECTION 1 — Active Policies:
  Table of client_policies WHERE client_id = current AND expiration_date >= today:
  | Coverage Type | Carrier | Policy # | Expires | Annual Premium | Documents |
  Each row: "Documents" link opens document list for that policy (modal or sub-page)
  "Policy expires in X days" badge — amber if < 60 days, red if < 30 days

  SECTION 2 — Quick Actions:
  Two large action cards:
  [📄 Request a Certificate of Insurance] → /portal/coi-request
  [⚠️ Report a Claim] → /portal/claim

  SECTION 3 — Recent Documents:
  Last 5 uploaded documents with download links
  "View all documents →" link

/portal/coi-request:
  Heading: "Request a Certificate of Insurance"
  Form fields:
  - Policy (select — from client's active policies)
  - Certificate Holder Name (text, required — who is the COI for)
  - Certificate Holder Address (text, required)
  - Required by Date (date, required)
  - Additional Insured? (radio: Yes / No)
  - Description of Operations (textarea, optional)
  - Submit: "Submit COI Request"
  On submit → creates portal_requests record (request_type: 'coi')
  Sends email notification to site.json.notificationEmail
  Confirmation: "Your COI request was submitted. We typically issue COIs within 2 business hours."

/portal/claim:
  Heading: "Report a Claim"
  Form fields:
  - Policy (select — from client's active policies)
  - Date of Loss (date, required)
  - Description of Incident (textarea, required, min 50 chars)
  - Estimated Damage (select: < $1,000 / $1,000–$5,000 / $5,000–$25,000 / > $25,000 / Unknown)
  - Were there injuries? (radio: Yes / No / Unsure)
  - Photos attached? (file upload, optional, accept images only, max 5 files, max 10MB each)
  - Submit: "Report This Claim"
  On submit → creates portal_requests record (request_type: 'claim')
  Sends urgent email notification to site.json.notificationEmail with subject:
    "⚠️ New Claim Report — [policyType] — [clientName]"
  Confirmation: "Your claim has been reported. An agent will contact you within 1 business hour."
  Photos: uploaded to media storage (existing media system), URLs stored in portal_requests.details.photos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Admin Extensions for Portal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEW admin pages:

admin/portal-clients/ — Client Accounts Manager:
  Table: email, name, phone, # active policies, last login, active toggle
  Add Client: form (email, name, phone) → creates portal_clients record + sends welcome email
    Welcome email: "Your [Brokerage Name] client portal is ready. Login: [portal URL]
    Your temporary password: [generated 8-char password]
    Please change your password after your first login."
  Edit Client: update name, phone, reset password
  View Client: shows client's policies, documents, and portal_requests

admin/portal-clients/[id]/policies/ — Policy Manager per client:
  Add policy, edit policy, upload documents to policy

admin/portal-requests/ — COI + Claims Dashboard:
  Table: date | client | type (COI/Claim) | policy | status | assigned agent | actions
  Status workflow: new → in-progress → completed
  Claim requests: marked with red urgency indicator
  Filter by: type (COI/Claim), status, date range

Add "Portal" group to admin sidebar:
  Portal Clients | Portal Requests (with new-request badge)
```

**Done-Gate 5F:**
- `/portal/login` renders, login with test credentials works
- `/portal` dashboard shows test client's policies and quick action cards
- Policy expiry badge shows amber/red correctly based on expiration date
- COI request form submits → portal_requests record created → notification email sent
- Claim report form submits with photo upload → record created + urgent email sent
- Admin portal-clients page shows clients, allows adding new account
- Admin sends welcome email on new client creation
- Admin portal-requests table shows COI and claim requests with status workflow
- Portal client CANNOT see another client's data (RLS verified)
- Portal client CANNOT access admin routes (separate auth confirmed)

---

## Prompt 5G — Multi-Language Expansion (Spanish)

**Goal:** Add Spanish language support for the public-facing site. Priority pages: TLC, auto, business, quote form. NYC's TLC driver market is heavily Spanish-speaking — this directly increases revenue.

**Run in Quarter 2–3. Scope: Spanish for 6 core pages + quote form.**

```
You are building BAAM System I — Insurance Brokerage Platform.
Reference: The codebase was forked from medical-clinic/chinese-medicine which has bilingual EN/ZH routing.
The i18n routing system already exists — we are EXTENDING it to support EN/ES.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Routing Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The app/[locale]/ routing pattern already exists.
Add 'es' to the supported locales:

  File: middleware.ts
  Add 'es' to the locales array: ['en', 'es']
  Default locale: 'en'

  File: i18n.ts (or equivalent config)
  Update: locales: ['en', 'es']

Result:
  https://realdomain.com/ → English (default)
  https://realdomain.com/es/ → Spanish home page
  https://realdomain.com/es/insurance/tlc → Spanish TLC page
  https://realdomain.com/es/quote → Spanish quote form

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Translation Layer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content strategy: DB-first translations (same as medical codebase).
Each content_entry has a locale field. Spanish content lives in a separate DB record.

For each supported page:
  content_entries WHERE path = 'pages/home.json' AND locale = 'en'  → English content
  content_entries WHERE path = 'pages/home.json' AND locale = 'es'  → Spanish content

If Spanish content_entry doesn't exist for a path: fall back to English.
This means pages launch in English first and get translated progressively.

PRIORITY TRANSLATION ORDER:
  1. pages/quote.json (highest impact — Spanish speakers can now submit quotes in Spanish)
  2. pages/insurance/tlc.json (TLC drivers are heavily Spanish-speaking)
  3. pages/insurance/auto.json
  4. pages/home.json
  5. pages/contact.json
  6. pages/insurance/workers-comp.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Translation Content Production
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each priority page, produce the Spanish translation:

A) AI-ASSISTED TRANSLATION:
   Prompt:
   "Translate the following insurance website content to professional Mexican/NYC Spanish.
   Keep all proper nouns (carrier names, legal terms) in English unless they have standard Spanish equivalents.
   Insurance terms: use standard industry Spanish — 'seguro de auto', 'seguro de vivienda', etc.
   Tone: professional but approachable. Avoid overly formal or overly colloquial Spanish.
   NYC-specific: where EN says 'New York' keep as 'Nueva York'.
   [paste JSON content]"

B) NATIVE SPEAKER REVIEW (required):
   Have the translated content reviewed by a native Spanish speaker before publishing.
   If the brokerage has Spanish-speaking agents, they are the best reviewers.
   Changes from review: edit directly in admin Content Editor for the 'es' locale.

C) ADMIN ENTRY:
   In admin Content Editor: use the locale selector (add ES to the locale dropdown).
   Create a new content_entry for each page with locale = 'es' and the translated JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Language Switcher Component
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/ui/LanguageSwitcher.tsx

Simple dropdown or toggle:
  [EN] [ES]
  Clicking switches between English and Spanish version of the current page.
  Maintains the current path: /insurance/tlc ↔ /es/insurance/tlc

Add to: InsuranceHeader (top bar, right side — after language badge)
Add to: MobileStickyPhoneBar area (or mobile menu)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Spanish Quote Form
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The quote form at /es/quote must be fully in Spanish.
Field labels, placeholders, validation messages, confirmation — all in Spanish.

Approach: read UI strings from quote.json (locale-specific).
Add to pages/quote.json (es locale):
  form:
    step1Heading: "¿Qué cobertura está buscando?"
    step2Heading: "¿Cómo podemos contactarle?"
    step3Heading: "Algunos detalles adicionales (opcional)"
    submitLabel: "Enviar Mi Solicitud"
    confirmationHeading: "¡Solicitud Recibida!"
    confirmationBody: "Gracias, [firstName]. Le contactaremos en menos de 2 horas hábiles."
    ...

Language preference in quote_requests:
  When submitted from /es/quote: auto-set language_preference = 'Spanish'
  Admin sees this in the detail drawer — agents know to respond in Spanish.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — Spanish SEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each Spanish page, generateMetadata() returns:
  title: Spanish title (from es locale content_entry seo.title)
  description: Spanish description
  <link rel="alternate" hreflang="en" href="https://realdomain.com/insurance/tlc" />
  <link rel="alternate" hreflang="es" href="https://realdomain.com/es/insurance/tlc" />
  <link rel="alternate" hreflang="x-default" href="https://realdomain.com/insurance/tlc" />

hreflang tags are CRITICAL for multi-language SEO — without them Google may penalize duplicate content.

Submit Spanish sitemap entries to GSC:
  app/sitemap.ts: generate entries for /es/* pages alongside /en/* pages
  Submit updated sitemap to GSC after deploying.

Target Spanish keywords (add to content backlog):
  "seguro de auto NYC"
  "seguro TLC Nueva York"
  "seguro de negocio Nueva York"
  "seguro barato para carros en Nueva York"
  "compensación de trabajadores Nueva York"
```

**Done-Gate 5G:**
- https://realdomain.com/es/ loads in Spanish (home page)
- https://realdomain.com/es/insurance/tlc loads in Spanish TLC page
- https://realdomain.com/es/quote — all form labels and messages in Spanish
- Quote submitted from /es/quote → language_preference = 'Spanish' in DB
- Language switcher in header toggles between /insurance/tlc ↔ /es/insurance/tlc
- hreflang tags in `<head>` of all bilingual pages
- Spanish pages in sitemap.xml
- Native Spanish speaker has reviewed translated content
- 0 English text visible on any /es/ page (except proper nouns and legal terms)

---

## Prompt 5H — Advanced Admin + Monthly Reporting

**Goal:** Add the reporting and operational tools brokers need to run the business day-to-day. Monthly lead summary emails, bulk data export, renewal tracking, and platform analytics.

**Run in Quarter 3 (approximately Month 7–9).**

```
You are building BAAM System I — Insurance Brokerage Platform.
This prompt adds operational tools to the admin — no public-facing changes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE 1 — Monthly Report Email
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: lib/reports/monthlyReport.ts
API: app/api/admin/reports/monthly/route.ts
Cron: triggered on the 1st of each month at 8am (use Vercel Cron or a scheduled DB function)

Monthly report email sent to site.json.reportEmail (separate from notification email):

Email content:
  Subject: "[Month] Insurance Performance Report — [Brokerage Name]"

  ═══ LEAD PERFORMANCE ═══════════════
  Total quote requests:      X
  Breakdown by coverage:     Auto: X | TLC: X | Home: X | Business: X | Other: X
  Leads by source:           Quote page: X | Service pages: X | Contact form: X
  Average daily leads:       X

  ═══ CONVERSION ════════════════════
  New leads:      X
  Contacted:      X  (X% response rate)
  Quoted:         X  (X% quote rate)
  Bound:          X  (X% bind rate ← key metric)
  Avg time to contact: X hours

  ═══ TOP COVERAGE TYPES ════════════
  1. Auto Insurance    — X leads, X bound
  2. TLC Insurance     — X leads, X bound
  3. [other]

  ═══ WEBSITE TRAFFIC (if GA4 connected) ═
  Total visitors:    X
  Top 3 pages:       / | /insurance/auto | /quote
  Quote form starts: X
  Quote form completions: X (X% form completion rate)

  ═══ UPCOMING RENEWALS ═════════════
  Policies expiring next 60 days: X
  [list of client + policy type + expiry date]

  [View Full Dashboard →] link to admin

Admin settings (admin/site-settings/ → "Reports" section):
  - Report Email: text input → site.json.reportEmail
  - Include GA4 data: toggle (requires GA4 Measurement Protocol key)
  - Send on: day-of-month selector (default: 1st)
  - [Send Test Report] button → sends test email immediately

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE 2 — Bulk Lead Export
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/api/admin/quote-requests/export/route.ts

In admin/quote-requests/ dashboard, add an "Export" button.
Clicking opens an export modal:
  - Date range (from / to)
  - Status filter (all / new / contacted / quoted / bound / closed)
  - Coverage type filter
  - Format: CSV (always) | Excel (optional)
  - [Download Export] button

Export CSV columns:
  Date | First Name | Last Name | Phone | Email | Coverage Types | Source | Contact Time |
  Language | Status | Assigned Agent | Notes | Submitted At

CSV is generated server-side and streamed as a file download.
No third-party library needed — standard CSV generation with comma escaping.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE 3 — Policy Renewal Tracking
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Admin → Portal Clients → add a "Renewals" view:

File: app/admin/(protected)/renewals/page.tsx

Shows all client_policies expiring in the next 90 days:
  Table: Client Name | Coverage Type | Carrier | Expiry Date | Days Until Renewal | Action
  Sorted by: expiry date ascending (soonest first)

Color coding:
  < 30 days: red row
  30–60 days: amber row
  60–90 days: normal

Action per row:
  "Contact Client" → opens a pre-filled email draft in the default email client:
    mailto:[client email]?subject=Your [Coverage Type] Policy Renews on [Date]
    &body=Hi [Name], your [Coverage Type] policy with [Carrier] renews on [date].
    We'd love to review your options and make sure you have the best rate...
  "Mark as Renewed" → updates policy is_active status

In monthly report email: include the "Upcoming Renewals" section (from Feature 1 above).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE 4 — Platform Super-Admin Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/admin/(protected)/platform/page.tsx
Access: platform_super_admin only

This gives BAAM (the platform operator) visibility across all brokerage clients.

Sections:
  SITES OVERVIEW:
    Table: Site Name | Domain | Agents | Active Policies | Leads (30 days) | Last Admin Login
    Click site name → opens that site's admin in context

  PLATFORM METRICS:
    Total sites: X
    Total quote requests (all sites, last 30 days): X
    Total portal clients (all sites): X
    Total policies in system: X

  RECENT ONBOARDINGS:
    Last 5 sites created via wizard: name + creation date + last activity

  HEALTH ALERTS:
    Sites with 0 quote requests in last 30 days (may be inactive or broken)
    Sites with admin login > 30 days ago (may need check-in)
    Sites with Lighthouse score < 85 (performance regression)
```

**Done-Gate 5H:**
- Monthly report email sends on 1st of month to configured reportEmail
- Test report email delivers with all correct metric sections
- "Export" button in admin/quote-requests downloads a valid CSV
- CSV opens in Excel/Google Sheets with correct columns and no encoding errors
- /admin/renewals shows policies expiring in next 90 days with correct color coding
- "Contact Client" link opens email client with pre-filled subject and body
- Platform super-admin dashboard shows all sites in one view
- Health alerts flag sites with no recent activity

---

## Prompt 5I — 12-Month SEO & Growth Review

**Goal:** At month 12, conduct a comprehensive review of the entire platform's SEO performance, content library, and conversion metrics. Set the roadmap for Year 2.

**Run once at Month 12.**

```
You are managing BAAM System I — Insurance Brokerage Platform.
The site has been live for 12 months. Conduct a full annual review.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANNUAL SEO REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GSC — Year 1 aggregate:
  Total clicks: [X]
  Total impressions: [X]
  Average CTR: [X]%
  Average position: [X]

TOP 20 KEYWORDS by clicks (document in spreadsheet):
  [keyword] | [clicks] | [avg position]

KEYWORD RANKING PROGRESS:
  Review the key money keywords against Month 1 baseline:
  "[city] insurance broker"         M1: [pos] → M12: [pos]
  "TLC insurance NYC"               M1: [pos] → M12: [pos]
  "auto insurance [city]"           M1: [pos] → M12: [pos]
  "independent insurance broker [city]"  M1: [pos] → M12: [pos]

CONTENT LIBRARY AUDIT:
  Total blog articles published: [X] (target: 24 over 12 months)
  Articles ranking on page 1 for their target keyword: [X] ([X]%)
  Top 5 articles by organic traffic: [list]
  Articles to update (> 12 months old, ranking 6–20): [list these for refresh]

LOCATION PAGES AUDIT:
  Total active location pages: [X types] × [X cities] = [X pages]
  Location pages receiving organic traffic: [X] ([X]%)
  Best performing location page: [URL] — [X] clicks
  New cities to add in Year 2: [list based on GSC "nearby" queries]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANNUAL CONVERSION REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FULL-YEAR LEAD METRICS:
  Total quote requests: [X]
  Total bound policies (from web leads): [X]
  Overall bind rate: [X]% (Year 1 average)
  Estimated revenue from web leads: [X] × [avg annual premium] × [avg commission %]

CONVERSION TREND (month by month):
  Jan: [X] leads, [X] bound
  Feb: [X] leads, [X] bound
  ...
  Dec: [X] leads, [X] bound

  Is conversion rate trending up or down in H2 vs H1?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLATFORM REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total brokerage clients on platform: [X]
  Clients with > 10 leads/month: [X]
  Client retention: [X] of [X] still active

  Platform NPS (ask each client 1 question: "How likely are you to recommend the platform
  to another brokerage?" 0–10): record each score, calculate NPS.

  NPS = % Promoters (9–10) − % Detractors (0–6)
  Target NPS: > 40

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YEAR 2 ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on the annual review, define the Year 2 roadmap. Template:

CONTINUE (doing well, keep doing it):
  - [e.g. Monthly blog publication — 85% of articles ranking page 1]
  - [e.g. Location page expansion — generating 20% of organic leads]

IMPROVE (doing it but underperforming):
  - [e.g. Blog CTR — avg 1.2%, target 2.5% — rewrite all meta descriptions]
  - [e.g. Quote form mobile completion — 28%, target 40% — run Step 2 UX test]

START (not doing yet, high potential):
  - [e.g. Google Business Profile posts — not active, low effort, local SEO signal]
  - [e.g. Video content — agent intro videos — high engagement signal for Google]
  - [e.g. Backlink outreach — local NYC business directories and news sites]
  - [e.g. Chinese language expansion — serve the Flushing market directly]

STOP (doing it, not working):
  - [e.g. Posting on Facebook — 0 leads in 12 months, not worth the time]

YEAR 2 TARGETS:
  Organic traffic: [Year 1 × 2.5] (SEO compounds year over year)
  Monthly quote requests: [Year 1 average × 2]
  Platform clients: [current + 3 new]
  Blog articles: 24 more (2/month)
  New location pages: 20 more
  Client portal MAU: [target monthly active portal users]
```

**Done-Gate 5I:**
- Annual review document completed and shared with client
- Top 20 keywords and their year-over-year position changes recorded
- Content library audit: articles to refresh identified
- Full-year lead metrics and bind rate calculated
- NPS survey sent to all platform clients, results recorded
- Year 2 roadmap written, reviewed, and approved by client
- Technical: Lighthouse scores re-run on all core pages — any regressions fixed
- Tag release: `v1.0-year1-complete`

---

## Phase 5 Ongoing Operations Checklist

This checklist runs every month in perpetuity. Pin it to the project management tool.

### Weekly (Every Monday)
- [ ] Check admin/quote-requests for any leads > 48 hours without contact
- [ ] Check for any new GSC coverage errors (takes 2 minutes)
- [ ] Verify site is loading (no Vercel outage alerts)

### Monthly (First Week)
- [ ] Run 5A metrics review (condensed version after month 1)
- [ ] Publish 2 new blog articles (5B)
- [ ] Add 2–5 new location pages (5C)
- [ ] Review and publish 5+ new testimonials
- [ ] Update Google review score in admin if changed
- [ ] Check Lighthouse on home page — regression alert if < 88
- [ ] Request GSC indexing for new articles and location pages
- [ ] Review active A/B test results (5D)

### Quarterly
- [ ] Run full technical health check (all pages, broken links, console errors)
- [ ] Review top 20 GSC keywords — any page-1 opportunities to capitalize on?
- [ ] Refresh any blog article > 12 months old that's ranking 6–20 (update stats, resubmit to GSC)
- [ ] Review portal client requests — any process improvements needed?
- [ ] Platform client check-ins — any new onboardings in pipeline?
- [ ] Update carrier logos if any carriers have been added or dropped
- [ ] Run Lighthouse CI (`npm run lighthouse`) and commit results

### Annually
- [ ] Run full 5I annual review
- [ ] Renew SSL certificate if not auto-renewed (Vercel handles this automatically)
- [ ] Review and update all FAQ answers for accuracy
- [ ] Review site.json: update years in business, client count, review scores
- [ ] Run full QA script (Phase 4D) on current production site
- [ ] Tag annual release: `v[X.0]-year[N]-complete`

---

## Platform Growth Trajectory

| Milestone | Target Month | Success Signal |
|-----------|-------------|----------------|
| First organic lead | Month 1–2 | GSC shows first click |
| 10 leads/month | Month 2–3 | Organic + direct referrals |
| Page 1 for primary keyword | Month 3–6 | GSC avg position < 10 |
| 25 leads/month | Month 4–6 | SEO compounding |
| Second brokerage client | Month 3–4 | Onboarding wizard used |
| 50 leads/month | Month 6–9 | Content + location pages driving traffic |
| Spanish leads flowing | Month 6–8 | quote_requests with language = Spanish |
| Client portal MAU > 20 | Month 8–12 | Portal clients logging in regularly |
| Third brokerage client | Month 6 | Platform scale-up |
| Page 1 for TLC keyword | Month 4–6 | Highest-value keyword |
| 100 leads/month | Month 9–12 | Full SEO maturity |
| Year 1 complete | Month 12 | Annual review done, Year 2 roadmap set |
