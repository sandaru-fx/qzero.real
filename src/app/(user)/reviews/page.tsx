import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import { getReviews } from '@/actions/review';
import ReviewCard from '@/components/ui/ReviewCard';
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(212,175,55,0.12),transparent_50%)]" />
        <div className={`relative ${SITE_SHELL} py-16 sm:py-20`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-white/5 px-4 py-2 text-sm text-brand-gold backdrop-blur-md">
            <Quote className="h-4 w-4" />
            Testimonials
          </div>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            What our clients say
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Honest feedback from buyers who trusted QZERO with their next vehicle — from first inquiry
            to the keys in hand.
          </p>
        </div>
      </section>

      <section className={`${SITE_SHELL} py-12 sm:py-16`}>
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
            <p className="text-lg font-semibold text-white">Reviews are being curated.</p>
            <p className="mt-2 text-white/60">Check back soon for client stories.</p>
            <Link
              href="/contact"
              className="btn-micro mt-6 inline-flex items-center gap-2 rounded-full gold-gradient px-6 py-3 text-sm font-bold text-black"
            >
              Talk to us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {reviews.map((review) => (
              <div key={review.id} className="mb-6 break-inside-avoid">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
