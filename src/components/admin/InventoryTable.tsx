'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Search, Eye } from 'lucide-react';
import { VehicleView } from '@/types/vehicle';
import { deleteVehicle } from '@/actions/vehicle';
import { formatPrice } from '@/utils/formatPrice';
import DeleteVehicleModal from './DeleteVehicleModal';

type InventoryTableProps = {
  vehicles: VehicleView[];
};

function StatusBadge({ vehicle }: { vehicle: VehicleView }) {
  if (vehicle.isFeatured) {
    return (
      <span className="type-meta inline-flex items-center rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-0.5 font-semibold text-brand-gold">
        Featured
      </span>
    );
  }

  return (
    <span className="type-meta inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-400">
      Available
    </span>
  );
}

export default function InventoryTable({ vehicles }: InventoryTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<{ id: string; name: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) => {
      const haystack = `${v.brand} ${v.model} ${v.year} ${v.grade} ${v.condition}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [vehicles, query]);

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedVehicle({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) return;
    const res = await deleteVehicle(selectedVehicle.id);
    if (res.success) {
      setDeleteModalOpen(false);
      setSelectedVehicle(null);
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete vehicle');
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by make, model, year..."
            className="type-meta w-full rounded-xl border border-white/10 bg-[#0A0A0A] py-2.5 pl-10 pr-4 text-white outline-none transition-colors placeholder:text-brand-muted focus:border-brand-gold/40"
          />
        </div>
        <p className="type-meta text-brand-muted">
          Showing <span className="font-semibold text-white">{filtered.length}</span> of {vehicles.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0A0A0A] px-6 py-16 text-center">
          <p className="text-brand-muted">No vehicles match your search.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/5">
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-white/5 bg-[#111111]">
                <tr className="type-meta uppercase text-brand-muted">
                  <th className="px-5 py-3.5 font-medium">Image</th>
                  <th className="px-5 py-3.5 font-medium">Name</th>
                  <th className="px-5 py-3.5 font-medium">Price</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#0A0A0A]">
                {filtered.map((vehicle) => (
                  <tr key={vehicle._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5">
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-white/5 bg-black">
                        {vehicle.images?.[0] ? (
                          <Image
                            src={vehicle.images[0]}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-brand-muted">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-base font-semibold tracking-tight text-white">
                        {vehicle.brand} {vehicle.model}
                        {vehicle.grade ? ` ${vehicle.grade}` : ''}
                      </p>
                      <p className="type-meta mt-1 text-brand-muted">
                        {vehicle.year} · {vehicle.fuelType} · {vehicle.transmission}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-gray-200">
                      {formatPrice(vehicle.price)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge vehicle={vehicle} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/vehicles/${vehicle.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-brand-muted transition-colors hover:bg-white/5 hover:text-white"
                          title="Preview"
                          aria-label={`Preview ${vehicle.model}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/vehicles/${vehicle._id}`}
                          className="rounded-lg p-2 text-brand-muted transition-colors hover:bg-white/5 hover:text-brand-gold"
                          title="Edit"
                          aria-label={`Edit ${vehicle.model}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteClick(vehicle._id, `${vehicle.brand} ${vehicle.model}`)
                          }
                          className="rounded-lg p-2 text-brand-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Delete"
                          aria-label={`Delete ${vehicle.model}`}
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
        </div>
      )}

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
