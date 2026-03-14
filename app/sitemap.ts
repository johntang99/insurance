import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { getBaseUrlFromHost } from '@/lib/seo';
import { getDefaultSite, getSiteByHost } from '@/lib/sites';
import { locales, type Locale } from '@/lib/i18n';
import { isBlogPostVisible } from '@/lib/blog';

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function listJsonSlugs(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace(/\.json$/, ''));
  } catch (error) {
    return [];
  }
}

async function listPageSlugs(siteId: string, locale: Locale) {
  const pagesDir = path.join(CONTENT_DIR, siteId, locale, 'pages');
  const slugs = await listJsonSlugs(pagesDir);
  const excluded = /-(copy|new)$/;
  return slugs.filter((slug) => slug !== 'home' && !excluded.test(slug));
}

async function listBlogSlugs(siteId: string, locale: Locale) {
  const blogDir = path.join(CONTENT_DIR, siteId, locale, 'blog');
  try {
    const files = await fs.readdir(blogDir);
    const visible: string[] = [];
    for (const file of files.filter((entry) => entry.endsWith('.json'))) {
      const fullPath = path.join(blogDir, file);
      try {
        const raw = await fs.readFile(fullPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (isBlogPostVisible(parsed)) {
          visible.push(file.replace(/\.json$/, ''));
        }
      } catch {
        // ignore invalid blog JSON
      }
    }
    return visible;
  } catch (error) {
    return [];
  }
}

async function getLastModified(filePath: string): Promise<Date | undefined> {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime;
  } catch (error) {
    return undefined;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = headers().get('host');
  const baseUrl = getBaseUrlFromHost(host);
  const site = (await getSiteByHost(host)) || (await getDefaultSite());

  if (!site) {
    return [];
  }

  const entries: MetadataRoute.Sitemap = [];
  const siteLocales = site.supportedLocales?.length ? site.supportedLocales : locales;

  for (const locale of siteLocales) {
    // Home
    entries.push({
      url: new URL(`/${locale}`, baseUrl).toString(),
      lastModified: new Date(),
    });

    // Pages
    const pageSlugs = await listPageSlugs(site.id, locale);
    for (const slug of pageSlugs) {
      entries.push({
        url: new URL(`/${locale}/${slug}`, baseUrl).toString(),
        lastModified: new Date(),
      });
    }

    // Blog posts
    const blogSlugs = await listBlogSlugs(site.id, locale);
    for (const slug of blogSlugs) {
      entries.push({
        url: new URL(`/${locale}/blog/${slug}`, baseUrl).toString(),
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
