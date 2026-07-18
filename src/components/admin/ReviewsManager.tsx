'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BadgeCheck,
  CheckCircle2,
  Edit2,
  Loader2,
  Plus,
  Star,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import type { ReviewFormInput, ReviewView } from '@/types/review';
import {
  addReview,
  deleteReview,
  toggleApprovedStatus,
  toggleFeaturedStatus,
  updateReview,
} from '@/actions/review';
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
  isApproved: true,
};

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-3 text-base text-white outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold';
const labelClasses = 'mb-2 block text-sm font-medium text-brand-muted';

export default function ReviewsManager({ reviews }: ReviewsManagerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewFormInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (review: ReviewView) => {
    setEditingId(review.id);
    setForm({
      clientName: review.clientName,
      vehicleName: review.vehicleName,
      reviewText: review.reviewText,
      rating: review.rating,
      imageUrl: review.imageUrl,
      isFeatured: review.isFeatured,
      isApproved: review.isApproved,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
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
    const payload: ReviewFormInput = { ...form, isApproved: form.isApproved !== false };
    const res = editingId ? await updateReview(editingId, payload) : await addReview(payload);
    setSaving(false);
    if (res.success) {
      closeForm();
      setToast({
        type: 'success',
        text: editingId ? 'Review updated successfully!' : 'Review Added Successfully!',
      });
      router.refresh();
    } else {
      setToast({ type: 'error', text: res.error || 'Save failed.' });
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

  const handleToggleFeatured = async (id: string) => {
    setTogglingId(id);
    const res = await toggleFeaturedStatus(id);
    setTogglingId(null);
    if (res.success) {
      setToast({
        type: 'success',
        text: res.isFeatured ? 'Now featured on homepage.' : 'Removed from homepage.',
      });
      router.refresh();
    } else {
      setToast({ type: 'error', text: res.error || 'Update failed.' });
    }
  };

  const handleToggleApproved = async (id: string) => {
    setApprovingId(id);
    const res = await toggleApprovedStatus(id);
    setApprovingId(null);
    if (res.success) {
      setToast({
        type: 'success',
        text: res.isApproved ? 'Review approved — now live.' : 'Review set to pending.',
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
          <button type="button" onClick={() => setToast(null)} className="ml-auto shrink-0 opacity-70" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-muted">
          {reviews.length} total · {pendingCount} pending approval · featured power the homepage
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
            <h3 className="text-lg font-semibold text-white">
              {editingId ? 'Edit review' : 'New client review'}
            </h3>
            <button type="button" onClick={closeForm} className="rounded-full border border-white/10 p-2 text-white/70">
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
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Vehicle</label>
              <input
                className={inputClasses}
                value={form.vehicleName}
                onChange={(e) => setForm((p) => ({ ...p, vehicleName: e.target.value }))}
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
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClasses}>Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm((p) => ({ ...p, rating: n }))}>
                    <Star
                      className={`h-6 w-6 ${
                        n <= form.rating ? 'fill-brand-gold text-brand-gold' : 'text-white/25'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(form.isApproved)}
                onChange={(e) => setForm((p) => ({ ...p, isApproved: e.target.checked }))}
                className="h-4 w-4 accent-[#D4AF37]"
              />
              <span className="text-sm font-medium text-white">Approved (live)</span>
            </label>
            <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                className="h-4 w-4 accent-[#D4AF37]"
              />
              <span className="text-sm font-medium text-white">Featured homepage</span>
            </label>
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
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Publish review'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80"
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
              <th className="hidden px-4 py-3 font-semibold lg:table-cell">Review</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-brand-muted">
                  No reviews yet.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="border-b border-white/5 align-top last:border-0">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-brand-gold/30 bg-black">
                        {review.imageUrl ? (
                          <Image src={review.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-brand-gold">
                            {review.clientName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{review.clientName}</p>
                        <p className="text-xs text-brand-gold">{review.rating}/5</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-300">{review.vehicleName}</td>
                  <td className="hidden max-w-xs px-4 py-4 text-gray-400 lg:table-cell">
                    <p className="line-clamp-2">{review.reviewText}</p>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleApproved(review.id)}
                      disabled={approvingId === review.id}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                        review.isApproved
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {approvingId === review.id ? '…' : review.isApproved ? 'Live' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(review.id)}
                      disabled={togglingId === review.id || !review.isApproved}
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide disabled:opacity-40 ${
                        review.isFeatured
                          ? 'bg-brand-gold/20 text-brand-gold'
                          : 'border border-white/15 text-white/50 hover:border-brand-gold/40 hover:text-brand-gold'
                      }`}
                    >
                      {togglingId === review.id ? '…' : review.isFeatured ? 'Featured' : 'Off'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(review)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:border-brand-gold/40 hover:text-brand-gold"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </button>
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
                    </div>
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
