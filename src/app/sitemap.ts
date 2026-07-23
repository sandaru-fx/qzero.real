import type { MetadataRoute } from 'next';
import { getSiteConfig } from '@/actions/settings';
import connectToDatabase from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

const PRIMARY_DOMAIN = 'https://qzero.lk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = PRIMARY_DOMAIN;

  try {
    const siteConfig = await getSiteConfig();
    if (siteConfig.url?.startsWith('https://qzero.lk')) {
      baseUrl = siteConfig.url.replace(/\/$/, '');
    }
  } catch {
    baseUrl = PRIMARY_DOMAIN;
  }

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/vehicles`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/promotions`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/international`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/import`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    await connectToDatabase();
    const vehicles = await Vehicle.find({}, 'slug updatedAt').lean<{
      slug: string;
      updatedAt?: Date;
    }[]>();

    const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
      url: `${baseUrl}/vehicles/${vehicle.slug}`,
      lastModified: vehicle.updatedAt ? new Date(vehicle.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...vehicleRoutes];
  } catch {
    return staticRoutes;
  }
}
