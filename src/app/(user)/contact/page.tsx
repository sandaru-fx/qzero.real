import Link from 'next/link';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

const contacts = [
  { icon: Phone, label: 'Call', value: '+94 70 000 0000', href: 'tel:+94700000000' },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Start a consultation', href: 'https://wa.me/94700000000' },
  { icon: Mail, label: 'Email', value: 'info@qzerointernational.com', href: 'mailto:info@qzerointernational.com' },
  { icon: MapPin, label: 'Location', value: 'Colombo, Sri Lanka', href: '#' },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Contact</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Start your showroom or import request.</h1>
          <p className="mt-5 leading-8 text-brand-muted">
            Share the vehicle you need, your budget range, and preferred timeline. QZERO can guide the next step.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {contacts.map((item) => (
            <Link key={item.label} href={item.href} className="rounded-lg border border-brand-line bg-brand-card p-6 transition-colors hover:border-brand-gold/50">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/40 bg-black">
                <item.icon className="h-5 w-5 text-brand-gold" />
              </span>
              <p className="mt-6 text-sm text-brand-muted">{item.label}</p>
              <p className="mt-2 font-semibold text-white">{item.value}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
