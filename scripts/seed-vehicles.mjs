import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Missing .env.local');
  process.exit(1);
}

for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const match = line.match(/^MONGODB_URI=(.*)$/);
  if (match) {
    process.env.MONGODB_URI = match[1].trim().replace(/^["']|["']$/g, '');
    break;
  }
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

const VehicleSchema = new mongoose.Schema(
  {
    brand: String,
    model: String,
    year: Number,
    price: Number,
    mileage: Number,
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] },
    transmission: { type: String, enum: ['Automatic', 'Manual'] },
    engineCapacity: String,
    images: [String],
    description: String,
    slug: { type: String, unique: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);

const demoVehicles = [
  {
    brand: 'Toyota',
    model: 'Land Cruiser 300',
    year: 2023,
    price: 28500000,
    mileage: 12000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engineCapacity: '3346cc',
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80'],
    description: 'Premium SUV with full option package, pearl white, verified import history.',
    slug: 'toyota-land-cruiser-300-2023',
    isFeatured: true,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'C200 AMG Line',
    year: 2022,
    price: 19800000,
    mileage: 18500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1497cc',
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80'],
    description: 'Luxury sedan with AMG styling, panoramic roof, and full service records.',
    slug: 'mercedes-benz-c200-amg-line-2022',
    isFeatured: true,
  },
  {
    brand: 'BMW',
    model: 'X5 xDrive40i',
    year: 2021,
    price: 22400000,
    mileage: 24000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '2998cc',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80'],
    description: 'Executive SUV with premium interior, driver assist package, and low ownership history.',
    slug: 'bmw-x5-xdrive40i-2021',
    isFeatured: true,
  },
  {
    brand: 'Audi',
    model: 'Q7 55 TFSI',
    year: 2020,
    price: 17600000,
    mileage: 32000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '2995cc',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80'],
    description: 'Seven-seater luxury SUV, ideal for family use with strong resale value.',
    slug: 'audi-q7-55-tfsi-2020',
    isFeatured: false,
  },
  {
    brand: 'Honda',
    model: 'Vezel RS',
    year: 2022,
    price: 8900000,
    mileage: 15000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineCapacity: '1498cc',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80'],
    description: 'Fuel-efficient hybrid crossover, perfect for city driving and daily use.',
    slug: 'honda-vezel-rs-2022',
    isFeatured: false,
  },
  {
    brand: 'Range Rover',
    model: 'Sport HSE',
    year: 2019,
    price: 26500000,
    mileage: 41000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engineCapacity: '2993cc',
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80'],
    description: 'Flagship SUV with premium leather, air suspension, and full dealer maintenance.',
    slug: 'range-rover-sport-hse-2019',
    isFeatured: true,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });

  const existing = await Vehicle.countDocuments();
  if (existing > 0) {
    console.log(`Database already has ${existing} vehicle(s). Skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  const inserted = await Vehicle.insertMany(demoVehicles);
  console.log(`Seeded ${inserted.length} demo vehicles into ${mongoose.connection.name}.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
