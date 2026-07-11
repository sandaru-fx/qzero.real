import { redirect } from 'next/navigation';

export default function LegacyAddVehicleRedirect() {
  redirect('/admin/vehicles/new');
}
