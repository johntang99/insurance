/**
 * BAAM System I — Insurance Brokerage Platform
 * ============================================================
 * SINGLE SOURCE OF TRUTH for all design tokens.
 *
 * HOW TO USE:
 *   import { T, css } from '@/lib/insurance/theme';
 *
 *   // In inline styles:
 *   style={{ background: T.color.navy[800], color: T.color.gold[500] }}
 *
 *   // CSS variable string (for use in <style> tags):
 *   css.navyBg   → 'var(--navy-800)'
 *   css.gold     → 'var(--gold-500)'
 *   css.heading  → 'var(--font-heading)'
 *
 * TO CHANGE THE BRAND: edit the PALETTE and TYPOGRAPHY sections below.
 * Everything else derives from those values automatically.
 */

// ─── PALETTE ────────────────────────────────────────────────

export const PALETTE = {
  // Deep Navy (primary brand color)
  navy: {
    900: '#060f1d',
    800: '#0b1f3a',   // ← primary brand / main dark
    700: '#112a4d',
    600: '#173560',
    500: '#1e4275',
    100: '#dce8f5',
    50:  '#f0f5fb',
  },
  // Warm Gold (accent / CTA color)
  gold: {
    600: '#a8782a',
    500: '#c9933a',   // ← primary gold / CTAs
    400: '#d9a84f',
    300: '#e8be6e',
    100: '#fdf3e0',
  },
  // Semantic colors
  green: {
    600: '#155f3a',
    500: '#1a7a4a',
    100: '#d6f0e4',
  },
  red: {
    600: '#a83c3c',
    500: '#c74b4b',
    100: '#fde8e8',
  },
  // Neutral text
  text: {
    primary:   '#1a2535',
    secondary: '#3d5068',
    muted:     '#7a8a9a',
    light:     '#b0bec8',
  },
  // Backgrounds
  bg: {
    white:  '#ffffff',
    subtle: '#f7f8fa',
    light:  '#eef1f5',
  },
  // Borders
  border: {
    default: '#e2e8f0',
    focus:   '#1e4275',   // navy-500
  },
} as const;

// ─── TYPOGRAPHY ────────────────────────────────────────────

export const TYPOGRAPHY = {
  fontHeading: "'Playfair Display', Georgia, serif",
  fontBody:    "'Inter', system-ui, -apple-system, sans-serif",
} as const;

// ─── SPACING & SHAPE ────────────────────────────────────────

export const SHAPE = {
  radiusSm:  '6px',
  radius:    '10px',
  radiusLg:  '16px',
  radiusXl:  '24px',
  shadowSm:  '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06)',
  shadow:    '0 4px 12px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06)',
  shadowLg:  '0 10px 40px rgba(0,0,0,.14), 0 4px 16px rgba(0,0,0,.08)',
} as const;

// ─── SHORTHAND TOKEN OBJECT ─────────────────────────────────
// Use T.color.navy[800] or T.shadow etc. in components

export const T = {
  color: PALETTE,
  font:  TYPOGRAPHY,
  shape: SHAPE,
} as const;

// ─── CSS VARIABLE REFERENCES ─────────────────────────────────
// Use css.* in style={{}} props wherever you want the CSS variable
// (allows the per-site theme override system to work)

