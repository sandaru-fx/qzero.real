import Link from 'next/link';
import { ArrowRight, Anchor, ClipboardCheck, Globe, Handshake } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Import Service',
  description:
    'Bespoke automotive sourcing from Japan, UK, and Australia — curated and delivered by QZERO International.',
};

const timeline = [
  {
    step: '01',
    title: 'Global Sourcing & Live Auction Access',
    description:
      'Direct access to premium vehicle auctions across Japan, UK, and Australia. Our specialists identify, bid, and secure your ideal vehicle from trusted global pipelines.',
    icon: Globe,
  },
  {
    step: '02',
    title: 'Multi-Point Certified Inspection',
    description:
      'Every vehicle undergoes a rigorous multi-point inspection by certified assessors. Comprehensive condition reports, auction grades, and transparent photographic documentation provided before commitment.',
    icon: ClipboardCheck,
  },
  {
    step: '03',
    title: 'Insured Cargo & Premium Ocean Freight',
    description:
      'Fully insured containerized or RoRo shipping through established freight corridors. Real-time tracking updates from port of origin to Colombo harbour.',
    icon: Anchor,
  },
  {
    step: '04',
    title: 'Custom Clearance & White-Glove Handover',
    description:
      'End-to-end customs documentation, duty calculation, and regulatory compliance handled by our in-house team. Your vehicle is delivered inspected, registered, and ready to drive.',
    icon: Handshake,
  },
];

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-brand-black">

      {/* ── Hero Section ── */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">
            QZERO Import Concierge
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Bespoke Automotive Sourcing
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
            A direct pipeline from the world&apos;s most trusted auction houses in Japan, the United Kingdom, and Australia — curated, inspected, and delivered to your doorstep with white-glove precision.
          </p>
        </div>
      </section>

      {/* ── Elite Timeline ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-0">
          {timeline.map((item, index) => (
            <div
              key={item.step}
              className={`grid gap-8 lg:grid-cols-[100px_1fr] ${
                index < timeline.length - 1 ? 'border-b border-white/5 pb-12 mb-12' : ''
              }`}
            >
              {/* Step Number Badge */}
              <div className="flex lg:justify-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-card">
                  <span className="text-lg font-bold gold-text">{item.step}</span>
                </div>
              </div>

              {/* Step Content */}
              <div className="rounded-xl border border-white/5 bg-brand-card p-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/20 bg-black">
                    <item.icon className="h-5 w-5 text-brand-gold/70" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{item.title}</h2>
                    <p className="mt-3 leading-7 text-brand-muted">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-white/5 bg-brand-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
            Ready to source your next vehicle?
          </p>
          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Let QZERO handle the entire journey.
          </h2>
          <p className="mt-4 max-w-xl text-brand-muted">
            From auction floor to your driveway — one premium workflow, zero complexity.
          </p>
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-2.5 rounded-full gold-gradient px-8 py-4 text-sm font-bold text-black shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-gold/40"
          >
            Start Your Import Inquiry
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

    </div>
  );
}
