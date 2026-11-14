import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { CreditCard, ExternalLink, Phone, Repeat, AlertCircle } from 'lucide-react';

interface PageProps { params: { locale: Locale } }

const DEFAULT_PAYMENT_URL = 'https://seppay.com/s/al?a=edEVTTg4vqICjc%2F%2FX1UTQA';
const DEFAULT_QR_IMAGE = '/uploads/peerless-brokerage/payment/payment-qr.png';

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'payment',
    title: isZh ? `在线付款 | ${siteName}` : `Make a Payment | ${siteName}`,
    description: isZh
      ? `通过电子支票、信用卡或 Zelle 向 ${siteName} 支付保费。付款前请先致电确认金额。`
      : `Pay your insurance premium to ${siteName} online by E-Check or credit card, or with Zelle. Please call to confirm your payment amount first.`,
  });
}

const telHref = (n: string) => `tel:+1${n.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')}`;

export default async function PaymentPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('payment', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || '(718) 799-0472';
  const phoneHref = si?.phone ? telHref(si.phone) : 'tel:+17187990472';

  const hero = content?.hero || {};
  const online = content?.online || {};
  const zelle = content?.zelle || {};
  const recurring = content?.recurring || {};
  const terms = content?.terms || {};

  const paymentUrl: string = online.paymentUrl || DEFAULT_PAYMENT_URL;
  const qrImage: string = online.qrImage || DEFAULT_QR_IMAGE;
  const methods: string[] = online.methods || ['E-Check', 'Visa', 'MasterCard', 'American Express', 'Discover'];
  const recurringPhones: Array<{ label: string; number: string }> = recurring.phones || [
    { label: isZh ? '皇后区' : 'Queens', number: '718-799-0472' },
  ];
  const termItems: string[] = terms.items || [];
  const hasZelle = Boolean(zelle.recipient);

  const ui = {
    title: isZh ? '在线付款' : 'Make a Payment',
    subline: isZh ? '付款前，请先致电确认付款金额。' : 'Please call us to confirm your payment amount before you pay.',
    confirmCall: isZh ? '致电确认金额' : 'Call to Confirm Amount',
    onlineHeadline: isZh ? '网上付款' : 'Pay Online',
    payNow: isZh ? '立即付款' : 'Pay Now',
    secureNote: isZh ? '将跳转至安全的第三方付款页面' : 'Opens our secure third-party payment portal',
    scanCaption: isZh ? '用手机扫描二维码付款' : 'Scan with your phone to pay',
    qrAlt: isZh ? '付款二维码' : 'Payment QR code',
    zelleHeadline: isZh ? 'Zelle 付款' : 'Pay with Zelle',
    sendTo: isZh ? '收款账户' : 'Send to',
    recipientName: isZh ? '收款人名称' : 'Recipient name',
    callForZelle: isZh ? '致电获取 Zelle 信息' : 'Call for Zelle Details',
    recurringHeadline: isZh ? '定期自动付款' : 'Recurring Payments',
    termsHeadline: isZh ? '付款条款与说明' : 'Payment Terms & Conditions',
  };

  const card: React.CSSProperties = {
    background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
    padding: '32px 28px', boxShadow: '0 4px 20px rgba(15,23,42,.05)',
  };
  const h2: React.CSSProperties = { fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 12 };
  const body: React.CSSProperties = { color: 'var(--text-secondary)', fontSize: '.9375rem', lineHeight: 1.7, margin: 0 };

  return (
    <main>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <CreditCard className="w-12 h-12 mx-auto" style={{ color: 'var(--gold-400)', marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 12 }}>
            {hero.headline || ui.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 24px', lineHeight: 1.65 }}>
            {hero.subline || ui.subline}
          </p>
          <a href={phoneHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold-500)', color: '#fff', borderRadius: 10, padding: '12px 22px', fontWeight: 700, textDecoration: 'none' }}>
            <Phone className="w-4 h-4" /> {ui.confirmCall}: {phone}
          </a>
        </div>
      </section>

      {/* ── PAYMENT METHODS ─────────────────────────────────────── */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            {/* Online payment */}
            <div style={card}>
              <h2 style={h2}>{online.headline || ui.onlineHeadline}</h2>
              <p style={{ ...body, marginBottom: 16 }}>{online.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {methods.map((m) => (
                  <span key={m} style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', color: 'var(--navy-700)', borderRadius: 100, padding: '4px 12px', fontSize: '.8rem', fontWeight: 600 }}>
                    {m}
                  </span>
                ))}
              </div>
              {online.feeNote && (
                <p style={{ fontSize: '.85rem', color: 'var(--gold-600)', fontWeight: 600, marginBottom: 24 }}>{online.feeNote}</p>
              )}

              <a href={paymentUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--navy-800)', color: '#fff', borderRadius: 10, padding: '14px 24px', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}>
                {online.buttonLabel || ui.payNow} <ExternalLink className="w-4 h-4" />
              </a>
              <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--text-muted)', margin: '8px 0 28px' }}>{ui.secureNote}</p>

              <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                <a href={paymentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrImage} alt={ui.qrAlt} width={200} height={200}
                    style={{ width: 200, height: 200, borderRadius: 12, border: '1px solid var(--border)', background: '#fff' }} />
                </a>
                <p style={{ fontSize: '.85rem', color: 'var(--text-secondary)', marginTop: 10 }}>{online.qrCaption || ui.scanCaption}</p>
              </div>
            </div>

            <div className="grid gap-8">
              {/* Zelle */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ background: '#6D1ED4', color: '#fff', fontWeight: 800, fontSize: '.8rem', borderRadius: 6, padding: '3px 8px', letterSpacing: '.02em' }}>Zelle</span>
                  <h2 style={{ ...h2, marginBottom: 0 }}>{zelle.headline || ui.zelleHeadline}</h2>
                </div>
                <p style={{ ...body, marginBottom: 16 }}>{zelle.description}</p>
                {hasZelle ? (
                  <div style={{ background: 'var(--navy-50)', borderRadius: 10, padding: '16px 18px' }}>
                    <p style={{ margin: 0, fontSize: '.85rem', color: 'var(--text-muted)' }}>{ui.sendTo}</p>
                    <p style={{ margin: '2px 0 10px', fontWeight: 700, color: 'var(--navy-800)', fontSize: '1.05rem', wordBreak: 'break-all' }}>{zelle.recipient}</p>
                    {zelle.recipientName && (
                      <>
                        <p style={{ margin: 0, fontSize: '.85rem', color: 'var(--text-muted)' }}>{ui.recipientName}</p>
                        <p style={{ margin: '2px 0 10px', fontWeight: 600, color: 'var(--navy-800)' }}>{zelle.recipientName}</p>
                      </>
                    )}
                    {zelle.memoNote && <p style={{ margin: 0, fontSize: '.85rem', color: 'var(--text-secondary)' }}>{zelle.memoNote}</p>}
                  </div>
                ) : (
                  <div style={{ background: 'var(--navy-50)', borderRadius: 10, padding: '16px 18px' }}>
                    <p style={{ margin: '0 0 12px', fontSize: '.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{zelle.comingSoon}</p>
                    <a href={phoneHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--gold-600)', fontWeight: 700, textDecoration: 'none' }}>
                      <Phone className="w-4 h-4" /> {ui.callForZelle}: {phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Recurring */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Repeat className="w-5 h-5" style={{ color: 'var(--gold-500)' }} />
                  <h2 style={{ ...h2, marginBottom: 0, fontSize: '1.35rem' }}>{recurring.headline || ui.recurringHeadline}</h2>
                </div>
                <p style={{ ...body, marginBottom: 16 }}>{recurring.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {recurringPhones.map((p) => (
                    <a key={p.number} href={telHref(p.number)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', color: 'var(--navy-800)', fontWeight: 600, textDecoration: 'none', fontSize: '.9rem' }}>
                      <Phone className="w-4 h-4" style={{ color: 'var(--gold-500)' }} /> {p.label}: {p.number}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TERMS ───────────────────────────────────────────────── */}
      {termItems.length > 0 && (
        <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
          <div className="container-custom" style={{ maxWidth: 820 }}>
            <h2 style={{ ...h2, marginBottom: 24, textAlign: 'center' }}>{terms.headline || ui.termsHeadline}</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {termItems.map((t, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold-500)', marginTop: 2 }} />
                  <span style={body}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
