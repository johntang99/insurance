// ============================================================
// BAAM System I — Insurance Brokerage Platform
// TypeScript Interfaces for all insurance-specific entities
// ============================================================

// ── Insurance Line Slugs ────────────────────────────────────

export type InsuranceLineSlug =
  | 'auto'
  | 'tlc'
  | 'commercial-auto'
  | 'homeowner'
  | 'business'
  | 'workers-comp'
  | 'disability'
  | 'construction'
  | 'motorcycle'
  | 'boat'
  | 'travel'
  | 'group-health'
  | 'commercial-property'
  | 'dmv'
  | 'notary';

export type QuoteStatus = 'new' | 'contacted' | 'quoted' | 'bound' | 'closed' | 'lost';
export type CarrierCategory = 'personal' | 'commercial' | 'specialty' | 'general';

// ── Agent ───────────────────────────────────────────────────

export interface InsuranceAgent {
  id: string;
  site_id: string;
  name: string;
  slug: string;
  title?: string;
  photo_url?: string;
  bio?: string;
  specialties: InsuranceLineSlug[];
  languages: string[];
  license_number?: string;
  years_experience: number;
  phone?: string;
  email?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Carrier ─────────────────────────────────────────────────

export interface Carrier {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website?: string;
  description?: string;
  category: CarrierCategory;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface SiteCarrier {
  site_id: string;
  carrier_id: string;
  sort_order: number;
  is_featured: boolean;
  carriers?: Carrier;
}

// ── Insurance Line ───────────────────────────────────────────

export interface InsuranceLine {
  id: string;
  site_id: string;
  line_slug: InsuranceLineSlug;
  is_enabled: boolean;
  is_featured: boolean;
  custom_description?: string;
  sort_order: number;
  created_at: string;
}

// Insurance line display metadata (static, not from DB)
export interface InsuranceLineDefinition {
  slug: InsuranceLineSlug;
  name: string;
  icon: string;
  description: string;
  route: string;
}

// ── Quote Request ───────────────────────────────────────────

export interface QuoteRequest {
  id: string;
  site_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  coverage_types: InsuranceLineSlug[];
  preferred_language: string;
  best_contact_time?: string;
  message?: string;
  details: Record<string, unknown>;
  status: QuoteStatus;
  assigned_agent_id?: string;
  notes?: string;
  source: 'website' | 'phone' | 'referral';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
  agents?: Pick<InsuranceAgent, 'name' | 'email'>;
}

// ── Quote Form Submission ───────────────────────────────────

export interface QuoteFormSubmission {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  coverageTypes: InsuranceLineSlug[];
  preferredLanguage?: string;
  bestContactTime?: string;
  message?: string;
  details?: Record<string, unknown>;
  source?: string;
}

// ── Content Section Types ───────────────────────────────────

export interface HeroStat {
  value: string;
  label: string;
  suffix?: string;
}

export interface CtaConfig {
  label: string;
  href: string;
}

export interface HeroSection {
  variant: 'animated-stats' | 'split-image' | 'centered' | 'service-hero';
  badge?: string;
  headline: string;
  subline: string;
  stats?: HeroStat[];
  ctaPrimary?: CtaConfig;
  ctaSecondary?: CtaConfig;
  backgroundImage?: string;
  image?: string;
  imageAlt?: string;
}

export interface InsuranceLinesSection {
  variant: 'grid-3col' | 'featured-plus-grid' | 'list';
  headline: string;
  subline?: string;
  showIcons?: boolean;
  showDescriptions?: boolean;
  ctaLabel?: string;
}

export interface WhyIndependentSection {
  variant: 'three-columns' | 'centered-list';
  headline: string;
  subline?: string;
  points: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface StatsSection {
  variant: 'dark-band' | 'light-cards';
  items: HeroStat[];
}

export interface CarriersSection {
  variant: 'auto-scroll' | 'static-grid';
  headline: string;
  subline?: string;
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  duration?: string;
}

export interface HowItWorksSection {
  headline: string;
  subline?: string;
  steps: HowItWorksStep[];
  cta?: CtaConfig;
}

export interface TestimonialsSection {
  variant: 'featured-3' | 'masonry-grid' | 'slider';
  headline?: string;
  showRating?: boolean;
  showCoverageType?: boolean;
  filterByCoverageType?: InsuranceLineSlug;
  limit?: number;
}

export interface WhatItCoversItem {
  title: string;
  description: string;
}

export interface WhatItCoversSection {
  headline: string;
  included: WhatItCoversItem[];
  excluded: WhatItCoversItem[];
  whoNeedsIt: string;
}

export interface RateFactor {
  factor: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

export interface RateFactorsSection {
  headline: string;
  factors: RateFactor[];
  tips: string[];
}

export interface LicenseItem {
  state: string;
  licenseNumber: string;
  verifyUrl?: string;
}

export interface LicensesSection {
  headline: string;
  items: LicenseItem[];
  memberships?: Array<{ name: string; logoUrl?: string }>;
  disclaimer?: string;
}

export interface QuoteFormStep {
  step: number;
  title: string;
  description: string;
}

export interface QuoteCoverageType {
  slug: InsuranceLineSlug;
  label: string;
  icon: string;
}

export interface QuoteFormConfig {
  headline: string;
  subline: string;
  steps: QuoteFormStep[];
  contactTimeOptions: string[];
  languageOptions: string[];
  coverageTypes: QuoteCoverageType[];
  confirmation: {
    headline: string;
    subline: string;
    nextSteps: string[];
  };
}

// ── Page Content Types ─────────────────────────────────────

export interface HomePageContent {
  hero: HeroSection;
  insuranceLines: InsuranceLinesSection;
  whyIndependent: WhyIndependentSection;
  stats: StatsSection;
  carriers: CarriersSection;
  howItWorks: HowItWorksSection;
  testimonials: TestimonialsSection;
  cta: {
    headline: string;
    subline: string;
    ctaPrimary: CtaConfig;
    ctaSecondary?: CtaConfig;
    note?: string;
  };
}

export interface ServicePageContent {
  serviceHero: HeroSection;
  whatItCovers: WhatItCoversSection;
  whyUs: WhyIndependentSection;
  quoteProcess: {
    headline: string;
    steps: Array<{ title: string; description: string }>;
    duration: string;
  };
  rateFactors: RateFactorsSection;
  testimonials: TestimonialsSection;
  faq: {
    headline: string;
    items: Array<{ question: string; answer: string }>;
  };
  related: {
    headline: string;
    slugs: InsuranceLineSlug[];
  };
}

export interface QuotePageContent {
  formConfig: QuoteFormConfig;
}

// ── Static Definitions ─────────────────────────────────────

export const INSURANCE_LINE_DEFINITIONS: InsuranceLineDefinition[] = [
  { slug: 'auto',                name: 'Auto Insurance',           icon: 'car',        description: 'Personal auto coverage for individuals and families',          route: '/insurance/auto' },
  { slug: 'tlc',                 name: 'TLC Insurance',            icon: 'taxi',       description: 'TLC-compliant coverage for NYC taxi and livery drivers',        route: '/insurance/tlc' },
  { slug: 'commercial-auto',     name: 'Commercial Auto',          icon: 'truck',      description: 'Coverage for fleets, delivery vehicles, and commercial drivers', route: '/insurance/commercial-auto' },
  { slug: 'homeowner',           name: 'Homeowner Insurance',      icon: 'home',       description: 'Protect your home and personal property',                       route: '/insurance/homeowner' },
  { slug: 'business',            name: 'Business Insurance',       icon: 'briefcase',  description: 'BOP, general liability, and commercial property',               route: '/insurance/business' },
  { slug: 'workers-comp',        name: 'Workers Compensation',     icon: 'hard-hat',   description: 'Required coverage for employers in NY, NJ, CT, PA',            route: '/insurance/workers-comp' },
  { slug: 'disability',          name: 'Disability Insurance',     icon: 'shield',     description: 'Short-term and long-term income protection',                   route: '/insurance/disability' },
  { slug: 'construction',        name: 'Construction Insurance',   icon: 'hammer',     description: 'GL, builders risk, and contractor coverage',                   route: '/insurance/construction' },
  { slug: 'motorcycle',          name: 'Motorcycle Insurance',     icon: 'zap',        description: 'Year-round or seasonal motorcycle coverage',                   route: '/insurance/motorcycle' },
  { slug: 'boat',                name: 'Boat Insurance',           icon: 'anchor',     description: 'Marine coverage and agreed value policies',                    route: '/insurance/boat' },
  { slug: 'travel',              name: 'Travel Insurance',         icon: 'plane',      description: 'Trip cancellation, medical, and group travel rates',            route: '/insurance/travel' },
  { slug: 'group-health',        name: 'Group Health Insurance',   icon: 'heart',      description: 'Employer-sponsored and ACA-compliant health plans',             route: '/insurance/group-health' },
  { slug: 'commercial-property', name: 'Commercial Property',      icon: 'building',   description: 'Buildings, equipment, and inventory coverage',                  route: '/insurance/commercial-property' },
  { slug: 'dmv',                 name: 'DMV Services',             icon: 'file',       description: 'Registration, title transfers, and vehicle services',           route: '/services/dmv' },
  { slug: 'notary',              name: 'Notary Services',          icon: 'pen',        description: 'Document notarization and official certification',              route: '/services/notary' },
];
