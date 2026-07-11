import type { MetadataRoute } from 'next';
import { getSiteConfig } from '@/actions/settings';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await getSiteConfig();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
