import { notFound } from 'next/navigation';
import { getVehicleById } from '@/actions/search';
import { protectAdminRoute } from '@/lib/auth';
import EditVehicleForm from '@/components/EditVehicleForm';

export const revalidate = 0;

export default async function AdminEditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await protectAdminRoute();
  
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  return <EditVehicleForm vehicle={vehicle} />;
}
