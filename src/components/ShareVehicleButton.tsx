'use client';

import { useState } from 'react';
import { Link2, MessageCircle, Check } from 'lucide-react';

type ShareVehicleButtonProps = {
  title: string;
  slug: string;
  whatsappUrl: string;
};

const secondaryBtn =
  'inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-white/20 px-7 text-lg font-semibold text-white transition-colors hover:border-brand-gold/50 hover:text-brand-gold sm:h-16 sm:px-9 sm:text-xl';

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
        {copied ? <Check className="h-5 w-5 text-brand-gold sm:h-6 sm:w-6" /> : <Link2 className="h-5 w-5 sm:h-6 sm:w-6" />}
        {copied ? 'Copied' : 'Copy Link'}
      </button>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={secondaryBtn}
        aria-label={`Share ${title} on WhatsApp`}
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        Share
      </a>
    </>
  );
}
