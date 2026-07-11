'use server';

import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { protectServerAction } from '@/lib/auth';
import { hashPassword } from '@/lib/password';

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    await protectServerAction();
    await connectToDatabase();

    // Since we only have one super admin for now, we just get the first one.
    // If you add multi-admin support later, you'd get the email from the session cookie.
    const admin = await Admin.findOne();
    if (!admin) {
      return { success: false, error: 'Admin account not found.' };
    }

    if (admin.passwordHash !== hashPassword(currentPassword)) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    admin.passwordHash = hashPassword(newPassword);
    await admin.save();

    return { success: true };
  } catch (error) {
    console.error('Failed to change password:', error);
    return { success: false, error: 'Failed to change password.' };
  }
}
