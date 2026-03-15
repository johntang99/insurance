import { notFound } from 'next/navigation';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo, loadContent } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import InsuranceLineGrid from '@/components/sections/InsuranceLineGrid';
import CarrierLogoCarousel from '@/components/sections/CarrierLogoCarousel';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import InsuranceHero from '@/components/sections/InsuranceHero';
import Image from 'next/image';
import { CheckCircle, Phone } from 'lucide-react';

// Blog category fallbacks (home page uses same system)
const HOME_BLOG_COLORS: Record<string, string> = {
  auto: 'linear-gradient(135deg,#0b1f3a 0%,#173560 100%)',
  tlc: 'linear-gradient(135deg,#1a2535 0%,#2a3d58 100%)',
  business: 'linear-gradient(135deg,#155f3a 0%,#1a7a4a 100%)',
  homeowner: 'linear-gradient(135deg,#2d1b00 0%,#7c4a00 100%)',
  general: 'linear-gradient(135deg,#0b1f3a 0%,#c9933a 100%)',
  'workers-comp': 'linear-gradient(135deg,#3b0f0f 0%,#8b1d1d 100%)',
  'commercial-auto': 'linear-gradient(135deg,#0c2340 0%,#1e4275 100%)',
};

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('home', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);
  const siteName = getSiteDisplayName(siteInfo, 'Insurance Brokerage');
  const city = (siteInfo as any)?.city || 'Flushing';
  return buildPageMetadata({
    siteId, locale, slug: 'home',
    title: `${siteName} — Independent Insurance Broker in ${city} | Free Quotes`,
    description: content?.hero?.subline || `Get free insurance quotes for auto, home, business & more. ${siteName} shops 30+ carriers to find your best rate. Serving ${city}.`,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('home', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  if (!content) notFound();

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');

  // Load DB data
  const supabase = getSupabaseServerClient();
  const [linesRes, carriersRes, testimonialsRes, agentsRes, blogRes] = await Promise.all([
    supabase?.from('insurance_lines').select('*').eq('site_id', siteId).eq('is_enabled', true).order('sort_order'),
    supabase?.from('site_carriers').select('*, carriers(*)').eq('site_id', siteId).order('sort_order'),
    supabase?.from('testimonials').select('*').eq('site_id', siteId).limit(3),
    supabase?.from('agents').select('*').eq('site_id', siteId).eq('is_active', true).order('sort_order').limit(3),
    Promise.resolve(null),
  ]);

  const lines = linesRes?.data || [];
  const carriers = (carriersRes?.data || []).map((sc: any) => sc.carriers).filter(Boolean);
  const testimonials = testimonialsRes?.data || [];
  const agents = agentsRes?.data || [];

  const hero = content.hero || {};
  const hiw = content.howItWorks || {};
  const stats = content.stats || {};
  const cta = content.cta || {};

  return (
    <main>
      {/*
        ── HOME HERO — InsuranceHero 'home' variant (= 'centered' + taller)
           Set hero.image in home.json to switch to 'split-image' with photo on right.
           Set hero.variant = 'split-image' to force split even before image is uploaded.
      */}
      {/*
        HOME HERO — All variants resolved by InsuranceHero.
        Admin sets hero.variant + image fields. Resolution priority:
          split-gallery-right  → hero.variant='split-gallery-right' OR hero.galleryImages
          gallery-background   → hero.variant='gallery-background' OR hero.backgroundImage
          split-image          → hero.variant='split-image' OR hero.image
          home (centered)      → default
      */}
      <InsuranceHero
        variant={hero.variant || 'home'}
        badge={`★ ${hero.badge || 'Licensed & Independent'}`}
        headline={hero.headline || 'Your Trusted Independent Insurance Broker'}
        subline={hero.subline || 'We shop 30+ carriers to find you the best rate for auto, home, business, and specialty coverage.'}
        image={hero.image}
        imageAlt={hero.imageAlt}
        backgroundImage={hero.backgroundImage}
        galleryImages={hero.galleryImages || []}
        stats={hero.stats?.length > 0 ? hero.stats : (stats.items || [])}
        ctaPrimary={{ label: hero.ctaPrimary?.label || 'Get a Free Quote', href: hero.ctaPrimary?.href || `/${locale}/quote` }}
        ctaSecondary={{ label: hero.ctaSecondary?.label || `Call ${phone}`, href: hero.ctaSecondary?.href || phoneHref }}
        trustBadge="Licensed · Independent · Local"
        minHeight={520}
      />

      {/* ── SECTION 2: INSURANCE LINE GRID ─────────────────────── */}
      <InsuranceLineGrid
        headline={content.insuranceLines?.headline || 'We Cover Everything'}
        subline={content.insuranceLines?.subline}
        lines={lines.length > 0 ? lines : []}
        variant="grid"
        locale={locale}
      />

      {/* ── SECTION 3: WHY INDEPENDENT ──────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Why We&apos;re Different</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 12 }}>
              {content.whyIndependent?.headline || 'Why Choose an Independent Broker?'}
            </h2>
            {content.whyIndependent?.subline && (
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto' }}>
                {content.whyIndependent.subline}
              </p>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {(content.whyIndependent?.points || [
              { icon: '🔍', title: 'We Shop 30+ Carriers', description: 'We compare rates from every major carrier to find your best deal — not just the one that pays us the most.' },
              { icon: '🤝', title: 'We Work For You', description: 'Captive agents can only offer one company\'s policies. We represent you and advise without bias.' },
              { icon: '📋', title: 'One Broker for Everything', description: 'Auto, home, business, specialty — one call and one trusted relationship handles everything.' },
            ]).map((point: any, i: number) => (
              <div key={i} className="hover-lift" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '36px 28px' }}>
                <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 16 }}>
                  {/\p{Emoji}/u.test(point.icon || '') ? point.icon : ({ search:'🔍', star:'⭐', 'user-check':'🤝', 'phone-call':'📞', shield:'🛡️', zap:'⚡', clock:'⏱️', globe:'🌐', 'dollar-sign':'💰', 'life-buoy':'🤝', handshake:'🤝' } as Record<string,string>)[point.icon] || point.icon || '✦'}
                </span>
                <h3 style={{ color: 'var(--navy-800)', marginBottom: 10, fontFamily: 'var(--font-heading)' }}>{point.title}</h3>
                <p style={{ fontSize: '.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{point.description}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href={`/${locale}/quote`} style={{ color: 'var(--gold-600)', fontWeight: 600, fontSize: '.9375rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              See how much you could save →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: STATS STRIP ──────────────────────────────── */}
      <section className="section--dark" style={{ background: 'var(--navy-800)', padding: 0 }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {(stats.items || [
              { value: '25', label: 'Years in Business', suffix: '+' },
              { value: '30', label: 'Carrier Partners', suffix: '+' },
              { value: '5,000', label: 'Clients Served', suffix: '+' },
              { value: '4.9', label: 'Google Rating', suffix: '★' },
            ]).map((s: any, i: number) => (
              <div key={i} style={{ textAlign: 'center', padding: '52px 24px', position: 'relative' }}>
                {i > 0 && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 1, height: 60, background: 'rgba(255,255,255,.12)' }} />}
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem,4vw,3.5rem)', fontWeight: 700, color: 'var(--gold-500)', lineHeight: 1, marginBottom: 8, display: 'block' }}>
                  {s.value}{s.suffix}
                </span>
                <span style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.65)', fontWeight: 500, letterSpacing: '.02em' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CARRIER CAROUSEL ─────────────────────────── */}
      <CarrierLogoCarousel
        headline={content.carriers?.headline || 'Carriers We Work With'}
        subline={content.carriers?.subline}
        carriers={carriers}
        variant="auto-scroll"
      />

      {/* ── SECTION 6: HOW IT WORKS ─────────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Simple Process</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>{hiw.headline || 'How It Works — 3 Simple Steps'}</h2>
            {hiw.subline && <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: 12 }}>{hiw.subline}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {(hiw.steps || [
              { number: '01', title: 'Tell Us What You Need', description: 'Fill out our 2-minute form or call us. Tell us what coverage you\'re looking for.', duration: '2 minutes' },
              { number: '02', title: 'We Shop 30+ Carriers', description: 'Our brokers compare rates from every relevant carrier and prepare your quote comparison.', duration: 'Same day' },
              { number: '03', title: 'You Pick the Best Rate', description: 'Review your options. We explain the differences. You make the final call — no pressure.', duration: 'You decide' },
            ]).map((step: any, i: number) => (
              <div key={i} className="hover-lift" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '36px 28px 32px', position: 'relative' }}>
                {/* Step number — gold gradient circle */}
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 4px 12px rgba(201,147,58,.35)' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{step.number}</span>
                </div>
                <h3 style={{ color: 'var(--navy-800)', marginBottom: 10, fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
                <p style={{ fontSize: '.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 16 }}>{step.description}</p>
                {step.duration && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--gold-100)', color: 'var(--gold-600)', fontSize: '.775rem', fontWeight: 700, padding: '4px 12px', borderRadius: 100 }}>
                    ⏱ {step.duration}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href={`/${locale}/quote`} className="btn-gold">
              {hiw.cta?.label || 'Start My Quote'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: TESTIMONIALS ─────────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Client Reviews</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>
              {content.testimonials?.headline || 'What Our Clients Say'}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {(testimonials.length > 0 ? testimonials : [
              { quote: 'Michael helped me find auto insurance that saved me $800 a year. He shopped 8 carriers and explained every option clearly.', name: 'Robert K.', coverage_type: 'auto' },
              { quote: 'As a TLC driver, I needed TLC-compliant insurance fast. James had me covered the same day. He speaks Spanish which made everything easier.', name: 'Carlos M.', coverage_type: 'tlc' },
              { quote: "We've been using Peerless for our restaurant's BOP and workers comp for 6 years. Maria always finds us the best rates.", name: 'Linda T.', coverage_type: 'business' },
            ]).map((t: any, i: number) => (
              <div key={i} className="hover-lift" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: 'var(--gold-500)', letterSpacing: 2, fontSize: '.95rem' }}>★★★★★</span>
                  <span style={{ fontSize: '.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>Google Review</span>
                </div>
                <p style={{ fontSize: '.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', flex: 1 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--gold-300)', lineHeight: 0, verticalAlign: '-.5rem', marginRight: 2 }}>&ldquo;</span>
                  {t.quote || t.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text-primary)' }}>{t.name || t.author_name}</span>
                  {t.coverage_type && (
                    <span style={{ background: 'var(--navy-50)', color: 'var(--navy-700)', fontSize: '.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>
                      {t.coverage_type.replace(/-/g, ' ')} insurance
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href={`/${locale}/testimonials`} style={{ color: 'var(--gold-600)', fontWeight: 600, fontSize: '.9375rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              See all our reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: AGENT SPOTLIGHT ──────────────────────────── */}
      {agents.length > 0 && (
        <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
          <div className="container-custom">
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Meet the Team</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>Meet Your Insurance Experts</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: 12 }}>Real people. Real expertise. No bots.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(agents.length, 3)},1fr)`, gap: 24 }}>
              {agents.slice(0, 3).map((agent: any) => (
                <div key={agent.id} className="hover-lift" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--navy-100)', border: '3px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy-700)', margin: '0 auto 16px' }}>
                    {agent.name?.charAt(0)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-800)', marginBottom: 2 }}>{agent.name}</div>
                  <div style={{ fontSize: '.83rem', fontWeight: 600, color: 'var(--gold-600)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>{agent.title}</div>
                  <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
                  {agent.years_experience > 0 && (
                    <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>📅 {agent.years_experience} years experience</div>
                  )}
                  {agent.languages?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, marginBottom: 10 }}>
                      {agent.languages.map((lang: string) => (
                        <span key={lang} style={{ background: 'var(--navy-50)', color: 'var(--navy-700)', fontSize: '.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>{lang}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: '.75rem', color: 'var(--text-light)', marginBottom: 16 }}>
                    {agent.license_number && `NY Lic. #${agent.license_number}`}
                  </div>
                  <Link href={`/${locale}/quote?agent=${agent.id}`} className="btn-navy-sm">
                    Get a Quote with {agent.name?.split(' ')[0]}
                  </Link>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href={`/${locale}/agents`} className="link-gold">
                View All Our Agents →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 9: BLOG PREVIEW — 16:9 cards with real images ── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Resource Center</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)' }}>From Our Resource Center</h2>
            </div>
            <Link href={`/${locale}/resources`} style={{ color: 'var(--gold-600)', fontWeight: 600, fontSize: '.9375rem', whiteSpace: 'nowrap' }}>
              View All Resources →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { title: 'How Much Does Auto Insurance Cost in NYC? (2026 Guide)', slug: 'how-much-does-auto-insurance-cost-nyc', category: 'auto', excerpt: 'Auto insurance in NYC is among the most expensive in the nation. Here\'s what drivers pay — and how to lower your rate.', date: 'Jan 15, 2026', coverImage: '' },
              { title: 'What Is TLC Insurance and Who Needs It in NYC?', slug: 'what-is-tlc-insurance-and-who-needs-it', category: 'tlc', excerpt: 'If you drive for Uber, Lyft, or operate a taxi in NYC, TLC insurance is legally required. Everything you need to know.', date: 'Jan 22, 2026', coverImage: '' },
              { title: 'Independent Broker vs Captive Agent: Which Is Better?', slug: 'independent-broker-vs-captive-agent', category: 'general', excerpt: 'Captive agents sell one company\'s products. Independent brokers shop dozens of carriers. Here\'s why it matters.', date: 'Feb 1, 2026', coverImage: '' },
            ].map((post, i) => {
              const bg = HOME_BLOG_COLORS[post.category] || HOME_BLOG_COLORS.general;
              return (
                <Link key={i} href={`/${locale}/resources/${post.slug}`} className="hover-lift"
                  style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                  {/* 16:9 image area */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: bg, overflow: 'hidden', flexShrink: 0 }}>
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                    ) : (
                      <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-60%)', fontSize: '3rem', opacity: .2 }}>
                        {{ auto:'🚗', tlc:'🚕', business:'💼', homeowner:'🏠', general:'📋' }[post.category] || '📄'}
                      </span>
                    )}
                    <span style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      {post.category}
                    </span>
                  </div>

                  {/* Text body */}
                  <div style={{ padding: '18px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{post.date} · 5 min read</p>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1rem', lineHeight: 1.35, marginBottom: 8, fontWeight: 600 }}>{post.title}</h3>
                    <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>{post.excerpt}</p>
                    <span style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--gold-600)', marginTop: 12 }}>Read more →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: QUOTE CTA ─────────────────────────────────── */}
      <QuoteCTASection
        headline={cta.headline || 'Ready to Save on Insurance?'}
        subline={cta.subline || 'Takes 2 minutes. No obligation. We shop 30+ carriers for you.'}
        note={cta.note}
        phone={phone}
        phoneHref={phoneHref}
        variant="form-inline"
        locale={locale}
      />
    </main>
  );
}
