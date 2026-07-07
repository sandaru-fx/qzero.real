import { BadgeCheck, CircleDot, Globe2 } from 'lucide-react';

const values = [
  { icon: BadgeCheck, title: 'Curated quality', copy: 'Every listing should feel selected, verified, and presented with restraint.' },
  { icon: Globe2, title: 'Import clarity', copy: 'Buyers get a clear path from sourcing to inspection, shipping, clearance, and delivery.' },
  { icon: CircleDot, title: 'Premium identity', copy: 'The circular Q mark leads a quiet black-and-gold interface with confident spacing.' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-brand-gold">About QZERO</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">A premium automotive experience, online and offline.</h1>
        <p className="mt-5 leading-8 text-brand-muted">
          QZERO International is designed as a high-end showroom and import partner for buyers who expect clear information,
          fast browsing, and a refined brand experience.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-lg border border-brand-line bg-brand-card p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/40 bg-black">
              <value.icon className="h-5 w-5 text-brand-gold" />
            </span>
            <h2 className="mt-6 text-xl font-semibold text-white">{value.title}</h2>
            <p className="mt-3 text-sm leading-6 text-brand-muted">{value.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
