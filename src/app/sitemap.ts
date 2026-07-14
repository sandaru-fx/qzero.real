import type { MetadataRoute } from 'next';
import { getSiteConfig } from '@/actions/settings';
import connectToDatabase from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteConfig = await getSiteConfig();
  const baseUrl = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/vehicles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/international`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/promotions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    await connectToDatabase();
    const vehicles = await Vehicle.find({}, 'slug updatedAt').lean();

    const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
      url: `${baseUrl}/vehicles/${vehicle.slug}`,
      lastModified: vehicle.updatedAt ? new Date(vehicle.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...vehicleRoutes];
  } catch {
    return staticRoutes;
  }
}
