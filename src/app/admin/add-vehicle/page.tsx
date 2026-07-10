'use client';

import Image from 'next/image';
import { useState, ChangeEvent, FormEvent } from 'react';
import { uploadVehicleImage } from '@/actions/upload';
import { createVehicle } from '@/actions/vehicle';
import { UploadCloud, X, Loader2, CheckCircle2 } from 'lucide-react';
import { VehicleFormInput } from '@/types/vehicle';

type VehicleFormState = {
  brand: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  fuelType: VehicleFormInput['fuelType'];
  transmission: VehicleFormInput['transmission'];
  condition: VehicleFormInput['condition'];
  engineCapacity: string;
  description: string;
  isFeatured: boolean;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred';
}

export default function AddVehiclePage() {
  const [formData, setFormData] = useState<VehicleFormState>({
    brand: '',
    model: '',
    year: String(new Date().getFullYear()),
    price: '',
    mileage: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Reconditioned',
    engineCapacity: '',
    description: '',
    isFeatured: false,
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    setError('');

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
          setError(res.error || 'Failed to upload one or more images');
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      }
    }

    if (newImageUrls.length > 0) {
      setImages(prev => [...prev, ...newImageUrls]);
    }

    setIsUploading(false);
    // Reset file input
    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    if (images.length === 0) {
      setError('Please upload at least one vehicle image.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: VehicleFormInput = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        condition: formData.condition,
        engineCapacity: formData.engineCapacity.trim(),
        description: formData.description.trim(),
        isFeatured: formData.isFeatured,
        images,
      };

      const res = await createVehicle(payload);
      
      if (res.success) {
        setSuccess(true);
        // Clear form
        setFormData({
          brand: '',
          model: '',
          year: String(new Date().getFullYear()),
          price: '',
          mileage: '',
          fuelType: 'Petrol',
          transmission: 'Automatic',
          condition: 'Reconditioned',
          engineCapacity: '',
          description: '',
          isFeatured: false,
        });
        setImages([]);
        // Hide success after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(res.error || 'Failed to publish vehicle.');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-brand-black text-white border border-gray-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl p-3 outline-none transition-all";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-2";

  return (
    <div className="min-h-screen bg-brand-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white tracking-tight">Add New Vehicle</h1>
          <p className="text-brand-gold mt-2">QZERO International Premium Showroom</p>
        </div>

        {success && (
          <div className="mb-8 p-4 bg-brand-card border border-brand-gold rounded-2xl flex items-center space-x-3 text-brand-gold animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-6 h-6" />
            <p className="font-medium">Vehicle successfully published to the showroom!</p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-950/50 border border-red-500/50 rounded-2xl flex items-center space-x-3 text-red-200">
            <X className="w-6 h-6 text-red-500" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-brand-card p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8 border border-gray-800">
          
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Brand</label>
              <input type="text" name="brand" required value={formData.brand} onChange={handleChange} className={inputClasses} placeholder="e.g. Tesla" />
            </div>
            <div>
              <label className={labelClasses}>Model</label>
              <input type="text" name="model" required value={formData.model} onChange={handleChange} className={inputClasses} placeholder="e.g. Model S Plaid" />
            </div>
            <div>
              <label className={labelClasses}>Year</label>
              <input type="number" name="year" required min="1900" max="2100" value={formData.year} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Price (LKR)</label>
              <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className={inputClasses} placeholder="e.g. 35000000" />
            </div>
          </div>

          {/* Specs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div>
              <label className={labelClasses}>Mileage (km)</label>
              <input type="number" name="mileage" required min="0" value={formData.mileage} onChange={handleChange} className={inputClasses} placeholder="e.g. 15000" />
            </div>
            <div>
              <label className={labelClasses}>Fuel Type</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClasses}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className={inputClasses}>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange} className={inputClasses}>
                <option value="Brand New">Brand New</option>
                <option value="Reconditioned">Reconditioned</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Engine Capacity / Power</label>
            <input type="text" name="engineCapacity" required value={formData.engineCapacity} onChange={handleChange} className={inputClasses} placeholder="e.g. 2000cc or Dual Motor" />
          </div>

          <div>
            <label className={labelClasses}>Premium Description</label>
            <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className={inputClasses} placeholder="Describe the luxury features..."></textarea>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className={labelClasses}>Vehicle Images (Cloudinary)</label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-2xl hover:border-brand-gold transition-colors relative bg-brand-black group cursor-pointer">
              <div className="space-y-2 text-center">
                {isUploading ? (
                  <Loader2 className="mx-auto h-10 w-10 text-brand-gold animate-spin" />
                ) : (
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-brand-gold transition-colors" />
                )}
                <div className="flex text-sm text-gray-400 justify-center mt-2">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-brand-gold hover:text-brand-gold-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-gold focus-within:ring-offset-brand-black">
                    <span>{isUploading ? 'Uploading to Cloudinary...' : 'Upload images'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-300">Uploaded Images</h4>
                  <span className="ml-3 bg-brand-gold text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {images.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden bg-brand-black aspect-[4/3] border border-gray-800">
                      <Image
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-cover"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-5 bg-brand-black rounded-2xl border border-gray-800">
            <div>
              <h4 className="text-white font-medium">Feature on Homepage</h4>
              <p className="text-sm text-gray-400 mt-1">Display this vehicle prominently on the hero section.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-gold"></div>
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
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Publishing Vehicle...
                </>
              ) : (
                'Publish Vehicle'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
