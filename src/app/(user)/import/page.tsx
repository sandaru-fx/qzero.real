import { redirect } from 'next/navigation';

/** Old /import URL → /international */
export default function ImportRedirectPage() {
  redirect('/international');
}
