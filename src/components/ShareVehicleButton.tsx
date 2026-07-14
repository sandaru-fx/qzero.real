'use client';

import { useState } from 'react';
import { Link2, MessageCircle, Check } from 'lucide-react';

type ShareVehicleButtonProps = {
  title: string;
  slug: string;
  whatsappUrl: string;
};

const secondaryBtn =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-base font-semibold text-white transition-colors hover:border-brand-gold/50 hover:text-brand-gold';

export default function ShareVehicleButton({ title, slug, whatsappUrl }: ShareVehicleButtonProps) {
  const [copied, setCopied] = useState(false);

  const pageUrl =
    typeof window !== 'undefined'
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
    <>
      <button type="button" onClick={handleCopyLink} className={secondaryBtn}>
        {copied ? <Check className="h-4 w-4 text-brand-gold" /> : <Link2 className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy Link'}
      </button>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={secondaryBtn}
        aria-label={`Share ${title} on WhatsApp`}
      >
        <MessageCircle className="h-4 w-4" />
        Share
      </a>
    </>
  );
}
