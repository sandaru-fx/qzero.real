import Image from 'next/image';
import Link from 'next/link';
import { Globe, Camera, CirclePlay, BriefcaseBusiness, Phone } from 'lucide-react';
import { getSiteConfig } from '@/actions/settings';
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
    <footer className="bg-[#050505] border-t border-white/5 font-sans">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-block w-fit">
              <div className="flex items-center gap-3 group">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#121212] transition-colors duration-500 group-hover:border-brand-gold/50">
                  <Image
                    src="/qzero-logo.png"
                    alt="QZERO International"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-widest text-white transition-all duration-300 group-hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] group-hover:bg-clip-text group-hover:text-transparent">
                    QZERO
                  </h2>
                  <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">
                    International
                  </p>
                </div>
              </div>
            </Link>
            
            <div className="flex flex-col gap-1 text-sm text-gray-400">
              <p className="font-semibold text-white">Head Office</p>
              <p>{siteConfig.contact.address.line2}</p>
            </div>
            
            <div className="flex flex-col gap-1 text-sm text-gray-400">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="transition-all duration-300 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent w-fit"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-all duration-300 hover:translate-x-1 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Information
            </h3>
            <ul className="flex flex-col gap-4">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-all duration-300 hover:translate-x-1 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Connect
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Follow us to stay updated on our latest premium vehicles and exclusive offers.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#121212] transition-all duration-300 hover:border-brand-gold/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  <Icon className="h-4 w-4 text-gray-400 transition-colors duration-300 group-hover:text-brand-gold" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-8 text-sm sm:px-8 lg:flex-row lg:justify-between lg:px-10">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 text-gray-400 text-center sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#121212] border border-white/5">
              <Phone className="h-4 w-4 text-brand-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-gray-500">
                Customer Care Hotline
              </span>
              <span className="mt-0.5 text-xs text-gray-400">
                Mon to Fri - 8.30 am to 5.30 pm |{' '}
                <a
                  href={`tel:${siteConfig.contact.phoneTel}`}
                  className="text-sm font-bold text-white transition-all duration-300 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent"
                >
                  {siteConfig.contact.phone}
                </a>
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 lg:order-none order-last">
            Copyright &copy; {new Date().getFullYear()} QZERO International. All Rights Reserved.
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <LiveClock />
          </div>
          
        </div>
      </div>
    </footer>
  );
}
