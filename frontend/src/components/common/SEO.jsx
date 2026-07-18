import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://zenoafricaadventures.com';
const SITE_NAME = 'Zeno Africa Adventures';
const DEFAULT_IMAGE = `${SITE_URL}/zaa-logo.png`;
const TWITTER_HANDLE = '@zenoafrica';

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  jsonLd,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Luxury Safari & Travel in Africa`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={TWITTER_HANDLE} />

      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

/* ── Reusable JSON-LD builders ────────────────────────────── */

export const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  description: 'Luxury safari tours, visa assistance, hotel reservations, and flight bookings across Africa.',
  foundingDate: '2020',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dar es Salaam',
    addressCountry: 'TZ',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+255-674-448-795',
    contactType: 'customer service',
    email: 'zenoafricaadventures@gmail.com',
    availableLanguage: ['English'],
  },
  sameAs: [],
  areaServed: {
    '@type': 'Continent',
    name: 'Africa',
  },
};

export function tourJsonLd(pkg) {
  if (!pkg) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.shortDescription || pkg.description?.slice(0, 300),
    url: `${SITE_URL}/packages/${pkg.slug}`,
    image: pkg.coverImage?.url,
    touristType: 'Adventure Traveller',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: pkg.duration?.days,
      itemListElement: (pkg.itinerary || []).slice(0, 5).map((day, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: day.title,
        description: day.description,
      })),
    },
    offers: {
      '@type': 'Offer',
      price: pkg.price?.adult,
      priceCurrency: pkg.price?.currency || 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/packages/${pkg.slug}`,
    },
    provider: {
      '@type': 'TravelAgency',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function breadcrumbJsonLd(items) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
