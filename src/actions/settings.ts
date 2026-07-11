'use server';

import connectToDatabase from '@/lib/mongodb';
import Settings, { ISettings } from '@/models/Settings';
import { protectServerAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { fallbackSiteConfig } from '@/config/site';

export type SettingsPayload = {
  contact: ISettings['contact'];
  social: ISettings['social'];
};

export async function getSettings() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({ isGlobal: true }).lean();

    if (!settings) {
      settings = await Settings.create({ isGlobal: true });
    }

    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

export async function getSiteConfig() {
  const dbSettings = await getSettings();
  if (!dbSettings) return fallbackSiteConfig;

  const isPlaceholderPhone =
    !dbSettings.contact.phone ||
    dbSettings.contact.phone.includes('77 000 0000') ||
    dbSettings.contact.phoneTel?.includes('94770000000');

  return {
    ...fallbackSiteConfig,
    contact: {
      ...fallbackSiteConfig.contact,
      email: dbSettings.contact.email || fallbackSiteConfig.contact.email,
      phone: isPlaceholderPhone
        ? fallbackSiteConfig.contact.phone
        : dbSettings.contact.phone || fallbackSiteConfig.contact.phone,
      phoneTel: isPlaceholderPhone
        ? fallbackSiteConfig.contact.phoneTel
        : dbSettings.contact.phoneTel || fallbackSiteConfig.contact.phoneTel,
      whatsapp:
        !dbSettings.contact.whatsapp || dbSettings.contact.whatsapp === '94770000000'
          ? fallbackSiteConfig.contact.whatsapp
          : dbSettings.contact.whatsapp,
      address: {
        ...fallbackSiteConfig.contact.address,
        line1: dbSettings.contact.addressLine1 || fallbackSiteConfig.contact.address.line1,
        line2: dbSettings.contact.addressLine2 || fallbackSiteConfig.contact.address.line2,
        full: `${dbSettings.contact.addressLine1}, ${dbSettings.contact.addressLine2}`,
      },
    },
    social: {
      ...fallbackSiteConfig.social,
      facebook: dbSettings.social.facebook || fallbackSiteConfig.social.facebook,
      instagram: dbSettings.social.instagram || fallbackSiteConfig.social.instagram,
      youtube: dbSettings.social.youtube || fallbackSiteConfig.social.youtube,
      linkedin: dbSettings.social.linkedin || fallbackSiteConfig.social.linkedin,
    },
  };
}

export async function updateSettings(data: SettingsPayload) {
  try {
    await protectServerAction();
    await connectToDatabase();

    const settings = await Settings.findOneAndUpdate(
      { isGlobal: true },
      { $set: data },
      { new: true, upsert: true }
    );

    revalidatePath('/', 'layout'); // Revalidate everything since settings are global
    return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    console.error('Failed to update settings:', error);
    return { success: false, error: 'Failed to update settings.' };
  }
}
