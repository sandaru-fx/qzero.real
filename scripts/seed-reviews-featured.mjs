/**
 * Marks the first 5 reviews as featured for the homepage carousel.
 * Does NOT hardcode reviews into the frontend — updates MongoDB only.
 *
 * Run: npm run seed:reviews:featured
 */
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
    clientName: String,
    vehicleName: String,
    reviewText: String,
    rating: Number,
    imageUrl: String,
    isFeatured: Boolean,
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const all = await Review.find({}).sort({ createdAt: 1 }).lean();
  if (all.length === 0) {
    console.error('No reviews in DB. Run npm run seed:reviews first.');
    process.exit(1);
  }

  await Review.updateMany({}, { $set: { isFeatured: false } });

  const featureCount = Math.min(5, all.length);
  const ids = all.slice(0, featureCount).map((r) => r._id);
  await Review.updateMany({ _id: { $in: ids } }, { $set: { isFeatured: true } });

  const featured = await Review.find({ isFeatured: true })
    .select('clientName vehicleName')
    .lean();

  console.log(`Featured ${featured.length} review(s) for homepage:`);
  for (const r of featured) {
    console.log(`  ✓ ${r.clientName} — ${r.vehicleName}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
