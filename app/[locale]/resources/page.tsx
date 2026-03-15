import Link from 'next/link';
import Image from 'next/image';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo, loadAllItems } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import QuoteCTASection from '@/components/sections/QuoteCTASection';

interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  category?: string;
  coverImage?: string;
  tags?: string[];
  author?: string;
  body?: string;
}

interface PageProps { params: { locale: Locale } }

// Category gradient fallbacks (used when no coverImage)
const CATEGORY_COLORS: Record<string, string> = {
  auto: 'linear-gradient(135deg,#0b1f3a 0%,#173560 100%)',
  tlc: 'linear-gradient(135deg,#1a2535 0%,#2a3d58 100%)',
  business: 'linear-gradient(135deg,#155f3a 0%,#1a7a4a 100%)',
  homeowner: 'linear-gradient(135deg,#2d1b00 0%,#7c4a00 100%)',
  general: 'linear-gradient(135deg,#0b1f3a 0%,#c9933a 100%)',
  'workers-comp': 'linear-gradient(135deg,#3b0f0f 0%,#8b1d1d 100%)',
  'commercial-auto': 'linear-gradient(135deg,#0c2340 0%,#1e4275 100%)',
};

const CATEGORY_ICONS: Record<string, string> = {
  auto: '🚗', tlc: '🚕', business: '💼', homeowner: '🏠',
  general: '📋', 'workers-comp': '🦺', 'commercial-auto': '🚛',
};

// Reusable 16:9 image block — shows real photo or gradient fallback
function CardImage({ post, minHeight, large = false }: { post: BlogPost; minHeight?: number; large?: boolean }) {
  const cat = post.category || 'general';
  const bg = CATEGORY_COLORS[cat] || CATEGORY_COLORS.general;
  const icon = CATEGORY_ICONS[cat] || '📄';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '16/9',          // ← proper 16:9 ratio
      minHeight: minHeight,
      overflow: 'hidden',
      background: bg,               // gradient fallback (always visible under image)
      flexShrink: 0,
    }}>
      {/* Real cover image — rendered on top of gradient */}
      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority={large}
        />
      )}

      {/* Fallback icon (only when no real image) */}
      {!post.coverImage && (
        <span style={{ fontSize: large ? '5rem' : '3rem', opacity: .2, position: 'absolute', right: large ? 24 : 16, top: '50%', transform: 'translateY(-60%)', userSelect: 'none' }}>
          {icon}
        </span>
      )}

      {/* Category badge */}
      {cat && (
        <span style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100, letterSpacing: '.04em', textTransform: 'uppercase', zIndex: 1 }}>
          {cat}
        </span>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'resources',
    title: `Insurance Resource Center | ${siteName}`,
    description: `Insurance guides, cost breakdowns, and expert tips from ${siteName}. Learn about auto, home, business, TLC, and more.`,
  });
}

export default async function ResourcesPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo, posts] = await Promise.all([
    loadPageContent<any>('resources', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
    loadAllItems<BlogPost>(siteId, locale, 'blog'),
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || '(718) 799-0472';
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';

  const published = posts.filter(p => p.title);
  const featured = published[0];
  const rest = published.slice(1);

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg,var(--navy-50) 0%,var(--bg-white) 60%,var(--gold-100) 100%)', padding: '64px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -120, width: 500, height: 500, background: 'radial-gradient(circle,rgba(201,147,58,.07) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div className="container-custom" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Resource Center</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 16 }}>
            {content?.hero?.headline || 'Insurance Resource Center'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.65 }}>
            {content?.hero?.subline || 'Guides, tips, and explainers to help you make the best coverage decisions.'}
          </p>
          <Link href={`/${locale}/quote`} className="btn-gold">Get a Free Quote</Link>
        </div>
      </section>

      {/* Featured article — 16:9 image left, text right */}
      {featured && (
        <section style={{ padding: '56px 0 40px', background: 'var(--bg-white)' }}>
          <div className="container-custom">
            <p style={{ fontSize: '.78rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 16 }}>Featured Article</p>
            <Link href={`/${locale}/resources/${featured.slug}`}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textDecoration: 'none', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}
              className="hover-lift featured-grid">

              {/* Left: 16:9 image */}
              <CardImage post={featured} large={true} />

              {/* Right: text */}
              <div style={{ padding: '36px 36px 36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {featured.publishedAt && <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>{new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1.6rem', lineHeight: 1.25, marginBottom: 14 }}>{featured.title}</h2>
                {featured.excerpt && <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20, fontSize: '.9375rem' }}>{featured.excerpt}</p>}
                <span style={{ color: 'var(--gold-600)', fontWeight: 700, fontSize: '.9rem' }}>Read Article →</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Article grid — 16:9 cards */}
      {rest.length > 0 && (
        <section style={{ padding: '40px 0 var(--section-y)', background: 'var(--bg-subtle)' }}>
          <div className="container-custom">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="grid-1col-mobile">
              {rest.map(post => (
                <Link key={post.slug} href={`/${locale}/resources/${post.slug}`}
                  style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}
                  className="hover-lift">
                  {/* 16:9 image or gradient */}
                  <CardImage post={post} />

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {post.publishedAt && <p style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1rem', lineHeight: 1.35, marginBottom: 10, fontWeight: 600 }}>{post.title}</h3>
                    {post.excerpt && <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>{post.excerpt}</p>}
                    <span style={{ color: 'var(--gold-600)', fontWeight: 600, fontSize: '.8rem', marginTop: 14 }}>Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuoteCTASection
        variant="cta-only"
        headline="Have Coverage Questions?"
        subline="Our licensed agents are happy to help — call or get a free quote."
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />

      {/* Responsive: featured article stacks on tablet */}
      <style suppressHydrationWarning>{`
        @media (max-width: 768px) { .featured-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
