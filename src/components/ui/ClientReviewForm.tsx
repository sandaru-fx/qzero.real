'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send, Star } from 'lucide-react';
import { submitClientReview } from '@/actions/review';

export default function ClientReviewForm() {
  const [clientName, setClientName] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await submitClientReview({ clientName, vehicleName, reviewText, rating });
    setSaving(false);
    if (res.success) {
      setDone(true);
      setClientName('');
      setVehicleName('');
      setReviewText('');
      setRating(5);
    } else {
      setError(res.error || 'Submission failed.');
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-brand-gold/35 bg-black/55 p-8 text-center backdrop-blur-md sm:p-10">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-gold" />
        <h3 className="mt-4 text-2xl font-semibold text-white">Thank you</h3>
        <p className="mt-3 text-base text-white/70">
          Your review was submitted and is awaiting approval. It will appear on the site once our
          team verifies it.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:border-brand-gold/50 hover:text-brand-gold"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/55 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(212,175,55,0.08),transparent_45%)]"
      />

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">Share your story</p>
        <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Leave a review</h3>
        <p className="mt-2 max-w-2xl text-base text-white/65">
          Tell future buyers about your QZERO experience. Submissions are reviewed before publishing.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white/55">Your name</span>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3.5 text-base font-semibold text-white outline-none transition-colors focus:border-brand-gold/60"
              placeholder="e.g. Kasun Perera"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white/55">Vehicle purchased</span>
            <input
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3.5 text-base font-semibold text-white outline-none transition-colors focus:border-brand-gold/60"
              placeholder="e.g. 2023 Land Cruiser 300"
            />
          </label>
        </div>

        <div className="mt-5">
          <span className="mb-2 block text-sm font-semibold text-white/55">Rating</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/5"
                aria-label={`${n} stars`}
              >
                <Star
                  className={`h-7 w-7 ${
                    n <= rating ? 'fill-brand-gold text-brand-gold' : 'text-white/20'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-white/55">Your review</span>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            minLength={20}
            rows={5}
            className="w-full resize-y rounded-xl border border-white/15 bg-black/60 px-4 py-3.5 text-base font-medium leading-relaxed text-white outline-none transition-colors focus:border-brand-gold/60"
            placeholder="How was the showroom experience, guidance, and handover?"
          />
        </label>

        {error ? <p className="mt-4 text-sm font-semibold text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 rounded-full gold-gradient px-7 py-3.5 text-base font-bold text-black disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {saving ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  );
}
