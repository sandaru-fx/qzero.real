export const fallbackSiteConfig = {
  name: 'QZERO International',
  tagline: 'Premium Automotive Showroom & Import Partner',
  url: 'https://qzerointernational.com',

  contact: {
    email: 'info@qzerointernational.com',
    phone: '+94 712 409 519',
    phoneTel: '+94712409519',
    whatsapp: '94712409519',
    whatsappQrUrl: 'https://wa.me/94712409519',
    address: {
      line1: 'QZERO International Pvt Ltd',
      line2: 'Habarakada, Sri Lanka',
      full: 'QZERO International Pvt Ltd, Habarakada, Sri Lanka',
    },
    mapsUrl: 'https://maps.app.goo.gl/2X8vp5rAEF1UZMfM8',
    mapsEmbedUrl:
      'https://maps.google.com/maps?q=V2C5%2B84X+Qzero+International+Pvt+Ltd,+Habarakada&output=embed',
    hours: [
      { day: 'Monday — Friday', time: '9:00 AM — 6:00 PM' },
      { day: 'Saturday', time: '10:00 AM — 4:00 PM' },
      { day: 'Sunday', time: 'By Appointment' },
    ],
  },

  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61584099365317',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
  },
} as const;

export function buildWhatsAppUrl(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
