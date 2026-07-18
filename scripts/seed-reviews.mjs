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

const ReviewSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    vehicleName: { type: String, required: true, trim: true },
    reviewText: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    imageUrl: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

/** Premium demo testimonials — luxury automotive showroom tone */
const demoReviews = [
  {
    clientName: 'Dilan Fernando',
    vehicleName: '2023 Range Rover Autobiography',
    reviewText:
      'From the first consultation to handover, QZERO felt like a private club — not a dealership. The Autobiography arrived immaculate, paperwork was crystal clear, and the team never rushed a single decision. Absolute five-star service.',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isFeatured: true,
  },
  {
    clientName: 'Amaya Perera',
    vehicleName: '2022 Mercedes-Benz G-Class',
    reviewText:
      'We wanted a G-Wagon with provenance we could trust. QZERO sourced the exact spec, walked us through every inspection note, and made delivery feel like an event. Our family is still smiling.',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    isFeatured: true,
  },
  {
    clientName: 'Kasun Jayawardena',
    vehicleName: '2024 Toyota Land Cruiser 300',
    reviewText:
      'The Land Cruiser 300 process was smooth end to end — pricing transparent, response times fast, and the showroom experience was genuinely premium. Highly recommended for serious buyers.',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    isFeatured: true,
  },
  {
    clientName: 'Nimali Silva',
    vehicleName: '2021 Porsche Cayenne S',
    reviewText:
      'I compared several import partners before choosing QZERO. Their attention to detail on the Cayenne — from history checks to final detail — was unmatched. Professional, calm, and luxury-focused.',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    isFeatured: false,
  },
  {
    clientName: 'Ruwan Abeysekera',
    vehicleName: '2023 BMW X5 M Sport',
    reviewText:
      'Booking, inspection updates, and handover were all coordinated without drama. The X5 looks and drives like a new car. QZERO delivers the confidence you expect when spending at this level.',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isFeatured: false,
  },
  {
    clientName: 'Shehani Cooray',
    vehicleName: '2022 Lexus LX 600',
    reviewText:
      'Warm hospitality, clear timelines, and a beautiful LX 600 at the end of it. The team treated us like long-term partners, not a one-time sale. We will be back for our next vehicle.',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    isFeatured: false,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Avoid duplicating the same demo set on re-run (match by clientName + vehicleName)
  let inserted = 0;
  let skipped = 0;

  for (const review of demoReviews) {
    const existing = await Review.findOne({
      clientName: review.clientName,
      vehicleName: review.vehicleName,
    }).lean();

    if (existing) {
      skipped += 1;
      console.log(`Skip (exists): ${review.clientName} — ${review.vehicleName}`);
      continue;
    }

    await Review.create(review);
    inserted += 1;
    console.log(
      `Inserted${review.isFeatured ? ' [featured]' : ''}: ${review.clientName} — ${review.vehicleName}`
    );
  }

  const total = await Review.countDocuments();
  const featured = await Review.countDocuments({ isFeatured: true });
  console.log(`\nDone. Inserted: ${inserted}, skipped: ${skipped}`);
  console.log(`DB now has ${total} review(s), ${featured} featured.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
