import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import TestimonialsFilter from '@/components/testimonials/TestimonialsFilter';

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'testimonials',
    title: `Client Reviews | ${siteName}`,
    description: `Read reviews from 5,000+ satisfied clients of ${siteName}. Filter by coverage type.`,
  });
}

export default async function TestimonialsPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('testimonials', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || '+1 (718) 555-0100';
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17185550100';

  const supabase = getSupabaseServerClient();
  const testimonialsRes = await supabase?.from('testimonials').select('*').eq('site_id', siteId).order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  const testimonials = testimonialsRes?.data || [];
  const count = testimonials.length;

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 12 }}>Client Reviews</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 12 }}>
            {content?.hero?.headline || 'What Our Clients Say'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', marginBottom: 8 }}>
            {count > 0 ? `${count}+ reviews — real clients, real results` : content?.hero?.subline || '5,000+ clients served'}
          </p>
          {si?.googleReviewsRating && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', padding: '8px 18px', borderRadius: 100, marginTop: 8 }}>
              <span style={{ color: 'var(--gold-400)', fontSize: '1rem', letterSpacing: 2 }}>★★★★★</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>{si.googleReviewsRating}</span>
              {si.googleReviewsCount && <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem' }}>({si.googleReviewsCount} Google reviews)</span>}
            </div>
          )}
        </div>
      </section>

      {/* Filter + grid (client component) */}
      <TestimonialsFilter testimonials={testimonials} />

      {/* Google review CTA */}
      {si?.googleReviewUrl && (
        <section style={{ padding: '40px 0', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
          <div className="container-custom" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 16 }}>
              Satisfied with our service? Leave us a review — it takes 30 seconds.
            </p>
            <a href={si.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="btn-gold">
              Leave a Google Review →
            </a>
          </div>
        </section>
      )}

      <QuoteCTASection
        variant="cta-only"
        headline="Ready to Join Our Satisfied Clients?"
        subline="Get a free quote and see why 5,000+ clients choose Peerless."
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
