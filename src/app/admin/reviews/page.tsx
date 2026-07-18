import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { protectAdminRoute } from '@/lib/auth';
import { getAdminReviews } from '@/actions/review';
import ReviewsManager from '@/components/admin/ReviewsManager';
import AdminPageHeader, { AdminPanel } from '@/components/admin/AdminPageHeader';

export const revalidate = 0;

export default async function AdminReviewsPage() {
  await protectAdminRoute();
  const reviews = await getAdminReviews();
  const featuredCount = reviews.filter((r) => r.isFeatured).length;
  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        eyebrow="Content"
        title="Reviews"
        description="Manage client testimonials — approve public submissions, edit, feature on homepage, or delete."
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
          <p className="relative z-10 text-base font-medium text-brand-muted">Pending approval</p>
          <p className="relative z-10 mt-1 text-3xl font-bold text-amber-300">{pendingCount}</p>
        </div>
        <div className="admin-stat-card">
          <p className="relative z-10 text-base font-medium text-brand-muted">Featured</p>
          <p className="relative z-10 mt-1 text-3xl font-bold text-brand-gold">{featuredCount}</p>
        </div>
      </div>

      <AdminPanel>
        <ReviewsManager reviews={reviews} />
      </AdminPanel>
    </div>
  );
}
