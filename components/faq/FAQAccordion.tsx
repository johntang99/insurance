'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem { category: string; question: string; answer: string; }
interface FAQCategory { id: string; label: string; }

interface FAQAccordionProps {
  items: FAQItem[];
  categories: FAQCategory[];
  phone?: string;
  phoneHref?: string;
}

export default function FAQAccordion({ items, categories, phone, phoneHref }: FAQAccordionProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (activeTab !== 'all' && item.category !== activeTab) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!item.question.toLowerCase().includes(q) && !item.answer.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [items, activeTab, search]);

  const grouped = useMemo(() => {
    if (activeTab !== 'all' || search) return { _: filtered };
    const groups: Record<string, FAQItem[]> = {};
    categories.forEach(c => {
      const catItems = filtered.filter(i => i.category === c.id);
      if (catItems.length > 0) groups[c.id] = catItems;
    });
    const rest = filtered.filter(i => !categories.find(c => c.id === i.category));
    if (rest.length > 0) groups._other = rest;
    return groups;
  }, [filtered, activeTab, search, categories]);

  const getCategoryLabel = (id: string) =>
    categories.find(c => c.id === id)?.label || id;

  const toggle = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
      <div className="container-custom" style={{ maxWidth: 860 }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <Search className="w-4 h-4" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search FAQ..." value={search}
            onChange={e => { setSearch(e.target.value); if (e.target.value) setActiveTab('all'); }}
            style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '1rem', outline: 'none', background: 'var(--bg-white)' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Category tabs */}
        {!search && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 32, overflowX: 'auto', paddingBottom: 2, borderBottom: '2px solid var(--border)', flexWrap: 'nowrap' }}>
            {[{ id: 'all', label: 'All' }, ...categories].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '9px 18px', borderRadius: '8px 8px 0 0', fontWeight: 600, fontSize: '.875rem', cursor: 'pointer',
                  background: 'transparent', border: 'none', whiteSpace: 'nowrap',
                  color: activeTab === tab.id ? 'var(--navy-800)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--navy-800)' : '2px solid transparent',
                  marginBottom: -2, transition: 'color .15s',
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <p>No results for &ldquo;{search}&rdquo;.</p>
            <button onClick={() => setSearch('')} style={{ color: 'var(--gold-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>
              Browse all questions
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([catId, catItems]) => (
            <div key={catId} style={{ marginBottom: 32 }}>
              {(activeTab === 'all' && !search && catId !== '_') && (
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1.1rem', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  {getCategoryLabel(catId)}
                </h3>
              )}
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {catItems.map((item, i) => {
                  const key = `${catId}-${i}`;
                  const isOpen = openItems[key];
                  return (
                    <div key={key} style={{ borderBottom: i < catItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <button onClick={() => toggle(key)}
                        style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '18px 20px', background: isOpen ? 'var(--navy-50)' : 'var(--bg-white)',
                          border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .15s',
                          gap: 12,
                        }}>
                        <span style={{ fontWeight: 600, color: isOpen ? 'var(--navy-800)' : 'var(--text-primary)', fontSize: '.9375rem', lineHeight: 1.4 }}>
                          {item.question}
                        </span>
                        {isOpen
                          ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold-500)' }} />
                          : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />}
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 20px 18px', background: 'var(--navy-50)' }}>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '.9375rem', lineHeight: 1.75, marginBottom: 10 }}>
                            {item.answer}
                          </p>
                          {phone && (
                            <a href={phoneHref} style={{ fontSize: '.82rem', color: 'var(--gold-600)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              📞 Still have questions? Call us: {phone}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
