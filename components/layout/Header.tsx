'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Shield, ChevronDown } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';

export interface HeaderConfig {
  menu?: {
    variant?: string;
    logo?: { text?: string; subtext?: string; image?: { src?: string; alt?: string } };
    items?: Array<{ text: string; url: string }>;
  };
  cta?: { text?: string; link?: string };
  topbar?: { phone?: string; phoneHref?: string; badge?: string };
  phoneDisplay?: string;
  phoneHref?: string;
  insuranceDropdown?: Array<{ label: string; href: string; isViewAll?: boolean }>;
}

interface HeaderProps {
  locale: Locale;
  siteId: string;
  supportedLocales?: Locale[];
  siteInfo?: SiteInfo;
  variant?: string;
  headerConfig?: HeaderConfig;
}

const NAV_ITEMS = [
  { text: 'Insurance', url: 'insurance', hasDropdown: true },
  { text: 'About', url: 'about' },
  { text: 'Resources', url: 'resources' },
  { text: 'Contact', url: 'contact' },
];

const INSURANCE_DROPDOWN = [
  { label: 'Auto Insurance', href: 'insurance/auto' },
  { label: 'TLC Insurance', href: 'insurance/tlc' },
  { label: 'Commercial Auto', href: 'insurance/commercial-auto' },
  { label: 'Homeowner Insurance', href: 'insurance/homeowner' },
  { label: 'Business Insurance', href: 'insurance/business' },
  { label: 'Workers Comp', href: 'insurance/workers-comp' },
  { label: 'Disability Insurance', href: 'insurance/disability' },
  { label: 'Construction Insurance', href: 'insurance/construction' },
  { label: 'Motorcycle Insurance', href: 'insurance/motorcycle' },
  { label: 'View All Coverage →', href: 'insurance', isViewAll: true },
];

