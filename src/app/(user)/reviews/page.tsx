import type { Metadata } from 'next';
import { Quote } from 'lucide-react';
import { getReviews } from '@/actions/review';
import ReviewsExplorer from '@/components/ui/ReviewsExplorer';
import { SITE_SHELL } from '@/config/layout';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'What QZERO International clients say about their showroom experience, vehicle handover, and concierge support.',
};

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="min-h-screen bg-brand-black">
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-black via-[#0a0a0a] to-brand-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className={`relative ${SITE_SHELL} py-16 sm:py-20`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-white/[0.03] px-4 py-2 text-sm text-[#D4AF37] backdrop-blur-md">
            <Quote className="h-4 w-4" />
            Testimonials
          </div>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            What our clients say
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/70 sm:text-lg">
            Honest feedback from buyers who trusted QZERO with their next vehicle — from first inquiry
            to the keys in hand.
          </p>
        </div>
      </section>

      <section className={`${SITE_SHELL} py-12 sm:py-16`}>
        <ReviewsExplorer reviews={reviews} />
      </section>
    </div>
  );
}
