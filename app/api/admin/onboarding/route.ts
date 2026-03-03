import { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { isSuperAdmin } from '@/lib/admin/permissions';
import fs from 'fs';
import path from 'path';

// ── Types ────────────────────────────────────────────────────────────

interface StepProgress {
  step: string;
  label: string;
  status: 'running' | 'done' | 'error';
  message: string;
  duration?: number;
}

interface OnboardResult {
  siteId: string;
  entries: number;
  services: number;
  domains: number;
  errors: string[];
  warnings: string[];
}

// ── TCM Service catalog ──────────────────────────────────────────────

const TCM_SERVICES: Record<string, Array<{ slug: string; label: string }>> = {
  'Core Modalities': [
    { slug: 'acupuncture', label: 'Acupuncture' },
    { slug: 'chinese-herbal-medicine', label: 'Chinese Herbal Medicine' },
    { slug: 'cupping-therapy', label: 'Cupping Therapy' },
    { slug: 'moxibustion', label: 'Moxibustion' },
  ],
  'Manual Therapies': [
    { slug: 'tuina-massage', label: 'Tui Na Medical Massage' },
    { slug: 'gua-sha', label: 'Gua Sha' },
  ],
  'Wellness & Lifestyle': [
    { slug: 'dietary-therapy', label: 'Chinese Dietary Therapy' },
    { slug: 'lifestyle-counseling', label: 'Lifestyle & Wellness Counseling' },
  ],
};

// Flat list of all service slugs for default/pruning
const ALL_SERVICE_SLUGS = Object.values(TCM_SERVICES).flat().map((s) => s.slug);

// Category-to-slugs mapping for pruning
const SERVICE_CATEGORIES: Record<string, string[]> = {
  'Core Modalities': ['acupuncture', 'chinese-herbal-medicine', 'cupping-therapy', 'moxibustion'],
  'Manual Therapies': ['tuina-massage', 'gua-sha'],
  'Wellness & Lifestyle': ['dietary-therapy', 'lifestyle-counseling'],
};

// ── Color utilities ──────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function darken(hex: string, percent: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, l - percent));
}

function lighten(hex: string, percent: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.min(100, l + percent));
}

// ── Deep string replace ──────────────────────────────────────────────

function deepReplace(obj: any, replacements: [string, string][]): any {
  if (typeof obj === 'string') {
    let result = obj;
    for (const [search, replace] of replacements) {
      result = result.replaceAll(search, replace);
    }
    return result;
  }
  if (Array.isArray(obj)) return obj.map((item) => deepReplace(item, replacements));
  if (obj && typeof obj === 'object') {
    const out: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      out[key] = deepReplace(val, replacements);
    }
    return out;
  }
  return obj;
}

// ── Slugify ──────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/^(dr\.?\s+)/i, 'dr-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ── Phone to tel link ────────────────────────────────────────────────

function phoneToTel(phone: string): string {
  return 'tel:+1' + phone.replace(/[^0-9]/g, '');
}

// ── Template interpolation ───────────────────────────────────────────

function interpolateTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

// ── Supabase REST helpers ────────────────────────────────────────────

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return { url, key };
}

function supaHeaders(key: string): Record<string, string> {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=representation',
  };
}

async function supaFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const { url, key } = getSupabaseConfig();
  const headers = { ...supaHeaders(key), ...(options.headers as Record<string, string> || {}) };
  return fetch(`${url}/rest/v1/${path}`, { ...options, headers });
}

