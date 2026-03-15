'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, CheckCircle } from 'lucide-react';

interface InsuranceLine { line_slug?: string; slug?: string; name?: string; is_enabled?: boolean; }

interface QuoteCTASectionProps {
  headline?: string;
  subline?: string;
  responsePromise?: string;
  submitLabel?: string;
  variant?: 'form-inline' | 'cta-only';
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  note?: string;
  coverageType?: string;
  phone?: string;
  phoneHref?: string;
  insuranceLines?: InsuranceLine[];
  locale?: string;
}

const COVERAGE_OPTIONS = [
  { slug: 'auto', name: 'Auto Insurance' },
  { slug: 'tlc', name: 'TLC Insurance' },
  { slug: 'commercial-auto', name: 'Commercial Auto' },
  { slug: 'homeowner', name: 'Homeowner Insurance' },
  { slug: 'business', name: 'Business Insurance' },
  { slug: 'workers-comp', name: 'Workers Compensation' },
  { slug: 'disability', name: 'Disability Insurance' },
  { slug: 'construction', name: 'Construction Insurance' },
  { slug: 'motorcycle', name: 'Motorcycle Insurance' },
  { slug: 'boat', name: 'Boat Insurance' },
  { slug: 'travel', name: 'Travel Insurance' },
  { slug: 'group-health', name: 'Group Health Insurance' },
];

export default function QuoteCTASection({
  headline = 'Ready to Save on Insurance?',
  subline = 'Takes 2 minutes. No obligation. We shop 30+ carriers for you.',
  responsePromise = 'We respond within 2 business hours',
  submitLabel = 'Get My Free Quote',
  variant = 'form-inline',
  ctaPrimary,
  ctaSecondary,
  note,
  coverageType = '',
  phone = '+1 (718) 555-0100',
  phoneHref = 'tel:+17185550100',
  insuranceLines = [],
  locale = 'en',
}: QuoteCTASectionProps) {
  const [form, setForm] = useState({ name: '', phone: '', coverageType: coverageType || '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const lines = insuranceLines.length > 0
    ? insuranceLines.filter(l => l.is_enabled !== false)
    : COVERAGE_OPTIONS.map(c => ({ line_slug: c.slug, name: c.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.name.split(' ')[0] || form.name,
          lastName: form.name.split(' ').slice(1).join(' ') || '',
          phone: form.phone,
          coverageTypes: form.coverageType ? [form.coverageType] : [],
          source: 'home_cta',
        }),
      });
      if (res.ok) { setStatus('success'); }
      else { setStatus('error'); }
    } catch {
      setStatus('error');
    }
  };

  if (variant === 'cta-only') {
    return (
      <section style={{ background: 'var(--navy-700)', padding: 'var(--section-y) 0' }}>
        <div className="container-custom" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(1.6rem,3vw,2.4rem)', marginBottom: 16 }}>
            {headline}
          </h2>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 36px' }}>{subline}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link href={ctaPrimary?.href || `/${locale}/quote`}
              className="btn btn-primary btn-lg"
              style={{ background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 36px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-600)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold-500)')}>
              {ctaPrimary?.label || 'Get a Free Quote'}
            </Link>
            {phone && (
              <a href={phoneHref}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.4)', borderRadius: 10, padding: '16px 36px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.12)'; (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.4)'; }}>
                <Phone className="w-4 h-4" />
                {ctaSecondary?.label || `Call ${phone}`}
              </a>
            )}
          </div>
          {(note || responsePromise) && (
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.875rem', marginTop: 24 }}>{note || responsePromise}</p>
          )}
        </div>
      </section>
    );
  }

  // form-inline variant
  return (
    <section style={{ background: 'var(--navy-800)', padding: 'var(--section-y) 0' }}>
      <div className="container-custom">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Left: headline */}
          <div>
            <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 16 }}>
              Free Quote — No Obligation
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(1.8rem,3vw,2.5rem)', marginBottom: 16, lineHeight: 1.15 }}>
              {headline}
            </h2>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 28 }}>{subline}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['We shop 30+ carriers for your best rate', 'Quote within 2 business hours', 'No obligation — completely free'].map(point => (
                <div key={point} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '.9rem', color: 'rgba(255,255,255,.75)' }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold-400)' }} />
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 16, padding: 36, border: '1px solid rgba(255,255,255,.1)' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 3 + 'rem', marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 12 }}>Request Received!</h3>
                <p style={{ color: 'rgba(255,255,255,.7)', lineHeight: 1.6, marginBottom: 20 }}>
                  We&apos;ll contact you within 2 business hours. Need immediate help?
                </p>
                <a href={phoneHref} style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '1.1rem' }}>{phone}</a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'rgba(255,255,255,.8)', marginBottom: 6 }}>
                    Your Name <span style={{ color: 'var(--red-500)' }}>*</span>
                  </label>
                  <input
                    type="text" required placeholder="John Smith"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: '.9375rem', outline: 'none' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold-500)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'rgba(255,255,255,.8)', marginBottom: 6 }}>
                    Phone Number <span style={{ color: 'var(--red-500)' }}>*</span>
                  </label>
                  <input
                    type="tel" required placeholder="(718) 555-0100"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: '.9375rem', outline: 'none' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold-500)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'rgba(255,255,255,.8)', marginBottom: 6 }}>
                    Coverage Type
                  </label>
                  <select
                    value={form.coverageType} onChange={e => setForm(f => ({ ...f, coverageType: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: '.9375rem', outline: 'none', appearance: 'none' }}
                  >
                    <option value="" style={{ background: 'var(--navy-800)' }}>Select coverage type...</option>
                    {lines.map(l => {
                      const s = l.line_slug || (l as any).slug || '';
                      return <option key={s} value={s} style={{ background: 'var(--navy-800)' }}>{l.name}</option>;
                    })}
                  </select>
                </div>
                <button
                  type="submit" disabled={status === 'loading'}
                  style={{ background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 24px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'background .18s', marginTop: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-600)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold-500)')}>
                  {status === 'loading' ? 'Sending...' : submitLabel}
                </button>
                {status === 'error' && (
                  <p style={{ color: 'var(--red-500)', fontSize: '.875rem', textAlign: 'center' }}>
                    Something went wrong — please <a href={phoneHref} style={{ color: 'var(--gold-400)', fontWeight: 700 }}>call us directly</a>.
                  </p>
                )}
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.8rem', textAlign: 'center' }}>
                  {responsePromise} · No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .quote-cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
