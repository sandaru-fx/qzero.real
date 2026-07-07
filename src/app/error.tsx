'use client'

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black px-4 py-16 text-center">
      <div className="max-w-md rounded-lg border border-brand-line bg-brand-card p-8">
        <p className="text-sm font-semibold text-brand-gold">QZERO International</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Something went wrong</h1>
        <p className="mt-4 text-sm leading-6 text-brand-muted">
          The page could not load correctly. Try again or return to the showroom.
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded-full px-6 py-3 text-sm font-semibold text-black gold-gradient transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
