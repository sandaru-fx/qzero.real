import Link from 'next/link';
import { ArrowRight, ExternalLink, Gift, Percent, Ship, Sparkles } from 'lucide-react';
import { protectAdminRoute } from '@/lib/auth';

const promotions = [
  {
    icon: Percent,
    badge: 'Limited Time',
    title: 'Import Service Fee Waiver',
    description:
      'Waived concierge fees on all Japan-sourced vehicle imports booked before the end of this quarter.',
    status: 'Active',
  },
  {
    icon: Sparkles,
    badge: 'Showroom',
    title: 'Featured Vehicle Spotlight',
    description:
      'Hand-picked premium listings with complimentary extended warranty documentation.',
    status: 'Active',
  },
  {
    icon: Ship,
    badge: 'Shipping',
    title: 'Insured Ocean Freight Package',
    description:
      'Containerized shipping with complimentary cargo insurance for the first 30 days of transit.',
    status: 'Active',
  },
  {
    icon: Gift,
    badge: 'New Arrivals',
    title: 'Early Access to New Stock',
    description:
      'First access to newly arrived reconditioned and brand-new vehicles before public listing.',
    status: 'Active',
  },
];

export default async function AdminPromotionsPage() {
  await protectAdminRoute();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Content</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Promotions</h1>
          <p className="mt-2 text-brand-muted">
            Current offers live on the public promotions page.
          </p>
        </div>
        <Link
          href="/promotions"
          target="_blank"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-gold/40 px-5 py-3 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/5"
        >
          View live page
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-[#111111] p-5">
          <p className="text-sm text-brand-muted">Total offers</p>
          <p className="mt-1 text-3xl font-bold text-white">{promotions.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#111111] p-5">
          <p className="text-sm text-brand-muted">Active</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">
            {promotions.filter((p) => p.status === 'Active').length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#111111] p-5 sm:col-span-2">
          <p className="text-sm text-brand-muted">Public URL</p>
          <p className="mt-1 truncate text-lg font-semibold text-brand-gold">/promotions</p>
        </div>
      </div>

      <section className="rounded-2xl border border-white/5 bg-[#111111] p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Active promotions</h2>
            <p className="mt-1 text-sm text-brand-muted">These cards match what visitors see on the website.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {promotions.map((promo) => (
            <article
              key={promo.title}
              className="group rounded-xl border border-white/5 bg-[#0A0A0A] p-6 transition-all hover:border-brand-gold/30"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 bg-black">
                  <promo.icon className="h-5 w-5 text-brand-gold" />
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-brand-gold/30 bg-brand-gold/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-gold">
                    {promo.badge}
                  </span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                    {promo.status}
                  </span>
                </div>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{promo.title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-muted">{promo.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-white/10 bg-[#0A0A0A] p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-white">Need to update an offer?</p>
            <p className="mt-1 text-sm text-brand-muted">
              Open the live promotions page to review how customers see these deals.
            </p>
          </div>
          <Link
            href="/promotions"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full gold-gradient px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Open promotions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
