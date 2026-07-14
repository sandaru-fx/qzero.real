import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, BadgeCheck } from 'lucide-react';

const HeroCarousel = dynamic(() => import('./HeroCarousel'), {
  ssr: true,
  loading: () => <div className="absolute inset-0 bg-brand-black" />,
});

type HeroProps = {
  brandName?: string;
  tagline?: string;
};

export default function Hero({
  brandName = 'QZERO International',
  tagline = 'Premium showroom & import partner',
}: HeroProps) {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-brand-black">
      <HeroCarousel />

      <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-[1600px] items-center px-4 py-20 sm:px-6 lg:px-9">
        <div className="max-w-3xl hero-content-animate">
          <div className="type-meta inline-flex items-center gap-2 rounded-full border border-brand-gold/45 bg-black/35 px-4 py-2 font-semibold text-brand-gold shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <BadgeCheck className="h-4 w-4" />
            {tagline}
          </div>

          <h1 className="type-display-xl mt-8 max-w-4xl text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
            {brandName}
          </h1>
          <p className="type-body mt-6 max-w-2xl text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            Curated luxury vehicles, direct import guidance, and a fast digital showroom built for
            serious buyers.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/vehicles"
              className="btn-micro inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-bold tracking-wide text-black gold-gradient shadow-lg shadow-brand-gold/25 hover:shadow-brand-gold/40 sm:px-8 sm:py-4 sm:text-lg"
            >
              View Showroom
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/international"
              className="btn-micro inline-flex items-center rounded-full border border-white/25 bg-black/30 px-7 py-3.5 text-base font-semibold tracking-wide text-white backdrop-blur-md hover:border-brand-gold/60 hover:text-brand-gold sm:px-8 sm:py-4 sm:text-lg"
            >
              International Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
