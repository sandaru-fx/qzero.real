import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const WHATSAPP_NUMBER = '94770000000';

const channels = [
  {
    icon: Phone,
    label: 'Call Concierge',
    value: '+94 77 000 0000',
    href: 'tel:+94770000000',
    description: 'Speak directly with our vehicle specialists',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp Inquiry',
    value: 'Start a Consultation',
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello QZERO International, I would like to inquire about your vehicles.')}`,
    description: 'Instant messaging — available 24/7',
  },
  {
    icon: Mail,
    label: 'Email Support',
    value: 'info@qzerointernational.com',
    href: 'mailto:info@qzerointernational.com',
    description: 'Detailed inquiries and documentation',
  },
];

const hours = [
  { day: 'Monday — Friday', time: '9:00 AM — 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM — 4:00 PM' },
  { day: 'Sunday', time: 'By Appointment' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-black">

      {/* ── Page Header ── */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">
            QZERO International
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-muted">
            Whether you&apos;re sourcing a specific vehicle or exploring our showroom inventory, our concierge team is ready to assist.
          </p>
        </div>
      </section>

      {/* ── Main 2-Column Layout ── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">

          {/* ── Left: Direct Connection Channels ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Direct Channels
            </p>
            <h2 className="mt-4 text-2xl font-bold text-white">Connect with our team</h2>

            <div className="mt-8 grid gap-4">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith('http') ? '_blank' : undefined}
                  rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex items-start gap-5 rounded-xl border border-white/5 bg-brand-card p-6 transition-all duration-300 hover:border-brand-gold/30 hover:shadow-lg hover:shadow-brand-gold/5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-black transition-colors group-hover:border-brand-gold/60">
                    <channel.icon className="h-5 w-5 text-brand-gold/70 transition-colors group-hover:text-brand-gold" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{channel.label}</p>
                    <p className="mt-1 text-sm font-semibold text-brand-gold">{channel.value}</p>
                    <p className="mt-1.5 text-xs text-brand-muted">{channel.description}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* ── Operating Hours ── */}
            <div className="mt-10">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-brand-gold/70" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
                  Operating Hours
                </p>
              </div>
              <div className="mt-4 grid gap-2">
                {hours.map((item) => (
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

          {/* ── Right: Showroom Location ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Showroom
            </p>
            <h2 className="mt-4 text-2xl font-bold text-white">Visit us</h2>

            {/* Location Card */}
            <div className="mt-8 overflow-hidden rounded-xl border border-white/5 bg-brand-card">
              {/* Map placeholder */}
              <div className="relative flex h-64 items-center justify-center bg-black/50">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-card">
                    <MapPin className="h-7 w-7 text-brand-gold/60" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">QZERO International</p>
                  <p className="mt-1 text-xs text-brand-muted">Showroom Location</p>
                </div>
              </div>

              {/* Address details */}
              <div className="border-t border-white/5 p-6">
                <p className="font-semibold text-white">QZERO International Pvt Ltd</p>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  No. 123, Marine Drive<br />
                  Colombo 03, Sri Lanka
                </p>
                <a
                  href="https://maps.google.com"
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

      {/* ── Brand Tagline Footer ── */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-muted">
            QZERO International
          </p>
          <p className="mt-2 text-sm text-brand-muted/60">
            Premium Automotive Showroom & Import Partner — Colombo, Sri Lanka
          </p>
        </div>
      </section>

    </div>
  );
}
