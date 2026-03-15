import { notFound } from 'next/navigation';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import InsuranceHero from '@/components/sections/InsuranceHero';
import { CheckCircle, XCircle, Phone } from 'lucide-react';

interface PageProps { params: { locale: Locale; slug: string } }

const LINE_ICONS: Record<string, string> = {
  auto: '🚗', tlc: '🚕', 'commercial-auto': '🚛', homeowner: '🏠',
  business: '💼', 'workers-comp': '🦺', disability: '🛡️', construction: '🏗️',
  motorcycle: '🏍️', boat: '⛵', travel: '✈️', 'group-health': '❤️',
  'commercial-property': '🏢',
};

// Resolves icon names (from content JSON) to emoji — handles both emoji and
// legacy Lucide icon name strings that were accidentally stored in content.
const ICON_NAMES_TO_EMOJI: Record<string, string> = {
  // Search / discovery
  search: '🔍', magnify: '🔍', compare: '🔍',
  // Approval / quality
  star: '⭐', award: '🏆', check: '✅', badge: '🏅', certificate: '📜',
  // Speed / time
  clock: '⏱️', zap: '⚡', lightning: '⚡', speed: '🚀',
  // Protection / security
  shield: '🛡️', lock: '🔒', security: '🔐',
  // Money / savings
  'dollar-sign': '💰', dollar: '💰', money: '💰', savings: '💰', percent: '💲',
  // People / service
  users: '👥', user: '👤', handshake: '🤝', 'hand-shake': '🤝',
  // Communication / language
  globe: '🌐', world: '🌐', language: '🗣️', phone: '📞',
  // Misc
  'life-buoy': '🤝', store: '🏪', stack: '📚', 'phone-call': '📞',
  building: '🏢', home: '🏠', car: '🚗', truck: '🚛',
  heart: '❤️', hammer: '🔨', tool: '🔧',
};

function resolveIcon(icon: string | undefined): string {
  if (!icon) return '✦';
  // Already an emoji (contains non-ASCII Unicode) — return as-is
  if (/\p{Emoji}/u.test(icon)) return icon;
  // Known icon name → emoji
  return ICON_NAMES_TO_EMOJI[icon.toLowerCase()] || '✦';
}

const LINE_NAMES: Record<string, string> = {
  auto: 'Auto Insurance', tlc: 'TLC Insurance', 'commercial-auto': 'Commercial Auto Insurance',
  homeowner: 'Homeowner Insurance', business: 'Business Insurance', 'workers-comp': 'Workers Compensation',
  disability: 'Disability Insurance', construction: 'Construction Insurance', motorcycle: 'Motorcycle Insurance',
  boat: 'Boat Insurance', travel: 'Travel Insurance', 'group-health': 'Group Health Insurance',
  'commercial-property': 'Commercial Property Insurance',
};

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();
  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>(`insurance/${slug}`, locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const city = (siteInfo as any)?.city || 'Flushing';
  const lineName = content?.serviceHero?.headline || LINE_NAMES[slug] || `${slug} Insurance`;
  return buildPageMetadata({
    siteId, locale, slug: `insurance/${slug}`,
    title: `${lineName} in ${city} | ${siteName}`,
    description: content?.serviceHero?.subline || `Get a free ${lineName.toLowerCase()} quote from ${siteName}. We compare 30+ carriers to find your best rate in ${city}.`,
  });
}

