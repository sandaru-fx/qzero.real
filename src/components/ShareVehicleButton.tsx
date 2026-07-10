'use client';

import { useState } from 'react';
import { Link2, MessageCircle, Check } from 'lucide-react';
import { buildWhatsAppUrl } from '@/config/site';

type ShareVehicleButtonProps = {
  title: string;
  slug: string;
};

export default function ShareVehicleButton({ title, slug }: ShareVehicleButtonProps) {
  const [copied, setCopied] = useState(false);

  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/vehicles/${slug}`
    : `/vehicles/${slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
      >
        {copied ? <Check className="h-4 w-4 text-brand-gold" /> : <Link2 className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy Link'}
      </button>
      <a
        href={buildWhatsAppUrl(`Check out this vehicle: ${title} — ${pageUrl}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
        aria-label={`Share ${title} on WhatsApp`}
      >
        <MessageCircle className="h-4 w-4" />
        Share
      </a>
    </div>
  );
}
