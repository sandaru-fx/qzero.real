import Image from 'next/image';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import LifestyleHero from '@/components/LifestyleHero';
import { buildWhatsAppUrl } from '@/config/site';
import { getSiteConfig } from '@/actions/settings';
import { lifestyleImages } from '@/data/lifestyle';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: 'Contact',
    description: `Get in touch with ${siteConfig.name} for vehicle inquiries and import services.`,
  };
}

export default async function ContactPage() {
  const siteConfig = await getSiteConfig();

  const channels = [
    {
      icon: Phone,
      label: 'Call Concierge',
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phoneTel}`,
      description: 'Speak directly with our vehicle specialists',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp Inquiry',
      value: 'Start a Consultation',
      href: buildWhatsAppUrl(
        siteConfig.contact.whatsapp,
        'Hello QZERO International, I would like to inquire about your vehicles.'
      ),
      description: 'Instant messaging — available 24/7',
    },
    {
      icon: Mail,
      label: 'Email Support',
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      description: 'Detailed inquiries and documentation',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-black">
      <LifestyleHero
        image={lifestyleImages.contactSide}
        breadcrumbs="HOME  |  CONTACT US"
        eyebrow={siteConfig.name}
        title="Get in Touch"
        description="Whether you're sourcing a specific vehicle or exploring our showroom with family, our concierge team is ready to assist — clearly and personally."
        objectPosition="center 40%"
        minHeight="min-h-[48svh] sm:min-h-[52svh]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-9">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Send a Message
            </p>
            <h2 className="mt-4 text-2xl font-bold text-white">Contact form</h2>
            <div className="mt-8">
              <ContactForm />
            </div>

            <div className="mt-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
                Direct Channels
              </p>
              <div className="mt-6 grid gap-4">
                {channels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-start gap-5 rounded-xl border border-white/5 bg-brand-card p-5 transition-all duration-300 hover:border-brand-gold/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-black">
                      <channel.icon className="h-4 w-4 text-brand-gold/70 group-hover:text-brand-gold" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{channel.label}</p>
                      <p className="mt-1 text-sm font-semibold text-brand-gold">{channel.value}</p>
                      <p className="mt-1 text-xs text-brand-muted">{channel.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-brand-gold/70" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
                  Operating Hours
                </p>
              </div>
              <div className="mt-4 grid gap-2">
                {siteConfig.contact.hours.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-brand-card px-4 py-3"
                  >
                    <span className="text-sm text-brand-muted">{item.day}</span>
                    <span className="text-sm font-semibold text-white">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Showroom</p>
            <h2 className="mt-4 text-2xl font-bold text-white">Visit us</h2>

            <div className="mt-8 overflow-hidden rounded-xl border border-white/5 bg-brand-card">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={lifestyleImages.aboutFamily}
                  alt="Welcome to the QZERO showroom experience"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              <div className="relative h-56 w-full border-t border-white/5">
                <iframe
                  title="QZERO International showroom location"
                  src={siteConfig.contact.mapsEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0 grayscale invert"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="border-t border-white/5 p-6">
                <p className="font-semibold text-white">{siteConfig.name} Pvt Ltd</p>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  {siteConfig.contact.address.line1}
                  <br />
                  {siteConfig.contact.address.line2}
                </p>
                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:border-brand-gold/40 hover:text-brand-gold"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
