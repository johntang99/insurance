'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, StarOff } from 'lucide-react';

interface Carrier { id: string; name: string; slug: string; logo_url?: string; website?: string; description?: string; category?: string; }
interface SiteCarrier { carrier_id: string; is_featured: boolean; sort_order: number; }

export default function CarriersAdminPage() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('siteId') || '';

  const [allCarriers, setAllCarriers] = useState<Carrier[]>([]);
  const [siteCarriers, setSiteCarriers] = useState<SiteCarrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    const [carrRes, siteRes] = await Promise.all([
      fetch('/api/admin/carriers').then(r => r.json()),
      fetch(`/api/admin/site-carriers?siteId=${siteId}`).then(r => r.json()),
    ]);
    setAllCarriers(carrRes.carriers || []);
    const existing: Array<{ carrier_id: string; sort_order: number; is_featured: boolean }> = (siteRes.siteCarriers || []).map((sc: any) => ({
      carrier_id: sc.carrier_id,
      sort_order: sc.sort_order,
      is_featured: sc.is_featured,
    }));
    setSiteCarriers(existing);
    setLoading(false);
  }, [siteId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isAssigned = (id: string) => siteCarriers.some(sc => sc.carrier_id === id);
  const isFeatured = (id: string) => siteCarriers.find(sc => sc.carrier_id === id)?.is_featured || false;

  const toggleAssign = (id: string) => {
    if (isAssigned(id)) {
      setSiteCarriers(prev => prev.filter(sc => sc.carrier_id !== id));
    } else {
      setSiteCarriers(prev => [...prev, { carrier_id: id, is_featured: false, sort_order: prev.length + 1 }]);
    }
  };

  const toggleFeatured = (id: string) => {
    setSiteCarriers(prev => prev.map(sc => sc.carrier_id === id ? { ...sc, is_featured: !sc.is_featured } : sc));
  };

  const saveAssignments = async () => {
    setSaving(true);
    await fetch('/api/admin/site-carriers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, assignments: siteCarriers }),
    });
    setSaving(false);
  };

  const assigned = allCarriers.filter(c => isAssigned(c.id));
  const unassigned = allCarriers.filter(c => !isAssigned(c.id));

  const categories = [...new Set(allCarriers.map(c => c.category || 'general'))];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carrier Partners</h1>
          <p className="text-gray-500 text-sm mt-1">{assigned.length} carriers assigned to this site</p>
        </div>
        <button onClick={saveAssignments} disabled={saving}
          style={{ padding: '10px 20px', background: 'var(--gold-500)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.875rem', cursor: 'pointer', opacity: saving ? .6 : 1 }}>
          {saving ? 'Saving...' : '✓ Save Assignments'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Assigned carriers */}
        <div>
          <h3 style={{ fontWeight: 700, color: 'var(--navy-800)', marginBottom: 12, fontSize: '.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: 'var(--navy-800)', color: '#fff', borderRadius: 100, width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '.72rem', fontWeight: 700 }}>{assigned.length}</span>
            Assigned to Site
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {assigned.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 8 }}>
                <div style={{ flex: 1, fontWeight: 600, fontSize: '.875rem', color: 'var(--navy-800)' }}>{c.name}</div>
                <button onClick={() => toggleFeatured(c.id)} title={isFeatured(c.id) ? 'Remove featured' : 'Set as featured'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  {isFeatured(c.id)
                    ? <Star className="w-4 h-4" style={{ color: 'var(--gold-500)', fill: 'var(--gold-500)' }} />
                    : <StarOff className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                </button>
                <button onClick={() => toggleAssign(c.id)} style={{ background: 'var(--red-100)', color: 'var(--red-600)', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: '.72rem', fontWeight: 700, cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
            {assigned.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', padding: '12px 0' }}>No carriers assigned. Add from the right panel.</p>}
          </div>
        </div>

        {/* Available carriers */}
        <div>
          <h3 style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, fontSize: '.9rem' }}>All Available Carriers</h3>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>Loading...</p>
          ) : (
            categories.map(cat => {
              const catCarriers = unassigned.filter(c => (c.category || 'general') === cat);
              if (catCarriers.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 6 }}>{cat}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {catCarriers.map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 8 }}>
                        <div style={{ flex: 1, fontSize: '.875rem', color: 'var(--text-secondary)' }}>{c.name}</div>
                        <button onClick={() => toggleAssign(c.id)} style={{ background: 'var(--green-100)', color: 'var(--green-600)', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: '.72rem', fontWeight: 700, cursor: 'pointer' }}>
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <p style={{ marginTop: 20, fontSize: '.8rem', color: 'var(--text-muted)' }}>
        ⭐ Star = Featured (shows prominently in carousel). Click Save to apply changes.
      </p>
    </div>
  );
}
