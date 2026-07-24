import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo';
import type { getSiteConfig } from '@/actions/settings';

type SiteConfig = Awaited<ReturnType<typeof getSiteConfig>>;

type OrganizationJsonLdProps = {
  siteConfig: SiteConfig;
};

export default function OrganizationJsonLd({ siteConfig }: OrganizationJsonLdProps) {
  const { contact, social, name } = siteConfig;

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Qzero International Pvt Ltd',
        alternateName: name,
        url: SITE_URL,
        logo: `${SITE_URL}/qzero-favicon.png`,
        image: `${SITE_URL}/og-default.jpg`,
        email: contact.email,
        telephone: contact.phoneTel,
        sameAs: [social.facebook].filter(Boolean),
        address: {
          '@type': 'PostalAddress',
          streetAddress: contact.address.line1,
          addressLocality: 'Habarakada',
          addressCountry: 'LK',
        },
      },
      {
        '@type': 'AutoDealer',
        '@id': `${SITE_URL}/#localbusiness`,
        name: 'Qzero International Pvt Ltd',
        url: SITE_URL,
        image: `${SITE_URL}/og-default.jpg`,
        telephone: contact.phoneTel,
        email: contact.email,
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: contact.address.line1,
          addressLocality: 'Habarakada',
          addressRegion: 'Western Province',
          addressCountry: 'LK',
        },
        geo: {
          '@type': 'GeoCoordinates',
          // Approximate Habarakada showroom (V2C5+84X)
          latitude: 6.8667,
          longitude: 80.0167,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '16:00',
          },
        ],
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };

  return <JsonLd data={data} />;
}
