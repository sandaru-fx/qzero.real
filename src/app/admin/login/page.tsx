'use client';

import Image from 'next/image';
import { useState } from 'react';
import { loginAdmin } from '@/actions/auth';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError('');
    const result = await loginAdmin(formData);
    
    // If successful, it redirects internally in the server action. 
    // If we reach here, it failed.
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-white/5 bg-brand-card p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-brand-gold/40 bg-black">
            <Image src="/qzero-logo.png" alt="QZERO International" width={50} height={50} className="object-contain" />
          </span>
          <div>
            <p className="text-xl font-bold tracking-tight text-white">QZERO Admin</p>
            <p className="text-sm font-semibold text-brand-gold">Secure showroom access</p>
          </div>
        </div>

        <form action={handleSubmit} className="mt-10 grid gap-5">
          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-950/30 p-3 text-sm font-medium text-red-200">
              {error}
            </div>
          )}

          <label className="grid gap-2 text-sm font-medium text-brand-muted">
            Email
            <input 
              name="email"
              required
              className="h-14 rounded-xl border border-white/10 bg-black px-4 text-white outline-none transition-colors focus:border-brand-gold" 
              type="email" 
              placeholder="admin@qzero.lk" 
              defaultValue="admin@qzero.lk"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-brand-muted">
            Password
            <input 
              name="password"
              required
              className="h-14 rounded-xl border border-white/10 bg-black px-4 text-white outline-none transition-colors focus:border-brand-gold" 
              type="password" 
              placeholder="••••••••" 
              defaultValue="qzero123"
            />
          </label>
          <button 
            disabled={isLoading}
            className="mt-4 flex h-14 items-center justify-center rounded-full text-sm font-bold text-black gold-gradient transition-opacity hover:opacity-90 disabled:opacity-70" 
            type="submit"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in securely'}
          </button>
        </form>
      </section>
    </main>
  );
}
