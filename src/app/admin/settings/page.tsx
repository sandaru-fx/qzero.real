import { protectAdminRoute } from '@/lib/auth';
import { getSettings } from '@/actions/settings';
import SettingsManager from '@/components/admin/SettingsManager';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  await protectAdminRoute();
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="type-eyebrow text-brand-gold">System</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Settings</h1>
        <p className="type-muted mt-2">Manage your admin profile, contact details, and brand preferences.</p>
      </div>

      <SettingsManager initialSettings={settings} />
    </div>
  );
}
