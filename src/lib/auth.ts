import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from '@/lib/session';

/**
 * Validates the signed admin session cookie (HMAC).
 * Rejects legacy forgeable value `"authenticated"`.
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (!sessionCookie?.value) return false;

  // Old forgeable cookie — treat as logged out
  if (sessionCookie.value === 'authenticated') return false;

  const session = verifyAdminSessionToken(sessionCookie.value);
  return Boolean(session);
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
