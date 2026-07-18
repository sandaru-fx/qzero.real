'use server';

import { Types } from 'mongoose';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { protectServerAction } from '@/lib/auth';
import type { ReviewFormInput, ReviewView } from '@/types/review';

type LeanReview = {
  _id: Types.ObjectId | string;
  clientName: string;
  vehicleName: string;
  reviewText: string;
  rating: number;
  imageUrl?: string;
  isFeatured?: boolean;
  createdAt?: Date;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function revalidateReviewPaths() {
  revalidatePath('/');
  revalidatePath('/reviews');
  revalidatePath('/admin/reviews');
}

function toView(doc: LeanReview): ReviewView {
  return {
    id: String(doc._id),
    clientName: doc.clientName,
    vehicleName: doc.vehicleName,
    reviewText: doc.reviewText,
    rating: Math.min(5, Math.max(1, Number(doc.rating) || 5)),
    imageUrl: doc.imageUrl?.trim() || '',
    isFeatured: Boolean(doc.isFeatured),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  };
}

function normalizeInput(input: ReviewFormInput) {
  const clientName = input.clientName?.trim() || '';
  const vehicleName = input.vehicleName?.trim() || '';
  const reviewText = input.reviewText?.trim() || '';
  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 5)));
  const imageUrl = input.imageUrl?.trim() || '';
  const isFeatured = Boolean(input.isFeatured);

  if (!clientName) throw new Error('Client name is required.');
  if (!vehicleName) throw new Error('Vehicle name is required.');
  if (!reviewText) throw new Error('Review text is required.');
  if (reviewText.length < 10) throw new Error('Review text should be at least 10 characters.');

  return { clientName, vehicleName, reviewText, rating, imageUrl, isFeatured };
}

export async function getReviews(): Promise<ReviewView[]> {
  try {
    await connectToDatabase();
    const docs = await Review.find({}).sort({ createdAt: -1 }).lean<LeanReview[]>();
    return docs.map(toView);
  } catch {
    return [];
  }
}

export async function getFeaturedReviews(limit = 12): Promise<ReviewView[]> {
  try {
    await connectToDatabase();
    const docs = await Review.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<LeanReview[]>();

    if (docs.length > 0) return docs.map(toView);

    // Fallback: show latest reviews on homepage if none featured yet
    const latest = await Review.find({}).sort({ createdAt: -1 }).limit(limit).lean<LeanReview[]>();
    return latest.map(toView);
  } catch {
    return [];
  }
}

export async function addReview(input: ReviewFormInput) {
  try {
    await protectServerAction();
    await connectToDatabase();
    const data = normalizeInput(input);
    const created = await Review.create(data);
    revalidateReviewPaths();
    return { success: true as const, id: String(created._id) };
  } catch (error) {
    return { success: false as const, error: getErrorMessage(error, 'Failed to add review.') };
  }
}

export async function deleteReview(id: string) {
  try {
    await protectServerAction();
    if (!Types.ObjectId.isValid(id)) {
      return { success: false as const, error: 'Invalid review id.' };
    }
    await connectToDatabase();
    await Review.findByIdAndDelete(id);
    revalidateReviewPaths();
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: getErrorMessage(error, 'Failed to delete review.') };
  }
}

export async function toggleFeaturedStatus(id: string) {
  try {
    await protectServerAction();
    if (!Types.ObjectId.isValid(id)) {
      return { success: false as const, error: 'Invalid review id.' };
    }
    await connectToDatabase();
    const doc = await Review.findById(id);
    if (!doc) {
      return { success: false as const, error: 'Review not found.' };
    }
    doc.isFeatured = !doc.isFeatured;
    await doc.save();
    revalidateReviewPaths();
    return { success: true as const, isFeatured: doc.isFeatured };
  } catch (error) {
    return {
      success: false as const,
      error: getErrorMessage(error, 'Failed to update featured status.'),
    };
  }
}
