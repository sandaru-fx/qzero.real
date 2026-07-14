import mongoose, { Schema, Model, Types } from 'mongoose';

export type PromotionSource = 'inventory' | 'custom';

export interface IPromotion {
  source: PromotionSource;
  vehicleId?: Types.ObjectId | null;
  brand: string;
  model: string;
  year: number;
  image: string;
  href: string;
  title: string;
  badge: string;
  validUntil: string;
  highlight: string;
  highlightAccent: string;
  description: string;
  cta: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    source: {
      type: String,
      enum: ['inventory', 'custom'],
      default: 'inventory',
      index: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
      index: true,
    },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    year: { type: Number, default: 0 },
    image: { type: String, default: '' },
    href: { type: String, default: '/contact' },
    title: { type: String, default: '' },
    badge: { type: String, required: true, default: 'Limited Offer' },
    validUntil: { type: String, required: true },
    highlight: { type: String, required: true },
    highlightAccent: { type: String, default: '' },
    description: { type: String, required: true },
    cta: { type: String, default: 'View Offer' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Promotion: Model<IPromotion> =
  mongoose.models.Promotion || mongoose.model<IPromotion>('Promotion', PromotionSchema);

export default Promotion;
