import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { protectAdminRoute } from '@/lib/auth';
import { promotionOffers } from '@/data/promotions';
import AdminPageHeader, { AdminPanel } from '@/components/admin/AdminPageHeader';

export default async function AdminPromotionsPage() {
  await protectAdminRoute();
  const activeCount = promotionOffers.length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        eyebrow="Content"
        title="Promotions"
        description="Live offers on the public promotions page. Offer copy lives in code for now — site contact and brand settings are editable in Admin."
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
          <p className="relative z-10 mt-1 text-3xl font-bold text-white">{activeCount}</p>
        </div>
        <div className="admin-stat-card">
          <p className="relative z-10 text-base font-medium text-brand-muted">Featured</p>
          <p className="relative z-10 mt-1 text-3xl font-bold text-brand-gold">
            {promotionOffers.filter((p) => p.featured).length}
          </p>
        </div>
        <div className="admin-stat-card">
          <p className="relative z-10 text-base font-medium text-brand-muted">Public URL</p>
          <p className="relative z-10 mt-1 text-lg font-semibold text-brand-gold">/promotions</p>
        </div>
      </div>

      <AdminPanel>
        <h2 className="text-xl font-semibold text-white">Active promotions</h2>
        <p className="mt-1 text-base font-medium text-brand-muted">
          Synced with the customer-facing promotions experience.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {promotionOffers.map((promo) => (
            <article
              key={promo.id}
              className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0A0A] transition-all hover:border-brand-gold/30"
            >
              <div className="relative aspect-[16/9] bg-black">
                <Image src={promo.image} alt={promo.imageAlt} fill sizes="400px" className="object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-brand-gold/30 bg-brand-gold/5 px-2.5 py-0.5 text-sm font-bold uppercase tracking-wider text-brand-gold">
                    {promo.badge}
                  </span>
                  {promo.featured && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-sm font-semibold text-emerald-400">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-brand-gold">
                  {promo.brand}
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">{promo.title}</h3>
                <p className="mt-2 text-base text-brand-muted">Valid until {promo.validUntil}</p>
                <p className="mt-2 text-base font-semibold text-white">{promo.highlight}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-white/10 bg-[#0A0A0A] p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-white">Need to change an offer?</p>
            <p className="mt-1 text-base font-medium text-brand-muted">
              Promotions are still file-based. Inventory, inquiries, and site settings are fully
              editable in Admin.
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-5 py-2.5 text-base font-semibold text-brand-gold transition-colors hover:bg-brand-gold/5"
          >
            Open Settings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </AdminPanel>
    </div>
  );
}
