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

const COVERAGE_NAMES_ZH: Record<string, string> = {
  auto: '车险',
  tlc: 'TLC 保险',
  'commercial-auto': '商业车辆保险',
  homeowner: '房屋保险',
  business: '商业保险',
  'workers-comp': '工伤保险',
  disability: '伤残保险',
  construction: '建筑工程保险',
  motorcycle: '摩托车保险',
  boat: '船只保险',
  travel: '旅行保险',
  'group-health': '团体健康保险',
};

export default function QuoteCTASection({
  headline,
  subline,
  responsePromise,
  submitLabel,
  variant = 'form-inline',
  ctaPrimary,
  ctaSecondary,
  note,
  coverageType = '',
  phone = ("(718) 799-0472"),
  phoneHref = 'tel:+17187990472',
  insuranceLines = [],
  locale = 'en',
}: QuoteCTASectionProps) {
  const isZh = locale === 'zh';
  const copy = {
    headline: isZh ? '准备好优化您的保险费用了吗？' : 'Ready to Save on Insurance?',
    subline: isZh ? '只需 2 分钟，无需任何义务。我们将为您比较 30+ 保险公司。' : 'Takes 2 minutes. No obligation. We shop 30+ carriers for you.',
    responsePromise: isZh ? '我们通常在 2 个工作小时内回复' : 'We respond within 2 business hours',
    submitLabel: isZh ? '获取我的免费报价' : 'Get My Free Quote',
    primaryCta: isZh ? '免费获取报价' : 'Get a Free Quote',
    callPrefix: isZh ? '致电' : 'Call',
    bandLabel: isZh ? '免费报价 · 无义务' : 'Free Quote — No Obligation',
    bullets: isZh
      ? ['比较 30+ 保险公司方案', '通常 2 个工作小时内回复', '全程无义务，咨询免费']
      : ['We shop 30+ carriers for your best rate', 'Quote within 2 business hours', 'No obligation — completely free'],
    successTitle: isZh ? '提交成功！' : 'Request Received!',
    successBody: isZh ? '我们会在 2 个工作小时内与您联系。如需加急，请直接来电。' : 'We\'ll contact you within 2 business hours. Need immediate help?',
    nameLabel: isZh ? '您的姓名' : 'Your Name',
    phoneLabel: isZh ? '联系电话' : 'Phone Number',
    coverageLabel: isZh ? '保险类型' : 'Coverage Type',
    selectCoverage: isZh ? '请选择保险类型...' : 'Select coverage type...',
    sending: isZh ? '发送中...' : 'Sending...',
    error: isZh ? '提交失败，请重试或直接' : 'Something went wrong — please ',
    callDirectly: isZh ? '拨打电话联系我们' : 'call us directly',
    noSpam: isZh ? '我们仅用于报价联系，不发送垃圾信息。' : 'No spam, ever.',
  };
  const resolvedHeadline = headline || copy.headline;
  const resolvedSubline = subline || copy.subline;
  const resolvedResponsePromise = responsePromise || copy.responsePromise;
  const resolvedSubmitLabel = submitLabel || copy.submitLabel;

  const [form, setForm] = useState({ name: '', phone: '', coverageType: coverageType || '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const lines = insuranceLines.length > 0
    ? insuranceLines.filter(l => l.is_enabled !== false)
    : COVERAGE_OPTIONS.map(c => ({
        line_slug: c.slug,
        name: isZh ? (COVERAGE_NAMES_ZH[c.slug] || c.name) : c.name,
      }));

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
            {resolvedHeadline}
          </h2>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 36px' }}>{resolvedSubline}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link href={ctaPrimary?.href || `/${locale}/quote`}
              className="btn btn-primary btn-lg"
              style={{ background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 36px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-600)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold-500)')}>
              {ctaPrimary?.label || copy.primaryCta}
            </Link>
            {phone && (
              <a href={phoneHref}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.4)', borderRadius: 10, padding: '16px 36px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.12)'; (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.4)'; }}>
                <Phone className="w-4 h-4" />
                {ctaSecondary?.label || `${copy.callPrefix} ${phone}`}
              </a>
            )}
          </div>
          {(note || responsePromise) && (
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.875rem', marginTop: 24 }}>{note || resolvedResponsePromise}</p>
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
              {copy.bandLabel}
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(1.8rem,3vw,2.5rem)', marginBottom: 16, lineHeight: 1.15 }}>
              {resolvedHeadline}
            </h2>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 28 }}>{resolvedSubline}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {copy.bullets.map(point => (
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
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 12 }}>{copy.successTitle}</h3>
                <p style={{ color: 'rgba(255,255,255,.7)', lineHeight: 1.6, marginBottom: 20 }}>
                  {copy.successBody}
                </p>
                <a href={phoneHref} style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '1.1rem' }}>{phone}</a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'rgba(255,255,255,.8)', marginBottom: 6 }}>
                    <span>{copy.nameLabel}</span>
                    <span style={{ color: 'var(--red-500)', marginLeft: 4 }}>*</span>
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
                    <span>{copy.phoneLabel}</span>
                    <span style={{ color: 'var(--red-500)', marginLeft: 4 }}>*</span>
                  </label>
                  <input
                    type="tel" required placeholder="(718) 799-0472"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: '.9375rem', outline: 'none' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold-500)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'rgba(255,255,255,.8)', marginBottom: 6 }}>
                    {copy.coverageLabel}
                  </label>
                  <select
                    value={form.coverageType} onChange={e => setForm(f => ({ ...f, coverageType: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: '.9375rem', outline: 'none', appearance: 'none' }}
                  >
                    <option value="" style={{ background: 'var(--navy-800)' }}>{copy.selectCoverage}</option>
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
                  {status === 'loading' ? copy.sending : resolvedSubmitLabel}
                </button>
                {status === 'error' && (
                  <p style={{ color: 'var(--red-500)', fontSize: '.875rem', textAlign: 'center' }}>
                    {copy.error}<a href={phoneHref} style={{ color: 'var(--gold-400)', fontWeight: 700 }}>{copy.callDirectly}</a>.
                  </p>
                )}
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.8rem', textAlign: 'center' }}>
                  {resolvedResponsePromise} · {copy.noSpam}
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
