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
    <section className="relative min-h-[100svh] overflow-hidden bg-brand-black sm:min-h-[92svh]">
      <HeroCarousel />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1600px] items-end px-4 pb-24 pt-28 sm:min-h-[92svh] sm:items-center sm:px-6 sm:pb-20 sm:pt-20 lg:px-9">
        <div className="max-w-3xl hero-content-animate">
          <div className="type-meta inline-flex max-w-full items-center gap-2 rounded-full border border-brand-gold/45 bg-black/45 px-3 py-1.5 text-[0.7rem] font-semibold text-brand-gold shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">{tagline}</span>
          </div>

          <h1 className="type-display-xl mt-5 max-w-4xl text-[2.35rem] leading-[1.08] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] sm:mt-8 sm:text-inherit">
            {brandName}
          </h1>
          <p className="type-body mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:mt-6 sm:text-inherit">
            Curated luxury vehicles, direct import guidance, and a fast digital showroom built for
            serious buyers.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/vehicles"
              className="btn-micro inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-base font-bold tracking-wide text-black gold-gradient shadow-lg shadow-brand-gold/25 hover:shadow-brand-gold/40 sm:px-8 sm:py-4 sm:text-lg"
            >
              View Showroom
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/international"
              className="btn-micro inline-flex items-center justify-center rounded-full border border-white/25 bg-black/40 px-7 py-3.5 text-base font-semibold tracking-wide text-white backdrop-blur-md hover:border-brand-gold/60 hover:text-brand-gold sm:px-8 sm:py-4 sm:text-lg"
            >
              International Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
