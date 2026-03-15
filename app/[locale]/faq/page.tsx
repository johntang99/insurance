import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import FAQAccordion from '@/components/faq/FAQAccordion';
import { Mail, Phone as PhoneIcon } from 'lucide-react';
import Link from 'next/link';

interface FAQItem { category: string; question: string; answer: string; }
interface FAQCategory { id: string; label: string; }
interface FAQContent {
  hero?: { headline?: string; subline?: string };
  categories?: FAQCategory[];
  categories_list?: FAQCategory[];
  items?: FAQItem[];
}

interface PageProps { params: { locale: Locale } }

const DEFAULT_FAQ: FAQItem[] = [
  { category: 'general', question: 'What is an independent insurance broker?', answer: 'An independent broker works for you, not any single insurance company. We represent multiple carriers and can shop your coverage across 30+ options to find the best rate and coverage for your specific needs.' },
  { category: 'general', question: 'How is an independent broker different from a captive agent?', answer: 'A captive agent (like State Farm or Allstate agents) can only sell one company\'s products. An independent broker like Peerless represents many carriers and gives unbiased advice based on your needs — not their employer\'s.' },
  { category: 'general', question: 'How do you make money if quotes are free?', answer: 'We earn a commission from the insurance carrier when you purchase a policy through us. This commission is built into your premium regardless of where you buy — so using a broker costs you nothing extra.' },
  { category: 'general', question: 'How long does it take to get a quote?', answer: 'Most personal lines quotes (auto, home) are ready within 2 hours during business hours. Commercial coverage may take 1-2 business days depending on complexity.' },
  { category: 'auto', question: 'What is the minimum auto insurance required in New York?', answer: 'New York requires: Bodily Injury Liability (25/50/10), Personal Injury Protection (PIP) of $50,000 minimum, and Uninsured Motorist coverage (25/50).' },
  { category: 'auto', question: 'Can I get coverage if I have accidents or violations?', answer: 'Yes. We work with carriers that specialize in non-standard auto insurance. Your options may be limited and rates higher, but we\'ll find the best available option for your situation.' },
  { category: 'home', question: 'Does homeowner insurance cover flooding?', answer: 'No. Standard homeowner policies exclude flood damage. If you\'re in a flood zone, separate flood insurance through NFIP or private carriers is essential.' },
  { category: 'home', question: 'Should I bundle home and auto insurance?', answer: 'Almost always yes. Bundling your home and auto with one carrier typically saves 10–25% on both policies and simplifies your coverage management.' },
  { category: 'business', question: 'What is a BOP (Business Owner Policy)?', answer: 'A BOP bundles general liability and commercial property insurance into one policy at a lower cost than buying each separately. It\'s ideal for most small businesses.' },
  { category: 'business', question: 'Is workers compensation required in New York?', answer: 'Yes. New York requires workers compensation for virtually every employer — even those with just one employee. Penalties for non-compliance can be severe.' },
  { category: 'tlc', question: 'What is TLC insurance and who needs it?', answer: 'TLC insurance is commercial auto insurance required by the NYC Taxi and Limousine Commission for all for-hire vehicles including Uber, Lyft, yellow cab, and black car services.' },
  { category: 'tlc', question: 'How fast can you bind TLC insurance?', answer: 'In most cases, same day. Once we have your information, we can bind coverage and provide proof of insurance to TLC the same business day.' },
  { category: 'claims', question: 'What do I do after an accident or loss?', answer: 'Call us first before contacting your carrier directly. We\'ll advise on the best approach, help gather documentation, and file on your behalf or guide you through the process.' },
  { category: 'claims', question: 'Will filing a claim raise my rates?', answer: 'Filing a claim can increase your premium, particularly for at-fault accidents or water damage claims. We advise clients on when it makes sense to file vs. pay out of pocket.' },
  { category: 'about', question: 'How long have you been in business?', answer: 'Peerless Brokerage has been serving Brooklyn, Queens, and the NYC area since 1999 — over 25 years of independent insurance expertise.' },
  { category: 'about', question: 'Are you licensed in my state?', answer: 'We are licensed in New York, New Jersey, Connecticut, and Pennsylvania. We can help clients throughout these states.' },
];

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'faq',
    title: `Frequently Asked Questions | ${siteName}`,
    description: `Get answers to common insurance questions from ${siteName}. Independent broker FAQ — auto, home, business, TLC, claims, and more.`,
  });
}

export default async function FAQPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<FAQContent>('faq', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || '+1 (718) 555-0100';
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17185550100';
  const email = si?.email || 'info@pbiny.com';

  // Use items from content JSON, fallback to defaults
  const faqItems: FAQItem[] = content?.items || DEFAULT_FAQ;
  const categories: FAQCategory[] = content?.categories || content?.categories_list || [
    { id: 'general', label: 'General' },
    { id: 'auto', label: 'Auto' },
    { id: 'home', label: 'Home' },
    { id: 'business', label: 'Business' },
    { id: 'tlc', label: 'TLC' },
    { id: 'claims', label: 'Claims' },
    { id: 'about', label: 'About Us' },
  ];

  return (
    <>
      {/* FAQPage schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.slice(0, 50).map(q => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        })),
      }) }} />

      <main>
        {/* Hero */}
        <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
          <div className="container-custom">
            <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 12 }}>FAQ</p>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 16 }}>
              {content?.hero?.headline || 'Frequently Asked Questions'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto', lineHeight: 1.65 }}>
              {content?.hero?.subline || 'Everything you need to know about working with us'}
            </p>
          </div>
        </section>

        {/* FAQ accordion (client component with search + tabs) */}
        <FAQAccordion
          items={faqItems}
          categories={categories}
          phone={phone}
          phoneHref={phoneHref}
        />

        {/* Contact strip */}
        <section style={{ padding: '48px 0', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
          <div className="container-custom">
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', textAlign: 'center', marginBottom: 28 }}>
              Still have questions? We&apos;re here to help.
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="grid-1col-mobile">
              <a href={phoneHref} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', textDecoration: 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--navy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PhoneIcon className="w-5 h-5" style={{ color: 'var(--gold-500)' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--navy-800)', fontSize: '.9rem', marginBottom: 2 }}>Call Us</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{phone}</p>
                </div>
              </a>
              <a href={`mailto:${email}`} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', textDecoration: 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--navy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail className="w-5 h-5" style={{ color: 'var(--gold-500)' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--navy-800)', fontSize: '.9rem', marginBottom: 2 }}>Email Us</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{email}</p>
                </div>
              </a>
              <Link href={`/${locale}/quote`} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--gold-500)', border: 'none', borderRadius: 'var(--radius-lg)', padding: '20px 24px', textDecoration: 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.25rem' }}>📋</span>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '.9rem', marginBottom: 2 }}>Get a Free Quote</p>
                  <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem' }}>2-hour response guaranteed</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <QuoteCTASection
          variant="cta-only"
          headline="Ready to Get Started?"
          subline="Get a free quote in minutes. No obligation."
          phone={phone}
          phoneHref={phoneHref}
          locale={locale}
        />
      </main>
    </>
  );
}
