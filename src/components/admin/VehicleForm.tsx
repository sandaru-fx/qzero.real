'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, UploadCloud, X } from 'lucide-react';
import { uploadVehicleImage } from '@/actions/upload';
import { createVehicle, updateVehicle } from '@/actions/vehicle';
import { VehicleFormInput, VehicleView } from '@/types/vehicle';

const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'] as const;
const transmissionTypes = ['Automatic', 'Manual'] as const;
const conditionTypes = ['Brand New', 'Reconditioned', 'Used'] as const;
const bodyTypes = [
  'Car',
  'SUV',
  'Van',
  'Truck',
  'Pickup',
  'Wagon',
  'Hatchback',
  'Sedan',
  'Coupe',
  'Convertible',
  'Other',
] as const;

const vehicleFormSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  grade: z.string().default(''),
  year: z.coerce
    .number()
    .int()
    .min(1900, 'Year must be at least 1900')
    .max(new Date().getFullYear() + 1, 'Invalid future year'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  mileage: z.coerce.number().nonnegative('Mileage cannot be negative'),
  fuelType: z.enum(fuelTypes, { error: 'Please select a valid fuel type' }),
  transmission: z.enum(transmissionTypes, { error: 'Please select a valid transmission' }),
  condition: z.enum(conditionTypes, { error: 'Please select a valid condition' }),
  engineCapacity: z.string().min(1, 'Engine capacity is required'),
  bodyType: z.enum(bodyTypes).default('Car'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),
  isFeatured: z.boolean(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

type VehicleFormProps = {
  mode: 'create' | 'edit';
  vehicle?: VehicleView;
};

export default function VehicleForm({ mode, vehicle }: VehicleFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(vehicle?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [imagesError, setImagesError] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof vehicleFormSchema>, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      brand: vehicle?.brand || '',
      model: vehicle?.model || '',
      grade: vehicle?.grade || '',
      year: vehicle?.year || new Date().getFullYear(),
      price: vehicle?.price || undefined,
      mileage: vehicle?.mileage ?? 0,
      fuelType: vehicle?.fuelType || 'Petrol',
      transmission: vehicle?.transmission || 'Automatic',
      condition: vehicle?.condition || 'Reconditioned',
      engineCapacity: vehicle?.engineCapacity || '',
      bodyType: vehicle?.bodyType || 'Car',
      description: vehicle?.description || '',
      isFeatured: vehicle?.isFeatured || false,
    },
  });

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      if (notification.type === 'success') {
        router.push('/admin/inventory');
        router.refresh();
      }
      setNotification(null);
    }, 1800);
    return () => clearTimeout(timer);
  }, [notification, router]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    setImagesError('');
    const files = Array.from(e.target.files);
    const newImageUrls: string[] = [];

    for (const file of files) {
      const data = new FormData();
      data.append('file', file);
      try {
        const res = await uploadVehicleImage(data);
        if (res.success && res.url) {
          newImageUrls.push(res.url);
        } else {
          setImagesError(res.error || 'Failed to upload one or more images');
        }
      } catch (err) {
        setImagesError(err instanceof Error ? err.message : 'Upload failed');
      }
    }

    if (newImageUrls.length > 0) {
      setImages((prev) => [...prev, ...newImageUrls]);
    }
    setIsUploading(false);
    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async (data: VehicleFormValues) => {
    setNotification(null);
    setImagesError('');

    if (images.length === 0) {
      setImagesError('Please upload at least one vehicle image.');
      return;
    }

    if (mode === 'create' && images.length < 5) {
      setImagesError('Please upload at least 5 images for the gallery.');
      return;
    }

    const payload: VehicleFormInput = {
      ...data,
      images,
    };

    try {
      const res =
        mode === 'create'
          ? await createVehicle(payload)
          : await updateVehicle(vehicle!._id, payload);

      if (res.success) {
        setNotification({
          type: 'success',
          message: mode === 'create' ? 'Vehicle published successfully!' : 'Vehicle updated successfully!',
        });
      } else {
        setNotification({ type: 'error', message: res.error || 'Something went wrong.' });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
    }
  };

  const inputClasses =
    'w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-3 text-white outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold disabled:cursor-not-allowed disabled:opacity-50';
  const labelClasses = 'mb-2 block text-sm font-medium text-brand-muted';
  const errorClasses = 'mt-1.5 text-sm font-medium text-red-400';

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/inventory"
        className="mb-6 inline-flex items-center gap-2 text-sm text-brand-muted transition-colors hover:text-brand-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to inventory
      </Link>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
          {mode === 'create' ? 'Create' : 'Update'}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          {mode === 'create' ? 'Add New Vehicle' : `Edit ${vehicle?.brand} ${vehicle?.model}`}
        </h1>
        <p className="mt-2 text-brand-muted">
          {mode === 'create'
            ? 'Fill in the details and upload at least 5 gallery images.'
            : 'Update inventory details, media, and listing status.'}
        </p>
      </div>

      {notification && (
        <div
          className={`mb-6 rounded-2xl border p-4 text-center text-sm font-medium ${
            notification.type === 'success'
              ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-gold'
              : 'border-red-500/40 bg-red-950/30 text-red-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left — Basic Info */}
        <section className="space-y-6 rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-white">Basic Information</h2>
            <p className="mt-1 text-sm text-brand-muted">Make, model, pricing and core specs.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Make / Brand</label>
              <input type="text" {...register('brand')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. Toyota" />
              {errors.brand && <p className={errorClasses}>{errors.brand.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Model</label>
              <input type="text" {...register('model')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. Yaris" />
              {errors.model && <p className={errorClasses}>{errors.model.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Grade</label>
              <input type="text" {...register('grade')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. X, G, Z" />
            </div>
            <div>
              <label className={labelClasses}>Year</label>
              <input type="number" {...register('year')} disabled={isSubmitting} className={inputClasses} />
              {errors.year && <p className={errorClasses}>{errors.year.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Price (LKR)</label>
              <input type="number" {...register('price')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. 12500000" />
              {errors.price && <p className={errorClasses}>{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Mileage (km)</label>
              <input type="number" {...register('mileage')} disabled={isSubmitting} className={inputClasses} />
              {errors.mileage && <p className={errorClasses}>{errors.mileage.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Fuel Type</label>
              <select {...register('fuelType')} disabled={isSubmitting} className={inputClasses}>
                {fuelTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Transmission</label>
              <select {...register('transmission')} disabled={isSubmitting} className={inputClasses}>
                {transmissionTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Condition</label>
              <select {...register('condition')} disabled={isSubmitting} className={inputClasses}>
                {conditionTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Body Type</label>
              <select {...register('bodyType')} disabled={isSubmitting} className={inputClasses}>
                {bodyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClasses}>Engine Capacity</label>
              <input type="text" {...register('engineCapacity')} disabled={isSubmitting} className={inputClasses} placeholder="e.g. 996 CC" />
              {errors.engineCapacity && <p className={errorClasses}>{errors.engineCapacity.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className={labelClasses}>Description</label>
              <textarea
                {...register('description')}
                disabled={isSubmitting}
                rows={8}
                className={inputClasses}
                placeholder="Write a detailed multi-paragraph description..."
              />
              {errors.description && <p className={errorClasses}>{errors.description.message}</p>}
            </div>
          </div>
        </section>

        {/* Right — Media + Status */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">Media</h2>
              <p className="mt-1 text-sm text-brand-muted">Main image + gallery (minimum 5 photos).</p>
            </div>

            <label
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-[#0A0A0A] px-6 py-10 transition-colors ${
                isSubmitting || isUploading ? 'opacity-50' : 'hover:border-brand-gold/40'
              }`}
            >
              {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin text-brand-gold" />
              ) : (
                <UploadCloud className="h-10 w-10 text-brand-muted" />
              )}
              <span className="mt-3 text-sm font-medium text-brand-gold">
                {isUploading ? 'Uploading…' : 'Upload images'}
              </span>
              <span className="mt-1 text-xs text-brand-muted">JPG, PNG, WEBP up to 10MB</span>
              <input
                type="file"
                className="sr-only"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={isSubmitting || isUploading}
              />
            </label>

            {imagesError && <p className={errorClasses}>{imagesError}</p>}

            {images.length > 0 && (
              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-300">Gallery</p>
                  <span className="rounded-full bg-brand-gold px-2 py-0.5 text-xs font-bold text-black">
                    {images.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((url, idx) => (
                    <div
                      key={`${url}-${idx}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-black"
                    >
                      <Image src={url} alt={`Preview ${idx + 1}`} fill sizes="160px" className="object-cover" />
                      {idx === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-bold text-black">
                          Main
                        </span>
                      )}
                      {!isSubmitting && !isUploading && (
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                          aria-label={`Remove image ${idx + 1}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">Status</h2>
              <p className="mt-1 text-sm text-brand-muted">Featured listings appear on the homepage.</p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
              <div>
                <p className="font-medium text-white">Feature on Homepage</p>
                <p className="mt-0.5 text-xs text-brand-muted">Highlight this vehicle as Featured.</p>
              </div>
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <label className={`relative inline-flex items-center ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                    <div className="h-7 w-14 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-gold peer-checked:after:translate-x-full" />
                  </label>
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="mt-6 flex w-full items-center justify-center rounded-full py-4 text-base font-bold text-black gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {mode === 'create' ? 'Publishing…' : 'Saving…'}
                </>
              ) : mode === 'create' ? (
                'Publish Vehicle'
              ) : (
                'Save Changes'
              )}
            </button>
          </section>
        </div>
      </form>
    </div>
  );
}
