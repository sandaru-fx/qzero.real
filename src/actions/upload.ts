'use server';

import cloudinary from '@/lib/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { protectServerAction } from '@/lib/auth';

const MAX_REVIEW_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed to upload image';
}

async function uploadToCloudinary(file: File, folder: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error('Cloudinary did not return an upload result'));
      } else {
        resolve(result);
      }
    });
    uploadStream.end(buffer);
  });
}

export async function uploadVehicleImage(formData: FormData) {
  try {
    await protectServerAction();
    const file = formData.get('file') as File | null;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const result = await uploadToCloudinary(file, 'qzero_vehicles');
    return { success: true, url: result.secure_url };
  } catch (error: unknown) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/** Public: optional photo for client review submissions (card background). */
export async function uploadReviewImage(formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false as const, error: 'No file provided.' };
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return { success: false as const, error: 'Please upload a JPG, PNG, or WebP image.' };
    }
    if (file.size > MAX_REVIEW_IMAGE_BYTES) {
      return { success: false as const, error: 'Image must be under 5MB.' };
    }

    const result = await uploadToCloudinary(file, 'qzero_reviews');
    return { success: true as const, url: result.secure_url };
  } catch (error: unknown) {
    console.error('Review image upload error:', error);
    return { success: false as const, error: getErrorMessage(error) };
  }
}
