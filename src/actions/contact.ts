'use server';

import { Resend } from 'resend';
import { siteConfig } from '@/config/site';

export type ContactFormState = {
  success: boolean;
  error?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const inquiryType = (formData.get('inquiryType') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  if (!name || !email || !phone || !message) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const emailBody = `
New contact inquiry from ${siteConfig.name}

Name: ${name}
Email: ${email}
Phone: ${phone}
Inquiry Type: ${inquiryType || 'General Inquiry'}

Message:
${message}
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
      return { success: false, error: 'Failed to send message. Please try again or contact us directly.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Contact form error:', err);
    return { success: false, error: 'Something went wrong. Please try again later.' };
  }
}
