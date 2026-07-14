'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Phone, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Showroom' },
  { href: '/international', label: 'International' },
  { href: '/promotions', label: 'Promotions' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

type MobileNavProps = {
  phone: string;
  phoneTel: string;
};

export default function MobileNav({ phone, phoneTel }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col border-l border-white/10 bg-[#0b0b0b] shadow-[-20px_0_60px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-brand-gold/40 bg-black">
                  <Image src="/qzero-logo.png" alt="" width={36} height={36} className="h-8 w-8 object-contain" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-white">QZERO</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
                    International
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white hover:text-brand-gold"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mb-1 flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-bold uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? 'bg-brand-gold text-black'
                        : 'text-white hover:bg-white/5 hover:text-brand-gold'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
              <a
                href={`tel:${phoneTel}`}
                className="btn-micro flex w-full items-center justify-center gap-2 rounded-full gold-gradient px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-black"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
