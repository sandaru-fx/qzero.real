'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { hashPassword, isLegacyPasswordHash, verifyPassword } from '@/lib/password';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SEC,
  createAdminSessionToken,
} from '@/lib/session';
import { rateLimitAdminLogin } from '@/lib/rate-limit';

const WEAK_DEFAULTS = new Set(['qzero123', 'admin', 'password', '123456', 'admin123']);

async function ensureBootstrapAdmin() {
  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) return { ok: true as const };

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return {
      ok: false as const,
      error:
        'No admin account exists. Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment, then try again.',
    };
  }

  if (password.length < 10 || WEAK_DEFAULTS.has(password.toLowerCase())) {
    return {
      ok: false as const,
      error:
        'ADMIN_PASSWORD is too weak. Use at least 10 characters and avoid common passwords.',
    };
  }

  await Admin.create({
    email,
    passwordHash: await hashPassword(password),
  });

  return { ok: true as const };
}

export async function loginAdmin(formData: FormData) {
  const limited = await rateLimitAdminLogin();
  if (!limited.ok) {
    return { success: false, error: limited.error };
  }

  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { success: false, error: 'Invalid email or password' };
  }

  await connectToDatabase();

  const bootstrap = await ensureBootstrapAdmin();
  if (!bootstrap.ok) {
    return { success: false, error: bootstrap.error };
  }

  const admin = await Admin.findOne({ email });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Upgrade legacy SHA-256 hashes to bcrypt on successful login
  if (isLegacyPasswordHash(admin.passwordHash)) {
    admin.passwordHash = await hashPassword(password);
    await admin.save();
  }

  let token: string;
  try {
    token = createAdminSessionToken(String(admin._id), admin.email);
  } catch {
    return {
      success: false,
      error: 'Server misconfigured: set SESSION_SECRET (min 32 characters) in the environment.',
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
    path: '/',
  });

  redirect('/admin');
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}
