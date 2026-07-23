'use server';

import connectToDatabase from '@/lib/mongodb';
import Settings, { ISettings, OperatingHour } from '@/models/Settings';
import { protectServerAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { fallbackSiteConfig } from '@/config/site';

export type SettingsPayload = {
  site: ISettings['site'];
  contact: ISettings['contact'];
  social: ISettings['social'];
};

const defaultHours: OperatingHour[] = fallbackSiteConfig.contact.hours.map((h) => ({
  day: h.day,
  time: h.time,
}));

function isPlaceholderSocial(url: string | undefined, hosts: string[]) {
  if (!url?.trim()) return true;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const path = new URL(url).pathname.replace(/\/$/, '');
    return hosts.includes(host) && (path === '' || path === '/');
  } catch {
    return true;
  }
}

function withDefaults(raw: Partial<ISettings> | null): SettingsPayload {
  const contact = raw?.contact;
  const hours =
    Array.isArray(contact?.hours) && contact.hours.length > 0
      ? contact.hours.map((h) => ({ day: h.day, time: h.time }))
      : defaultHours;

  const fb = raw?.social?.facebook;
  const facebook = isPlaceholderSocial(fb, ['facebook.com'])
    ? fallbackSiteConfig.social.facebook
    : (fb as string);

  const legacySiteUrl = 'https://qzerointernational.com';
  const legacyEmail = 'info@qzerointernational.com';
  const rawUrl = raw?.site?.url?.trim();
  const rawEmail = contact?.email?.trim();

  return {
    site: {
      name: raw?.site?.name || fallbackSiteConfig.name,
      tagline: raw?.site?.tagline || fallbackSiteConfig.tagline,
      url:
        !rawUrl || rawUrl === legacySiteUrl || rawUrl.includes('qzerointernational.com')
          ? fallbackSiteConfig.url
          : rawUrl,
    },
    contact: {
      email:
        !rawEmail || rawEmail === legacyEmail || rawEmail.endsWith('@qzerointernational.com')
          ? fallbackSiteConfig.contact.email
          : rawEmail,
      phone: contact?.phone || fallbackSiteConfig.contact.phone,
      phoneTel: contact?.phoneTel || fallbackSiteConfig.contact.phoneTel,
      whatsapp: contact?.whatsapp || fallbackSiteConfig.contact.whatsapp,
      addressLine1: contact?.addressLine1 || fallbackSiteConfig.contact.address.line1,
      addressLine2: contact?.addressLine2 || fallbackSiteConfig.contact.address.line2,
      mapsUrl: contact?.mapsUrl || fallbackSiteConfig.contact.mapsUrl,
      mapsEmbedUrl: contact?.mapsEmbedUrl || fallbackSiteConfig.contact.mapsEmbedUrl,
      hours,
    },
    social: {
      facebook,
      instagram: raw?.social?.instagram || fallbackSiteConfig.social.instagram,
      youtube: raw?.social?.youtube || fallbackSiteConfig.social.youtube,
      linkedin: raw?.social?.linkedin || fallbackSiteConfig.social.linkedin,
    },
  };
}

export async function getSettings(): Promise<SettingsPayload | null> {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({ isGlobal: true }).lean();

    if (!settings) {
      settings = await Settings.create({ isGlobal: true });
      settings = await Settings.findOne({ isGlobal: true }).lean();
    }

    return withDefaults(settings as Partial<ISettings> | null);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return withDefaults(null);
  }
}

export async function getSiteConfig() {
  const dbSettings = await getSettings();
  if (!dbSettings) {
    return {
      ...fallbackSiteConfig,
      contact: {
        ...fallbackSiteConfig.contact,
        hours: defaultHours,
      },
    };
  }

  const isPlaceholderPhone =
    !dbSettings.contact.phone ||
    dbSettings.contact.phone.includes('77 000 0000') ||
    dbSettings.contact.phoneTel?.includes('94770000000');

  const phone = isPlaceholderPhone
    ? fallbackSiteConfig.contact.phone
    : dbSettings.contact.phone;
  const phoneTel = isPlaceholderPhone
    ? fallbackSiteConfig.contact.phoneTel
    : dbSettings.contact.phoneTel;
  const whatsapp =
    !dbSettings.contact.whatsapp || dbSettings.contact.whatsapp === '94770000000'
      ? fallbackSiteConfig.contact.whatsapp
      : dbSettings.contact.whatsapp;

  return {
    name: dbSettings.site.name,
    tagline: dbSettings.site.tagline,
    url: dbSettings.site.url,
    contact: {
      email: dbSettings.contact.email,
      phone,
      phoneTel,
      whatsapp,
      whatsappQrUrl: `https://wa.me/${whatsapp}`,
      address: {
        line1: dbSettings.contact.addressLine1,
        line2: dbSettings.contact.addressLine2,
        full: `${dbSettings.contact.addressLine1}, ${dbSettings.contact.addressLine2}`,
      },
      mapsUrl: dbSettings.contact.mapsUrl,
      mapsEmbedUrl: dbSettings.contact.mapsEmbedUrl,
      hours: dbSettings.contact.hours,
    },
    social: dbSettings.social,
  };
}

export async function updateSettings(data: SettingsPayload) {
  try {
    await protectServerAction();
    await connectToDatabase();

    const payload = withDefaults(data as unknown as Partial<ISettings>);

    const settings = await Settings.findOneAndUpdate(
      { isGlobal: true },
      { $set: payload },
      { new: true, upsert: true }
    );

    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');
    return { success: true, settings: withDefaults(settings as unknown as Partial<ISettings>) };
  } catch (error) {
    console.error('Failed to update settings:', error);
    return { success: false, error: 'Failed to update settings.' };
  }
}
