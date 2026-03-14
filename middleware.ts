// ============================================
// MIDDLEWARE - i18n Routing & Site Detection
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';
import { resolveStoreSlugForHost } from './lib/store-map';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Attach x-store-slug to every request so shop rewrites forward it to pureherbhealth.
  // Resolves: env var → static map → DB (site_domains + sites.herb_store_slug).
  // The DB fallback means new sites added via admin are picked up automatically.
  const storeSlug = await resolveStoreSlugForHost(request.headers.get('host'));
  const requestHeaders = new Headers(request.headers);
  if (storeSlug) requestHeaders.set('x-store-slug', storeSlug);

  // Admin routes: require auth cookie (verify in API/routes)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Skip middleware for static files, API routes, and admin
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname === '/icon' ||
    pathname.startsWith('/icon/') ||
    pathname === '/apple-icon' ||
    pathname.startsWith('/apple-icon/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Redirect to default locale
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded media)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|uploads).*)',
  ],
};
