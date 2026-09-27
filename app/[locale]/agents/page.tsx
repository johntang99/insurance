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
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'agents',
    title: isZh ? `顾问团队 | ${siteName}` : `Our Licensed Agents | ${siteName}`,
    description: isZh
      ? `认识 ${siteName} 的持牌保险顾问团队，按险种与语言快速匹配合适顾问。`
      : `Meet the licensed insurance agents at ${siteName}. Filter by specialty and language. Direct quote links for each agent.`,
  });
}

export default async function AgentsPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('agents', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';

  const supabase = getSupabaseServerClient();
  const agentsRes = await supabase?.from('agents').select('*').eq('site_id', siteId).eq('is_active', true).order('sort_order');
  const agents = agentsRes?.data || [];

  const hero = content?.hero || {};
  const ui = {
    heroTag: isZh ? '顾问团队' : 'Meet the Team',
    heroHeadline: isZh ? '持牌保险顾问团队' : 'Our Licensed Agents',
    heroSubline: isZh ? '覆盖多类险种的持牌顾问，为您提供专业建议。' : 'Licensed professionals with deep expertise in every coverage type.',
    quote: isZh ? '免费获取报价' : 'Get a Free Quote',
    ctaHeadline: isZh ? '不确定该联系哪位顾问？' : 'Not sure which agent to work with?',
    ctaSubline: isZh ? '致电总机，我们将为您匹配合适顾问。' : 'Call our main line and we\'ll match you with the right specialist.',
  };

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 12 }}>{ui.heroTag}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 16 }}>
            {hero.headline || ui.heroHeadline}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto 28px', lineHeight: 1.65 }}>
            {hero.subline || ui.heroSubline}
          </p>
          <a href={`/${locale}/quote`} className="btn-gold">{ui.quote}</a>
        </div>
      </section>

      {/* Agents grid with filter (client component) */}
      <AgentsGrid agents={agents} locale={locale} />

      {/* CTA */}
      <QuoteCTASection
        variant="cta-only"
        headline={ui.ctaHeadline}
        subline={ui.ctaSubline}
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
