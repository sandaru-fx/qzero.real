import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { protectAdminRoute } from '@/lib/auth';
import { getPromotions } from '@/actions/promotions';
import { getVehicles } from '@/actions/search';
import PromotionsManager from '@/components/admin/PromotionsManager';
import AdminPageHeader, { AdminPanel } from '@/components/admin/AdminPageHeader';

export const revalidate = 0;

export default async function AdminPromotionsPage() {
  await protectAdminRoute();
  const [promotions, vehicles] = await Promise.all([
    getPromotions(),
    getVehicles({ limit: 100 }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        eyebrow="Content"
        title="Promotions"
        description="Add inventory vehicles as promotions — edit offer copy, feature one deal, or remove anytime. Changes sync to the public Promotions page."
        actions={
          <Link
            href="/promotions"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-gold/40 px-5 py-3 text-base font-semibold text-brand-gold transition-colors hover:bg-brand-gold/5"
          >
            View live page
            <ExternalLink className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="admin-stat-card">
          <p className="relative z-10 text-base font-medium text-brand-muted">Total offers</p>
          <p className="relative z-10 mt-1 text-3xl font-bold text-white">{promotions.length}</p>
        </div>
        <div className="admin-stat-card">
          <p className="relative z-10 text-base font-medium text-brand-muted">Featured</p>
          <p className="relative z-10 mt-1 text-3xl font-bold text-brand-gold">
            {promotions.filter((p) => p.featured).length}
          </p>
        </div>
        <div className="admin-stat-card">
          <p className="relative z-10 text-base font-medium text-brand-muted">Public URL</p>
          <p className="relative z-10 mt-1 text-lg font-semibold text-brand-gold">/promotions</p>
        </div>
      </div>

      <AdminPanel>
        <PromotionsManager promotions={promotions} vehicles={vehicles} />
      </AdminPanel>
    </div>
  );
}
