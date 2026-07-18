'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReviewView } from '@/types/review';
import ReviewCard from '@/components/ui/ReviewCard';

type ReviewsExplorerProps = {
  reviews: ReviewView[];
};

type SortKey = 'newest' | 'oldest';

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

function AnimatedStat({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {value}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45">{label}</p>
    </motion.div>
  );
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

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

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
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-md">
        <p className="text-lg font-semibold text-white">Reviews are being curated.</p>
        <p className="mt-2 text-white/60">Check back soon for client stories.</p>
        <Link
          href="/contact"
          className="group/btn mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37]"
        >
          Talk to us
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 backdrop-blur-md sm:grid-cols-3 sm:px-10">
        <AnimatedStat value={`${average.toFixed(1)}`} label="Average rating" />
        <AnimatedStat
          value={`${reviews.length}+`}
          label="Verified buyers"
          delay={0.08}
        />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="flex items-center gap-1 text-[#D4AF37]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[#D4AF37]" />
            ))}
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
            Luxury standard
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, vehicle, or keyword…"
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm font-medium text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#D4AF37]/45"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="rounded-full border border-white/10 bg-[#0a0a0a] px-4 py-3.5 text-sm font-medium text-white outline-none focus:border-[#D4AF37]/45"
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
            className="rounded-full border border-white/10 bg-[#0a0a0a] px-4 py-3.5 text-sm font-medium text-white outline-none focus:border-[#D4AF37]/45"
          >
            <option value="all">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-white/10 bg-[#0a0a0a] px-4 py-3.5 text-sm font-medium text-white outline-none focus:border-[#D4AF37]/45"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-white/50">No reviews match your filters.</p>
      ) : (
        <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
          {filtered.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.06, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-6 break-inside-avoid"
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
