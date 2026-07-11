export const fallbackSiteConfig = {
  name: 'QZERO International',
  tagline: 'Premium Automotive Showroom & Import Partner',
  url: 'https://qzerointernational.com',

  contact: {
    email: 'info@qzerointernational.com',
    phone: '+94 77 000 0000',
    phoneTel: '+94770000000',
    whatsapp: '94770000000',
    whatsappQrUrl: 'https://wa.me/94770000000',
    address: {
      line1: 'No. 123, Marine Drive',
      line2: 'Colombo 03, Sri Lanka',
      full: 'No. 123, Marine Drive, Colombo 03, Sri Lanka',
    },
    mapsUrl: 'https://maps.google.com/?q=Marine+Drive+Colombo+03+Sri+Lanka',
    mapsEmbedUrl:
      'https://maps.google.com/maps?q=Marine+Drive+Colombo+03+Sri+Lanka&output=embed',
    hours: [
      { day: 'Monday — Friday', time: '9:00 AM — 6:00 PM' },
      { day: 'Saturday', time: '10:00 AM — 4:00 PM' },
      { day: 'Sunday', time: 'By Appointment' },
    ],
  },

  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
  },
} as const;

export function buildWhatsAppUrl(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
