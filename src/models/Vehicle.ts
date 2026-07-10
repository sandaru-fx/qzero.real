import mongoose, { Schema, Model } from 'mongoose';
import { IVehicle } from '@/types/vehicle';

const VehicleSchema = new Schema<IVehicle>(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true, index: true },
    mileage: { type: Number, required: true },
    fuelType: { 
      type: String, 
      required: true,
      enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric']
    },
    transmission: { 
      type: String, 
      required: true,
      enum: ['Automatic', 'Manual']
    },
    engineCapacity: { type: String, required: true },
    condition: {
      type: String,
      required: true,
      enum: ['Brand New', 'Reconditioned', 'Used'],
      default: 'Reconditioned',
    },
    images: { type: [String], required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Prevent compilation error in Next.js hot reload
const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

export default Vehicle;
