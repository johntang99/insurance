import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import QuoteCTASection from '@/components/sections/QuoteCTASection';

interface Carrier {
  id: string; name: string; slug: string; logo_url?: string;
  website?: string; description?: string; category?: string;
}

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const si = siteInfo as any;
  return buildPageMetadata({
    siteId, locale, slug: 'carriers',
    title: isZh ? `合作保险公司 | ${siteName}` : `Carrier Partners | ${siteName}`,
    description: isZh
      ? `${siteName} 合作 ${si?.carriersCount || 30}+ 家保险公司，为您比价并匹配更合适费率。`
      : `${siteName} works with ${si?.carriersCount || 30}+ leading insurance carriers. See all the companies we shop to find your best rate.`,
  });
}

export default async function CarriersPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('carriers', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';
  const carriersCount = si?.carriersCount || 30;

  const supabase = getSupabaseServerClient();
  const carriersRes = await supabase
    ?.from('site_carriers')
    .select('sort_order, is_featured, carriers(id, name, slug, logo_url, website, description, category)')
    .eq('site_id', siteId)
    .order('sort_order');
  const carriers: Carrier[] = (carriersRes?.data || []).map((sc: any) => ({ ...sc.carriers, is_featured: sc.is_featured })).filter(Boolean);

  const categories = ['general', 'personal', 'commercial', 'specialty'];
  const categoryLabels: Record<string, string> = isZh
    ? { general: '综合', personal: '个人险', commercial: '商业险', specialty: '专项险' }
    : { general: 'General', personal: 'Personal Lines', commercial: 'Commercial Lines', specialty: 'Specialty' };
  const ui = {
    heroTag: isZh ? '合作伙伴' : 'Our Partners',
    heroTitle: isZh ? '合作保险公司' : 'Carrier Partners',
    heroSubline: isZh
      ? `我们合作 ${carriersCount}+ 家主流保险公司，帮助您拿到更有竞争力的费率，而不是单一公司的报价。`
      : `We represent ${carriersCount}+ leading insurance carriers — so you get the most competitive rates, not just one company's price.`,
    philosophy: isZh
      ? [
          { icon: '🔍', title: '多公司统一比价', body: '我们会横向比较所有可用方案，而不是只给您单一报价。' },
          { icon: '⚖️', title: '不偏向单一承保方', body: '我们的建议以客户需求与性价比为核心。' },
          { icon: '🎯', title: '您做最终决策', body: '我们负责筛选和解读，您按保障与预算做最终选择。' },
        ]
      : [
          { icon: '🔍', title: 'We Shop All of Them', body: 'We compare rates across every carrier we represent — not just the first one that qualifies.' },
          { icon: '⚖️', title: 'No Carrier Bias', body: 'Our commission structure doesn\'t incentivize one carrier over another. Your best rate wins, period.' },
          { icon: '🎯', title: 'You Stay in Control', body: 'You see the comparison. You choose. We just do the shopping so you don\'t have to.' },
        ],
    fallbackText: isZh ? '我们合作多家主流保险公司，为您提供更丰富的承保选择。' : 'Our carrier partners include leading national insurers.',
    quoteHeadline: isZh
      ? `我们比较 ${carriersCount}+ 家保险公司，为您匹配更优费率`
      : `We Shop ${carriersCount}+ Carriers — You Get the Best Rate`,
    quoteSubline: isZh ? '免费报价，无强制。我们负责比价，您负责选择。' : 'Free quotes, no obligation. We do the shopping so you don\'t have to.',
  };

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 12 }}>{ui.heroTag}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 16 }}>
            {content?.hero?.headline || ui.heroTitle}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 8px', lineHeight: 1.65 }}>
            {ui.heroSubline}
          </p>
        </div>
      </section>

      {/* Philosophy strip */}
      <section style={{ padding: '48px 0', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }} className="grid-1col-mobile">
            {ui.philosophy.map(({ icon, title, body }) => (
              <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 6, fontSize: '.95rem' }}>{title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', lineHeight: 1.65, margin: 0 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carrier grid by category */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          {carriers.length > 0 ? (
            categories.map(cat => {
              const catCarriers = carriers.filter(c => c.category === cat || (!c.category && cat === 'general'));
              if (catCarriers.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: 48 }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1.3rem', marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid var(--border)' }}>
                    {categoryLabels[cat] || cat}
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
                    {catCarriers.map(carrier => (
                      <Link key={carrier.id} href={`/${locale}/carriers/${carrier.slug}`}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: 'var(--bg-white)', border: `1.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', textDecoration: 'none', textAlign: 'center', minHeight: 100, transition: 'border-color .15s, box-shadow .15s' }}
                        className="hover-lift">
                        {carrier.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={carrier.logo_url} alt={carrier.name} style={{ maxHeight: 48, maxWidth: 140, objectFit: 'contain', marginBottom: 8, filter: 'grayscale(0.3)', opacity: .85 }} />
                        ) : (
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '.95rem', fontWeight: 700, color: 'var(--navy-800)', lineHeight: 1.2, marginBottom: 4 }}>{carrier.name}</span>
                        )}
                        {carrier.logo_url && <span style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>{carrier.name}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback: show placeholder carrier pills (DB not configured)
            <div>
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: 32 }}>{ui.fallbackText}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                {['Travelers', 'Progressive', 'Nationwide', 'Liberty Mutual', 'The Hartford', 'Chubb', 'Employers', 'AmTrust', 'Hiscox', 'GEICO', 'Mercury', 'Bristol West', 'Dairyland', 'National General', 'Foremost'].map(n => (
                  <div key={n} style={{ padding: '10px 20px', border: '1.5px solid var(--border)', borderRadius: 8, fontWeight: 600, fontSize: '.875rem', color: 'var(--text-secondary)', background: 'var(--bg-white)' }}>{n}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <QuoteCTASection
        variant="cta-only"
        headline={ui.quoteHeadline}
        subline={ui.quoteSubline}
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
