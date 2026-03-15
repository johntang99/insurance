import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import { Phone, Shield } from 'lucide-react';

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'claims',
    title: `Claims Assistance | ${siteName}`,
    description: `Filing a claim can be stressful. ${siteName} guides you through every step of the claims process.`,
  });
}

export default async function ClaimsPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('claims', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';

  const steps = content?.process?.steps || [
    { step: 1, title: 'Contact Us First', description: 'Call or email us before contacting your insurance carrier directly. We\'ll advise on the best approach for your situation.' },
    { step: 2, title: 'Document Everything', description: 'We\'ll help you gather the right documentation — photos, police reports, medical records — to support your claim.' },
    { step: 3, title: 'File Your Claim', description: 'We file on your behalf or guide you through the carrier\'s claims process to ensure nothing is missed.' },
    { step: 4, title: 'Follow Up', description: 'We monitor your claim and advocate for a fair and timely resolution.' },
  ];

  return (
    <main>
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <Shield className="w-12 h-12 mx-auto" style={{ color: 'var(--gold-400)', marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 12 }}>
            {content?.hero?.headline || 'Claims Assistance'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            {content?.hero?.subline || 'Filing a claim can be stressful. We\'re here to guide you through every step.'}
          </p>
        </div>
      </section>

      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 48, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 32 }}>
                {content?.process?.headline || 'How We Help with Claims'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {steps.map((s: any) => (
                  <div key={s.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gold-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.9rem', flexShrink: 0, fontFamily: 'var(--font-heading)' }}>
                      {s.step}
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 6 }}>{s.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '.9375rem', lineHeight: 1.7, margin: 0 }}>{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--navy-800)', borderRadius: 'var(--radius-xl)', padding: '32px 28px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 12 }}>Start Your Claim</h3>
              <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.9rem', marginBottom: 24, lineHeight: 1.6 }}>
                Call us immediately after an incident. For emergencies, always call 911 first.
              </p>
              <a href={phoneHref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--gold-500)', color: '#fff', borderRadius: 10, padding: '14px 24px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', marginBottom: 14 }}>
                <Phone className="w-4 h-4" /> {phone}
              </a>
              <a href={`mailto:${si?.email || 'claims@pbiny.com'}`} style={{ display: 'block', color: 'rgba(255,255,255,.6)', fontSize: '.875rem' }}>
                {si?.email || 'claims@pbiny.com'}
              </a>
              <div style={{ marginTop: 24, padding: '14px', background: 'rgba(255,255,255,.08)', borderRadius: 10, fontSize: '.8rem', color: 'rgba(255,255,255,.55)' }}>
                ⚠️ For life-threatening emergencies, call 911 first.
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTASection
        variant="cta-only"
        headline="Have Questions About Your Coverage?"
        subline="Prevention is better than a claim — make sure you're properly covered."
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
