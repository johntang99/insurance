'use client';

interface CarrierLogoCarouselProps {
  headline?: string;
  subline?: string;
  carriers?: Array<{ name: string; slug: string; logo_url?: string }>;
  variant?: 'auto-scroll' | 'static-grid';
}

const FALLBACK_CARRIERS = [
  'Travelers', 'Progressive', 'Nationwide', 'Liberty Mutual', 'The Hartford',
  'Chubb', 'Employers', 'AmTrust', 'Hiscox', 'Foremost',
  'National General', 'Mercury', 'Bristol West', 'Dairyland', 'GEICO',
];

export default function CarrierLogoCarousel({
  headline = 'Carriers We Work With',
  subline = 'We shop them all to get you the best rate',
  carriers = [],
  variant = 'auto-scroll',
}: CarrierLogoCarouselProps) {
  const names = carriers.length > 0
    ? carriers.map(c => c.name)
    : FALLBACK_CARRIERS;

  // Duplicate for infinite loop
  const doubled = [...names, ...names];

  if (variant === 'static-grid') {
    return (
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>Our Partners</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: 'clamp(1.5rem,3vw,2rem)' }}>{headline}</h2>
            {subline && <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '1rem' }}>{subline}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {names.map((name) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 54, background: 'var(--bg-white)', border: '1.5px solid var(--border)',
                borderRadius: 10, padding: '0 20px', fontSize: '.82rem', fontWeight: 700,
                color: 'var(--text-muted)', letterSpacing: '.04em', textTransform: 'uppercase',
                textAlign: 'center',
              }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
      <div className="container-custom" style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>
          Carrier Partners
        </p>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', marginBottom: 10 }}>{headline}</h2>
        {subline && <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{subline}</p>}
      </div>

      {/* Carousel */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Fade masks */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 80, background: 'linear-gradient(90deg,var(--bg-white) 0%,transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 80, background: 'linear-gradient(270deg,var(--bg-white) 0%,transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />

        <div style={{
          display: 'flex',
          gap: 16,
          width: 'max-content',
          animation: 'carrier-scroll 32s linear infinite',
          padding: '4px 0',
        }}
          className="carrier-track"
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.animationPlayState = 'paused')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.animationPlayState = 'running')}
        >
          {doubled.map((name, i) => (
            <div key={`${name}-${i}`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 140, height: 54,
              background: 'var(--bg-white)',
              border: '1.5px solid var(--border)',
              borderRadius: 10,
              padding: '0 20px',
              fontSize: '.82rem', fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '.04em', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              filter: 'grayscale(1)',
              transition: 'filter .2s, border-color .2s, color .2s, box-shadow .2s',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.filter = 'grayscale(0)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy-500)';
                (e.currentTarget as HTMLElement).style.color = 'var(--navy-800)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.filter = 'grayscale(1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes carrier-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
