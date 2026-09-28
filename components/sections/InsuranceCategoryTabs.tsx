'use client';

import { useState } from 'react';
import Link from 'next/link';

interface InsuranceLine {
  id?: string;
  line_slug?: string;
  slug?: string;
  name?: string;
  description?: string;
  is_featured?: boolean;
  is_enabled?: boolean;
  sort_order?: number;
}

const ICON_MAP: Record<string, string> = {
  auto: '🚗', tlc: '🚕', 'commercial-auto': '🚛', homeowner: '🏠',
  business: '💼', 'workers-comp': '🦺', disability: '🛡️', construction: '🏗️',
  motorcycle: '🏍️', boat: '⛵', travel: '✈️', 'group-health': '❤️',
  'commercial-property': '🏢', dmv: '📄', notary: '✒️',
};

const CATEGORY_MAP: Record<string, string> = {
  auto: 'personal', tlc: 'specialty', 'commercial-auto': 'commercial',
  homeowner: 'personal', business: 'commercial', 'workers-comp': 'commercial',
  disability: 'personal', construction: 'commercial', motorcycle: 'personal',
  boat: 'personal', travel: 'personal', 'group-health': 'commercial',
  'commercial-property': 'commercial', dmv: 'services', notary: 'services',
};

const LINE_NAMES: Record<string, string> = {
  auto: 'Auto Insurance', tlc: 'TLC Insurance', 'commercial-auto': 'Commercial Auto',
  homeowner: 'Homeowner Insurance', business: 'Business Insurance', 'workers-comp': 'Workers Compensation',
  disability: 'Disability Insurance', construction: 'Construction Insurance', motorcycle: 'Motorcycle Insurance',
  boat: 'Boat Insurance', travel: 'Travel Insurance', 'group-health': 'Group Health Insurance',
  'commercial-property': 'Commercial Property', dmv: 'DMV Services', notary: 'Notary Services',
};

const LINE_NAMES_ZH: Record<string, string> = {
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
  'commercial-property': '商业房产保险',
  dmv: 'DMV 服务',
  notary: '公证服务',
};

const LINE_DESC: Record<string, string> = {
  auto: 'Personal vehicle coverage from 20+ carriers', tlc: 'NYC for-hire vehicle compliance, same-day binding',
  'commercial-auto': 'Fleets, delivery vehicles & commercial drivers', homeowner: 'Protect your home with competitive rates',
  business: 'GL, property & business income in one policy', 'workers-comp': 'Required by NY law — fast binding, audit support',
  disability: 'Short and long-term income protection', construction: 'GL, builders risk & contractor coverage',
  motorcycle: 'Year-round or seasonal coverage', boat: 'Marine & watercraft coverage',
  travel: 'Trip cancellation, medical & group rates', 'group-health': 'Employer-sponsored ACA-compliant plans',
  'commercial-property': 'Buildings, equipment & inventory', dmv: 'Registration & title transfers',
  notary: 'Document notarization on-site',
};

const LINE_DESC_ZH: Record<string, string> = {
  auto: '个人车辆保障',
  tlc: '纽约营运车辆合规保障',
  'commercial-auto': '车队与商业车辆保障',
  homeowner: '房屋与财产保障',
  business: '企业责任、财产与收入保障',
  'workers-comp': '纽约州雇主法定保障',
  disability: '短期与长期收入保障',
  construction: '工程责任与施工风险保障',
  motorcycle: '全年或季节性骑行保障',
  boat: '船只与水上交通工具保障',
  travel: '行程取消与旅行医疗保障',
  'group-health': '企业团体医疗保障',
  'commercial-property': '楼宇、设备与库存保障',
  dmv: '过户、注册与车管业务办理',
  notary: '现场文件公证服务',
};

const TABS = [
  { id: 'all', label: 'All Coverage' },
  { id: 'personal', label: 'Personal' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'specialty', label: 'Specialty' },
  { id: 'services', label: 'Services' },
];

export default function InsuranceCategoryTabs({ lines, locale = 'en' }: { lines: InsuranceLine[]; locale?: string }) {
  const isZh = locale === 'zh';
  const [activeTab, setActiveTab] = useState('all');
  const tabs = isZh
    ? [
        { id: 'all', label: '全部险种' },
        { id: 'personal', label: '个人保险' },
        { id: 'commercial', label: '商业保险' },
        { id: 'specialty', label: '专项保险' },
        { id: 'services', label: '便民服务' },
      ]
    : TABS;

  const filteredLines = lines.filter(l => {
    const slug = l.line_slug || l.slug || '';
    if (activeTab === 'all') return true;
    return CATEGORY_MAP[slug] === activeTab;
  });

  return (
    <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
      <div className="container-custom">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 48, overflowX: 'auto', paddingBottom: 2, borderBottom: '2px solid var(--border)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px', borderRadius: '8px 8px 0 0', fontWeight: 600, fontSize: '.9rem', cursor: 'pointer',
                background: 'transparent', border: 'none',
                color: activeTab === tab.id ? 'var(--navy-800)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--navy-800)' : '2px solid transparent',
                marginBottom: -2, whiteSpace: 'nowrap',
                transition: 'color .15s',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {filteredLines.map(l => {
            const slug = l.line_slug || l.slug || '';
            const icon = ICON_MAP[slug] || '🔐';
            const name = isZh
              ? (LINE_NAMES_ZH[slug] || l.name || LINE_NAMES[slug] || slug)
              : (l.name || LINE_NAMES[slug] || slug);
            const desc = isZh
              ? (LINE_DESC_ZH[slug] || l.description || LINE_DESC[slug] || '')
              : (l.description || LINE_DESC[slug] || '');
            const isFeatured = l.is_featured;
            const href = `/${locale}/insurance/${slug}`;

            return (
              <Link key={slug} href={href}
                style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-white)', border: isFeatured ? '1.5px solid var(--gold-500)' : '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 20px', textDecoration: 'none', transition: 'border-color .2s, transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy-600)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isFeatured ? 'var(--gold-500)' : 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 12 }}>{icon}</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{name}</h3>
                <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1, marginBottom: 14 }}>{desc}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--gold-600)' }}>
                    {isZh ? '了解详情 →' : 'Learn More →'}
                  </span>
                  <Link href={`/${locale}/quote?type=${slug}`} onClick={e => e.stopPropagation()}
                    style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--navy-500)', marginLeft: 'auto' }}>
                    {isZh ? '获取报价' : 'Get Quote'}
                  </Link>
                </div>
              </Link>
            );
          })}

          {filteredLines.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              {isZh ? '该分类下暂无险种。' : 'No coverage types in this category.'}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ins-hub-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  );
}
