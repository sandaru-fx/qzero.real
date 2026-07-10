import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Fuel, Gauge, MessageCircle, Settings, Zap } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import VehicleCard from '@/components/VehicleCard';
import ShareVehicleButton from '@/components/ShareVehicleButton';
import { getVehicleBySlug, getRelatedVehicles } from '@/actions/search';
import { formatPrice } from '@/utils/formatPrice';
import { buildWhatsAppUrl } from '@/config/site';

export const revalidate = 60;

type VehicleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return { title: 'Vehicle not found — QZERO' };
  }

  const title = `${vehicle.brand} ${vehicle.model}`;
  const image = vehicle.images[0];

  return {
    title,
    description: vehicle.description,
    openGraph: {
      title: `${title} — QZERO International`,
      description: vehicle.description,
      images: image ? [{ url: image, alt: title }] : [],
    },
  };
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = await getRelatedVehicles(vehicle, 3);
  const title = `${vehicle.brand} ${vehicle.model}`;
  const formattedPrice = formatPrice(vehicle.price);

  const whatsappMessage = `Hello QZERO International, I am interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.model} priced at ${formattedPrice}. Is this vehicle still available?`;
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  const specs = [
    { icon: CalendarDays, label: 'Year', value: String(vehicle.year) },
    { icon: Gauge, label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} km` },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
    { icon: Zap, label: 'Engine', value: vehicle.engineCapacity },
    { icon: Settings, label: 'Condition', value: vehicle.condition },
  ];

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 text-sm text-brand-muted transition-colors hover:text-brand-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collection
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <ImageGallery images={vehicle.images} title={title} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">{vehicle.brand}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">{vehicle.model}</h1>
            <p className="mt-6 text-3xl font-bold gold-text">{formattedPrice}</p>

            {vehicle.isFeatured && (
              <span className="mt-4 inline-block rounded-full border border-brand-gold/30 bg-brand-gold/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold">
                Featured Vehicle
              </span>
            )}

            <div className="mt-8 grid gap-2">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-brand-card px-4 py-3.5"
                >
                  <span className="flex items-center gap-3 text-sm text-brand-muted">
                    <spec.icon className="h-4 w-4 text-brand-gold/70" />
                    {spec.label}
                  </span>
                  <span className="text-sm font-semibold text-white">{spec.value}</span>
                </div>
              ))}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 flex w-full items-center justify-center gap-2.5 rounded-full gold-gradient px-6 py-4 text-sm font-bold text-black shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-gold/40"
            >
              <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
              Inquire via WhatsApp
            </a>

            <ShareVehicleButton title={title} slug={vehicle.slug} />

            <p className="mt-3 text-center text-xs text-brand-muted">
              Instant response · Available 24/7
            </p>
          </aside>
        </div>

        {vehicle.description && (
          <section className="mt-16 border-t border-white/5 pt-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Overview</p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-gray-300">{vehicle.description}</p>
          </section>
        )}

        {relatedVehicles.length > 0 && (
          <section className="mt-16 border-t border-white/5 pt-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">You may also like</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Related vehicles</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedVehicles.map((related) => (
                <VehicleCard key={related._id} vehicle={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
