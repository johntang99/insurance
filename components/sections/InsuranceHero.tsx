/**
 * InsuranceHero — Reusable hero for all insurance service pages + home page.
 *
 * VARIANTS:
 *  'centered'    — No image. Full-width navy bg, all content centered.
 *                  Used when no hero image is configured.
 *  'split-image' — Image on the right, text on the left inside container.
 *                  Used when hero.image is set.
 *  'home'        — Same as centered but with animated stat counters (home page).
 *
 * DATA SHAPE (from JSON content):
 *  variant?      : 'centered' | 'split-image' | 'home'  (default: auto-detected)
 *  badge?        : string
 *  headline      : string
 *  subline?      : string
 *  image?        : string  (URL → triggers split-image variant)
 *  imageAlt?     : string
 *  stats?        : { value: string; label: string; suffix?: string }[]
 *  ctaPrimary?   : { label: string; href: string }
 *  ctaSecondary? : { label: string; href: string }
 *  trustBadge?   : string  (e.g. 'Licensed · Independent · Local')
 */

import Link from 'next/link';
import Image from 'next/image';
import { Phone } from 'lucide-react';

interface HeroStat {
  value: string;
  label: string;
  suffix?: string;
}

interface HeroCta {
  label: string;
  href: string;
}

interface InsuranceHeroProps {
  // Content
  variant?: 'centered' | 'split-image' | 'home';
  badge?: string;
  icon?: string;          // emoji — only used when no image (centered/home)
  headline: string;
  subline?: string;
  image?: string;
  imageAlt?: string;
  stats?: HeroStat[];
  ctaPrimary?: HeroCta;
  ctaSecondary?: HeroCta;
  trustBadge?: string;
  urgencyNote?: string;   // e.g. TLC deadline callout
  // Style overrides
  minHeight?: number;
}

// Auto-detect variant based on data
function resolveVariant(props: InsuranceHeroProps): 'centered' | 'split-image' | 'home' {
  if (props.variant === 'home') return 'home';
  if (props.variant === 'split-image' || props.image) return 'split-image';
  return 'centered'; // default — no image
}

// ── Shared: stat pill strip ──────────────────────────────────────
function StatPills({ stats, dark = true }: { stats: HeroStat[]; dark?: boolean }) {
  if (!stats || stats.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 16px',
          background: dark ? 'rgba(255,255,255,.08)' : 'var(--navy-50)',
          border: `1px solid ${dark ? 'rgba(255,255,255,.14)' : 'var(--navy-100)'}`,
          borderRadius: 100,
          fontSize: '.825rem', fontWeight: 600,
          color: dark ? 'rgba(255,255,255,.88)' : 'var(--navy-700)',
        }}>
          <span style={{ color: 'var(--gold-400)', fontSize: '.6rem' }}>✦</span>
          {s.value}{s.suffix} {s.label}
        </div>
      ))}
    </div>
  );
}

