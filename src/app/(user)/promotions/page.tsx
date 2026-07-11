import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowDown, ArrowRight, BadgeCheck, Shield, Sparkles, Timer } from 'lucide-react';
import { getSiteConfig } from '@/actions/settings';
import { promotionOffers } from '@/data/promotions';
import { PromoCard, PromoFeatured } from '@/components/promotions/PromoCards';
import { buildWhatsAppUrl } from '@/config/site';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: 'Promotions',
    description: `Exclusive vehicle offers, import deals, and VIP access from ${siteConfig.name}.`,
  };
}

const perks = [
  {
    icon: Timer,
    title: 'Time-bound exclusives',
    copy: 'Real deadlines. Real savings. No fake urgency.',
  },
  {
    icon: Shield,
    title: 'Verified inventory',
    copy: 'Every offer is tied to inspected, showroom-ready stock.',
  },
  {
    icon: Sparkles,
    title: 'Concierge handover',
    copy: 'White-glove delivery and finance guidance included.',
  },
];

export default async function PromotionsPage() {
  const siteConfig = await getSiteConfig();
  const featured = promotionOffers.find((p) => p.featured) ?? promotionOffers[0];
  const rest = promotionOffers.filter((p) => p.id !== featured.id);
  const whatsappUrl = buildWhatsAppUrl(
    siteConfig.contact.whatsapp,
    'Hello QZERO International, I would like to know more about your current promotions.',
  );

  return (
    <div className="min-h-screen bg-brand-black">
      {/* ── Full-bleed hero ── */}
      <section className="relative min-h-[88svh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2400&q=80"
          alt="Premium automotive showroom experience"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center promo-hero-zoom"
        />
        {/* Atmospheric overlays — not badge stickers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-brand-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,0.18),transparent_55%)]" />

        <div className="relative z-10 mx-auto flex min-h-[88svh] w-full max-w-[1600px] flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:px-9 lg:pb-20">
          <nav className="mb-8 text-sm font-medium uppercase tracking-[0.2em] text-white/50 hero-content-animate">
            <Link href="/" className="transition-colors hover:text-brand-gold">
              Home
            </Link>
            <span className="mx-2 text-white/30">|</span>
            <span className="text-brand-gold">Our Promotions</span>
          </nav>

          <div className="hero-content-animate max-w-3xl">
            <p className="type-eyebrow text-brand-gold">
              QZERO International
            </p>
            <h1 className="type-display-xl mt-4 text-white">
              Our Promotions
            </h1>
            <p className="type-body mt-5 max-w-xl text-gray-200">
              Your trusted partner on every journey — exclusive offers crafted for serious buyers.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#offers"
                className="type-meta inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-black gold-gradient shadow-lg shadow-brand-gold/25 transition-all duration-300 hover:scale-[1.02]"
              >
                Explore Offers
                <ArrowDown className="h-4 w-4" />
              </a>
              <Link
                href="/vehicles"
                className="type-meta inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
              >
                Browse Showroom
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="border-y border-white/5 bg-[#080808]">
        <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-9">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30 bg-brand-gold/10">
                <perk.icon className="h-5 w-5 text-brand-gold" />
              </span>
              <div>
                <p className="text-lg font-semibold text-white">{perk.title}</p>
                <p className="type-muted mt-1">{perk.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured + grid ── */}
      <section id="offers" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-9 lg:py-24">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-eyebrow text-brand-gold">
                Current exclusives
              </p>
              <h2 className="type-section-title mt-3 text-white">
                Offers worth acting on
              </h2>
            </div>
            <p className="type-muted max-w-sm">
              Hand-picked deals on showroom stock, imports, and VIP access — updated for this season.
            </p>
          </div>

          <PromoFeatured offer={featured} />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {rest.map((offer, index) => (
              <PromoCard key={offer.id} offer={offer} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-white/5 bg-[#080808] px-4 py-20 sm:px-6 lg:px-9">
        <div className="mx-auto w-full max-w-[1600px]">
          <p className="type-eyebrow text-brand-gold">Simple process</p>
          <h2 className="type-section-title mt-3 text-white">Claim your offer in 3 steps</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Choose an offer',
                copy: 'Pick the promotion that matches your next vehicle or import plan.',
              },
              {
                step: '02',
                title: 'Talk to concierge',
                copy: 'WhatsApp or call us — we confirm eligibility, stock, and finance options.',
              },
              {
                step: '03',
                title: 'Drive with confidence',
                copy: 'Complete paperwork, schedule handover, and enjoy the QZERO experience.',
              },
            ].map((item) => (
              <div key={item.step} className="relative border-t border-brand-gold/40 pt-6">
                <p className="type-display-lg text-brand-gold/40">{item.step}</p>
                <h3 className="type-card-title mt-4 text-white">{item.title}</h3>
                <p className="type-muted mt-2">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA band ── */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-9">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/85 via-brand-black/55 to-brand-black/40" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-base text-brand-gold">
              <BadgeCheck className="h-4 w-4" />
              Personalised packages available
            </div>
            <h2 className="type-display-lg mt-4 text-white">
              Don&apos;t see the perfect deal?
            </h2>
            <p className="type-body mt-4 text-gray-300">
              Tell us what you&apos;re looking for — we&apos;ll craft a custom import or showroom package
              around your budget and timeline.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-meta inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold text-black gold-gradient shadow-lg shadow-brand-gold/20 transition-all hover:scale-[1.02]"
            >
              Inquire on WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className="type-meta inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-semibold text-white transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
