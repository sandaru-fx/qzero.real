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
    grade: { type: String, default: '' },
    year: Number,
    price: Number,
    mileage: Number,
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] },
    transmission: { type: String, enum: ['Automatic', 'Manual'] },
    engineCapacity: String,
    bodyType: {
      type: String,
      enum: [
        'Car',
        'SUV',
        'Van',
        'Truck',
        'Pickup',
        'Wagon',
        'Hatchback',
        'Sedan',
        'Coupe',
        'Convertible',
        'Other',
      ],
      default: 'Car',
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Reconditioned', 'Used'],
      default: 'Reconditioned',
    },
    images: [String],
    description: String,
    slug: { type: String, unique: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);

function slugify(brand, model, year) {
  const base = `${brand} ${model} ${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Premium Unsplash car photos — one primary image each */
const vehicles = [
  {
    brand: 'Toyota',
    model: 'Prado',
    grade: 'TX-L',
    year: 2022,
    price: 24500000,
    mileage: 18500,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engineCapacity: '2755cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Toyota Land Cruiser Prado TX-L with 7 seats, leather interior, sunroof, and verified Japanese auction sheet. Ideal family SUV with strong resale.',
    isFeatured: true,
  },
  {
    brand: 'Toyota',
    model: 'Alphard',
    grade: 'Executive Lounge',
    year: 2021,
    price: 19800000,
    mileage: 22000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineCapacity: '2494cc',
    bodyType: 'Van',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Executive Alphard Hybrid with captain seats, power sliding doors, and premium lounge package. Perfect VIP / family MPV.',
    isFeatured: true,
  },
  {
    brand: 'Toyota',
    model: 'Harrier',
    grade: 'Z Leather Package',
    year: 2023,
    price: 14200000,
    mileage: 9800,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineCapacity: '2487cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Near-new Harrier Z with panoramic roof, JBL audio, and advanced safety suite. Low mileage Japan import.',
    isFeatured: false,
  },
  {
    brand: 'Toyota',
    model: 'Raize',
    grade: 'Z',
    year: 2022,
    price: 6850000,
    mileage: 16000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '996cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Compact turbo Raize Z — efficient city crossover with stylish two-tone exterior and full option package.',
    isFeatured: false,
  },
  {
    brand: 'Honda',
    model: 'CR-V',
    grade: 'EX-L',
    year: 2021,
    price: 11200000,
    mileage: 27500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1498cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1511919884225-912b5d59cf83?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Honda CR-V EX-L with leather, Honda Sensing, and spacious cabin. Reliable family SUV with clean service history.',
    isFeatured: false,
  },
  {
    brand: 'Honda',
    model: 'Fit',
    grade: 'Hybrid RS',
    year: 2020,
    price: 5450000,
    mileage: 34000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineCapacity: '1496cc',
    bodyType: 'Hatchback',
    condition: 'Used',
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Fuel-sipping Fit Hybrid RS — sporty styling, Magic Seat versatility, ideal first car or city daily.',
    isFeatured: false,
  },
  {
    brand: 'Nissan',
    model: 'X-Trail',
    grade: 'Mode Premier',
    year: 2022,
    price: 12800000,
    mileage: 21000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineCapacity: '1497cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Nissan X-Trail e-POWER Mode Premier with panoramic glass roof and ProPILOT assist. Quiet hybrid drive.',
    isFeatured: true,
  },
  {
    brand: 'Nissan',
    model: 'Leaf',
    grade: 'G',
    year: 2021,
    price: 7200000,
    mileage: 19000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    engineCapacity: 'Electric',
    bodyType: 'Hatchback',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Nissan Leaf G EV with healthy battery health report, ProPILOT, and zero petrol running costs.',
    isFeatured: false,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'GLC 300',
    grade: 'AMG Line',
    year: 2022,
    price: 26800000,
    mileage: 14500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1991cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'GLC 300 AMG Line with MBUX, panoramic roof, Burmester audio, and full Mercedes service history.',
    isFeatured: true,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'E300',
    grade: 'Exclusive',
    year: 2020,
    price: 21500000,
    mileage: 38000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1991cc',
    bodyType: 'Sedan',
    condition: 'Used',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Executive E-Class sedan — air suspension, digital cockpit, and refined long-distance comfort.',
    isFeatured: false,
  },
  {
    brand: 'BMW',
    model: '530i',
    grade: 'M Sport',
    year: 2021,
    price: 23200000,
    mileage: 26000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1998cc',
    bodyType: 'Sedan',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1617531653520-bd460e6a0268?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'BMW 530i M Sport with laser lights, Harman Kardon, and adaptive suspension. Sharp executive saloon.',
    isFeatured: true,
  },
  {
    brand: 'BMW',
    model: 'X3',
    grade: 'xDrive30i',
    year: 2022,
    price: 24800000,
    mileage: 17000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1998cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'X3 xDrive30i — sporty mid-size SUV with panoramic roof, gesture control, and all-wheel drive.',
    isFeatured: false,
  },
  {
    brand: 'Audi',
    model: 'A4',
    grade: 'S Line 45 TFSI',
    year: 2021,
    price: 16800000,
    mileage: 29000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1984cc',
    bodyType: 'Sedan',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Audi A4 S Line with Virtual Cockpit, Quattro, and Bang & Olufsen sound. Sharp business sedan.',
    isFeatured: false,
  },
  {
    brand: 'Audi',
    model: 'Q5',
    grade: '45 TFSI Quattro',
    year: 2020,
    price: 18900000,
    mileage: 35000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1984cc',
    bodyType: 'SUV',
    condition: 'Used',
    images: [
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Audi Q5 Quattro — premium family SUV with virtual cockpit, matrix LED, and spacious boot.',
    isFeatured: false,
  },
  {
    brand: 'Lexus',
    model: 'RX 450h',
    grade: 'F Sport',
    year: 2021,
    price: 27500000,
    mileage: 23000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineCapacity: '3456cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1617814077290-2b7c2b0a5f0a?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Lexus RX 450h F Sport — whisper-quiet hybrid luxury, Mark Levinson audio, and unmatched reliability.',
    isFeatured: true,
  },
  {
    brand: 'Lexus',
    model: 'ES 300h',
    grade: 'Luxury',
    year: 2022,
    price: 19600000,
    mileage: 12000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineCapacity: '2487cc',
    bodyType: 'Sedan',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'ES 300h Luxury — serene hybrid sedan with ventilated seats, HUD, and Lexus Safety System+.',
    isFeatured: false,
  },
  {
    brand: 'Porsche',
    model: 'Cayenne',
    grade: 'S',
    year: 2019,
    price: 32000000,
    mileage: 42000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '2894cc',
    bodyType: 'SUV',
    condition: 'Used',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Porsche Cayenne S — performance SUV with sport chrono, air suspension, and full OPC service book.',
    isFeatured: true,
  },
  {
    brand: 'Land Rover',
    model: 'Discovery Sport',
    grade: 'R-Dynamic SE',
    year: 2021,
    price: 17800000,
    mileage: 31000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engineCapacity: '1999cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Discovery Sport R-Dynamic — 7-seat capability, Terrain Response, and premium family practicality.',
    isFeatured: false,
  },
  {
    brand: 'Mitsubishi',
    model: 'Outlander',
    grade: 'PHEV G',
    year: 2022,
    price: 10500000,
    mileage: 15500,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineCapacity: '2360cc',
    bodyType: 'SUV',
    condition: 'Reconditioned',
    images: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Outlander PHEV — plug-in hybrid SUV with EV range for city runs and petrol backup for long trips.',
    isFeatured: false,
  },
  {
    brand: 'Suzuki',
    model: 'Jimny',
    grade: 'Sierra',
    year: 2023,
    price: 8950000,
    mileage: 6500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1462cc',
    bodyType: 'SUV',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1511919884225-912b5d59cf83?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Near-new Jimny Sierra — iconic 4x4, automatic gearbox, and adventure-ready compact footprint.',
    isFeatured: false,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });

  const before = await Vehicle.countDocuments();
  console.log(`Existing vehicles: ${before}`);

  const docs = vehicles.map((v) => ({
    ...v,
    slug: slugify(v.brand, v.model, v.year),
  }));

  const inserted = await Vehicle.insertMany(docs, { ordered: false });
  const after = await Vehicle.countDocuments();

  console.log(`Added ${inserted.length} vehicles with images.`);
  console.log(`Total vehicles now: ${after}`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  if (error.writeErrors) {
    console.error(
      'Partial write errors:',
      error.writeErrors.map((e) => e.errmsg || e.err?.message).join('; ')
    );
  }
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
