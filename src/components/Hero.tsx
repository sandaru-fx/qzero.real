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
    <section className="relative overflow-hidden bg-brand-black sm:min-h-[92svh]">
      {/*
        Mobile: photo band only (no text overlay).
        Desktop: full-bleed cinematic image behind copy.
      */}
      <div className="relative aspect-[16/10] w-full sm:absolute sm:inset-0 sm:aspect-auto">
        <HeroCarousel />
      </div>

      {/*
        Mobile: solid dark panel under the photo (centered copy).
        Desktop: overlay on the image (left-aligned, same as before).
      */}
      <div className="relative z-10 border-t border-white/10 bg-[#070707] px-5 pb-10 pt-8 sm:absolute sm:inset-0 sm:flex sm:border-0 sm:bg-transparent sm:px-6 sm:pb-20 sm:pt-20 sm:items-center lg:px-9">
        <div className="hero-content-animate mx-auto w-full min-w-0 max-w-3xl text-center sm:mx-0 sm:text-left">
          <div className="inline-flex max-w-full items-start gap-2 rounded-full border border-brand-gold/45 bg-white/5 px-3 py-1.5 text-[0.65rem] font-semibold text-brand-gold sm:items-center sm:bg-black/45 sm:px-4 sm:py-2 sm:text-xs sm:shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:backdrop-blur-md">
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0 sm:h-4 sm:w-4" />
            <span className="min-w-0 whitespace-normal break-words leading-snug">{tagline}</span>
          </div>

          <h1 className="mt-4 max-w-full font-[family-name:var(--font-display)] text-[1.9rem] font-bold leading-[1.12] tracking-[-0.03em] text-white sm:mt-8 sm:text-[clamp(2.75rem,6vw,7.5rem)] sm:leading-[0.92] sm:tracking-[-0.045em] sm:drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
            {brandName}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[0.95rem] leading-relaxed text-white/85 sm:mx-0 sm:mt-6 sm:max-w-2xl sm:text-lg sm:text-white/90 sm:drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            Curated luxury vehicles, direct import guidance, and a fast digital showroom built for
            serious buyers.
          </p>

          <div className="mt-6 flex w-full min-w-0 flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/vehicles"
              className="btn-micro inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-base font-bold tracking-wide text-black gold-gradient shadow-lg shadow-brand-gold/25 hover:shadow-brand-gold/40 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              View Showroom
              <ArrowRight className="h-5 w-5 shrink-0" />
            </Link>
            <Link
              href="/international"
              className="btn-micro inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-base font-semibold tracking-wide text-white hover:border-brand-gold/60 hover:text-brand-gold sm:w-auto sm:bg-black/40 sm:px-8 sm:py-4 sm:text-lg sm:backdrop-blur-md"
            >
              International Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
