import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { VehicleView } from '@/types/vehicle';
import { formatPrice } from '@/utils/formatPrice';

type HeroProps = {
  vehicle?: VehicleView;
};

export default function Hero({ vehicle }: HeroProps) {
  const heroImage = vehicle?.images[0] || '/qzero-logo.png';
  const hasVehicleImage = Boolean(vehicle?.images[0]);

  return (
    <section className="relative min-h-[82svh] overflow-hidden bg-brand-black">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={vehicle ? `${vehicle.brand} ${vehicle.model}` : 'QZERO International'}
          fill
          sizes="100vw"
          priority
          className={hasVehicleImage ? 'object-cover opacity-55' : 'object-contain opacity-20'}
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative mx-auto flex min-h-[82svh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-black/60 px-4 py-2 text-sm text-brand-gold backdrop-blur">
            <BadgeCheck className="h-4 w-4" />
            Premium showroom and import partner
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            QZERO International
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">
            Curated luxury vehicles, direct import guidance, and a fast digital showroom built for serious buyers.
          </p>

          {vehicle && (
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-brand-muted">
              <span className="rounded-full border border-brand-gold/40 bg-black/60 px-4 py-2 text-brand-gold">
                Featured: {vehicle.brand} {vehicle.model}
              </span>
              <span className="rounded-full border border-white/10 bg-black/60 px-4 py-2">
                {formatPrice(vehicle.price)}
              </span>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black gold-gradient transition-opacity hover:opacity-90"
            >
              View Showroom
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/15 bg-black/50 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-brand-gold/60 hover:text-brand-gold"
            >
              Import Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
