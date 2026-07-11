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

  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group block overflow-hidden rounded-xl border border-white/5 bg-brand-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-2xl hover:shadow-brand-gold/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <Image
          src={imageSrc}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {vehicle.isFeatured && (
          <span className="absolute left-4 top-4 rounded-full border border-brand-gold/30 bg-black/60 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-gold backdrop-blur-md">
            Featured
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">{vehicle.brand}</p>
            <h3 className="mt-1.5 text-xl font-bold tracking-tight text-white">{vehicle.model}</h3>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/50 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs font-medium text-brand-muted">{vehicle.year}</span>
          </div>
        </div>

        <p className="mt-5 text-2xl font-bold gold-text">{formatPrice(vehicle.price)}</p>

        <div className="mt-5 flex flex-wrap gap-2 text-[13px] text-brand-muted">
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5">
            <Gauge className="h-3.5 w-3.5 text-brand-gold/70" />
            {vehicle.mileage.toLocaleString()} km
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5">
            <Timer className="h-3.5 w-3.5 text-brand-gold/70" />
            {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5">
            <Gem className="h-3.5 w-3.5 text-brand-gold/70" />
            {vehicle.fuelType}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-gold transition-all duration-300 group-hover:gap-3">
          Explore More
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
