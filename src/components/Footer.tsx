import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-brand-line bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-brand-gold/40 bg-brand-black">
              <Image src="/qzero-logo.png" alt="QZERO International" width={50} height={50} className="object-contain" />
            </span>
            <div>
              <p className="font-semibold text-white">QZERO International</p>
              <p className="text-sm text-brand-gold">Premium showroom and imports</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-brand-muted">
            Curated premium vehicles, transparent import guidance, and a faster digital showroom experience.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <div className="mt-4 grid gap-3 text-sm text-brand-muted">
            <Link href="/vehicles" className="hover:text-brand-gold">Showroom</Link>
            <Link href="/about" className="hover:text-brand-gold">About</Link>
            <Link href="/privacy" className="hover:text-brand-gold">Privacy</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <div className="mt-4 grid gap-3 text-sm text-brand-muted">
            <a href="tel:+94700000000" className="hover:text-brand-gold">+94 70 000 0000</a>
            <a href="mailto:info@qzerointernational.com" className="hover:text-brand-gold">
              info@qzerointernational.com
            </a>
            <span>Colombo, Sri Lanka</span>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-line px-4 py-5 text-center text-xs text-brand-muted">
        © {new Date().getFullYear()} QZERO International. All rights reserved.
      </div>
    </footer>
  );
}
