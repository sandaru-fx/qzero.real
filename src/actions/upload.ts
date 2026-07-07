'use server'

import cloudinary from '@/lib/cloudinary';

export async function uploadVehicleImage(formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'qzero_vehicles' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Write the buffer to the stream and close it
      uploadStream.end(buffer);
    });

    return { 
      success: true, 
      url: (result as any).secure_url 
    };

  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message || 'Failed to upload image' };
  }
}
