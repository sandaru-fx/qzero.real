'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { readWishlistIds } from '@/lib/wishlist';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Showroom' },
  { href: '/import', label: 'Import' },
  { href: '/promotions', label: 'Promotions' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/wishlist', label: 'Wishlist' },
];

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks() {
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const sync = () => setWishlistCount(readWishlistIds().length);
    sync();
    window.addEventListener('qzero-wishlist-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('qzero-wishlist-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return (
    <div className="hidden h-full flex-1 items-stretch justify-center gap-1 lg:flex xl:gap-2">
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);
        const isWishlist = item.href === '/wishlist';
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex h-full items-center gap-2 whitespace-nowrap px-4 text-[16px] font-bold uppercase tracking-[0.12em] transition-colors xl:px-5 xl:text-[17px] ${
              active
                ? 'bg-brand-gold text-black'
                : 'text-white hover:bg-white/5 hover:text-brand-gold'
            }`}
          >
            {isWishlist && <Heart className={`h-4 w-4 ${active ? 'fill-current' : ''}`} />}
            <span>{item.label}</span>
            {isWishlist && wishlistCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                  active ? 'bg-black/20 text-black' : 'bg-brand-gold/20 text-brand-gold'
                }`}
              >
                {wishlistCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
