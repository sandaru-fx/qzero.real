'use client';

import { useActionState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { submitContactForm, type ContactFormState } from '@/actions/contact';
import { buildWhatsAppUrl } from '@/config/site';

const inquiryTypes = ['General Inquiry', 'Vehicle Purchase', 'Import Service', 'Other'] as const;

const initialState: ContactFormState = { success: false };

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-gold" />
        <h3 className="mt-4 text-xl font-bold text-white">Message Sent</h3>
        <p className="mt-2 text-sm text-brand-muted">
          Thank you for reaching out. Our concierge team will respond shortly.
        </p>
        <a
          href={buildWhatsAppUrl('Hello QZERO International, I just submitted a contact form and would like to follow up.')}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-6 py-3 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/5"
        >
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      {state.error && (
        <div className="rounded-lg border border-red-500/50 bg-red-950/30 p-3 text-sm text-red-200">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-brand-muted">
          Full Name *
          <input
            name="name"
            required
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-white outline-none transition-colors focus:border-brand-gold"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-muted">
          Email *
          <input
            name="email"
            type="email"
            required
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-white outline-none transition-colors focus:border-brand-gold"
            placeholder="you@email.com"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-brand-muted">
          Phone *
          <input
            name="phone"
            type="tel"
            required
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-white outline-none transition-colors focus:border-brand-gold"
            placeholder="+94 77 000 0000"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-muted">
          Inquiry Type
          <select
            name="inquiryType"
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-white outline-none transition-colors focus:border-brand-gold"
            defaultValue="General Inquiry"
          >
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-brand-muted">
        Message *
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition-colors focus:border-brand-gold"
          placeholder="Tell us about the vehicle or import service you are interested in..."
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="flex h-14 items-center justify-center gap-2 rounded-full gold-gradient text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
