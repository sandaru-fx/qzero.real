'use server';

import { Types } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Promotion from '@/models/Promotion';
import Vehicle from '@/models/Vehicle';
import { protectServerAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { PromotionFormInput, PromotionOffer, PromotionSource } from '@/types/promotion';
import type { IVehicle } from '@/types/vehicle';

type LeanPromo = {
  _id: Types.ObjectId | string;
  source?: PromotionSource;
  vehicleId?: Types.ObjectId | string | null;
  brand?: string;
  model?: string;
  year?: number;
  image?: string;
  href?: string;
  title?: string;
  badge: string;
  validUntil: string;
  highlight: string;
  highlightAccent?: string;
  description: string;
  cta?: string;
  featured?: boolean;
};

type LeanVehicle = Omit<IVehicle, 'createdAt' | 'updatedAt'> & {
  _id: Types.ObjectId | string;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function revalidatePromoPaths() {
  revalidatePath('/promotions');
  revalidatePath('/admin/promotions');
}

function inventoryOffer(promo: LeanPromo, vehicle: LeanVehicle): PromotionOffer {
  const brand = vehicle.brand;
  const model = vehicle.model;
  const grade = vehicle.grade ? ` ${vehicle.grade}` : '';
  const vehicleLabel = `${vehicle.year} ${brand} ${model}${grade}`.trim();
  const title = promo.title?.trim() || `${brand} ${model}${grade} — Special Offer`;

  return {
    id: String(promo._id),
    source: 'inventory',
    vehicleId: String(vehicle._id),
    brand,
    model,
    year: vehicle.year,
    title,
    validUntil: promo.validUntil,
    highlight: promo.highlight,
    highlightAccent: promo.highlightAccent || '',
    description: promo.description,
    image: vehicle.images?.[0] || '',
    imageAlt: `${brand} ${model}`,
    badge: promo.badge,
    cta: promo.cta?.trim() || 'View Vehicle',
    href: `/vehicles/${vehicle.slug}`,
    featured: Boolean(promo.featured),
    vehicleLabel,
  };
}

function customOffer(promo: LeanPromo): PromotionOffer {
  const brand = promo.brand?.trim() || 'QZERO';
  const model = promo.model?.trim() || '';
  const year = promo.year || undefined;
  const vehicleLabel = [year, brand, model].filter(Boolean).join(' ');
  const title =
    promo.title?.trim() ||
    (model ? `${brand} ${model} — Special Offer` : `${brand} — Special Offer`);

  return {
    id: String(promo._id),
    source: 'custom',
    vehicleId: '',
    brand,
    model,
    year,
    title,
    validUntil: promo.validUntil,
    highlight: promo.highlight,
    highlightAccent: promo.highlightAccent || '',
    description: promo.description,
    image: promo.image?.trim() || '',
    imageAlt: `${brand} ${model}`.trim(),
    badge: promo.badge,
    cta: promo.cta?.trim() || 'Inquire Now',
    href: promo.href?.trim() || '/contact',
    featured: Boolean(promo.featured),
    vehicleLabel: vehicleLabel || 'Custom offer',
  };
}

async function mapPromos(promos: LeanPromo[]): Promise<PromotionOffer[]> {
  if (!promos.length) return [];

  const inventoryIds = promos
    .filter((p) => (p.source || 'inventory') === 'inventory' && p.vehicleId)
    .map((p) => p.vehicleId)
    .filter((id): id is Types.ObjectId | string => Boolean(id) && Types.ObjectId.isValid(String(id)))
    .map((id) => new Types.ObjectId(String(id)));

  const vehicles = inventoryIds.length
    ? await Vehicle.find({ _id: { $in: inventoryIds } }).lean<LeanVehicle[]>()
    : [];
  const byId = new Map(vehicles.map((v) => [String(v._id), v]));

  const offers: PromotionOffer[] = [];
  for (const promo of promos) {
    const source: PromotionSource =
      promo.source === 'custom' || !promo.vehicleId ? 'custom' : 'inventory';

    if (source === 'custom') {
      offers.push(customOffer({ ...promo, source: 'custom' }));
      continue;
    }

    const vehicle = byId.get(String(promo.vehicleId));
    if (!vehicle) continue;
    offers.push(inventoryOffer(promo, vehicle));
  }
  return offers;
}

function parseYear(value: number | string | undefined): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) && n > 1900 ? n : 0;
}

async function unsetOtherFeatured(exceptId?: string) {
  const filter = exceptId
    ? { featured: true, _id: { $ne: exceptId } }
    : { featured: true };
  await Promotion.updateMany(filter, { $set: { featured: false } });
}

export async function getPromotions(): Promise<PromotionOffer[]> {
  try {
    await connectToDatabase();
    const promos = await Promotion.find()
      .sort({ featured: -1, createdAt: -1 })
      .lean<LeanPromo[]>();
    return mapPromos(promos);
  } catch (error) {
    console.error('Failed to fetch promotions:', error);
    return [];
  }
}

