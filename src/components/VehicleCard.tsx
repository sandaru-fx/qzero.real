'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Gauge, Gem, Timer, ArrowRight } from 'lucide-react';
import { VehicleView } from '@/types/vehicle';
import { formatPrice } from '@/utils/formatPrice';
import WishlistButton from '@/components/motion/WishlistButton';

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
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-brand-card transition-all duration-500 hover:-translate-y-2 hover:border-brand-gold/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(212,175,55,0.08)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black sm:aspect-[5/4]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {vehicle.isFeatured && (
          <span className="type-meta absolute left-3 top-3 rounded-full border border-brand-gold/30 bg-black/60 px-3 py-1 font-bold uppercase text-brand-gold backdrop-blur-md">
            Featured
          </span>
        )}
        <WishlistButton vehicleId={vehicle._id} title={title} />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="type-eyebrow text-brand-gold">{vehicle.brand}</p>
            <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-white sm:text-[1.7rem]">
              {vehicle.model}
            </h3>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-sm">
            <span className="type-meta font-medium text-brand-muted">{vehicle.year}</span>
          </div>
        </div>

        <p className="mt-4 text-2xl font-extrabold tracking-tight gold-text sm:text-3xl">
          {formatPrice(vehicle.price)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-[0.95rem] font-semibold text-brand-muted">
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

        <div className="mt-auto flex items-center gap-2 pt-6 text-base font-bold uppercase tracking-wide text-brand-gold transition-all duration-300 group-hover:gap-3">
          Explore More
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
