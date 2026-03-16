'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Phone, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { INSURANCE_LINE_META, getLineName, getLineIcon, css } from '@/lib/insurance/theme';

interface InsuranceLine {
  line_slug: string;
  name?: string | null;
  is_enabled?: boolean;
  sort_order?: number;
}

interface QuoteFormProps {
  insuranceLines: InsuranceLine[];
  phone?: string;
  phoneHref?: string;
  locale?: string;
  coverageTypes?: Array<{ slug: string; label: string; icon: string }>;
}

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1
  coverageTypes: string[];
  // Step 2
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  bestTime: string;
  language: string;
  // Step 3
  currentInsurer: string;
  vehicleCount: string;
  hasIncidents: string;
  tlcLicenseNumber: string;
  tlcRenewalDate: string;
  propertyAddress: string;
  yearBuilt: string;
  currentlyInsured: string;
  businessType: string;
  employeeCount: string;
  annualRevenue: string;
  message: string;
  referralSource: string;
  agentId: string;
}

const INITIAL: FormData = {
  coverageTypes: [], firstName: '', lastName: '', phone: '', email: '',
  bestTime: '', language: 'English',
  currentInsurer: '', vehicleCount: '', hasIncidents: '',
  tlcLicenseNumber: '', tlcRenewalDate: '',
  propertyAddress: '', yearBuilt: '', currentlyInsured: '',
  businessType: '', employeeCount: '', annualRevenue: '',
  message: '', referralSource: '', agentId: '',
};

const SITUATION_PRESETS: Record<string, string[]> = {
  'new-homeowner':   ['homeowner', 'auto'],
  'new-car':         ['auto'],
  'business-owner':  ['business', 'workers-comp'],
  'tlc-driver':      ['tlc'],
  'other':           [],
};

