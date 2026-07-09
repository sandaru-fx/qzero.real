import Link from 'next/link';
import { Car, Plus, Settings } from 'lucide-react';
import { getVehicles } from '@/actions/search';
import { protectAdminRoute } from '@/lib/auth';
import VehicleTable from '@/components/admin/VehicleTable';

export const revalidate = 60;

export default async function AdminDashboardPage() {
  await protectAdminRoute();

  const vehicles = await getVehicles({ limit: 50 });
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

        <section className="mt-8 rounded-xl border border-brand-line bg-brand-card p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent inventory</h2>
            <span className="text-sm text-brand-muted">{vehicles.length} vehicles</span>
          </div>
          <VehicleTable vehicles={vehicles} />
        </section>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Car; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#242424] bg-[#121212] p-6 shadow-md">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/20 bg-[#050505]">
        <Icon className="h-5 w-5 text-brand-gold" />
      </span>
      <p className="mt-5 text-sm font-medium text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}
