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
    <section className="relative overflow-hidden bg-brand-black">
      {/*
        Mobile: near-landscape frame so object-cover keeps the full showroom scene
        (same feel as PC). Desktop: full-viewport cinematic hero.
      */}
      <div className="relative aspect-[3/2] w-full sm:aspect-auto sm:min-h-[92svh]">
        <div className="absolute inset-0">
          <HeroCarousel />
        </div>

        <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-[1600px] flex-col justify-end px-4 pb-10 pt-6 sm:justify-center sm:px-6 sm:pb-20 sm:pt-20 lg:px-9">
          <div className="hero-content-animate w-full min-w-0 max-w-3xl">
            <div className="inline-flex max-w-full items-start gap-2 rounded-full border border-brand-gold/45 bg-black/55 px-3 py-1.5 text-[0.65rem] font-semibold text-brand-gold shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md sm:items-center sm:px-4 sm:py-2 sm:text-xs">
              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0 sm:h-4 sm:w-4" />
              <span className="min-w-0 whitespace-normal break-words leading-snug">{tagline}</span>
            </div>

            <h1 className="mt-4 max-w-full font-[family-name:var(--font-display)] text-[1.85rem] font-bold leading-[1.1] tracking-[-0.03em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] [overflow-wrap:anywhere] sm:mt-8 sm:text-[clamp(2.75rem,6vw,7.5rem)] sm:leading-[0.92] sm:tracking-[-0.045em] sm:[overflow-wrap:normal]">
              {brandName}
            </h1>
            <p className="mt-3 max-w-full text-[0.9rem] leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:mt-6 sm:max-w-2xl sm:text-lg">
              Curated luxury vehicles, direct import guidance, and a fast digital showroom built for
              serious buyers.
            </p>

            <div className="mt-5 flex w-full min-w-0 max-w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/vehicles"
                className="btn-micro inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-base font-bold tracking-wide text-black gold-gradient shadow-lg shadow-brand-gold/25 hover:shadow-brand-gold/40 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                View Showroom
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
              <Link
                href="/international"
                className="btn-micro inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-black/40 px-6 py-3.5 text-base font-semibold tracking-wide text-white backdrop-blur-md hover:border-brand-gold/60 hover:text-brand-gold sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                International Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
