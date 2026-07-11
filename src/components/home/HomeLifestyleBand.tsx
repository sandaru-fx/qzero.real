import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { lifestyleImages } from '@/data/lifestyle';
import { SITE_SHELL } from '@/config/layout';

export default function HomeLifestyleBand() {
  return (
    <section className="relative overflow-hidden border-y border-brand-line">
      <div className="absolute inset-0">
        <Image
          src={lifestyleImages.homeTrust}
          alt="Families and drivers who trust QZERO"
          fill
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-transparent to-black/15" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(212,175,55,0.12),transparent_50%)]" />
      </div>

      <div className={`relative z-10 ${SITE_SHELL} py-16 sm:py-20`}>
        <div className="max-w-2xl">
          <p className="type-eyebrow text-brand-gold">Built for real journeys</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            More than vehicles — confidence for every mile.
          </h2>
          <p className="type-body mt-5 text-gray-200">
            From family road trips to executive imports, QZERO pairs premium stock with people-first
            guidance — so every handover feels safe, clear, and personal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-bold uppercase tracking-[0.1em] text-black gold-gradient transition-transform hover:scale-[1.02]"
            >
              Our story
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-6 py-3.5 text-base font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
