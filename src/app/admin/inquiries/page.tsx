import { protectAdminRoute } from '@/lib/auth';
import { getInquiries } from '@/actions/inquiry';
import InquiryBoard from '@/components/admin/InquiryBoard';

export const revalidate = 0;

export default async function AdminInquiriesPage() {
  await protectAdminRoute();
  const inquiries = await getInquiries();

  return (
    <div className="mx-auto max-w-7xl">
      <p className="type-eyebrow text-brand-gold">CRM</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Inquiries</h1>
      <p className="type-muted mt-2">Manage customer leads and contact requests.</p>

      <InquiryBoard inquiries={inquiries} />
    </div>
  );
}
