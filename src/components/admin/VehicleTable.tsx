'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2 } from 'lucide-react';
import { VehicleView } from '@/types/vehicle';
import { deleteVehicle } from '@/actions/vehicle';
import DeleteVehicleModal from './DeleteVehicleModal';

interface VehicleTableProps {
  vehicles: VehicleView[];
}

export default function VehicleTable({ vehicles }: VehicleTableProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedVehicle({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) return;
    
    const res = await deleteVehicle(selectedVehicle.id);
    if (res.success) {
      router.refresh();
      setDeleteModalOpen(false);
      setSelectedVehicle(null);
    } else {
      // Basic error handling for now if delete fails
      alert(res.error || 'Failed to delete vehicle');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="rounded-xl border border-[#242424] bg-[#121212] p-8 text-center">
        <p className="text-gray-400">No inventory found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile/Tablet Card Layout */}
      <div className="grid gap-4 lg:hidden">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="flex flex-col gap-4 rounded-xl border border-[#242424] bg-[#121212] p-4">
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#050505] border border-white/5">
                {vehicle.images?.[0] ? (
                  <Image
                    src={vehicle.images[0]}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">No Img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{vehicle.brand} {vehicle.model}</h3>
                <p className="text-sm text-gray-400">{vehicle.year} • {vehicle.fuelType}</p>
                <p className="mt-1 font-medium text-brand-gold">{formatPrice(vehicle.price)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#242424] pt-4">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                vehicle.isFeatured 
                  ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20' 
                  : 'bg-white/5 text-gray-300 border border-white/10'
              }`}>
                {vehicle.isFeatured ? 'Featured' : 'Listed'}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/edit/${vehicle._id}`}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                  aria-label={`Edit ${vehicle.model}`}
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(vehicle._id, `${vehicle.brand} ${vehicle.model}`)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  aria-label={`Delete ${vehicle.model}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#242424] bg-[#121212]">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="border-b border-[#242424] bg-white/[0.02] text-xs uppercase text-gray-500">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">Vehicle</th>
              <th scope="col" className="px-6 py-4 font-medium">Year</th>
              <th scope="col" className="px-6 py-4 font-medium">Price</th>
              <th scope="col" className="px-6 py-4 font-medium">Status</th>
              <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242424]">
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-[#050505] border border-white/5">
                      {vehicle.images?.[0] ? (
                        <Image
                          src={vehicle.images[0]}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-500">No Img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-xs text-gray-500">{vehicle.fuelType} • {vehicle.transmission}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.year}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-300">
                  {formatPrice(vehicle.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    vehicle.isFeatured 
                      ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20' 
                      : 'bg-white/5 text-gray-300 border border-white/10'
                  }`}>
                    {vehicle.isFeatured ? 'Featured' : 'Listed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/edit/${vehicle._id}`}
                      className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(vehicle._id, `${vehicle.brand} ${vehicle.model}`)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteVehicleModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedVehicle(null);
        }}
        onConfirm={handleConfirmDelete}
        vehicleName={selectedVehicle?.name || ''}
      />
    </>
  );
}
