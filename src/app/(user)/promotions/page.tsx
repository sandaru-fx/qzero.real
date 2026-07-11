import Link from 'next/link';
import { ArrowRight, Gift, Percent, Ship, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { getSiteConfig } from '@/actions/settings';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: 'Promotions',
    description: `Exclusive offers on premium vehicles and import services from ${siteConfig.name}.`,
  };
}

const promotions = [
  {
    icon: Percent,
    badge: 'Limited Time',
    title: 'Import Service Fee Waiver',
    description:
      'Waived concierge fees on all Japan-sourced vehicle imports booked before the end of this quarter. Full inspection and shipping support included.',
    cta: 'Start Import Inquiry',
    href: '/import',
  },
  {
    icon: Sparkles,
    badge: 'Showroom',
    title: 'Featured Vehicle Spotlight',
    description:
      'Hand-picked premium listings with complimentary extended warranty documentation and priority delivery scheduling for local buyers.',
    cta: 'Browse Featured',
    href: '/vehicles',
  },
  {
    icon: Ship,
    badge: 'Shipping',
    title: 'Insured Ocean Freight Package',
    description:
      'Book containerized shipping through our premium freight partners and receive complimentary cargo insurance for the first 30 days of transit.',
    cta: 'Learn More',
    href: '/import',
  },
  {
    icon: Gift,
    badge: 'New Arrivals',
    title: 'Early Access to New Stock',
    description:
      'Subscribe to our showroom updates and get first access to newly arrived reconditioned and brand-new vehicles before public listing.',
    cta: 'Contact Us',
    href: '/contact',
  },
];

export default async function PromotionsPage() {
  const siteConfig = await getSiteConfig();
  return (
    <div className="min-h-screen bg-brand-black">
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">
            {siteConfig.name}
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Exclusive Promotions
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
            Premium offers on import services, featured showroom vehicles, and concierge support —
            curated for serious buyers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {promotions.map((promo) => (
            <article
              key={promo.title}
              className="group flex flex-col rounded-xl border border-white/5 bg-brand-card p-8 transition-all duration-300 hover:border-brand-gold/30 hover:shadow-lg hover:shadow-brand-gold/5"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/30 bg-black">
                  <promo.icon className="h-5 w-5 text-brand-gold" />
                </span>
                <span className="rounded-full border border-brand-gold/30 bg-brand-gold/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
                  {promo.badge}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-white">{promo.title}</h2>
              <p className="mt-3 flex-1 leading-7 text-brand-muted">{promo.description}</p>
              <Link
                href={promo.href}
                className="group/link mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition-colors hover:text-white"
              >
                {promo.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 bg-brand-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
            Need a custom offer?
          </p>
          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Speak with our concierge team
          </h2>
          <p className="mt-4 max-w-xl text-brand-muted">
            Tell us what you are looking for and we will tailor an import or showroom package for you.
          </p>
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-2.5 rounded-full gold-gradient px-8 py-4 text-sm font-bold text-black shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-gold/40"
          >
            Get in Touch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
