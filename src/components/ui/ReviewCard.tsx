'use client';

import Image from 'next/image';
import { BadgeCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReviewView } from '@/types/review';

type ReviewCardProps = {
  review: ReviewView;
  className?: string;
  /** Center / active slide gets fuller presence */
  emphasized?: boolean;
  interactive?: boolean;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 transition-opacity duration-500 sm:h-4 sm:w-4 ${
            i < rating
              ? 'fill-[#D4AF37] text-[#D4AF37] opacity-100'
              : 'text-white/15 opacity-60'
          }`}
          style={{ transitionDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}

export default function ReviewCard({
  review,
  className = '',
  emphasized = true,
  interactive = true,
}: ReviewCardProps) {
  const initial = review.clientName.trim().charAt(0).toUpperCase() || 'Q';

  return (
    <motion.article
      whileHover={
        interactive
          ? {
              y: -8,
              scale: 1.02,
              transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            }
          : undefined
      }
      className={`group/card relative cursor-pointer overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-white/[0.04] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-[border-color,box-shadow] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#D4AF37]/70 hover:shadow-[0_24px_60px_rgba(212,175,55,0.14)] sm:p-8 ${
        emphasized ? 'opacity-100' : 'opacity-80'
      } ${className}`}
    >
      {/* Soft gold edge glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-350 group-hover/card:opacity-100"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.35)',
        }}
      />

      {/* Subtle shimmer sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-none group-hover/card:animate-[review-shimmer_1.1s_ease-out]"
      />

      <div className="relative flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#D4AF37]/45 bg-black/50 shadow-[0_0_20px_rgba(212,175,55,0.12)]">
          {review.imageUrl ? (
            <Image
              src={review.imageUrl}
              alt={review.clientName}
              fill
              className="object-cover transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-105"
              sizes="56px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-display)] text-xl font-bold text-[#D4AF37]">
              {initial}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">
              {review.clientName}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#D4AF37]">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </span>
          </div>
          <p className="mt-1 truncate text-sm font-medium tracking-wide text-[#D4AF37]/90">
            {review.vehicleName}
          </p>
        </div>
      </div>

      <div className="relative mt-5">
        <Stars rating={review.rating} />
      </div>

      <p className="relative mt-5 text-[0.98rem] font-medium leading-[1.75] tracking-[0.01em] text-white/72">
        “{review.reviewText}”
      </p>
    </motion.article>
  );
}
