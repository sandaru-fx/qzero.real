'use server';

import connectToDatabase from '@/lib/mongodb';
import Inquiry, { IInquiry } from '@/models/Inquiry';
import { protectServerAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export type InquiryView = Omit<IInquiry, 'createdAt' | 'updatedAt'> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export async function getInquiries(): Promise<InquiryView[]> {
  try {
    await protectServerAction();
    await connectToDatabase();

    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    return inquiries.map((inq: any) => ({
      ...inq,
      _id: String(inq._id),
      createdAt: inq.createdAt.toISOString(),
      updatedAt: inq.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    return [];
  }
}

export async function updateInquiryStatus(id: string, status: 'New' | 'In Progress' | 'Closed') {
  try {
    await protectServerAction();
    await connectToDatabase();

    await Inquiry.findByIdAndUpdate(id, { status });
    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await protectServerAction();
    await connectToDatabase();

    await Inquiry.findByIdAndDelete(id);
    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    return { success: false, error: 'Failed to delete inquiry' };
  }
}