// ── Shared: CTA buttons ──────────────────────────────────────────
function CtaButtons({ primary, secondary, dark = true }: { primary?: HeroCta; secondary?: HeroCta; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {primary && (
        <Link href={primary.href}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 30px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
          {primary.label}
        </Link>
      )}
      {secondary && (
        secondary.href.startsWith('tel:') ? (
          <a href={secondary.href}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: dark ? '#fff' : 'var(--navy-800)', border: `2px solid ${dark ? 'rgba(255,255,255,.35)' : 'var(--navy-800)'}`, borderRadius: 10, padding: '14px 28px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
            <Phone className="w-4 h-4" />
            {secondary.label}
          </a>
        ) : (
          <Link href={secondary.href}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: dark ? '#fff' : 'var(--navy-800)', border: `2px solid ${dark ? 'rgba(255,255,255,.35)' : 'var(--navy-800)'}`, borderRadius: 10, padding: '14px 28px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
            {secondary.label}
          </Link>
        )
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// VARIANT: CENTERED (no image — all content centered on full navy bg)
// ────────────────────────────────────────────────────────────────
function CenteredHero(props: InsuranceHeroProps) {
  const { badge, icon, headline, subline, stats, ctaPrimary, ctaSecondary, trustBadge, urgencyNote, minHeight = 440 } = props;
  return (
    <section style={{
      position: 'relative',
      background: 'linear-gradient(160deg,rgba(6,15,29,.97) 0%,rgba(11,31,58,.95) 50%,rgba(17,42,77,.92) 100%)',
      padding: '72px 0 64px',
      minHeight,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      {/* Subtle grid + glow */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -80, right: '20%', width: 480, height: 480, background: 'radial-gradient(circle,rgba(201,147,58,.07) 0%,transparent 65%)', pointerEvents: 'none' }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 2, width: '100%', textAlign: 'center' }}>
        {/* Eyebrow */}
        {(badge || icon) && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,147,58,.15)', border: '1px solid rgba(201,147,58,.3)', color: 'var(--gold-300)', borderRadius: 100, padding: '5px 16px', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20 }}>
            {icon && <span>{icon}</span>}
            {badge}
          </div>
        )}

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4.5vw,3.25rem)', marginBottom: 18, lineHeight: 1.1, letterSpacing: '-.01em', maxWidth: 720, margin: '0 auto 18px' }}>
          {headline}
        </h1>

        {/* Subline */}
        {subline && (
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 'clamp(1rem,2vw,1.15rem)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 24px' }}>
            {subline}
          </p>
        )}

        {/* Urgency callout (TLC etc) */}
        {urgencyNote && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,147,58,.15)', border: '1px solid rgba(201,147,58,.35)', borderRadius: 10, padding: '12px 20px', marginBottom: 24, fontSize: '.9rem', color: 'var(--gold-300)', fontWeight: 600, maxWidth: 560, textAlign: 'left' }}>
            <span style={{ flexShrink: 0 }}>⚡</span>
            <span dangerouslySetInnerHTML={{ __html: urgencyNote }} />
          </div>
        )}

        {/* Stat pills — centered */}
        {stats && stats.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', margin: '0 auto 28px' }}>
            <StatPills stats={stats} dark={true} />
          </div>
        )}

        {/* CTAs — centered */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
          <CtaButtons primary={ctaPrimary} secondary={ctaSecondary} dark={true} />
        </div>

        {/* Trust badge */}
        {trustBadge && (
          <p style={{ color: 'rgba(255,255,255,.38)', fontSize: '.8rem', letterSpacing: '.05em', marginTop: 4 }}>
            🔒 {trustBadge}
          </p>
        )}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// VARIANT: SPLIT-IMAGE (text left, image right — inside container)
// ────────────────────────────────────────────────────────────────
function SplitImageHero(props: InsuranceHeroProps) {
  const { badge, icon, headline, subline, image, imageAlt, stats, ctaPrimary, ctaSecondary, trustBadge, urgencyNote } = props;
  return (
    <section style={{
      position: 'relative',
      background: 'linear-gradient(160deg,rgba(6,15,29,.97) 0%,rgba(11,31,58,.95) 50%,rgba(17,42,77,.92) 100%)',
      padding: '64px 0',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}
             className="split-hero-grid">

          {/* Left: text */}
          <div>
            {(badge || icon) && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,147,58,.15)', border: '1px solid rgba(201,147,58,.3)', color: 'var(--gold-300)', borderRadius: 100, padding: '5px 16px', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20 }}>
                {icon && <span>{icon}</span>}
                {badge}
              </div>
            )}
            <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-.01em' }}>
              {headline}
            </h1>
            {subline && (
              <p style={{ color: 'rgba(255,255,255,.72)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: 24, maxWidth: 480 }}>
                {subline}
              </p>
            )}
            {urgencyNote && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(201,147,58,.15)', border: '1px solid rgba(201,147,58,.35)', borderRadius: 10, padding: '12px 18px', marginBottom: 24, fontSize: '.9rem', color: 'var(--gold-300)', fontWeight: 600 }}>
                <span style={{ flexShrink: 0 }}>⚡</span>
                <span dangerouslySetInnerHTML={{ __html: urgencyNote }} />
              </div>
            )}
            {stats && stats.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <StatPills stats={stats} dark={true} />
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <CtaButtons primary={ctaPrimary} secondary={ctaSecondary} dark={true} />
            </div>
            {trustBadge && (
              <p style={{ color: 'rgba(255,255,255,.38)', fontSize: '.8rem' }}>🔒 {trustBadge}</p>
            )}
          </div>

          {/* Right: image */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
            {image ? (
              <Image src={image} alt={imageAlt || headline} fill style={{ objectFit: 'cover' }} priority />
            ) : (
              /* Placeholder gradient when image URL is set but file not uploaded yet */
              <div style={{ width: '100%', height: '100%', minHeight: 300, background: 'linear-gradient(135deg,rgba(201,147,58,.12) 0%,rgba(255,255,255,.04) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: '4rem', opacity: .4 }}>{icon || '🏢'}</span>
                <p style={{ color: 'rgba(255,255,255,.25)', fontSize: '.82rem' }}>Hero image coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) { .split-hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// VARIANT: HOME (centered, with stat counter animation)
// ────────────────────────────────────────────────────────────────
function HomeHero(props: InsuranceHeroProps) {
  // Same as centered but slightly taller, with bigger font
  return <CenteredHero {...props} minHeight={520} />;
}

// ────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ────────────────────────────────────────────────────────────────
export default function InsuranceHero(props: InsuranceHeroProps) {
  const variant = resolveVariant(props);
  if (variant === 'split-image') return <SplitImageHero {...props} />;
  if (variant === 'home')        return <HomeHero {...props} />;
  return <CenteredHero {...props} />;
}
