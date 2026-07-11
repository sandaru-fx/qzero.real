'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PromotionOffer } from '@/data/promotions';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export function PromoFeatured({ offer }: { offer: PromotionOffer }) {
  const { ref, visible } = useInView(0.12);

  return (
    <article
      ref={ref}
      className={`group relative overflow-hidden border border-white/10 bg-[#0A0A0A] transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[320px] lg:min-h-[520px]">
          <Image
            src={offer.image}
            alt={offer.imageAlt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20 lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-[#0A0A0A]/55" />
        </div>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-brand-gold">
              {offer.badge}
            </span>
            <span className="h-px w-8 bg-brand-gold/50" />
            <span className="type-meta text-brand-muted">Valid until {offer.validUntil}</span>
          </div>

          <p className="type-eyebrow mt-6 text-brand-gold">
            {offer.brand}
          </p>
          <h2 className="type-section-title mt-2 text-white">
            {offer.title}
          </h2>

          <p className="mt-6 text-xl font-semibold text-white sm:text-2xl">
            {offer.highlight}{' '}
            <span className="font-normal text-brand-muted">or enjoy</span>{' '}
            <span className="gold-text font-bold">{offer.highlightAccent}</span>
          </p>

          <p className="type-muted mt-4 max-w-md">
            {offer.description}
          </p>

          <Link
            href={offer.href}
            className="group/cta mt-8 inline-flex w-fit items-center gap-3 text-base font-bold uppercase tracking-wide text-brand-gold transition-colors hover:text-brand-gold-light"
          >
            {offer.cta}
            <span className="flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-black transition-transform duration-300 group-hover/cta:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PromoCard({ offer, index }: { offer: PromotionOffer; index: number }) {
  const { ref, visible } = useInView(0.1);

  return (
    <article
      ref={ref}
      style={{ transitionDelay: `${Math.min(index, 4) * 80}ms` }}
      className={`group flex flex-col overflow-hidden border border-white/8 bg-[#0C0C0C] transition-all duration-700 hover:border-brand-gold/35 hover:shadow-[0_20px_60px_rgba(212,175,55,0.08)] ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-black">
        <Image
          src={offer.image}
          alt={offer.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 border border-brand-gold/40 bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold backdrop-blur-sm">
          {offer.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6 sm:px-6">
        <p className="type-eyebrow text-brand-gold">{offer.brand}</p>
        <h3 className="type-card-title mt-2 text-white">{offer.title}</h3>
        <p className="type-meta mt-2 text-brand-muted">Valid until | {offer.validUntil}</p>

        <p className="mt-4 text-lg font-semibold text-white">
          {offer.highlight}
          <span className="type-meta mt-1 block font-normal text-brand-muted">
            {offer.highlightAccent}
          </span>
        </p>

        <p className="type-muted mt-3 flex-1 line-clamp-3">
          {offer.description}
        </p>

        <Link
          href={offer.href}
          className="group/cta mt-6 inline-flex items-center gap-2.5 text-base font-bold uppercase tracking-wide text-brand-gold"
        >
          {offer.cta}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-black transition-transform duration-300 group-hover/cta:translate-x-1">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </article>
  );
}
