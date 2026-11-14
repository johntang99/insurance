/** @type {import('next').NextConfig} */

// ============================================================
// BAAM System I — Insurance Brokerage Platform
// next.config.js — production-optimized configuration
// ============================================================

const supabaseUrls = [
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_URL,
].filter(Boolean);

const supabaseHostnames = Array.from(
  new Set(
    supabaseUrls
      .map((value) => {
        try { return value ? new URL(value).hostname : undefined; } catch { return undefined; }
      })
      .filter(Boolean)
  )
);

const remotePatterns = [];
for (const hostname of supabaseHostnames) {
  remotePatterns.push({
    protocol: 'https',
    hostname,
    pathname: '/storage/v1/object/public/**',
  });
}

const nextConfig = {
  reactStrictMode: true,

  // ── Image optimization ────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Supabase storage
      ...remotePatterns,
      // Stock photo providers (for admin media browser)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'www.pexels.com' },
    ],
    // Optimize images in production; skip in dev for speed
    unoptimized: process.env.NODE_ENV === 'development',
    // Insurance site images don't need to be huge
    deviceSizes: [375, 640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 200],
  },

  // ── HTTP headers ──────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Uploaded images keep fixed file names and may be replaced (e.g. a new
        // carrier logo), so cache for a day rather than forever.
        source: '/uploads/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      // Long-term caching of Next.js static files is only safe in production,
      // where file names are content-hashed. In development the names never
      // change, so caching them makes the browser run stale code and causes
      // "Text content does not match server-rendered HTML" errors.
      ...(process.env.NODE_ENV === 'production'
        ? [{
            source: '/_next/static/(.*)',
            headers: [
              { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
            ],
          }]
        : []),
    ];
  },

  // ── Redirects ─────────────────────────────────────────────
  async redirects() {
    return [
      // Travel Insurance was replaced by Life and Annuity Insurance
      { source: '/:locale/insurance/travel', destination: '/:locale/insurance/life-annuity', permanent: true },
      { source: '/:locale/insurance/travel/:city', destination: '/:locale/insurance/life-annuity/:city', permanent: true },
      // Redirect old /blog paths to /resources
      { source: '/en/blog', destination: '/en/resources', permanent: true },
      { source: '/en/blog/:slug', destination: '/en/resources/:slug', permanent: true },
      { source: '/:locale/blog', destination: '/:locale/resources', permanent: true },
      { source: '/:locale/blog/:slug', destination: '/:locale/resources/:slug', permanent: true },
    ];
  },

  // ── Build output ──────────────────────────────────────────
  output: 'standalone',

  // ── Compiler options ──────────────────────────────────────
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // ── Experimental ─────────────────────────────────────────
  experimental: {
    // Optimize server actions
    serverActions: { allowedOrigins: ['localhost:3007', 'pbiny.com', '*.pbiny.com'] },
  },
};

module.exports = nextConfig;
