'use client';

import { useState } from 'react';
import { CheckCircle, Phone } from 'lucide-react';

interface ContactFormSectionProps {
  locale?: string;
  phone?: string;
  phoneHref?: string;
  hours?: Array<{ days: string; hours: string }>;
  languages?: string[];
  insuranceLines?: Array<{ line_slug?: string; slug?: string; name?: string }>;
}

export default function ContactFormSection({
  locale = 'en',
  phone = ("(718) 799-0472"),
  phoneHref = 'tel:+17187990472',
  hours = [],
  languages = [],
  insuranceLines = [],
}: ContactFormSectionProps) {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', coverageType: '', message: '', bestTime: '', language: 'English' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.phone) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          phone: form.phone, email: form.email,
          coverageTypes: form.coverageType ? [form.coverageType] : [],
          preferredLanguage: form.language,
          bestContactTime: form.bestTime,
          message: form.message,
          source: 'contact_form',
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
      <div className="container-custom">
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 48, alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '40px 36px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 8, fontSize: '1.6rem' }}>Send Us a Message</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: 28 }}>We&apos;ll get back to you within one business day.</p>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircle className="w-12 h-12 mx-auto" style={{ color: 'var(--green-500)', marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>We&apos;ll get back to you within 1 business day. Need immediate help? Call <a href={phoneHref} style={{ color: 'var(--gold-600)', fontWeight: 700 }}>{phone}</a></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>First Name *</label>
                    <input required type="text" placeholder="John" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Last Name</label>
                    <input type="text" placeholder="Smith" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Phone Number *</label>
                    <input required type="tel" placeholder="(718) 799-0472" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Email Address</label>
                    <input type="email" placeholder="john@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Coverage Type</label>
                    <select value={form.coverageType} onChange={e => setForm(f => ({ ...f, coverageType: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none', background: 'var(--bg-white)', appearance: 'none' }}>
                      <option value="">Select type...</option>
                      {insuranceLines.map(l => <option key={l.line_slug || l.slug} value={l.line_slug || l.slug}>{l.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Best Time to Call</label>
                    <select value={form.bestTime} onChange={e => setForm(f => ({ ...f, bestTime: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none', background: 'var(--bg-white)', appearance: 'none' }}>
                      <option value="">Anytime</option>
                      <option value="morning">Morning (9am–12pm)</option>
                      <option value="afternoon">Afternoon (12pm–5pm)</option>
                      <option value="evening">Evening (5pm–8pm)</option>
                    </select>
                  </div>
                </div>
                {languages.length > 1 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Language Preference</label>
                    <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none', background: 'var(--bg-white)', appearance: 'none' }}>
                      {languages.map((l: string) => <option key={l} value={l}>{l}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Message or Question</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} placeholder="Tell us what you're looking for..."
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none', resize: 'vertical' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                </div>
                <button type="submit" disabled={status === 'loading'}
                  style={{ background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 24px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                  {status === 'loading' ? 'Sending...' : 'Send My Message'}
                </button>
                {status === 'error' && (
                  <p style={{ color: 'var(--red-500)', fontSize: '.875rem', textAlign: 'center' }}>
                    Something went wrong — please <a href={phoneHref} style={{ color: 'var(--gold-600)', fontWeight: 700 }}>call us directly</a>.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Right panel: Hours + contact summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 24px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone className="w-4 h-4" style={{ color: 'var(--gold-500)' }} /> Office Hours
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {hours.map((h: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.875rem', padding: '6px 0', borderBottom: i < hours.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{h.days}</span>
                    <span style={{ fontWeight: 600, color: h.hours === 'Closed' ? 'var(--red-500)' : 'var(--text-primary)' }}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            {languages.length > 0 && (
              <div style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                <p style={{ fontWeight: 600, color: 'var(--navy-800)', marginBottom: 10, fontSize: '.9rem' }}>🌐 We speak:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {languages.map((lang: string) => (
                    <span key={lang} style={{ background: 'var(--navy-100)', color: 'var(--navy-700)', fontSize: '.8rem', fontWeight: 600, padding: '4px 12px', borderRadius: 100 }}>{lang}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
