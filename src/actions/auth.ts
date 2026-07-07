'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Extremely basic MVP hardcoded credentials. 
  // In a real production scenario, use database checks or NextAuth.
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@qzero.lk';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qzero123';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('qzero_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    redirect('/admin/dashboard');
  }

  return { success: false, error: 'Invalid email or password' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('qzero_admin_session');
  redirect('/admin/login');
}
