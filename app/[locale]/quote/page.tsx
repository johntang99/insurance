import { Suspense } from 'react';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import QuoteForm from '@/components/quote/QuoteForm';
import QuoteTrustPanel from '@/components/quote/QuoteTrustPanel';

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const city = (siteInfo as any)?.city || 'Flushing';
  return buildPageMetadata({
    siteId, locale, slug: 'quote',
    title: `Get a Free Insurance Quote | ${siteName}`,
    description: `Get a free insurance quote in minutes. We compare 30+ carriers to find your best rate. ${siteName} — serving ${city}, NY.`,
  });
}

export default async function QuotePage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('quote', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');

  const supabase = getSupabaseServerClient();
  const linesRes = await supabase?.from('insurance_lines').select('*').eq('site_id', siteId).eq('is_enabled', true).order('sort_order');
  const lines = linesRes?.data || [];

  const trustPanel = content?.trustPanel || {};

  return (
    <main style={{ background: 'var(--bg-subtle)', minHeight: '100vh', paddingTop: 40, paddingBottom: 80 }}>
      {/* Page title band */}
      <div style={{ background: 'var(--navy-800)', padding: '28px 0 26px', marginBottom: 40 }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(1.3rem,2.5vw,1.75rem)', margin: 0 }}>
            Get a Free Insurance Quote
          </h1>
          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              '✦ No obligation',
              '✦ 30+ carriers compared',
              `✦ Response within 2 hours`,
            ].map(b => (
              <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 100, fontSize: '.78rem', fontWeight: 500, color: 'rgba(255,255,255,.88)', whiteSpace: 'nowrap' }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }} className="quote-layout">
          {/* Main form */}
          <div>
            <Suspense fallback={<div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-xl)', padding: 48, textAlign: 'center' }}>Loading form...</div>}>
              <QuoteForm
                insuranceLines={lines}
                phone={phone}
                phoneHref={phoneHref}
                locale={locale}
              />
            </Suspense>
          </div>

          {/* Trust panel sidebar */}
          <div className="hide-mobile">
            <QuoteTrustPanel
              headline={trustPanel.headline}
              points={trustPanel.points}
              phone={phone}
              phoneHref={phoneHref}
              phoneLabel={trustPanel.phoneLabel}
              responsePromise={trustPanel.responsePromise}
              googleRating={si?.googleReviewsRating}
              googleReviewCount={si?.googleReviewsCount}
              licenseText={si?.licenseNumber ? `Licensed in ${si?.licensedStates?.join(', ') || 'NY, NJ, CT, PA'}` : undefined}
            />
          </div>
        </div>

        {/* Mobile trust strip */}
        <div className="hide-desktop" style={{ marginTop: 24, background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 12, textAlign: 'center' }}>
            {[
              { emoji: '🏆', text: '25+ Years' },
              { emoji: '🔍', text: '30+ Carriers' },
              { emoji: '⭐', text: '4.9 Stars' },
              { emoji: '⚡', text: '2-Hr Response' },
            ].map(({ emoji, text }) => (
              <div key={text}>
                <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{emoji}</div>
                <div style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive layout fix */}
      <style>{`
        @media (max-width: 900px) {
          .quote-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
