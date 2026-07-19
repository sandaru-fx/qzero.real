'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import TrackedWhatsAppLink from '@/components/TrackedWhatsAppLink';

type StickyVehicleCtaProps = {
  whatsappUrl: string;
  contactHref: string;
  title: string;
  vehicleSlug: string;
};

export default function StickyVehicleCta({
  whatsappUrl,
  contactHref,
  title,
  vehicleSlug,
}: StickyVehicleCtaProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/85 p-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-[1600px] gap-2">
        <TrackedWhatsAppLink
          href={whatsappUrl}
          source="vehicle_inquire"
          vehicleSlug={vehicleSlug}
          className="flex flex-1 items-center justify-center gap-2 rounded-full gold-gradient px-4 py-3.5 text-sm font-bold text-black"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </TrackedWhatsAppLink>
        <Link
          href={contactHref}
          className="flex flex-1 items-center justify-center rounded-full border border-white/20 px-4 py-3.5 text-sm font-bold text-white"
        >
          Inquire
        </Link>
      </div>
      <p className="sr-only">Quick actions for {title}</p>
    </div>
  );
}
