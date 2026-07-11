'use client';

import Image from 'next/image';
import { useState } from 'react';
import { loginAdmin } from '@/actions/auth';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError('');
    const result = await loginAdmin(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-black px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      </div>

      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111111]/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-brand-gold/40 bg-black shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <Image
              src="/qzero-logo.png"
              alt="QZERO International"
              width={50}
              height={50}
              className="object-contain"
            />
          </span>
          <div>
            <p className="text-xl font-bold tracking-tight text-white">QZERO Admin</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-base font-semibold text-brand-gold">
              <ShieldCheck className="h-4 w-4" />
              Secure showroom access
            </p>
          </div>
        </div>

        <p className="mt-6 text-base font-medium leading-relaxed text-brand-muted">
          Sign in to manage inventory, inquiries, promotions, and site settings.
        </p>

        <form action={handleSubmit} className="mt-8 grid gap-5">
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 text-base font-medium text-red-200">
              {error}
            </div>
          )}

          <label className="grid gap-2 text-base font-semibold text-brand-muted">
            Email
            <input
              name="email"
              required
              className="h-14 rounded-xl border border-white/10 bg-black/80 px-4 text-base font-medium text-white outline-none transition-all placeholder:text-brand-muted/50 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              type="email"
              placeholder="admin@qzero.lk"
              defaultValue="admin@qzero.lk"
            />
          </label>
          <label className="grid gap-2 text-base font-semibold text-brand-muted">
            Password
            <input
              name="password"
              required
              className="h-14 rounded-xl border border-white/10 bg-black/80 px-4 text-base font-medium text-white outline-none transition-all placeholder:text-brand-muted/50 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              type="password"
              placeholder="••••••••"
              defaultValue="qzero123"
            />
          </label>
          <button
            disabled={isLoading}
            className="mt-2 flex h-14 items-center justify-center rounded-full text-base font-bold text-black gold-gradient shadow-[0_12px_32px_rgba(212,175,55,0.25)] transition-all hover:opacity-95 disabled:opacity-70"
            type="submit"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in securely'}
          </button>
        </form>
      </section>
    </main>
  );
}
