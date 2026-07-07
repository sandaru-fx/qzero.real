'use server'

import connectToDatabase from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { IVehicle } from '@/types/vehicle';
import { revalidatePath } from 'next/cache';

function generateSlug(brand: string, model: string): string {
  const baseSlug = `${brand} ${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const uniqueSuffix = Date.now().toString(36);
  return `${baseSlug}-${uniqueSuffix}`;
}

export async function createVehicle(data: Omit<IVehicle, 'slug' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectToDatabase();
    
    const slug = generateSlug(data.brand, data.model);
    
    const newVehicle = await Vehicle.create({
      ...data,
      slug
    });

    revalidatePath('/');
    revalidatePath('/vehicles');

    return { 
      success: true, 
      vehicle: JSON.parse(JSON.stringify(newVehicle)) 
    };
  } catch (error: any) {
    console.error('Error creating vehicle:', error);
    return { success: false, error: error.message || 'Failed to create vehicle' };
  }
}

export async function updateVehicle(id: string, data: Partial<IVehicle>) {
  try {
    await connectToDatabase();
    
    const updateData: Partial<IVehicle> = { ...data };
    
    let existingVehicle = null;
    if (data.brand || data.model) {
      existingVehicle = await Vehicle.findById(id);
      if (!existingVehicle) {
        return { success: false, error: 'Vehicle not found' };
      }
      
      const newBrand = data.brand || existingVehicle.brand;
      const newModel = data.model || existingVehicle.model;
      
      updateData.slug = generateSlug(newBrand, newModel);
    }
    
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedVehicle) {
      return { success: false, error: 'Failed to update vehicle' };
    }

    revalidatePath('/');
    revalidatePath('/vehicles');
    if (updatedVehicle.slug) {
       revalidatePath(`/vehicles/${updatedVehicle.slug}`);
    }
    // Also invalidate the old slug if it was changed
    if (updateData.slug && existingVehicle && existingVehicle.slug !== updateData.slug) {
        revalidatePath(`/vehicles/${existingVehicle.slug}`);
    }

    return { success: true, vehicle: JSON.parse(JSON.stringify(updatedVehicle)) };
  } catch (error: any) {
    console.error('Error updating vehicle:', error);
    return { success: false, error: error.message || 'Failed to update vehicle' };
  }
}

export async function deleteVehicle(id: string) {
  try {
    await connectToDatabase();
    
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    
    if (!deletedVehicle) {
      return { success: false, error: 'Vehicle not found' };
    }

    revalidatePath('/');
    revalidatePath('/vehicles');
    if (deletedVehicle.slug) {
      revalidatePath(`/vehicles/${deletedVehicle.slug}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting vehicle:', error);
    return { success: false, error: error.message || 'Failed to delete vehicle' };
  }
}
