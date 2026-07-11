import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getVehicles } from '@/actions/search';
import { protectAdminRoute } from '@/lib/auth';
import InventoryTable from '@/components/admin/InventoryTable';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  await protectAdminRoute();
  const vehicles = await getVehicles({ limit: 48 });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Showroom</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Inventory</h1>
          <p className="mt-2 text-brand-muted">
            Full vehicle catalogue — search, edit, preview, and delete.
          </p>
        </div>
        <Link
          href="/admin/vehicles/new"
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-black gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Link>
      </div>

      <section className="rounded-2xl border border-white/5 bg-[#111111] p-5 sm:p-6">
        <InventoryTable vehicles={vehicles} />
      </section>
    </div>
  );
}
