import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CalendarDays,
  Car,
  ChevronRight,
  Fuel,
  Gauge,
  MessageCircle,
  Settings,
  Tag,
  Zap,
  Award,
} from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import VehicleCard from '@/components/VehicleCard';
import ShareVehicleButton from '@/components/ShareVehicleButton';
import StickyVehicleCta from '@/components/StickyVehicleCta';
import TrackedWhatsAppLink from '@/components/TrackedWhatsAppLink';
import { getVehicleBySlug, getRelatedVehicles } from '@/actions/search';
import { formatPrice } from '@/utils/formatPrice';
import { buildWhatsAppUrl } from '@/config/site';

import { getSiteConfig } from '@/actions/settings';

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
  const siteConfig = await getSiteConfig();

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = await getRelatedVehicles(vehicle, 3);
  const title = `${vehicle.brand} ${vehicle.model}`;
  const formattedPrice = formatPrice(vehicle.price);
  const postedDate = vehicle.createdAt
    ? new Date(vehicle.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const whatsappMessage = `Hello QZERO International, I am interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.model} priced at ${formattedPrice}. Is this vehicle still available?`;
  const whatsappUrl = buildWhatsAppUrl(siteConfig.contact.whatsapp, whatsappMessage);
  
  // For the share button, we need the absolute URL of the page
  const pageUrl = `${siteConfig.url}/vehicles/${slug}`;
  const shareWhatsAppUrl = buildWhatsAppUrl(siteConfig.contact.whatsapp, `Check out this vehicle: ${title} — ${pageUrl}`);

  const specs = [
    { icon: Tag, label: 'Brand', value: vehicle.brand },
    { icon: Car, label: 'Model', value: vehicle.model },
    { icon: Award, label: 'Grade', value: vehicle.grade || '—' },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
    { icon: CalendarDays, label: 'Year', value: String(vehicle.year) },
    { icon: Fuel, label: 'Fuel', value: vehicle.fuelType },
    { icon: Zap, label: 'Engine Capacity', value: vehicle.engineCapacity },
    { icon: Car, label: 'Body Type', value: vehicle.bodyType || 'Car' },
  ];

  const additionalSpecs = [
    { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} km` },
    { label: 'Condition', value: vehicle.condition },
  ];

  return (
    <div className="min-h-screen bg-brand-black pb-24 lg:pb-0">
      {/* ── Breadcrumb Navigation ── */}
      <div className="border-b border-white/5 bg-brand-black/80">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 lg:px-9">
          <nav className="type-meta flex flex-wrap items-center gap-1.5 text-brand-muted">
            <Link href="/" className="transition-colors hover:text-brand-gold">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/vehicles" className="transition-colors hover:text-brand-gold">Our Vehicles</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-brand-gold font-medium">{title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-9">
        {/* ── Title & Posted Date ── */}
        <div className="mb-8">
          <h1 className="type-display-lg text-white">
            {vehicle.brand} {vehicle.model} {vehicle.year}{' '}
            {vehicle.grade && <span className="text-brand-gold">{vehicle.grade}</span>}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {postedDate && (
              <p className="type-meta text-brand-muted">
                Posted: <span className="text-gray-300">{postedDate}</span>
              </p>
            )}
            {vehicle.isFeatured && (
              <span className="type-meta rounded-full border border-brand-gold/30 bg-brand-gold/5 px-3 py-1 font-bold uppercase text-brand-gold">
                Featured
              </span>
            )}
          </div>
          <p className="mt-5 text-4xl font-extrabold tracking-tight gold-text">{formattedPrice}</p>
        </div>

        {/* ── Image Gallery ── */}
        <div className="mb-12">
          <ImageGallery images={vehicle.images} title={title} />
        </div>

        {/* ── Description Section ── */}
        {vehicle.description && (
          <section className="mb-12 rounded-xl border border-white/5 bg-brand-card p-6 sm:p-8 lg:p-10">
            <h2 className="type-section-title text-white">Description</h2>
            <div className="mt-2 h-px w-full bg-gradient-to-r from-brand-gold/50 to-transparent" />
            <div className="type-body mt-6 max-w-4xl space-y-4 text-gray-300 whitespace-pre-line">
              {vehicle.description}
            </div>
          </section>
        )}

        {/* ── Specifications Grid (like Indra Traders) ── */}
        <section className="mb-12 rounded-xl border border-white/5 bg-brand-card p-6 sm:p-8 lg:p-10">
          <h2 className="type-section-title text-white">Specifications</h2>
          <div className="mt-2 h-px w-full bg-gradient-to-r from-brand-gold/50 to-transparent" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-brand-black/50 p-5 transition-all duration-300 hover:border-brand-gold/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                  <spec.icon className="h-5 w-5 text-brand-gold" />
                </div>
                <div>
                  <p className="type-meta font-medium uppercase text-brand-muted">{spec.label}</p>
                  <p className="mt-1 text-lg font-bold uppercase tracking-tight text-white">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional specs row */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {additionalSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-brand-black/50 p-5 transition-all duration-300 hover:border-brand-gold/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                  <Gauge className="h-5 w-5 text-brand-gold" />
                </div>
                <div>
                  <p className="type-meta font-medium uppercase text-brand-muted">{spec.label}</p>
                  <p className="mt-1 text-lg font-bold uppercase tracking-tight text-white">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WhatsApp CTA ── */}
        <section className="mb-12 flex flex-col items-center gap-4 rounded-xl border border-white/5 bg-brand-card p-8 sm:flex-row sm:justify-between">
          <div>
            <h3 className="type-card-title text-white">Interested in this vehicle?</h3>
            <p className="type-muted mt-1">Get in touch with us for more details, pricing, and availability.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            <TrackedWhatsAppLink
              href={whatsappUrl}
              source="vehicle_inquire"
              vehicleSlug={vehicle.slug}
              className="group inline-flex h-14 items-center gap-3 rounded-full gold-gradient px-8 text-lg font-bold text-black shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-gold/40 sm:h-16 sm:px-10 sm:text-xl"
            >
              <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110 sm:h-7 sm:w-7" />
              Inquire via WhatsApp
            </TrackedWhatsAppLink>
            <ShareVehicleButton title={title} slug={vehicle.slug} whatsappUrl={shareWhatsAppUrl} />
          </div>
        </section>

        {/* ── Related Vehicles ── */}
        {relatedVehicles.length > 0 && (
          <section className="mt-16 border-t border-white/5 pt-10">
            <p className="type-eyebrow text-brand-gold">You may also like</p>
            <h2 className="type-section-title mt-3 text-white">Related Vehicles</h2>
            <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
              {relatedVehicles.map((related) => (
                <VehicleCard key={related._id} vehicle={related} />
              ))}
            </div>
          </section>
        )}
      </div>

      <StickyVehicleCta
        title={title}
        vehicleSlug={vehicle.slug}
        whatsappUrl={whatsappUrl}
        contactHref={`/contact?vehicle=${encodeURIComponent(`${vehicle.year} ${vehicle.brand} ${vehicle.model}`)}&inquiry=Vehicle%20Purchase`}
      />
    </div>
  );
}
