'use client';

import { useActionState, useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { submitContactForm, type ContactFormState } from '@/actions/contact';
import { buildWhatsAppUrl } from '@/config/site';

const inquiryTypes = ['General Inquiry', 'Vehicle Purchase', 'Import Service', 'Other'] as const;

const initialState: ContactFormState = { success: false };

const labelClass = 'grid gap-2.5 text-base font-semibold text-brand-muted';
const inputClass =
  'h-14 rounded-xl border border-white/10 bg-black px-4 text-base font-medium text-white outline-none transition-colors placeholder:text-brand-muted/70 focus:border-brand-gold';
const inputErrorClass = 'border-red-500/60 focus:border-red-400';

type ContactFormProps = {
  whatsappNumber: string;
  defaultInquiryType?: string;
  defaultMessage?: string;
  vehicleRef?: string;
};

export default function ContactForm({
  whatsappNumber,
  defaultInquiryType = 'General Inquiry',
  defaultMessage = '',
  vehicleRef = '',
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const [resetKey, setResetKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.success) setShowSuccess(true);
  }, [state.success]);

  if (showSuccess) {
    return (
      <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-gold" />
        <h3 className="mt-4 text-2xl font-bold text-white">Message Sent</h3>
        <p className="mt-2 text-base text-brand-muted">
          Thank you for reaching out. Our concierge team will respond shortly.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={buildWhatsAppUrl(
              whatsappNumber,
              'Hello QZERO International, I just submitted a contact form and would like to follow up.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-6 py-3 text-base font-semibold text-brand-gold transition-colors hover:bg-brand-gold/5"
          >
            Continue on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setShowSuccess(false);
              setResetKey((k) => k + 1);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  const fe = state.fieldErrors;

  return (
    <form key={resetKey} action={formAction} className="grid gap-6" noValidate>
      {state.error && (
        <div className="rounded-lg border border-red-500/50 bg-red-950/30 p-4 text-base text-red-200">
          {state.error}
        </div>
      )}

      {vehicleRef ? (
        <div className="rounded-xl border border-brand-gold/25 bg-brand-gold/5 px-4 py-3 text-sm text-brand-gold">
          Inquiring about: <span className="font-bold text-white">{vehicleRef}</span>
          <input type="hidden" name="vehicleRef" value={vehicleRef} />
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={labelClass}>
          Full Name *
          <input
            name="name"
            required
            className={`${inputClass} ${fe?.name ? inputErrorClass : ''}`}
            placeholder="Your name"
            aria-invalid={Boolean(fe?.name)}
          />
          {fe?.name && <span className="text-sm font-medium text-red-300">{fe.name}</span>}
        </label>
        <label className={labelClass}>
          Email *
          <input
            name="email"
            type="email"
            required
            className={`${inputClass} ${fe?.email ? inputErrorClass : ''}`}
            placeholder="you@email.com"
            aria-invalid={Boolean(fe?.email)}
          />
          {fe?.email && <span className="text-sm font-medium text-red-300">{fe.email}</span>}
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={labelClass}>
          Phone *
          <input
            name="phone"
            type="tel"
            required
            className={`${inputClass} ${fe?.phone ? inputErrorClass : ''}`}
            placeholder="+94 712 409 519"
            aria-invalid={Boolean(fe?.phone)}
          />
          {fe?.phone && <span className="text-sm font-medium text-red-300">{fe.phone}</span>}
        </label>
        <label className={labelClass}>
          Inquiry Type
          <select name="inquiryType" className={inputClass} defaultValue={defaultInquiryType}>
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={labelClass}>
        Message *
        <textarea
          name="message"
          required
          rows={5}
          defaultValue={defaultMessage}
          className={`rounded-xl border bg-black px-4 py-3.5 text-base font-medium text-white outline-none transition-colors placeholder:text-brand-muted/70 focus:border-brand-gold ${
            fe?.message ? 'border-red-500/60' : 'border-white/10'
          }`}
          placeholder="Tell us about the vehicle or import service you are interested in..."
          aria-invalid={Boolean(fe?.message)}
        />
        {fe?.message && <span className="text-sm font-medium text-red-300">{fe.message}</span>}
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="btn-micro flex h-14 items-center justify-center gap-2 rounded-full gold-gradient text-base font-bold text-black disabled:opacity-70 sm:text-lg"
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
