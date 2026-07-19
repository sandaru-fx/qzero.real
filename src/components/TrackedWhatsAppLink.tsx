'use client';

import type { ReactNode, MouseEvent } from 'react';
import { trackWhatsAppClick } from '@/actions/whatsapp-clicks';
import type { WhatsAppClickSource } from '@/types/whatsapp-click';

type TrackedWhatsAppLinkProps = {
  href: string;
  source: WhatsAppClickSource;
  vehicleSlug?: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

/**
 * Opens WhatsApp in a new tab and records the click for admin dashboard stats.
 * Tracking is fire-and-forget so it never blocks the customer.
 */
export default function TrackedWhatsAppLink({
  href,
  source,
  vehicleSlug,
  className,
  ariaLabel,
  children,
}: TrackedWhatsAppLinkProps) {
  const handleClick = (_e: MouseEvent<HTMLAnchorElement>) => {
    void trackWhatsAppClick({ source, vehicleSlug });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
