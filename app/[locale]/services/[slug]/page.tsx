import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import QuoteCTASection from '@/components/sections/QuoteCTASection';

interface PageProps { params: { locale: Locale; slug: string } }

const SERVICE_META: Record<string, { name: string; icon: string; description: string; nameZh: string; descriptionZh: string }> = {
  dmv:    { name: 'DMV Services',    icon: '📄', description: 'Vehicle registration, title transfers, and more.', nameZh: 'DMV 服务', descriptionZh: '车辆注册、过户及相关办理服务。' },
  notary: { name: 'Notary Services', icon: '✒️', description: 'Licensed notary public on-site. Walk-ins welcome.', nameZh: '公证服务', descriptionZh: '现场持牌公证服务，支持到访办理。' },
};

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const meta = SERVICE_META[slug];
  if (!meta) return {};
  return buildPageMetadata({
    siteId, locale, slug: `services/${slug}`,
    title: isZh ? `${meta.nameZh} | ${siteName}` : `${meta.name} | ${siteName}`,
    description: isZh
      ? `${meta.descriptionZh} 由 ${siteName} 提供。`
      : `${meta.description} Available at ${siteName}, Flushing, NY.`,
  });
}

export default async function ServiceSlugPage({ params }: PageProps) {
  const { locale, slug } = params;
  const isZh = locale === 'zh';
  if (!SERVICE_META[slug]) notFound();

  const siteId = await getRequestSiteId();
  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>(`services/${slug}`, locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';
  const meta = SERVICE_META[slug];

  const hero = content?.hero || {};
  const detail = content?.serviceDetail || {};
  const extra = slug === 'dmv' ? content?.requirements : content?.pricing;
  const ui = {
    fallbackName: isZh ? meta.nameZh : meta.name,
    fallbackDesc: isZh ? meta.descriptionZh : meta.description,
    whatWeHandle: isZh ? '服务内容' : 'What We Handle',
    detailsSoon: isZh ? '服务详情即将更新。' : 'Service details coming soon.',
    whatToBring: isZh ? '所需资料' : 'What to Bring',
    pricing: isZh ? '价格说明' : 'Pricing',
    contactHours: isZh ? '营业时间欢迎来电或到店咨询' : 'Call or visit us during business hours',
    directions: isZh ? '查看路线 →' : 'Get Directions →',
    ctaHeadline: isZh ? '也需要保险服务？' : 'Need Insurance Too?',
    ctaSubline: isZh ? '我们同时提供 15+ 类保险产品与配套服务。' : 'We offer 15+ insurance lines alongside our support services.',
  };

  return (
    <main>
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>{meta.icon}</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 12 }}>
            {hero.headline || ui.fallbackName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            {hero.subline || ui.fallbackDesc}
          </p>
        </div>
      </section>

      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            {/* Services list */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 20 }}>
                {detail.headline || ui.whatWeHandle}
              </h2>
              {(detail.services || []).length > 0 ? (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {detail.services.map((s: string, i: number) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border)', fontSize: '.9375rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--green-500)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>{ui.detailsSoon}</p>
              )}
            </div>

            {/* Extra info (requirements/pricing) + contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {extra && (
                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 16, fontSize: '1.05rem' }}>
                    {slug === 'dmv' ? ui.whatToBring : ui.pricing}
                  </h3>
                  {slug === 'dmv' ? (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(extra.items || []).map((item: string, i: number) => (
                        <li key={i} style={{ fontSize: '.875rem', color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                          <span style={{ color: 'var(--navy-500)', flexShrink: 0 }}>→</span> {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(extra.items || []).map((item: { service: string; price: string }, i: number) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '.875rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.service}</span>
                          <span style={{ fontWeight: 700, color: 'var(--navy-800)' }}>{item.price}</span>
                        </div>
                      ))}
                      {extra.note && <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 8 }}>{extra.note}</p>}
                    </div>
                  )}
                </div>
              )}

              <div style={{ background: 'var(--navy-800)', borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,.75)', marginBottom: 16, fontSize: '.9rem' }}>
                  {content?.cta?.ctaSecondary?.label || ui.contactHours}
                </p>
                <a href={phoneHref} className="btn-gold" style={{ display: 'block', textAlign: 'center', marginBottom: 10 }}>
                  {phone}
                </a>
                <Link href={`/${locale}/contact`} style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)' }}>
                  {ui.directions}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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
