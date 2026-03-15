import { notFound } from 'next/navigation';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import InsuranceLineGrid from '@/components/sections/InsuranceLineGrid';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import InsuranceCategoryTabs from '@/components/sections/InsuranceCategoryTabs';

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'insurance',
    title: `All Insurance Services | ${siteName}`,
    description: `Browse all insurance lines we offer — auto, home, business, TLC, commercial & more. Get a free quote from ${siteName} today.`,
  });
}

export default async function InsurancePage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('insurance', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || '+1 (718) 555-0100';
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17185550100';

  const supabase = getSupabaseServerClient();
  const linesRes = await supabase?.from('insurance_lines').select('*').eq('site_id', siteId).eq('is_enabled', true).order('sort_order');
  const lines = linesRes?.data || [];

  const hero = content?.hero || {};

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy-800)', padding: '72px 0 56px' }}>
        <div className="container-custom" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,147,58,.15)', border: '1px solid rgba(201,147,58,.3)', color: 'var(--gold-300)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100, marginBottom: 20 }}>
            🛡️ {hero.badge || '15 Coverage Lines'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: 16 }}>
            {hero.headline || 'All Insurance Services'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.65 }}>
            {hero.subline || 'Personal · Commercial · Specialty — One independent broker for everything'}
          </p>
          <Link href={`/${locale}/quote`} className="btn-gold">
            Get a Free Quote
          </Link>
        </div>
      </section>

      {/* Category tabs + grid — client component */}
      <InsuranceCategoryTabs lines={lines} locale={locale} />

      {/* Why Us strip */}
      <section style={{ padding: '64px 0', background: 'var(--bg-subtle)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
            {[
              { icon: '🔍', title: '30+ Carriers', desc: 'We shop the market so you don\'t have to.' },
              { icon: '🛡️', title: 'Independent Advice', desc: 'We work for you — no bias toward any one carrier.' },
              { icon: '⚡', title: 'Fast Quotes', desc: 'Quote within 2 hours during business hours.' },
              { icon: '📍', title: 'Local Expertise', desc: '25+ years serving Brooklyn, Queens, and NYC.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 12 }}>{item.icon}</span>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 8, fontWeight: 700 }}>{item.title}</h4>
                <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <QuoteCTASection
        variant="cta-only"
        headline="Ready to Get Started?"
        subline="Tell us what you need and we'll find your best rate."
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
