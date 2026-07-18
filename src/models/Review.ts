import mongoose, { Schema, Model } from 'mongoose';

export interface IReview {
  clientName: string;
  vehicleName: string;
  reviewText: string;
  rating: number;
  imageUrl: string;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>(
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

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
