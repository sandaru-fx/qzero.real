import Link from 'next/link';
import { Car, Plus, Sparkles, TrendingUp, MessageSquare } from 'lucide-react';
import { getVehicles } from '@/actions/search';
import { getInquiries } from '@/actions/inquiry';
import { protectAdminRoute } from '@/lib/auth';
import InventoryTable from '@/components/admin/InventoryTable';
import DashboardCharts from '@/components/admin/DashboardCharts';

export const revalidate = 0;

function getWeekAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d;
}

export default async function AdminDashboardPage() {
  await protectAdminRoute();

  const [vehicles, inquiries] = await Promise.all([
    getVehicles({ limit: 48 }),
    getInquiries()
  ]);
  
  const featuredCount = vehicles.filter((v) => v.isFeatured).length;
  const weekAgo = getWeekAgo();
  const addedThisWeek = vehicles.filter((v) => {
    if (!v.createdAt) return false;
    return new Date(v.createdAt) >= weekAgo;
  }).length;

  const newInquiries = inquiries.filter(i => i.status === 'New').length;

  const stats = [
    {
      label: 'Total Vehicles',
      value: vehicles.length,
      trend: `+${addedThisWeek} this week`,
      icon: Car,
      trendPositive: addedThisWeek > 0,
    },
    {
      label: 'Featured Listings',
      value: featuredCount,
      trend: featuredCount > 0 ? 'Homepage spotlight' : 'None featured',
      icon: Sparkles,
      trendPositive: featuredCount > 0,
    },
    {
      label: 'Available Stock',
      value: vehicles.length,
      trend: 'All listed as available',
      icon: TrendingUp,
      trendPositive: true,
    },
    {
      label: 'New Inquiries',
      value: newInquiries,
      trend: newInquiries > 0 ? 'Action required' : 'All caught up',
      icon: MessageSquare,
      trendPositive: newInquiries === 0, // Green if 0 (good), else default
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Overview</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-brand-muted">
            Monitor inventory performance and manage your premium showroom.
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/5 bg-[#111111] p-5 shadow-lg transition-colors hover:border-brand-gold/20"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-gold/20 bg-brand-gold/10">
                <stat.icon className="h-5 w-5 text-brand-gold" />
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  stat.trendPositive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-white/5 text-brand-muted'
                }`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="mt-5 text-sm font-medium text-brand-muted">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <section className="rounded-2xl border border-white/5 bg-[#111111] p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Inventory Growth</h2>
            <p className="mt-1 text-sm text-brand-muted">Vehicles added over the last 6 months.</p>
          </div>
          <DashboardCharts vehicles={vehicles} />
        </section>

        <section className="rounded-2xl border border-white/5 bg-[#111111] p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Inventory</h2>
              <p className="mt-1 text-sm text-brand-muted">Search, edit, or remove listings without leaving this page.</p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold-light"
            >
              View all →
            </Link>
          </div>
          <InventoryTable vehicles={vehicles} />
        </section>
      </div>
    </div>
  );
}
