import Link from 'next/link';
import { getVehicles } from '@/actions/search';

export const revalidate = 60;

export default async function AdminEditPage() {
  const vehicles = await getVehicles({ limit: 48 });

  return (
    <main className="min-h-screen bg-brand-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-brand-gold">Inventory</p>
        <h1 className="mt-3 text-4xl font-semibold">Edit vehicles</h1>
        <div className="mt-8 grid gap-3">
          {vehicles.length > 0 ? vehicles.map((vehicle) => (
            <div key={vehicle._id} className="flex flex-col justify-between gap-4 rounded-lg border border-brand-line bg-brand-card p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold">{vehicle.brand} {vehicle.model}</p>
                <p className="mt-1 text-sm text-brand-muted">{vehicle.slug}</p>
              </div>
              <Link href={`/vehicles/${vehicle.slug}`} className="rounded-full border border-brand-line px-4 py-2 text-center text-sm text-brand-muted hover:border-brand-gold/50 hover:text-brand-gold">
                Preview
              </Link>
            </div>
          )) : (
            <p className="rounded-lg border border-brand-line bg-brand-card p-6 text-brand-muted">Add a vehicle first to manage inventory.</p>
          )}
        </div>
      </div>
    </main>
  );
}
