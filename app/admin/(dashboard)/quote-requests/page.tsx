'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Phone, Mail, Eye, X, CheckCircle, Clock, FileText, Inbox } from 'lucide-react';
import { STATUS_COLORS, getLineName } from '@/lib/insurance/theme';

interface Lead {
  id: string;
  site_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  coverage_types: string[];
  preferred_language?: string;
  best_contact_time?: string;
  message?: string;
  details?: Record<string, unknown>;
  status: string;
  assigned_agent_id?: string;
  notes?: string;
  source?: string;
  created_at: string;
  agents?: { name: string; email: string };
}

interface Agent { id: string; name: string; }

const STATUS_OPTIONS = ['new', 'contacted', 'quoted', 'bound', 'closed', 'lost'];
const SOURCE_LABELS: Record<string, string> = {
  quote_page: 'Quote Page', home_cta: 'Home CTA', contact_form: 'Contact Form',
  service_page: 'Service Page', website: 'Website',
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 100, fontSize: '.75rem', fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function QuoteRequestsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [drawerNotes, setDrawerNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const siteId = searchParams.get('siteId') || '';
  const statusFilter = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (siteId) params.set('siteId', siteId);
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('limit', '50');
      const res = await fetch(`/api/admin/quote-requests?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setTotal(data.total || 0);
        setStats(data.stats || {});
      }
    } finally {
      setLoading(false);
    }
  }, [siteId, statusFilter, search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    if (!siteId) return;
    fetch(`/api/admin/agents?siteId=${siteId}`).then(r => r.json()).then(d => setAgents(d.agents || []));
  }, [siteId]);

  const updateLead = async (id: string, patch: Partial<Lead>) => {
    await fetch(`/api/admin/quote-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    setLeads(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l));
    if (activeLead?.id === id) setActiveLead(l => l ? { ...l, ...patch } : l);
  };

  const saveNotes = async () => {
    if (!activeLead) return;
    setSavingNotes(true);
    await updateLead(activeLead.id, { notes: drawerNotes });
    setSavingNotes(false);
  };

  const setFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.push(`?${p.toString()}`);
  };

  const statusCounts = STATUS_OPTIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = stats[s] || 0;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            {total} total · {statusCounts.new || 0} new leads waiting
          </p>
        </div>
      </div>

      {/* Status summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { key: 'new',       label: 'New Leads',  icon: <Inbox className="w-5 h-5" /> },
          { key: 'contacted', label: 'Contacted',  icon: <Phone className="w-5 h-5" /> },
          { key: 'quoted',    label: 'Quoted',     icon: <FileText className="w-5 h-5" /> },
          { key: 'bound',     label: 'Bound',      icon: <CheckCircle className="w-5 h-5" /> },
        ].map(({ key, label, icon }) => {
          const c = STATUS_COLORS[key];
          const count = statusCounts[key] || 0;
          const active = statusFilter === key;
          return (
            <button key={key} onClick={() => setFilter('status', active ? '' : key)}
              style={{ background: active ? c.bg : 'var(--bg-white)', border: `1.5px solid ${active ? c.dot : 'var(--border)'}`, borderRadius: 12, padding: '18px 20px', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: c.color, lineHeight: 1, marginBottom: 4, fontFamily: 'var(--font-heading)' }}>{count}</div>
                <div style={{ fontSize: '.82rem', fontWeight: 600, color: active ? c.color : 'var(--text-muted)' }}>{label}</div>
              </div>
              <div style={{ color: c.dot }}>{icon}</div>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, padding: '14px 16px', background: 'var(--bg-subtle)', borderRadius: 10, border: '1px solid var(--border)' }}>
        <select value={statusFilter} onChange={e => setFilter('status', e.target.value)}
          style={{ padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: '.875rem', background: 'var(--bg-white)', minWidth: 130 }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <input type="text" placeholder="Search name, phone, email..." value={search}
          onChange={e => setFilter('search', e.target.value)}
          style={{ padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: '.875rem', flex: 1, minWidth: 200, background: 'var(--bg-white)' }} />
        {(statusFilter || search) && (
          <button onClick={() => { setFilter('status', ''); setFilter('search', ''); }}
            style={{ padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 6, fontSize: '.875rem', background: 'var(--bg-white)', cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading leads...</div>
      ) : leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
          <Inbox className="w-10 h-10 mx-auto mb-3" style={{ opacity: .3 }} />
          No quote requests found.
        </div>
      ) : (
        <div style={{ background: 'var(--bg-white)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                {['Date', 'Name', 'Phone', 'Coverage', 'Source', 'Agent', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => {
                const isNew = lead.status === 'new';
                return (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)', background: isNew ? '#fffbeb' : i % 2 === 0 ? 'var(--bg-white)' : 'var(--bg-subtle)' }}>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: '.78rem', whiteSpace: 'nowrap' }}>
                      {formatDate(lead.created_at)}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: isNew ? 700 : 400, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {lead.first_name} {lead.last_name}
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      <a href={`tel:${lead.phone}`} style={{ color: 'var(--navy-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone className="w-3 h-3" />{lead.phone}
                      </a>
                    </td>
                    <td style={{ padding: '10px 14px', maxWidth: 180 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {(lead.coverage_types || []).slice(0, 3).map(s => (
                          <span key={s} style={{ background: 'var(--navy-50)', color: 'var(--navy-700)', fontSize: '.7rem', fontWeight: 600, padding: '2px 7px', borderRadius: 100 }}>
                            {getLineName(s)}
                          </span>
                        ))}
                        {(lead.coverage_types || []).length > 3 && (
                          <span style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>+{(lead.coverage_types || []).length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '.72rem', color: 'var(--text-muted)', background: 'var(--bg-light)', padding: '2px 8px', borderRadius: 100 }}>
                        {SOURCE_LABELS[lead.source || ''] || lead.source || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <select value={lead.assigned_agent_id || ''} onChange={e => updateLead(lead.id, { assigned_agent_id: e.target.value || undefined })}
                        style={{ fontSize: '.78rem', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', background: 'var(--bg-white)', maxWidth: 130 }}>
                        <option value="">Unassigned</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <select value={lead.status}
                        onChange={e => updateLead(lead.id, { status: e.target.value })}
                        style={{ fontSize: '.78rem', border: `1.5px solid ${STATUS_COLORS[lead.status]?.dot || 'var(--border)'}`, borderRadius: 6, padding: '3px 8px', background: STATUS_COLORS[lead.status]?.bg || 'var(--bg-white)', color: STATUS_COLORS[lead.status]?.color || 'var(--text-primary)', fontWeight: 600 }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => { setActiveLead(lead); setDrawerNotes(lead.notes || ''); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg-white)', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', color: 'var(--navy-700)' }}>
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {activeLead && (
        <>
          {/* Overlay */}
          <div onClick={() => setActiveLead(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)', zIndex: 40, backdropFilter: 'blur(2px)' }} />
          {/* Drawer */}
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, maxWidth: '100%', background: 'var(--bg-white)', boxShadow: 'var(--shadow-lg)', zIndex: 50, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--navy-800)' }}>
              <h2 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', margin: 0 }}>
                {activeLead.first_name} {activeLead.last_name}
              </h2>
              <button onClick={() => setActiveLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.7)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ padding: 24, flex: 1 }}>
              {/* Status quick actions */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                  { s: 'contacted', label: 'Mark Contacted' },
                  { s: 'quoted',    label: 'Mark Quoted' },
                  { s: 'bound',     label: 'Mark Bound' },
                ].map(({ s, label }) => {
                  const c = STATUS_COLORS[s];
                  return (
                    <button key={s} onClick={() => updateLead(activeLead.id, { status: s })}
                      style={{ padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${c.dot}`, background: c.bg, color: c.color, fontSize: '.78rem', fontWeight: 700, cursor: 'pointer' }}>
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Contact info */}
              <section style={{ marginBottom: 20 }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 12, fontSize: '.9rem' }}>Contact Information</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '.875rem' }}>
                  {[
                    { label: 'Phone', value: <a href={`tel:${activeLead.phone}`} style={{ color: 'var(--navy-700)', fontWeight: 600 }}>{activeLead.phone}</a> },
                    { label: 'Email', value: activeLead.email ? <a href={`mailto:${activeLead.email}`} style={{ color: 'var(--navy-700)' }}>{activeLead.email}</a> : '—' },
                    { label: 'Best Time', value: activeLead.best_contact_time || '—' },
                    { label: 'Language', value: activeLead.preferred_language || 'English' },
                    { label: 'Submitted', value: formatDate(activeLead.created_at) },
                    { label: 'Source', value: SOURCE_LABELS[activeLead.source || ''] || activeLead.source || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ width: 80, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 600, fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
                      <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Coverage */}
              <section style={{ marginBottom: 20 }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 10, fontSize: '.9rem' }}>Coverage Requested</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(activeLead.coverage_types || []).map(s => (
                    <span key={s} style={{ background: 'var(--navy-50)', color: 'var(--navy-700)', fontSize: '.78rem', fontWeight: 600, padding: '4px 12px', borderRadius: 100 }}>
                      {getLineName(s)}
                    </span>
                  ))}
                </div>
              </section>

              {/* Details */}
              {activeLead.details && Object.keys(activeLead.details).some(k => (activeLead.details as any)[k]) && (
                <section style={{ marginBottom: 20 }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 10, fontSize: '.9rem' }}>Additional Details</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '.85rem' }}>
                    {Object.entries(activeLead.details || {}).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', gap: 12 }}>
                        <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: 130, fontSize: '.78rem' }}>
                          {k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                        </span>
                        <span style={{ color: 'var(--text-primary)' }}>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                  {(activeLead.details as any)?.message && (
                    <blockquote style={{ background: 'var(--bg-subtle)', borderLeft: '3px solid var(--gold-500)', padding: '10px 14px', margin: '12px 0 0', borderRadius: '0 8px 8px 0', fontSize: '.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {(activeLead.details as any).message}
                    </blockquote>
                  )}
                </section>
              )}

              {/* Management */}
              <section style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 14, fontSize: '.9rem' }}>Management</h4>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Status</label>
                  <select value={activeLead.status} onChange={e => updateLead(activeLead.id, { status: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.875rem', background: 'var(--bg-white)' }}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Assigned Agent</label>
                  <select value={activeLead.assigned_agent_id || ''} onChange={e => updateLead(activeLead.id, { assigned_agent_id: e.target.value || undefined })}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.875rem', background: 'var(--bg-white)' }}>
                    <option value="">Unassigned</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Agent Notes</label>
                  <textarea value={drawerNotes} onChange={e => setDrawerNotes(e.target.value)} rows={4}
                    placeholder="Add internal notes about this lead..."
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.875rem', resize: 'vertical', outline: 'none', fontFamily: 'var(--font-body)' }} />
                  <button onClick={saveNotes} disabled={savingNotes}
                    style={{ marginTop: 8, padding: '8px 18px', background: 'var(--navy-800)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
