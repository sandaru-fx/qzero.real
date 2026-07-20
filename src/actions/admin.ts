'use server';

import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { protectServerAction } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/password';

export async function getAdminEmail() {
  try {
    await protectServerAction();
    await connectToDatabase();
    const admin = await Admin.findOne().select('email').lean();
    if (!admin || typeof admin !== 'object' || !('email' in admin)) return '';
    return String((admin as { email: string }).email ?? '');
  } catch {
    return '';
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    await protectServerAction();
    await connectToDatabase();

    if (!newPassword || newPassword.length < 10) {
      return { success: false, error: 'New password must be at least 10 characters.' };
    }

    const admin = await Admin.findOne();
    if (!admin) {
      return { success: false, error: 'Admin account not found.' };
    }

    if (!(await verifyPassword(currentPassword, admin.passwordHash))) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    admin.passwordHash = await hashPassword(newPassword);
    await admin.save();

    return { success: true };
  } catch (error) {
    console.error('Failed to change password:', error);
    return { success: false, error: 'Failed to change password.' };
  }
}

export async function changeAdminEmail(currentPassword: string, newEmail: string) {
  try {
    await protectServerAction();
    await connectToDatabase();

    const email = newEmail.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const admin = await Admin.findOne();
    if (!admin) {
      return { success: false, error: 'Admin account not found.' };
    }

    if (!(await verifyPassword(currentPassword, admin.passwordHash))) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (admin.email.toLowerCase() === email) {
      return { success: false, error: 'That is already your current email.' };
    }

    const taken = await Admin.findOne({ email });
    if (taken && String(taken._id) !== String(admin._id)) {
      return { success: false, error: 'That email is already in use.' };
    }

    admin.email = email;
    await admin.save();

    return { success: true, email };
  } catch (error) {
    console.error('Failed to change admin email:', error);
    return { success: false, error: 'Failed to change email.' };
  }
}
