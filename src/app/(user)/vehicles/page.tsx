import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import VehicleCard from '@/components/VehicleCard';
import VehicleSearch from '@/components/VehicleSearch';
import { getVehicles } from '@/actions/search';

export const revalidate = 0;

type VehiclesPageProps = {
  searchParams: Promise<{
    make?: string;
    model?: string;
    year?: string;
    condition?: string;
    price?: string;
    q?: string;
  }>;
};

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const params = await searchParams;

  const vehicles = await getVehicles({
    make: params.make,
    model: params.model,
    year: params.year,
    price: params.price,
    query: params.q,
    limit: 48,
  });

  const hasActiveFilters = !!(params.make || params.model || params.year || params.condition || params.price || params.q);

  const activeFilterLabels = [
    params.make,
    params.model,
    params.year,
    params.condition,
    params.price,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-brand-black">

      {/* ── Page Header ── */}
      <div className="border-b border-white/5 bg-brand-black">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">QZERO International</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                The QZERO Collection
              </h1>
              <p className="mt-3 text-brand-muted">
                {vehicles.length > 0
                  ? <>Showing <span className="font-semibold text-white">{vehicles.length}</span> Exceptional {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}{hasActiveFilters ? ' matching your search' : ''}</>
                  : 'No vehicles match your current filters'}
              </p>
            </div>

            {/* Active filter pills */}
            {hasActiveFilters && activeFilterLabels.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilterLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-brand-gold/30 bg-brand-gold/5 px-3 py-1 text-xs font-medium text-brand-gold"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky Search Bar ── */}
      <div className="border-b border-white/5 bg-brand-black/80 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VehicleSearch />
        </div>
      </div>

      {/* ── Vehicle Grid or Empty State ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-card">
              <SlidersHorizontal className="h-8 w-8 text-brand-gold/60" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">No Vehicles Found</h2>
            <p className="mt-3 max-w-md text-brand-muted">
              No vehicles in our collection match your current search criteria. Try adjusting your filters or browse the full inventory.
            </p>
            <Link
              href="/vehicles"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-8 py-3 text-sm font-semibold text-brand-gold transition-all duration-300 hover:border-brand-gold hover:bg-brand-gold/5"
            >
              Reset Filters — View All
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
