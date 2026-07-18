'use server';

import { Types } from 'mongoose';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { protectServerAction } from '@/lib/auth';
import type { ClientReviewInput, ReviewFormInput, ReviewView } from '@/types/review';

type LeanReview = {
  _id: Types.ObjectId | string;
  clientName: string;
  vehicleName: string;
  reviewText: string;
  rating: number;
  imageUrl?: string;
  isFeatured?: boolean;
  isApproved?: boolean;
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
    // Legacy docs without the field count as approved
    isApproved: doc.isApproved !== false,
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
  const isApproved = input.isApproved !== false;

  if (!clientName) throw new Error('Client name is required.');
  if (!vehicleName) throw new Error('Vehicle name is required.');
  if (!reviewText) throw new Error('Review text is required.');
  if (reviewText.length < 10) throw new Error('Review text should be at least 10 characters.');

  return { clientName, vehicleName, reviewText, rating, imageUrl, isFeatured, isApproved };
}

/** Public: only approved reviews */
export async function getReviews(): Promise<ReviewView[]> {
  try {
    await connectToDatabase();
    const docs = await Review.find({ isApproved: { $ne: false } })
      .sort({ createdAt: -1 })
      .lean<LeanReview[]>();
    return docs.map(toView);
  } catch {
    return [];
  }
}

/** Public homepage marquee */
export async function getFeaturedReviews(limit = 12): Promise<ReviewView[]> {
  try {
    await connectToDatabase();
    const docs = await Review.find({ isFeatured: true, isApproved: { $ne: false } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<LeanReview[]>();

    if (docs.length > 0) return docs.map(toView);

    const latest = await Review.find({ isApproved: { $ne: false } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<LeanReview[]>();
    return latest.map(toView);
  } catch {
    return [];
  }
}

/** Admin: all reviews including pending */
export async function getAdminReviews(): Promise<ReviewView[]> {
  try {
    await protectServerAction();
    await connectToDatabase();
    const docs = await Review.find({}).sort({ createdAt: -1 }).lean<LeanReview[]>();
    return docs.map(toView);
  } catch {
    return [];
  }
}

/** Admin create — published by default */
export async function addReview(input: ReviewFormInput) {
  try {
    await protectServerAction();
    await connectToDatabase();
    const data = normalizeInput({ ...input, isApproved: input.isApproved !== false });
    const created = await Review.create(data);
    revalidateReviewPaths();
    return { success: true as const, id: String(created._id) };
  } catch (error) {
    return { success: false as const, error: getErrorMessage(error, 'Failed to add review.') };
  }
}

/** Public client submission — pending until admin approves */
export async function submitClientReview(input: ClientReviewInput) {
  try {
    await connectToDatabase();
    const clientName = input.clientName?.trim() || '';
    const vehicleName = input.vehicleName?.trim() || '';
    const reviewText = input.reviewText?.trim() || '';
    const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 5)));

    if (!clientName) throw new Error('Please enter your name.');
    if (!vehicleName) throw new Error('Please enter the vehicle you purchased.');
    if (!reviewText || reviewText.length < 20) {
      throw new Error('Please write a review of at least 20 characters.');
    }

    const created = await Review.create({
      clientName,
      vehicleName,
      reviewText,
      rating,
      imageUrl: '',
      isFeatured: false,
      isApproved: false,
    });

    revalidatePath('/admin/reviews');
    return { success: true as const, id: String(created._id) };
  } catch (error) {
    return {
      success: false as const,
      error: getErrorMessage(error, 'Could not submit your review. Please try again.'),
    };
  }
}

export async function updateReview(id: string, input: ReviewFormInput) {
  try {
    await protectServerAction();
    if (!Types.ObjectId.isValid(id)) {
      return { success: false as const, error: 'Invalid review id.' };
    }
    await connectToDatabase();
    const data = normalizeInput(input);
    const updated = await Review.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return { success: false as const, error: 'Review not found.' };
    }
    revalidateReviewPaths();
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: getErrorMessage(error, 'Failed to update review.') };
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

export async function toggleApprovedStatus(id: string) {
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
    const next = doc.isApproved === false;
    doc.isApproved = next;
    if (!next) doc.isFeatured = false;
    await doc.save();
    revalidateReviewPaths();
    return { success: true as const, isApproved: doc.isApproved };
  } catch (error) {
    return {
      success: false as const,
      error: getErrorMessage(error, 'Failed to update approval status.'),
    };
  }
}
