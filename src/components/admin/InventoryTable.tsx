'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Search, Eye, LayoutGrid } from 'lucide-react';
import { VehicleView } from '@/types/vehicle';
import { deleteVehicle } from '@/actions/vehicle';
import { formatPrice } from '@/utils/formatPrice';
import DeleteVehicleModal from './DeleteVehicleModal';

type InventoryTableProps = {
  vehicles: VehicleView[];
};

type Category = {
  id: string;
  label: string;
  bodyTypes: string[];
};

/** Same groupings as the public showroom search. */
const categories: Category[] = [
  { id: 'car', label: 'Cars', bodyTypes: ['Car', 'Sedan', 'Hatchback', 'Coupe', 'Convertible'] },
  { id: 'suv', label: 'SUV', bodyTypes: ['SUV'] },
  { id: 'pickup', label: 'Double Cab', bodyTypes: ['Pickup'] },
  { id: 'van', label: 'Van', bodyTypes: ['Van'] },
  { id: 'wagon', label: 'Wagon', bodyTypes: ['Wagon'] },
  { id: 'truck', label: 'Truck', bodyTypes: ['Truck'] },
];

function CategoryIcon({ id, active }: { id: string; active: boolean }) {
  const common = {
    viewBox: '0 0 64 32',
    className: `h-7 w-14 transition-all duration-300 ${
      active ? 'text-brand-gold-light' : 'text-brand-gold'
    }`,
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (id) {
    case 'suv':
      return (
        <svg {...common}>
          <path d="M8 22h48M12 22l4-10h28l6 10M18 12v-2h10M38 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-20 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    case 'pickup':
      return (
        <svg {...common}>
          <path d="M6 22h52M10 22l3-9h18v9M31 13h18l5 9M16 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm28 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    case 'van':
      return (
        <svg {...common}>
          <path d="M8 22h48M12 22V10h28l12 8v4M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm26 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    case 'wagon':
      return (
        <svg {...common}>
          <path d="M8 22h48M12 22l3-10h34l5 10M18 12h20M16 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm28 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...common}>
          <path d="M6 22h52M8 22V11h26v11M34 14h14l6 8v0M16 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M8 22h48M12 22l5-10h26l7 10M20 12h16M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm24 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
  }
}

function StatusBadge({ vehicle }: { vehicle: VehicleView }) {
  if (vehicle.isFeatured) {
    return (
      <span className="inline-flex items-center rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-0.5 text-sm font-semibold text-brand-gold">
        Featured
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-sm font-semibold text-emerald-400">
      Available
    </span>
  );
}

function matchesCategory(vehicle: VehicleView, categoryId: string) {
  if (categoryId === 'all') return true;
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return true;
  const body = (vehicle.bodyType || '').toLowerCase();
  return category.bodyTypes.some((t) => t.toLowerCase() === body);
}

export default function InventoryTable({ vehicles }: InventoryTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<{ id: string; name: string } | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: vehicles.length };
    for (const cat of categories) {
      counts[cat.id] = vehicles.filter((v) => matchesCategory(v, cat.id)).length;
    }
    return counts;
  }, [vehicles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (!matchesCategory(v, categoryId)) return false;
      if (!q) return true;
      const haystack =
        `${v.brand} ${v.model} ${v.year} ${v.grade} ${v.condition} ${v.bodyType}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [vehicles, query, categoryId]);

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

  const activeCategoryLabel =
    categoryId === 'all'
      ? 'All'
      : categories.find((c) => c.id === categoryId)?.label ?? 'All';

  return (
    <>
      <div className="mb-5 overflow-x-auto pb-1">
        <div className="flex min-w-max items-stretch gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setCategoryId('all')}
            className={`flex min-w-[5.5rem] flex-col items-center justify-center gap-1.5 rounded-xl border px-3 py-3 transition-all ${
              categoryId === 'all'
                ? 'border-brand-gold/50 bg-brand-gold/10 text-brand-gold'
                : 'border-white/10 bg-[#0A0A0A] text-brand-muted hover:border-brand-gold/30 hover:text-white'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.12em]">All</span>
            <span className="text-sm font-semibold tabular-nums text-white/80">
              {categoryCounts.all}
            </span>
          </button>

          {categories.map((category) => {
            const active = categoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setCategoryId(active ? 'all' : category.id)}
                className={`flex min-w-[5.5rem] flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 transition-all ${
                  active
                    ? 'border-brand-gold/50 bg-brand-gold/10'
                    : 'border-white/10 bg-[#0A0A0A] hover:border-brand-gold/30'
                }`}
              >
                <CategoryIcon id={category.id} active={active} />
                <span
                  className={`text-xs font-bold uppercase tracking-[0.12em] ${
                    active ? 'text-brand-gold' : 'text-brand-muted'
                  }`}
                >
                  {category.label}
                </span>
                <span className="text-sm font-semibold tabular-nums text-white/80">
                  {categoryCounts[category.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by make, model, year..."
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] py-3 pl-10 pr-4 text-base font-medium text-white outline-none transition-all placeholder:text-brand-muted focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/15"
          />
        </div>
        <p className="text-base font-medium text-brand-muted">
          Showing <span className="font-semibold text-white">{filtered.length}</span> of{' '}
          {vehicles.length}
          {categoryId !== 'all' ? (
            <span className="text-brand-gold"> · {activeCategoryLabel}</span>
          ) : null}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0A0A0A] px-6 py-16 text-center">
          <p className="type-muted">
            No vehicles match{categoryId !== 'all' ? ` in ${activeCategoryLabel}` : ''}
            {query.trim() ? ' your search' : ''}.
          </p>
          {(categoryId !== 'all' || query.trim()) && (
            <button
              type="button"
              onClick={() => {
                setCategoryId('all');
                setQuery('');
              }}
              className="mt-4 text-base font-semibold text-brand-gold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/5">
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full min-w-[720px] text-left text-base">
              <thead className="sticky top-0 z-10 border-b border-white/5 bg-[#111111]">
                <tr className="text-sm uppercase tracking-wide text-brand-muted">
                  <th className="px-5 py-3.5 font-semibold">Image</th>
                  <th className="px-5 py-3.5 font-semibold">Name</th>
                  <th className="px-5 py-3.5 font-semibold">Price</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
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
                          <div className="flex h-full w-full items-center justify-center text-xs text-brand-muted">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-lg font-semibold tracking-tight text-white">
                        {vehicle.brand} {vehicle.model}
                        {vehicle.grade ? ` ${vehicle.grade}` : ''}
                      </p>
                      <p className="mt-1 text-sm font-medium text-brand-muted">
                        {vehicle.year} · {vehicle.bodyType} · {vehicle.fuelType} ·{' '}
                        {vehicle.transmission}
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
