import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero from '@/components/Hero';
import VehicleCard from '@/components/VehicleCard';
import VehicleSearchSection from '@/components/VehicleSearchSection';
import HomeLifestyleBand from '@/components/home/HomeLifestyleBand';
import { getFeaturedVehicles, getVehicles } from '@/actions/search';
import { SITE_SHELL } from '@/config/layout';

export const revalidate = 60;

const processSteps = [
  'Select or request',
  'Inspect and confirm',
  'Import and clear',
  'Deliver and support',
];

export default async function HomePage() {
  const [featuredVehicles, latestVehicles] = await Promise.all([
    getFeaturedVehicles(4),
    getVehicles({ limit: 8 }),
  ]);

  const displayVehicles =
    featuredVehicles.length > 0
      ? featuredVehicles.slice(0, 4)
      : latestVehicles.slice(0, 4);

  return (
    <>
      <Hero />

      <section className="relative z-20 border-b border-white/5 bg-gradient-to-b from-black via-[#0a0a0a] to-brand-black pb-6 pt-10 sm:pb-8 sm:pt-12">
        <div className={SITE_SHELL}>
          <VehicleSearchSection showHeroCopy fullWidth />
        </div>
      </section>

      <section className={`${SITE_SHELL} pb-12 pt-8 sm:pb-14 sm:pt-10`}>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-4 py-2 text-sm text-brand-gold">
              <Sparkles className="h-4 w-4" />
              Curated showroom
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Featured vehicles</h2>
            <p className="mt-3 max-w-2xl text-brand-muted">
              Premium listings with fixed image spaces, fast server data, and no heavy carousel JavaScript.
            </p>
          </div>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 rounded-full border border-brand-line px-5 py-3 text-sm font-semibold text-white hover:border-brand-gold/60 hover:text-brand-gold"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {displayVehicles.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayVehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-brand-line bg-brand-card p-8 text-center">
            <p className="text-lg font-semibold text-white">Showroom inventory is being prepared.</p>
            <p className="mt-2 text-sm text-brand-muted">
              Add vehicles from the admin panel to publish live listings here.
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-brand-line bg-black py-12 sm:py-14">
        <div className={`${SITE_SHELL} text-center`}>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">GLOBAL REACH</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Countries We Serve</h2>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {[
              { code: 'lk', name: 'Sri Lanka' },
              { code: 'in', name: 'India' },
              { code: 'pk', name: 'Pakistan' },
              { code: 'np', name: 'Nepal' },
              { code: 'au', name: 'Australia' },
            ].map((country) => (
              <div key={country.code} className="flex flex-col items-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-brand-card sm:h-20 sm:w-20">
                  <Image
                    src={`https://flagcdn.com/w160/${country.code}.png`}
                    alt={`${country.name} flag`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 64px, 80px"
                  />
                </div>
                <span className="text-sm font-semibold tracking-wide text-white">{country.name}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-medium text-brand-muted/70">...and many more across Asia</p>
        </div>
      </section>

      <section className="bg-black py-12 sm:py-14">
        <div className={SITE_SHELL}>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">QUALITY SOURCES</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Import Origins</h2>
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
                className="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-brand-card py-8 transition-all duration-300 hover:scale-[1.02] hover:border-brand-gold/40 hover:bg-brand-card/80 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] sm:py-10"
              >
                <div className="relative mb-5 h-12 w-16 overflow-hidden rounded border border-white/10 shadow-sm sm:h-14 sm:w-[72px]">
                  <Image
                    src={`https://flagcdn.com/w160/${origin.code}.png`}
                    alt={`${origin.name} flag`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <h3 className="text-lg font-bold tracking-wide text-white">{origin.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-brand-line bg-brand-card">
        <div className={`${SITE_SHELL} py-12 sm:py-14`}>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-brand-gold">Import concierge</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                From source market to your driveway.
              </h2>
              <p className="mt-4 leading-7 text-brand-muted">
                QZERO keeps the import journey simple: request, source, inspect, ship, clear, and
                deliver with a single premium workflow.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {processSteps.map((step, index) => (
                <div key={step} className="rounded-lg border border-brand-line bg-black p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/50 text-sm font-semibold text-brand-gold">
                    {index + 1}
                  </span>
                  <p className="mt-5 text-sm font-semibold text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomeLifestyleBand />
    </>
  );
}
