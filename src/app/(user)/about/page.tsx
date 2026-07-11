import Image from 'next/image';
import { BadgeCheck, CircleDot, Globe2, Users, Award, Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import LifestyleHero from '@/components/LifestyleHero';
import { getSiteConfig } from '@/actions/settings';
import { lifestyleImages } from '@/data/lifestyle';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: 'About',
    description: `Learn about ${siteConfig.name} — premium automotive showroom and import partner in Sri Lanka.`,
  };
}

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
    title: 'People first',
    copy: 'We guide families and professionals with the same care — trust, safety, and clear advice.',
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

export default async function AboutPage() {
  const siteConfig = await getSiteConfig();

  return (
    <div className="min-h-screen bg-brand-black">
      <LifestyleHero
        image={lifestyleImages.aboutHero}
        breadcrumbs="HOME  |  ABOUT US"
        eyebrow="About QZERO"
        title="A premium automotive experience, online and offline."
        description={`${siteConfig.name} is a high-end showroom and import partner for buyers who expect clear information, trusted guidance, and a refined experience from first inquiry to final handover.`}
        objectPosition="center 30%"
      />

      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-9">
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

      {/* Family happiness — not Vision/Mission copy */}
      <section className="relative min-h-[70svh] overflow-hidden border-y border-white/5">
        <Image
          src={lifestyleImages.aboutFamily}
          alt="A happy family with their new vehicle"
          fill
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/30 to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,0.14),transparent_50%)]" />

        <div className="relative z-10 mx-auto flex min-h-[70svh] w-full max-w-[1600px] items-end px-4 py-16 sm:px-6 lg:px-9 lg:py-24">
          <div className="max-w-2xl">
            <p className="type-eyebrow text-brand-gold">What drives us</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Every journey should feel safe — and shared.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              We believe a vehicle is more than metal and mileage. It is school runs, weekend escapes,
              and the quiet confidence of knowing your family is protected on the road. At QZERO, we
              help you choose with care — so every drive home feels joyful, secure, and truly yours.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-brand-card">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Our story</p>
          <h2 className="mt-4 text-3xl font-bold text-white">Built for discerning buyers</h2>
          <p className="mt-4 max-w-3xl leading-7 text-brand-muted">
            We combine global auction access, certified inspection, and white-glove delivery into one
            premium workflow. Whether you are browsing our Colombo showroom with family or sourcing a
            specific vehicle from overseas, QZERO keeps the process transparent and human.
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

      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-9">
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
