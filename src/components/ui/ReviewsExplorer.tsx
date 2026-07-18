'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReviewView } from '@/types/review';
import ReviewCard from '@/components/ui/ReviewCard';

type ReviewsExplorerProps = {
  reviews: ReviewView[];
};

type SortKey = 'newest' | 'oldest';

const filterControlClass =
  'rounded-full border border-white/15 bg-[#0a0a0a] px-5 py-4 text-base font-semibold text-white outline-none transition-colors focus:border-brand-gold/50 sm:text-lg';

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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, vehicle, or keyword…"
            className="w-full rounded-full border border-white/15 bg-black/40 py-4 pl-14 pr-5 text-base font-semibold text-white outline-none transition-colors placeholder:text-white/40 focus:border-brand-gold/50 sm:text-lg"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto lg:min-w-[34rem]">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={filterControlClass}
          >
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className={filterControlClass}
          >
            <option value="all">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={filterControlClass}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
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
