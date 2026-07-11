import { protectAdminRoute } from '@/lib/auth';
import { getInquiries } from '@/actions/inquiry';
import InquiryBoard from '@/components/admin/InquiryBoard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export const revalidate = 0;

export default async function AdminInquiriesPage() {
  await protectAdminRoute();
  const inquiries = await getInquiries();
  const newCount = inquiries.filter((i) => i.status === 'New').length;

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        eyebrow="CRM"
        title="Inquiries"
        description={`Leads from the public contact form — name, email, phone, inquiry type, and message.${
          newCount > 0 ? ` ${newCount} new waiting.` : ''
        }`}
      />

      <InquiryBoard inquiries={inquiries} />
    </div>
  );
}
