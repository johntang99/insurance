'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import { getLineName } from '@/lib/insurance/theme';

interface Agent {
  id: string;
  name: string;
  slug?: string;
  title?: string;
  photo_url?: string;
  bio?: string;
  specialties?: string[];
  languages?: string[];
  years_experience?: number;
  license_number?: string;
  phone?: string;
  email?: string;
}

interface AgentsGridProps {
  agents: Agent[];
  locale?: string;
}

export default function AgentsGrid({ agents, locale = 'en' }: AgentsGridProps) {
  const [specialty, setSpecialty] = useState('');
  const [language, setLanguage] = useState('');
  const [search, setSearch] = useState('');

  // Unique specialties + languages from all agents
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    agents.forEach(a => (a.specialties || []).forEach(s => set.add(s)));
    return Array.from(set).sort();
  }, [agents]);

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    agents.forEach(a => (a.languages || []).forEach(l => set.add(l)));
    return Array.from(set).sort();
  }, [agents]);

  const filtered = useMemo(() => {
    return agents.filter(a => {
      if (specialty && !(a.specialties || []).includes(specialty)) return false;
      if (language && !(a.languages || []).includes(language)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !(a.title || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [agents, specialty, language, search]);

  return (
    <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
      <div className="container-custom">
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap', padding: '14px 16px', background: 'var(--bg-white)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <select value={specialty} onChange={e => setSpecialty(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.875rem', background: 'var(--bg-white)', minWidth: 160 }}>
            <option value="">All Specialties</option>
            {allSpecialties.map(s => <option key={s} value={s}>{getLineName(s)}</option>)}
          </select>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.875rem', background: 'var(--bg-white)', minWidth: 140 }}>
            <option value="">All Languages</option>
            {allLanguages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <input type="text" placeholder="Search agents..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.875rem', flex: 1, minWidth: 160 }} />
          {(specialty || language || search) && (
            <button onClick={() => { setSpecialty(''); setLanguage(''); setSearch(''); }}
              style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.875rem', background: 'var(--bg-white)', cursor: 'pointer' }}>
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        {(specialty || language || search) && (
          <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', marginBottom: 20 }}>
            Showing {filtered.length} of {agents.length} agents
          </p>
        )}

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            No agents match your filters. <button onClick={() => { setSpecialty(''); setLanguage(''); setSearch(''); }} style={{ color: 'var(--gold-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="grid-1col-mobile">
            {filtered.map(agent => (
              <div key={agent.id} className="hover-lift" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                {/* Avatar */}
                {agent.photo_url ? (
                  <Image src={agent.photo_url} alt={agent.name} width={100} height={100}
                    style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border)', marginBottom: 16 }} />
                ) : (
                  <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--navy-100)', border: '3px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--navy-700)', marginBottom: 16 }}>
                    {agent.name?.charAt(0)}
                  </div>
                )}

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-800)', marginBottom: 4 }}>{agent.name}</h3>
                <p style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--gold-600)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 16 }}>{agent.title}</p>

                <div style={{ height: 1, background: 'var(--border)', width: '100%', margin: '0 0 14px' }} />

                {/* Specialties */}
                {agent.specialties && agent.specialties.length > 0 && (
                  <div style={{ marginBottom: 10, width: '100%' }}>
                    <p style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 6 }}>Specialties</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
                      {agent.specialties.map(s => (
                        <span key={s} style={{ background: 'var(--navy-50)', color: 'var(--navy-700)', fontSize: '.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: 100 }}>
                          {getLineName(s)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {agent.languages && agent.languages.length > 0 && (
                  <div style={{ marginBottom: 12, width: '100%' }}>
                    <p style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 6 }}>Languages</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
                      {agent.languages.map(l => (
                        <span key={l} style={{ background: 'var(--gold-100)', color: 'var(--gold-600)', fontSize: '.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: 100 }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {agent.years_experience && agent.years_experience > 0 && (
                  <p style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>📅 {agent.years_experience} years experience</p>
                )}
                {agent.license_number && (
                  <p style={{ fontSize: '.75rem', color: 'var(--text-light)', marginBottom: 16 }}>NY Lic. #{agent.license_number}</p>
                )}

                <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 'auto', paddingTop: 14 }}>
                  <Link href={`/${locale}/quote?agent=${agent.id}`}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gold-500)', color: '#fff', borderRadius: 8, padding: '10px', fontWeight: 600, fontSize: '.82rem', textDecoration: 'none' }}>
                    Get a Quote
                  </Link>
                  {agent.phone && (
                    <a href={`tel:${agent.phone.replace(/\D/g, '')}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 8, textDecoration: 'none', color: 'var(--navy-700)' }}>
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
