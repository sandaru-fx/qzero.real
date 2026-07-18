'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Showroom' },
  { href: '/promotions', label: 'Promotions' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden h-full flex-1 items-stretch justify-center gap-1 lg:flex xl:gap-2">
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);
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
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
