import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent } from '@/lib/admin/permissions';
import { canUseContentDb, listContentEntriesForSite, upsertContentEntry } from '@/lib/contentDb';
import { normalizeBlogPostForPublish, isBlogPostDue } from '@/lib/blog';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SITES_CONFIG_PATH = path.join(CONTENT_DIR, '_sites.json');

async function listSiteIds(): Promise<string[]> {
  try {
    const raw = await fs.readFile(SITES_CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as { sites?: Array<{ id?: string; enabled?: boolean }> };
    return Array.isArray(parsed.sites)
      ? parsed.sites.filter((site) => site?.id && site.enabled !== false).map((site) => String(site.id))
      : [];
  } catch {
    return [];
  }
}

async function listBlogFilesForSite(siteId: string): Promise<Array<{ locale: string; path: string; data: any }>> {
  const results: Array<{ locale: string; path: string; data: any }> = [];
  for (const locale of ['en', 'zh']) {
    const blogDir = path.join(CONTENT_DIR, siteId, locale, 'blog');
    try {
      const files = await fs.readdir(blogDir);
      for (const file of files.filter((entry) => entry.endsWith('.json'))) {
        const filePath = path.join(blogDir, file);
        try {
          const raw = await fs.readFile(filePath, 'utf-8');
          results.push({ locale, path: `blog/${file}`, data: JSON.parse(raw) });
        } catch {
          // ignore bad file
        }
      }
    } catch {
      // ignore missing locale dir
    }
  }
  return results;
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || !canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json().catch(() => ({}));
  const requestedSiteId = typeof payload.siteId === 'string' ? payload.siteId : '';
  const siteIds = requestedSiteId ? [requestedSiteId] : await listSiteIds();
  const now = new Date();
  const published: Array<{ siteId: string; locale: string; path: string; title?: string }> = [];

  for (const siteId of siteIds) {
    if (canUseContentDb()) {
      const entries = await listContentEntriesForSite(siteId);
      for (const entry of entries.filter((item) => item.path.startsWith('blog/'))) {
        const data = entry.data as any;
        if (!isBlogPostDue(data, now)) continue;
        const normalized = normalizeBlogPostForPublish(data);
        await upsertContentEntry({
          siteId,
          locale: entry.locale,
          path: entry.path,
          data: normalized,
          updatedBy: session.user.email,
        });
        const resolved = path.join(CONTENT_DIR, siteId, entry.locale, entry.path);
        try {
          await fs.mkdir(path.dirname(resolved), { recursive: true });
          await fs.writeFile(resolved, JSON.stringify(normalized, null, 2));
        } catch {
          // best-effort file sync
        }
        published.push({ siteId, locale: entry.locale, path: entry.path, title: normalized.title });
      }
      continue;
    }

    const files = await listBlogFilesForSite(siteId);
    for (const file of files) {
      if (!isBlogPostDue(file.data, now)) continue;
      const normalized = normalizeBlogPostForPublish(file.data);
      const resolved = path.join(CONTENT_DIR, siteId, file.locale, file.path);
      await fs.writeFile(resolved, JSON.stringify(normalized, null, 2));
      published.push({ siteId, locale: file.locale, path: file.path, title: normalized.title });
    }
  }

  return NextResponse.json({
    success: true,
    count: published.length,
    published,
    message: published.length
      ? `Published ${published.length} scheduled blog post${published.length === 1 ? '' : 's'}.`
      : 'No scheduled blog posts were due.',
  });
}
