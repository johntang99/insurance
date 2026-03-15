'use client';

import { useState, useMemo } from 'react';
import { getLineName } from '@/lib/insurance/theme';

interface Testimonial {
  id: string;
  quote?: string;
  content?: string;
  name?: string;
  author_name?: string;
  coverage_type?: string;
  rating?: number;
  is_featured?: boolean;
  source?: string;
}

interface TestimonialsFilterProps {
  testimonials: Testimonial[];
}

export default function TestimonialsFilter({ testimonials }: TestimonialsFilterProps) {
  const [coverageFilter, setCoverageFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [search, setSearch] = useState('');

  const coverageTypes = useMemo(() => {
    const set = new Set<string>();
    testimonials.forEach(t => { if (t.coverage_type) set.add(t.coverage_type); });
    return Array.from(set).sort();
  }, [testimonials]);

  const filtered = useMemo(() => {
    return testimonials.filter(t => {
      if (coverageFilter && t.coverage_type !== coverageFilter) return false;
      if (ratingFilter === '5' && (t.rating || 5) < 5) return false;
      if (ratingFilter === '4' && (t.rating || 5) < 4) return false;
      if (search) {
        const q = search.toLowerCase();
        const text = ((t.quote || t.content || '') + ' ' + (t.name || t.author_name || '')).toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [testimonials, coverageFilter, ratingFilter, search]);

  const featured = filtered.filter(t => t.is_featured);
  const rest = filtered.filter(t => !t.is_featured);

  return (
    <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
      <div className="container-custom">
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36, padding: '14px 16px', background: 'var(--bg-subtle)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <select value={coverageFilter} onChange={e => setCoverageFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.875rem', minWidth: 160, background: 'var(--bg-white)' }}>
            <option value="">All Coverage Types</option>
            {coverageTypes.map(c => <option key={c} value={c}>{getLineName(c)}</option>)}
          </select>
          <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.875rem', minWidth: 130, background: 'var(--bg-white)' }}>
            <option value="">All Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4+ Stars</option>
          </select>
          <input type="text" placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.875rem', flex: 1, minWidth: 180 }} />
          {(coverageFilter || ratingFilter || search) && (
            <button onClick={() => { setCoverageFilter(''); setRatingFilter(''); setSearch(''); }}
              style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.875rem', background: 'var(--bg-white)', cursor: 'pointer' }}>
              Clear
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <p>No reviews found for this filter.</p>
            <button onClick={() => { setCoverageFilter(''); setRatingFilter(''); setSearch(''); }}
              style={{ color: 'var(--gold-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>
              Clear filters →
            </button>
          </div>
        ) : (
          <>
            {/* Masonry-style 3-col grid using CSS columns */}
            <div style={{ columns: '3 280px', columnGap: 24 }}>
              {filtered.map(t => {
                const text = t.quote || t.content || '';
                const name = t.name || t.author_name || 'Anonymous';
                const rating = t.rating || 5;
                const isFeatured = t.is_featured;
                return (
                  <div key={t.id}
                    style={{ breakInside: 'avoid', marginBottom: 20, background: 'var(--bg-white)', border: isFeatured ? '2px solid var(--gold-400)' : '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={{ color: 'var(--gold-500)', letterSpacing: 2, fontSize: '.9rem' }}>{'★'.repeat(rating)}</span>
                      {isFeatured && <span style={{ background: 'var(--gold-100)', color: 'var(--gold-600)', fontSize: '.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>Featured</span>}
                    </div>
                    <p style={{ fontSize: '.9375rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 16 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--gold-300)', lineHeight: 0, verticalAlign: '-.5rem' }}>&ldquo;</span>
                      {text}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text-primary)' }}>— {name}</span>
                      {t.coverage_type && (
                        <span style={{ background: 'var(--navy-50)', color: 'var(--navy-700)', fontSize: '.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: 100 }}>
                          {getLineName(t.coverage_type)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '.875rem', marginTop: 24 }}>
              Showing {filtered.length} review{filtered.length !== 1 ? 's' : ''}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