export const css = {
  // Navy shades
  navyDeep:    'var(--navy-900)',
  navyBg:      'var(--navy-800)',    // main dark background / primary
  navy700:     'var(--navy-700)',
  navy600:     'var(--navy-600)',
  navy500:     'var(--navy-500)',
  navy100:     'var(--navy-100)',
  navy50:      'var(--navy-50)',

  // Gold shades
  gold600:     'var(--gold-600)',
  gold:        'var(--gold-500)',    // primary gold / CTAs
  gold400:     'var(--gold-400)',
  gold300:     'var(--gold-300)',
  gold100:     'var(--gold-100)',

  // Semantic
  success:     'var(--green-500)',
  successBg:   'var(--green-100)',
  danger:      'var(--red-500)',
  dangerBg:    'var(--red-100)',

  // Text
  textPrimary:   'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted:     'var(--text-muted)',
  textLight:     'var(--text-light)',

  // Backgrounds
  bgWhite:  'var(--bg-white)',
  bgSubtle: 'var(--bg-subtle)',
  bgLight:  'var(--bg-light)',

  // Border
  border:       'var(--border)',
  borderFocus:  'var(--border-focus)',

  // Fonts
  heading: 'var(--font-heading)',
  body:    'var(--font-body)',

  // Shadows & radii
  shadow:   'var(--shadow)',
  shadowSm: 'var(--shadow-sm)',
  shadowLg: 'var(--shadow-lg)',
  radius:   'var(--radius)',
  radiusSm: 'var(--radius-sm)',
  radiusLg: 'var(--radius-lg)',
  radiusXl: 'var(--radius-xl)',

  // Section spacing
  sectionY: 'var(--section-y)',
  maxW:     'var(--max-w)',
} as const;

// ─── CSS VARIABLE DECLARATION STRING ─────────────────────────
// Used in app/[locale]/layout.tsx to inject :root variables.
// Overrides per-site theme.json values while keeping CSS-var system intact.

export function generateRootCSS(overrides?: {
  navyBg?: string;
  gold?: string;
}): string {
  const navy = overrides?.navyBg || PALETTE.navy[800];
  const gold  = overrides?.gold  || PALETTE.gold[500];

  // Derive related shades (simple darkening/lightening approximations)
  return `
    :root {
      /* ── Navy palette ─────────────────────────── */
      --navy-900: ${PALETTE.navy[900]};
      --navy-800: ${navy};
      --navy-700: ${PALETTE.navy[700]};
      --navy-600: ${PALETTE.navy[600]};
      --navy-500: ${PALETTE.navy[500]};
      --navy-100: ${PALETTE.navy[100]};
      --navy-50:  ${PALETTE.navy[50]};

      /* ── Gold palette ─────────────────────────── */
      --gold-600: ${PALETTE.gold[600]};
      --gold-500: ${gold};
      --gold-400: ${PALETTE.gold[400]};
      --gold-300: ${PALETTE.gold[300]};
      --gold-100: ${PALETTE.gold[100]};

      /* ── Semantic ─────────────────────────────── */
      --green-600: ${PALETTE.green[600]};
      --green-500: ${PALETTE.green[500]};
      --green-100: ${PALETTE.green[100]};
      --red-600:   ${PALETTE.red[600]};
      --red-500:   ${PALETTE.red[500]};
      --red-100:   ${PALETTE.red[100]};

      /* ── Text ────────────────────────────────── */
      --text-primary:   ${PALETTE.text.primary};
      --text-secondary: ${PALETTE.text.secondary};
      --text-muted:     ${PALETTE.text.muted};
      --text-light:     ${PALETTE.text.light};

      /* ── Backgrounds ─────────────────────────── */
      --bg-white:  ${PALETTE.bg.white};
      --bg-subtle: ${PALETTE.bg.subtle};
      --bg-light:  ${PALETTE.bg.light};

      /* ── Borders ─────────────────────────────── */
      --border:       ${PALETTE.border.default};
      --border-focus: ${PALETTE.border.focus};

      /* ── Typography ──────────────────────────── */
      --font-heading: ${TYPOGRAPHY.fontHeading};
      --font-body:    ${TYPOGRAPHY.fontBody};

      /* ── Shadows & shape ─────────────────────── */
      --shadow-sm: ${SHAPE.shadowSm};
      --shadow:    ${SHAPE.shadow};
      --shadow-lg: ${SHAPE.shadowLg};
      --radius-sm: ${SHAPE.radiusSm};
      --radius:    ${SHAPE.radius};
      --radius-lg: ${SHAPE.radiusLg};
      --radius-xl: ${SHAPE.radiusXl};

      /* ── Legacy compat (for existing components) */
      --primary:          ${navy};
      --primary-dark:     ${PALETTE.navy[900]};
      --primary-light:    ${PALETTE.navy[700]};
      --primary-50:       ${PALETTE.navy[50]};
      --primary-100:      ${PALETTE.navy[100]};
      --secondary:        ${gold};
      --secondary-dark:   ${PALETTE.gold[600]};
      --secondary-light:  ${PALETTE.gold[400]};
      --secondary-50:     ${PALETTE.gold[100]};
      --backdrop-primary: ${PALETTE.bg.subtle};
      --backdrop-secondary: ${PALETTE.gold[100]};
      --color-accent:     ${gold};
      --color-success:    ${PALETTE.green[500]};
      --color-danger:     ${PALETTE.red[500]};
      --color-bg:         ${PALETTE.bg.subtle};
      --color-bg-dark:    ${navy};
      --color-bg-card:    ${PALETTE.bg.white};
      --color-text:       ${PALETTE.text.secondary};
      --color-text-muted: ${PALETTE.text.muted};
      --section-padding-y: 5rem;
      --max-w: 1280px;
    }

    @media (max-width: 1024px) { :root { --section-y: 72px; } }
    @media (max-width: 768px)  { :root { --section-y: 56px; } }
  `;
}

