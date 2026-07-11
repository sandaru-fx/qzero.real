import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import type { Metadata } from 'next';
import VehicleCard from '@/components/VehicleCard';
import VehicleSearchSection from '@/components/VehicleSearchSection';
import Pagination from '@/components/Pagination';
import { getVehicles, getVehicleCount } from '@/actions/search';

export const revalidate = 60;

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: 'Showroom',
  description: 'Browse the QZERO International premium vehicle collection.',
};

type VehiclesPageProps = {
  searchParams: Promise<{
    make?: string;
    model?: string;
    year?: string;
    condition?: string;
    price?: string;
    bodyType?: string;
    q?: string;
    page?: string;
  }>;
};

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(Number(params.page) || 1, 1);

  const searchOptions = {
    make: params.make,
    model: params.model,
    year: params.year,
    condition: params.condition,
    price: params.price,
    bodyType: params.bodyType,
    query: params.q,
  };

  const [vehicles, totalCount] = await Promise.all([
    getVehicles({ ...searchOptions, limit: PAGE_SIZE, page: currentPage }),
    getVehicleCount(searchOptions),
  ]);

  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);

  const hasActiveFilters = !!(
    params.make ||
    params.model ||
    params.year ||
    params.condition ||
    params.price ||
    params.bodyType ||
    params.q
  );

  const activeFilterLabels = [
    params.make,
    params.model,
    params.year,
    params.condition,
    params.price,
    params.bodyType,
    params.q,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="border-b border-white/5 bg-brand-black">
        <div className="mx-auto w-full px-2 pb-6 pt-8 sm:px-3 lg:px-4">
          <p className="type-eyebrow text-brand-gold">QZERO International</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="type-display-lg text-white">
                The QZERO Collection
              </h1>
              <p className="type-muted mt-4">
                {totalCount > 0 ? (
                  <>
                    Showing <span className="font-semibold text-white">{totalCount}</span> Exceptional{' '}
                    {totalCount === 1 ? 'Vehicle' : 'Vehicles'}
                    {hasActiveFilters ? ' matching your search' : ''}
                  </>
                ) : (
                  'No vehicles match your current filters'
                )}
              </p>
            </div>

            {hasActiveFilters && activeFilterLabels.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilterLabels.map((label) => (
                  <span
                    key={label}
                    className="type-meta rounded-full border border-brand-gold/30 bg-brand-gold/5 px-3 py-1 font-medium text-brand-gold"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-white/5 bg-brand-black/80 py-3 backdrop-blur-md">
        <div className="mx-auto w-full px-2 sm:px-3 lg:px-4">
          <VehicleSearchSection showTextSearch fullWidth />
        </div>
      </div>

      <div className="mx-auto w-full px-2 py-6 sm:px-3 lg:px-4">
        {vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4">
              {vehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} priority={index < 2} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseParams={{
                make: params.make,
                model: params.model,
                year: params.year,
                condition: params.condition,
                price: params.price,
                bodyType: params.bodyType,
                q: params.q,
              }}
            />
          </>
        ) : (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-card">
              <SlidersHorizontal className="h-8 w-8 text-brand-gold/60" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">No Vehicles Found</h2>
            <p className="type-muted mt-3 max-w-md">
              No vehicles in our collection match your current search criteria. Try adjusting your
              filters or browse the full inventory.
            </p>
            <Link
              href="/vehicles"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-8 py-3 text-base font-semibold text-brand-gold transition-all duration-300 hover:border-brand-gold hover:bg-brand-gold/5"
            >
              Reset Filters — View All
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
