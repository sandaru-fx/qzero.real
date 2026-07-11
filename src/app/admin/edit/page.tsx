import { redirect } from 'next/navigation';

export default function LegacyEditIndexRedirect() {
  redirect('/admin/inventory');
}
