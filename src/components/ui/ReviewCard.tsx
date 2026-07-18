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
          className={`h-4 w-4 ${
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
      className={`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#D4AF37]/50 bg-black/40 shadow-[0_0_16px_rgba(212,175,55,0.12)]">
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
          <p className="truncate text-base font-semibold text-white">{review.clientName}</p>
          <p className="truncate text-sm text-[#D4AF37]/90">{review.vehicleName}</p>
        </div>
      </div>

      <div className="mt-4">
        <Stars rating={review.rating} />
      </div>

      <p className="mt-4 text-[0.95rem] font-medium leading-relaxed text-white/75">
        “{review.reviewText}”
      </p>
    </article>
  );
}
