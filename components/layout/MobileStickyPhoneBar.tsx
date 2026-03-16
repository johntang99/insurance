'use client';

import Link from 'next/link';
import { Phone, FileText } from 'lucide-react';

interface MobileStickyPhoneBarProps {
  phone: string;
  phoneHref: string;
  quoteHref: string;
  locale?: string;
  callLabel?: string;
  quoteLabel?: string;
}

export default function MobileStickyPhoneBar({
  phone,
  phoneHref,
  quoteHref,
  locale = 'en',
  callLabel,
  quoteLabel,
}: MobileStickyPhoneBarProps) {
  const isZh = locale === 'zh';
  const resolvedCallLabel = callLabel || (isZh ? '立即致电' : 'Call Us Now');
  const resolvedQuoteLabel = quoteLabel || (isZh ? '免费获取报价' : 'Get a Free Quote');

  return (
    <div
      className="mobile-sticky-bar md:hidden"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 200,
        background: 'var(--bg-white)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: 10,
        padding: '10px 16px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
      }}
    >
      {/* Call button — navy */}
      <a
        href={phoneHref}
        className="flex-1 flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-colors"
        style={{
          background: 'var(--navy-800)',
          color: '#fff',
          height: 52,
          textDecoration: 'none',
        }}
      >
        <Phone className="w-4 h-4" />
        <span>{resolvedCallLabel}</span>
      </a>

      {/* Quote button — gold */}
      <Link
        href={quoteHref}
        className="flex-1 flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-colors"
        style={{
          background: 'var(--gold-500)',
          color: '#fff',
          height: 52,
          textDecoration: 'none',
        }}
      >
        <FileText className="w-4 h-4" />
        <span>{resolvedQuoteLabel}</span>
      </Link>
    </div>
  );
}
