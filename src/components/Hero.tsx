import Link from 'next/link';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-brand-black">
      {/* Background carousel + overlays rendered inside */}
      <HeroCarousel />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl hero-content-animate">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-black/60 px-4 py-2 text-sm text-brand-gold backdrop-blur-sm">
            <BadgeCheck className="h-4 w-4" />
            Premium showroom &amp; import partner
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            QZERO International
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">
            Curated luxury vehicles, direct import guidance, and a fast digital
            showroom built for serious buyers.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black gold-gradient shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-gold/40"
            >
              View Showroom
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/15 bg-black/50 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-brand-gold/60 hover:text-brand-gold"
            >
              Import Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
