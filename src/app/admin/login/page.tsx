import Image from 'next/image';

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-brand-line bg-brand-card p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-brand-gold/40 bg-black">
            <Image src="/qzero-logo.png" alt="QZERO International" width={50} height={50} className="object-contain" />
          </span>
          <div>
            <p className="font-semibold text-white">QZERO Admin</p>
            <p className="text-sm text-brand-gold">Secure showroom access</p>
          </div>
        </div>

        <form className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm text-brand-muted">
            Email
            <input className="h-12 rounded-full border border-brand-line bg-black px-4 text-white outline-none focus:border-brand-gold" type="email" placeholder="admin@qzero.lk" />
          </label>
          <label className="grid gap-2 text-sm text-brand-muted">
            Password
            <input className="h-12 rounded-full border border-brand-line bg-black px-4 text-white outline-none focus:border-brand-gold" type="password" placeholder="••••••••" />
          </label>
          <button className="mt-2 rounded-full px-6 py-3 text-sm font-semibold text-black gold-gradient" type="button">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
