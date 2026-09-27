'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { LOCATIONS, LOCATION_MAP, DEFAULT_ACTIVE_LOCATIONS, groupByState } from '@/lib/insurance/locations';
import { INSURANCE_LINE_META } from '@/lib/insurance/theme';

const ACTIVE_SLUGS = DEFAULT_ACTIVE_LOCATIONS;
const grouped = groupByState(ACTIVE_SLUGS);

const STATE_NAMES: Record<string, { en: string; zh: string }> = {
  NY: { en: 'New York', zh: '纽约州' },
  NJ: { en: 'New Jersey', zh: '新泽西州' },
  CT: { en: 'Connecticut', zh: '康涅狄格州' },
  PA: { en: 'Pennsylvania', zh: '宾夕法尼亚州' },
};

const COVERAGE_NAMES_ZH: Record<string, string> = {
  auto: '车险',
  tlc: 'TLC 保险',
  'commercial-auto': '商业车辆保险',
  homeowner: '房屋保险',
  business: '商业保险',
  'workers-comp': '工伤保险',
  disability: '伤残保险',
  construction: '建筑工程保险',
  motorcycle: '摩托车保险',
  boat: '船只保险',
  travel: '旅行保险',
  'group-health': '团体健康保险',
};
const CITY_NAMES_ZH: Record<string, string> = {
  brooklyn: '布鲁克林',
  queens: '皇后区',
  manhattan: '曼哈顿',
  bronx: '布朗克斯',
  'staten-island': '史丹顿岛',
  flushing: '法拉盛',
  'jersey-city': '泽西市',
  newark: '纽瓦克',
  hoboken: '霍博肯',
  yonkers: '扬克斯',
};

const COVERAGE_TYPES = Object.entries(INSURANCE_LINE_META)
  .filter(([slug]) => !['dmv', 'notary'].includes(slug))
  .slice(0, 12)
  .map(([slug, meta]) => ({ slug, name: meta.name, icon: meta.icon }));

