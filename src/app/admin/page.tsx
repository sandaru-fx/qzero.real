import Link from 'next/link';
import { Car, Plus, Sparkles, TrendingUp, MessageSquare, ArrowUpRight } from 'lucide-react';
import { getVehicles } from '@/actions/search';
import { getInquiries } from '@/actions/inquiry';
import { protectAdminRoute } from '@/lib/auth';
import InventoryTable from '@/components/admin/InventoryTable';
import DashboardCharts from '@/components/admin/DashboardCharts';
import AdminPageHeader, {
  AdminPanel,
  AdminPrimaryButton,
} from '@/components/admin/AdminPageHeader';

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
    getInquiries(),
  ]);

  const featuredCount = vehicles.filter((v) => v.isFeatured).length;
  const weekAgo = getWeekAgo();
  const addedThisWeek = vehicles.filter((v) => {
    if (!v.createdAt) return false;
    return new Date(v.createdAt) >= weekAgo;
  }).length;

  const newInquiries = inquiries.filter((i) => i.status === 'New').length;

  const stats = [
    {
      label: 'Total Vehicles',
      value: vehicles.length,
      trend: `+${addedThisWeek} this week`,
      icon: Car,
      href: '/admin/inventory',
      trendPositive: addedThisWeek > 0,
    },
    {
      label: 'Featured Listings',
      value: featuredCount,
      trend: featuredCount > 0 ? 'Homepage spotlight' : 'None featured',
      icon: Sparkles,
      href: '/admin/inventory',
      trendPositive: featuredCount > 0,
    },
    {
      label: 'Available Stock',
      value: vehicles.length,
      trend: 'Live on showroom',
      icon: TrendingUp,
      href: '/vehicles',
      trendPositive: true,
      external: true,
    },
    {
      label: 'New Inquiries',
      value: newInquiries,
      trend: newInquiries > 0 ? 'Needs attention' : 'All caught up',
      icon: MessageSquare,
      href: '/admin/inquiries',
      trendPositive: newInquiries === 0,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Monitor inventory, track leads, and keep the showroom running smoothly."
        actions={
          <AdminPrimaryButton href="/admin/vehicles/new">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </AdminPrimaryButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const CardInner = (
            <>
              <div className="relative z-10 flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-gold/25 bg-brand-gold/10">
                  <stat.icon className="h-5 w-5 text-brand-gold" />
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-sm font-bold ${
                    stat.trendPositive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-amber-500/10 text-amber-300'
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="relative z-10 mt-5 text-sm font-bold uppercase tracking-[0.16em] text-brand-muted sm:text-base">
                {stat.label}
              </p>
              <div className="relative z-10 mt-1.5 flex items-end justify-between gap-2">
                <p className="text-4xl font-extrabold tracking-tight text-white">{stat.value}</p>
                <ArrowUpRight className="mb-1 h-4 w-4 text-brand-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </>
          );

          if (stat.external) {
            return (
              <a
                key={stat.label}
                href={stat.href}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-stat-card group block"
              >
                {CardInner}
              </a>
            );
          }

          return (
            <Link key={stat.label} href={stat.href} className="admin-stat-card group block">
              {CardInner}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <AdminPanel>
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Inventory Growth
            </h2>
            <p className="mt-1 text-base font-medium text-brand-muted">
              Vehicles added over the last 6 months.
            </p>
          </div>
          <DashboardCharts vehicles={vehicles} />
        </AdminPanel>

        <AdminPanel>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Recent Inventory
              </h2>
              <p className="mt-1 text-base font-medium text-brand-muted">
                Search, edit, or remove listings quickly.
              </p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-base font-semibold text-brand-gold transition-colors hover:text-brand-gold-light"
            >
              View all →
            </Link>
          </div>
          <InventoryTable vehicles={vehicles} />
        </AdminPanel>
      </div>
    </div>
  );
}
