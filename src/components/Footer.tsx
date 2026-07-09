'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Camera, CirclePlay, BriefcaseBusiness, Phone } from 'lucide-react';

/* ────────────────────────────────────────────
   Live Sri Lanka Clock Hook
   ──────────────────────────────────────────── */
function useSriLankaTime() {
  const [timeData, setTimeData] = useState<{ time: string; date: string } | null>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Colombo',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      const date = now.toLocaleDateString('en-US', {
        timeZone: 'Asia/Colombo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setTimeData({ time: time.toLowerCase(), date });
    };

    updateClock(); // Initialize immediately
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return timeData;
}

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Showroom', href: '/vehicles' },
  { label: 'Import Service', href: '/import' },
  { label: 'Promotions', href: '/vehicles' },
];

const infoLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
];

const socials = [
  { Icon: Globe, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: Camera, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: CirclePlay, href: 'https://youtube.com', label: 'YouTube' },
  { Icon: BriefcaseBusiness, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
  const sriLankaTime = useSriLankaTime();

  return (
    <footer className="bg-[#050505] border-t border-white/5 font-sans">
      {/* ── Top Section: 4-Column Grid ── */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Column 1 — Brand & Contact */}
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
              <p>Colombo 02, Sri Lanka</p>
            </div>
            
            <div className="flex flex-col gap-1 text-sm text-gray-400">
              <a
                href="mailto:info@qzerointernational.com"
                className="transition-all duration-300 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent w-fit"
              >
                info@qzerointernational.com
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
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

          {/* Column 3 — Information */}
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

          {/* Column 4 — Social Media */}
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

      {/* ── Bottom Section ── */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-8 text-sm sm:px-8 lg:flex-row lg:justify-between lg:px-10">
          
          {/* Left — Customer Care */}
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
                  href="tel:+94700000000"
                  className="text-sm font-bold text-white transition-all duration-300 hover:bg-[linear-gradient(135deg,#AA7C11_0%,#D4AF37_45%,#F3E5AB_100%)] hover:bg-clip-text hover:text-transparent"
                >
                  +94 70 000 0000
                </a>
              </span>
            </div>
          </div>

          {/* Center — Copyright */}
          <div className="text-center text-xs text-gray-500 lg:order-none order-last">
            Copyright &copy; {new Date().getFullYear()} QZERO International. All Rights Reserved.
          </div>

          {/* Right — Live Sri Lanka Time */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {sriLankaTime ? (
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold/50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                </span>
                <span className="font-mono tracking-tight">
                  {sriLankaTime.time} <span className="mx-1.5 text-white/20">|</span> Sri Lanka <span className="mx-1.5 text-white/20">|</span> {sriLankaTime.date}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gray-700 animate-pulse" />
                <span className="font-mono text-gray-600">Loading…</span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </footer>
  );
}