export default async function InsuranceServicePage({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();

  const supabase = getSupabaseServerClient();

  const [content, siteInfo, lineRes, testimonialsRes] = await Promise.all([
    loadPageContent<any>(`insurance/${slug}`, locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
    supabase?.from('insurance_lines').select('*').eq('site_id', siteId).eq('line_slug', slug).single(),
    supabase?.from('testimonials').select('*').eq('site_id', siteId).limit(3),
  ]);

  // 404 if this service line doesn't exist or is disabled
  if (!lineRes?.data || lineRes.data.is_enabled === false) notFound();

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');

  const hero = content?.serviceHero || {};
  const covers = content?.whatItCovers || {};
  const whyUs = content?.whyUs || {};
  const quoteProcess = content?.quoteProcess || {};
  const rateFactors = content?.rateFactors || {};
  const faq = content?.faq || {};
  const related = content?.related || {};
  const testimonials = testimonialsRes?.data || [];

  const lineName = hero.headline || LINE_NAMES[slug] || `${slug.charAt(0).toUpperCase() + slug.slice(1)} Insurance`;
  const icon = LINE_ICONS[slug] || '🔐';
  const isTLC = slug === 'tlc';

  return (
    <main>
      {/*
        ── HERO — uses InsuranceHero component with 2 variants:
           • 'split-image' when hero.image is set in content JSON
           • 'centered'    when no image (default — clean, text-only, navy full-width)
        To add an image: set serviceHero.image in the page's JSON content.
      */}
      <InsuranceHero
        variant={hero.image ? 'split-image' : 'centered'}
        badge={hero.badge || `${lineName} Coverage`}
        icon={icon}
        headline={`${lineName} in Flushing, NY`}
        subline={hero.subline || `Free quotes from 30+ carriers. Same-day service for Flushing, Queens, and all of NYC.`}
        image={hero.image}
        imageAlt={hero.imageAlt || `${lineName} — Peerless Brokerage`}
        stats={hero.stats?.length > 0 ? hero.stats : [
          { value: isTLC ? 'Same Day' : '30+', label: isTLC ? 'Binding' : 'Carriers', suffix: isTLC ? '' : '' },
          { value: '2', label: 'Hour Quote', suffix: 'hr' },
          { value: 'NY · NJ · CT · PA', label: 'Licensed In' },
        ]}
        ctaPrimary={{ label: hero.ctaPrimary?.label || `Get a ${lineName} Quote`, href: `/${locale}/quote?type=${slug}` }}
        ctaSecondary={{ label: `Call ${phone}`, href: phoneHref }}
        trustBadge="No obligation · Free quote · Licensed broker"
        urgencyNote={isTLC ? 'TLC plate renewal deadline? We specialize in fast TLC compliance — <strong>same-day binding available.</strong>' : undefined}
      />

      {/* ── SECTION 2: WHAT IT COVERS ──────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Coverage Details</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>
              {covers.headline || `What ${lineName} Covers`}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            {/* Included */}
            <div>
              <h3 style={{ color: 'var(--green-500)', fontFamily: 'var(--font-heading)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle className="w-5 h-5" /> What&apos;s Covered
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(covers.included || [
                  { title: 'Liability Coverage', description: 'Pays for injuries and property damage you cause to others.' },
                  { title: 'Collision Coverage', description: 'Repairs your vehicle after an accident.' },
                  { title: 'Comprehensive Coverage', description: 'Covers theft, vandalism, and weather damage.' },
                  { title: 'Personal Injury Protection', description: 'Required in NY — covers your medical bills regardless of fault.' },
                ]).map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--green-500)' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text-primary)', marginBottom: 2 }}>{item.title}</div>
                      <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel: who needs it + not covered */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {covers.whoNeedsIt && (
                <div style={{ background: 'var(--navy-800)', borderRadius: 'var(--radius-lg)', padding: '28px 24px', color: '#fff' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-400)', marginBottom: 12 }}>Who Needs This?</h4>
                  <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.65 }}>{covers.whoNeedsIt}</p>
                  {covers.isRequired && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--gold-500)', color: '#fff', borderRadius: 100, padding: '4px 12px', fontSize: '.78rem', fontWeight: 700, marginTop: 14 }}>
                      ⚖️ Required by Law
                    </div>
                  )}
                </div>
              )}
              {covers.excluded && covers.excluded.length > 0 && (
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <XCircle className="w-4 h-4" style={{ color: 'var(--red-500)' }} /> Not Covered
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {covers.excluded.map((item: any, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '12px 14px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.875rem' }}>
                        <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--red-500)' }} />
                        <div>
                          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.title}: </span>
                          <span style={{ color: 'var(--text-muted)' }}>{item.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHY US ──────────────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          {/* TLC specialist badge */}
          {isTLC && (
            <div style={{ background: 'var(--gold-100)', border: '2px solid var(--gold-400)', borderRadius: 12, padding: '20px 24px', marginBottom: 40, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>⚡</span>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 6, fontWeight: 700 }}>TLC Deadline Pressure?</h4>
                <p style={{ fontSize: '.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  We Specialize in Fast TLC Compliance Coverage. Same-day binding for TLC plate renewals.{' '}
                  <strong>We speak English, Spanish, and Chinese</strong> — no language barrier.{' '}
                  <a href={phoneHref} style={{ color: 'var(--gold-600)', fontWeight: 700, textDecoration: 'none' }}>Speak to a TLC specialist now →</a>
                </p>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>
              {whyUs.headline || `Why Choose ${siteName}?`}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {(whyUs.points || [
              { icon: '🔍', title: `30+ ${lineName} Carriers`, description: 'We compare all major carriers to guarantee you the lowest rate for your situation.' },
              { icon: '⚡', title: 'Same-Day Quotes', description: 'Fast turnaround — most quotes ready within 2 hours during business hours.' },
              { icon: '🏆', title: '25 Years Experience', description: 'Decades of expertise means we know which carriers provide the best value for each situation.' },
            ]).map((point: any, i: number) => (
              <div key={i} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px 24px', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 14 }}>{resolveIcon(point.icon)}</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 10, fontSize: '1.1rem' }}>{point.title}</h3>
                <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: RATE FACTORS ─────────────────────────────── */}
      {rateFactors.factors && rateFactors.factors.length > 0 && (
        <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
          <div className="container-custom">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>
                {rateFactors.headline || `What Affects Your ${lineName} Rate?`}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 32 }}>
              {rateFactors.factors.map((f: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '.9rem' }}>{f.factor}</span>
                    <span style={{ fontSize: '.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: f.impact === 'high' ? 'var(--red-100)' : f.impact === 'medium' ? 'var(--gold-100)' : 'var(--green-100)', color: f.impact === 'high' ? 'var(--red-600)' : f.impact === 'medium' ? 'var(--gold-600)' : 'var(--green-600)' }}>
                      {f.impact} impact
                    </span>
                  </div>
                  <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>{f.description}</p>
                </div>
              ))}
            </div>
            {rateFactors.tips && rateFactors.tips.length > 0 && (
              <div style={{ background: 'var(--gold-100)', border: '1px solid var(--gold-300)', borderRadius: 'var(--radius-lg)', padding: '24px 28px' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-600)', marginBottom: 14 }}>💡 Tips to Lower Your Rate</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {rateFactors.tips.map((tip: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: '.875rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--gold-600)', flexShrink: 0 }}>✓</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SECTION 5: QUOTE PROCESS ────────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>
              {quoteProcess.headline || `How to Get Your ${lineName} Quote`}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {(quoteProcess.steps || [
              { number: '01', title: `Tell us about your ${slug === 'homeowner' ? 'home' : slug === 'business' ? 'business' : 'vehicle'}`, description: 'Quick 2-minute form or call us — we\'ll gather what we need.' },
              { number: '02', title: 'We compare 30+ carrier rates', description: 'Our licensed brokers compare every relevant carrier on your behalf.' },
              { number: '03', title: 'Bind your policy', description: 'Review your options and we\'ll bind your policy — same day in most cases.' },
            ]).map((step: any, i: number) => (
              <div key={i} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px 24px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 700, color: 'var(--navy-50)', display: 'block', marginBottom: 8 }}>{step.number}</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 10, fontSize: '1.05rem' }}>{step.title}</h3>
                <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{step.description}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href={`/${locale}/quote?type=${slug}`} className="btn-gold">
              {quoteProcess.cta?.label || `Start My ${lineName} Quote`}
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TESTIMONIALS ─────────────────────────────── */}
      {testimonials.length > 0 && (
        <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
          <div className="container-custom">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>What Our Clients Say</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(testimonials.length, 3)},1fr)`, gap: 24 }}>
              {testimonials.slice(0, 3).map((t: any) => (
                <div key={t.id} style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
                  <div style={{ color: 'var(--gold-500)', letterSpacing: 2, marginBottom: 14 }}>★★★★★</div>
                  <p style={{ fontSize: '.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 16 }}>
                    &ldquo;{t.quote || t.content}&rdquo;
                  </p>
                  <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text-primary)' }}>{t.name || t.author_name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 7: FAQ ──────────────────────────────────────── */}
      {faq.items && faq.items.length > 0 && (
        <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
          <div className="container-custom" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>
                {faq.headline || `${lineName} FAQs`}
              </h2>
            </div>
            <ServiceFAQAccordion items={faq.items} />
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faq.items.map((q: any) => ({
                  '@type': 'Question',
                  name: q.question,
                  acceptedAnswer: { '@type': 'Answer', text: q.answer },
                })),
              }),
            }}
          />
        </section>
      )}

      {/* ── SECTION 8: RELATED SERVICES ─────────────────────────── */}
      {related.slugs && related.slugs.length > 0 && (
        <section style={{ padding: '56px 0', background: 'var(--bg-subtle)' }}>
          <div className="container-custom">
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 24, fontSize: '1.25rem' }}>
              {related.headline || 'Clients Also Ask About'}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {related.slugs.map((rs: string) => (
                <Link key={rs} href={`/${locale}/insurance/${rs}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 20px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500, fontSize: '.9rem' }}>
                  {LINE_ICONS[rs] || '🔐'} {LINE_NAMES[rs] || rs}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 9: QUOTE CTA ─────────────────────────────────── */}
      <QuoteCTASection
        variant="form-inline"
        headline={`Ready to Get Your ${lineName} Quote?`}
        subline="No obligation. Free quote. We shop 30+ carriers for you."
        coverageType={slug}
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}

// Client-side FAQ accordion
function ServiceFAQAccordion({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <div>
      {items.map((item, i) => (
        <FAQItem key={i} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}

// We need this as a server component trick — use details/summary for no-JS accordion
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details style={{ borderBottom: '1px solid var(--border)', padding: '0' }}
      onToggle={undefined}>
      <summary style={{
        cursor: 'pointer', padding: '20px 0', fontWeight: 600, color: 'var(--text-primary)',
        fontSize: '.9375rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        {question}
        <span style={{ fontSize: '1.25rem', color: 'var(--gold-500)', flexShrink: 0, marginLeft: 12 }}>+</span>
      </summary>
      <div style={{ padding: '0 0 20px', fontSize: '.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {answer}
      </div>
    </details>
  );
}
