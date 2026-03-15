import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import AgentsGrid from '@/components/agents/AgentsGrid';

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'agents',
    title: `Our Licensed Agents | ${siteName}`,
    description: `Meet the licensed insurance agents at ${siteName}. Filter by specialty and language. Direct quote links for each agent.`,
  });
}

export default async function AgentsPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('agents', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || '+1 (718) 555-0100';
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17185550100';

  const supabase = getSupabaseServerClient();
  const agentsRes = await supabase?.from('agents').select('*').eq('site_id', siteId).eq('is_active', true).order('sort_order');
  const agents = agentsRes?.data || [];

  const hero = content?.hero || {};

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 12 }}>Meet the Team</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 16 }}>
            {hero.headline || 'Our Licensed Agents'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto 28px', lineHeight: 1.65 }}>
            {hero.subline || 'Licensed professionals with deep expertise in every coverage type.'}
          </p>
          <a href={`/${locale}/quote`} className="btn-gold">Get a Free Quote</a>
        </div>
      </section>

      {/* Agents grid with filter (client component) */}
      <AgentsGrid agents={agents} locale={locale} />

      {/* CTA */}
      <QuoteCTASection
        variant="cta-only"
        headline="Not sure which agent to work with?"
        subline="Call our main line and we'll match you with the right specialist."
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
