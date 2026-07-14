import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowDown, ArrowRight, BadgeCheck } from 'lucide-react';
import { getSiteConfig } from '@/actions/settings';
import { getPromotions } from '@/actions/promotions';
import { PromoCard, PromoFeatured } from '@/components/promotions/PromoCards';
import { buildWhatsAppUrl } from '@/config/site';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: 'Promotions',
    description: `Exclusive vehicle offers from ${siteConfig.name} — limited deals on selected stock.`,
  };
}

export default async function PromotionsPage() {
  const [siteConfig, promotions] = await Promise.all([getSiteConfig(), getPromotions()]);
  const featured = promotions.find((p) => p.featured) ?? promotions[0];
  const rest = featured ? promotions.filter((p) => p.id !== featured.id) : [];
  const whatsappUrl = buildWhatsAppUrl(
    siteConfig.contact.whatsapp,
    'Hello QZERO International, I would like to know more about your current promotions.',
  );

  return (
    <div className="min-h-screen bg-brand-black">
      <section className="relative min-h-[72svh] overflow-hidden sm:min-h-[80svh]">
        <Image
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2400&q=80"
          alt="Premium automotive showroom experience"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center promo-hero-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-brand-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,0.18),transparent_55%)]" />

        <div className="relative z-10 mx-auto flex min-h-[72svh] w-full max-w-[1600px] flex-col justify-end px-4 pb-16 pt-28 sm:min-h-[80svh] sm:px-6 lg:px-9 lg:pb-20">
          <nav className="mb-8 text-sm font-medium uppercase tracking-[0.2em] text-white/50 hero-content-animate">
            <Link href="/" className="transition-colors hover:text-brand-gold">
              Home
            </Link>
            <span className="mx-2 text-white/30">|</span>
            <span className="text-brand-gold">Our Promotions</span>
          </nav>

          <div className="hero-content-animate max-w-3xl">
            <p className="type-eyebrow text-brand-gold">QZERO International</p>
            <h1 className="type-display-xl mt-4 text-white">Our Promotions</h1>
            <p className="type-body mt-5 max-w-xl text-gray-200">
              Exclusive deals on selected showroom vehicles — limited offers, ready to drive.
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

      <section id="offers" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-9 lg:py-24">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-eyebrow text-brand-gold">Promotion vehicles</p>
              <h2 className="type-section-title mt-3 text-white">Offers on selected stock</h2>
            </div>
            <p className="type-muted max-w-sm">
              Selected promotion vehicles — including exclusive stock not listed in the main
              showroom.
            </p>
          </div>

          {promotions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-[#0A0A0A] px-6 py-20 text-center">
              <p className="text-lg font-semibold text-white">No active promotions right now</p>
              <p className="type-muted mt-2">
                Browse the showroom for current stock, or message us for a custom deal.
              </p>
              <Link
                href="/vehicles"
                className="mt-6 inline-flex items-center gap-2 text-base font-bold text-brand-gold hover:underline"
              >
                Browse Showroom
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {featured ? <PromoFeatured offer={featured} /> : null}
              {rest.length > 0 ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
                  {rest.map((offer, index) => (
                    <PromoCard key={offer.id} offer={offer} index={index} />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

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
              Looking for something specific?
            </div>
            <h2 className="type-display-lg mt-4 text-white">Ask about a custom offer</h2>
            <p className="type-body mt-4 text-gray-300">
              Tell us the vehicle you want — we&apos;ll check stock and structure a deal around your
              budget.
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
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
