'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { readWishlistIds, toggleWishlistId } from '@/lib/wishlist';

export default function WishlistButton({
  vehicleId,
  title,
}: {
  vehicleId: string;
  title: string;
}) {
  const [active, setActive] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    setActive(readWishlistIds().includes(vehicleId));
  }, [vehicleId]);

  const toggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleWishlistId(vehicleId);
    setActive(next.includes(vehicleId));
    setBump(true);
    window.setTimeout(() => setBump(false), 320);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={active ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      aria-pressed={active}
      className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
        active
          ? 'border-brand-gold/50 bg-brand-gold/20 text-brand-gold'
          : 'border-white/15 bg-black/45 text-white/80 hover:border-brand-gold/40 hover:text-brand-gold'
      } ${bump ? 'micro-bump' : ''}`}
    >
      <Heart className={`h-4 w-4 ${active ? 'fill-current' : ''}`} />
    </button>
  );
}
