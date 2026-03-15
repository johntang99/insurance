import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import QuoteCTASection from '@/components/sections/QuoteCTASection';

interface PageProps { params: { locale: Locale; slug: string } }

const SERVICE_META: Record<string, { name: string; icon: string; description: string }> = {
  dmv:    { name: 'DMV Services',    icon: '📄', description: 'Vehicle registration, title transfers, and more.' },
  notary: { name: 'Notary Services', icon: '✒️', description: 'Licensed notary public on-site. Walk-ins welcome.' },
};

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const meta = SERVICE_META[slug];
  if (!meta) return {};
  return buildPageMetadata({
    siteId, locale, slug: `services/${slug}`,
    title: `${meta.name} | ${siteName}`,
    description: `${meta.description} Available at ${siteName}, Flushing, NY.`,
  });
}

export default async function ServiceSlugPage({ params }: PageProps) {
  const { locale, slug } = params;
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

  return (
    <main>
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>{meta.icon}</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 12 }}>
            {hero.headline || meta.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            {hero.subline || meta.description}
          </p>
        </div>
      </section>

      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            {/* Services list */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 20 }}>
                {detail.headline || `What We Handle`}
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
                <p style={{ color: 'var(--text-muted)' }}>Service details coming soon.</p>
              )}
            </div>

            {/* Extra info (requirements/pricing) + contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {extra && (
                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 16, fontSize: '1.05rem' }}>
                    {slug === 'dmv' ? 'What to Bring' : 'Pricing'}
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
                  {content?.cta?.ctaSecondary?.label || 'Call or visit us during business hours'}
                </p>
                <a href={phoneHref} className="btn-gold" style={{ display: 'block', textAlign: 'center', marginBottom: 10 }}>
                  {phone}
                </a>
                <Link href={`/${locale}/contact`} style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)' }}>
                  Get Directions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTASection
        variant="cta-only"
        headline="Need Insurance Too?"
        subline="We offer 15+ insurance lines alongside our support services."
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