export async function createPromotion(data: PromotionFormInput) {
  try {
    await protectServerAction();
    await connectToDatabase();

    const source: PromotionSource = data.source === 'custom' ? 'custom' : 'inventory';

    if (data.featured) {
      await unsetOtherFeatured();
    }

    if (source === 'inventory') {
      if (!data.vehicleId || !Types.ObjectId.isValid(data.vehicleId)) {
        return { success: false, error: 'Select a showroom vehicle.' };
      }

      const vehicle = await Vehicle.findById(data.vehicleId);
      if (!vehicle) {
        return { success: false, error: 'Vehicle not found in inventory.' };
      }

      const existing = await Promotion.findOne({ vehicleId: data.vehicleId });
      if (existing) {
        return { success: false, error: 'That vehicle already has a promotion.' };
      }

      const created = await Promotion.create({
        source: 'inventory',
        vehicleId: data.vehicleId,
        brand: '',
        model: '',
        year: 0,
        image: '',
        href: '',
        title: data.title?.trim() || '',
        badge: data.badge.trim(),
        validUntil: data.validUntil.trim(),
        highlight: data.highlight.trim(),
        highlightAccent: data.highlightAccent?.trim() || '',
        description: data.description.trim(),
        cta: data.cta?.trim() || 'View Vehicle',
        featured: Boolean(data.featured),
      });

      revalidatePromoPaths();
      return { success: true, id: String(created._id) };
    }

    const brand = data.brand?.trim() || '';
    const model = data.model?.trim() || '';
    const image = data.image?.trim() || '';
    if (!brand || !model) {
      return { success: false, error: 'Brand and model are required for custom offers.' };
    }
    if (!image) {
      return { success: false, error: 'Add an image for this custom promotion vehicle.' };
    }

    const created = await Promotion.create({
      source: 'custom',
      brand,
      model,
      year: parseYear(data.year),
      image,
      href: data.href?.trim() || '/contact',
      title: data.title?.trim() || '',
      badge: data.badge.trim(),
      validUntil: data.validUntil.trim(),
      highlight: data.highlight.trim(),
      highlightAccent: data.highlightAccent?.trim() || '',
      description: data.description.trim(),
      cta: data.cta?.trim() || 'Inquire Now',
      featured: Boolean(data.featured),
    });

    revalidatePromoPaths();
    return { success: true, id: String(created._id) };
  } catch (error: unknown) {
    console.error('Failed to create promotion:', error);
    return { success: false, error: getErrorMessage(error, 'Failed to create promotion.') };
  }
}

export async function updatePromotion(id: string, data: PromotionFormInput) {
  try {
    await protectServerAction();
    await connectToDatabase();

    if (!Types.ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid promotion.' };
    }

    const existing = await Promotion.findById(id);
    if (!existing) {
      return { success: false, error: 'Promotion not found.' };
    }

    const source: PromotionSource = data.source === 'custom' ? 'custom' : 'inventory';

    if (data.featured) {
      await unsetOtherFeatured(id);
    }

    if (source === 'inventory') {
      if (!data.vehicleId || !Types.ObjectId.isValid(data.vehicleId)) {
        return { success: false, error: 'Select a showroom vehicle.' };
      }

      const vehicle = await Vehicle.findById(data.vehicleId);
      if (!vehicle) {
        return { success: false, error: 'Vehicle not found in inventory.' };
      }

      const conflict = await Promotion.findOne({
        vehicleId: data.vehicleId,
        _id: { $ne: id },
      });
      if (conflict) {
        return { success: false, error: 'That vehicle already has a promotion.' };
      }

      // Use set() for `model` — Document.model conflicts with the schema field name
      existing.set({
        source: 'inventory',
        vehicleId: new Types.ObjectId(data.vehicleId),
        brand: '',
        model: '',
        year: 0,
        image: '',
        href: '',
        title: data.title?.trim() || '',
        badge: data.badge.trim(),
        validUntil: data.validUntil.trim(),
        highlight: data.highlight.trim(),
        highlightAccent: data.highlightAccent?.trim() || '',
        description: data.description.trim(),
        cta: data.cta?.trim() || 'View Vehicle',
        featured: Boolean(data.featured),
      });
      await existing.save();

      revalidatePromoPaths();
      return { success: true };
    }

    const brand = data.brand?.trim() || '';
    const model = data.model?.trim() || '';
    const image = data.image?.trim() || '';
    if (!brand || !model) {
      return { success: false, error: 'Brand and model are required for custom offers.' };
    }
    if (!image) {
      return { success: false, error: 'Add an image for this custom promotion vehicle.' };
    }

    existing.set({
      source: 'custom',
      brand,
      model,
      year: parseYear(data.year),
      image,
      href: data.href?.trim() || '/contact',
      title: data.title?.trim() || '',
      badge: data.badge.trim(),
      validUntil: data.validUntil.trim(),
      highlight: data.highlight.trim(),
      highlightAccent: data.highlightAccent?.trim() || '',
      description: data.description.trim(),
      cta: data.cta?.trim() || 'Inquire Now',
      featured: Boolean(data.featured),
    });
    existing.set('vehicleId', undefined);
    await existing.save();
    await Promotion.updateOne({ _id: id }, { $unset: { vehicleId: 1 } });

    revalidatePromoPaths();
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to update promotion:', error);
    return { success: false, error: getErrorMessage(error, 'Failed to update promotion.') };
  }
}

export async function deletePromotion(id: string) {
  try {
    await protectServerAction();
    await connectToDatabase();

    if (!Types.ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid promotion.' };
    }

    const deleted = await Promotion.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: 'Promotion not found.' };
    }

    revalidatePromoPaths();
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to delete promotion:', error);
    return { success: false, error: getErrorMessage(error, 'Failed to delete promotion.') };
  }
}
