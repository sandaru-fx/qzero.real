import Image from 'next/image';
import { Clock, Mail, MapPin, MessageCircle, Phone, Globe } from 'lucide-react';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import ContactFaq from '@/components/ContactFaq';
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

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string; inquiry?: string }>;
}) {
  const siteConfig = await getSiteConfig();
  const params = await searchParams;
  const vehicleRef = params.vehicle?.trim() || '';
  const defaultInquiryType = params.inquiry?.trim() || (vehicleRef ? 'Vehicle Purchase' : 'General Inquiry');
  const defaultMessage = vehicleRef
    ? `Hello QZERO, I am interested in ${vehicleRef}. Please share availability, price, and next steps.`
    : '';

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
    {
      icon: Globe,
      label: 'Facebook',
      value: 'Follow QZERO',
      href: siteConfig.social.facebook,
      description: 'News, arrivals, and offers on Facebook',
    },
  ];

  const ownerWhatsAppDisplay = '+81 80-9566-1550';
  const ownerWhatsAppDigits = '818095661550';
  const managerWhatsAppDisplay = siteConfig.contact.phone;
  const managerWhatsAppDigits = siteConfig.contact.whatsapp;

  return (
    <div className="min-h-screen bg-brand-black">
      <LifestyleHero
        image={lifestyleImages.contactSide}
        breadcrumbs="HOME  |  CONTACT US"
        eyebrow={siteConfig.name}
        title="Get in Touch"
        description="Whether you're sourcing a specific vehicle or exploring our showroom with family, our concierge team is ready to assist — clearly and personally."
        objectPosition="center 18%"
        minHeight="sm:min-h-[80svh] lg:min-h-[85svh]"
        aside={
          <div className="ml-auto space-y-7 text-center sm:max-w-md sm:text-right lg:max-w-lg">
            <a
              href={buildWhatsAppUrl(
                ownerWhatsAppDigits,
                'Hello QZERO International (Owner), I would like to inquire about your vehicles.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-white/15 bg-black/45 px-5 py-5 backdrop-blur-md transition-colors hover:border-brand-gold/50 sm:px-7 sm:py-6"
            >
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-gold sm:text-base">
                Owner · WhatsApp
              </p>
              <p className="mt-3 font-[family-name:var(--font-luxury)] text-3xl font-semibold tracking-[0.02em] text-white transition-colors group-hover:text-brand-gold sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                {ownerWhatsAppDisplay}
              </p>
            </a>
            <a
              href={buildWhatsAppUrl(
                managerWhatsAppDigits,
                'Hello QZERO International (Manager), I would like to inquire about your vehicles.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-white/15 bg-black/45 px-5 py-5 backdrop-blur-md transition-colors hover:border-brand-gold/50 sm:px-7 sm:py-6"
            >
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-gold sm:text-base">
                Manager · WhatsApp
              </p>
              <p className="mt-3 font-[family-name:var(--font-luxury)] text-3xl font-semibold tracking-[0.02em] text-white transition-colors group-hover:text-brand-gold sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                {managerWhatsAppDisplay}
              </p>
            </a>
          </div>
        }
      >
        <div className="mt-8 max-w-md sm:mt-10 lg:mt-12">
          <div className="flex items-center justify-center gap-2.5 sm:justify-start">
            <Clock className="h-4 w-4 text-brand-gold" />
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-gold">
              Operating Hours
            </p>
          </div>
          <div className="mt-4 space-y-2.5">
            {siteConfig.contact.hours.map((item) => (
              <div
                key={item.day}
                className="flex items-baseline justify-between gap-6 border-b border-white/10 pb-2.5 last:border-0 last:pb-0"
              >
                <span className="text-base text-white/70 sm:text-lg">{item.day}</span>
                <span className="text-base font-semibold text-white sm:text-lg">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </LifestyleHero>

      <div className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-9">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
              Send a Message
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Contact form</h2>
            <div className="mt-8">
              <ContactForm
                whatsappNumber={siteConfig.contact.whatsapp}
                vehicleRef={vehicleRef}
                defaultInquiryType={defaultInquiryType}
                defaultMessage={defaultMessage}
              />
            </div>

            <div className="mt-12">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
                Direct Channels
              </p>
              <div className="mt-6 grid gap-4">
                {channels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-start gap-5 rounded-xl border border-white/5 bg-brand-card p-5 transition-all duration-300 hover:border-brand-gold/30 sm:p-6"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-black">
                      <channel.icon className="h-5 w-5 text-brand-gold/70 group-hover:text-brand-gold" />
                    </span>
                    <div>
                      <p className="text-base font-bold text-white sm:text-lg">{channel.label}</p>
                      <p className="mt-1.5 text-base font-semibold text-brand-gold sm:text-lg">
                        {channel.value}
                      </p>
                      <p className="type-muted mt-1.5">
                        {channel.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">Showroom</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Visit us</h2>

            <div className="mt-8 overflow-hidden rounded-xl border border-white/5 bg-brand-card">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={lifestyleImages.aboutFamily}
                  alt="Welcome to the QZERO showroom experience"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
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
                <p className="text-lg font-semibold text-white">{siteConfig.name} Pvt Ltd</p>
                <p className="type-muted mt-2">
                  {siteConfig.contact.address.line1}
                  <br />
                  {siteConfig.contact.address.line2}
                </p>
                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-base font-semibold text-white transition-all duration-300 hover:border-brand-gold/40 hover:text-brand-gold"
                >
                  <MapPin className="h-4 w-4" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactFaq />
    </div>
  );
}