// ─── STATUS COLORS ───────────────────────────────────────────
// For quote request status badges in admin

export const STATUS_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
  new:        { bg: '#fde8e8', color: '#a83c3c', dot: '#c74b4b' },
  contacted:  { bg: '#fef9c3', color: '#92400e', dot: '#f59e0b' },
  quoted:     { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
  bound:      { bg: '#d6f0e4', color: '#155f3a', dot: '#1a7a4a' },
  closed:     { bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' },
  lost:       { bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' },
};

// ─── INSURANCE LINE META ─────────────────────────────────────
// Master list of all insurance lines with display metadata

export const INSURANCE_LINE_META: Record<string, { name: string; icon: string; description: string; category: string }> = {
  'auto':               { name: 'Auto Insurance',           icon: '🚗', description: 'Personal vehicle coverage',                     category: 'personal' },
  'tlc':                { name: 'TLC Insurance',            icon: '🚕', description: 'NYC for-hire vehicle compliance',                category: 'specialty' },
  'commercial-auto':    { name: 'Commercial Auto',          icon: '🚛', description: 'Fleets & business vehicles',                     category: 'commercial' },
  'homeowner':          { name: 'Homeowner Insurance',      icon: '🏠', description: 'Home & property protection',                    category: 'personal' },
  'business':           { name: 'Business Insurance',       icon: '💼', description: 'GL, property & business income',                category: 'commercial' },
  'workers-comp':       { name: 'Workers Compensation',     icon: '🦺', description: 'Required by NY employers',                      category: 'commercial' },
  'disability':         { name: 'Disability Insurance',     icon: '🛡️', description: 'Short & long-term income protection',           category: 'personal' },
  'construction':       { name: 'Construction Insurance',   icon: '🏗️', description: 'GL, builders risk & contractor coverage',       category: 'commercial' },
  'motorcycle':         { name: 'Motorcycle Insurance',     icon: '🏍️', description: 'Year-round or seasonal coverage',              category: 'personal' },
  'boat':               { name: 'Boat Insurance',           icon: '⛵', description: 'Marine & watercraft coverage',                  category: 'personal' },
  'travel':             { name: 'Travel Insurance',         icon: '✈️', description: 'Trip cancellation, medical & group rates',      category: 'personal' },
  'group-health':       { name: 'Group Health Insurance',   icon: '❤️', description: 'Employer-sponsored ACA-compliant plans',        category: 'commercial' },
  'commercial-property':{ name: 'Commercial Property',      icon: '🏢', description: 'Buildings, equipment & inventory',              category: 'commercial' },
  'dmv':                { name: 'DMV Services',             icon: '📄', description: 'Registration & title transfers',               category: 'services' },
  'notary':             { name: 'Notary Services',          icon: '✒️', description: 'Document notarization on-site',                category: 'services' },
};

export function getLineName(slug: string): string {
  return INSURANCE_LINE_META[slug]?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function getLineIcon(slug: string): string {
  return INSURANCE_LINE_META[slug]?.icon || '🔐';
}
