'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ImagePlus, Loader2, Send, Star, X } from 'lucide-react';
import { submitClientReview } from '@/actions/review';
import { uploadReviewImage } from '@/actions/upload';

export default function ClientReviewForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [clientName, setClientName] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [hadPhoto, setHadPhoto] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setClientName('');
    setVehicleName('');
    setReviewText('');
    setRating(5);
    setImageUrl('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    const res = await uploadReviewImage(fd);
    setUploading(false);
    if (res.success && res.url) {
      setImageUrl(res.url);
    } else {
      setError(res.error || 'Image upload failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const withPhoto = Boolean(imageUrl);
    const res = await submitClientReview({
      clientName,
      vehicleName,
      reviewText,
      rating,
      imageUrl: imageUrl || undefined,
    });
    setSaving(false);
    if (res.success) {
      setHadPhoto(withPhoto);
      setDone(true);
      resetForm();
    } else {
      setError(res.error || 'Submission failed.');
    }
  };

  if (done) {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-gold/40 bg-gradient-to-br from-[#12100a] via-black to-black p-8 text-center sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_55%)]"
        />
        <CheckCircle2 className="relative mx-auto h-12 w-12 text-brand-gold" />
        <h3 className="relative mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Thank you
        </h3>
        <p className="relative mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70">
          Your review is awaiting approval. Once verified, it will appear on this page
          {hadPhoto ? ' with your photo as the card background' : ''}.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setHadPhoto(false);
          }}
          className="relative mt-8 inline-flex rounded-full border border-brand-gold/45 px-6 py-3 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/10"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-gradient-to-br from-[#14110c] via-[#0a0a0a] to-black shadow-[0_32px_80px_rgba(0,0,0,0.55)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-brand-gold/[0.06] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"
      />

      <div className="relative grid lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left editorial panel */}
        <div className="border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:border-white/10">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
            Client voice
          </p>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Leave a review
          </h3>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/65">
            Share your showroom experience. Add an optional photo — it becomes the full background
            of your review card once approved.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/55">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
              Reviewed by our team before publishing
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
              Photo is optional — vehicle or handover shots work best
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
              Honest feedback helps the next buyer
            </li>
          </ul>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="p-7 sm:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-1">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Your name
              </span>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/12 bg-black/50 px-4 py-3.5 text-base font-semibold text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-gold/55"
                placeholder="e.g. Kasun Perera"
              />
            </label>
            <label className="block sm:col-span-1">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Vehicle
              </span>
              <input
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/12 bg-black/50 px-4 py-3.5 text-base font-semibold text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-gold/55"
                placeholder="e.g. 2023 Land Cruiser 300"
              />
            </label>
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-white/45">
              Rating
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="rounded-lg p-1.5 transition-transform hover:scale-110"
                  aria-label={`${n} stars`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      n <= rating ? 'fill-brand-gold text-brand-gold' : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-white/45">
              Your review
            </span>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              minLength={20}
              rows={4}
              className="w-full resize-y rounded-xl border border-white/12 bg-black/50 px-4 py-3.5 text-base font-medium leading-relaxed text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-gold/55"
              placeholder="How was the showroom experience, guidance, and handover?"
            />
          </label>

          {/* Optional photo */}
          <div className="mt-5">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Photo
              </span>
              <span className="text-xs font-medium text-white/35">Optional · card background</span>
            </div>

            {imageUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-brand-gold/35">
                <div className="relative h-36 w-full sm:h-40">
                  <Image src={imageUrl} alt="Review background preview" fill className="object-cover" sizes="480px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <p className="absolute bottom-3 left-3 text-xs font-semibold text-white/90">
                    Preview — full card background
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    if (fileRef.current) fileRef.current.value = '';
                  }}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white hover:border-brand-gold/50 hover:text-brand-gold"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="group flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-black/35 px-4 py-8 text-center transition-colors hover:border-brand-gold/45 hover:bg-brand-gold/[0.04] disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-brand-gold" />
                ) : (
                  <ImagePlus className="h-7 w-7 text-brand-gold/80 transition-transform group-hover:scale-110" />
                )}
                <span className="text-sm font-semibold text-white">
                  {uploading ? 'Uploading…' : 'Add a photo'}
                </span>
                <span className="text-xs text-white/40">JPG, PNG or WebP · max 5MB</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0] || null)}
            />
          </div>

          {error ? <p className="mt-4 text-sm font-semibold text-red-300">{error}</p> : null}

          <button
            type="submit"
            disabled={saving || uploading}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full gold-gradient px-7 py-4 text-base font-bold text-black transition-opacity disabled:opacity-60 sm:w-auto"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {saving ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      </div>
    </div>
  );
}
