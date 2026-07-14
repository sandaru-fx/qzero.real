import Image from 'next/image';
import Link from 'next/link';
import { Globe, Camera, CirclePlay, BriefcaseBusiness, Phone } from 'lucide-react';
import { getSiteConfig } from '@/actions/settings';
import { lifestyleImages } from '@/data/lifestyle';
import LiveClock from './LiveClock';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Showroom', href: '/vehicles' },
  { label: 'Import Service', href: '/import' },
  { label: 'Promotions', href: '/promotions' },
];

const infoLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export default async function Footer() {
  const siteConfig = await getSiteConfig();

  const socials = [
    { Icon: Globe, href: siteConfig.social.facebook, label: 'Facebook' },
    { Icon: Camera, href: siteConfig.social.instagram, label: 'Instagram' },
    { Icon: CirclePlay, href: siteConfig.social.youtube, label: 'YouTube' },
    { Icon: BriefcaseBusiness, href: siteConfig.social.linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#050505] font-sans">
      {/* Lifestyle people + vehicles — feathered left (not inventory shots) */}
      <div className="footer-bg-mask pointer-events-none absolute inset-y-0 left-0 z-0 w-full max-w-3xl sm:w-[58%] lg:w-[52%]">
        <Image
          src={lifestyleImages.footer}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 52vw"
          className="object-cover object-[center_30%] opacity-80 sm:opacity-90"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(212,175,55,0.12),transparent_55%)]" />
      </div>

      {/* Soft gold ambient on the right so links stay premium */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_90%_20%,rgba(212,175,55,0.06),transparent_45%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-9 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-block w-fit">
              <div className="group flex items-center gap-3">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-gold/30 bg-black/70 shadow-[0_0_24px_rgba(212,175,55,0.12)] backdrop-blur-sm transition-colors duration-500 group-hover:border-brand-gold/60">
                  <Image
                    src="/qzero-logo.png"
                    alt="QZERO International"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="type-card-title text-white transition-all duration-300 group-hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] group-hover:bg-clip-text group-hover:text-transparent">
                    QZERO
                  </h2>
                  <p className="type-meta mt-1 uppercase text-brand-gold/80">International</p>
                </div>
              </div>
            </Link>

            <div className="flex flex-col gap-1 text-gray-300">
              <p className="type-meta font-semibold uppercase text-white">Head Office</p>
              <p className="type-muted text-gray-300/90">{siteConfig.contact.address.line1}</p>
              <p className="type-muted text-gray-300/90">{siteConfig.contact.address.line2}</p>
            </div>

            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="type-muted w-fit text-gray-300 transition-all duration-300 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent"
            >
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="flex flex-col space-y-6">
            <h3 className="type-eyebrow text-white">Quick Links</h3>
            <ul className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="type-muted inline-block text-gray-300 transition-all duration-300 hover:translate-x-1 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <h3 className="type-eyebrow text-white">Information</h3>
            <ul className="flex flex-col gap-4">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="type-muted inline-block text-gray-300 transition-all duration-300 hover:translate-x-1 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <h3 className="type-eyebrow text-white">Connect</h3>
            <p className="type-muted text-gray-300">
              Follow us for new arrivals, import updates, and exclusive offers.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 backdrop-blur-sm transition-all duration-300 hover:border-brand-gold/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  <Icon className="h-4 w-4 text-gray-400 transition-colors duration-300 group-hover:text-brand-gold" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-[2px]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-6 px-4 py-8 text-base sm:px-6 lg:flex-row lg:justify-between lg:px-9">
          <div className="flex flex-col items-center gap-3 text-center text-gray-400 sm:flex-row sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-black/70">
              <Phone className="h-4 w-4 text-brand-gold" />
            </div>
            <div className="flex flex-col">
              <span className="type-meta uppercase text-gray-500">Customer Care Hotline</span>
              <span className="type-meta mt-0.5 text-gray-400">
                {siteConfig.contact.hours[0]
                  ? `${siteConfig.contact.hours[0].day} — ${siteConfig.contact.hours[0].time}`
                  : 'Monday — Friday — 9:00 AM — 6:00 PM'}{' '}
                |{' '}
                <a
                  href={`tel:${siteConfig.contact.phoneTel}`}
                  className="font-bold text-white transition-all duration-300 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent"
                >
                  {siteConfig.contact.phone}
                </a>
              </span>
            </div>
          </div>

          <div className="type-meta order-last text-center text-gray-500 lg:order-none">
            Copyright &copy; {new Date().getFullYear()}{' '}
            <Link
              href="/admin/login"
              className="text-gray-500 no-underline transition-colors hover:text-brand-gold/80"
              aria-label="Staff login"
            >
              {siteConfig.name}
            </Link>
            . All Rights Reserved.
          </div>

          <div className="type-meta flex items-center gap-2 text-gray-500">
            <LiveClock />
          </div>
        </div>
      </div>
    </footer>
  );
}
