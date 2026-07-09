import { getVehicles } from '@/actions/search';
import { protectAdminRoute } from '@/lib/auth';
import AdminVehicleCard from '@/components/AdminVehicleCard';

export const revalidate = 0;

export default async function AdminEditPage() {
  await protectAdminRoute();

  const vehicles = await getVehicles({ limit: 100 });

  return (
    <main className="min-h-screen bg-brand-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Inventory</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Manage vehicles</h1>
        <div className="mt-8 grid gap-3">
          {vehicles.length > 0 ? vehicles.map((vehicle) => (
            <AdminVehicleCard key={vehicle._id} vehicle={vehicle} />
          )) : (
            <p className="rounded-lg border border-white/5 bg-brand-card p-6 text-brand-muted">Add a vehicle first to manage inventory.</p>
          )}
        </div>
      </div>
    </main>
  );
}
