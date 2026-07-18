import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';
import { protectAdminRoute } from '@/lib/auth';
import { getReviews } from '@/actions/review';
import ReviewsManager from '@/components/admin/ReviewsManager';
import AdminPageHeader, { AdminPanel } from '@/components/admin/AdminPageHeader';

export const revalidate = 0;

export default async function AdminReviewsPage() {
  await protectAdminRoute();
  const reviews = await getReviews();
  const featuredCount = reviews.filter((r) => r.isFeatured).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        eyebrow="Content"
        title="Reviews"
        description="Add client testimonials, feature them on the homepage marquee, and manage the public Reviews page."
        actions={
          <Link
            href="/reviews"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-gold/40 px-5 py-3 text-base font-semibold text-brand-gold transition-colors hover:bg-brand-gold/5"
          >
            View live page
            <ExternalLink className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="admin-stat-card">
          <p className="relative z-10 text-base font-medium text-brand-muted">Total reviews</p>
          <p className="relative z-10 mt-1 text-3xl font-bold text-white">{reviews.length}</p>
        </div>
        <div className="admin-stat-card">
          <p className="relative z-10 text-base font-medium text-brand-muted">Featured</p>
          <p className="relative z-10 mt-1 text-3xl font-bold text-brand-gold">{featuredCount}</p>
        </div>
        <div className="admin-stat-card">
          <p className="relative z-10 flex items-center gap-2 text-base font-medium text-brand-muted">
            <Star className="h-4 w-4 text-brand-gold" />
            Public URL
          </p>
          <p className="relative z-10 mt-1 text-lg font-semibold text-brand-gold">/reviews</p>
        </div>
      </div>

      <AdminPanel>
        <ReviewsManager reviews={reviews} />
      </AdminPanel>
    </div>
  );
}
