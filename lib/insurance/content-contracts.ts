// ============================================================
// BAAM System I — Insurance Brokerage Platform
// Content Contract Map: all pages, routes, content paths, sections
// ============================================================

export interface PageContract {
  page: string;
  route: string;
  contentPath: string;
  sections: string[];
}

// ── Page Inventory ──────────────────────────────────────────
//
// Content paths are relative to content/[siteId]/[locale]/
// The content loader reads: content/[siteId]/[locale]/[contentPath]

export const PAGE_CONTRACTS: PageContract[] = [
  {
    page: 'Home',
    route: '/',
    contentPath: 'pages/home.json',
    sections: ['hero', 'insuranceLines', 'whyIndependent', 'stats', 'carriers', 'howItWorks', 'testimonials', 'agents', 'blog', 'cta'],
  },
  {
    page: 'Insurance Hub',
    route: '/insurance',
    contentPath: 'pages/insurance.json',
    sections: ['hero', 'serviceGrid', 'whyUs', 'faq', 'cta'],
  },
  {
    page: 'Insurance Service Page (template)',
    route: '/insurance/[slug]',
    contentPath: 'pages/insurance/[slug].json',
    sections: ['serviceHero', 'whatItCovers', 'whyUs', 'quoteProcess', 'rateFactors', 'testimonials', 'faq', 'related', 'inlineForm'],
  },
  {
    page: 'Get a Quote',
    route: '/quote',
    contentPath: 'pages/quote.json',
    sections: ['formConfig'],
  },
  {
    page: 'About',
    route: '/about',
    contentPath: 'pages/about.json',
    sections: ['hero', 'story', 'mission', 'licenses', 'team', 'carriers', 'cta'],
  },
  {
    page: 'Agents',
    route: '/agents',
    contentPath: 'pages/agents.json',
    sections: ['hero', 'agentGrid'],
  },
  {
    page: 'Carriers',
    route: '/carriers',
    contentPath: 'pages/carriers.json',
    sections: ['hero', 'carrierGrid'],
  },
  {
    page: 'Testimonials',
    route: '/testimonials',
    contentPath: 'pages/testimonials.json',
    sections: ['hero', 'testimonialGrid'],
  },
  {
    page: 'Resources Hub',
    route: '/resources',
    contentPath: 'pages/resources.json',
    sections: ['hero', 'featuredPost', 'blogGrid', 'cta'],
  },
  {
    page: 'FAQ',
    route: '/faq',
    contentPath: 'pages/faq.json',
    sections: ['hero', 'faqCategories'],
  },
  {
    page: 'Claims Help',
    route: '/claims',
    contentPath: 'pages/claims.json',
    sections: ['hero', 'process', 'contact'],
  },
  {
    page: 'Contact',
    route: '/contact',
    contentPath: 'pages/contact.json',
    sections: ['hero', 'contactInfo', 'form', 'map'],
  },
  {
    page: 'DMV Services',
    route: '/services/dmv',
    contentPath: 'pages/services/dmv.json',
    sections: ['hero', 'serviceDetail', 'requirements', 'cta'],
  },
  {
    page: 'Notary Services',
    route: '/services/notary',
    contentPath: 'pages/services/notary.json',
    sections: ['hero', 'serviceDetail', 'pricing', 'cta'],
  },
];

// ── Section Variant Registry ────────────────────────────────

export interface VariantDefinition {
  sectionType: string;
  variantId: string;
  label: string;
  description: string;
}

