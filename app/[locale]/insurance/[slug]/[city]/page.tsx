import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadSiteInfo } from '@/lib/content';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { LOCATION_MAP, getLocationSEO, DEFAULT_ACTIVE_LOCATIONS } from '@/lib/insurance/locations';
import { INSURANCE_LINE_META, getLineName, getLineIcon } from '@/lib/insurance/theme';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import { MapPin, Phone, CheckCircle } from 'lucide-react';

interface PageProps { params: { locale: Locale; slug: string; city: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, city } = params;
  const loc = LOCATION_MAP[city];
  if (!loc) return {};

  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const si = siteInfo as any;
  const phone = si?.phone || '+1 (718) 555-0100';
  const lineName = getLineName(slug);
  const seo = getLocationSEO(loc, slug, lineName, siteName, phone);

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `https://pbiny.com/${locale}/insurance/${slug}/${city}` },
    openGraph: { title: seo.title, description: seo.description, type: 'website' },
  };
}

export default async function LocationServicePage({ params }: PageProps) {
  const { locale, slug, city } = params;
  const loc = LOCATION_MAP[city];
  if (!loc) notFound();

  const siteId = await getRequestSiteId();
  const supabase = getSupabaseServerClient();

  const [siteInfo, lineRes] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
    supabase?.from('insurance_lines').select('*').eq('site_id', siteId).eq('line_slug', slug).single(),
  ]);

  // 404 if this insurance line isn't enabled
  if (!lineRes?.data || lineRes.data.is_enabled === false) notFound();

  const si = siteInfo as any;
  const phone = si?.phone || '+1 (718) 555-0100';
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17185550100';
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const lineName = getLineName(slug);
  const icon = getLineIcon(slug);
  const seo = getLocationSEO(loc, slug, lineName, siteName, phone);

  // Related cities in same state
  const relatedCities = DEFAULT_ACTIVE_LOCATIONS
    .filter(s => s !== city && LOCATION_MAP[s]?.stateCode === loc.stateCode)
    .slice(0, 5);

  return (
    <>
      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `${lineName} Insurance`,
        serviceType: lineName,
        provider: { '@type': 'InsuranceAgency', name: siteName, telephone: phone },
        areaServed: { '@type': 'City', name: loc.name, containedInPlace: { '@type': 'State', name: loc.state } },
        description: seo.description,
      }) }} />

      {/* FAQPage */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: `How much does ${lineName.toLowerCase()} cost in ${loc.name}?`, acceptedAnswer: { '@type': 'Answer', text: `${lineName} rates in ${loc.name}, ${loc.stateCode} vary based on your specific situation. We compare 30+ carriers to find you the best rate. Get a free quote to see your options.` } },
          { '@type': 'Question', name: `Do you offer ${lineName.toLowerCase()} in ${loc.name}?`, acceptedAnswer: { '@type': 'Answer', text: `Yes, ${siteName} offers ${lineName.toLowerCase()} throughout ${loc.name} and all of ${loc.state}. Call ${phone} or submit a quote request for same-day service.` } },
        ],
      }) }} />

      <main>
        {/* Hero */}
        <section style={{ background: 'var(--bg-white)', padding: '56px 0 40px', borderBottom: '1px solid var(--border)' }}>
          <div className="container-custom">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: 20, flexWrap: 'wrap' }}>
              <Link href={`/${locale}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
              <span>→</span>
              <Link href={`/${locale}/insurance`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Insurance</Link>
              <span>→</span>
              <Link href={`/${locale}/insurance/${slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{lineName}</Link>
              <span>→</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{loc.name}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'center' }} className="grid-1col-mobile">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--gold-100)', color: 'var(--gold-600)', borderRadius: 100, padding: '4px 14px', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 16 }}>
                  <MapPin className="w-3.5 h-3.5" />
                  {loc.name}, {loc.stateCode}
                </div>
                <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: 16, lineHeight: 1.1 }}>
                  {icon} {seo.headline}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 24, maxWidth: 560 }}>
                  {seo.subline}
                </p>

                {/* Local note */}
                {seo.localNote && (
                  <div style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: '.9rem', color: 'var(--navy-700)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0 }}>📍</span>
                    {seo.localNote}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href={`/${locale}/quote?type=${slug}`} className="btn-gold">
                    Get a {loc.name} Quote
                  </Link>
                  <a href={phoneHref} className="btn-outline-navy">
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                </div>
              </div>

              {/* Quick facts */}
              <div style={{ background: 'var(--navy-800)', borderRadius: 'var(--radius-xl)', padding: '32px 28px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 20, fontSize: '1.1rem' }}>
                  {lineName} in {loc.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Service Area', value: `${loc.name}, ${loc.stateCode}` },
                    { label: 'Quote Speed', value: 'Same day' },
                    { label: 'Carriers Compared', value: '30+' },
                    { label: 'Licensed In', value: `${loc.stateCode}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                      <span style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.6)' }}>{label}</span>
                      <span style={{ fontWeight: 700, color: 'var(--gold-400)', fontSize: '.9rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/${locale}/quote?type=${slug}`}
                  style={{ display: 'block', textAlign: 'center', marginTop: 20, background: 'var(--gold-500)', color: '#fff', borderRadius: 8, padding: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '.9rem' }}>
                  Get My Free Quote →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why choose us locally */}
        <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
          <div className="container-custom">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 32, textAlign: 'center' }}>
              Why {loc.name} Residents Choose {siteName}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="grid-1col-mobile">
              {[
                { icon: '📍', title: `Local ${loc.name} Expertise`, body: `We\'ve been serving ${loc.name} clients for 25+ years. We know the local market, the best carriers for ${loc.stateCode}, and how to get you the best rate.` },
                { icon: '🔍', title: '30+ Carriers Compared', body: `We shop every major carrier available in ${loc.name} to guarantee you\'re not overpaying. One call, dozens of quotes.` },
                { icon: '⚡', title: 'Same-Day Response', body: `${loc.name} clients get same-day quote responses during business hours. Need it fast? Call us directly at ${phone}.` },
              ].map(({ icon, title, body }) => (
                <div key={title} style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: 14 }}>{icon}</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 10, fontSize: '1rem' }}>{title}</h3>
                  <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local FAQ */}
        <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
          <div className="container-custom" style={{ maxWidth: 720 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 28, textAlign: 'center' }}>
              {lineName} FAQs for {loc.name} Residents
            </h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {[
                { q: `How much does ${lineName.toLowerCase()} cost in ${loc.name}?`, a: `${lineName} rates in ${loc.name}, ${loc.stateCode} vary based on your situation. We compare 30+ carriers to find you the lowest rate. Submit a free quote request or call ${phone} — most quotes are ready same day.` },
                { q: `Do you serve clients in all parts of ${loc.name}?`, a: `Yes, we serve all neighborhoods in ${loc.name}, ${loc.stateCode}. We also serve surrounding areas and all of ${loc.state}.` },
                { q: `Can I get ${lineName.toLowerCase()} coverage quickly in ${loc.name}?`, a: `Absolutely. Most personal lines quotes for ${loc.name} clients are ready within 2 hours. For urgent situations like TLC renewals, we can often bind coverage the same day.` },
              ].map(({ q, a }, i, arr) => (
                <details key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <summary style={{ padding: '18px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)', fontSize: '.9375rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {q}
                    <span style={{ color: 'var(--gold-500)', fontSize: '1.2rem', flexShrink: 0, marginLeft: 12 }}>+</span>
                  </summary>
                  <div style={{ padding: '0 20px 18px', color: 'var(--text-secondary)', fontSize: '.9375rem', lineHeight: 1.7 }}>{a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related cities */}
        {relatedCities.length > 0 && (
          <section style={{ padding: '40px 0', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
            <div className="container-custom">
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                {lineName} insurance also available in:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {relatedCities.map(cs => {
                  const cl = LOCATION_MAP[cs];
                  return cl ? (
                    <Link key={cs} href={`/${locale}/insurance/${slug}/${cs}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.825rem', fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--bg-white)' }}>
                      <MapPin className="w-3 h-3" />{cl.name}, {cl.stateCode}
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          </section>
        )}

        <QuoteCTASection
          variant="form-inline"
          headline={`Ready to Get Your ${loc.name} ${lineName} Quote?`}
          subline={`Free, no obligation. We compare 30+ carriers for ${loc.name} residents.`}
          coverageType={slug}
          phone={phone}
          phoneHref={phoneHref}
          locale={locale}
        />
      </main>
    </>
  );
}
