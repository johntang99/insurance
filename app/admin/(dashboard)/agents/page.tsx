'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Save, User } from 'lucide-react';
import { INSURANCE_LINE_META, getLineName } from '@/lib/insurance/theme';

interface Agent {
  id: string; site_id: string; name: string; slug: string; title?: string;
  photo_url?: string; bio?: string; specialties?: string[]; languages?: string[];
  license_number?: string; years_experience?: number; phone?: string; email?: string;
  sort_order?: number; is_active?: boolean;
}

const BLANK: Partial<Agent> = { name: '', title: '', bio: '', specialties: [], languages: ['English'], license_number: '', years_experience: 0, phone: '', email: '', is_active: true };

export default function AgentsAdminPage() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('siteId') || '';

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Agent> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/agents?siteId=${siteId}`);
    if (res.ok) {
      const data = await res.json();
      setAgents(data.agents || []);
    }
    setLoading(false);
  }, [siteId]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const openNew = () => { setEditing({ ...BLANK }); setIsNew(true); };
  const openEdit = (a: Agent) => { setEditing({ ...a }); setIsNew(false); };
  const closeEditor = () => { setEditing(null); setIsNew(false); };

  const handleSave = async () => {
    if (!editing?.name) return;
    setSaving(true);
    try {
      const slug = editing.slug || editing.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const payload = { ...editing, slug, site_id: siteId };
      const url = isNew ? '/api/admin/agents' : `/api/admin/agents/${editing.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { closeEditor(); fetchAgents(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/agents/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    fetchAgents();
  };

  const toggleSpecialty = (slug: string) => {
    setEditing(e => {
      if (!e) return e;
      const specs = e.specialties || [];
      return { ...e, specialties: specs.includes(slug) ? specs.filter(s => s !== slug) : [...specs, slug] };
    });
  };

  const updateLang = (val: string) => {
    setEditing(e => {
      if (!e) return e;
      const langs = val.split(',').map(l => l.trim()).filter(Boolean);
      return { ...e, languages: langs };
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-500 text-sm mt-1">{agents.length} licensed agents</p>
        </div>
        <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--navy-800)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: '.875rem', cursor: 'pointer' }}>
          <Plus className="w-4 h-4" /> Add Agent
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading agents...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {agents.map(agent => (
            <div key={agent.id} style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: agent.photo_url ? 'transparent' : 'var(--navy-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--navy-700)', fontSize: '1.1rem', flexShrink: 0 }}>
                  {agent.photo_url ? <img src={agent.photo_url} alt={agent.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} /> : agent.name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy-800)', fontSize: '.95rem' }}>{agent.name}</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--gold-600)', fontWeight: 600 }}>{agent.title}</div>
                  {agent.license_number && <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Lic. #{agent.license_number}</div>}
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => openEdit(agent)} style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg-white)', cursor: 'pointer' }}>
                    <Edit2 className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  </button>
                  <button onClick={() => setDeleteConfirm(agent.id)} style={{ padding: '5px 8px', border: '1px solid var(--red-100)', borderRadius: 6, background: 'var(--red-100)', cursor: 'pointer' }}>
                    <Trash2 className="w-3.5 h-3.5" style={{ color: 'var(--red-600)' }} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {(agent.specialties || []).slice(0, 3).map(s => (
                  <span key={s} style={{ background: 'var(--navy-50)', color: 'var(--navy-700)', fontSize: '.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: 100 }}>{getLineName(s)}</span>
                ))}
                {(agent.specialties || []).length > 3 && <span style={{ fontSize: '.68rem', color: 'var(--text-muted)' }}>+{(agent.specialties || []).length - 3}</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: agent.is_active ? 'var(--green-500)' : 'var(--red-500)', flexShrink: 0 }} />
                <span style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{agent.is_active ? 'Active' : 'Inactive'}</span>
                {agent.years_experience ? <span style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>· {agent.years_experience} yrs</span> : null}
              </div>
            </div>
          ))}

          {agents.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
              <User className="w-10 h-10 mx-auto mb-3" style={{ opacity: .3 }} />
              No agents yet. <button onClick={openNew} style={{ color: 'var(--gold-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Add your first agent</button>
            </div>
          )}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-white)', borderRadius: 12, padding: 32, maxWidth: 380, textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Delete this agent?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: 24 }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '8px 20px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-white)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ padding: '8px 20px', border: 'none', borderRadius: 8, background: 'var(--red-500)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Editor drawer */}
      {editing && (
        <>
          <div onClick={closeEditor} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)', zIndex: 40, backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, maxWidth: '100%', background: 'var(--bg-white)', zIndex: 50, overflowY: 'auto', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 24px', background: 'var(--navy-800)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <h2 style={{ color: '#fff', fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.1rem' }}>{isNew ? 'Add Agent' : 'Edit Agent'}</h2>
              <button onClick={closeEditor} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.7)' }}><X className="w-5 h-5" /></button>
            </div>

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              {/* Basic info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Full Name *</label>
                  <input value={editing.name || ''} onChange={e => setEditing(ed => ({ ...ed, name: e.target.value }))} className="form-input" placeholder="John Smith" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Title</label>
                  <input value={editing.title || ''} onChange={e => setEditing(ed => ({ ...ed, title: e.target.value }))} className="form-input" placeholder="Senior Broker" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Bio</label>
                <textarea value={editing.bio || ''} onChange={e => setEditing(ed => ({ ...ed, bio: e.target.value }))} className="form-textarea" rows={3} placeholder="Brief professional bio..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Phone</label>
                  <input value={editing.phone || ''} onChange={e => setEditing(ed => ({ ...ed, phone: e.target.value }))} className="form-input" placeholder="+1 (718) 555-0101" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Email</label>
                  <input type="email" value={editing.email || ''} onChange={e => setEditing(ed => ({ ...ed, email: e.target.value }))} className="form-input" placeholder="agent@pbiny.com" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>License #</label>
                  <input value={editing.license_number || ''} onChange={e => setEditing(ed => ({ ...ed, license_number: e.target.value }))} className="form-input" placeholder="NY-LIC-0012345" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Years Experience</label>
                  <input type="number" min={0} value={editing.years_experience || 0} onChange={e => setEditing(ed => ({ ...ed, years_experience: parseInt(e.target.value) || 0 }))} className="form-input" />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Specialties</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {Object.entries(INSURANCE_LINE_META).slice(0, 13).map(([slug, meta]) => {
                    const selected = (editing.specialties || []).includes(slug);
                    return (
                      <button key={slug} type="button" onClick={() => toggleSpecialty(slug)}
                        style={{ padding: '4px 10px', border: `1.5px solid ${selected ? 'var(--navy-600)' : 'var(--border)'}`, borderRadius: 100, fontSize: '.75rem', fontWeight: selected ? 700 : 400, background: selected ? 'var(--navy-50)' : 'var(--bg-white)', color: selected ? 'var(--navy-800)' : 'var(--text-muted)', cursor: 'pointer' }}>
                        {meta.icon} {meta.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Languages */}
              <div>
                <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Languages (comma-separated)</label>
                <input value={(editing.languages || []).join(', ')} onChange={e => updateLang(e.target.value)} className="form-input" placeholder="English, Spanish, Mandarin" />
              </div>

              {/* Active toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                <input type="checkbox" checked={editing.is_active !== false} onChange={e => setEditing(ed => ({ ...ed, is_active: e.target.checked }))} style={{ width: 18, height: 18 }} />
                Active (appears on agents page)
              </label>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexShrink: 0 }}>
              <button onClick={closeEditor} style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-white)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !editing.name}
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', border: 'none', borderRadius: 8, background: 'var(--gold-500)', color: '#fff', fontWeight: 700, cursor: 'pointer', opacity: saving || !editing.name ? .6 : 1 }}>
                <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Agent'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
