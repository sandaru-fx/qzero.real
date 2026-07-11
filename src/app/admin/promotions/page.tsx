import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { protectAdminRoute } from '@/lib/auth';
import { promotionOffers } from '@/data/promotions';

export default async function AdminPromotionsPage() {
  await protectAdminRoute();
  const activeCount = promotionOffers.length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="type-eyebrow text-brand-gold">Content</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Promotions</h1>
          <p className="type-muted mt-2">
            Live offers currently shown on the public promotions page.
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-[#111111] p-5">
          <p className="text-sm text-brand-muted">Total offers</p>
          <p className="mt-1 text-3xl font-bold text-white">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#111111] p-5">
          <p className="text-sm text-brand-muted">Featured</p>
          <p className="mt-1 text-3xl font-bold text-brand-gold">
            {promotionOffers.filter((p) => p.featured).length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#111111] p-5">
          <p className="text-sm text-brand-muted">Public URL</p>
          <p className="mt-1 text-lg font-semibold text-brand-gold">/promotions</p>
        </div>
      </div>

      <section className="rounded-2xl border border-white/5 bg-[#111111] p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-white">Active promotions</h2>
        <p className="mt-1 text-sm text-brand-muted">Synced with the customer-facing promotions experience.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {promotionOffers.map((promo) => (
            <article
              key={promo.id}
              className="overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0A] transition-all hover:border-brand-gold/30"
            >
              <div className="relative aspect-[16/9] bg-black">
                <Image src={promo.image} alt={promo.imageAlt} fill sizes="400px" className="object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-brand-gold/30 bg-brand-gold/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-gold">
                    {promo.badge}
                  </span>
                  {promo.featured && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-brand-gold">{promo.brand}</p>
                <h3 className="mt-1 text-lg font-bold text-white">{promo.title}</h3>
                <p className="mt-2 text-sm text-brand-muted">Valid until {promo.validUntil}</p>
                <p className="mt-2 text-sm font-semibold text-white">{promo.highlight}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-white/10 bg-[#0A0A0A] p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-white">Preview the customer experience</p>
            <p className="mt-1 text-sm text-brand-muted">Open the live page to see the full cinematic promotions layout.</p>
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
