import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
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
  title: 'Insurance Brokerage Platform',
  description: 'BAAM System I — Independent Insurance Broker',
  icons: {
    icon: '/icon',
    shortcut: '/icon',
    apple: '/icon',
  },
};

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
      <body>{children}</body>
    </html>
  );
}
