export type PromotionOffer = {
  id: string;
  brand: string;
  title: string;
  validUntil: string;
  highlight: string;
  highlightAccent: string;
  description: string;
  image: string;
  imageAlt: string;
  badge: string;
  cta: string;
  href: string;
  featured?: boolean;
};

export const promotionOffers: PromotionOffer[] = [
  {
    id: 'range-rover-upgrade',
    brand: 'Land Rover',
    title: 'Range Rover Sport Exclusive Upgrade Offer',
    validUntil: '30th Sept 2026',
    highlight: 'Save LKR 1,500,000',
    highlightAccent: 'or 0% interest plans',
    description:
      'Premium reconditioned Range Rover Sport with complimentary detailing, priority delivery, and exclusive finance options for qualified buyers.',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Black Range Rover Sport in a premium showroom',
    badge: 'Featured Offer',
    cta: 'Get Offer',
    href: '/contact',
    featured: true,
  },
  {
    id: 'mercedes-c200',
    brand: 'Mercedes-Benz',
    title: 'C200 AMG Line Concierge Package',
    validUntil: '15th Oct 2026',
    highlight: 'Save LKR 850,000',
    highlightAccent: 'free first service',
    description:
      'AMG Line styling with white-glove handover, complimentary first service, and dedicated QZERO concierge support.',
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Mercedes-Benz sedan in studio lighting',
    badge: 'Limited Time',
    cta: 'Get Offer',
    href: '/vehicles',
  },
  {
    id: 'bmw-x5',
    brand: 'BMW',
    title: 'X5 xDrive Import Fee Waiver',
    validUntil: '31st Oct 2026',
    highlight: 'Import fee waived',
    highlightAccent: 'full inspection included',
    description:
      'Japan / UK sourced BMW X5 with waived concierge import fee, certified inspection report, and insured freight package.',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'BMW SUV on a dark road',
    badge: 'Import Special',
    cta: 'Start Import',
    href: '/import',
  },
  {
    id: 'early-access',
    brand: 'QZERO',
    title: 'VIP Early Access to New Arrivals',
    validUntil: 'Ongoing',
    highlight: 'First look access',
    highlightAccent: 'before public listing',
    description:
      'Join the VIP list and get first access to newly arrived premium stock — before it hits the public showroom.',
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Luxury car front grille close-up',
    badge: 'Members Only',
    cta: 'Join VIP',
    href: '/contact',
  },
  {
    id: 'freight-insurance',
    brand: 'Shipping',
    title: 'Insured Ocean Freight Package',
    validUntil: '30th Nov 2026',
    highlight: '30 days cargo cover',
    highlightAccent: 'complimentary',
    description:
      'Book containerized shipping through our premium freight partners and receive complimentary cargo insurance for the first 30 days.',
    image:
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Cargo ship at sea for vehicle freight',
    badge: 'Shipping',
    cta: 'Learn More',
    href: '/import',
  },
  {
    id: 'trade-in',
    brand: 'Trade-In',
    title: 'Premium Trade-In Boost',
    validUntil: '20th Dec 2026',
    highlight: 'Extra LKR 500,000',
    highlightAccent: 'on approved trade-ins',
    description:
      'Upgrade into a QZERO showroom vehicle and unlock an exclusive trade-in valuation boost on approved models.',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Porsche sports car at dusk',
    badge: 'Upgrade',
    cta: 'Get Valuation',
    href: '/contact',
  },
];
