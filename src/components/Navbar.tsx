import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { getSiteConfig } from '@/actions/settings';
import NavLinks from '@/components/NavLinks';
import MobileNav from '@/components/MobileNav';

export default async function Navbar() {
  const siteConfig = await getSiteConfig();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl supports-[backdrop-filter]:bg-black/25">
      <nav className="flex w-full items-stretch">
        <div className="flex flex-1 items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-0 lg:px-8 lg:h-[88px]">
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
            <span className="leading-none">
              <span className="block text-sm font-bold uppercase tracking-[0.22em] text-white">QZERO</span>
              <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
                International
              </span>
            </span>
          </Link>

          <NavLinks />
          <MobileNav phone={siteConfig.contact.phone} phoneTel={siteConfig.contact.phoneTel} />
        </div>

        <a
          href={`tel:${siteConfig.contact.phoneTel}`}
          className="ml-auto hidden items-center justify-center gap-2.5 gold-gradient px-6 text-black transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_12px_30px_rgba(212,175,55,0.35)] active:translate-y-0 active:scale-[0.98] sm:inline-flex sm:self-stretch lg:px-8"
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
