import { protectAdminRoute } from '@/lib/auth';
import { getSettings } from '@/actions/settings';
import SettingsManager from '@/components/admin/SettingsManager';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { fallbackSiteConfig } from '@/config/site';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  await protectAdminRoute();
  const settings = await getSettings();

  const initialSettings = settings ?? {
    site: {
      name: fallbackSiteConfig.name,
      tagline: fallbackSiteConfig.tagline,
      url: fallbackSiteConfig.url,
    },
    contact: {
      email: fallbackSiteConfig.contact.email,
      phone: fallbackSiteConfig.contact.phone,
      phoneTel: fallbackSiteConfig.contact.phoneTel,
      whatsapp: fallbackSiteConfig.contact.whatsapp,
      addressLine1: fallbackSiteConfig.contact.address.line1,
      addressLine2: fallbackSiteConfig.contact.address.line2,
      mapsUrl: fallbackSiteConfig.contact.mapsUrl,
      mapsEmbedUrl: fallbackSiteConfig.contact.mapsEmbedUrl,
      hours: fallbackSiteConfig.contact.hours.map((h) => ({ day: h.day, time: h.time })),
    },
    social: { ...fallbackSiteConfig.social },
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AdminPageHeader
        eyebrow="System"
        title="Settings"
        description="Manage contact details, operating hours, maps, brand identity, and security — synced with the public site."
      />

      <SettingsManager initialSettings={initialSettings} />
    </div>
  );
}
