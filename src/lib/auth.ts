import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Validates the admin session. 
 * Note: In a production app, replace this with NextAuth `getServerSession` or Supabase `createClient().auth.getSession()`.
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies();
  
  // Checking for a generic session cookie. If not present, throw or redirect.
  // We use a mock check here to ensure the logic works before a DB auth provider is linked.
  const sessionCookie = cookieStore.get('qzero_admin_session');

  // If we require strict security but have no auth DB yet, we enforce the check.
  // For development/mock purposes, if you want to bypass, uncomment the true return.
  // return true; 

  if (!sessionCookie || sessionCookie.value !== 'authenticated') {
    return false;
  }
  
  return true;
}

export async function protectAdminRoute() {
  const isAuthenticated = await requireAdminAuth();
  if (!isAuthenticated) {
    redirect('/admin/login');
  }
}

export async function protectServerAction() {
  const isAuthenticated = await requireAdminAuth();
  if (!isAuthenticated) {
    throw new Error('Unauthorized access denied.');
  }
}
