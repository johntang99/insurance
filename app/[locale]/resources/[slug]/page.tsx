import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadSiteInfo, loadItemBySlug, loadAllItems } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getLineName } from '@/lib/insurance/theme';

interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  category?: string;
  coverImage?: string;
  body?: string;
  author?: string;
  tags?: string[];
}

interface PageProps { params: { locale: Locale; slug: string } }

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();
  const [post, siteInfo] = await Promise.all([
    loadItemBySlug<BlogPost>(siteId, locale, 'blog', slug),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: `resources/${slug}`,
    title: post?.title ? `${post.title} | ${siteName}` : `Article | ${siteName}`,
    description: post?.excerpt || `Read this insurance guide from ${siteName}.`,
  });
}

export default async function ResourceArticlePage({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();

  const [post, siteInfo, allPosts] = await Promise.all([
    loadItemBySlug<BlogPost>(siteId, locale, 'blog', slug),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
    loadAllItems<BlogPost>(siteId, locale, 'blog'),
  ]);

  if (!post) notFound();

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');

  // Related articles (same category, exclude current)
  const related = allPosts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3);

  const bodyText = post.body && post.body !== '[Full article content coming in Phase 2]'
    ? post.body
    : null;
  const normalizedBody = bodyText
    ? bodyText.replace(/\r\n/g, '\n').trim()
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        author: { '@type': 'Organization', name: post.author || siteName },
        datePublished: post.publishedAt,
        publisher: { '@type': 'Organization', name: siteName },
      }) }} />

      <main>
        {/* Article hero */}
        <section style={{ background: 'var(--navy-800)', padding: '48px 0 36px' }}>
          <div className="container-custom">
            <Link href={`/${locale}/resources`} style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
              ← Resource Center
            </Link>
            {post.category && (
              <span style={{ display: 'inline-block', background: 'rgba(201,147,58,.2)', color: 'var(--gold-300)', fontSize: '.78rem', fontWeight: 700, padding: '4px 12px', borderRadius: 100, marginBottom: 14 }}>
                {post.category}
              </span>
            )}
            <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', lineHeight: 1.2, marginBottom: 16, maxWidth: 700 }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', gap: 16, color: 'rgba(255,255,255,.55)', fontSize: '.85rem' }}>
              {post.author && <span>By {post.author}</span>}
              {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
              <span>5 min read</span>
            </div>
          </div>
        </section>

        <section style={{ padding: '48px 0 64px', background: 'var(--bg-white)' }}>
          <div className="container-custom">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48, alignItems: 'start' }} className="article-layout">
              {/* Article content */}
              <article>
                {post.excerpt && <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 32, fontStyle: 'italic', borderLeft: '3px solid var(--gold-500)', paddingLeft: 20 }}>{post.excerpt}</p>}

                {bodyText ? (
                  <div style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: (props) => <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1.6rem', margin: '1.8em 0 0.7em' }} {...props} />,
                        h3: (props) => <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1.25rem', margin: '1.4em 0 0.6em' }} {...props} />,
                        p: (props) => <p style={{ marginBottom: '1.25em' }} {...props} />,
                        ul: (props) => <ul style={{ marginBottom: '1.25em', paddingLeft: '1.2em', listStyle: 'disc' }} {...props} />,
                        ol: (props) => <ol style={{ marginBottom: '1.25em', paddingLeft: '1.2em', listStyle: 'decimal' }} {...props} />,
                        li: (props) => <li style={{ marginBottom: '0.5em' }} {...props} />,
                        table: (props) => (
                          <div style={{ overflowX: 'auto', margin: '1.5em 0' }}>
                            <table
                              style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                minWidth: '680px',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                overflow: 'hidden',
                              }}
                              {...props}
                            />
                          </div>
                        ),
                        thead: (props) => <thead style={{ background: 'var(--navy-50)' }} {...props} />,
                        th: (props) => (
                          <th
                            style={{
                              border: '1px solid var(--border)',
                              padding: '0.7rem 0.8rem',
                              textAlign: 'left',
                              color: 'var(--navy-800)',
                              fontWeight: 700,
                              verticalAlign: 'top',
                              lineHeight: 1.4,
                            }}
                            {...props}
                          />
                        ),
                        td: (props) => (
                          <td
                            style={{
                              border: '1px solid var(--border)',
                              padding: '0.7rem 0.8rem',
                              verticalAlign: 'top',
                              lineHeight: 1.6,
                            }}
                            {...props}
                          />
                        ),
                      }}
                    >
                      {normalizedBody || ''}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2rem', marginBottom: 16 }}>📝</p>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 8 }}>Full Article Coming Soon</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>This article is being prepared by our team. In the meantime, our licensed agents are happy to answer your questions directly.</p>
                    <a href={phoneHref} style={{ color: 'var(--gold-600)', fontWeight: 700 }}>{phone}</a>
                  </div>
                )}

                {/* Inline CTA */}
                <div style={{ background: 'var(--gold-100)', border: '2px solid var(--gold-400)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', margin: '40px 0', display: 'flex', gap: 20, alignItems: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>💡</span>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--navy-800)', marginBottom: 6 }}>Ready to get coverage? We&apos;ll find your best rate in 2 hours.</p>
                    <Link href={`/${locale}/quote`} className="btn-gold-sm">Get a Free Quote →</Link>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', fontSize: '.78rem', padding: '4px 12px', borderRadius: 100, border: '1px solid var(--border)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>

              {/* Sidebar */}
              <aside style={{ position: 'sticky', top: '2rem' }}>
                {/* Quote CTA */}
                <div style={{ background: 'var(--navy-800)', borderRadius: 'var(--radius-lg)', padding: '28px 24px', marginBottom: 20 }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 8 }}>Ready for a Quote?</h4>
                  <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.875rem', marginBottom: 20, lineHeight: 1.6 }}>
                    Free quote in minutes. We compare 30+ carriers for you.
                  </p>
                  <Link href={`/${locale}/quote`} className="btn-gold" style={{ display: 'block', textAlign: 'center', width: '100%' }}>
                    Get a Free Quote
                  </Link>
                  <a href={phoneHref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, color: 'rgba(255,255,255,.7)', fontSize: '.85rem', fontWeight: 600 }}>
                    📞 {phone}
                  </a>
                </div>

                {/* Related service tile */}
                {post.category && (
                  <Link href={`/${locale}/insurance/${post.category}`}
                    style={{ display: 'block', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', marginBottom: 20, textDecoration: 'none' }}>
                    <p style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 6 }}>Related Coverage</p>
                    <p style={{ fontWeight: 700, color: 'var(--navy-800)', fontSize: '.95rem' }}>{getLineName(post.category)} →</p>
                  </Link>
                )}

                {/* Related articles */}
                {related.length > 0 && (
                  <div>
                    <p style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 12 }}>Related Articles</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {related.map(r => (
                        <Link key={r.slug} href={`/${locale}/resources/${r.slug}`}
                          style={{ display: 'block', padding: '12px 14px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none' }}>
                          <p style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--navy-800)', lineHeight: 1.35 }}>{r.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* Related articles below content */}
        {related.length > 0 && (
          <section style={{ padding: '48px 0', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
            <div className="container-custom">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 24 }}>You Might Also Like</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="grid-1col-mobile">
                {related.map(r => (
                  <Link key={r.slug} href={`/${locale}/resources/${r.slug}`}
                    style={{ display: 'block', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', textDecoration: 'none' }}
                    className="hover-lift">
                    <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', fontSize: '1rem', marginBottom: 8 }}>{r.title}</h4>
                    {r.excerpt && <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.excerpt}</p>}
                    <span style={{ display: 'inline-block', marginTop: 12, color: 'var(--gold-600)', fontWeight: 600, fontSize: '.8rem' }}>Read more →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .article-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
