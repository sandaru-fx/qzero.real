'use client';

import { useEffect, useState } from 'react';
import { buildWhatsAppUrl } from '@/config/site';

export default function WhatsAppWidget({ whatsappNumber }: { whatsappNumber: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <a
      href={buildWhatsAppUrl(
        whatsappNumber,
        'Hello QZERO International, I would like to inquire about your vehicles.'
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_28px_rgba(37,211,102,0.45)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-[0_0_36px_rgba(37,211,102,0.6)] sm:h-[4.5rem] sm:w-[4.5rem]"
      aria-label="Chat with us on WhatsApp"
    >
      {/* Rotating ring around the icon */}
      <span
        aria-hidden
        className="whatsapp-orbit pointer-events-none absolute -inset-2 rounded-full border-2 border-dashed border-[#25D366]/80 sm:-inset-2.5"
      />
      <span
        aria-hidden
        className="whatsapp-orbit-reverse pointer-events-none absolute -inset-1 rounded-full border border-[#25D366]/40 sm:-inset-1.5"
      />

      <div className="absolute right-full mr-4 hidden whitespace-nowrap rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm font-medium text-white opacity-0 shadow-xl transition-all duration-300 group-hover:block group-hover:opacity-100 lg:block">
        Chat with us!
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-white/10" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-[3px] border-l-[3px] border-y-transparent border-l-[#121212]" />
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="relative z-10 h-9 w-9 sm:h-10 sm:w-10"
      >
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.811.892 3.145.892 3.181 0 5.767-2.585 5.767-5.766 0-3.18-2.586-5.767-5.767-5.767zm3.375 8.168c-.184.524-1.074.966-1.49.997-.384.029-.757.172-2.399-.471-1.974-.776-3.238-2.793-3.336-2.923-.098-.13-1.082-1.442-1.082-2.748 0-1.305.673-1.948.913-2.203.24-.255.519-.319.69-.319.171 0 .343.007.495.014.16.007.377-.061.59.455.223.541.761 1.859.831 2.001.069.141.115.308.016.505-.101.196-.153.319-.306.495-.153.176-.324.372-.46.495-.153.141-.308.297-.134.597.173.298.775 1.282 1.666 2.079 1.151 1.028 2.115 1.345 2.41 1.488.295.141.468.118.643-.079.174-.197.747-.872.946-1.17.199-.298.397-.248.665-.148.267.1.168.795.168.795l-.01.05z" />
        <path d="M12.031 2C6.494 2 2 6.493 2 12.03c0 1.947.538 3.75 1.465 5.303l-1.42 5.19 5.312-1.393a9.972 9.972 0 004.674 1.161h.004c5.536 0 10.031-4.493 10.031-10.031S17.568 2 12.031 2zm0 18.06c-1.636 0-3.238-.432-4.639-1.264l-.333-.198-3.456.906.924-3.367-.217-.346a8.038 8.038 0 01-1.246-4.301c0-4.434 3.608-8.043 8.042-8.043 4.436 0 8.045 3.609 8.045 8.043 0 4.435-3.609 8.044-8.045 8.044z" />
      </svg>
    </a>
  );
}
