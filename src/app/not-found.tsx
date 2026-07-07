import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black px-4 py-16 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-brand-gold/40 bg-black">
          <Image src="/qzero-logo.png" alt="QZERO International" width={86} height={86} className="object-contain" />
        </div>
        <p className="mt-8 text-sm font-semibold text-brand-gold">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-brand-muted">The requested QZERO page does not exist or has moved.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-black gold-gradient">
          Back home
        </Link>
      </div>
    </main>
  );
}
