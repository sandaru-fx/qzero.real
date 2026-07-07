import { protectAdminRoute } from '@/lib/auth';

export default async function AddVehicleLayout({ children }: { children: React.ReactNode }) {
  await protectAdminRoute();
  return <>{children}</>;
}
