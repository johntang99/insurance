import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#f7f8fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        {/* Nav strip */}
        <div style={{ marginBottom: 48 }}>
          <Link href="/en" style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#0b1f3a', textDecoration: 'none', fontSize: '1.1rem' }}>
            Peerless Brokerage
          </Link>
        </div>

        <div style={{ fontSize: '5rem', fontFamily: 'Georgia, serif', fontWeight: 700, color: '#dce8f5', lineHeight: 1, marginBottom: 16 }}>
          404
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#0b1f3a', fontSize: '1.6rem', marginBottom: 12 }}>
          Page Not Found
        </h1>
        <p style={{ color: '#7a8a9a', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32 }}>
          The page you're looking for doesn't exist or may have moved. Try one of our main pages below.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
          {[
            { label: '🏠 Home', href: '/en' },
            { label: '📋 All Insurance', href: '/en/insurance' },
            { label: '💬 Get a Quote', href: '/en/quote' },
            { label: '📞 Contact Us', href: '/en/contact' },
          ].map(({ label, href }) => (
            <Link key={href} href={href}
              style={{ display: 'block', padding: '14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0b1f3a', fontWeight: 600, fontSize: '.9rem', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: '.875rem', color: '#7a8a9a' }}>
          Or call us directly:{' '}
          <a href="tel:+17187990472" style={{ color: '#c9933a', fontWeight: 700 }}>
            (718) 799-0472
          </a>
        </p>
      </div>
    </main>
  );
}
