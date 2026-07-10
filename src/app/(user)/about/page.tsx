import { BadgeCheck, CircleDot, Globe2, Users, Award, Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${siteConfig.name} — premium automotive showroom and import partner in Sri Lanka.`,
};

const values = [
  {
    icon: BadgeCheck,
    title: 'Curated quality',
    copy: 'Every listing is selected, verified, and presented with restraint for serious buyers.',
  },
  {
    icon: Globe2,
    title: 'Import clarity',
    copy: 'A clear path from global sourcing to inspection, shipping, clearance, and delivery.',
  },
  {
    icon: CircleDot,
    title: 'Premium identity',
    copy: 'A quiet black-and-gold interface built around confidence, clarity, and trust.',
  },
];

const milestones = [
  { year: '2018', label: 'Founded in Colombo with a focus on premium imports' },
  { year: '2021', label: 'Expanded sourcing network across Japan, UK, and Australia' },
  { year: '2024', label: 'Launched digital showroom with full inventory transparency' },
];

const trustPoints = [
  { icon: Award, label: 'Verified vehicle records' },
  { icon: Users, label: 'Dedicated concierge team' },
  { icon: Building2, label: 'Colombo showroom experience' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">About QZERO</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            A premium automotive experience, online and offline.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-muted">
            {siteConfig.name} is a high-end showroom and import partner for buyers who expect clear
            information, fast browsing, and a refined brand experience from first inquiry to final
            handover.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-xl border border-white/5 bg-brand-card p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/40 bg-black">
                <value.icon className="h-5 w-5 text-brand-gold" />
              </span>
              <h2 className="mt-6 text-xl font-semibold text-white">{value.title}</h2>
              <p className="mt-3 text-sm leading-6 text-brand-muted">{value.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-brand-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Our story</p>
          <h2 className="mt-4 text-3xl font-bold text-white">Built for discerning buyers</h2>
          <p className="mt-4 max-w-3xl leading-7 text-brand-muted">
            We combine global auction access, certified inspection, and white-glove delivery into one
            premium workflow. Whether you are browsing our Colombo showroom or sourcing a specific
            vehicle from overseas, QZERO keeps the process transparent and efficient.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {milestones.map((item) => (
              <div key={item.year} className="rounded-xl border border-white/5 bg-black p-6">
                <p className="text-2xl font-bold gold-text">{item.year}</p>
                <p className="mt-3 text-sm leading-6 text-brand-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Why QZERO</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {trustPoints.map((point) => (
            <div
              key={point.label}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-brand-card p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/30 bg-black">
                <point.icon className="h-4 w-4 text-brand-gold" />
              </span>
              <p className="text-sm font-semibold text-white">{point.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
