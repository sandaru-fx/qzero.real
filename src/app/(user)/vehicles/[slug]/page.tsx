import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Fuel, Gauge, Settings, CalendarDays } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import { getVehicleBySlug } from '@/actions/search';
import { formatPrice } from '@/utils/formatPrice';

export const revalidate = 60;

type VehicleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: 'Vehicle not found',
    };
  }

  return {
    title: `${vehicle.brand} ${vehicle.model}`,
    description: vehicle.description,
  };
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const title = `${vehicle.brand} ${vehicle.model}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/vehicles" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-gold">
        <ArrowLeft className="h-4 w-4" />
        Back to showroom
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <ImageGallery images={vehicle.images} title={title} />

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-semibold text-brand-gold">{vehicle.brand}</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{vehicle.model}</h1>
          <p className="mt-5 text-3xl font-semibold gold-text">{formatPrice(vehicle.price)}</p>

          <div className="mt-8 grid gap-3">
            <Spec icon={CalendarDays} label="Year" value={String(vehicle.year)} />
            <Spec icon={Gauge} label="Mileage" value={`${vehicle.mileage.toLocaleString()} km`} />
            <Spec icon={Fuel} label="Fuel" value={vehicle.fuelType} />
            <Spec icon={Settings} label="Transmission" value={vehicle.transmission} />
            <Spec icon={Settings} label="Engine" value={vehicle.engineCapacity} />
          </div>

          <Link
            href="/contact"
            className="mt-8 inline-flex w-full justify-center rounded-full px-6 py-3 text-sm font-semibold text-black gold-gradient transition-opacity hover:opacity-90"
          >
            Request this vehicle
          </Link>
        </aside>
      </div>

      <section className="mt-12 border-t border-brand-line pt-10">
        <p className="text-sm font-semibold text-brand-gold">Overview</p>
        <p className="mt-4 max-w-3xl leading-8 text-gray-200">{vehicle.description}</p>
      </section>
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-brand-line bg-brand-card p-4">
      <span className="flex items-center gap-3 text-sm text-brand-muted">
        <Icon className="h-4 w-4 text-brand-gold" />
        {label}
      </span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
