import Image from 'next/image';
import { Star } from 'lucide-react';
import type { ReviewView } from '@/types/review';

type ReviewCardProps = {
  review: ReviewView;
  className?: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
            i < rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/20'
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewCard({ review, className = '' }: ReviewCardProps) {
  const initial = review.clientName.trim().charAt(0).toUpperCase() || 'Q';

  return (
    <article
      className={`rounded-2xl border border-[#D4AF37]/35 bg-white/[0.04] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#D4AF37]/45 bg-black">
          {review.imageUrl ? (
            <Image
              src={review.imageUrl}
              alt={review.clientName}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-display)] text-lg font-bold text-[#D4AF37]">
              {initial}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{review.clientName}</p>
          <p className="truncate text-xs text-[#D4AF37]/85 sm:text-sm">{review.vehicleName}</p>
        </div>
      </div>

      <div className="mt-4">
        <Stars rating={review.rating} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-[0.95rem]">
        “{review.reviewText}”
      </p>
    </article>
  );
}
