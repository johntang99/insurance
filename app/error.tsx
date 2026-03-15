'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring (Sentry etc. can be wired here)
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#f7f8fa', margin: 0, padding: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 24 }}>⚠️</div>
            <h1 style={{ fontFamily: 'Georgia, serif', color: '#0b1f3a', fontSize: '1.8rem', marginBottom: 12 }}>
              Something went wrong
            </h1>
            <p style={{ color: '#7a8a9a', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32 }}>
              We encountered an unexpected error. Our team has been notified. You can try again or call us directly.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={reset}
                style={{ background: '#0b1f3a', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: '.9375rem', cursor: 'pointer' }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{ background: '#c9933a', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: '.9375rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                Return Home
              </a>
            </div>
            <p style={{ marginTop: 32, fontSize: '.875rem', color: '#7a8a9a' }}>
              Need immediate help?{' '}
              <a href="tel:+17187990472" style={{ color: '#c9933a', fontWeight: 700 }}>
                Call (718) 799-0472
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