export const SECTION_VARIANTS: VariantDefinition[] = [
  // Hero
  { sectionType: 'hero', variantId: 'animated-stats',     label: 'Stats Hero',         description: 'Homepage: animated counters + headline + dual CTA' },
  { sectionType: 'hero', variantId: 'split-image',         label: 'Split Image',        description: 'Text left, image right + single CTA' },
  { sectionType: 'hero', variantId: 'centered',            label: 'Centered',           description: 'Centered headline + CTA on clean background' },
  { sectionType: 'hero', variantId: 'service-hero',        label: 'Service Hero',       description: 'Insurance type badge + headline + quote CTA' },
  // Insurance Lines
  { sectionType: 'insuranceLines', variantId: 'grid-3col',          label: '3-Column Grid',    description: 'All enabled lines in 3-column responsive grid' },
  { sectionType: 'insuranceLines', variantId: 'featured-plus-grid', label: 'Featured + Grid',  description: '3 featured large + remaining in standard grid' },
  { sectionType: 'insuranceLines', variantId: 'list',               label: 'List View',        description: 'Vertical list with descriptions' },
  // Stats
  { sectionType: 'stats', variantId: 'dark-band',    label: 'Dark Band',    description: 'Navy background, large white stat numbers' },
  { sectionType: 'stats', variantId: 'light-cards',  label: 'Light Cards',  description: 'White cards on light background' },
  // Carriers
  { sectionType: 'carriers', variantId: 'auto-scroll',  label: 'Auto-Scroll Carousel', description: 'Infinite loop CSS animation of carrier logos' },
  { sectionType: 'carriers', variantId: 'static-grid',  label: 'Static Grid',          description: 'Responsive grid of carrier logos' },
  // Testimonials
  { sectionType: 'testimonials', variantId: 'featured-3',   label: 'Featured 3',   description: '3 highlighted testimonial cards' },
  { sectionType: 'testimonials', variantId: 'masonry-grid', label: 'Masonry Grid', description: 'Full testimonials page masonry layout' },
  { sectionType: 'testimonials', variantId: 'slider',       label: 'Slider',       description: 'Auto-rotating testimonial carousel' },
  // Why Independent
  { sectionType: 'whyIndependent', variantId: 'three-columns', label: 'Three Columns', description: '3 feature columns side-by-side' },
  { sectionType: 'whyIndependent', variantId: 'centered-list', label: 'Centered List', description: 'Centered headline + bulleted benefits' },
];

// ── Section JSON Contract Schemas ───────────────────────────
// Reference schemas for content authors and admin form generation

export const SECTION_SCHEMAS = {
  hero: {
    variant: 'animated-stats | split-image | centered | service-hero',
    badge: 'string (optional)',
    headline: 'string (required)',
    subline: 'string (required)',
    stats: '[{ value: string, label: string, suffix?: string }] (animated-stats only)',
    ctaPrimary: '{ label: string, href: string }',
    ctaSecondary: '{ label: string, href: string } (optional)',
    backgroundImage: 'string url (optional)',
    image: 'string url (split-image only)',
    imageAlt: 'string',
  },
  insuranceLines: {
    variant: 'grid-3col | featured-plus-grid | list',
    headline: 'string',
    subline: 'string (optional)',
    showIcons: 'boolean',
    showDescriptions: 'boolean',
    ctaLabel: 'string',
  },
  stats: {
    variant: 'dark-band | light-cards',
    items: '[{ value: string, label: string, suffix?: string }]',
  },
  carriers: {
    variant: 'auto-scroll | static-grid',
    headline: 'string',
    subline: 'string (optional)',
  },
  howItWorks: {
    headline: 'string',
    subline: 'string (optional)',
    steps: '[{ number: string, title: string, description: string, duration?: string }]',
    cta: '{ label: string, href: string }',
  },
  testimonials: {
    variant: 'featured-3 | masonry-grid | slider',
    headline: 'string (optional)',
    showRating: 'boolean',
    showCoverageType: 'boolean',
    filterByCoverageType: 'InsuranceLineSlug (optional)',
    limit: 'number',
  },
  whyIndependent: {
    variant: 'three-columns | centered-list',
    headline: 'string',
    subline: 'string (optional)',
    points: '[{ icon: string, title: string, description: string }]',
  },
  whatItCovers: {
    headline: 'string',
    included: '[{ title: string, description: string }]',
    excluded: '[{ title: string, description: string }]',
    whoNeedsIt: 'string (paragraph)',
  },
  rateFactors: {
    headline: 'string',
    factors: '[{ factor: string, impact: "low|medium|high", description: string }]',
    tips: 'string[]',
  },
  licenses: {
    headline: 'string',
    items: '[{ state: string, licenseNumber: string, verifyUrl?: string }]',
    memberships: '[{ name: string, logoUrl?: string }]',
    disclaimer: 'string',
  },
  quoteForm: {
    headline: 'string',
    subline: 'string',
    steps: '[{ step: number, title: string, description: string }]',
    contactTimeOptions: 'string[]',
    languageOptions: 'string[]',
    coverageTypes: '[{ slug: InsuranceLineSlug, label: string, icon: string }]',
    confirmation: '{ headline: string, subline: string, nextSteps: string[] }',
  },
} as const;
