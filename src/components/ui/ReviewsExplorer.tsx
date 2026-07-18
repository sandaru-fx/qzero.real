'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReviewView } from '@/types/review';
import ReviewCard from '@/components/ui/ReviewCard';

type ReviewsExplorerProps = {
  reviews: ReviewView[];
};

type SortKey = 'newest' | 'oldest';

const selectClass =
  'w-full appearance-none rounded-xl border border-white/15 bg-black/60 py-3.5 pl-4 pr-11 text-base font-semibold text-white outline-none transition-all duration-300 hover:border-brand-gold/40 focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 sm:text-[1.05rem]';

function extractBrand(vehicleName: string) {
  const known = [
    'Range Rover',
    'Land Rover',
    'Mercedes-Benz',
    'Mercedes',
    'Land Cruiser',
    'Toyota',
    'BMW',
    'Porsche',
    'Lexus',
    'Audi',
    'Bentley',
    'Rolls-Royce',
  ];
  for (const brand of known) {
    if (vehicleName.toLowerCase().includes(brand.toLowerCase())) {
      if (brand === 'Mercedes') return 'Mercedes-Benz';
      if (brand === 'Land Cruiser') return 'Toyota';
      return brand;
    }
  }
  const parts = vehicleName.replace(/^\d{4}\s+/, '').split(/\s+/);
  return parts[0] || 'Other';
}

export default function ReviewsExplorer({ reviews }: ReviewsExplorerProps) {
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('all');
  const [rating, setRating] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const brands = useMemo(() => {
    const set = new Set(reviews.map((r) => extractBrand(r.vehicleName)));
    return Array.from(set).sort();
  }, [reviews]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = reviews.filter((r) => {
      if (brand !== 'all' && extractBrand(r.vehicleName) !== brand) return false;
      if (rating !== 'all' && r.rating < Number(rating)) return false;
      if (!q) return true;
      return (
        r.clientName.toLowerCase().includes(q) ||
        r.vehicleName.toLowerCase().includes(q) ||
        r.reviewText.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === 'newest' ? db - da : da - db;
    });

    return list;
  }, [reviews, query, brand, rating, sort]);

  if (!reviews.length) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/55 p-10 text-center backdrop-blur-md">
        <p className="text-lg font-semibold text-white">Reviews are being curated.</p>
        <p className="mt-2 text-white/60">Check back soon for client stories.</p>
        <Link
          href="/contact"
          className="group/btn mt-6 inline-flex items-center gap-2 text-base font-semibold text-brand-gold"
        >
          Talk to us
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-black/40 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6 lg:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(212,175,55,0.08),transparent_45%)]"
        />

        <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-brand-gold">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.22em]">Refine stories</span>
          </div>
          <p className="text-sm font-semibold text-white/45">
            Showing <span className="text-brand-gold">{filtered.length}</span> of {reviews.length}
          </p>
        </div>

        <div className="relative grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <label className="group relative block">
            <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40">
              Search
            </span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-brand-gold" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, vehicle, or keyword…"
                className="w-full rounded-xl border border-white/15 bg-black/60 py-3.5 pl-12 pr-4 text-base font-semibold text-white outline-none transition-all duration-300 placeholder:text-white/35 hover:border-brand-gold/40 focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 sm:text-[1.05rem]"
              />
            </span>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40">
                Brand
              </span>
              <span className="relative block">
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">All brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gold/80" />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40">
                Rating
              </span>
              <span className="relative block">
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4+ stars</option>
                  <option value="3">3+ stars</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gold/80" />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40">
                Sort
              </span>
              <span className="relative block">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className={selectClass}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gold/80" />
              </span>
            </label>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-lg text-white/50">No reviews match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8">
          {filtered.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.05, 0.25),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <ReviewCard review={review} size="page" className="h-full" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
