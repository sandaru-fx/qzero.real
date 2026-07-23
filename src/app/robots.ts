import type { MetadataRoute } from 'next';

const PRIMARY_DOMAIN = 'https://qzero.lk';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep private areas out of the index
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${PRIMARY_DOMAIN}/sitemap.xml`,
    host: PRIMARY_DOMAIN,
  };
}
