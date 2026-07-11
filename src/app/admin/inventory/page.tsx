import { Plus } from 'lucide-react';
import { getVehicles } from '@/actions/search';
import { protectAdminRoute } from '@/lib/auth';
import InventoryTable from '@/components/admin/InventoryTable';
import AdminPageHeader, {
  AdminPanel,
  AdminPrimaryButton,
} from '@/components/admin/AdminPageHeader';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  await protectAdminRoute();
  const vehicles = await getVehicles({ limit: 100 });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        eyebrow="Showroom"
        title="Inventory"
        description="Full vehicle catalogue — search, edit, preview, and delete listings."
        actions={
          <AdminPrimaryButton href="/admin/vehicles/new">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </AdminPrimaryButton>
        }
      />

      <AdminPanel>
        <InventoryTable vehicles={vehicles} />
      </AdminPanel>
    </div>
  );
}
