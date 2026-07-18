'use client';

import Image from 'next/image';
import { BadgeCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReviewView } from '@/types/review';

type ReviewCardProps = {
  review: ReviewView;
  className?: string;
  emphasized?: boolean;
  interactive?: boolean;
  size?: 'default' | 'page';
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem] ${
            i < rating ? 'fill-brand-gold text-brand-gold' : 'text-white/20'
          }`}
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
  size = 'default',
}: ReviewCardProps) {
  const initial = review.clientName.trim().charAt(0).toUpperCase() || 'Q';
  const isPage = size === 'page';

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
      className={`group/card relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/20 bg-black/55 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand-gold/70 hover:bg-black/65 hover:shadow-[0_28px_70px_rgba(0,0,0,0.65)] ${
        isPage ? 'min-h-[360px] p-9 sm:min-h-[400px] sm:p-11' : 'min-h-[280px] p-8 sm:min-h-[320px] sm:p-10'
      } ${emphasized ? 'opacity-100' : 'opacity-75'} ${className}`}
    >
      {/* Cool glass sheen — matches hero secondary button vibe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 group-hover/card:animate-[review-shimmer_1.1s_ease-out]"
      />

      <div className="relative flex items-start gap-4 sm:gap-5">
        <div
          className={`relative shrink-0 overflow-hidden rounded-full border border-white/25 bg-black shadow-[0_8px_24px_rgba(0,0,0,0.45)] ${
            isPage ? 'h-[4.75rem] w-[4.75rem] sm:h-20 sm:w-20' : 'h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]'
          }`}
        >
          {review.imageUrl ? (
            <Image
              src={review.imageUrl}
              alt={review.clientName}
              fill
              className="object-cover brightness-[1.06] contrast-[1.04] saturate-[0.95] transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-105"
              sizes="80px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-display)] text-2xl font-bold text-brand-gold">
              {initial}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`truncate font-semibold tracking-tight text-white ${
                isPage ? 'text-2xl sm:text-[1.65rem]' : 'text-xl sm:text-2xl'
              }`}
            >
              {review.clientName}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-brand-gold/50 bg-black/50 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-gold">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          </div>
          <p
            className={`mt-1.5 truncate font-semibold tracking-wide text-brand-gold ${
              isPage ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}
          >
            {review.vehicleName}
          </p>
        </div>
      </div>

      <div className="relative mt-6">
        <Stars rating={review.rating} />
      </div>

      <p
        className={`relative mt-5 flex-1 font-medium leading-[1.75] text-white ${
          isPage ? 'text-xl sm:text-[1.35rem] sm:leading-[1.8]' : 'text-lg sm:text-xl sm:leading-[1.8]'
        }`}
      >
        “{review.reviewText}”
      </p>
    </motion.article>
  );
}
