'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Shield, ChevronDown } from 'lucide-react';
import { localeNames, locales, switchLocale, type Locale } from '@/lib/i18n';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';

// ── Nav config types ─────────────────────────────────────

interface NavLink { label: string; href: string; icon?: string; description?: string; highlight?: boolean; }
interface NavColumn { heading: string; links: NavLink[]; cta?: { label: string; href: string; description?: string }; }

interface NavItem {
  label: string;
  type: 'link' | 'dropdown' | 'mega';
  href?: string;
  links?: NavLink[];
  columns?: NavColumn[];
}

const ZH_LABEL_MAP: Record<string, string> = {
  Home: '首页',
  Insurance: '保险产品',
  Company: '关于我们',
  Resources: '资讯中心',
  Contact: '联系我们',
  Personal: '个人保险',
  Business: '商业保险',
  Services: '便民服务',
  'Auto Insurance': '车险',
  'TLC Insurance': 'TLC 保险',
  'Homeowner Insurance': '房屋保险',
  Motorcycle: '摩托车保险',
  'Motorcycle Insurance': '摩托车保险',
  'Boat Insurance': '船只保险',
  'Travel Insurance': '旅行保险',
  'Business Insurance': '商业保险',
  'Commercial Auto': '商业车辆保险',
  'Workers Comp': '工伤保险',
  'Workers Compensation': '工伤保险',
  Construction: '建筑工程保险',
  'Construction Insurance': '建筑工程保险',
  'Disability Insurance': '伤残保险',
  'Group Health': '团体健康保险',
  'All Coverage →': '全部险种 →',
  'All Coverage Types →': '全部险种 →',
  'Claims Help': '理赔协助',
  'Claims Assistance': '理赔协助',
  'DMV Services': 'DMV 服务',
  'Notary Services': '公证服务',
  'Get a Free Quote': '免费获取报价',
  'About Us': '关于我们',
  'Our Agents': '顾问团队',
  'Carrier Partners': '合作保险公司',
  Testimonials: '客户评价',
  'Service Areas': '服务区域',
  'Resource Center': '资源中心',
};

const ZH_DESC_MAP: Record<string, string> = {
  'Story, mission & credentials': '品牌故事、使命与资质',
  'Our story, mission & credentials': '品牌故事、使命与资质',
  'Specialists in every coverage type': '覆盖各险种的持牌顾问',
  'Licensed experts in every coverage type': '覆盖各险种的持牌顾问',
  '30+ carriers we represent': '我们合作的 30+ 保险公司',
  '30+ carriers we work with': '我们合作的 30+ 保险公司',
  '5,000+ satisfied clients': '5,000+ 客户真实反馈',
  'Cities and regions we serve': '我们覆盖的城市与区域',
  'Insurance guides & tips': '保险指南与实用建议',
  'Insurance guides & expert tips': '保险指南与实用建议',
  'Common questions answered': '常见问题解答',
  'Answers to common questions': '常见问题解答',
  'Guidance through your claim': '理赔流程与协助',
  'We respond within 2 hours': '我们通常在 2 小时内回复',
};

