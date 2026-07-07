import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-black px-4 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-brand-black to-brand-black"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">
          404 Error
        </p>
        <h1 className="mt-4 text-6xl font-bold tracking-tight text-white sm:text-8xl">
          Page Not Found
        </h1>
        <p className="mt-6 max-w-md text-lg text-brand-muted">
          The vehicle or page you are looking for is no longer available in our collection.
        </p>

        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-brand-card px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-gold/50 hover:bg-white/5 hover:text-brand-gold"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Return to Showroom
        </Link>
      </div>
    </div>
  );
}
