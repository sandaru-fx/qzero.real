'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import VehicleCard from '@/components/VehicleCard';
import { getVehiclesByIds } from '@/actions/search';
import { readWishlistIds, writeWishlistIds } from '@/lib/wishlist';
import type { VehicleView } from '@/types/vehicle';
import { SITE_SHELL } from '@/config/layout';

export default function WishlistClient() {
  const [vehicles, setVehicles] = useState<VehicleView[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  const load = () => {
    const ids = readWishlistIds();
    if (!ids.length) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    startTransition(async () => {
      const rows = await getVehiclesByIds(ids);
      // Drop missing IDs from storage
      const found = new Set(rows.map((v) => v._id));
      const cleaned = ids.filter((id) => found.has(id));
      if (cleaned.length !== ids.length) writeWishlistIds(cleaned);
      setVehicles(rows);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
    const onChange = () => load();
    window.addEventListener('qzero-wishlist-change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('qzero-wishlist-change', onChange);
      window.removeEventListener('storage', onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-brand-black">
      <div className={`${SITE_SHELL} py-12 sm:py-16`}>
        <p className="type-eyebrow text-brand-gold">Saved for later</p>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Your Wishlist</h1>
        <p className="type-muted mt-4 max-w-2xl">
          Vehicles you save with the heart icon appear here — revisit them anytime on this device.
        </p>

        {loading || pending ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-white/5 bg-brand-card">
                <div className="aspect-[4/3] shimmer" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 rounded-full shimmer" />
                  <div className="h-6 w-2/3 rounded-full shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-brand-card/50 px-6 py-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-brand-gold/70" />
            <h2 className="mt-4 text-2xl font-bold text-white">No saved vehicles yet</h2>
            <p className="type-muted mt-2">
              Browse the showroom and tap the heart on any listing to save it here.
            </p>
            <Link
              href="/vehicles"
              className="btn-micro mt-8 inline-flex rounded-full gold-gradient px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-black"
            >
              Browse Showroom
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
