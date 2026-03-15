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

const TABS = [
  { id: 'all', label: 'All Coverage' },
  { id: 'personal', label: 'Personal' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'specialty', label: 'Specialty' },
  { id: 'services', label: 'Services' },
];

export default function InsuranceCategoryTabs({ lines, locale = 'en' }: { lines: InsuranceLine[]; locale?: string }) {
  const [activeTab, setActiveTab] = useState('all');

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
          {TABS.map(tab => (
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
            const name = l.name || LINE_NAMES[slug] || slug;
            const desc = l.description || LINE_DESC[slug] || '';
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
                  <span style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--gold-600)' }}>Learn More →</span>
                  <Link href={`/${locale}/quote?type=${slug}`} onClick={e => e.stopPropagation()}
                    style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--navy-500)', marginLeft: 'auto' }}>
                    Get Quote
                  </Link>
                </div>
              </Link>
            );
          })}

          {filteredLines.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              No coverage types in this category.
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
