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

const PromotionSchema = new mongoose.Schema(
  {
    source: { type: String, enum: ['inventory', 'custom'], default: 'custom' },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    year: { type: Number, default: 0 },
    image: { type: String, default: '' },
    href: { type: String, default: '/contact' },
    title: { type: String, default: '' },
    badge: { type: String, required: true },
    validUntil: { type: String, required: true },
    highlight: { type: String, required: true },
    highlightAccent: { type: String, default: '' },
    description: { type: String, required: true },
    cta: { type: String, default: 'Inquire Now' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);

/** Custom promo vehicles — not tied to showroom inventory */
const demoPromotions = [
  {
    source: 'custom',
    brand: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2023,
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80',
    href: '/contact',
    title: 'Range Rover Sport Exclusive Upgrade Offer',
    badge: 'Featured Offer',
    validUntil: '30th Sept 2026',
    highlight: 'Save LKR 1,500,000',
    highlightAccent: '0% interest plans available',
    description:
      'Premium reconditioned Range Rover Sport with complimentary detailing, priority delivery, and exclusive finance options for qualified buyers.',
    cta: 'Get Offer',
    featured: true,
  },
  {
    source: 'custom',
    brand: 'Mercedes-Benz',
    model: 'C200 AMG Line',
    year: 2022,
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    href: '/contact',
    title: 'C200 AMG Line Concierge Package',
    badge: 'Limited Time',
    validUntil: '15th Oct 2026',
    highlight: 'Save LKR 850,000',
    highlightAccent: 'free first service',
    description:
      'AMG Line styling with white-glove handover, complimentary first service, and dedicated QZERO concierge support.',
    cta: 'Inquire Now',
    featured: false,
  },
  {
    source: 'custom',
    brand: 'BMW',
    model: 'X5 xDrive',
    year: 2023,
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    href: '/international',
    title: 'X5 xDrive Fee Waiver',
    badge: 'International Special',
    validUntil: '31st Oct 2026',
    highlight: 'Sourcing fee waived',
    highlightAccent: 'full inspection included',
    description:
      'Japan / UK sourced BMW X5 with waived concierge sourcing fee, certified inspection report, and insured freight package.',
    cta: 'Start Inquiry',
    featured: false,
  },
  {
    source: 'custom',
    brand: 'Porsche',
    model: 'Cayenne',
    year: 2021,
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    href: '/contact',
    title: 'Cayenne Trade-In Boost',
    badge: 'Upgrade',
    validUntil: '20th Dec 2026',
    highlight: 'Extra LKR 500,000',
    highlightAccent: 'on approved trade-ins',
    description:
      'Upgrade into this Porsche Cayenne and unlock an exclusive trade-in valuation boost on approved models.',
    cta: 'Get Valuation',
    featured: false,
  },
  {
    source: 'custom',
    brand: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2024,
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
    href: '/contact',
    title: 'Prado Early Arrival Offer',
    badge: 'New Arrival',
    validUntil: '30th Nov 2026',
    highlight: 'Priority allocation',
    highlightAccent: 'deposit locks your unit',
    description:
      'Secure this Prado before it hits the public showroom — priority allocation with dedicated delivery scheduling.',
    cta: 'Reserve Now',
    featured: false,
  },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.');

  // Old unique index blocks multiple custom promos (vehicleId: null)
  try {
    await Promotion.collection.dropIndex('vehicleId_1');
    console.log('Dropped unique vehicleId_1 index.');
  } catch (err) {
    if (err?.codeName === 'IndexNotFound' || err?.code === 27) {
      console.log('vehicleId_1 index already gone.');
    } else {
      console.warn('Index drop note:', err?.message || err);
    }
  }

  try {
    await Promotion.collection.createIndex({ vehicleId: 1 }, { sparse: true, name: 'vehicleId_sparse_1' });
    console.log('Created sparse vehicleId index.');
  } catch (err) {
    console.warn('Sparse index note:', err?.message || err);
  }

  // Avoid duplicates if re-run: clear custom seed titles that match
  const titles = demoPromotions.map((p) => p.title);
  const removed = await Promotion.deleteMany({ title: { $in: titles } });
  console.log(`Cleared ${removed.deletedCount} existing matching promos.`);

  // Ensure only one featured overall
  await Promotion.updateMany({ featured: true }, { $set: { featured: false } });

  const created = await Promotion.insertMany(
    demoPromotions.map(({ ...promo }) => {
      // omit vehicleId so sparse index allows many custom offers
      return promo;
    })
  );
  console.log(`Inserted ${created.length} promotion vehicles.`);
  for (const p of created) {
    console.log(` - ${p.brand} ${p.model}${p.featured ? ' (featured)' : ''}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
