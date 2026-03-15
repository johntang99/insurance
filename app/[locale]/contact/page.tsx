import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import ContactFormSection from '@/components/sections/ContactFormSection';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const si = siteInfo as any;
  return buildPageMetadata({
    siteId, locale, slug: 'contact',
    title: `Contact ${siteName} | Insurance Broker in ${si?.city || 'Brooklyn'}`,
    description: `Reach ${siteName} by phone, email, or visit our ${si?.city || 'Brooklyn'} office. Free insurance quotes. ${si?.phone || '(718) 555-0100'}.`,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('contact', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || '+1 (718) 555-0100';
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17185550100';
  const email = si?.email || 'info@pbiny.com';
  const address = si?.address ? `${si.address}, ${si.city}, ${si.state} ${si.zip}` : '123 Main Street, Brooklyn, NY 11201';
  const languages = si?.languages || ['English', 'Spanish', 'Chinese'];
  const hours = content?.contactInfo?.hours || [
    { days: 'Monday – Friday', hours: '9:00am – 6:00pm' },
    { days: 'Saturday', hours: '10:00am – 3:00pm' },
    { days: 'Sunday', hours: 'Closed' },
  ];

  const supabase = getSupabaseServerClient();
  const linesRes = await supabase?.from('insurance_lines').select('line_slug,name').eq('site_id', siteId).eq('is_enabled', true).order('sort_order');
  const lines = linesRes?.data || [];

  return (
    <main>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 12 }}>
            {content?.hero?.headline || 'Contact Us'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto' }}>
            {content?.hero?.subline || "We're here to help — call, email, or stop by our office."}
          </p>
        </div>
      </section>

      {/* ── CONTACT INFO GRID ────────────────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {/* Column 1: Phone */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '36px 28px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--navy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Phone className="w-6 h-6" style={{ color: 'var(--gold-400)' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 16 }}>Call or Text</h3>
              <a href={phoneHref} style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-800)', textDecoration: 'none', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
                {phone}
              </a>
              <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                Available Mon–Sat 9am–6pm
              </p>
              {languages.length > 1 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
                  {languages.map((lang: string) => (
                    <span key={lang} style={{ background: 'var(--navy-50)', color: 'var(--navy-700)', fontSize: '.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>{lang}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Office */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '36px 28px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--navy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <MapPin className="w-6 h-6" style={{ color: 'var(--gold-400)' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 16 }}>Our Office</h3>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.5 }}>{address}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', color: 'var(--gold-600)', fontWeight: 600, fontSize: '.875rem', marginBottom: 16 }}>
                Get Directions →
              </a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {hours.map((h: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{h.days}</span>
                    <span style={{ fontWeight: 600, color: h.hours === 'Closed' ? 'var(--red-500)' : 'var(--text-primary)' }}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Email */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '36px 28px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--navy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Mail className="w-6 h-6" style={{ color: 'var(--gold-400)' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 16 }}>Email or Quote</h3>
              <a href={`mailto:${email}`} style={{ display: 'block', color: 'var(--navy-800)', fontWeight: 600, marginBottom: 8, wordBreak: 'break-all' }}>{email}</a>
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>We respond within 1 business day</p>
              <a href={`/${locale}/quote`} className="btn-gold-sm" style={{ display: 'block', textAlign: 'center' }}>
                Get a Free Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ─────────────────────────────────────────── */}
      <ContactFormSection
        locale={locale}
        phone={phone}
        phoneHref={phoneHref}
        hours={hours}
        languages={languages}
        insuranceLines={lines}
      />

      {/* ── MAP ─────────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 var(--section-y)' }}>
        <div className="container-custom">
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 4 }}>Find Us</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{address}</p>
          </div>
          {content?.contactInfo?.mapEmbed ? (
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <iframe
                src={content.contactInfo.mapEmbed}
                width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>
          ) : (
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
              <MapPin className="w-8 h-8" style={{ color: 'var(--navy-500)' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{address}</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--gold-600)', fontWeight: 600, fontSize: '.875rem' }}>
                  Open in Google Maps →
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SERVICE AREA ─────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div className="container-custom" style={{ textAlign: 'center' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 12 }}>Service Area</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', maxWidth: 600, margin: '0 auto' }}>
            {content?.serviceArea?.text || 'We serve clients throughout New York, New Jersey, Connecticut, and Pennsylvania. Our Brooklyn office is conveniently located for clients in Brooklyn, Queens, Manhattan, Staten Island, and the Bronx.'}
          </p>
        </div>
      </section>
    </main>
  );
}