async function upsert(table: string, rows: any[], onConflict?: string): Promise<any[]> {
  const queryPath = onConflict ? `${table}?on_conflict=${onConflict}` : table;
  const res = await supaFetch(queryPath, { method: 'POST', body: JSON.stringify(rows) });
  if (!res.ok) throw new Error(`Upsert ${table} failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function fetchRows(table: string, filters: Record<string, string>): Promise<any[]> {
  const { url, key } = getSupabaseConfig();
  const params = Object.entries(filters).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const res = await fetch(`${url}/rest/v1/${table}?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Fetch ${table} failed (${res.status})`);
  return res.json();
}

async function deleteRows(table: string, filters: Record<string, string>): Promise<void> {
  const { key } = getSupabaseConfig();
  const res = await supaFetch(
    `${table}?${Object.entries(filters).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&')}`,
    { method: 'DELETE', headers: supaHeaders(key) }
  );
  if (!res.ok) throw new Error(`Delete ${table} failed (${res.status}): ${await res.text()}`);
}

// ── Claude API helpers ───────────────────────────────────────────────

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API failed (${res.status}): ${body}`);
  }
  const result = await res.json();
  return result.content[0].text;
}

function parseJsonFromResponse(text: string): any {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  const jsonStr = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();
  try {
    return JSON.parse(jsonStr);
  } catch (e: any) {
    const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (braceMatch) return JSON.parse(braceMatch[0]);
    throw new Error(`Failed to parse AI response as JSON: ${e.message}`);
  }
}

// ── POST handler ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Auth check
  const session = await getSessionFromRequest(request);
  if (!session) {
    return new Response(JSON.stringify({ message: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!isSuperAdmin(session.user)) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse intake from request body
  let intake: any;
  try {
    intake = await request.json();
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!intake.clientId || !intake.business?.name) {
    return new Response(JSON.stringify({ message: 'clientId and business.name are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate Supabase config early
  try {
    getSupabaseConfig();
  } catch (e: any) {
    return new Response(JSON.stringify({ message: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const TEMPLATE_ID = intake.templateSiteId || 'dr-huang-clinic';
  const SITE_ID: string = intake.clientId;
  const LOCALES: string[] = intake.locales?.supported || ['en'];
  const DEFAULT_LOCALE: string = intake.locales?.default || 'en';
  const SKIP_AI: boolean = intake.skipAi === true;
  const CONTENT_DIR = path.join(process.cwd(), 'content');

  // SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const emitProgress = (step: string, label: string, status: StepProgress['status'], message: string, duration?: number) => {
        const payload: StepProgress = { step, label, status, message };
        if (duration !== undefined) payload.duration = duration;
        emit('progress', payload);
      };

      const result: OnboardResult = {
        siteId: SITE_ID,
        entries: 0,
        services: 0,
        domains: 0,
        errors: [],
        warnings: [],
      };

      try {
        // ════════════════════════════════════════════════════════════════
        //  O1: CLONE
        // ════════════════════════════════════════════════════════════════
        const o1Start = Date.now();
        emitProgress('O1', 'Clone', 'running', 'Cloning template...');

        try {
          // Check if site already exists
          const existing = await fetchRows('sites', { id: SITE_ID });
          if (existing.length === 0) {
            await upsert('sites', [{
              id: SITE_ID,
              name: intake.business.name,
              domain: intake.domains?.production || '',
              enabled: true,
              default_locale: DEFAULT_LOCALE,
              supported_locales: LOCALES,
            }], 'id');
          }

          // Clone content entries from template
          const templateEntries = await fetchRows('content_entries', { site_id: TEMPLATE_ID });
          const cloned = templateEntries.map((e: any) => ({
            site_id: SITE_ID,
            locale: e.locale,
            path: e.path,
            data: e.data,
            updated_by: 'onboard-api',
          }));

          const BATCH = 50;
          for (let i = 0; i < cloned.length; i += BATCH) {
            await upsert('content_entries', cloned.slice(i, i + BATCH), 'site_id,locale,path');
          }

          // Register domain aliases
          const domainRows: any[] = [];
          if (intake.domains?.production) {
            domainRows.push({ site_id: SITE_ID, domain: intake.domains.production, environment: 'prod', enabled: true });
          }
          if (intake.domains?.dev) {
            domainRows.push({ site_id: SITE_ID, domain: intake.domains.dev, environment: 'dev', enabled: true });
          }
          if (domainRows.length > 0) {
            await upsert('site_domains', domainRows, 'site_id,domain,environment');
          }
          result.domains = domainRows.length;

          // Update local _sites.json
          const sitesFile = path.join(CONTENT_DIR, '_sites.json');
          try {
            const sitesData = JSON.parse(fs.readFileSync(sitesFile, 'utf-8'));
            if (!sitesData.sites.find((s: any) => s.id === SITE_ID)) {
              sitesData.sites.push({
                id: SITE_ID,
                name: intake.business.name,
                domain: intake.domains?.production || '',
                enabled: true,
                defaultLocale: DEFAULT_LOCALE,
                supportedLocales: LOCALES,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
              fs.writeFileSync(sitesFile, JSON.stringify(sitesData, null, 2) + '\n');
            }
          } catch { /* _sites.json may not exist in all environments */ }

          // Update local _site-domains.json
          const domainsFile = path.join(CONTENT_DIR, '_site-domains.json');
          try {
            const domainsData = JSON.parse(fs.readFileSync(domainsFile, 'utf-8'));
            for (const dr of domainRows) {
              if (!domainsData.domains.find((d: any) => d.siteId === dr.site_id && d.domain === dr.domain)) {
                domainsData.domains.push({ siteId: dr.site_id, domain: dr.domain, environment: dr.environment, enabled: true });
              }
            }
            fs.writeFileSync(domainsFile, JSON.stringify(domainsData, null, 2) + '\n');
          } catch { /* _site-domains.json may not exist in all environments */ }

          emitProgress('O1', 'Clone', 'done', `Cloned ${cloned.length} entries`, Date.now() - o1Start);
        } catch (err: any) {
          emitProgress('O1', 'Clone', 'error', err.message, Date.now() - o1Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O2: BRAND
        // ════════════════════════════════════════════════════════════════
        const o2Start = Date.now();
        emitProgress('O2', 'Brand', 'running', 'Applying brand theme...');

        try {
          const variantsPath = path.join(process.cwd(), 'scripts', 'onboard', 'brand-variants.json');
          const variants = JSON.parse(fs.readFileSync(variantsPath, 'utf-8'));
          const variantName = intake.brand?.variant || 'teal-gold';
          const base = JSON.parse(JSON.stringify(variants[variantName] || variants['teal-gold']));

          // Apply color overrides
          if (intake.brand?.primaryColor) {
            const pc = intake.brand.primaryColor;
            base.colors.primary.DEFAULT = pc;
            base.colors.primary.dark = darken(pc, 12);
            base.colors.primary.light = lighten(pc, 18);
            base.colors.primary['50'] = lighten(pc, 42);
            base.colors.primary['100'] = lighten(pc, 32);
          }
          if (intake.brand?.secondaryColor) {
            const sc = intake.brand.secondaryColor;
            base.colors.secondary.DEFAULT = sc;
            base.colors.secondary.dark = darken(sc, 12);
            base.colors.secondary.light = lighten(sc, 18);
            base.colors.secondary['50'] = lighten(sc, 42);
          }

          // Apply font overrides
          if (intake.brand?.fonts?.display) {
            const f = intake.brand.fonts.display;
            base.typography.fonts.display = `'${f}', Georgia, serif`;
            base.typography.fonts.heading = `'${f}', Georgia, serif`;
          }
          if (intake.brand?.fonts?.body) {
            const f = intake.brand.fonts.body;
            base.typography.fonts.body = `'${f}', -apple-system, sans-serif`;
            base.typography.fonts.small = `'${f}', -apple-system, sans-serif`;
          }

          // Upsert theme.json
          await upsert('content_entries', [{
            site_id: SITE_ID,
            locale: 'en',
            path: 'theme.json',
            data: base,
            updated_by: 'onboard-api',
          }], 'site_id,locale,path');

          emitProgress('O2', 'Brand', 'done', `Applied variant "${variantName}"`, Date.now() - o2Start);
        } catch (err: any) {
          emitProgress('O2', 'Brand', 'error', err.message, Date.now() - o2Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O3: PRUNE SERVICES
        // ════════════════════════════════════════════════════════════════
        const o3Start = Date.now();
        emitProgress('O3', 'Prune Services', 'running', 'Pruning disabled services...');

        try {
          const enabledSlugs: string[] = intake.services?.enabled || ALL_SERVICE_SLUGS;
          const disabledSlugs = ALL_SERVICE_SLUGS.filter((s) => !enabledSlugs.includes(s));

          if (disabledSlugs.length > 0) {
            for (const locale of LOCALES) {
              // ── 1. Filter servicesList.items[] in pages/services.json ──
              const svcRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'pages/services.json' });
              if (svcRows[0]?.data) {
                const svc = svcRows[0].data;
                if (svc.servicesList?.items) {
                  svc.servicesList.items = svc.servicesList.items.filter(
                    (item: any) => enabledSlugs.includes(item.id)
                  );
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'pages/services.json', data: svc, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }

              // ── 2. Filter services in pages/home.json ─────────────────
              const homeRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'pages/home.json' });
              if (homeRows[0]?.data) {
                const home = homeRows[0].data;
                // Filter services.services[] (the grid items)
                if (home.services?.services) {
                  home.services.services = home.services.services.filter(
                    (s: any) => enabledSlugs.includes(s.id)
                  );
                }
                // Filter services.additionalServices[] if it exists
                if (home.services?.additionalServices) {
                  home.services.additionalServices = home.services.additionalServices.filter(
                    (s: any) => enabledSlugs.includes(s.id)
                  );
                }
                // Filter featured service if it was disabled
                if (home.services?.featured?.id && !enabledSlugs.includes(home.services.featured.id)) {
                  // Promote first enabled service to featured
                  if (home.services.services.length > 0) {
                    home.services.featured = home.services.services.shift();
                  }
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'pages/home.json', data: home, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }

              // ── 3. Filter services[] in footer.json ───────────────────
              const footerRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'footer.json' });
              if (footerRows[0]?.data) {
                const footer = footerRows[0].data;
                if (footer.services) {
                  footer.services = footer.services.filter((s: any) => {
                    // Keep the main /services link
                    if (s.url === '/services' || s.url?.endsWith('/services')) return true;
                    // Check if the href contains an enabled slug
                    const href = s.url || '';
                    return enabledSlugs.some((slug) => href.includes(slug));
                  });
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'footer.json', data: footer, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }

              // NOTE: No separate service files to delete (TCM services are inline)
              // NOTE: No navigation pruning needed (TCM nav is flat, no service sub-menu)
            }
          }

          emitProgress('O3', 'Prune Services', 'done', `${enabledSlugs.length} enabled, ${disabledSlugs.length} removed`, Date.now() - o3Start);
          result.services = enabledSlugs.length;
        } catch (err: any) {
          emitProgress('O3', 'Prune Services', 'error', err.message, Date.now() - o3Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O4: CONTENT REPLACEMENT
        // ════════════════════════════════════════════════════════════════
        const o4Start = Date.now();
        emitProgress('O4', 'Content Replacement', 'running', 'Replacing template content...');

        try {
          const biz = intake.business;
          const loc = intake.location;

          // Build replacement pairs — ordered longest-first to avoid partial matches
          // Business name is always required
          const replacements: [string, string][] = [];

          // Owner name replacements (longest first)
          if (biz.ownerName) {
            const ownerWithCreds = biz.ownerNameWithCredentials || biz.ownerName;
            replacements.push(
              ['Dr. Huang, L.Ac., MSTCM', ownerWithCreds],
              ['Dr Huang Clinic', biz.name],
              ['Dr. Huang', biz.ownerName],
              ['Dr Huang', biz.ownerName.replace(/\.\s?/g, ' ').trim()],
            );
          } else {
            replacements.push(
              ['Dr Huang Clinic', biz.name],
            );
          }

          // Email (longest first)
          if (loc.email) {
            replacements.push(
              ['mailto:sancai.acu@gmail.com', `mailto:${loc.email}`],
              ['sancai.acu@gmail.com', loc.email],
            );
          }

          // Phone (longest first)
          if (loc.phone) {
            const phoneDigits = loc.phone.replace(/[^0-9]/g, '');
            replacements.push(
              ['tel:+18453811106', phoneToTel(loc.phone)],
              ['+18453811106', `+1${phoneDigits}`],
              ['(845) 381-1106', loc.phone],
            );
          }

          // Address (longest first — full address before partial)
          if (loc.address && loc.city && loc.state && loc.zip) {
            replacements.push(
              ['71 East Main Street, Middletown, NY 10940', `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`],
              ['71 East Main Street', loc.address],
              ['Middletown, NY 10940', `${loc.city}, ${loc.state} ${loc.zip}`],
              ['Middletown, NY', `${loc.city}, ${loc.state}`],
              ['NY 10940', `${loc.state} ${loc.zip}`],
              ['Middletown', loc.city],
              ['10940', loc.zip],
            );
          }

          // Domain
          if (intake.domains?.production) {
            replacements.push(['drhuangclinic.com', intake.domains.production]);
          }

          // Fetch all content entries for new site and deep-replace
          const allEntries = await fetchRows('content_entries', { site_id: SITE_ID });
          const updated: any[] = [];
          for (const entry of allEntries) {
            if (entry.path === 'theme.json') continue;
            const newData = deepReplace(entry.data, replacements);
            if (JSON.stringify(newData) !== JSON.stringify(entry.data)) {
              updated.push({ site_id: SITE_ID, locale: entry.locale, path: entry.path, data: newData, updated_by: 'onboard-api' });
            }
          }

          const BATCH = 50;
          for (let i = 0; i < updated.length; i += BATCH) {
            await upsert('content_entries', updated.slice(i, i + BATCH), 'site_id,locale,path');
          }

          // ── Structural updates for specific files ──────────────────
          for (const locale of LOCALES) {
            // site.json — TCM uses clinicName (not businessName)
            const siteRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'site.json' });
            if (siteRows[0]?.data) {
              const site = siteRows[0].data;
              site.clinicName = biz.name;
              if (biz.tagline) site.tagline = biz.tagline;
              if (biz.description) site.description = biz.description;
              if (loc.address) site.address = loc.address;
              if (loc.city) site.city = loc.city;
              if (loc.state) site.state = loc.state;
              if (loc.zip) site.zip = loc.zip;
              if (loc.phone) site.phone = loc.phone;
              if (loc.email) site.email = loc.email;
              if (loc.addressMapUrl) site.addressMapUrl = loc.addressMapUrl;
              if (intake.hours && Object.keys(intake.hours).length > 0) site.hours = intake.hours;
              // Social — TCM includes wechat field
              if (intake.social && Object.values(intake.social).some(Boolean)) {
                site.social = { ...site.social, ...intake.social };
              }
              // Keep headerVariant as-is (from template)
              const langLabels: Record<string, string> = { en: 'English', zh: '中文', es: 'Espanol', ko: '한국어' };
              const langFlags: Record<string, string> = { en: 'US', zh: 'CN', es: 'MX', ko: 'KR' };
              site.languages = LOCALES.map((code) => ({
                code, label: langLabels[code] || code, flag: langFlags[code] || '', enabled: true,
              }));
              await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'site.json', data: site, updated_by: 'onboard-api' }], 'site_id,locale,path');
            }

            // header.json — update logo, topbar
            const headerRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'header.json' });
            if (headerRows[0]?.data) {
              const header = headerRows[0].data;
              // menu.logo.text — business name (remove " Clinic"/" Practice" if present)
              if (header.menu?.logo) {
                header.menu.logo.text = biz.name.replace(/ Clinic$/, '').replace(/ Practice$/, '');
                if (biz.tagline) header.menu.logo.subtext = biz.tagline;
              }
              // topbar fields
              if (header.topbar) {
                if (loc.phone) {
                  header.topbar.phone = loc.phone;
                  header.topbar.phoneHref = phoneToTel(loc.phone);
                }
                if (loc.address && loc.city && loc.state && loc.zip) {
                  header.topbar.address = `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`;
                  if (loc.addressMapUrl) header.topbar.addressHref = loc.addressMapUrl;
                }
              }
              await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'header.json', data: header, updated_by: 'onboard-api' }], 'site_id,locale,path');
            }

            // footer.json — update brand, contact, hours, copyright
            const footerRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'footer.json' });
            if (footerRows[0]?.data) {
              const footer = footerRows[0].data;
              // brand
              footer.brand = {
                ...footer.brand,
                name: biz.name,
                ...(biz.description ? { description: biz.description } : {}),
              };
              // contact
              if (loc.phone || loc.email || loc.address) {
                footer.contact = {
                  ...footer.contact,
                  ...(loc.phone ? { phone: loc.phone, phoneLink: phoneToTel(loc.phone) } : {}),
                  ...(loc.email ? { email: loc.email, emailLink: `mailto:${loc.email}` } : {}),
                  ...(loc.address ? { addressLines: [loc.address, `${loc.city}, ${loc.state} ${loc.zip}`] } : {}),
                };
              }
              // hours
              if (intake.hours && Object.keys(intake.hours).length > 0) {
                const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                const dayAbbr: Record<string, string> = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };
                footer.hours = daysOrder
                  .filter((d) => intake.hours[d])
                  .map((d) => `${dayAbbr[d]}: ${intake.hours[d]}`);
              }
              // copyright
              footer.copyright = `\u00A9 ${new Date().getFullYear()} ${biz.name}. All rights reserved.`;
              await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'footer.json', data: footer, updated_by: 'onboard-api' }], 'site_id,locale,path');
            }

            // ── about.json — practitioner profile (embedded, not separate files) ──
            if (biz.ownerName) {
              const aboutRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'pages/about.json' });
              if (aboutRows[0]?.data) {
                const about = aboutRows[0].data;

                // Update profile
                if (about.profile) {
                  about.profile.name = biz.ownerNameWithCredentials || biz.ownerName;
                  if (biz.ownerTitle) about.profile.title = biz.ownerTitle;
                }

                // Update credentials if provided
                if (biz.ownerCredentials && biz.ownerCredentials.length > 0 && about.credentials) {
                  about.credentials.items = biz.ownerCredentials.map((cred: any) => ({
                    icon: cred.icon || 'Award',
                    year: cred.year || '',
                    location: cred.location || '',
                    credential: cred.credential,
                    institution: cred.institution || '',
                  }));
                }

                // Update specializations if provided
                if (biz.ownerSpecializations && biz.ownerSpecializations.length > 0 && about.specializations) {
                  about.specializations.areas = biz.ownerSpecializations.map((spec: any) => {
                    if (typeof spec === 'string') {
                      return { icon: 'Activity', title: spec, description: '' };
                    }
                    return {
                      icon: spec.icon || 'Activity',
                      title: spec.title,
                      description: spec.description || '',
                    };
                  });
                }

                // Update affiliations/certifications if provided
                if (biz.ownerCertifications && biz.ownerCertifications.length > 0 && about.affiliations) {
                  about.affiliations.organizations = biz.ownerCertifications.map((cert: any) => {
                    if (typeof cert === 'string') {
                      return { name: cert, role: 'Member' };
                    }
                    return { name: cert.name, role: cert.role || 'Member' };
                  });
                }

                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'pages/about.json', data: about, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }
            }
            // NOTE: No separate doctor files to create/delete in TCM
          }

          emitProgress('O4', 'Content Replacement', 'done', `Deep-replaced ${updated.length} entries`, Date.now() - o4Start);
        } catch (err: any) {
          emitProgress('O4', 'Content Replacement', 'error', err.message, Date.now() - o4Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O5: AI CONTENT + SEO
        // ════════════════════════════════════════════════════════════════
        const o5Start = Date.now();
        emitProgress('O5', 'AI Content', 'running', SKIP_AI ? 'Skipping AI (skipAi=true)...' : 'Generating AI content + SEO...');

        try {
          if (!SKIP_AI) {
            const biz = intake.business;
            const loc = intake.location;
            const tone = intake.contentTone || {};

            // Generate content via Claude — prompts path for chinese-medicine
            const promptDir = path.join(process.cwd(), 'scripts', 'onboard', 'prompts', 'chinese-medicine');
            const contentPromptPath = path.join(promptDir, 'content.md');
            const contentPrompt = fs.readFileSync(contentPromptPath, 'utf-8');

            const contentInput = interpolateTemplate(contentPrompt, {
              businessName: biz.name,
              ownerName: biz.ownerName || '',
              ownerTitle: biz.ownerTitle || '',
              city: loc.city,
              state: loc.state,
              foundedYear: String(biz.foundedYear || ''),
              yearsExperience: biz.yearsExperience || '',
              languages: (biz.ownerLanguages || []).join(', '),
              uniqueSellingPoints: (tone.uniqueSellingPoints || []).map((u: string) => `- ${u}`).join('\n'),
              targetDemographic: tone.targetDemographic || '',
              voice: tone.voice || 'warm-professional',
              servicesList: (intake.services?.enabled || ALL_SERVICE_SLUGS).join(', '),
              ownerCredentials: JSON.stringify(biz.ownerCredentials || [], null, 2),
              ownerCertifications: (biz.ownerCertifications || []).map((c: any) => typeof c === 'string' ? c : c.name).join(', '),
              ownerSpecializations: (biz.ownerSpecializations || []).map((s: any) => typeof s === 'string' ? s : s.title).join(', '),
            });

            const contentResult = await callClaude(contentInput);
            const aiContent = parseJsonFromResponse(contentResult);

            // Generate SEO via Claude — TCM pages differ from dental
            const seoPromptPath = path.join(promptDir, 'seo.md');
            const seoPrompt = fs.readFileSync(seoPromptPath, 'utf-8');
            const seoInput = interpolateTemplate(seoPrompt, {
              businessName: biz.name,
              city: loc.city,
              state: loc.state,
              phone: loc.phone || '',
              servicesList: (intake.services?.enabled || ALL_SERVICE_SLUGS).join(', '),
              languages: (biz.ownerLanguages || []).join(', '),
              // TCM pages: about, services, contact, blog, cases, conditions, gallery, new-patients, pricing
              pages: 'about, services, contact, blog, cases, conditions, gallery, new-patients, pricing',
            });

            const seoResult = await callClaude(seoInput);
            const aiSeo = parseJsonFromResponse(seoResult);

            // Merge AI content into DB entries
            for (const locale of LOCALES) {
              // Update home page hero
              const homeRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'pages/home.json' });
              if (homeRows[0]?.data && aiContent.hero) {
                const home = homeRows[0].data;
                if (aiContent.hero.tagline) home.hero.tagline = aiContent.hero.tagline;
                if (aiContent.hero.description) home.hero.description = aiContent.hero.description;
                if (intake.stats) home.hero.stats = intake.stats;
                if (aiContent.whyChooseUs && home.whyChooseUs) {
                  home.whyChooseUs.features = aiContent.whyChooseUs;
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'pages/home.json', data: home, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }

              // Update about page — profile, journey (embedded in about.json)
              const aboutRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'pages/about.json' });
              if (aboutRows[0]?.data) {
                const about = aboutRows[0].data;
                if (aiContent.aboutStory && about.journey) about.journey.story = aiContent.aboutStory;
                if (aiContent.ownerBio && about.profile) about.profile.bio = aiContent.ownerBio;
                if (aiContent.ownerQuote && about.profile) about.profile.quote = aiContent.ownerQuote;
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'pages/about.json', data: about, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }
              // NOTE: No separate doctor files in TCM — bio is already in about.json above

              // Update testimonials
              if (aiContent.testimonials) {
                const testimonials = aiContent.testimonials.map((t: any, i: number) => ({
                  id: `t${String(i + 1).padStart(3, '0')}`,
                  date: new Date(Date.now() - (i * 30 + Math.random() * 60) * 86400000).toISOString().split('T')[0],
                  text: t.text,
                  rating: t.rating || 5,
                  source: 'google',
                  featured: i < 3,
                  language: 'en',
                  patientName: t.patientName,
                  serviceCategory: t.serviceCategory || 'acupuncture',
                }));
                await upsert('content_entries', [{
                  site_id: SITE_ID, locale, path: 'testimonials.json',
                  data: { testimonials, displayCount: 6, showRatings: true },
                  updated_by: 'onboard-api',
                }], 'site_id,locale,path');
              }

              // Update announcement bar
              if (aiContent.announcementBar) {
                const headerRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'header.json' });
                if (headerRows[0]?.data) {
                  const header = headerRows[0].data;
                  if (header.topbar?.badge) {
                    header.topbar.badge = aiContent.announcementBar;
                  }
                  await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'header.json', data: header, updated_by: 'onboard-api' }], 'site_id,locale,path');
                }
              }

              // Update seo.json
              if (aiSeo) {
                await upsert('content_entries', [{
                  site_id: SITE_ID, locale, path: 'seo.json', data: aiSeo, updated_by: 'onboard-api',
                }], 'site_id,locale,path');
              }
            }
          }

          emitProgress('O5', 'AI Content', 'done', SKIP_AI ? 'Skipped' : 'Content + SEO generated', Date.now() - o5Start);
        } catch (err: any) {
          emitProgress('O5', 'AI Content', 'error', err.message, Date.now() - o5Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O6: CLEANUP
        // ════════════════════════════════════════════════════════════════
        const o6Start = Date.now();
        emitProgress('O6', 'Cleanup', 'running', 'Removing unsupported locales...');

        try {
          const allEntries = await fetchRows('content_entries', { site_id: SITE_ID });
          const supportedSet = new Set(LOCALES);
          const unsupportedEntries = allEntries.filter((e: any) => !supportedSet.has(e.locale) && e.locale !== 'en');

          if (unsupportedEntries.length > 0) {
            const unsupportedLocales = [...new Set(unsupportedEntries.map((e: any) => e.locale))] as string[];
            for (const locale of unsupportedLocales) {
              const entries = unsupportedEntries.filter((e: any) => e.locale === locale);
              for (const entry of entries) {
                await deleteRows('content_entries', { site_id: SITE_ID, locale, path: entry.path });
              }
            }
          }

          // Final entry count
          const finalEntries = await fetchRows('content_entries', { site_id: SITE_ID });
          result.entries = finalEntries.length;

          emitProgress('O6', 'Cleanup', 'done', `${result.entries} entries remaining`, Date.now() - o6Start);
        } catch (err: any) {
          emitProgress('O6', 'Cleanup', 'error', err.message, Date.now() - o6Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O7: VERIFY
        // ════════════════════════════════════════════════════════════════
        const o7Start = Date.now();
        emitProgress('O7', 'Verify', 'running', 'Running verification checks...');

        try {
          const allEntries = await fetchRows('content_entries', { site_id: SITE_ID });

          // 1. Required paths
          const requiredPaths = [
            'site.json', 'header.json', 'footer.json', 'navigation.json', 'seo.json',
            'pages/home.json', 'pages/services.json', 'pages/about.json', 'pages/contact.json',
          ];
          for (const locale of LOCALES) {
            for (const p of requiredPaths) {
              const found = allEntries.find((e: any) => e.locale === locale && e.path === p);
              if (!found) result.errors.push(`Missing: ${locale}/${p}`);
            }
          }

          // 2. Template contamination check — TCM template terms
          const templateTerms = ['Dr Huang Clinic', 'Dr. Huang', 'sancai.acu@gmail.com', '(845) 381-1106', '71 East Main Street'];
          const contaminated: string[] = [];
          for (const entry of allEntries) {
            const str = JSON.stringify(entry.data);
            for (const term of templateTerms) {
              if (str.includes(term)) {
                contaminated.push(`${entry.locale}/${entry.path} contains "${term}"`);
                break;
              }
            }
          }
          if (contaminated.length > 0) {
            result.warnings.push(`Template contamination in ${contaminated.length} entries`);
            contaminated.forEach((c) => result.warnings.push(c));
          }

          // 3. Service count — TCM services are inline, count items in services.json
          const svcRows = await fetchRows('content_entries', { site_id: SITE_ID, locale: DEFAULT_LOCALE, path: 'pages/services.json' });
          const svcCount = svcRows[0]?.data?.servicesList?.items?.length || 0;
          const expectedCount = intake.services?.enabled?.length || ALL_SERVICE_SLUGS.length;
          if (svcCount !== expectedCount) {
            result.warnings.push(`Service count: expected ${expectedCount}, got ${svcCount}`);
          }
          result.services = svcCount;

          // 4. Domain check
          const domains = await fetchRows('site_domains', { site_id: SITE_ID });
          if (domains.length === 0) result.errors.push('No domain aliases registered');
          result.domains = domains.length;

          const status = result.errors.length === 0 && result.warnings.length === 0
            ? 'All checks passed'
            : `${result.errors.length} errors, ${result.warnings.length} warnings`;

          emitProgress('O7', 'Verify', 'done', status, Date.now() - o7Start);
        } catch (err: any) {
          emitProgress('O7', 'Verify', 'error', err.message, Date.now() - o7Start);
          throw err;
        }

        // ── Complete ─────────────────────────────────────────────────
        emit('complete', result);

      } catch (err: any) {
        emit('error', {
          message: `Pipeline failed: ${err.message}`,
          detail: err.stack || '',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
