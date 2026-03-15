'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { INSURANCE_LINE_META } from '@/lib/insurance/theme';

interface InsuranceLine {
  id: string; site_id: string; line_slug: string; is_enabled: boolean;
  is_featured: boolean; custom_description?: string; sort_order: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  personal: 'Personal', commercial: 'Commercial', specialty: 'Specialty', services: 'Services',
};

export default function InsuranceLinesAdminPage() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('siteId') || '';

  const [lines, setLines] = useState<InsuranceLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchLines = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    const res = await fetch(`/api/admin/insurance-lines?siteId=${siteId}`);
    if (res.ok) {
      const data = await res.json();
      const dbLines: InsuranceLine[] = data.lines || [];
      // Merge with all known lines (add any missing ones)
      const allSlugs = Object.keys(INSURANCE_LINE_META);
      const merged = allSlugs.map((slug, i) => {
        const existing = dbLines.find(l => l.line_slug === slug);
        return existing || { id: '', site_id: siteId, line_slug: slug, is_enabled: false, is_featured: false, sort_order: i + 1, custom_description: '' };
      });
      // Sort by sort_order
      merged.sort((a, b) => a.sort_order - b.sort_order);
      setLines(merged);
    }
    setLoading(false);
  }, [siteId]);

  useEffect(() => { fetchLines(); }, [fetchLines]);

  const toggle = async (slug: string, field: 'is_enabled' | 'is_featured') => {
    const updated = lines.map(l => l.line_slug === slug ? { ...l, [field]: !l[field] } : l);
    setLines(updated);
    await saveAll(updated);
  };

  const saveAll = async (linesToSave?: InsuranceLine[]) => {
    setSaving(true);
    const payload = (linesToSave || lines).map((l, i) => ({
      line_slug: l.line_slug,
      is_enabled: l.is_enabled,
      is_featured: l.is_featured,
      custom_description: l.custom_description || '',
      sort_order: i + 1,
    }));
    await fetch('/api/admin/insurance-lines', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, lines: payload }),
    });
    setSaving(false);
  };

  const enableAll = () => {
    const updated = lines.map(l => ({ ...l, is_enabled: true }));
    setLines(updated);
    saveAll(updated);
  };
  const disableAll = () => {
    const updated = lines.map(l => ({ ...l, is_enabled: false }));
    setLines(updated);
    saveAll(updated);
  };

  const visibleLines = filter === 'all'
    ? lines
    : lines.filter(l => INSURANCE_LINE_META[l.line_slug]?.category === filter);

  const enabledCount = lines.filter(l => l.is_enabled).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insurance Lines</h1>
          <p className="text-gray-500 text-sm mt-1">
            {enabledCount} of {lines.length} enabled · {saving ? '⏳ Saving...' : '✓ Changes auto-save'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={enableAll} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--green-100)', color: 'var(--green-600)', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer' }}>
            Enable All
          </button>
          <button onClick={disableAll} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--red-100)', color: 'var(--red-600)', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer' }}>
            Disable All
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '2px solid var(--border)', paddingBottom: 2 }}>
        {[{ id: 'all', label: 'All Lines' }, ...Object.entries(CATEGORY_LABELS).map(([id, label]) => ({ id, label }))].map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)}
            style={{ padding: '8px 16px', borderRadius: '8px 8px 0 0', fontWeight: 600, fontSize: '.875rem', cursor: 'pointer', background: 'transparent', border: 'none', color: filter === tab.id ? 'var(--navy-800)' : 'var(--text-muted)', borderBottom: filter === tab.id ? '2px solid var(--navy-800)' : '2px solid transparent', marginBottom: -2 }}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {visibleLines.map(line => {
            const meta = INSURANCE_LINE_META[line.line_slug];
            if (!meta) return null;
            return (
              <div key={line.line_slug} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 10, opacity: line.is_enabled ? 1 : .6 }}>
                {/* Icon + name */}
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{meta.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '.9rem' }}>{meta.name}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{meta.category} · /insurance/{line.line_slug}</div>
                </div>

                {/* Featured toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Featured</span>
                  <button onClick={() => toggle(line.line_slug, 'is_featured')}
                    style={{ width: 36, height: 20, borderRadius: 10, background: line.is_featured ? 'var(--gold-500)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                    <span style={{ position: 'absolute', top: 2, left: line.is_featured ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s', display: 'block' }} />
                  </button>
                </div>

                {/* Enabled toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Enabled</span>
                  <button onClick={() => toggle(line.line_slug, 'is_enabled')}
                    style={{ width: 44, height: 24, borderRadius: 12, background: line.is_enabled ? 'var(--navy-800)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                    <span style={{ position: 'absolute', top: 3, left: line.is_enabled ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