function normalizeNavHref(value?: string): string {
  if (!value) return '';
  return value.replace(/^\/(en|zh)\//, '').replace(/^\//, '');
}

function localizeNavForZh(items: NavItem[]): NavItem[] {
  return items.map((item) => ({
    ...item,
    label: ZH_LABEL_MAP[item.label] || item.label,
    links: item.links?.map((link) => ({
      ...link,
      label: ZH_LABEL_MAP[link.label] || ZH_LABEL_MAP[normalizeNavHref(link.href)] || link.label,
      description: link.description ? (ZH_DESC_MAP[link.description] || link.description) : link.description,
    })),
    columns: item.columns?.map((column) => ({
      ...column,
      heading: ZH_LABEL_MAP[column.heading] || column.heading,
      links: column.links.map((link) => ({
        ...link,
        label: ZH_LABEL_MAP[link.label] || ZH_LABEL_MAP[normalizeNavHref(link.href)] || link.label,
        description: link.description ? (ZH_DESC_MAP[link.description] || link.description) : link.description,
      })),
      cta: column.cta
        ? {
            ...column.cta,
            label: ZH_LABEL_MAP[column.cta.label] || column.cta.label,
            description: column.cta.description ? (ZH_DESC_MAP[column.cta.description] || column.cta.description) : column.cta.description,
          }
        : column.cta,
    })),
  }));
}

export interface HeaderConfig {
  menu?: {
    variant?: string;
    logo?: {
      text?: string;
      subtext?: string;
      image?: { src?: string; alt?: string; height?: number | string };
    };
  };
  cta?: { text?: string; link?: string };
  topbar?: { phone?: string; phoneHref?: string; badge?: string };
  phoneDisplay?: string;
  phoneHref?: string;
  showPhoneInHeader?: boolean;
  nav?: NavItem[];
  // Legacy support
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

// ── Default nav (fallback when no header.json configured) ─

function getDefaultNav(locale: Locale): NavItem[] {
  const isZh = locale === 'zh';
  return [
    { label: isZh ? '首页' : 'Home', type: 'link', href: '' },
    {
      label: isZh ? '保险产品' : 'Insurance', type: 'mega',
      columns: [
        { heading: isZh ? '个人保险' : 'Personal', links: [
          { label: isZh ? '车险' : 'Auto Insurance',             href: 'insurance/auto',            icon: '🚗' },
          { label: isZh ? 'TLC 保险' : 'TLC Insurance',          href: 'insurance/tlc',             icon: '🚕' },
          { label: isZh ? '房屋保险' : 'Homeowner Insurance',    href: 'insurance/homeowner',       icon: '🏠' },
          { label: isZh ? '摩托车保险' : 'Motorcycle',           href: 'insurance/motorcycle',      icon: '🏍️' },
        ]},
        { heading: isZh ? '商业保险' : 'Business', links: [
          { label: isZh ? '商业保险' : 'Business Insurance',     href: 'insurance/business',        icon: '💼' },
          { label: isZh ? '商业车辆保险' : 'Commercial Auto',     href: 'insurance/commercial-auto', icon: '🚛' },
          { label: isZh ? '工伤保险' : 'Workers Comp',            href: 'insurance/workers-comp',    icon: '🦺' },
          { label: isZh ? '建筑工程保险' : 'Construction',        href: 'insurance/construction',    icon: '🏗️' },
        ]},
        { heading: isZh ? '便民服务' : 'Services', links: [
          { label: isZh ? '全部险种 →' : 'All Coverage →',         href: 'insurance',    icon: '📋', highlight: true },
          { label: isZh ? '理赔协助' : 'Claims Help',              href: 'claims',       icon: '🛡️' },
          { label: isZh ? 'DMV 服务' : 'DMV Services',            href: 'services/dmv', icon: '📄' },
        ], cta: { label: isZh ? '免费获取报价' : 'Get a Free Quote', href: 'quote' } },
      ],
    },
    { label: isZh ? '关于我们' : 'Company', type: 'dropdown', links: [
      { label: isZh ? '关于我们' : 'About Us',          href: 'about',        description: isZh ? '品牌故事、使命与资质' : 'Story, mission & credentials' },
      { label: isZh ? '顾问团队' : 'Our Agents',        href: 'agents',       description: isZh ? '覆盖各险种的持牌顾问' : 'Specialists in every coverage type' },
      { label: isZh ? '合作保险公司' : 'Carrier Partners', href: 'carriers',     description: isZh ? '我们合作的 30+ 保险公司' : '30+ carriers we represent' },
      { label: isZh ? '客户评价' : 'Testimonials',      href: 'testimonials', description: isZh ? '5,000+ 客户真实反馈' : '5,000+ satisfied clients' },
      { label: isZh ? '服务区域' : 'Service Areas',      href: 'locations',    description: isZh ? '我们覆盖的城市与区域' : 'Cities and regions we serve' },
    ]},
    { label: isZh ? '资讯中心' : 'Resources', type: 'dropdown', links: [
      { label: isZh ? '资源中心' : 'Resource Center', href: 'resources', description: isZh ? '保险指南与实用建议' : 'Insurance guides & tips' },
      { label: 'FAQ',                                  href: 'faq',       description: isZh ? '常见问题解答' : 'Common questions answered' },
      { label: isZh ? '理赔协助' : 'Claims Help',      href: 'claims',    description: isZh ? '理赔流程与协助' : 'Guidance through your claim' },
    ]},
    { label: isZh ? '联系我们' : 'Contact', type: 'link', href: 'contact' },
  ];
}

// ── Component ─────────────────────────────────────────────

export default function Header({ locale, siteInfo, headerConfig, supportedLocales }: HeaderProps) {
  const isZh = locale === 'zh';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenItem(null); }, [pathname]);

  const carriersCount = (siteInfo as any)?.carriersCount || 30;
  const ui = {
    logoSubtext: isZh ? '独立保险顾问' : 'Independent Insurance Broker',
    quoteCta: isZh ? '免费获取报价' : 'Get a Free Quote',
    licensePrefix: isZh ? '执照号 #' : 'Lic. #',
    licensedIn: isZh ? '持牌州' : 'Licensed in',
    carriersAccess: isZh ? `合作 ${carriersCount}+ 保险公司` : `Access to ${carriersCount}+ Carriers`,
    menuAria: isZh ? '切换菜单' : 'Toggle menu',
    languageLabel: isZh ? '语言' : 'Language',
    weSpeak: isZh ? '可用语言' : 'We speak',
  };
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  const logoText = headerConfig?.menu?.logo?.text || siteName;
  const logoSubtext = headerConfig?.menu?.logo?.subtext || ui.logoSubtext;
  const logoImg = headerConfig?.menu?.logo?.image?.src;
  const configuredLogoHeight = Number(headerConfig?.menu?.logo?.image?.height);
  const logoHeight = Number.isFinite(configuredLogoHeight)
    ? Math.min(120, Math.max(20, configuredLogoHeight))
    : 40;
  const phone = headerConfig?.phoneDisplay || (siteInfo as any)?.phone || '';
  const phoneHref = headerConfig?.phoneHref || (phone ? `tel:${phone.replace(/\D/g, '')}` : '#');
  const ctaLabel = headerConfig?.cta?.text || ui.quoteCta;
  const ctaHref = `/${locale}/${(headerConfig?.cta?.link || 'quote').replace(/^\/(en|zh)\//, '').replace(/^\//, '')}`;
  const licenseNumber = (siteInfo as any)?.licenseNumber || '';
  const licensedStates = (siteInfo as any)?.licensedStates || [];
  const languages = (siteInfo as any)?.languages || [];

  const sourceNav = (headerConfig?.nav && headerConfig.nav.length > 0) ? headerConfig.nav : getDefaultNav(locale);
  const headerNav = isZh ? localizeNavForZh(sourceNav) : sourceNav;
  const hasHomeNav = headerNav.some((item) => {
    if (item.type !== 'link' || typeof item.href !== 'string') return false;
    const path = normalizeNavHref(item.href);
    return path === '' || path === 'home';
  });
  const navItems: NavItem[] = hasHomeNav ? headerNav : [{ label: isZh ? '首页' : 'Home', type: 'link', href: '' }, ...headerNav];
  const activeLocales = Array.from(
    new Set<Locale>([
      ...(supportedLocales && supportedLocales.length > 0 ? supportedLocales : []),
      ...locales,
      locale,
    ])
  );
  const showLocaleSwitcher = activeLocales.length > 1;
  const getLocaleHref = (nextLocale: Locale) => switchLocale(pathname || `/${locale}`, nextLocale);

  const href = (path: string) => {
    if (path.startsWith('http')) return path;
    const normalized = path.replace(/^\//, '');
    if (!normalized) return `/${locale}`;
    return `/${locale}/${normalized}`;
  };
  const isActive = (path: string) => {
    const full = href(path);
    if (!path || path === '/') {
      return pathname === full || pathname === `${full}/`;
    }
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenItem(label);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenItem(null), 180);
  };

  return (
    <>
      {/* ── TOP BAR ──────────────────────────────────────── */}
      <div className="hidden md:block" style={{ background: 'var(--navy-800)', padding: '7px 0', fontSize: '.8rem', color: 'rgba(255,255,255,.75)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="container-custom flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {licenseNumber && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium" style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)' }}>
                <Shield className="w-3 h-3" style={{ color: 'var(--gold-400)' }} />
                {ui.licensePrefix}{licenseNumber}
              </span>
            )}
            {licensedStates.length > 0 && (
              <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.78rem' }}>{ui.licensedIn} {licensedStates.join(' · ')}</span>
            )}
          </div>
          <div className="flex items-center gap-5">
            {carriersCount > 0 && (
              <span style={{ color: 'var(--gold-300)', fontWeight: 600, fontSize: '.78rem' }}>{ui.carriersAccess}</span>
            )}
            {phone && (
              <a href={phoneHref} className="flex items-center gap-1.5 font-semibold" style={{ color: 'rgba(255,255,255,.85)', fontSize: '.82rem', textDecoration: 'none' }}>
                <Phone className="w-3 h-3" />{phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ──────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg-white)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,.1)' : 'none',
        transition: 'box-shadow .2s',
      }}>
        <div className="container-custom flex items-center justify-between" style={{ height: 68, gap: 6 }}>

          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 min-w-0 lg:flex-shrink-0"
            style={{ textDecoration: 'none', maxWidth: 'calc(100% - 52px)', overflow: 'hidden' }}
          >
            {logoImg ? (
              <Image
                src={logoImg}
                alt={logoText}
                width={Math.round(logoHeight * 3.5)}
                height={logoHeight}
                className="w-auto max-w-full object-contain"
                style={{ height: `min(${logoHeight}px, 11vw)` }}
              />
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
                  <div className="font-medium uppercase tracking-wide" style={{ fontSize: '.62rem', color: 'var(--text-muted)', letterSpacing: '.07em' }}>
                    {logoSubtext}
                  </div>
                </div>
              </>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navItems.map(item => {
              const active = item.href ? isActive(item.href) : navItems.some(n => n.links?.some(l => isActive(l.href)));
              const isOpen = openItem === item.label;

              if (item.type === 'link') {
                return (
                  <Link key={item.label} href={href(item.href || '')}
                    className="px-3.5 py-2 rounded-md text-sm font-medium transition-colors"
                    style={{ color: isActive(item.href || '') ? 'var(--navy-800)' : 'var(--text-secondary)', fontWeight: isActive(item.href || '') ? 700 : 500, textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.label} className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}>
                  <button className="flex items-center gap-1 px-3.5 py-2 rounded-md text-sm font-medium transition-colors"
                    style={{ color: isOpen ? 'var(--navy-800)' : 'var(--text-secondary)', fontWeight: isOpen ? 700 : 500, background: isOpen ? 'var(--navy-50)' : 'transparent', border: 'none', cursor: 'pointer' }}>
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: 'var(--text-muted)' }} />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 pt-1 z-50" style={{ minWidth: item.type === 'mega' ? 680 : 260 }}>
                      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>

                        {/* MEGA dropdown */}
                        {item.type === 'mega' && item.columns && (
                          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${item.columns.length}, 1fr)`, gap: 0 }}>
                            {item.columns.map((col, ci) => (
                              <div key={col.heading} style={{ padding: '20px 24px', borderRight: ci < item.columns!.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                <p style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-muted)', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                                  {col.heading}
                                </p>
                                <div className="flex flex-col gap-0.5">
                                  {col.links.map(l => (
                                    <Link key={l.href} href={href(l.href)}
                                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors"
                                      style={{ color: l.highlight ? 'var(--gold-600)' : 'var(--text-secondary)', fontWeight: l.highlight ? 700 : 400, background: isActive(l.href) ? 'var(--navy-50)' : 'transparent', textDecoration: 'none' }}
                                      onMouseEnter={e => { if (!l.highlight) (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)'; }}
                                      onMouseLeave={e => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                                      {l.icon && <span style={{ fontSize: '1rem', flexShrink: 0 }}>{l.icon}</span>}
                                      {l.label}
                                    </Link>
                                  ))}
                                </div>
                                {col.cta && (
                                  <Link href={href(col.cta.href)}
                                    className="flex items-center justify-center gap-2 mt-4 py-2.5 px-4 rounded-lg text-sm font-bold transition-colors"
                                    style={{ background: 'var(--gold-500)', color: '#fff', textDecoration: 'none' }}>
                                    {col.cta.label}
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Regular dropdown */}
                        {item.type === 'dropdown' && item.links && (
                          <div style={{ padding: '8px' }}>
                            {item.links.map(l => (
                              <Link key={l.href} href={href(l.href)}
                                className="flex items-start gap-3 px-4 py-3 rounded-lg transition-colors"
                                style={{ color: 'var(--text-primary)', textDecoration: 'none', background: isActive(l.href) ? 'var(--navy-50)' : 'transparent' }}
                                onMouseEnter={e => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)'; }}
                                onMouseLeave={e => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: '.875rem', color: 'var(--navy-800)', marginBottom: l.description ? 1 : 0 }}>{l.label}</div>
                                  {l.description && <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{l.description}</div>}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {showLocaleSwitcher && (
              <div className="flex items-center rounded-lg border" style={{ borderColor: 'var(--border)', overflow: 'hidden' }}>
                {activeLocales.map((item) => (
                  <Link
                    key={item}
                    href={getLocaleHref(item)}
                    className="px-2.5 py-1.5 text-xs font-semibold"
                    style={{
                      color: item === locale ? '#fff' : 'var(--text-secondary)',
                      background: item === locale ? 'var(--navy-700)' : 'transparent',
                      textDecoration: 'none',
                    }}
                  >
                    {localeNames[item]}
                  </Link>
                ))}
              </div>
            )}
            <Link href={ctaHref}
              style={{ background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: '.875rem', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-block' }}>
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 rounded-md" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: 'var(--navy-800)', background: 'none', border: 'none', cursor: 'pointer' }} aria-label={ui.menuAria}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── MOBILE MENU ──────────────────────────────────── */}
        {mobileOpen && (
          <div style={{ background: 'var(--bg-white)', borderTop: '1px solid var(--border)', maxHeight: 'calc(100vh - 68px)', overflowY: 'auto' }}>
            <div className="container-custom" style={{ paddingTop: 16, paddingBottom: 24 }}>
              {/* Phone */}
              {phone && (
                <a href={phoneHref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', background: 'var(--navy-800)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', marginBottom: 12 }}>
                  <Phone className="w-4 h-4" />{phone}
                </a>
              )}

              {/* Nav items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navItems.map(item => {
                  const hasChildren = item.type !== 'link' && (item.links?.length || item.columns?.length);
                  const allLinks: NavLink[] = item.type === 'mega'
                    ? (item.columns || []).flatMap(c => c.links)
                    : item.links || [];
                  const isExpanded = mobileExpanded === item.label;

                  return (
                    <div key={item.label}>
                      {hasChildren ? (
                        <button onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 8, fontWeight: 600, fontSize: '.9375rem', color: 'var(--text-primary)', background: isExpanded ? 'var(--bg-subtle)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                          {item.label}
                          <ChevronDown className="w-4 h-4" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: 'var(--text-muted)' }} />
                        </button>
                      ) : (
                        <Link href={href(item.href || '')}
                          style={{ display: 'block', padding: '12px 16px', borderRadius: 8, fontWeight: 600, fontSize: '.9375rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                          {item.label}
                        </Link>
                      )}
                      {isExpanded && allLinks.length > 0 && (
                        <div style={{ padding: '4px 8px 8px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                          {allLinks.map(l => (
                            <Link key={l.href} href={href(l.href)}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, fontSize: '.85rem', color: l.highlight ? 'var(--gold-600)' : 'var(--text-secondary)', fontWeight: l.highlight ? 700 : 400, textDecoration: 'none' }}>
                              {l.icon && <span>{l.icon}</span>}
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <Link href={ctaHref}
                style={{ display: 'block', textAlign: 'center', marginTop: 16, padding: '14px', background: 'var(--gold-500)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
                {ctaLabel}
              </Link>

              {/* Locale switcher */}
              {showLocaleSwitcher && (
                <div className="mt-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                    {ui.languageLabel}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {activeLocales.map((item) => (
                      <Link
                        key={item}
                        href={getLocaleHref(item)}
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          background: item === locale ? 'var(--navy-50)' : 'transparent',
                          color: item === locale ? 'var(--navy-800)' : 'var(--text-secondary)',
                          fontWeight: 600,
                          fontSize: '.85rem',
                          textDecoration: 'none',
                        }}
                      >
                        {localeNames[item]}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages.length > 1 && (
                <p style={{ textAlign: 'center', marginTop: 12, fontSize: '.8rem', color: 'var(--text-muted)' }}>
                  {ui.weSpeak}: {languages.join(' · ')}
                </p>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
