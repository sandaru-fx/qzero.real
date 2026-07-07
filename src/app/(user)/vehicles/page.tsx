import SearchBar from '@/components/SearchBar';
import VehicleCard from '@/components/VehicleCard';
import { getVehicles } from '@/actions/search';

export const revalidate = 60;

type VehiclesPageProps = {
  searchParams: Promise<{
    q?: string;
    fuel?: string;
    transmission?: string;
  }>;
};

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const params = await searchParams;
  const vehicles = await getVehicles({
    query: params.q,
    fuelType: params.fuel,
    transmission: params.transmission,
    limit: 48,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-brand-gold">QZERO showroom</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Premium vehicles</h1>
        <p className="mt-4 leading-7 text-brand-muted">
          Browse curated listings with fast server-side filtering and optimized vehicle media.
        </p>
      </div>

      <div className="mt-8">
        <SearchBar query={params.q} fuelType={params.fuel} transmission={params.transmission} />
      </div>

      {vehicles.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} priority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-brand-line bg-brand-card p-8 text-center">
          <p className="text-lg font-semibold text-white">No vehicles found.</p>
          <p className="mt-2 text-sm text-brand-muted">Try clearing filters or add showroom inventory from admin.</p>
        </div>
      )}
    </div>
  );
}
