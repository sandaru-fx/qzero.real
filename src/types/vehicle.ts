export interface IVehicle {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: 'Automatic' | 'Manual';
  engineCapacity: string;
  images: string[];
  description: string;
  slug: string;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
