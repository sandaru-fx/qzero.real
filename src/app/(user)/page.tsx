import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero from '@/components/Hero';
import VehicleCard from '@/components/VehicleCard';
import VehicleSearchSection from '@/components/VehicleSearchSection';
import HomeLifestyleBand from '@/components/home/HomeLifestyleBand';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { getFeaturedVehicles, getVehicles } from '@/actions/search';
import { getSiteConfig } from '@/actions/settings';
import { getFeaturedReviews } from '@/actions/review';
import { SITE_SHELL } from '@/config/layout';
import TestimonialMarquee from '@/components/ui/TestimonialMarquee';

export const revalidate = 60;

const processSteps = [
  'Select or request',
  'Inspect and confirm',
  'Source and clear',
  'Deliver and support',
];

export default async function HomePage() {
  const [featuredVehicles, latestVehicles, siteConfig, featuredReviews] = await Promise.all([
    getFeaturedVehicles(4),
    getVehicles({ limit: 8 }),
    getSiteConfig(),
    getFeaturedReviews(10),
  ]);

  const displayVehicles =
    featuredVehicles.length > 0
      ? featuredVehicles.slice(0, 4)
      : latestVehicles.slice(0, 4);

  return (
    <>
      <Hero brandName={siteConfig.name} tagline={siteConfig.tagline} />

      <ScrollReveal className="relative z-30">
        <section className="overflow-visible border-b border-white/5 bg-gradient-to-b from-black via-[#0a0a0a] to-brand-black pb-16 pt-10 sm:pb-20 sm:pt-12">
          <div className={SITE_SHELL}>
            <VehicleSearchSection showHeroCopy fullWidth />
          </div>
        </section>
      </ScrollReveal>

      <section className={`relative z-10 ${SITE_SHELL} pb-12 pt-8 sm:pb-14 sm:pt-10`}>
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-4 py-2 text-base text-brand-gold">
                <Sparkles className="h-4 w-4" />
                Curated showroom
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Featured vehicles</h2>
              <p className="type-muted mt-3 max-w-2xl">
                Hand-picked premium listings — verified details, clear pricing, and concierge support
                from first inquiry to handover.
              </p>
            </div>
            <Link
              href="/vehicles"
              className="btn-micro inline-flex items-center gap-2 rounded-full border border-brand-line px-5 py-3 text-base font-semibold text-white hover:border-brand-gold/60 hover:text-brand-gold"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        {displayVehicles.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {displayVehicles.map((vehicle, index) => (
              <ScrollReveal key={vehicle._id} delayMs={index * 60}>
                <VehicleCard vehicle={vehicle} priority={index < 4} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-brand-line bg-brand-card p-8 text-center">
            <p className="text-lg font-semibold text-white">Showroom inventory is being prepared.</p>
            <p className="type-muted mt-2">
              Add vehicles from the admin panel to publish live listings here.
            </p>
          </div>
        )}
      </section>

      {featuredReviews.length > 0 ? <TestimonialMarquee reviews={featuredReviews} /> : null}

      <ScrollReveal>
        <section className="border-y border-brand-line bg-black py-14 sm:py-16">
          <div className={`${SITE_SHELL} text-center`}>
            <p className="text-base font-bold uppercase tracking-[0.2em] text-brand-gold">
              GLOBAL REACH
            </p>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Countries We Serve
            </h2>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-16">
              {[
                { code: 'lk', name: 'Sri Lanka' },
                { code: 'in', name: 'India' },
                { code: 'pk', name: 'Pakistan' },
                { code: 'np', name: 'Nepal' },
                { code: 'au', name: 'Australia' },
              ].map((country) => (
                <div
                  key={country.code}
                  className="group flex flex-col items-center gap-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-brand-card shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-transform duration-500 group-hover:scale-105 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                    <Image
                      src={`https://flagcdn.com/w320/${country.code}.png`}
                      alt={`${country.name} flag`}
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                    />
                  </div>
                  <span className="text-lg font-bold tracking-wide text-white sm:text-xl">
                    {country.name}
                  </span>
                </div>
              ))}
            </div>
            <p className="type-muted mt-10 opacity-80">...and many more across Asia</p>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-black py-12 sm:py-14">
          <div className={SITE_SHELL}>
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-gold">
                QUALITY SOURCES
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">International Origins</h2>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {[
                { code: 'jp', name: 'Japan' },
                { code: 'th', name: 'Thailand' },
                { code: 'de', name: 'Germany' },
                { code: 'it', name: 'Italy' },
              ].map((origin) => (
                <div
                  key={origin.code}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-brand-card py-8 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-brand-gold/40 hover:bg-brand-card/80 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] sm:py-10"
                >
                  <div className="relative mb-5 h-12 w-16 overflow-hidden rounded border border-white/10 shadow-sm sm:h-14 sm:w-[72px]">
                    <Image
                      src={`https://flagcdn.com/w160/${origin.code}.png`}
                      alt={`${origin.name} flag`}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="80px"
                    />
                  </div>
                  <h3 className="text-lg font-bold tracking-wide text-white">{origin.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="border-y border-brand-line bg-brand-card">
          <div className={`${SITE_SHELL} py-12 sm:py-14`}>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-base font-semibold text-brand-gold">International concierge</p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  From source market to your driveway.
                </h2>
                <p className="type-muted mt-4">
                  QZERO keeps the international journey simple: request, source, inspect, ship, clear, and
                  deliver with a single premium workflow.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {processSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-lg border border-brand-line bg-black p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/30"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/50 text-base font-semibold text-brand-gold">
                      {index + 1}
                    </span>
                    <p className="mt-5 text-base font-semibold text-white">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <HomeLifestyleBand />
      </ScrollReveal>
    </>
  );
}
