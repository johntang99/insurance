import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import '../styles/globals.css';

// BAAM System I — Insurance Brokerage Platform
// Typography: Playfair Display (headings) + Inter (body)

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Peerless Brokerage Inc — Independent Insurance Broker in Flushing, NY',
    template: '%s | Peerless Brokerage Inc',
  },
  description: 'Get free insurance quotes for auto, home, business, TLC & more. Peerless Brokerage shops 30+ carriers. Serving Flushing, Queens & NYC. Call (718) 799-0472.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pbiny.com'),
  icons: {
    icon: '/icon',
    shortcut: '/icon',
    apple: '/icon',
  },
  openGraph: {
    siteName: 'Peerless Brokerage Inc',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${inter.variable}`}
    >
      <body>
        {children}
        {/* Google Analytics 4 — only loads when GA_ID is configured */}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
