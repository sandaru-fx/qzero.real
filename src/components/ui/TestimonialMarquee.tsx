import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import type { ReviewView } from '@/types/review';
import ReviewCard from '@/components/ui/ReviewCard';

type TestimonialMarqueeProps = {
  reviews: ReviewView[];
};

export default function TestimonialMarquee({ reviews }: TestimonialMarqueeProps) {
  if (!reviews.length) return null;

  // Duplicate for seamless infinite scroll
  const loop = [...reviews, ...reviews];

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-b from-[#050505] via-black to-[#050505] py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#050505] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#050505] to-transparent sm:w-24" />

      <div className="mx-auto mb-8 flex w-full max-w-[1600px] flex-col gap-4 px-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-9">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-4 py-2 text-sm text-brand-gold">
            <Quote className="h-4 w-4" />
            Client stories
          </div>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-white sm:text-4xl">
            What our clients say
          </h2>
          <p className="mt-3 max-w-xl text-base text-white/70">
            Real handovers. Real families. Trust earned one delivery at a time.
          </p>
        </div>
        <Link
          href="/reviews"
          className="btn-micro inline-flex items-center gap-2 self-start rounded-full border border-brand-line px-5 py-3 text-base font-semibold text-white hover:border-brand-gold/60 hover:text-brand-gold sm:self-auto"
        >
          All reviews
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="group relative">
        <div className="review-marquee flex w-max gap-4 px-4 sm:gap-5 sm:px-6">
          {loop.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="w-[min(86vw,340px)] shrink-0 sm:w-[360px]"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