export default function LocationsPage({ params }: { params: { locale: string } }) {
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const locale = params?.locale || 'en';
  const isZh = locale === 'zh';
  const ui = {
    heroTag: isZh ? '服务区域' : 'Service Areas',
    heroTitle: isZh ? '我们服务纽约及周边区域' : 'We Serve New York City and Surrounding Areas',
    heroSubline: isZh
      ? '持牌保险经纪，服务法拉盛、皇后区、曼哈顿、布朗克斯、史丹顿岛及 NY、NJ、CT、PA 区域客户。'
      : 'Licensed insurance broker serving Flushing, Queens, Manhattan, the Bronx, Staten Island, and throughout NY, NJ, CT, and PA.',
    quoteCta: isZh ? '免费获取报价' : 'Get a Free Quote',
    licensedServing: isZh ? '持牌并服务区域：' : 'Licensed and Serving:',
    browseTitle: isZh ? '按城市查看可选保险方案' : 'Browse Insurance by Your City',
    browseSubline: isZh ? '点击城市查看可投保险种，并获取本地报价。' : 'Click your city to see available coverage types and get a local quote.',
    lines: isZh ? '个险种' : 'lines',
    coverageIn: isZh ? '在该城市可投保：' : 'Coverage in',
    inCity: isZh ? '（本地）' : 'in',
    quoteInCity: isZh ? '获取本地报价' : 'Get a Quote in',
    unsureTitle: isZh ? '不确定是否覆盖您的区域？' : 'Not sure if we serve your area?',
    unsureSubline: isZh ? '欢迎来电咨询，我们覆盖 NY、NJ、CT、PA。' : 'Call us — we serve all of NY, NJ, CT, and PA.',
  };
  const coverageTypes = COVERAGE_TYPES.map((item) => ({
    ...item,
    name: isZh ? (COVERAGE_NAMES_ZH[item.slug] || item.name) : item.name,
  }));
  const getCityName = (slug: string, fallback: string) => (isZh ? (CITY_NAMES_ZH[slug] || fallback) : fallback);

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 12 }}>{ui.heroTag}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 16 }}>
            {ui.heroTitle}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.65 }}>
            {ui.heroSubline}
          </p>
          <Link href={`/${locale}/quote`} className="btn-gold">{ui.quoteCta}</Link>
        </div>
      </section>

      {/* States served */}
      <section style={{ padding: '40px 0', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-custom">
          <p style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 14, textAlign: 'center' }}>{ui.licensedServing}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(STATE_NAMES).map(([code, name]) => (
              <div key={code} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--navy-800)', color: '#fff', borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: '.9rem' }}>
                <span style={{ color: 'var(--gold-400)', fontFamily: 'var(--font-heading)' }}>{code}</span>
                <span style={{ color: 'rgba(255,255,255,.6)' }}>—</span>
                {isZh ? name.zh : name.en}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City grid with accordion */}
      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 8 }}>{ui.browseTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{ui.browseSubline}</p>
          </div>

          {Object.entries(grouped).map(([stateCode, locs]) => (
            <div key={stateCode} style={{ marginBottom: 48 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1.1rem', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid var(--border)' }}>
                📍 {isZh ? (STATE_NAMES[stateCode]?.zh || stateCode) : (STATE_NAMES[stateCode]?.en || stateCode)}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                {locs.map(loc => {
                  const isExpanded = expandedCity === loc.slug;
                  return (
                    <div key={loc.slug}>
                      <button
                        onClick={() => setExpandedCity(isExpanded ? null : loc.slug)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 18px', border: `1.5px solid ${isExpanded ? 'var(--navy-500)' : 'var(--border)'}`,
                          borderRadius: 10, background: isExpanded ? 'var(--navy-50)' : 'var(--bg-white)',
                          cursor: 'pointer', transition: 'all .15s',
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
                          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: isExpanded ? 'var(--navy-600)' : 'var(--text-muted)' }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '.875rem', color: isExpanded ? 'var(--navy-800)' : 'var(--text-primary)' }}>{getCityName(loc.slug, loc.name)}</div>
                            <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{loc.stateCode} · {coverageTypes.length} {ui.lines}</div>
                          </div>
                        </div>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--navy-600)' }} />
                          : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />}
                      </button>

                      {isExpanded && (
                        <div style={{ border: '1px solid var(--navy-100)', borderTop: 'none', borderRadius: '0 0 10px 10px', background: 'var(--navy-50)', padding: '12px 14px' }}>
                          <p style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)', marginBottom: 8 }}>
                            {ui.coverageIn} {getCityName(loc.slug, loc.name)}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {coverageTypes.slice(0, 8).map(ct => (
                              <Link key={ct.slug} href={`/${locale}/insurance/${ct.slug}/${loc.slug}`}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, fontSize: '.82rem', color: 'var(--navy-700)', textDecoration: 'none', fontWeight: 500 }}>
                                <span>{ct.icon}</span>
                                {ct.name} {ui.inCity} {getCityName(loc.slug, loc.name)} →
                              </Link>
                            ))}
                            <Link href={`/${locale}/insurance/${coverageTypes[0].slug}/${loc.slug}`}
                              style={{ display: 'block', marginTop: 6, padding: '8px 10px', background: 'var(--gold-500)', color: '#fff', borderRadius: 8, fontSize: '.8rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                              {ui.quoteInCity}（{getCityName(loc.slug, loc.name)}）
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '48px 0', background: 'var(--navy-800)', textAlign: 'center' }}>
        <div className="container-custom">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 8 }}>{ui.unsureTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: 24 }}>{ui.unsureSubline}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/${locale}/quote`} className="btn-gold">{ui.quoteCta}</Link>
            <a href="tel:+17187990472" className="btn-navy-outline">📞 (718) 799-0472</a>
          </div>
        </div>
      </section>
    </main>
  );
}
