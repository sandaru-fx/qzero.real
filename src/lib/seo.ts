import type { Metadata } from 'next';

export const SITE_URL = 'https://qzero.lk';
export const OG_IMAGE = {
  url: '/og-default.jpg',
  width: 1200,
  height: 630,
  alt: 'Qzero International Pvt Ltd — premium vehicles Sri Lanka',
} as const;

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

/** Page-level metadata with unique title/description, canonical, and share image. */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: PageSeoInput): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_LK',
      url,
      siteName: 'Qzero International Pvt Ltd',
      title: `${title} | Qzero International Pvt Ltd`,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Qzero International Pvt Ltd`,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
