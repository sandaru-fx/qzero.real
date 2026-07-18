'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import type { ReviewView } from '@/types/review';
import ReviewCard from '@/components/ui/ReviewCard';

type TestimonialMarqueeProps = {
  reviews: ReviewView[];
};

export default function TestimonialMarquee({ reviews }: TestimonialMarqueeProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplay] = useState(() =>
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
      containScroll: false,
      dragFree: false,
      // Embla default duration is 25 — ~2× slower slide motion
      duration: 50,
    },
    [autoplay]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    // Start on middle slide so left + right peeks show immediately
    if (reviews.length >= 3) {
      emblaApi.scrollTo(1, true);
    }
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect, reviews.length]);

  if (!reviews.length) return null;

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[#050505] py-14 sm:py-20">
      {/* Cool showroom light — no warm brown cast */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,255,255,0.04),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] h-[380px] w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)] blur-3xl"
      />

      <div className="relative mx-auto mb-10 flex w-full max-w-[1600px] flex-col gap-5 px-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-9">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-brand-gold backdrop-blur-md">
            <Quote className="h-4 w-4" />
            Client stories
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            What our clients say
          </h2>
          <p className="mt-3 max-w-xl text-base text-white/70">
            Verified buyers. Quiet confidence. The standard behind every QZERO handover.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/reviews"
            className="group/btn relative inline-flex items-center gap-2 overflow-hidden px-1 py-2 text-base font-semibold text-white"
          >
            <span className="relative">
              All reviews
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#D4AF37] transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:scale-x-100" />
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <div
        className="relative px-2 sm:px-4"
        onMouseEnter={() => autoplay.stop()}
        onMouseLeave={() => autoplay.play()}
      >
        {/* Extra vertical padding so scaled active cards keep a full gold border (no clipped top edge) */}
        <div className="overflow-hidden py-12 sm:py-14" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {reviews.map((review, index) => {
              const active = index === selectedIndex;
              return (
                <div
                  key={review.id}
                  className="min-w-0 shrink-0 grow-0 basis-[86%] px-3 sm:basis-[68%] md:basis-[54%] lg:basis-[48%] xl:basis-[44%]"
                >
                  <motion.div
                    animate={{
                      scale: active ? 1.06 : 0.92,
                      opacity: active ? 1 : 0.5,
                      y: active ? -6 : 12,
                      zIndex: active ? 20 : 1,
                    }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative will-change-transform ${active ? 'z-20' : 'z-[1]'}`}
                  >
                    <ReviewCard review={review} emphasized={active} size="page" />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              aria-label={`Go to review ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                index === selectedIndex
                  ? 'w-8 bg-[#D4AF37]'
                  : 'w-1.5 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
