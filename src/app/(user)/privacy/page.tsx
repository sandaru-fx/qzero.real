import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${siteConfig.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-brand-gold">Privacy</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">Privacy policy</h1>
      <div className="mt-8 space-y-6 leading-7 text-brand-muted">
        <p>
          {siteConfig.name} collects only the information required to respond to vehicle inquiries,
          import requests, showroom appointments, and customer support messages.
        </p>
        <p>
          Customer contact details are used for communication about requested services and are not
          sold to third parties.
        </p>
        <p>
          Vehicle inquiry records may be kept to improve service quality, follow up on requests, and
          support future imports.
        </p>
        <p>
          For privacy-related questions, contact us at{' '}
          <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-gold hover:underline">
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