export default function Header({
  locale,
  siteInfo,
  headerConfig,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const logoText = headerConfig?.menu?.logo?.text || siteName;
  const logoSubtext = headerConfig?.menu?.logo?.subtext || 'Independent Insurance Broker';
  const logoImg = headerConfig?.menu?.logo?.image?.src;
  const phone = headerConfig?.phoneDisplay || siteInfo?.phone || '';
  const phoneHref = headerConfig?.phoneHref || (phone ? `tel:${phone.replace(/\D/g, '')}` : '#');
  const ctaLabel = headerConfig?.cta?.text || 'Get a Free Quote';
  const ctaHref = `/${locale}/${headerConfig?.cta?.link?.replace(/^\/en\//, '') || 'quote'}`;
  const licenseNumber = (siteInfo as any)?.licenseNumber || 'LA-1234567';
  const licensedStates = (siteInfo as any)?.licensedStates || ['NY', 'NJ', 'CT', 'PA'];
  const carriersCount = (siteInfo as any)?.carriersCount || 30;
  const languages = (siteInfo as any)?.languages || [];

  const navItems = headerConfig?.menu?.items?.length
    ? headerConfig.menu.items.map(i => ({ text: i.text, url: i.url, hasDropdown: false }))
    : NAV_ITEMS;

  const dropdown = headerConfig?.insuranceDropdown || INSURANCE_DROPDOWN;

  const isActive = (url: string) => {
    const full = `/${locale}/${url}`;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  return (
    <>
      {/* TOP BAR — desktop only */}
      <div className="top-bar hidden md:block" style={{ background: 'var(--navy-800)', padding: '8px 0', fontSize: '.8125rem', color: 'rgba(255,255,255,.75)' }}>
        <div className="container-custom flex justify-between items-center gap-4">
          {/* Left: License + Languages */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="license-badge flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium" style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)' }}>
              <Shield className="w-3 h-3" style={{ color: 'var(--gold-400)' }} />
              Lic. #{licenseNumber}
            </div>
            <span style={{ color: 'rgba(255,255,255,.5)' }}>Licensed in {licensedStates.join(' · ')}</span>
            {languages.length > 1 && (
              <span style={{ color: 'rgba(255,255,255,.55)' }}>· {languages.join(' · ')}</span>
            )}
          </div>
          {/* Right: Carriers + Phone */}
          <div className="flex items-center gap-5">
            {carriersCount > 0 && (
              <span style={{ color: 'var(--gold-300)', fontWeight: 600, fontSize: '.78rem' }}>Access to {carriersCount}+ Carriers</span>
            )}
            {phone && (
              <a href={phoneHref} className="flex items-center gap-1.5 font-semibold transition-colors" style={{ color: 'rgba(255,255,255,.85)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-300)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.85)')}>
                <Phone className="w-3.5 h-3.5" />
                {phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <header className="site-header" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg-white)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,.09)' : '0 1px 0 var(--border)',
        transition: 'box-shadow .2s',
      }}>
        <div className="container-custom flex items-center justify-between" style={{ height: 68 }}>
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0">
            {logoImg ? (
              <Image src={logoImg} alt={logoText} width={140} height={40} className="h-10 w-auto object-contain" />
            ) : (
              <>
                <div className="flex items-center justify-center w-9 h-9 rounded-lg font-bold text-base flex-shrink-0"
                  style={{ background: 'var(--navy-800)', color: 'var(--gold-400)', fontFamily: 'var(--font-heading)' }}>
                  {logoText.charAt(0)}
                </div>
                <div>
                  <div className="font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1.05rem' }}>
                    {logoText}
                  </div>
                  <div className="font-medium uppercase tracking-wide" style={{ fontSize: '.65rem', color: 'var(--text-muted)', letterSpacing: '.06em' }}>
                    {logoSubtext}
                  </div>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const href = item.url.startsWith('/') ? item.url : `/${locale}/${item.url}`;
              const active = isActive(item.url.replace(/^\/[a-z]{2}\//, ''));
              if ((item as any).hasDropdown !== false && item.url === 'insurance') {
                return (
                  <div key={item.url} className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                    <button className="flex items-center gap-1 px-3.5 py-2 rounded-md text-sm font-medium transition-all"
                      style={{ color: active ? 'var(--navy-800)' : 'var(--text-secondary)', fontWeight: active ? 700 : 500 }}>
                      {item.text}
                      <ChevronDown className="w-3.5 h-3.5" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 pt-1 z-50" style={{ minWidth: 220 }}>
                        <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)' }}>
                          {dropdown.map((d) => (
                            <Link key={d.href} href={`/${locale}/${d.href}`}
                              className="block px-4 py-2.5 text-sm transition-colors"
                              style={{
                                color: (d as any).isViewAll ? 'var(--gold-600)' : 'var(--text-secondary)',
                                fontWeight: (d as any).isViewAll ? 700 : 400,
                                borderTop: (d as any).isViewAll ? '1px solid var(--border)' : 'none',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                              {d.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link key={item.url} href={href}
                  className="px-3.5 py-2 rounded-md text-sm transition-all"
                  style={{ color: active ? 'var(--navy-800)' : 'var(--text-secondary)', fontWeight: active ? 700 : 500 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--navy-800)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = active ? 'var(--navy-800)' : 'var(--text-secondary)'; }}>
                  {item.text}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {phone && (
              <a href={phoneHref} className="text-sm font-semibold" style={{ color: 'var(--navy-700)' }}>
                {phone}
              </a>
            )}
            <Link href={ctaHref}
              className="btn btn-primary btn-sm"
              style={{ background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: '.875rem' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-600)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold-500)')}>
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 rounded-md" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: 'var(--navy-800)' }} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden" style={{ background: 'var(--bg-white)', borderTop: '1px solid var(--border)', padding: '16px 0 24px' }}>
            <div className="container-custom">
              {/* Phone prominent at top */}
              {phone && (
                <a href={phoneHref} className="flex items-center justify-center gap-2 py-3 mb-3 rounded-lg font-bold text-lg"
                  style={{ background: 'var(--navy-800)', color: '#fff', textDecoration: 'none' }}>
                  <Phone className="w-5 h-5" />
                  {phone}
                </a>
              )}
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const href = item.url.startsWith('/') ? item.url : `/${locale}/${item.url}`;
                  return (
                    <Link key={item.url} href={href}
                      className="block px-4 py-3 rounded-lg font-medium text-base"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      {item.text}
                    </Link>
                  );
                })}
              </div>
              {/* Insurance sub-links */}
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="px-4 mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Coverage Types</p>
                <div className="grid grid-cols-2 gap-1">
                  {dropdown.slice(0, 8).map((d) => (
                    <Link key={d.href} href={`/${locale}/${d.href}`}
                      className="block px-3 py-2 rounded-md text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      {d.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href={ctaHref}
                className="block w-full text-center mt-4 py-3.5 rounded-lg font-bold text-base"
                style={{ background: 'var(--gold-500)', color: '#fff', textDecoration: 'none' }}>
                {ctaLabel}
              </Link>
              {languages.length > 1 && (
                <p className="text-center mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  We speak: {languages.join(' · ')}
                </p>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
