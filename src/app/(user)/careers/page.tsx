import Link from 'next/link';
import { ArrowRight, Briefcase, MapPin, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { getSiteConfig } from '@/actions/settings';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: 'Careers',
    description: `Join the ${siteConfig.name} team — careers in premium automotive sales and import services.`,
  };
}

const openings = [
  {
    title: 'Vehicle Sales Consultant',
    type: 'Full-time · Habarakada',
    description:
      'Guide clients through our premium showroom inventory and support test drive coordination.',
  },
  {
    title: 'Import Operations Coordinator',
    type: 'Full-time · Habarakada',
    description:
      'Manage sourcing, inspection reports, shipping updates, and customs documentation workflows.',
  },
  {
    title: 'Digital Marketing Executive',
    type: 'Full-time · Hybrid',
    description:
      'Grow our online presence, manage campaigns, and support the QZERO digital showroom experience.',
  },
];

export default async function CareersPage() {
  const siteConfig = await getSiteConfig();
  return (
    <div className="min-h-screen bg-brand-black">
      <section className="border-b border-white/5">
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-20 sm:px-6 lg:px-9">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">Careers</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Build the future of premium automotive retail
          </h1>
          <p className="type-body mt-6 max-w-2xl text-brand-muted">
            Join a team that values precision, client trust, and a refined brand experience across
            showroom and import operations.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-9">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-brand-card p-6">
            <Users className="h-6 w-6 text-brand-gold" />
            <p className="mt-4 text-lg font-semibold text-white">Collaborative culture</p>
            <p className="type-muted mt-2">Work with specialists across sales, imports, and operations.</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-brand-card p-6">
            <Briefcase className="h-6 w-6 text-brand-gold" />
            <p className="mt-4 text-lg font-semibold text-white">Growth opportunities</p>
            <p className="type-muted mt-2">Develop expertise in luxury automotive and global sourcing.</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-brand-card p-6">
            <MapPin className="h-6 w-6 text-brand-gold" />
            <p className="mt-4 text-lg font-semibold text-white">Habarakada based</p>
            <p className="type-muted mt-2">{siteConfig.contact.address.line2}</p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Open positions</h2>
          <div className="mt-8 grid gap-4">
            {openings.map((role) => (
              <article
                key={role.title}
                className="rounded-xl border border-white/5 bg-brand-card p-6 transition-colors hover:border-brand-gold/30"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{role.title}</h3>
                    <p className="mt-1 text-base font-semibold text-brand-gold">{role.type}</p>
                    <p className="type-muted mt-3">{role.description}</p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-gold/40 px-5 py-2.5 text-base font-semibold text-brand-gold transition-colors hover:bg-brand-gold/5"
                  >
                    Apply
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