export default function QuoteForm({ insuranceLines, phone = ("(718) 799-0472"), phoneHref = 'tel:+17187990472', locale = 'en', coverageTypes: ctProp }: QuoteFormProps) {
  const isZh = locale === 'zh';
  const t = {
    stepLabel: isZh ? ['险种', '联系信息', '补充信息'] : ['Coverage', 'Contact', 'Details'],
    quoteReceived: isZh ? '已收到您的报价申请！' : 'Quote Request Received!',
    thanks: isZh ? `感谢您，` : `Thank you, `,
    contactSoon: isZh ? '我们将在 2 个工作小时内联系您。' : 'We\'ll contact you within 2 business hours.',
    coverageRequested: isZh ? '申请险种：' : 'Coverage requested:',
    nextTitle: isZh ? '后续流程' : 'What Happens Next',
    nextItems: isZh
      ? ['评估您的保障需求', '比较 30+ 保险公司费率', '电话或邮件回复您的方案']
      : ['We review your coverage needs', 'We shop 30+ carriers for your best rates', 'We call or email you with your options'],
    browseCoverage: isZh ? '浏览保险类别' : 'Browse Our Coverage',
    backHome: isZh ? '返回首页' : 'Return to Home',
    formError: isZh ? '提交失败，请重试，或' : 'Something went wrong — please try again or ',
    callUsAt: isZh ? '直接致电' : 'call us at',
    q1Title: isZh ? '您想办理哪些保险？' : 'What coverage are you looking for?',
    q1Sub: isZh ? '可多选，我们将统一比较方案。' : 'Select all that apply — we\'ll find your best rates for everything.',
    hide: isZh ? '▲ 收起' : '▲ Hide',
    notSure: isZh ? '▼ 不确定怎么选？' : '▼ Not sure what you need?',
    tellSituation: isZh ? '告诉我们您的情况：' : 'Tell us your situation:',
    nextContact: isZh ? '下一步：填写联系信息' : 'Next: Your Contact Info',
    selectOne: isZh ? '请至少选择一个险种后继续' : 'Select at least one coverage type to continue',
    q2Title: isZh ? '我们如何联系您？' : 'How should we reach you?',
    q2Sub: isZh ? '我们仅会就报价与您联系，不发送垃圾信息。' : 'We\'ll only contact you about your quote — no spam, ever.',
    firstName: isZh ? '名字' : 'First Name',
    lastName: isZh ? '姓氏' : 'Last Name',
    required: isZh ? '必填' : 'Required',
    phone: isZh ? '联系电话' : 'Phone Number',
    email: isZh ? '电子邮箱' : 'Email Address',
    invalidPhone: isZh ? '请输入有效的 10 位电话号码' : 'Enter a valid 10-digit phone number',
    invalidEmail: isZh ? '请输入有效邮箱地址' : 'Enter a valid email address',
    bestTime: isZh ? '方便联系时间' : 'Best Time to Contact',
    timeOptions: isZh ? ['上午 (8:00-12:00)', '下午 (12:00-17:00)', '晚上 (17:00-20:00)', '任意时间'] : ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–8pm)', 'Anytime'],
    back: isZh ? '返回' : 'Back',
    nextDetails: isZh ? '下一步：补充信息' : 'Next: Additional Details',
    q3Title: isZh ? '补充信息' : 'A few more details',
    optional: isZh ? '选填' : '(optional)',
    q3Sub: isZh ? '这些信息可帮助我们提供更准确报价。' : 'This helps us prepare a more accurate quote — skip anything you\'re not sure about.',
    submit: isZh ? '提交报价申请' : 'Submit My Quote Request',
    submitting: isZh ? '提交中...' : 'Submitting...',
  };
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({ ...INITIAL, agentId: searchParams.get('agent') || '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showSituation, setShowSituation] = useState(false);

  // Pre-select from URL ?type= param
  useEffect(() => {
    const type = searchParams.get('type');
    if (type && !form.coverageTypes.includes(type)) {
      setForm(f => ({ ...f, coverageTypes: [type] }));
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const lines = insuranceLines.length > 0
    ? insuranceLines.filter(l => l.is_enabled !== false)
    : Object.keys(INSURANCE_LINE_META).map(slug => ({ line_slug: slug, name: undefined }));

  const toggleCoverage = (slug: string) => {
    setForm(f => ({
      ...f,
      coverageTypes: f.coverageTypes.includes(slug)
        ? f.coverageTypes.filter(s => s !== slug)
        : [...f.coverageTypes, slug],
    }));
  };

  const hasAuto = form.coverageTypes.some(s => ['auto', 'commercial-auto'].includes(s));
  const hasTLC  = form.coverageTypes.includes('tlc');
  const hasHome = form.coverageTypes.includes('homeowner');
  const hasBiz  = form.coverageTypes.some(s => ['business', 'workers-comp', 'construction'].includes(s));

  const validateStep2 = useCallback((): boolean => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = isZh ? '请填写名字' : 'First name is required';
    if (!form.lastName.trim())  e.lastName  = isZh ? '请填写姓氏' : 'Last name is required';
    const digitsOnly = form.phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) e.phone = isZh ? '请输入有效的 10 位电话号码' : 'Enter a valid 10-digit phone number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = isZh ? '请输入有效邮箱地址' : 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, isZh]);

  const formatPhone = (raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, 10);
    if (d.length <= 3)  return d;
    if (d.length <= 6)  return `(${d.slice(0,3)}) ${d.slice(3)}`;
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  };

  const handleSubmit = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName:  form.lastName,
          phone:     form.phone,
          email:     form.email,
          coverageTypes:     form.coverageTypes,
          preferredLanguage: form.language,
          bestContactTime:   form.bestTime,
          details: {
            currentInsurer:  form.currentInsurer,
            vehicleCount:    form.vehicleCount,
            hasIncidents:    form.hasIncidents,
            tlcLicenseNumber: form.tlcLicenseNumber,
            tlcRenewalDate:  form.tlcRenewalDate,
            propertyAddress: form.propertyAddress,
            yearBuilt:       form.yearBuilt,
            currentlyInsured: form.currentlyInsured,
            businessType:    form.businessType,
            employeeCount:   form.employeeCount,
            annualRevenue:   form.annualRevenue,
            message:         form.message,
            referralSource:  form.referralSource,
          },
          source:  'quote_page',
          agentId: form.agentId || undefined,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const stepLabel = t.stepLabel;
  const progress  = step === 1 ? 33 : step === 2 ? 66 : 100;

  // ── SUCCESS STATE ────────────────────────────────────────
  if (status === 'success') {
    return (
      <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-xl)', padding: '48px 40px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }} className="animate-scale-in">
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-100)', border: '3px solid var(--green-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle className="w-8 h-8" style={{ color: 'var(--green-500)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: 12 }}>
          {t.quoteReceived}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 8 }}>
          {t.thanks}<strong>{form.firstName}</strong>! {t.contactSoon}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: 4 }}>
          {form.phone && <>We&apos;ll reach you at <strong>{form.phone}</strong></>}
          {form.email && <> · {form.email}</>}
        </p>
        {form.coverageTypes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '16px 0 28px' }}>
            <span style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>{t.coverageRequested}</span>
            {form.coverageTypes.map(s => (
              <span key={s} className="badge badge-navy">{getLineName(s)}</span>
            ))}
          </div>
        )}

        {/* What happens next */}
        <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 32, textAlign: 'left' }}>
          <p style={{ fontWeight: 700, color: 'var(--navy-800)', marginBottom: 14, fontFamily: 'var(--font-heading)' }}>{t.nextTitle}</p>
          {t.nextItems.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gold-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href={`/${locale}/insurance`} className="btn-navy" style={{ padding: '12px 24px', fontSize: '.9rem' }}>
            {t.browseCoverage}
          </Link>
          <Link href={`/${locale}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gold-600)', fontWeight: 600, fontSize: '.9rem' }}>
            {t.backHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
      {/* Progress bar */}
      <div style={{ background: 'var(--navy-800)', padding: '20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
          {/* Progress line */}
          <div style={{ position: 'absolute', top: '50%', left: 16, right: 16, height: 2, background: 'rgba(255,255,255,.2)', transform: 'translateY(-50%)', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '50%', left: 16, height: 2, background: 'var(--gold-500)', transform: 'translateY(-50%)', zIndex: 1, width: `calc(${progress}% - 32px)`, transition: 'width .4s ease' }} />

          {[1, 2, 3].map((s, i) => {
            const done = step > s;
            const active = step === s;
            return (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: i === 0 ? 'flex-start' : i === 2 ? 'flex-end' : 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: done ? 'var(--gold-500)' : active ? 'var(--navy-800)' : 'rgba(255,255,255,.15)',
                  border: done ? '2px solid var(--gold-500)' : active ? '2px solid var(--gold-400)' : '2px solid rgba(255,255,255,.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.8rem', fontWeight: 700, color: '#fff',
                  transition: 'all .3s',
                }}>
                  {done ? '✓' : s}
                </div>
                <span style={{ fontSize: '.7rem', color: active ? 'var(--gold-300)' : 'rgba(255,255,255,.5)', marginTop: 4, fontWeight: active ? 600 : 400 }}>
                  {stepLabel[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error banner */}
      {status === 'error' && (
        <div style={{ background: 'var(--red-100)', border: '1px solid var(--red-500)', borderRadius: 8, margin: '16px 32px 0', padding: '12px 16px', fontSize: '.9rem', color: 'var(--red-600)' }}>
          {t.formError}<a href={phoneHref} style={{ color: 'var(--red-600)', fontWeight: 700 }}>{t.callUsAt} {phone}</a>.
        </div>
      )}

      <div style={{ padding: '32px' }}>

        {/* ── STEP 1: COVERAGE ──────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: 'clamp(1.3rem,2.5vw,1.75rem)', marginBottom: 8 }}>
              {t.q1Title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9375rem', marginBottom: 24 }}>
              {t.q1Sub}
            </p>

            {/* Coverage tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 20 }} className="grid-2col-mobile">
              {lines.map(l => {
                const slug = l.line_slug;
                const selected = form.coverageTypes.includes(slug);
                const icon = getLineIcon(slug);
                const name = l.name || getLineName(slug);
                const desc = INSURANCE_LINE_META[slug]?.description || '';
                return (
                  <button key={slug} type="button" onClick={() => toggleCoverage(slug)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                      border: selected ? '2px solid var(--navy-800)' : '1.5px solid var(--border)',
                      borderRadius: 'var(--radius)', background: selected ? 'var(--navy-50)' : 'var(--bg-white)',
                      textAlign: 'left', cursor: 'pointer', transition: 'all .15s',
                      position: 'relative',
                    }}>
                    <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '.875rem', color: selected ? 'var(--navy-800)' : 'var(--text-primary)', marginBottom: 2 }}>{name}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{desc}</div>
                    </div>
                    {selected && (
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontSize: '.7rem', fontWeight: 700 }}>✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Situation helper */}
            <button type="button" onClick={() => setShowSituation(s => !s)}
              style={{ fontSize: '.85rem', color: 'var(--gold-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: showSituation ? 12 : 24 }}>
              {showSituation ? t.hide : t.notSure}
            </button>
            {showSituation && (
              <div style={{ background: 'var(--gold-100)', border: '1px solid var(--gold-300)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: 20 }}>
                <p style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--gold-600)', marginBottom: 10 }}>{t.tellSituation}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { key: 'new-homeowner', label: isZh ? '我是新房主' : 'I\'m a new homeowner' },
                    { key: 'new-car', label: isZh ? '我刚买新车' : 'I just got a new car' },
                    { key: 'business-owner', label: isZh ? '我经营企业' : 'I run a business' },
                    { key: 'tlc-driver', label: isZh ? '我是 TLC 司机' : 'I\'m a TLC driver' },
                    { key: 'other', label: isZh ? '其他' : 'Other' },
                  ].map(({ key, label }) => (
                    <button key={key} type="button"
                      onClick={() => {
                        const preset = SITUATION_PRESETS[key] || [];
                        setForm(f => ({ ...f, coverageTypes: [...new Set([...f.coverageTypes, ...preset])] }));
                        setShowSituation(false);
                      }}
                      style={{ padding: '6px 14px', border: '1px solid var(--gold-400)', borderRadius: 100, background: 'var(--bg-white)', color: 'var(--gold-600)', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={form.coverageTypes.length === 0}
              className="btn-gold"
              style={{ width: '100%', opacity: form.coverageTypes.length === 0 ? .5 : 1, cursor: form.coverageTypes.length === 0 ? 'not-allowed' : 'pointer' }}>
              {t.nextContact} <ChevronRight className="w-4 h-4" />
            </button>
            {form.coverageTypes.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: '.82rem', color: 'var(--text-muted)', marginTop: 8 }}>{t.selectOne}</p>
            )}
          </div>
        )}

        {/* ── STEP 2: CONTACT ───────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: 'clamp(1.3rem,2.5vw,1.75rem)', marginBottom: 8 }}>
              {t.q2Title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9375rem', marginBottom: 24 }}>
              {t.q2Sub}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="grid-1col-mobile">
              <div>
                <label className="form-label" style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.firstName} <span style={{ color: 'var(--red-500)' }}>*</span>
                </label>
                <input className="form-input" type="text" autoFocus placeholder="John"
                  value={form.firstName}
                  onChange={e => { setForm(f => ({ ...f, firstName: e.target.value })); if (errors.firstName) setErrors(e2 => ({ ...e2, firstName: '' })); }}
                  onBlur={() => { if (!form.firstName.trim()) setErrors(e => ({ ...e, firstName: t.required })); }}
                />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>
              <div>
                <label className="form-label" style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.lastName} <span style={{ color: 'var(--red-500)' }}>*</span>
                </label>
                <input className="form-input" type="text" placeholder="Smith"
                  value={form.lastName}
                  onChange={e => { setForm(f => ({ ...f, lastName: e.target.value })); if (errors.lastName) setErrors(e2 => ({ ...e2, lastName: '' })); }}
                  onBlur={() => { if (!form.lastName.trim()) setErrors(e => ({ ...e, lastName: t.required })); }}
                />
                {errors.lastName && <span className="form-error">{errors.lastName}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="grid-1col-mobile">
              <div>
                <label className="form-label" style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.phone} <span style={{ color: 'var(--red-500)' }}>*</span>
                </label>
                <input className="form-input" type="tel" placeholder="(718) 799-0472"
                  value={form.phone}
                  onChange={e => { setForm(f => ({ ...f, phone: formatPhone(e.target.value) })); if (errors.phone) setErrors(e2 => ({ ...e2, phone: '' })); }}
                  onBlur={() => { if (form.phone.replace(/\D/g, '').length < 10) setErrors(e => ({ ...e, phone: t.invalidPhone })); }}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              <div>
                <label className="form-label" style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.email} <span style={{ color: 'var(--red-500)' }}>*</span>
                </label>
                <input className="form-input" type="email" placeholder="john@email.com"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); if (errors.email) setErrors(e2 => ({ ...e2, email: '' })); }}
                  onBlur={() => { if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) setErrors(e => ({ ...e, email: t.invalidEmail })); }}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            {/* Best time — radio group */}
            <div style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                {t.bestTime}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }} className="grid-2col-mobile">
                {t.timeOptions.map(timeOpt => (
                  <button key={timeOpt} type="button"
                    onClick={() => setForm(f => ({ ...f, bestTime: timeOpt }))}
                    style={{
                      padding: '10px 8px', border: form.bestTime === timeOpt ? '2px solid var(--navy-800)' : '1.5px solid var(--border)',
                      borderRadius: 8, background: form.bestTime === timeOpt ? 'var(--navy-50)' : 'var(--bg-white)',
                      fontSize: '.78rem', fontWeight: form.bestTime === timeOpt ? 700 : 400,
                      color: form.bestTime === timeOpt ? 'var(--navy-800)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all .15s', textAlign: 'center',
                    }}>
                    {timeOpt}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="button" onClick={() => setStep(1)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 20px', fontWeight: 600, fontSize: '.9375rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <ChevronLeft className="w-4 h-4" /> {t.back}
              </button>
              <button type="button" onClick={() => { if (validateStep2()) setStep(3); }}
                className="btn-gold" style={{ flex: 1 }}>
                {t.nextDetails} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: DETAILS ───────────────────────────────── */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: 'clamp(1.3rem,2.5vw,1.75rem)', marginBottom: 8 }}>
              {t.q3Title} <span style={{ fontSize: '.6em', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>{t.optional}</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9375rem', marginBottom: 24 }}>
              {t.q3Sub}
            </p>

            {/* Auto section */}
            {hasAuto && (
              <div style={{ marginBottom: 24, padding: 20, background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 700, color: 'var(--navy-800)', marginBottom: 14, fontSize: '.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  🚗 {isZh ? '车辆信息' : 'Auto / Vehicle Details'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="grid-1col-mobile">
                  <div>
                    <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{isZh ? '当前保险公司' : 'Current Insurance Provider'}</label>
                    <input className="form-input" type="text" placeholder={isZh ? '例如：Geico、State Farm' : 'e.g. Geico, State Farm'} value={form.currentInsurer} onChange={e => setForm(f => ({ ...f, currentInsurer: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{isZh ? '车辆数量' : 'Number of Vehicles'}</label>
                    <select className="form-select" value={form.vehicleCount} onChange={e => setForm(f => ({ ...f, vehicleCount: e.target.value }))}>
                      <option value="">{isZh ? '请选择...' : 'Select...'}</option>
                      {['1', '2', '3', '4', '5+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{isZh ? '近期是否有事故或违章？' : 'Any recent accidents or violations?'}</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {(isZh ? ['否', '是'] : ['No', 'Yes']).map(v => (
                      <button key={v} type="button" onClick={() => setForm(f => ({ ...f, hasIncidents: v }))}
                        style={{ padding: '8px 20px', border: form.hasIncidents === v ? '2px solid var(--navy-800)' : '1.5px solid var(--border)', borderRadius: 8, background: form.hasIncidents === v ? 'var(--navy-50)' : 'var(--bg-white)', fontWeight: form.hasIncidents === v ? 700 : 400, fontSize: '.875rem', cursor: 'pointer' }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TLC section */}
            {hasTLC && (
              <div style={{ marginBottom: 24, padding: 20, background: 'var(--gold-100)', borderRadius: 'var(--radius)', border: '1px solid var(--gold-300)' }}>
                <p style={{ fontWeight: 700, color: 'var(--gold-600)', marginBottom: 14, fontSize: '.9rem' }}>🚕 {isZh ? 'TLC 营运信息' : 'TLC / Livery Details'}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="grid-1col-mobile">
                  <div>
                    <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{isZh ? 'TLC 证件号' : 'TLC License Number'}</label>
                    <input className="form-input" type="text" placeholder={isZh ? '选填' : 'Optional'} value={form.tlcLicenseNumber} onChange={e => setForm(f => ({ ...f, tlcLicenseNumber: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{isZh ? '牌照续期日期' : 'Plate Renewal Due Date'}</label>
                    <input className="form-input" type="date" value={form.tlcRenewalDate} onChange={e => setForm(f => ({ ...f, tlcRenewalDate: e.target.value }))} />
                  </div>
                </div>
              </div>
            )}

            {/* Homeowner section */}
            {hasHome && (
              <div style={{ marginBottom: 24, padding: 20, background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 700, color: 'var(--navy-800)', marginBottom: 14, fontSize: '.9rem' }}>🏠 {isZh ? '房产信息' : 'Property Details'}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="grid-1col-mobile">
                  <div>
                    <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{isZh ? '房产城市 / 邮编' : 'Property City / ZIP'}</label>
                    <input className="form-input" type="text" placeholder={isZh ? '例如：Flushing, NY 11355' : 'e.g. Flushing, NY 11201'} value={form.propertyAddress} onChange={e => setForm(f => ({ ...f, propertyAddress: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{isZh ? '建造年份（约）' : 'Year Built (approx.)'}</label>
                    <input className="form-input" type="text" placeholder={isZh ? '例如：1985' : 'e.g. 1985'} value={form.yearBuilt} onChange={e => setForm(f => ({ ...f, yearBuilt: e.target.value }))} />
                  </div>
                </div>
              </div>
            )}

            {/* Business section */}
            {hasBiz && (
              <div style={{ marginBottom: 24, padding: 20, background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 700, color: 'var(--navy-800)', marginBottom: 14, fontSize: '.9rem' }}>💼 {isZh ? '企业信息' : 'Business Details'}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="grid-1col-mobile">
                  <div>
                    <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{isZh ? '企业类型 / 行业' : 'Business Type / Industry'}</label>
                    <input className="form-input" type="text" placeholder={isZh ? '例如：餐饮、建筑承包' : 'e.g. restaurant, contractor'} value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{isZh ? '员工人数' : 'Number of Employees'}</label>
                    <select className="form-select" value={form.employeeCount} onChange={e => setForm(f => ({ ...f, employeeCount: e.target.value }))}>
                      <option value="">{isZh ? '请选择...' : 'Select...'}</option>
                      {['1–5', '6–20', '21–50', '51–100', '100+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{isZh ? '年营业额（约）' : 'Annual Revenue (approx.)'}</label>
                  <select className="form-select" value={form.annualRevenue} onChange={e => setForm(f => ({ ...f, annualRevenue: e.target.value }))}>
                    <option value="">{isZh ? '暂不填写' : 'Prefer not to say'}</option>
                    {(isZh ? ['低于 $100K', '$100K-$500K', '$500K-$2M', '高于 $2M'] : ['Under $100K', '$100K–$500K', '$500K–$2M', 'Over $2M']).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Message + referral */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{isZh ? '补充留言（选填）' : 'Message or Questions (optional)'}</label>
              <textarea className="form-textarea" rows={3} placeholder={isZh ? '还有哪些信息需要我们了解？' : 'Anything else we should know...'}
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{isZh ? '您通过什么渠道了解到我们？' : 'How did you hear about us?'}</label>
              <select className="form-select" value={form.referralSource} onChange={e => setForm(f => ({ ...f, referralSource: e.target.value }))}>
                <option value="">{isZh ? '请选择...' : 'Select...'}</option>
                {(isZh
                  ? ['Google 搜索', 'Google 地图', '亲友推荐', '社交媒体', '老客户推荐', '其他']
                  : ['Google Search', 'Google Maps', 'Referral from friend/family', 'Social Media', 'Existing Client', 'Other']).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={() => setStep(2)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 20px', fontWeight: 600, fontSize: '.9375rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <ChevronLeft className="w-4 h-4" /> {t.back}
              </button>
              <button type="button" onClick={handleSubmit} disabled={status === 'loading'}
                className="btn-gold" style={{ flex: 1, opacity: status === 'loading' ? .7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
                {status === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t.submitting}</>
                ) : (
                  <>{t.submit} <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
