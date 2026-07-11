import { protectAdminRoute } from '@/lib/auth';
import VehicleForm from '@/components/admin/VehicleForm';

export default async function AdminNewVehiclePage() {
  await protectAdminRoute();
  return <VehicleForm mode="create" />;
}
