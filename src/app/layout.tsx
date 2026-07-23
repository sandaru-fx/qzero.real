import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-luxury",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://qzero.lk'),
  title: {
    default: 'Qzero International Pvt Ltd | Premium Vehicles Sri Lanka',
    template: '%s | Qzero International Pvt Ltd',
  },
  description:
    'Premium vehicle exporter and consumer products provider based in Sri Lanka.',
  keywords: [
    'Qzero International',
    'Qzero International Pvt Ltd',
    'Vehicle Exporter Sri Lanka',
    'Qzero.lk',
    'Premium vehicles',
    'Sri Lanka vehicle export',
  ],
  authors: [{ name: 'Qzero International Pvt Ltd', url: 'https://qzero.lk' }],
  creator: 'Qzero International Pvt Ltd',
  publisher: 'Qzero International Pvt Ltd',
  applicationName: 'Qzero International',
  alternates: {
    canonical: 'https://qzero.lk',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: 'https://qzero.lk',
    siteName: 'Qzero International Pvt Ltd',
    title: 'Qzero International Pvt Ltd | Premium Vehicles Sri Lanka',
    description:
      'Premium vehicle exporter and consumer products provider based in Sri Lanka.',
    images: [
      {
        url: '/lifestyle/import-hero.jpg',
        width: 1600,
        height: 900,
        alt: 'Qzero International Pvt Ltd — premium vehicles Sri Lanka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qzero International Pvt Ltd | Premium Vehicles Sri Lanka',
    description:
      'Premium vehicle exporter and consumer products provider based in Sri Lanka.',
    images: ['/lifestyle/import-hero.jpg'],
  },
  category: 'automotive',
  icons: {
    icon: [
      { url: '/qzero-favicon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/qzero-favicon.png',
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-black font-semibold text-white">{children}</body>
    </html>
  );
}
