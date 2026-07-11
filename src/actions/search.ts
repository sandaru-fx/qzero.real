'use server'

import { Types } from 'mongoose';
import type { QueryFilter } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { FuelType, IVehicle, Transmission, VehicleCondition, VehicleView } from '@/types/vehicle';
import type { FilterOptions } from '@/types/filters';

type LeanVehicle = Omit<IVehicle, 'createdAt' | 'updatedAt'> & {
  _id: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
};

type VehicleSearchOptions = {
  query?: string;
  make?: string;
  model?: string;
  year?: string;
  price?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  featured?: boolean;
  excludeId?: string;
  limit?: number;
  page?: number;
};

const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissions: Transmission[] = ['Automatic', 'Manual'];
const conditions: VehicleCondition[] = ['Brand New', 'Reconditioned', 'Used'];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function serializeVehicle(vehicle: LeanVehicle): VehicleView {
  return {
    _id: String(vehicle._id),
    brand: vehicle.brand,
    model: vehicle.model,
    grade: vehicle.grade || '',
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    engineCapacity: vehicle.engineCapacity,
    bodyType: vehicle.bodyType || 'Car',
    condition: vehicle.condition || 'Reconditioned',
    images: vehicle.images,
    description: vehicle.description,
    slug: vehicle.slug,
    isFeatured: vehicle.isFeatured,
    createdAt: vehicle.createdAt?.toISOString(),
    updatedAt: vehicle.updatedAt?.toISOString(),
  };
}

function buildVehicleFilter(options: Omit<VehicleSearchOptions, 'limit' | 'page'>): QueryFilter<IVehicle> {
  const filter: QueryFilter<IVehicle> = {};
  const query = options.query?.trim();

  if (query) {
    const regex = new RegExp(escapeRegex(query), 'i');
    filter.$or = [{ brand: regex }, { model: regex }, { description: regex }];
  }

  if (options.make && options.make !== 'Any Make') {
    filter.brand = new RegExp(escapeRegex(options.make.trim()), 'i');
  }

  if (options.model && options.model !== 'Any Model') {
    filter.model = new RegExp(escapeRegex(options.model.trim()), 'i');
  }

  if (options.year && !isNaN(Number(options.year))) {
    filter.year = Number(options.year);
  }

  if (options.price) {
    if (options.price.includes('Under Rs 5M')) filter.price = { $lt: 5000000 };
    else if (options.price.includes('Rs 5M - 10M')) filter.price = { $gte: 5000000, $lte: 10000000 };
    else if (options.price.includes('Rs 10M - 20M')) filter.price = { $gte: 10000000, $lte: 20000000 };
    else if (options.price.includes('Rs 20M - 30M')) filter.price = { $gte: 20000000, $lte: 30000000 };
    else if (options.price.includes('Over Rs 30M')) filter.price = { $gt: 30000000 };
  }

  if (conditions.includes(options.condition as VehicleCondition)) {
    filter.condition = options.condition as VehicleCondition;
  }

  if (options.excludeId && Types.ObjectId.isValid(options.excludeId)) {
    filter._id = { $ne: new Types.ObjectId(options.excludeId) };
  }

  if (fuelTypes.includes(options.fuelType as FuelType)) {
    filter.fuelType = options.fuelType as FuelType;
  }

  if (transmissions.includes(options.transmission as Transmission)) {
    filter.transmission = options.transmission as Transmission;
  }

  if (typeof options.featured === 'boolean') {
    filter.isFeatured = options.featured;
  }

  return filter;
}

export async function getVehicles(options: VehicleSearchOptions = {}): Promise<VehicleView[]> {
  try {
    await connectToDatabase();

    const filter = buildVehicleFilter(options);
    const limit = Math.min(Math.max(options.limit ?? 24, 1), 48);
    const page = Math.max(options.page ?? 1, 1);
    const skip = (page - 1) * limit;

    const vehicles = await Vehicle.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<LeanVehicle[]>();

    return vehicles.map(serializeVehicle);
  } catch (error) {
    console.warn('Vehicle query skipped:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export async function getFeaturedVehicles(limit = 6): Promise<VehicleView[]> {
  return getVehicles({ featured: true, limit });
}

export async function getVehicleBySlug(slug: string): Promise<VehicleView | null> {
  try {
    await connectToDatabase();

    const vehicle = await Vehicle.findOne({ slug }).lean<LeanVehicle | null>();
    return vehicle ? serializeVehicle(vehicle) : null;
  } catch (error) {
    console.warn('Vehicle detail query skipped:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export async function getVehicleById(id: string): Promise<VehicleView | null> {
  try {
    await connectToDatabase();
    
    // Check if valid ObjectId
    if (!Types.ObjectId.isValid(id)) return null;

    const vehicle = await Vehicle.findById(id).lean<LeanVehicle | null>();
    return vehicle ? serializeVehicle(vehicle) : null;
  } catch (error) {
    console.warn('Vehicle by ID query skipped:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const defaults: FilterOptions = {
    makes: [],
    models: [],
    years: [],
    conditions: [...conditions],
    priceRanges: [
      'Under Rs 5M',
      'Rs 5M - 10M',
      'Rs 10M - 20M',
      'Rs 20M - 30M',
      'Over Rs 30M',
    ],
  };

  try {
    await connectToDatabase();

    const [makes, models, years] = await Promise.all([
      Vehicle.distinct('brand'),
      Vehicle.distinct('model'),
      Vehicle.distinct('year'),
    ]);

    return {
      makes: makes.filter(Boolean).sort() as string[],
      models: models.filter(Boolean).sort() as string[],
      years: (years as number[])
        .filter(Boolean)
        .sort((a, b) => b - a)
        .map(String),
      conditions: [...conditions],
      priceRanges: defaults.priceRanges,
    };
  } catch (error) {
    console.warn('Filter options skipped:', error instanceof Error ? error.message : 'Unknown error');
    return defaults;
  }
}

export async function getVehicleCount(
  options: Omit<VehicleSearchOptions, 'limit' | 'page'> = {}
): Promise<number> {
  try {
    await connectToDatabase();
    const filter = buildVehicleFilter(options);
    return await Vehicle.countDocuments(filter);
  } catch {
    return 0;
  }
}

export async function getRelatedVehicles(
  vehicle: VehicleView,
  limit = 3
): Promise<VehicleView[]> {
  try {
    await connectToDatabase();

    const related = await Vehicle.find({
      _id: { $ne: vehicle._id },
      brand: vehicle.brand,
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(limit)
      .lean<LeanVehicle[]>();

    if (related.length >= limit) {
      return related.map(serializeVehicle);
    }

    const fallback = await Vehicle.find({
      _id: { $ne: vehicle._id, $nin: related.map((v) => v._id) },
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(limit - related.length)
      .lean<LeanVehicle[]>();

    return [...related, ...fallback].map(serializeVehicle);
  } catch (error) {
    console.warn('Related vehicles skipped:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}
