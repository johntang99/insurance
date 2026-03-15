import { Phone, Clock, Shield, Star, CheckCircle } from 'lucide-react';

interface TrustPoint { icon: string; text: string; }

interface QuoteTrustPanelProps {
  headline?: string;
  points?: TrustPoint[];
  phone?: string;
  phoneHref?: string;
  phoneLabel?: string;
  responsePromise?: string;
  googleRating?: number;
  googleReviewCount?: number;
  googleReviewUrl?: string;
  licenseText?: string;
}

const DEFAULT_POINTS: TrustPoint[] = [
  { icon: 'clock',  text: 'We respond within 2 business hours' },
  { icon: 'shield', text: 'No obligation — 100% free quote' },
  { icon: 'store',  text: '30+ carriers compared for you' },
  { icon: 'star',   text: '4.9★ rated — 312 Google reviews' },
];

const ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  clock: Clock, shield: Shield, star: Star, default: CheckCircle,
};

export default function QuoteTrustPanel({
  headline = 'Why Get a Quote From Us?',
  points = DEFAULT_POINTS,
  phone = ("(718) 799-0472"),
  phoneHref = 'tel:+17187990472',
  phoneLabel = 'Prefer to call?',
  responsePromise = 'We respond to all quote requests within 2 business hours.',
  googleRating,
  googleReviewCount,
  googleReviewUrl,
  licenseText,
}: QuoteTrustPanelProps) {
  return (
    <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Trust points card */}
      <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '28px 24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 20, fontSize: '1.1rem' }}>
          {headline}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {points.map((pt, i) => {
            const Icon = ICONS[pt.icon] || ICONS.default;
            return (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--navy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--gold-500)' }} />
                </div>
                <p style={{ fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{pt.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google rating */}
      {googleRating && (
        <a href={googleReviewUrl || '#'} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', textDecoration: 'none', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
              <span style={{ color: 'var(--gold-500)', letterSpacing: 1 }}>★★★★★</span>
              <span style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text-primary)' }}>{googleRating}</span>
            </div>
            <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>
              {googleReviewCount ? `${googleReviewCount} Google reviews` : 'Google reviews'}
            </div>
          </div>
        </a>
      )}

      {/* Phone callout */}
      <div style={{ background: 'var(--navy-800)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>
          {phoneLabel}
        </p>
        <a href={phoneHref} style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-400)', marginBottom: 4, textDecoration: 'none' }}>
          {phone}
        </a>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '.78rem', color: 'rgba(255,255,255,.55)' }}>
          <Clock className="w-3 h-3" />
          Mon–Sat 9am–6pm
        </div>
      </div>

      {/* Response promise */}
      {responsePromise && (
        <div style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {responsePromise}
        </div>
      )}

      {/* License */}
      {licenseText && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Shield className="w-3.5 h-3.5" style={{ color: 'var(--green-500)', flexShrink: 0 }} />
          <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{licenseText}</span>
        </div>
      )}
    </div>
  );
}
