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

  // Insurance platform theme — Navy + Gold CSS variables
  const themeStyle = `
    :root {
      /* Insurance Design System — from prototypes/theme.css */
      --navy-900: #060f1d;
      --navy-800: ${theme?.colors?.primary?.DEFAULT || '#0b1f3a'};
      --navy-700: #112a4d;
      --navy-600: #173560;
      --navy-500: #1e4275;
      --navy-100: #dce8f5;
      --navy-50:  #f0f5fb;

      --gold-600: #a8782a;
      --gold-500: ${theme?.colors?.secondary?.DEFAULT || '#c9933a'};
      --gold-400: #d9a84f;
      --gold-300: #e8be6e;
      --gold-100: #fdf3e0;

      --green-500: #1a7a4a;
      --green-100: #d6f0e4;
      --red-500:   #c74b4b;
      --red-100:   #fde8e8;

      --text-primary:   #1a2535;
      --text-secondary: #3d5068;
      --text-muted:     #7a8a9a;
      --text-light:     #b0bec8;

      --bg-white:  #ffffff;
      --bg-subtle: #f7f8fa;
      --bg-light:  #eef1f5;
      --border:    #e2e8f0;
      --border-focus: var(--navy-500);

      --shadow-sm: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
      --shadow:    0 4px 12px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06);
      --shadow-lg: 0 10px 40px rgba(0,0,0,.14), 0 4px 16px rgba(0,0,0,.08);

      --radius-sm: 6px;
      --radius:    10px;
      --radius-lg: 16px;
      --radius-xl: 24px;
      --max-w: 1280px;
      --section-y: 96px;

      /* Legacy compat */
      --primary: ${theme?.colors?.primary?.DEFAULT || '#0b1f3a'};
      --primary-dark: ${theme?.colors?.primary?.dark || '#071529'};
      --primary-light: ${theme?.colors?.primary?.light || '#1a3352'};
      --primary-50: ${theme?.colors?.primary?.['50'] || '#f0f5fb'};
      --primary-100: ${theme?.colors?.primary?.['100'] || '#dce8f5'};
      --secondary: ${theme?.colors?.secondary?.DEFAULT || '#c9933a'};
      --secondary-dark: ${theme?.colors?.secondary?.dark || '#a87830'};
      --secondary-light: ${theme?.colors?.secondary?.light || '#dfb060'};
      --secondary-50: ${theme?.colors?.secondary?.['50'] || '#fdf3e0'};
      --backdrop-primary: ${theme?.colors?.backdrop?.primary || '#f7f8fa'};
      --backdrop-secondary: ${theme?.colors?.backdrop?.secondary || '#fdf6ec'};
      --radius-base: ${themeRadius};
      --shadow-base: ${themeShadow};
      --section-padding-y: ${themeSectionPaddingY};
      --text-display: ${theme?.typography?.display || '3.5rem'};
      --text-heading: ${theme?.typography?.heading || '2.5rem'};
      --text-subheading: ${theme?.typography?.subheading || '2rem'};
      --text-body: ${theme?.typography?.body || '1rem'};
      --text-small: ${theme?.typography?.small || '0.875rem'};
    }

    @media (max-width: 1024px) { :root { --section-y: 72px; } }
    @media (max-width: 768px)  { :root { --section-y: 56px; } }
  `;
  
  return (
    <>
      {/* Inject theme CSS variables */}
      {theme && (
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      )}

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
          phone={(siteInfo as any)?.phone || '+1 (718) 555-0100'}
          phoneHref={(siteInfo as any)?.phone ? `tel:${((siteInfo as any).phone as string).replace(/\D/g, '')}` : 'tel:+17185550100'}
          quoteHref={`/${locale}/quote`}
        />
      </div>
    </>
  );
}
