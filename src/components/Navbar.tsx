import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Showroom' },
  { href: '/import', label: 'Import' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-brand-black/90 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:h-20 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0 lg:px-8">
        <Link href="/" className="flex items-center justify-center gap-3 sm:justify-start" aria-label="QZERO International home">
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
            <span className="block text-sm font-semibold text-white tracking-wider">QZERO</span>
            <span className="mt-1 block text-xs font-medium text-brand-gold">International</span>
          </span>
        </Link>

        {/* 5-column grid for mobile now since we have 5 items */}
        <div className="grid w-full grid-cols-5 items-center gap-1 rounded-full border border-white/5 bg-brand-card/70 p-1 sm:flex sm:w-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-2 py-2 text-center text-xs font-medium text-brand-muted transition-colors hover:bg-white/5 hover:text-white sm:px-4 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/import"
          className="hidden rounded-full px-6 py-2.5 text-sm font-bold text-black gold-gradient shadow-lg shadow-brand-gold/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-gold/20 md:inline-flex"
        >
          Import Service
        </Link>
      </nav>
    </header>
  );
}
