'use server'

import { Types } from 'mongoose';
import type { QueryFilter } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { FuelType, IVehicle, Transmission, VehicleView } from '@/types/vehicle';

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
  fuelType?: string;
  transmission?: string;
  featured?: boolean;
  limit?: number;
};

const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissions: Transmission[] = ['Automatic', 'Manual'];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function serializeVehicle(vehicle: LeanVehicle): VehicleView {
  return {
    _id: String(vehicle._id),
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    engineCapacity: vehicle.engineCapacity,
    images: vehicle.images,
    description: vehicle.description,
    slug: vehicle.slug,
    isFeatured: vehicle.isFeatured,
    createdAt: vehicle.createdAt?.toISOString(),
    updatedAt: vehicle.updatedAt?.toISOString(),
  };
}

export async function getVehicles(options: VehicleSearchOptions = {}): Promise<VehicleView[]> {
  try {
    await connectToDatabase();

    const filter: any = {};
    const limit = Math.min(Math.max(options.limit ?? 24, 1), 48);
    const query = options.query?.trim();

    if (query) {
      const regex = new RegExp(escapeRegex(query), 'i');
      filter.$or = [
        { brand: regex },
        { model: regex },
        { description: regex },
      ];
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

    if (fuelTypes.includes(options.fuelType as FuelType)) {
      filter.fuelType = options.fuelType as FuelType;
    }

    if (transmissions.includes(options.transmission as Transmission)) {
      filter.transmission = options.transmission as Transmission;
    }

    if (typeof options.featured === 'boolean') {
      filter.isFeatured = options.featured;
    }

    const vehicles = await Vehicle.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
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
