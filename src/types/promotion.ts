export type PromotionSource = 'inventory' | 'custom';

export type PromotionOffer = {
  id: string;
  source: PromotionSource;
  vehicleId: string;
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
  vehicleLabel: string;
  model?: string;
  year?: number;
};

export type PromotionFormInput = {
  source: PromotionSource;
  vehicleId?: string;
  brand?: string;
  model?: string;
  year?: number | string;
  image?: string;
  href?: string;
  title?: string;
  badge: string;
  validUntil: string;
  highlight: string;
  highlightAccent?: string;
  description: string;
  cta?: string;
  featured?: boolean;
};
