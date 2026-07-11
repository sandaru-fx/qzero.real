import type { Metadata } from 'next';
import WishlistClient from '@/components/WishlistClient';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved QZERO vehicles.',
};

export default function WishlistPage() {
  return <WishlistClient />;
}
