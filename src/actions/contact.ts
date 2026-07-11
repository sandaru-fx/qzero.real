'use server';

import { Resend } from 'resend';
import { getSiteConfig } from '@/actions/settings';
import connectToDatabase from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export type ContactFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const siteConfig = await getSiteConfig();
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const inquiryType = (formData.get('inquiryType') as string)?.trim() || 'General Inquiry';
  const message = (formData.get('message') as string)?.trim();
  const vehicleRef = (formData.get('vehicleRef') as string)?.trim();

  const fieldErrors: ContactFormState['fieldErrors'] = {};
  if (!name) fieldErrors.name = 'Please enter your name.';
  if (!email) fieldErrors.email = 'Please enter your email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Please enter a valid email address.';
  }
  if (!phone) fieldErrors.phone = 'Please enter your phone number.';
  if (!message) fieldErrors.message = 'Please enter a message.';

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: 'Please fix the highlighted fields.',
      fieldErrors,
    };
  }

  const fullMessage = vehicleRef
    ? `Vehicle interest: ${vehicleRef}\n\n${message}`
    : message;

  try {
    await connectToDatabase();
    await Inquiry.create({
      name,
      email,
      phone,
      inquiryType,
      message: fullMessage,
      status: 'New',
    });
  } catch (dbError) {
    console.error('Failed to save inquiry to DB:', dbError);
  }

  const emailBody = `
New contact inquiry from ${siteConfig.name}

Name: ${name}
Email: ${email}
Phone: ${phone}
Inquiry Type: ${inquiryType}
${vehicleRef ? `Vehicle: ${vehicleRef}` : ''}

Message:
${fullMessage}
  `.trim();

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('[Contact Form - Dev Mode]\n', emailBody);
    return { success: true };
  }

  try {
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const toEmail = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email;

    const { error } = await resend.emails.send({
      from: `${siteConfig.name} <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `[${inquiryType || 'Inquiry'}] Message from ${name}`,
      text: emailBody,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: 'Failed to send message. Please try again or contact us directly.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Contact form error:', err);
    return { success: false, error: 'Something went wrong. Please try again later.' };
  }
}
