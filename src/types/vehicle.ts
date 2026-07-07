export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type Transmission = 'Automatic' | 'Manual';

export interface IVehicle {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  engineCapacity: string;
  images: string[];
  description: string;
  slug: string;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type VehicleFormInput = Omit<IVehicle, 'slug' | 'createdAt' | 'updatedAt'>;

export interface VehicleView extends Omit<IVehicle, 'createdAt' | 'updatedAt'> {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}
