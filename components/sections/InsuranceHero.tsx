/**
 * InsuranceHero — Reusable hero for all insurance service pages + home page.
 *
 * VARIANTS:
 *  'home'               — Centered, navy gradient bg, tall (default for home page with no image)
 *  'centered'           — Centered, navy gradient bg (service pages with no image)
 *  'split-image'        — Text left, single image right (set hero.image)
 *  'gallery-background' — Full-bleed photo background with navy overlay (set hero.backgroundImage)
 *  'split-gallery-right'— Text left, photo mosaic grid right (set hero.galleryImages[])
 *
 * AUTO-DETECTION ORDER:
 *  1. hero.variant field takes explicit control
 *  2. If hero.galleryImages set → split-gallery-right
 *  3. If hero.backgroundImage set → gallery-background
 *  4. If hero.image set → split-image
 *  5. Default → 'home' (home page) or 'centered' (service pages)
 *
 * ADMIN FIELDS (home.json → hero):
 *  variant          : 'home' | 'centered' | 'split-image' | 'gallery-background' | 'split-gallery-right'
 *  badge            : string
 *  headline         : string
 *  subline          : string
 *  backgroundImage  : string URL  → used by gallery-background
 *  image            : string URL  → used by split-image
 *  imageAlt         : string
 *  galleryImages    : string[]    → used by split-gallery-right (3–4 URLs)
 *  stats            : { value, label, suffix }[]
 *  ctaPrimary       : { label, href }
 *  ctaSecondary     : { label, href }
 *  trustBadge       : string
 */

import Link from 'next/link';
import Image from 'next/image';
import { Phone } from 'lucide-react';

interface HeroStat   { value: string; label: string; suffix?: string; }
interface HeroCta    { label: string; href: string; }

type HeroVariant = 'home' | 'centered' | 'split-image' | 'gallery-background' | 'split-gallery-right';

interface InsuranceHeroProps {
  variant?: HeroVariant;
  badge?: string;
  icon?: string;
  headline: string;
  subline?: string;
  // Images
  image?: string;             // split-image
  imageAlt?: string;
  backgroundImage?: string;   // gallery-background
  galleryImages?: string[];   // split-gallery-right (3–4 photos)
  // Content
  stats?: HeroStat[];
  ctaPrimary?: HeroCta;
  ctaSecondary?: HeroCta;
  trustBadge?: string;
  urgencyNote?: string;
  minHeight?: number;
}

// ── Resolve which variant to actually render ────────────────────
function resolveVariant(p: InsuranceHeroProps): HeroVariant {
  if (p.variant && p.variant !== 'home' && p.variant !== 'centered') return p.variant;
  if (p.galleryImages && p.galleryImages.filter(Boolean).length >= 2) return 'split-gallery-right';
  if (p.backgroundImage) return 'gallery-background';
  if (p.image) return 'split-image';
  return p.variant || 'home';
}

// ── Shared nav background ────────────────────────────────────────
const NAVY_BG = 'linear-gradient(160deg,rgba(6,15,29,.97) 0%,rgba(11,31,58,.95) 50%,rgba(17,42,77,.92) 100%)';
const GRID_OVERLAY = {
  position: 'absolute' as const, inset: 0,
  backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',
  backgroundSize: '48px 48px', pointerEvents: 'none' as const,
};

// ── Eyebrow badge ────────────────────────────────────────────────
function Eyebrow({ badge, icon }: { badge?: string; icon?: string }) {
  if (!badge && !icon) return null;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,147,58,.15)', border: '1px solid rgba(201,147,58,.3)', color: 'var(--gold-300)', borderRadius: 100, padding: '5px 16px', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20 }}>
      {icon && <span>{icon}</span>}
      {badge}
    </div>
  );
}

// ── Stat pills ───────────────────────────────────────────────────
function StatPills({ stats, center = false }: { stats?: HeroStat[]; center?: boolean }) {
  if (!stats?.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: center ? 'center' : 'flex-start', marginBottom: 28 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 100, fontSize: '.825rem', fontWeight: 600, color: 'rgba(255,255,255,.88)' }}>
          <span style={{ color: 'var(--gold-400)', fontSize: '.6rem' }}>✦</span>
          {s.value}{s.suffix} {s.label}
        </div>
      ))}
    </div>
  );
}

