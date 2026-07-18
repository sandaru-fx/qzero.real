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
  const isPage = size === 'page';
  const hasBg = Boolean(review.imageUrl?.trim());

  const borderClasses = emphasized
    ? 'border-brand-gold shadow-[0_0_0_1px_rgba(212,175,55,0.45),0_24px_60px_rgba(0,0,0,0.55),0_0_28px_rgba(212,175,55,0.22)]'
    : 'border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.55)] hover:border-brand-gold hover:shadow-[0_0_0_1px_rgba(212,175,55,0.55),0_28px_70px_rgba(0,0,0,0.65),0_0_36px_rgba(212,175,55,0.28)]';

  return (
    <motion.article
      whileHover={
        interactive
          ? {
              y: -4,
              scale: 1.015,
              transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            }
          : undefined
      }
      className={`group/card relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 backdrop-blur-md transition-[border-color,box-shadow] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${borderClasses} ${
        hasBg ? 'bg-black' : 'bg-black/55 hover:bg-black/65'
      } ${
        isPage ? 'min-h-[380px] p-9 sm:min-h-[420px] sm:p-11' : 'min-h-[300px] p-8 sm:min-h-[340px] sm:p-10'
      } ${emphasized ? 'opacity-100' : 'opacity-75'} ${className}`}
    >
      {hasBg ? (
        <>
          <Image
            src={review.imageUrl}
            alt=""
            fill
            className="object-cover brightness-[1.12] contrast-[1.05] saturate-[1.05] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 420px"
          />
          {/* Light scrim — photo stays bright; soft fade only where text sits */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10"
          />
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-gold/[0.06] via-transparent to-transparent"
        />
      )}

      {/* Continuous gold edge on all 4 sides (including top) when active / hovered */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset transition-opacity duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          emphasized
            ? 'opacity-100 ring-brand-gold/80'
            : 'opacity-0 ring-brand-gold/0 group-hover/card:opacity-100 group-hover/card:ring-brand-gold/70'
        }`}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand-gold/[0.08] to-transparent opacity-0 group-hover/card:animate-[review-shimmer_1.1s_ease-out]"
      />

      <div className="relative min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`truncate font-semibold tracking-tight text-white ${
              isPage ? 'text-2xl sm:text-[1.65rem]' : 'text-xl sm:text-2xl'
            }`}
          >
            {review.clientName}
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full border border-brand-gold/50 bg-black/55 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-gold backdrop-blur-sm">
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
