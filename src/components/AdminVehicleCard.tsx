'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteVehicle } from '@/actions/vehicle';
import { Loader2, Trash2, Edit } from 'lucide-react';
import { VehicleView } from '@/types/vehicle';

export default function AdminVehicleCard({ vehicle }: { vehicle: VehicleView }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete ${vehicle.brand} ${vehicle.model}? This action cannot be undone.`)) {
      return;
    }
    
    setIsDeleting(true);
    setError('');
    
    const result = await deleteVehicle(vehicle._id);
    
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || 'Failed to delete vehicle');
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border border-white/5 bg-brand-card p-5 sm:flex-row sm:items-center transition-all hover:border-white/10">
      <div>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-white">{vehicle.brand} {vehicle.model}</p>
          {vehicle.isFeatured && (
             <span className="rounded-full bg-brand-gold/10 px-2 py-0.5 text-xs font-semibold text-brand-gold border border-brand-gold/20">Featured</span>
          )}
        </div>
        <p className="mt-1 text-sm text-brand-muted">{vehicle.slug}</p>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
      
      <div className="flex items-center gap-2">
        <Link 
          href={`/vehicles/${vehicle.slug}`} 
          target="_blank"
          className="rounded-full border border-white/5 bg-black px-4 py-2 text-center text-xs font-medium text-brand-muted transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
        >
          Preview
        </Link>
        <Link 
          href={`/admin/edit/${vehicle._id}`} 
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-black text-brand-muted transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
        >
          <Edit className="h-4 w-4" />
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-black text-brand-muted transition-colors hover:border-red-500/50 hover:text-red-500 disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
