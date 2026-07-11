'use client';

import Image from 'next/image';
import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadVehicleImage } from '@/actions/upload';
import { updateVehicle } from '@/actions/vehicle';
import { UploadCloud, X, Loader2, ArrowLeft } from 'lucide-react';
import { VehicleFormInput, VehicleView } from '@/types/vehicle';
import Link from 'next/link';

// Zod & React Hook Form
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'] as const;
const transmissionTypes = ['Automatic', 'Manual'] as const;
const conditionTypes = ['Brand New', 'Reconditioned', 'Used'] as const;

const bodyTypes = ['Car', 'SUV', 'Van', 'Truck', 'Pickup', 'Wagon', 'Hatchback', 'Sedan', 'Coupe', 'Convertible', 'Other'] as const;

const vehicleFormSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  grade: z.string().default(''),
  year: z.coerce.number().int().min(1900, 'Year must be at least 1900').max(new Date().getFullYear() + 1, 'Invalid future year'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  mileage: z.coerce.number().nonnegative('Mileage cannot be negative'),
  fuelType: z.enum(fuelTypes, {
    error: 'Please select a valid fuel type',
  }),
  transmission: z.enum(transmissionTypes, {
    error: 'Please select a valid transmission',
  }),
  condition: z.enum(conditionTypes, {
    error: 'Please select a valid condition',
  }),
  engineCapacity: z.string().min(1, 'Engine capacity is required'),
  bodyType: z.enum(bodyTypes).default('Car'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters'),
  isFeatured: z.boolean(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export default function EditVehicleForm({ vehicle }: { vehicle: VehicleView }) {
  const router = useRouter();
  
  const [images, setImages] = useState<string[]>(vehicle.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [imagesError, setImagesError] = useState('');

  // Inline Notification State
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof vehicleFormSchema>, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      brand: vehicle.brand,
      model: vehicle.model,
      grade: vehicle.grade || '',
      year: vehicle.year,
      price: vehicle.price,
      mileage: vehicle.mileage,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      condition: vehicle.condition || 'Reconditioned',
      engineCapacity: vehicle.engineCapacity,
      bodyType: vehicle.bodyType || 'Car',
      description: vehicle.description || '',
      isFeatured: vehicle.isFeatured || false,
    },
  });

  // Auto-dismiss notifications after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        if (notification.type === 'success') {
          router.push('/admin/dashboard');
        }
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, router]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    setImagesError('');

    const files = Array.from(e.target.files);
    const newImageUrls: string[] = [];
    let hasError = false;

    for (const file of files) {
      const data = new FormData();
      data.append('file', file);

      try {
        const res = await uploadVehicleImage(data);
        if (res.success && res.url) {
          newImageUrls.push(res.url);
        } else {
          setImagesError(res.error || 'Failed to upload one or more images');
          hasError = true;
        }
      } catch (err: any) {
        setImagesError(err.message || 'An unexpected error occurred');
        hasError = true;
      }
    }

    if (newImageUrls.length > 0) {
      setImages(prev => [...prev, ...newImageUrls]);
    }

    setIsUploading(false);
    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async (data: VehicleFormValues) => {
    setNotification(null);
    setImagesError('');

    if (images.length === 0) {
      setImagesError('Please upload at least one vehicle image.');
      return;
    }

    try {
      const payload: Partial<VehicleFormInput> = {
        ...data,
        images,
      };

      const res = await updateVehicle(vehicle._id, payload);
      
      if (res.success) {
        setNotification({ type: 'success', message: 'Vehicle successfully updated!' });
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to update vehicle.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'An unexpected error occurred' });
    }
  };

  const inputClasses = "w-full bg-[#121212] text-white border border-gray-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl p-3 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClasses = "block text-base font-medium text-gray-400 mb-2";
  const errorClasses = "mt-1.5 text-base text-red-400 font-medium";

  return (
    <div className="min-h-screen bg-brand-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-base text-brand-muted hover:text-brand-gold mb-6 transition-colors disabled:pointer-events-none disabled:opacity-50" aria-disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Vehicle</h1>
          <p className="text-brand-gold mt-2">Update inventory details for {vehicle.brand} {vehicle.model}</p>
        </div>

        {/* Inline Notification Bar */}
        {notification && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center justify-center space-x-3 text-center border animate-in fade-in slide-in-from-top-4 ${
            notification.type === 'success' 
              ? 'bg-brand-card border-brand-gold text-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
              : 'bg-red-950/30 border-red-500/50 text-red-200'
          }`}>
            <p className="font-medium">{notification.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-brand-card p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8 border border-[#242424]">
          
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Brand</label>
              <input type="text" {...register('brand')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. Toyota" />
              {errors.brand && <p className={errorClasses}>{errors.brand.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Model</label>
              <input type="text" {...register('model')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. Land Cruiser" />
              {errors.model && <p className={errorClasses}>{errors.model.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Grade</label>
              <input type="text" {...register('grade')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. X, G, Z (optional)" />
              {errors.grade && <p className={errorClasses}>{errors.grade.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Year</label>
              <input type="number" {...register('year')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. 2024" />
              {errors.year && <p className={errorClasses}>{errors.year.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Price (LKR)</label>
              <input type="number" {...register('price')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. 50000000" />
              {errors.price && <p className={errorClasses}>{errors.price.message}</p>}
            </div>
          </div>

          {/* Specs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div>
              <label className={labelClasses}>Mileage (km)</label>
              <input type="number" {...register('mileage')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. 15000" />
              {errors.mileage && <p className={errorClasses}>{errors.mileage.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Fuel Type</label>
              <select {...register('fuelType')} disabled={isSubmitting} className={inputClasses}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
              {errors.fuelType && <p className={errorClasses}>{errors.fuelType.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Transmission</label>
              <select {...register('transmission')} disabled={isSubmitting} className={inputClasses}>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
              {errors.transmission && <p className={errorClasses}>{errors.transmission.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Condition</label>
              <select {...register('condition')} disabled={isSubmitting} className={inputClasses}>
                <option value="Brand New">Brand New</option>
                <option value="Reconditioned">Reconditioned</option>
                <option value="Used">Used</option>
              </select>
              {errors.condition && <p className={errorClasses}>{errors.condition.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Engine Capacity / Power</label>
              <input type="text" {...register('engineCapacity')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. 2800cc or 150kW" />
              {errors.engineCapacity && <p className={errorClasses}>{errors.engineCapacity.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Body Type</label>
              <select {...register('bodyType')} disabled={isSubmitting} className={inputClasses}>
                <option value="Car">Car</option>
                <option value="SUV">SUV</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Pickup">Pickup</option>
                <option value="Wagon">Wagon</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="Other">Other</option>
              </select>
              {errors.bodyType && <p className={errorClasses}>{errors.bodyType.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClasses}>Premium Description</label>
            <textarea {...register('description')} disabled={isSubmitting} rows={4} className={inputClasses} placeholder="Enter premium vehicle description..."></textarea>
            {errors.description && <p className={errorClasses}>{errors.description.message}</p>}
          </div>

          {/* Image Upload Section */}
          <div>
            <label className={labelClasses}>Vehicle Images (Cloudinary)</label>
            <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-[#242424] border-dashed rounded-2xl transition-colors relative bg-brand-black ${isSubmitting || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-gold group cursor-pointer'}`}>
              <div className="space-y-2 text-center">
                {isUploading ? (
                  <Loader2 className="mx-auto h-10 w-10 text-brand-gold animate-spin" />
                ) : (
                  <UploadCloud className={`mx-auto h-10 w-10 text-gray-400 transition-colors ${!isSubmitting && 'group-hover:text-brand-gold'}`} />
                )}
                <div className="flex text-base text-gray-400 justify-center mt-2">
                  <label htmlFor="file-upload" className={`relative rounded-md font-medium text-brand-gold focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-gold focus-within:ring-offset-brand-black ${isSubmitting || isUploading ? 'cursor-not-allowed' : 'cursor-pointer hover:text-brand-gold-light'}`}>
                    <span>{isUploading ? 'Uploading to Cloudinary...' : 'Upload new images'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={isSubmitting || isUploading} />
                  </label>
                </div>
                <p className="text-sm text-gray-500">JPG, PNG, WEBP up to 10MB each</p>
              </div>
            </div>
            {imagesError && <p className={errorClasses}>{imagesError}</p>}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <h4 className="text-base font-medium text-gray-300">Current Images</h4>
                  <span className="ml-3 bg-brand-gold text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {images.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden bg-brand-black aspect-[4/3] border border-[#242424]">
                      <Image
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-cover"
                      />
                      {!isSubmitting && !isUploading && (
                        <button 
                          type="button" 
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                          aria-label={`Remove image ${idx + 1}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-5 bg-[#121212] rounded-2xl border border-[#242424]">
            <div>
              <h4 className="text-white font-medium">Feature on Homepage</h4>
              <p className="text-base text-gray-400 mt-1">Display this vehicle prominently on the hero section.</p>
            </div>
            <label className={`relative inline-flex items-center ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <>
                    <input type="checkbox" className="sr-only peer" checked={field.value} onChange={field.onChange} disabled={isSubmitting} />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-gold"></div>
                  </>
                )}
              />
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting || isUploading}
              className="w-full rounded-full py-4 px-8 text-black font-bold text-lg bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-light hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.3)] flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin text-black" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
