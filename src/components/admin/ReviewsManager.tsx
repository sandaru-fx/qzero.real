'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Plus, Star, Trash2, UploadCloud, X } from 'lucide-react';
import type { ReviewFormInput, ReviewView } from '@/types/review';
import { addReview, deleteReview, toggleFeaturedStatus } from '@/actions/review';
import { uploadVehicleImage } from '@/actions/upload';

type ReviewsManagerProps = {
  reviews: ReviewView[];
};

const emptyForm: ReviewFormInput = {
  clientName: '',
  vehicleName: '',
  reviewText: '',
  rating: 5,
  imageUrl: '',
  isFeatured: true,
};

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-3 text-base text-white outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold';
const labelClasses = 'mb-2 block text-sm font-medium text-brand-muted';

export default function ReviewsManager({ reviews }: ReviewsManagerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ReviewFormInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const openCreate = () => {
    setForm(emptyForm);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyForm);
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await uploadVehicleImage(fd);
    if (res.success && res.url) {
      setForm((p) => ({ ...p, imageUrl: res.url }));
    } else {
      setToast({ type: 'error', text: res.error || 'Image upload failed.' });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await addReview(form);
    setSaving(false);
    if (res.success) {
      closeForm();
      setToast({ type: 'success', text: 'Review Added Successfully!' });
      router.refresh();
    } else {
      setToast({ type: 'error', text: res.error || 'Failed to add review.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    setDeletingId(id);
    const res = await deleteReview(id);
    setDeletingId(null);
    if (res.success) {
      setToast({ type: 'success', text: 'Review deleted.' });
      router.refresh();
    } else {
      setToast({ type: 'error', text: res.error || 'Delete failed.' });
    }
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    const res = await toggleFeaturedStatus(id);
    setTogglingId(null);
    if (res.success) {
      setToast({
        type: 'success',
        text: res.isFeatured ? 'Now featured on homepage.' : 'Removed from homepage marquee.',
      });
      router.refresh();
    } else {
      setToast({ type: 'error', text: res.error || 'Update failed.' });
    }
  };

  return (
    <div className="space-y-6">
      {toast ? (
        <div
          className={`fixed right-4 top-20 z-[80] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md sm:right-8 ${
            toast.type === 'success'
              ? 'border-emerald-400/40 bg-emerald-950/90 text-emerald-100'
              : 'border-red-400/40 bg-red-950/90 text-red-100'
          }`}
          role="status"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          )}
          <p className="text-sm font-semibold leading-snug">{toast.text}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-auto shrink-0 opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-muted">
          {reviews.length} review{reviews.length === 1 ? '' : 's'} · featured ones power the homepage
          marquee
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full gold-gradient px-5 py-2.5 text-sm font-bold text-black"
        >
          <Plus className="h-4 w-4" />
          Add review
        </button>
      </div>

      {formOpen ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-brand-gold/25 bg-black/40 p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">New client review</h3>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-white/10 p-2 text-white/70 hover:border-brand-gold/40 hover:text-brand-gold"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Client name</label>
              <input
                className={inputClasses}
                value={form.clientName}
                onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
                placeholder="e.g. Kasun Perera"
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Vehicle</label>
              <input
                className={inputClasses}
                value={form.vehicleName}
                onChange={(e) => setForm((p) => ({ ...p, vehicleName: e.target.value }))}
                placeholder="e.g. 2022 Toyota Land Cruiser"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Review</label>
            <textarea
              className={`${inputClasses} min-h-[120px] resize-y`}
              value={form.reviewText}
              onChange={(e) => setForm((p) => ({ ...p, reviewText: e.target.value }))}
              placeholder="What did the client say about their experience?"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: n }))}
                    className="rounded-lg p-1.5 transition-colors hover:bg-white/5"
                    aria-label={`${n} stars`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        n <= form.rating ? 'fill-brand-gold text-brand-gold' : 'text-white/25'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                  className="h-4 w-4 accent-[#D4AF37]"
                />
                <span className="text-sm font-medium text-white">Feature on homepage marquee</span>
              </label>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Photo (optional)</label>
            <div className="flex flex-wrap items-center gap-4">
              {form.imageUrl ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-brand-gold/40">
                  <Image src={form.imageUrl} alt="" fill className="object-cover" sizes="64px" />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-white/20 text-white/40">
                  <UploadCloud className="h-5 w-5" />
                </div>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-brand-gold/50 hover:text-brand-gold">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                {uploading ? 'Uploading…' : 'Upload image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 rounded-full gold-gradient px-6 py-3 text-sm font-bold text-black disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Saving…' : 'Publish review'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 hover:border-white/30"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-brand-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Vehicle</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Review</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-brand-muted">
                  No reviews yet. Add your first client testimonial.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="border-b border-white/5 align-top last:border-0">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-brand-gold/30 bg-black">
                        {review.imageUrl ? (
                          <Image
                            src={review.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-brand-gold">
                            {review.clientName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-white">{review.clientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-300">{review.vehicleName}</td>
                  <td className="hidden max-w-xs px-4 py-4 text-gray-400 md:table-cell">
                    <p className="line-clamp-2">{review.reviewText}</p>
                  </td>
                  <td className="px-4 py-4 text-brand-gold">{review.rating}/5</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggle(review.id)}
                      disabled={togglingId === review.id}
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                        review.isFeatured
                          ? 'bg-brand-gold/20 text-brand-gold'
                          : 'border border-white/15 text-white/50 hover:border-brand-gold/40 hover:text-brand-gold'
                      }`}
                    >
                      {togglingId === review.id ? '…' : review.isFeatured ? 'Featured' : 'Off'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {deletingId === review.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
