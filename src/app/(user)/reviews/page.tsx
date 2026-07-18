import type { Metadata } from 'next';
import { getReviews } from '@/actions/review';
import ReviewsExplorer from '@/components/ui/ReviewsExplorer';
import ClientReviewForm from '@/components/ui/ClientReviewForm';
import LifestyleHero from '@/components/LifestyleHero';
import { lifestyleImages } from '@/data/lifestyle';
import { SITE_SHELL } from '@/config/layout';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'What QZERO International clients say about their showroom experience, vehicle handover, and concierge support.',
};

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="min-h-screen bg-brand-black">
      <LifestyleHero
        image={lifestyleImages.importHero}
        breadcrumbs="HOME  |  REVIEWS"
        eyebrow="Client stories"
        title="What our clients say"
        description="Honest feedback from buyers who trusted QZERO with their next vehicle — from first inquiry to the keys in hand."
        objectPosition="center 28%"
        minHeight="sm:min-h-[80svh] lg:min-h-[85svh]"
      />

      <section className={`${SITE_SHELL} py-12 sm:py-16`}>
        <ReviewsExplorer reviews={reviews} />
      </section>

      <section className={`${SITE_SHELL} border-t border-white/5 pb-16 pt-4 sm:pb-20`}>
        <ClientReviewForm />
      </section>
    </div>
  );
}
