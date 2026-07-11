'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { hashPassword } from '@/lib/password';

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  await connectToDatabase();

  // Seed default admin if none exists
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@qzero.lk';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'qzero123';
    await Admin.create({
      email: defaultEmail,
      passwordHash: hashPassword(defaultPassword),
    });
  }

  const admin = await Admin.findOne({ email });
  
  if (admin && admin.passwordHash === hashPassword(password)) {
    const cookieStore = await cookies();
    cookieStore.set('qzero_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    redirect('/admin');
  }

  return { success: false, error: 'Invalid email or password' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('qzero_admin_session');
  redirect('/admin/login');
}
