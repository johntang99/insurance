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
  const isZh = locale === 'zh';
  const ui = {
    title: isZh ? '在线留言' : 'Send Us a Message',
    subline: isZh ? '我们会在 1 个工作日内回复您。' : 'We\'ll get back to you within one business day.',
    successTitle: isZh ? '提交成功！' : 'Message Sent!',
    successBody: isZh ? '我们将在 1 个工作日内回复。如需加急，请致电 ' : 'We\'ll get back to you within 1 business day. Need immediate help? Call ',
    firstName: isZh ? '名字' : 'First Name',
    lastName: isZh ? '姓氏' : 'Last Name',
    phone: isZh ? '联系电话' : 'Phone Number',
    email: isZh ? '电子邮箱' : 'Email Address',
    coverageType: isZh ? '保险类型' : 'Coverage Type',
    selectType: isZh ? '请选择类型...' : 'Select type...',
    bestTime: isZh ? '方便联系时间' : 'Best Time to Call',
    anytime: isZh ? '任意时间' : 'Anytime',
    morning: isZh ? '上午 (9:00-12:00)' : 'Morning (9am–12pm)',
    afternoon: isZh ? '下午 (12:00-17:00)' : 'Afternoon (12pm–5pm)',
    evening: isZh ? '晚上 (17:00-20:00)' : 'Evening (5pm–8pm)',
    language: isZh ? '语言偏好' : 'Language Preference',
    other: isZh ? '其他' : 'Other',
    message: isZh ? '留言或问题' : 'Message or Question',
    messagePlaceholder: isZh ? '请告诉我们您的需求...' : 'Tell us what you\'re looking for...',
    sending: isZh ? '发送中...' : 'Sending...',
    send: isZh ? '提交留言' : 'Send My Message',
    error: isZh ? '提交失败，请' : 'Something went wrong — please ',
    callDirectly: isZh ? '直接致电联系我们' : 'call us directly',
    officeHours: isZh ? '办公时间' : 'Office Hours',
    closed: isZh ? '休息' : 'Closed',
    weSpeak: isZh ? '我们可用语言：' : '🌐 We speak:',
  };
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', coverageType: '', message: '', bestTime: '', language: isZh ? '中文' : 'English' });
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
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 8, fontSize: '1.6rem' }}>{ui.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: 28 }}>{ui.subline}</p>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircle className="w-12 h-12 mx-auto" style={{ color: 'var(--green-500)', marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 8 }}>{ui.successTitle}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{ui.successBody}<a href={phoneHref} style={{ color: 'var(--gold-600)', fontWeight: 700 }}>{phone}</a></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{ui.firstName} *</label>
                    <input required type="text" placeholder="John" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{ui.lastName}</label>
                    <input type="text" placeholder="Smith" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{ui.phone} *</label>
                    <input required type="tel" placeholder="(718) 799-0472" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{ui.email}</label>
                    <input type="email" placeholder="john@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{ui.coverageType}</label>
                    <select value={form.coverageType} onChange={e => setForm(f => ({ ...f, coverageType: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none', background: 'var(--bg-white)', appearance: 'none' }}>
                      <option value="">{ui.selectType}</option>
                      {insuranceLines.map(l => <option key={l.line_slug || l.slug} value={l.line_slug || l.slug}>{l.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{ui.bestTime}</label>
                    <select value={form.bestTime} onChange={e => setForm(f => ({ ...f, bestTime: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none', background: 'var(--bg-white)', appearance: 'none' }}>
                      <option value="">{ui.anytime}</option>
                      <option value="morning">{ui.morning}</option>
                      <option value="afternoon">{ui.afternoon}</option>
                      <option value="evening">{ui.evening}</option>
                    </select>
                  </div>
                </div>
                {languages.length > 1 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{ui.language}</label>
                    <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none', background: 'var(--bg-white)', appearance: 'none' }}>
                      {languages.map((l: string) => <option key={l} value={l}>{l}</option>)}
                      <option value="Other">{ui.other}</option>
                    </select>
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{ui.message}</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} placeholder={ui.messagePlaceholder}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.9375rem', outline: 'none', resize: 'vertical' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                </div>
                <button type="submit" disabled={status === 'loading'}
                  style={{ background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 24px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                  {status === 'loading' ? ui.sending : ui.send}
                </button>
                {status === 'error' && (
                  <p style={{ color: 'var(--red-500)', fontSize: '.875rem', textAlign: 'center' }}>
                    {ui.error} <a href={phoneHref} style={{ color: 'var(--gold-600)', fontWeight: 700 }}>{ui.callDirectly}</a>.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Right panel: Hours + contact summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 24px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone className="w-4 h-4" style={{ color: 'var(--gold-500)' }} /> {ui.officeHours}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {hours.map((h: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.875rem', padding: '6px 0', borderBottom: i < hours.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{h.days}</span>
                    <span style={{ fontWeight: 600, color: h.hours === ui.closed ? 'var(--red-500)' : 'var(--text-primary)' }}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            {languages.length > 0 && (
              <div style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                <p style={{ fontWeight: 600, color: 'var(--navy-800)', marginBottom: 10, fontSize: '.9rem' }}>🌐 {ui.weSpeak}</p>
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
