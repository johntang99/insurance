'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { LOCATIONS, LOCATION_MAP, DEFAULT_ACTIVE_LOCATIONS, groupByState } from '@/lib/insurance/locations';
import { INSURANCE_LINE_META } from '@/lib/insurance/theme';

const ACTIVE_SLUGS = DEFAULT_ACTIVE_LOCATIONS;
const grouped = groupByState(ACTIVE_SLUGS);

const STATE_NAMES: Record<string, string> = { NY: 'New York', NJ: 'New Jersey', CT: 'Connecticut', PA: 'Pennsylvania' };

const COVERAGE_TYPES = Object.entries(INSURANCE_LINE_META)
  .filter(([slug]) => !['dmv', 'notary'].includes(slug))
  .slice(0, 12)
  .map(([slug, meta]) => ({ slug, name: meta.name, icon: meta.icon }));

export default function LocationsPage() {
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const locale = 'en';

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 12 }}>Service Areas</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 16 }}>
            We Serve New York City and Surrounding Areas
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.65 }}>
            Licensed insurance broker serving Flushing, Queens, Manhattan, the Bronx, Staten Island, and throughout NY, NJ, CT, and PA.
          </p>
          <Link href={`/${locale}/quote`} className="btn-gold">Get a Free Quote</Link>
        </div>
      </section>

      {/* States served */}
      <section style={{ padding: '40px 0', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-custom">
          <p style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 14, textAlign: 'center' }}>Licensed and Serving:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(STATE_NAMES).map(([code, name]) => (
              <div key={code} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--navy-800)', color: '#fff', borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: '.9rem' }}>
                <span style={{ color: 'var(--gold-400)', fontFamily: 'var(--font-heading)' }}>{code}</span>
                <span style={{ color: 'rgba(255,255,255,.6)' }}>—</span>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City grid with accordion */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 8 }}>Browse Insurance by Your City</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Click your city to see available coverage types and get a local quote.</p>
          </div>

          {Object.entries(grouped).map(([stateCode, locs]) => (
            <div key={stateCode} style={{ marginBottom: 48 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1.1rem', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid var(--border)' }}>
                📍 {STATE_NAMES[stateCode] || stateCode}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                {locs.map(loc => {
                  const isExpanded = expandedCity === loc.slug;
                  return (
                    <div key={loc.slug}>
                      <button
                        onClick={() => setExpandedCity(isExpanded ? null : loc.slug)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 18px', border: `1.5px solid ${isExpanded ? 'var(--navy-500)' : 'var(--border)'}`,
                          borderRadius: 10, background: isExpanded ? 'var(--navy-50)' : 'var(--bg-white)',
                          cursor: 'pointer', transition: 'all .15s',
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
                          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: isExpanded ? 'var(--navy-600)' : 'var(--text-muted)' }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '.875rem', color: isExpanded ? 'var(--navy-800)' : 'var(--text-primary)' }}>{loc.name}</div>
                            <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{loc.stateCode} · {COVERAGE_TYPES.length} lines</div>
                          </div>
                        </div>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--navy-600)' }} />
                          : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />}
                      </button>

                      {isExpanded && (
                        <div style={{ border: '1px solid var(--navy-100)', borderTop: 'none', borderRadius: '0 0 10px 10px', background: 'var(--navy-50)', padding: '12px 14px' }}>
                          <p style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)', marginBottom: 8 }}>
                            Coverage in {loc.name}:
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {COVERAGE_TYPES.slice(0, 8).map(ct => (
                              <Link key={ct.slug} href={`/${locale}/insurance/${ct.slug}/${loc.slug}`}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, fontSize: '.82rem', color: 'var(--navy-700)', textDecoration: 'none', fontWeight: 500 }}>
                                <span>{ct.icon}</span>
                                {ct.name} in {loc.name} →
                              </Link>
                            ))}
                            <Link href={`/${locale}/insurance/${COVERAGE_TYPES[0].slug}/${loc.slug}`}
                              style={{ display: 'block', marginTop: 6, padding: '8px 10px', background: 'var(--gold-500)', color: '#fff', borderRadius: 8, fontSize: '.8rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                              Get a Quote in {loc.name}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '48px 0', background: 'var(--navy-800)', textAlign: 'center' }}>
        <div className="container-custom">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 8 }}>Not sure if we serve your area?</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: 24 }}>Call us — we serve all of NY, NJ, CT, and PA.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/${locale}/quote`} className="btn-gold">Get a Free Quote</Link>
            <a href="tel:+17187990472" className="btn-navy-outline">📞 (718) 799-0472</a>
          </div>
        </div>
      </section>
    </main>
  );
}
