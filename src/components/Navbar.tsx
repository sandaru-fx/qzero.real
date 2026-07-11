import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { getSiteConfig } from '@/actions/settings';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Showroom' },
  { href: '/import', label: 'Import' },
  { href: '/promotions', label: 'Promotions' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default async function Navbar() {
  const siteConfig = await getSiteConfig();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-brand-black/90 backdrop-blur-xl">
      <nav className="flex w-full flex-col gap-3 py-3 sm:h-20 sm:flex-row sm:items-stretch sm:gap-0 sm:py-0">
        <div className="flex flex-1 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="QZERO International home">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-gold/40 bg-black">
              <Image
                src="/qzero-logo.png"
                alt="QZERO International"
                width={44}
                height={44}
className="h-10 w-10 object-contain"
                priority
              />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-sm font-bold uppercase tracking-[0.22em] text-white">QZERO</span>
              <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
                International
              </span>
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap px-3 py-2.5 text-center text-[15px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:text-brand-gold lg:px-4 lg:text-base"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="grid flex-1 grid-cols-6 gap-1 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap py-2 text-center text-[10px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:text-brand-gold sm:text-[11px]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <a
          href={`tel:${siteConfig.contact.phoneTel}`}
          className="ml-auto inline-flex h-14 shrink-0 items-center justify-center gap-2.5 gold-gradient px-5 text-black transition-opacity hover:opacity-90 sm:ml-0 sm:h-auto sm:self-stretch sm:px-6 lg:px-8"
        >
          <Phone className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          <span className="flex flex-col items-start leading-none">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em]">Call Us Now</span>
            <span className="mt-1 text-sm font-bold tracking-wide sm:text-[15px]">
              {siteConfig.contact.phone}
            </span>
          </span>
        </a>
      </nav>
    </header>
  );
}
