/**
 * BAAM System I — Insurance Brokerage Platform
 * Location Registry — all supported service area cities
 * Add new cities here to enable their programmatic SEO pages.
 */

export interface LocationDef {
  slug: string;
  name: string;
  state: string;
  stateCode: string;
  county?: string;
  population?: number;
  notes?: string; // special SEO or content notes for this city
}

export const LOCATIONS: LocationDef[] = [
  // ── New York City ──────────────────────────────────────────
  { slug: 'brooklyn',     name: 'Brooklyn',    state: 'New York',      stateCode: 'NY', county: 'Kings',     population: 2650000 },
  { slug: 'queens',       name: 'Queens',      state: 'New York',      stateCode: 'NY', county: 'Queens',    population: 2250000 },
  { slug: 'manhattan',    name: 'Manhattan',   state: 'New York',      stateCode: 'NY', county: 'New York',  population: 1630000 },
  { slug: 'bronx',        name: 'The Bronx',   state: 'New York',      stateCode: 'NY', county: 'Bronx',     population: 1430000 },
  { slug: 'staten-island',name: 'Staten Island',state: 'New York',     stateCode: 'NY', county: 'Richmond',  population: 490000 },
  { slug: 'flushing',     name: 'Flushing',    state: 'New York',      stateCode: 'NY', county: 'Queens',    notes: 'Large Chinese-speaking community — TLC specialist' },
  { slug: 'jackson-heights',name: 'Jackson Heights', state: 'New York', stateCode: 'NY', county: 'Queens',   notes: 'Multilingual community hub' },
  { slug: 'jamaica',      name: 'Jamaica',     state: 'New York',      stateCode: 'NY', county: 'Queens' },
  { slug: 'astoria',      name: 'Astoria',     state: 'New York',      stateCode: 'NY', county: 'Queens' },
  // ── Long Island ────────────────────────────────────────────
  { slug: 'hempstead',    name: 'Hempstead',   state: 'New York',      stateCode: 'NY', county: 'Nassau' },
  { slug: 'yonkers',      name: 'Yonkers',     state: 'New York',      stateCode: 'NY', county: 'Westchester' },
  { slug: 'white-plains', name: 'White Plains',state: 'New York',      stateCode: 'NY', county: 'Westchester' },
  { slug: 'new-rochelle', name: 'New Rochelle',state: 'New York',      stateCode: 'NY', county: 'Westchester' },
  // ── New Jersey ─────────────────────────────────────────────
  { slug: 'jersey-city',  name: 'Jersey City', state: 'New Jersey',    stateCode: 'NJ', county: 'Hudson' },
  { slug: 'newark',       name: 'Newark',      state: 'New Jersey',    stateCode: 'NJ', county: 'Essex' },
  { slug: 'hoboken',      name: 'Hoboken',     state: 'New Jersey',    stateCode: 'NJ', county: 'Hudson', notes: 'High flood zone — homeowner insurance note' },
  { slug: 'bayonne',      name: 'Bayonne',     state: 'New Jersey',    stateCode: 'NJ', county: 'Hudson' },
  { slug: 'elizabeth',    name: 'Elizabeth',   state: 'New Jersey',    stateCode: 'NJ', county: 'Union' },
  // ── Connecticut ────────────────────────────────────────────
  { slug: 'stamford',     name: 'Stamford',    state: 'Connecticut',   stateCode: 'CT', county: 'Fairfield' },
  { slug: 'bridgeport',   name: 'Bridgeport',  state: 'Connecticut',   stateCode: 'CT', county: 'Fairfield' },
  // ── Pennsylvania ───────────────────────────────────────────
  { slug: 'philadelphia', name: 'Philadelphia',state: 'Pennsylvania',  stateCode: 'PA', county: 'Philadelphia' },
];

// Lookup by slug
export const LOCATION_MAP = Object.fromEntries(LOCATIONS.map(l => [l.slug, l]));

// Default active locations (shown on /locations even without DB config)
export const DEFAULT_ACTIVE_LOCATIONS = [
  'brooklyn', 'queens', 'manhattan', 'bronx', 'staten-island',
  'flushing', 'jersey-city', 'newark', 'hoboken', 'yonkers',
];

// Group by state for display
export function groupByState(slugs: string[]): Record<string, LocationDef[]> {
  const groups: Record<string, LocationDef[]> = {};
  slugs.forEach(slug => {
    const loc = LOCATION_MAP[slug];
    if (!loc) return;
    if (!groups[loc.stateCode]) groups[loc.stateCode] = [];
    groups[loc.stateCode].push(loc);
  });
  return groups;
}

// Get city-specific SEO content
export function getLocationSEO(loc: LocationDef, lineSlug: string, lineName: string, siteName: string, phone: string) {
  const isFloodZone = loc.notes?.includes('flood');
  const isTLCHub = loc.notes?.includes('TLC') || ['flushing', 'jackson-heights', 'jamaica'].includes(loc.slug);
  const isMultilingual = loc.notes?.includes('Multilingual') || loc.notes?.includes('Chinese') || loc.notes?.includes('Spanish');

  return {
    title: `${lineName} in ${loc.name}, ${loc.stateCode} | ${siteName}`,
    description: `Get a free ${lineName.toLowerCase()} quote in ${loc.name}, ${loc.stateCode}. ${siteName} compares 30+ carriers for ${loc.name} residents. Call ${phone} for same-day service.`,
    headline: `${lineName} in ${loc.name}, ${loc.stateCode}`,
    subline: `Serving ${loc.name} residents since 1999 — free quotes, 30+ carriers, same-day response.`,
    localNote: isFloodZone && lineSlug === 'homeowner'
      ? `Note: ${loc.name} has flood-prone areas. We help ${loc.name} homeowners find both standard and flood insurance coverage.`
      : isTLCHub && lineSlug === 'tlc'
      ? `${loc.name} is home to a large TLC driver community. We have dedicated TLC specialists and multilingual staff.`
      : null,
  };
}
