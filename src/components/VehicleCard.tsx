'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Gauge, Gem, Timer, ArrowRight } from 'lucide-react';
import { VehicleView } from '@/types/vehicle';
import { formatPrice } from '@/utils/formatPrice';

type VehicleCardProps = {
  vehicle: VehicleView;
  priority?: boolean;
};

export default function VehicleCard({ vehicle, priority = false }: VehicleCardProps) {
  const imageSrc = vehicle.images[0] || '/qzero-logo.png';
  const title = `${vehicle.brand} ${vehicle.model}`;

  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/5 bg-brand-card transition-all duration-500 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(212,175,55,0.08)] sm:rounded-xl sm:hover:-translate-y-2"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-black">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          quality={85}
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 sm:group-hover:scale-110"
        />
        {vehicle.isFeatured && (
          <span className="absolute left-2 top-2 rounded-full border border-brand-gold/30 bg-black/60 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-brand-gold backdrop-blur-md sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-gold sm:text-xs sm:tracking-[0.18em]">
              {vehicle.brand}
            </p>
            <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug tracking-tight text-white sm:mt-2 sm:text-[1.7rem] sm:leading-tight">
              {vehicle.model}
            </h3>
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-brand-muted sm:hidden">
              Year — {vehicle.year}
            </p>
          </div>
          <div className="hidden shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-sm sm:flex">
            <span className="type-meta font-medium text-brand-muted">{vehicle.year}</span>
          </div>
        </div>

        <p className="mt-2 text-sm font-extrabold tracking-tight gold-text sm:mt-4 sm:text-3xl">
          {formatPrice(vehicle.price)}
        </p>

        <div className="mt-3 hidden flex-wrap gap-2 text-[0.95rem] font-semibold text-brand-muted sm:flex">
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5">
            <Gauge className="h-4 w-4 text-brand-gold/70" />
            {vehicle.mileage.toLocaleString()} km
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5">
            <Timer className="h-4 w-4 text-brand-gold/70" />
            {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5">
            <Gem className="h-4 w-4 text-brand-gold/70" />
            {vehicle.fuelType}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[0.7rem] font-bold uppercase tracking-wide text-brand-gold transition-all duration-300 group-hover:gap-3 sm:pt-6 sm:text-base sm:justify-start">
          <span className="inline-flex items-center gap-1.5 sm:gap-2">
            Explore More
            <ArrowRight className="hidden h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 sm:block" />
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-brand-black sm:hidden">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
