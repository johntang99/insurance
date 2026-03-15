import { notFound } from 'next/navigation';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import CarrierLogoCarousel from '@/components/sections/CarrierLogoCarousel';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import { ExternalLink, Shield } from 'lucide-react';

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('about', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const year = content?.story?.founded || '1999';
  return buildPageMetadata({
    siteId, locale, slug: 'about',
    title: `About ${siteName} | Licensed Insurance Broker Since ${year}`,
    description: `${siteName} is a licensed independent insurance broker serving Brooklyn since ${year}. 25+ years experience, 30+ carriers, 5,000+ clients.`,
  });
}

const STATE_DOI: Record<string, string> = {
  NY: 'https://myportal.dfs.ny.gov/web/guest-applications/lookup-agent-broker',
  NJ: 'https://sbs.nj.gov/sbs/public/login.jsf',
  CT: 'https://portal.ct.gov/CID',
  PA: 'https://www.insurance.pa.gov',
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('about', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  if (!content) notFound();

  const si = siteInfo as any;
  const phone = si?.phone || '+1 (718) 555-0100';
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17185550100';
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');

  const supabase = getSupabaseServerClient();
  const [agentsRes, carriersRes] = await Promise.all([
    supabase?.from('agents').select('*').eq('site_id', siteId).eq('is_active', true).order('sort_order'),
    supabase?.from('site_carriers').select('*, carriers(*)').eq('site_id', siteId).order('sort_order'),
  ]);

  const agents = agentsRes?.data || [];
  const carriers = (carriersRes?.data || []).map((sc: any) => sc.carriers).filter(Boolean);

  const story = content.story || {};
  const licenses = content.licenses || {};
  const community = content.community || {};

  return (
    <main>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--navy-800)', padding: '72px 0 56px', textAlign: 'center' }}>
        <div className="container-custom">
          <div style={{ display: 'inline-flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.8)', fontSize: '.8rem', fontWeight: 600, padding: '5px 14px', borderRadius: 100 }}>
              Est. {story.foundedYear || story.founded || '1999'}
            </span>
            <span style={{ background: 'rgba(201,147,58,.15)', border: '1px solid rgba(201,147,58,.3)', color: 'var(--gold-300)', fontSize: '.8rem', fontWeight: 600, padding: '5px 14px', borderRadius: 100 }}>
              Licensed in {si?.licensedStates?.join(' · ') || 'NY · NJ · CT · PA'}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: 16 }}>
            {content.hero?.headline || `About ${siteName}`}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.65 }}>
            {content.hero?.subline || '25 years of independent insurance expertise, working for clients — not insurance companies.'}
          </p>
        </div>
      </section>

      {/* ── OUR STORY ───────────────────────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            {/* Story photo placeholder */}
            <div style={{ background: 'var(--navy-50)', borderRadius: 'var(--radius-lg)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '4rem' }}>🏢</span>
              <p style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>Office Photo</p>
            </div>

            {/* Story text */}
            <div>
              <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Our Story</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 20 }}>
                {story.heading || `Serving Brooklyn Since ${story.foundedYear || story.founded || '1999'}`}
              </h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '.9375rem', marginBottom: 32 }}>
                {story.body || `Peerless Brokerage was founded in ${story.foundedYear || story.founded || '1999'} with a simple mission: give Brooklyn families and businesses the same access to insurance options that large corporations enjoy. As an independent broker, we represent you — not any single insurance company.`}
              </div>

              {/* Milestones timeline */}
              {story.milestones && story.milestones.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {story.milestones.map((m: any, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 20, paddingBottom: 20, position: 'relative' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold-500)', marginTop: 4 }} />
                        {i < story.milestones.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 4 }} />}
                      </div>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--gold-600)', fontSize: '.875rem' }}>{m.year}</span>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '.875rem', margin: '2px 0 0' }}>{m.event || m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION ─────────────────────────────────────────────── */}
      <section style={{ padding: '64px 0', background: 'var(--navy-50)', textAlign: 'center' }}>
        <div className="container-custom" style={{ maxWidth: 720 }}>
          <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Our Mission</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 20 }}>
            {content.mission?.headline || 'We Work For You — Not the Insurance Company'}
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {content.mission?.body || 'We believe every family and business deserves access to the best insurance options at the best price. As independent brokers, we shop multiple carriers on your behalf — so you never overpay or under-protect.'}
          </p>
        </div>
      </section>

      {/* ── LICENSES & CREDENTIALS ──────────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Trust & Credentials</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>
              {licenses.headline || 'Licenses & Credentials'}
            </h2>
          </div>

          {/* License table */}
          <div style={{ overflowX: 'auto', marginBottom: 40 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--navy-800)', color: '#fff' }}>
                  {['State', 'License Number', 'Type', 'Status', 'Verify'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(licenses.items || [
                  { state: 'New York', licenseNumber: si?.licenseNumber || 'LA-1234567', verifyUrl: STATE_DOI.NY },
                  { state: 'New Jersey', licenseNumber: 'NJ-7654321', verifyUrl: STATE_DOI.NJ },
                  { state: 'Connecticut', licenseNumber: 'CT-1122334', verifyUrl: STATE_DOI.CT },
                  { state: 'Pennsylvania', licenseNumber: 'PA-4433221', verifyUrl: STATE_DOI.PA },
                ]).map((lic: any, i: number) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-white)' : 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{lic.state}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>#{lic.licenseNumber}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Insurance Broker</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: 'var(--green-100)', color: 'var(--green-500)', fontSize: '.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>Active</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <a href={lic.verifyUrl || STATE_DOI[lic.state?.substring(0, 2)] || '#'} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--gold-600)', fontSize: '.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        Verify <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Memberships + E&O */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 16 }}>Professional Memberships</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {(licenses.memberships || [
                  { name: 'PIANY — Professional Insurance Agents of NY' },
                  { name: 'IIABNY — Independent Insurance Agents' },
                  { name: 'Better Business Bureau (BBB)' },
                ]).map((m: any) => (
                  <div key={m.name} style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 8, padding: '8px 14px', fontSize: '.85rem', fontWeight: 500, color: 'var(--navy-700)' }}>
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 'var(--radius-lg)', padding: '24px 28px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Shield className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--navy-600)', marginTop: 2 }} />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 8, fontWeight: 700 }}>E&O Insurance Holder</h4>
                  <p style={{ fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    We carry Errors & Omissions (E&O) insurance — protecting our clients and our professional standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ─────────────────────────────────────────── */}
      {agents.length > 0 && (
        <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
          <div className="container-custom">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>The Team</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>Meet Our Licensed Agents</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: 12 }}>Licensed professionals dedicated to finding you the best coverage</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {agents.map((agent: any) => (
                <div key={agent.id} style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--navy-100)', border: '3px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy-700)', margin: '0 auto 16px' }}>
                    {agent.name?.charAt(0)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-800)', marginBottom: 2 }}>{agent.name}</div>
                  <div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--gold-600)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>{agent.title}</div>
                  {agent.specialties?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                      {agent.specialties.map((s: string) => (
                        <span key={s} style={{ background: 'var(--navy-50)', color: 'var(--navy-700)', fontSize: '.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>{s}</span>
                      ))}
                    </div>
                  )}
                  {agent.languages?.length > 0 && (
                    <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                      🌐 {agent.languages.join(' · ')}
                    </div>
                  )}
                  <div style={{ fontSize: '.75rem', color: 'var(--text-light)', marginBottom: 16 }}>
                    {agent.license_number && `NY Lic. #${agent.license_number}`}
                    {agent.years_experience > 0 && ` · ${agent.years_experience} yrs exp`}
                  </div>
                  <Link href={`/${locale}/quote?agent=${agent.id}`}
                    style={{ display: 'block', background: 'var(--navy-800)', color: '#fff', borderRadius: 8, padding: '10px', fontWeight: 600, fontSize: '.875rem', textDecoration: 'none' }}>
                    Get a Quote with {agent.name?.split(' ')[0]}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CARRIERS ─────────────────────────────────────────────── */}
      <CarrierLogoCarousel
        headline="Our Carrier Partners"
        subline={`We shop ${carriers.length > 10 ? carriers.length + '+' : '30+'} carriers to find your best rate`}
        carriers={carriers}
        variant="static-grid"
      />

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <QuoteCTASection
        variant="cta-only"
        headline="Ready to Work with a Broker Who Puts You First?"
        subline="Get a free quote today and see how much you can save."
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
