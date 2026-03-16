'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface InsuranceLine {
  id?: string;
  line_slug?: string;
  slug?: string;
  name?: string;
  icon?: string;
  description?: string;
  is_featured?: boolean;
  is_enabled?: boolean;
  sort_order?: number;
  route?: string;
}

interface InsuranceLineGridProps {
  headline?: string;
  subline?: string;
  lines: InsuranceLine[];
  variant?: 'grid' | 'hub' | 'list';
  ctaLabel?: string;
  showDescriptions?: boolean;
  locale?: string;
}

const ICON_MAP: Record<string, string> = {
  auto: '🚗', car: '🚗',
  tlc: '🚕', taxi: '🚕',
  'commercial-auto': '🚛', truck: '🚛',
  homeowner: '🏠', home: '🏠',
  business: '💼', briefcase: '💼',
  'workers-comp': '🦺',
  disability: '🛡️', shield: '🛡️',
  construction: '🏗️', hammer: '🏗️',
  motorcycle: '🏍️', zap: '🏍️',
  boat: '⛵', anchor: '⛵',
  travel: '✈️', plane: '✈️',
  'group-health': '❤️', heart: '❤️',
  'commercial-property': '🏢', building: '🏢',
  dmv: '📄', file: '📄',
  notary: '✒️', pen: '✒️',
};

const LINE_META: Record<string, { name: string; description: string }> = {
  auto: { name: 'Auto Insurance', description: 'Personal vehicle coverage' },
  tlc: { name: 'TLC Insurance', description: 'NYC livery & for-hire vehicles' },
  'commercial-auto': { name: 'Commercial Auto', description: 'Fleets & business vehicles' },
  homeowner: { name: 'Homeowner', description: 'Home & property protection' },
  business: { name: 'Business (BOP)', description: 'GL, property & income' },
  'workers-comp': { name: 'Workers Comp', description: 'Required by NY employers' },
  disability: { name: 'Disability', description: 'Income protection coverage' },
  construction: { name: 'Construction', description: 'GL, builders risk & more' },
  motorcycle: { name: 'Motorcycle', description: 'Year-round or seasonal' },
  boat: { name: 'Boat Insurance', description: 'Marine & watercraft coverage' },
  travel: { name: 'Travel Insurance', description: 'Trip cancellation & medical' },
  'group-health': { name: 'Group Health', description: 'Employer-sponsored plans' },
  'commercial-property': { name: 'Commercial Property', description: 'Buildings & inventory' },
  dmv: { name: 'DMV Services', description: 'Registration & title transfers' },
  notary: { name: 'Notary Services', description: 'Document notarization' },
};

const LINE_META_ZH: Record<string, { name: string; description: string }> = {
  auto: { name: '车险', description: '个人车辆保障' },
  tlc: { name: 'TLC 保险', description: '纽约营运车保障' },
  'commercial-auto': { name: '商业车辆保险', description: '车队与商用车辆' },
  homeowner: { name: '房屋保险', description: '住宅与房产保障' },
  business: { name: '商业保险', description: '责任、财产与营业保障' },
  'workers-comp': { name: '工伤保险', description: '纽约雇主常见法定保障' },
  disability: { name: '伤残保险', description: '收入保障' },
  construction: { name: '建筑工程保险', description: '工程与责任保障' },
  motorcycle: { name: '摩托车保险', description: '季节或全年保障' },
  boat: { name: '船只保险', description: '船舶与水上设备保障' },
  travel: { name: '旅行保险', description: '行程取消与医疗保障' },
  'group-health': { name: '团体健康保险', description: '企业团体医疗方案' },
  'commercial-property': { name: '商业财产保险', description: '建筑与库存保障' },
  dmv: { name: 'DMV 服务', description: '注册与过户等办理' },
  notary: { name: '公证服务', description: '文件公证办理' },
};

export default function InsuranceLineGrid({
  headline = 'We Cover Everything',
  subline,
  lines,
  variant = 'grid',
  ctaLabel = 'Learn More',
  locale = 'en',
}: InsuranceLineGridProps) {
  const pathname = usePathname();
  const isZh = locale === 'zh';
  const ui = {
    allCoverage: isZh ? '全部险种' : 'All Coverage Types',
    ctaLabel: isZh ? '查看详情' : ctaLabel,
  };
  const cols = variant === 'hub' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';

  return (
    <section className="section section--subtle" style={{ padding: 'var(--section-y) 0', background: 'var(--bg-subtle)' }}>
      <div className="container-custom">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="section-label" style={{ display: 'inline-block', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: 12 }}>
            {ui.allCoverage}
          </p>
          <h2 className="section-heading" style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 16 }}>{headline}</h2>
          {subline && <p className="section-sub" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>{subline}</p>}
        </div>

        {/* Grid */}
        <div className={`grid ${cols} gap-4`}>
          {lines.map((line) => {
            const slug = line.line_slug || line.slug || '';
            const meta = (isZh ? LINE_META_ZH : LINE_META)[slug] || {};
            const name = line.name || meta.name || slug;
            const desc = line.description || meta.description || '';
            const icon = ICON_MAP[slug] || ICON_MAP[line.icon || ''] || '🔐';
            const href = `/${locale}/${line.route?.replace(/^\//, '') || `insurance/${slug}`}`;
            const isFeatured = line.is_featured;
            const isActive = pathname.includes(`/insurance/${slug}`);

            return (
              <Link
                key={slug}
                href={href}
                className="ins-tile group relative flex flex-col items-center text-center rounded-xl p-5 transition-all cursor-pointer"
                style={{
                  background: isActive ? 'var(--navy-800)' : 'var(--bg-white)',
                  border: isFeatured ? '1.5px solid var(--gold-500)' : '1.5px solid var(--border)',
                  borderLeft: isFeatured ? '3px solid var(--gold-500)' : undefined,
                  boxShadow: '0 1px 3px rgba(0,0,0,.06)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy-600)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.borderColor = isFeatured ? 'var(--gold-500)' : 'var(--border)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,.06)';
                  }
                }}
              >
                <span className="ins-tile-icon" style={{ fontSize: '2rem', lineHeight: 1, marginBottom: 10, display: 'block' }}>{icon}</span>
                <span className="ins-tile-name" style={{
                  fontFamily: 'var(--font-heading)', fontSize: '.9rem', fontWeight: 600,
                  color: isActive ? '#fff' : 'var(--navy-800)', marginBottom: 4, display: 'block',
                }}>{name}</span>
                {desc && (
                  <span className="ins-tile-tag" style={{ fontSize: '.76rem', color: isActive ? 'rgba(255,255,255,.7)' : 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                    {desc}
                  </span>
                )}
                <span className="ins-tile-learn" style={{
                  display: 'block', marginTop: 8, fontSize: '.78rem', fontWeight: 600,
                  color: 'var(--gold-600)', opacity: 0, transform: 'translateY(4px)',
                  transition: 'opacity .18s, transform .18s',
                }}>
                  {ui.ctaLabel} →
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .ins-tile:hover .ins-tile-learn { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </section>
  );
}