// ── CTA buttons ──────────────────────────────────────────────────
function CtaButtons({ primary, secondary, center = false }: { primary?: HeroCta; secondary?: HeroCta; center?: boolean }) {
  if (!primary && !secondary) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: center ? 'center' : 'flex-start', marginBottom: 20 }}>
      {primary && (
        <Link href={primary.href}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 30px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
          {primary.label}
        </Link>
      )}
      {secondary && (
        <a href={secondary.href}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.35)', borderRadius: 10, padding: '14px 28px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
          {secondary.href.startsWith('tel:') && <Phone className="w-4 h-4" />}
          {secondary.label}
        </a>
      )}
    </div>
  );
}

// ── Shared text block (left-aligned for split variants) ──────────
function TextBlock({ badge, icon, headline, subline, urgencyNote, stats, ctaPrimary, ctaSecondary, trustBadge, center = false }: InsuranceHeroProps & { center?: boolean }) {
  return (
    <>
      <Eyebrow badge={badge} icon={icon} />
      <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: center ? 'clamp(2rem,4.5vw,3.25rem)' : 'clamp(1.8rem,3.5vw,2.8rem)', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-.01em', ...(center ? { maxWidth: 720, margin: '0 auto 16px' } : {}) }}>
        {headline}
      </h1>
      {subline && (
        <p style={{ color: 'rgba(255,255,255,.72)', fontSize: center ? 'clamp(1rem,2vw,1.15rem)' : '1.05rem', lineHeight: 1.75, marginBottom: 24, ...(center ? { maxWidth: 600, margin: '0 auto 24px' } : { maxWidth: 480 }) }}>
          {subline}
        </p>
      )}
      {urgencyNote && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(201,147,58,.15)', border: '1px solid rgba(201,147,58,.35)', borderRadius: 10, padding: '12px 18px', marginBottom: 24, fontSize: '.9rem', color: 'var(--gold-300)', fontWeight: 600 }}>
          <span style={{ flexShrink: 0 }}>⚡</span>
          <span dangerouslySetInnerHTML={{ __html: urgencyNote }} />
        </div>
      )}
      <StatPills stats={stats} center={center} />
      <CtaButtons primary={ctaPrimary} secondary={ctaSecondary} center={center} />
      {trustBadge && (
        <p style={{ color: 'rgba(255,255,255,.38)', fontSize: '.8rem', letterSpacing: '.04em', ...(center ? { textAlign: 'center' } : {}) }}>
          🔒 {trustBadge}
        </p>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// VARIANT 1 & 2: CENTERED / HOME
// Full-width navy gradient, all content centered
// ════════════════════════════════════════════════════════════════
function CenteredHero(props: InsuranceHeroProps) {
  return (
    <section style={{ position: 'relative', background: NAVY_BG, padding: '72px 0 64px', minHeight: props.minHeight || 440, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={GRID_OVERLAY} />
      <div style={{ position: 'absolute', top: -80, right: '20%', width: 480, height: 480, background: 'radial-gradient(circle,rgba(201,147,58,.07) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div className="container-custom" style={{ position: 'relative', zIndex: 2, width: '100%', textAlign: 'center' }}>
        <TextBlock {...props} center={true} />
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// VARIANT 3: SPLIT-IMAGE
// Text left, single photo right, inside container
// ════════════════════════════════════════════════════════════════
function SplitImageHero(props: InsuranceHeroProps) {
  const { image, imageAlt, headline, icon } = props;
  return (
    <section style={{ position: 'relative', background: NAVY_BG, padding: '64px 0', overflow: 'hidden' }}>
      <div style={GRID_OVERLAY} />
      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }} className="hero-split-grid">
          <div><TextBlock {...props} center={false} /></div>
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
            {image ? (
              <Image src={image} alt={imageAlt || headline} fill style={{ objectFit: 'cover' }} priority />
            ) : (
              <div style={{ width: '100%', height: '100%', minHeight: 300, background: 'linear-gradient(135deg,rgba(201,147,58,.12) 0%,rgba(255,255,255,.04) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: '4rem', opacity: .4 }}>{icon || '🏢'}</span>
                <p style={{ color: 'rgba(255,255,255,.25)', fontSize: '.82rem' }}>Add hero image via admin → Hero Image</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// VARIANT 4: GALLERY-BACKGROUND
// Single photo as full-bleed background with navy overlay + centered content
// ════════════════════════════════════════════════════════════════
function GalleryBackgroundHero(props: InsuranceHeroProps) {
  const { backgroundImage, minHeight = 560 } = props;
  return (
    <section style={{ position: 'relative', minHeight, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Background photo */}
      {backgroundImage ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image src={backgroundImage} alt="Hero background" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: NAVY_BG }} />
      )}

      {/* Navy overlay (dark enough for text readability) */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(6,15,29,.82) 0%,rgba(11,31,58,.75) 50%,rgba(17,42,77,.70) 100%)' }} />
      {/* Bottom gradient for extra contrast */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,15,29,.6) 0%,transparent 60%)' }} />
      {/* Grid texture */}
      <div style={GRID_OVERLAY} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 2, width: '100%', textAlign: 'center' }}>
        <TextBlock {...props} center={true} />
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// VARIANT 5: SPLIT-GALLERY-RIGHT
// Text left, photo mosaic (3–4 images) on the right
// ════════════════════════════════════════════════════════════════
function SplitGalleryRightHero(props: InsuranceHeroProps) {
  const { galleryImages = [], icon } = props;
  const imgs = galleryImages.filter(Boolean);

  // Layout: top photo full-width, bottom 2 side-by-side
  const topImg   = imgs[0] || '';
  const midLeft  = imgs[1] || '';
  const midRight = imgs[2] || '';
  const hasTop   = Boolean(topImg);
  const hasMid   = Boolean(midLeft) || Boolean(midRight);

  const PlaceholderTile = ({ label }: { label: string }) => (
    <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }}>
      <span style={{ fontSize: '2rem', opacity: .35 }}>{icon || '🏢'}</span>
      <p style={{ color: 'rgba(255,255,255,.2)', fontSize: '.72rem', textAlign: 'center' }}>{label}</p>
    </div>
  );

  return (
    <section style={{ position: 'relative', background: NAVY_BG, padding: '64px 0 56px', overflow: 'hidden' }}>
      <div style={GRID_OVERLAY} />
      <div style={{ position: 'absolute', top: -60, right: '30%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(201,147,58,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, alignItems: 'center' }} className="hero-gallery-grid">

          {/* Left: Text */}
          <div>
            <TextBlock {...props} center={false} />
          </div>

          {/* Right: Photo gallery mosaic */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Top photo — full width */}
            <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', aspectRatio: '16/7' }}>
              {hasTop ? (
                <Image src={topImg} alt="Gallery photo 1" fill style={{ objectFit: 'cover' }} priority />
              ) : (
                <PlaceholderTile label="Add gallery image 1 via admin" />
              )}
              {/* Subtle navy tint */}
              {hasTop && <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,58,.12)' }} />}
            </div>

            {/* Bottom row: 2 photos side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
                {midLeft ? (
                  <Image src={midLeft} alt="Gallery photo 2" fill style={{ objectFit: 'cover' }} />
                ) : (
                  <PlaceholderTile label="Gallery image 2" />
                )}
                {midLeft && <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,58,.12)' }} />}
              </div>
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
                {midRight ? (
                  <Image src={midRight} alt="Gallery photo 3" fill style={{ objectFit: 'cover' }} />
                ) : (
                  <PlaceholderTile label="Gallery image 3" />
                )}
                {midRight && <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,58,.12)' }} />}
              </div>
            </div>

            {/* Optional 4th photo strip */}
            {imgs[3] && (
              <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '21/6' }}>
                <Image src={imgs[3]} alt="Gallery photo 4" fill style={{ objectFit: 'cover', objectPosition: 'center 40%' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,58,.12)' }} />
              </div>
            )}

            {/* Gallery label */}
            <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.72rem', textAlign: 'center', marginTop: 2 }}>
              📸 Flushing, Queens · Our Community
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN EXPORT — routes to correct variant
// ════════════════════════════════════════════════════════════════
export default function InsuranceHero(props: InsuranceHeroProps) {
  const variant = resolveVariant(props);

  switch (variant) {
    case 'split-gallery-right': return <SplitGalleryRightHero {...props} />;
    case 'gallery-background':  return <GalleryBackgroundHero {...props} minHeight={props.minHeight || 560} />;
    case 'split-image':         return <SplitImageHero {...props} />;
    case 'home':                return <CenteredHero {...props} minHeight={props.minHeight || 520} />;
    default:                    return <CenteredHero {...props} minHeight={props.minHeight || 440} />;
  }
}
