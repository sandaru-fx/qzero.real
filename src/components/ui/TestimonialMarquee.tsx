import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import type { ReviewView } from '@/types/review';
import ReviewCard from '@/components/ui/ReviewCard';

type TestimonialMarqueeProps = {
  reviews: ReviewView[];
};

export default function TestimonialMarquee({ reviews }: TestimonialMarqueeProps) {
  if (!reviews.length) return null;

  // Two identical sequences → seamless -50% loop
  const sequence = reviews.length === 1 ? [reviews[0], reviews[0], reviews[0]] : reviews;
  const loop = [...sequence, ...sequence];

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-b from-[#050505] via-black to-[#050505] py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.08),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#050505] to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#050505] to-transparent sm:w-28" />

      <div className="relative mx-auto mb-8 flex w-full max-w-[1600px] flex-col gap-4 px-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-9">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-white/5 px-4 py-2 text-sm text-brand-gold backdrop-blur-md">
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
          className="btn-micro inline-flex items-center gap-2 self-start rounded-full border border-brand-line bg-white/5 px-5 py-3 text-base font-semibold text-white backdrop-blur-md hover:border-brand-gold/60 hover:text-brand-gold sm:self-auto"
        >
          All reviews
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Infinite marquee — pauses while hovered */}
      <div className="group relative z-10 overflow-hidden">
        <div className="animate-marquee flex w-max gap-6 pr-6 group-hover:[animation-play-state:paused]">
          {loop.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="w-[min(88vw,360px)] shrink-0 sm:w-[380px]"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
