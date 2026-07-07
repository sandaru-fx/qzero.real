import { protectAdminRoute } from '@/lib/auth';

export default async function AdminSettingsPage() {
  await protectAdminRoute();

  return (
    <main className="min-h-screen bg-brand-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-brand-gold">Settings</p>
        <h1 className="mt-3 text-4xl font-semibold">Brand system</h1>
        <div className="mt-8 rounded-lg border border-brand-line bg-brand-card p-6">
          <h2 className="text-xl font-semibold">QZERO visual direction</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Swatch label="Jet black" value="#050505" className="bg-brand-black" />
            <Swatch label="Card black" value="#121212" className="bg-brand-card" />
            <Swatch label="Brand gold" value="#D4AF37" className="bg-brand-gold" />
          </div>
        </div>
      </div>
    </main>
  );
}

function Swatch({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className="rounded-lg border border-brand-line bg-black p-4">
      <div className={`h-16 rounded-md border border-white/10 ${className}`} />
      <p className="mt-4 font-semibold text-white">{label}</p>
      <p className="mt-1 text-sm text-brand-muted">{value}</p>
    </div>
  );
}
