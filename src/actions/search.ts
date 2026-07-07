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

    const filter: QueryFilter<IVehicle> = {};
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
