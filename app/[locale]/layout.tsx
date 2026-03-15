import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n';
import { getDefaultSite, getSiteById } from '@/lib/sites';
import {
  getRequestSiteId,
  loadContent,
  loadFooter,
  loadSeo,
  loadTheme,
  loadSiteInfo,
} from '@/lib/content';
import type { FooterSection, SeoConfig, SiteInfo } from '@/lib/types';
import Header, { type HeaderConfig } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileStickyPhoneBar from '@/components/layout/MobileStickyPhoneBar';
import { getBaseUrlFromHost } from '@/lib/seo';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { generateRootCSS } from '@/lib/insurance/theme';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const host = headers().get('host');
  const baseUrl = getBaseUrlFromHost(host);
  const requestSiteId = await getRequestSiteId();
  const site = (await getSiteById(requestSiteId)) || (await getDefaultSite());
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;

  if (!site) {
    return {
      metadataBase: baseUrl,
      title: 'Business Website',
      description: 'Multi-site business website',
      icons: {
        icon: '/icon',
        shortcut: '/icon',
        apple: '/icon',
      },
    };
  }

  const [siteInfo, seo] = await Promise.all([
    loadSiteInfo(site.id, locale) as Promise<SiteInfo | null>,
    loadSeo(site.id, locale) as Promise<SeoConfig | null>,
  ]);
  const titleBase = getSiteDisplayName(siteInfo, site.name);
  const description =
    seo?.description ||
    siteInfo?.description ||
    'Professional services, scheduling, and customer support.';
  const titleDefault = seo?.title || titleBase;
  const canonical = new URL(`/${locale}`, baseUrl).toString();
  const languageAlternates = locales.reduce<Record<string, string>>((acc, entry) => {
    acc[entry] = new URL(`/${entry}`, baseUrl).toString();
    return acc;
  }, {});

  return {
    metadataBase: baseUrl,
    title: {
      default: titleDefault,
      template: `%s | ${titleBase}`,
    },
    description,
    alternates: {
      canonical,
      languages: {
        ...languageAlternates,
        'x-default': new URL(`/${defaultLocale}`, baseUrl).toString(),
      },
    },
    openGraph: {
      title: titleDefault,
      description,
      url: canonical,
      siteName: titleBase,
      locale,
      type: 'website',
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    icons: {
      icon: '/icon',
      shortcut: '/icon',
      apple: '/icon',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  const host = headers().get('host');
  const requestSiteId = await getRequestSiteId();
  const site = (await getSiteById(requestSiteId)) || (await getDefaultSite());
  
  if (!site) {
    return <div>No site configured</div>;
  }
  
  // Load theme
  const theme = await loadTheme(site.id);
  
  // Load site info for header/footer
  const [siteInfo, seo, footer, headerConfig] = await Promise.all([
    loadSiteInfo(site.id, locale as Locale) as Promise<SiteInfo | null>,
    loadSeo(site.id, locale as Locale) as Promise<SeoConfig | null>,
    loadFooter<FooterSection>(site.id, locale as Locale),
    loadContent<HeaderConfig>(site.id, locale as Locale, 'header.json'),
  ]);
  const baseUrl = getBaseUrlFromHost(host);
  
  const spacingDensityMap: Record<string, string> = {
    compact: '3rem',
    comfortable: '5rem',
    spacious: '8rem',
  };

  const themeSpacingDensity = String(theme?.layout?.spacingDensity || 'comfortable');
  const themeSectionPaddingY = spacingDensityMap[themeSpacingDensity] || spacingDensityMap.comfortable;
  const themeRadius = theme?.shape?.radius || '8px';
  const themeShadow = theme?.shape?.shadow || '0 4px 20px rgba(0,0,0,0.08)';

  // Insurance platform theme — CSS variables from lib/insurance/theme.ts
  // Per-site overrides from theme.json take precedence via the override params
  // generateRootCSS() is the single source of truth — see lib/insurance/theme.ts
  const themeStyle = generateRootCSS({
    navyBg: theme?.colors?.primary?.DEFAULT,
    gold:   theme?.colors?.secondary?.DEFAULT,
  });
  
  return (
    <>
      {/* Inject theme CSS variables — always inject (see lib/insurance/theme.ts) */}
      <style dangerouslySetInnerHTML={{ __html: themeStyle }} />

      {siteInfo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['InsuranceAgency', 'LocalBusiness'],
              name: getSiteDisplayName(siteInfo, site.name),
              url: new URL(`/${locale}`, baseUrl).toString(),
              description: siteInfo.description,
              telephone: siteInfo.phone,
              email: siteInfo.email,
              priceRange: '$$',
              address: {
                '@type': 'PostalAddress',
                streetAddress: siteInfo.address,
                addressLocality: siteInfo.city,
                addressRegion: siteInfo.state,
                postalCode: siteInfo.zip,
                addressCountry: 'US',
              },
              areaServed: [siteInfo.city, siteInfo.state].filter(Boolean).join(', '),
            }),
          }}
        />
      )}
      
      <div className="min-h-screen flex flex-col relative">
        <Header
          locale={locale as Locale}
          siteId={site.id}
          supportedLocales={site.supportedLocales}
          siteInfo={siteInfo ?? undefined}
          variant={headerConfig?.menu?.variant || siteInfo?.headerVariant || 'default'}
          headerConfig={headerConfig ?? undefined}
        />
        <main className="flex-grow">{children}</main>
        <Footer
          locale={locale as Locale}
          siteId={site.id}
          footer={footer as any}
        />
        <MobileStickyPhoneBar
          phone={(siteInfo as any)?.phone || ("(718) 799-0472")}
          phoneHref={(siteInfo as any)?.phone ? `tel:${((siteInfo as any).phone as string).replace(/\D/g, '')}` : 'tel:+17187990472'}
          quoteHref={`/${locale}/quote`}
        />
      </div>
    </>
  );
}
