import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import QuoteCTASection from '@/components/sections/QuoteCTASection';

interface PageProps { params: { locale: Locale; slug: string } }

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const [siteInfo, carrierRes] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
    getSupabaseServerClient()?.from('carriers').select('name,description').eq('slug', slug).single(),
  ]);
  const carrier = carrierRes?.data;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: `carriers/${slug}`,
    title: isZh ? `${carrier?.name || slug} 保险合作伙伴 | ${siteName}` : `${carrier?.name || slug} Insurance | ${siteName}`,
    description: carrier?.description || (isZh
      ? `${siteName} 与 ${carrier?.name || slug} 合作，为客户提供更多可选方案与费率比较。`
      : `${siteName} represents ${carrier?.name || slug} — one of our trusted carrier partners.`),
  });
}

export default async function CarrierPage({ params }: PageProps) {
  const { locale, slug } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const supabase = getSupabaseServerClient();

  const [siteInfo, carrierRes] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
    supabase?.from('carriers').select('*').eq('slug', slug).single(),
  ]);

  const carrier = carrierRes?.data;
  if (!carrier) notFound();

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const ui = {
    backToList: isZh ? '返回合作保险公司' : 'Carrier Partners',
    categoryFallback: isZh ? '保险公司' : 'Insurance Carrier',
    whyTitle: isZh ? `为什么我们与 ${carrier.name} 合作` : `Why We Partner with ${carrier.name}`,
    whyBody: isZh
      ? `${siteName} 作为独立保险经纪，会与 ${carrier.name} 等多家保险公司合作，综合比较保障范围、费率与理赔服务，帮助您选择更合适的方案。`
      : `As an independent broker, ${siteName} partners with ${carrier.name} because they offer competitive rates, strong financial stability, and reliable claims service. We compare their rates with all our other carriers to make sure you get the best deal available.`,
    website: isZh ? `访问 ${carrier.name} 官网` : `Visit ${carrier.name} website`,
    quoteTitle: isZh ? `获取包含 ${carrier.name} 的报价方案` : `Get a Quote Including ${carrier.name}`,
    quoteBody: isZh
      ? `我们会将 ${carrier.name} 与其他合作公司一起比价，帮您匹配更优费率。`
      : `We'll compare ${carrier.name} with all our other carriers to find your best rate.`,
    quoteButton: isZh ? '免费获取报价' : 'Get a Free Quote',
    viewAll: isZh ? '查看全部合作保险公司' : 'View All Carriers',
    ctaHeadline: isZh ? '我们比较 30+ 家保险公司，为您匹配更优费率' : 'We Compare 30+ Carriers for Your Best Rate',
    ctaSubline: isZh ? '免费、无强制。我们负责比价，您选择最适合的方案。' : 'Free, no obligation. We do the shopping — you pick the best option.',
  };

  return (
    <main>
      <section style={{ background: 'var(--navy-800)', padding: '56px 0 44px' }}>
        <div className="container-custom">
          <Link href={`/${locale}/carriers`} style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, textDecoration: 'none' }}>
            ← {ui.backToList}
          </Link>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🏢</div>
            <div>
              <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 6 }}>{carrier.category || ui.categoryFallback}</p>
              <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(1.6rem,3vw,2.4rem)', margin: 0 }}>{carrier.name}</h1>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }} className="grid-1col-mobile">
            <div>
              {carrier.description && (
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32 }}>{carrier.description}</p>
              )}
              <div style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 12 }}>{ui.whyTitle}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '.9375rem', lineHeight: 1.7, margin: 0 }}>
                  {ui.whyBody}
                </p>
              </div>
              {carrier.website && (
                <a href={carrier.website} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--text-muted)', fontSize: '.85rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {ui.website} →
                </a>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--navy-800)', borderRadius: 'var(--radius-lg)', padding: '28px', textAlign: 'center' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 8 }}>{ui.quoteTitle}</h4>
                <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.875rem', marginBottom: 20, lineHeight: 1.6 }}>
                  {ui.quoteBody}
                </p>
                <Link href={`/${locale}/quote`} className="btn-gold" style={{ display: 'block', textAlign: 'center' }}>
                  {ui.quoteButton}
                </Link>
                <a href={phoneHref} style={{ display: 'block', color: 'rgba(255,255,255,.6)', fontSize: '.82rem', marginTop: 10 }}>{phone}</a>
              </div>
              <Link href={`/${locale}/carriers`}
                style={{ display: 'block', textAlign: 'center', padding: '12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', fontSize: '.875rem', textDecoration: 'none' }}>
                ← {ui.viewAll}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTASection variant="cta-only" headline={ui.ctaHeadline} subline={ui.ctaSubline} phone={phone} phoneHref={phoneHref} locale={locale} />
    </main>
  );
}
