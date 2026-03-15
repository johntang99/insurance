import { MetadataRoute } from 'next';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestSiteId } from '@/lib/content';
import { DEFAULT_ACTIVE_LOCATIONS } from '@/lib/insurance/locations';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://pbiny.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteId = await getRequestSiteId();
  const supabase = getSupabaseServerClient();
  const locale = 'en';

  const [linesRes, blogRes] = await Promise.all([
    supabase?.from('insurance_lines').select('line_slug').eq('site_id', siteId).eq('is_enabled', true),
    supabase?.from('content_entries').select('path,updated_at').eq('site_id', siteId).eq('locale', locale).like('path', 'blog/%'),
  ]);

  const lines = linesRes?.data || [];
  const blogEntries = blogRes?.data || [];

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/${locale}`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/${locale}/insurance`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/${locale}/quote`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/${locale}/about`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/${locale}/contact`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/${locale}/resources`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/${locale}/agents`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/${locale}/carriers`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/${locale}/locations`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/${locale}/faq`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/${locale}/testimonials`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
  ];

  const servicePages: MetadataRoute.Sitemap = lines.map(l => ({
    url: `${BASE}/${locale}/insurance/${l.line_slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogEntries.map(entry => {
    const slug = entry.path.replace('blog/', '').replace('.json', '');
    return {
      url: `${BASE}/${locale}/resources/${slug}`,
      lastModified: entry.updated_at ? new Date(entry.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  // Location pages: /insurance/[slug]/[city] for each enabled line × active city
  const locationPages: MetadataRoute.Sitemap = lines.flatMap(l =>
    DEFAULT_ACTIVE_LOCATIONS.map(city => ({
      url: `${BASE}/${locale}/insurance/${l.line_slug}/${city}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...servicePages, ...locationPages, ...blogPages];
}
