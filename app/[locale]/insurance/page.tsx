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
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'insurance',
    title: isZh ? `全部保险产品 | ${siteName}` : `All Insurance Services | ${siteName}`,
    description: isZh
      ? `浏览 ${siteName} 提供的个人险、商业险与专项险种，免费获取报价。`
      : `Browse all insurance lines we offer — auto, home, business, TLC, commercial & more. Get a free quote from ${siteName} today.`,
  });
}

export default async function InsurancePage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('insurance', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';

  const supabase = getSupabaseServerClient();
  const linesRes = await supabase?.from('insurance_lines').select('*').eq('site_id', siteId).eq('is_enabled', true).order('sort_order');
  const lines = linesRes?.data || [];

  const hero = content?.hero || {};
  const ui = {
    badge: isZh ? '15+ 险种覆盖' : '15 Coverage Lines',
    headline: isZh ? '全部保险产品' : 'All Insurance Services',
    subline: isZh ? '个人险 · 商业险 · 专项险，一站式独立经纪服务。' : 'Personal · Commercial · Specialty — One independent broker for everything',
    quote: isZh ? '免费获取报价' : 'Get a Free Quote',
    whyPoints: isZh
      ? [
          { icon: '🔍', title: '30+ 公司比价', desc: '我们帮您比价，节省逐家询价时间。' },
          { icon: '🛡️', title: '独立顾问建议', desc: '以客户需求为先，不偏向单一承保方。' },
          { icon: '⚡', title: '快速反馈', desc: '营业时间内多数需求可在 2 小时内回复。' },
          { icon: '📍', title: '本地经验', desc: '多年服务纽约都会区，熟悉本地保障需求。' },
        ]
      : [
          { icon: '🔍', title: '30+ Carriers', desc: 'We shop the market so you don\'t have to.' },
          { icon: '🛡️', title: 'Independent Advice', desc: 'We work for you — no bias toward any one carrier.' },
          { icon: '⚡', title: 'Fast Quotes', desc: 'Quote within 2 hours during business hours.' },
          { icon: '📍', title: 'Local Expertise', desc: '25+ years serving Flushing, Queens, and NYC.' },
        ],
    ctaHeadline: isZh ? '准备开始了吗？' : 'Ready to Get Started?',
    ctaSubline: isZh ? '告诉我们需求，我们将帮您匹配更合适费率。' : 'Tell us what you need and we\'ll find your best rate.',
  };

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy-800)', padding: '72px 0 56px' }}>
        <div className="container-custom" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,147,58,.15)', border: '1px solid rgba(201,147,58,.3)', color: 'var(--gold-300)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100, marginBottom: 20 }}>
            🛡️ {hero.badge || ui.badge}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: 16 }}>
            {hero.headline || ui.headline}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.65 }}>
            {hero.subline || ui.subline}
          </p>
          <Link href={`/${locale}/quote`} className="btn-gold">
            {ui.quote}
          </Link>
        </div>
      </section>

      {/* Category tabs + grid — client component */}
      <InsuranceCategoryTabs lines={lines} locale={locale} />

      {/* Why Us strip */}
      <section style={{ padding: '64px 0', background: 'var(--bg-subtle)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
            {ui.whyPoints.map((item, i) => (
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
        headline={ui.ctaHeadline}
        subline={ui.ctaSubline}
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
