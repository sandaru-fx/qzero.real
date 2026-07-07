import Link from 'next/link';
import { Car, Plus, Settings } from 'lucide-react';
import { getVehicles } from '@/actions/search';

export const revalidate = 60;

export default async function AdminDashboardPage() {
  const vehicles = await getVehicles({ limit: 8 });
  const featuredCount = vehicles.filter((vehicle) => vehicle.isFeatured).length;

  return (
    <main className="min-h-screen bg-brand-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-brand-line pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-brand-gold">QZERO admin</p>
            <h1 className="mt-3 text-4xl font-semibold">Dashboard</h1>
            <p className="mt-3 text-brand-muted">Manage premium showroom inventory and featured listings.</p>
          </div>
          <Link href="/admin/add-vehicle" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black gold-gradient">
            <Plus className="h-4 w-4" />
            Add vehicle
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric icon={Car} label="Loaded vehicles" value={String(vehicles.length)} />
          <Metric icon={Settings} label="Featured" value={String(featuredCount)} />
          <Metric icon={Plus} label="Fast actions" value="Server" />
        </div>

        <section className="mt-8 rounded-lg border border-brand-line bg-brand-card p-6">
          <h2 className="text-xl font-semibold">Recent inventory</h2>
          <div className="mt-5 grid gap-3">
            {vehicles.length > 0 ? vehicles.map((vehicle) => (
              <div key={vehicle._id} className="flex items-center justify-between gap-4 rounded-lg border border-brand-line bg-black p-4">
                <div>
                  <p className="font-semibold">{vehicle.brand} {vehicle.model}</p>
                  <p className="mt-1 text-sm text-brand-muted">{vehicle.year} · {vehicle.fuelType} · {vehicle.transmission}</p>
                </div>
                <Link href={`/vehicles/${vehicle.slug}`} className="rounded-full border border-brand-line px-4 py-2 text-sm text-brand-muted hover:border-brand-gold/50 hover:text-brand-gold">
                  View
                </Link>
              </div>
            )) : (
              <p className="rounded-lg border border-brand-line bg-black p-4 text-sm text-brand-muted">No inventory loaded yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Car; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-brand-line bg-brand-card p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/40 bg-black">
        <Icon className="h-5 w-5 text-brand-gold" />
      </span>
      <p className="mt-5 text-sm text-brand-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
