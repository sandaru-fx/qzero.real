'use server'

import cloudinary from '@/lib/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { protectServerAction } from '@/lib/auth';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed to upload image';
}

export async function uploadVehicleImage(formData: FormData) {
  try {
    await protectServerAction();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'qzero_vehicles' },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary did not return an upload result'));
          } else {
            resolve(result);
          }
        }
      );
      
      // Write the buffer to the stream and close it
      uploadStream.end(buffer);
    });

    return { 
      success: true, 
      url: result.secure_url 
    };

  } catch (error: unknown) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}
