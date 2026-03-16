'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

interface FooterSection {
  columns?: Array<{
    heading?: string;
    text?: string;
    links?: Array<{ label: string; href: string }>;
    phone?: string;
    phoneHref?: string;
    email?: string;
    hours?: string;
  }>;
  legalText?: string;
  licenseText?: string;
  disclaimer?: string;
  links?: Array<{ label: string; href: string }>;
}

interface FooterProps {
  locale: Locale;
  siteId: string;
  footer?: FooterSection;
}

function getYear() { return new Date().getFullYear(); }

export default function Footer({ locale, footer }: FooterProps) {
  const isZh = locale === 'zh';
  const columns = footer?.columns || [];
  const legalText = (footer?.legalText || '© {year} Insurance Brokerage. All rights reserved.').replace('{year}', String(getYear()));
  const licenseText = footer?.licenseText || '';
  const disclaimer = footer?.disclaimer || 'Insurance products and services subject to state availability, issue limitations, and contractual terms.';
  const legalLinks = footer?.links || [];

  return (
    <footer style={{ background: 'var(--navy-900)', color: 'rgba(255,255,255,.75)' }}>
      {/* Main footer grid */}
      <div style={{ padding: '64px 0 48px' }}>
        <div className="container-custom">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '48px' }}>
            {columns.map((col, i) => (
              <div key={i}>
                {/* Brand column (first) */}
                {i === 0 && (
                  <div className="footer-logo flex items-center gap-2.5 mb-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-md font-bold"
                      style={{ background: 'var(--navy-700)', color: 'var(--gold-400)', fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
                      P
                    </div>
                    <span className="font-bold text-white" style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
                      {col.heading || 'Peerless Brokerage'}
                    </span>
                  </div>
                )}

                {i !== 0 && col.heading && (
                  <p className="mb-4 font-bold uppercase tracking-wider" style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.1em' }}>
                    {col.heading}
                  </p>
                )}

                {/* Links */}
                {col.links && col.links.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    {col.links.map((link) => (
                      <Link key={link.href} href={link.href.startsWith('/') ? link.href : `/${locale}/${link.href}`}
                        className="text-sm transition-colors"
                        style={{ color: 'rgba(255,255,255,.65)' }}
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'var(--gold-300)')}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,.65)')}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Contact column */}
                {col.phone && (
                  <div className="flex flex-col gap-2 text-sm" style={{ color: 'rgba(255,255,255,.7)' }}>
                    <a href={col.phoneHref || `tel:${col.phone?.replace(/\D/g, '')}`}
                      className="flex items-center gap-2 transition-colors"
                      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'var(--gold-300)')}
                      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,.7)')}>
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      {col.phone}
                    </a>
                    {col.email && (
                      <a href={`mailto:${col.email}`}
                        className="flex items-center gap-2 transition-colors"
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'var(--gold-300)')}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,.7)')}>
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        {col.email}
                      </a>
                    )}
                    {col.text && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span style={{ whiteSpace: 'pre-line' }}>{col.text}</span>
                      </div>
                    )}
                    {col.hours && (
                      <div className="flex items-start gap-2 mt-1">
                        <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span style={{ whiteSpace: 'pre-line' }}>{col.hours}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Last column: add quote button */}
                {i === columns.length - 1 && !col.phone && (
                  <Link href={`/${locale}/quote`}
                    className="block text-center rounded-lg font-semibold text-sm mt-4 transition-colors"
                    style={{ background: 'var(--gold-500)', color: '#fff', padding: '12px 16px' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = 'var(--gold-600)')}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = 'var(--gold-500)')}>
                    {isZh ? '免费获取报价' : 'Get a Free Quote'}
                  </Link>
                )}
              </div>
            ))}

            {/* Fallback if no columns */}
            {columns.length === 0 && (
              <>
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-md flex items-center justify-center font-bold" style={{ background: 'var(--navy-700)', color: 'var(--gold-400)', fontFamily: 'var(--font-heading)' }}>P</div>
                    <span className="font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Peerless Brokerage</span>
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>{isZh ? '法拉盛值得信赖的独立保险经纪。' : 'Your trusted independent insurance broker in Flushing, NY.'}</p>
                </div>
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,.4)' }}>{isZh ? '保险产品' : 'Insurance'}</p>
                  <div className="flex flex-col gap-2.5">
                    {(isZh ? ['车险', 'TLC', '房屋险', '商业险', '工伤险', '查看全部'] : ['Auto', 'TLC', 'Homeowner', 'Business', 'Workers Comp', 'View All']).map(l => (
                      <Link key={l} href={`/${locale}/insurance`} className="text-sm" style={{ color: 'rgba(255,255,255,.65)' }}>{isZh ? l : `${l} Insurance`}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,.4)' }}>{isZh ? '公司信息' : 'Company'}</p>
                  <div className="flex flex-col gap-2.5">
                    {(isZh ? [['关于我们', 'about'], ['顾问团队', 'agents'], ['合作保险公司', 'carriers'], ['资讯中心', 'resources'], ['常见问题', 'faq'], ['联系我们', 'contact']] : [['About', 'about'], ['Agents', 'agents'], ['Carriers', 'carriers'], ['Resources', 'resources'], ['FAQ', 'faq'], ['Contact', 'contact']]).map(([l, h]) => (
                      <Link key={h} href={`/${locale}/${h}`} className="text-sm" style={{ color: 'rgba(255,255,255,.65)' }}>{l}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,.4)' }}>{isZh ? '开始办理' : 'Get Started'}</p>
                  <Link href={`/${locale}/quote`}
                    className="block text-center rounded-lg font-semibold text-sm"
                    style={{ background: 'var(--gold-500)', color: '#fff', padding: '12px 16px' }}>
                    {isZh ? '免费获取报价' : 'Get a Free Quote'}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compliance bottom bar — REQUIRED for insurance sites */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '20px 0' }}>
        <div className="container-custom flex flex-wrap justify-between items-center gap-4">
          <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.35)', maxWidth: 700, lineHeight: 1.5 }}>
            <p>{legalText}</p>
            {licenseText && <p className="mt-1">{licenseText}</p>}
            {disclaimer && <p className="mt-1">{disclaimer}</p>}
          </div>
          {legalLinks.length > 0 && (
            <div className="flex gap-4 flex-shrink-0">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href.startsWith('/') ? link.href : `/${locale}/${link.href}`}
                  className="text-xs transition-colors"
                  style={{ color: 'rgba(255,255,255,.4)' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,.7)')}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,.4)')}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile spacer for sticky bar */}
      <div className="block md:hidden" style={{ height: 76 }} />
    </footer>
  );
}
