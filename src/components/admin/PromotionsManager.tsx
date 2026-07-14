'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Loader2, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import type { PromotionFormInput, PromotionOffer, PromotionSource } from '@/types/promotion';
import type { VehicleView } from '@/types/vehicle';
import { createPromotion, deletePromotion, updatePromotion } from '@/actions/promotions';
import { uploadVehicleImage } from '@/actions/upload';

type PromotionsManagerProps = {
  promotions: PromotionOffer[];
  vehicles: VehicleView[];
};

const emptyForm: PromotionFormInput = {
  source: 'custom',
  vehicleId: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  image: '',
  href: '/contact',
  title: '',
  badge: 'Limited Offer',
  validUntil: '',
  highlight: '',
  highlightAccent: '',
  description: '',
  cta: 'Inquire Now',
  featured: false,
};

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-3 text-base text-white outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold';
const labelClasses = 'mb-2 block text-sm font-medium text-brand-muted';

export default function PromotionsManager({ promotions, vehicles }: PromotionsManagerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PromotionFormInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const source: PromotionSource = form.source === 'inventory' ? 'inventory' : 'custom';

  const usedVehicleIds = useMemo(() => {
    const ids = new Set(
      promotions.filter((p) => p.source === 'inventory' && p.vehicleId).map((p) => p.vehicleId)
    );
    if (editingId) {
      const current = promotions.find((p) => p.id === editingId);
      if (current?.vehicleId) ids.delete(current.vehicleId);
    }
    return ids;
  }, [promotions, editingId]);

  const selectableVehicles = useMemo(
    () => vehicles.filter((v) => !usedVehicleIds.has(v._id) || form.vehicleId === v._id),
    [vehicles, usedVehicleIds, form.vehicleId]
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage({ type: '', text: '' });
    setFormOpen(true);
  };

  const openEdit = (promo: PromotionOffer) => {
    setEditingId(promo.id);
    setForm({
      source: promo.source,
      vehicleId: promo.vehicleId || '',
      brand: promo.brand || '',
      model: promo.model || '',
      year: promo.year || new Date().getFullYear(),
      image: promo.source === 'custom' ? promo.image : '',
      href: promo.source === 'custom' ? promo.href : '/contact',
      title: promo.title,
      badge: promo.badge,
      validUntil: promo.validUntil,
      highlight: promo.highlight,
      highlightAccent: promo.highlightAccent,
      description: promo.description,
      cta: promo.cta,
      featured: Boolean(promo.featured),
    });
    setMessage({ type: '', text: '' });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setMessage({ type: '', text: '' });
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setMessage({ type: '', text: '' });
    const fd = new FormData();
    fd.append('file', file);
    const res = await uploadVehicleImage(fd);
    if (res.success && res.url) {
      setForm((p) => ({ ...p, image: res.url }));
    } else {
      setMessage({ type: 'error', text: res.error || 'Image upload failed.' });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (source === 'inventory' && !form.vehicleId) {
      setMessage({ type: 'error', text: 'Select a showroom vehicle.' });
      return;
    }
    if (source === 'custom') {
      if (!form.brand?.trim() || !form.model?.trim()) {
        setMessage({ type: 'error', text: 'Brand and model are required.' });
        return;
      }
      if (!form.image?.trim()) {
        setMessage({ type: 'error', text: 'Upload an image for this vehicle.' });
        return;
      }
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    const payload: PromotionFormInput = { ...form, source };
    const res = editingId
      ? await updatePromotion(editingId, payload)
      : await createPromotion(payload);

    if (res.success) {
      closeForm();
      router.refresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Something went wrong.' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this promotion?')) return;
    setDeletingId(id);
    const res = await deletePromotion(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete');
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Promotion vehicles</h2>
          <p className="mt-1 text-base font-medium text-brand-muted">
            Add showroom stock OR custom vehicles that are not listed in the showroom.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-bold text-black gold-gradient"
        >
          <Plus className="h-4 w-4" />
          Add promotion
        </button>
      </div>

      {formOpen && (
        <div className="rounded-xl border border-brand-gold/30 bg-[#0A0A0A] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? 'Edit promotion' : 'New promotion'}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-brand-muted hover:bg-white/5 hover:text-white"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className={labelClasses}>Vehicle source *</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      source: 'custom',
                      vehicleId: '',
                      cta: p.cta || 'Inquire Now',
                    }))
                  }
                  className={`rounded-xl border px-4 py-3 text-left text-base font-semibold transition-colors ${
                    source === 'custom'
                      ? 'border-brand-gold/50 bg-brand-gold/10 text-brand-gold'
                      : 'border-white/10 text-brand-muted hover:border-white/25'
                  }`}
                >
                  Not in showroom
                  <span className="mt-1 block text-sm font-medium text-white/50">
                    Custom vehicle for promotions only
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      source: 'inventory',
                      cta: p.cta === 'Inquire Now' ? 'View Vehicle' : p.cta,
                    }))
                  }
                  className={`rounded-xl border px-4 py-3 text-left text-base font-semibold transition-colors ${
                    source === 'inventory'
                      ? 'border-brand-gold/50 bg-brand-gold/10 text-brand-gold'
                      : 'border-white/10 text-brand-muted hover:border-white/25'
                  }`}
                >
                  From showroom
                  <span className="mt-1 block text-sm font-medium text-white/50">
                    Link an inventory vehicle
                  </span>
                </button>
              </div>
            </div>

            {source === 'inventory' ? (
              <div className="sm:col-span-2">
                <label className={labelClasses}>Showroom vehicle *</label>
                <select
                  required
                  value={form.vehicleId || ''}
                  onChange={(e) => setForm((p) => ({ ...p, vehicleId: e.target.value }))}
                  className={inputClasses}
                >
                  <option value="">Select from inventory…</option>
                  {selectableVehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.year} {v.brand} {v.model}
                      {v.grade ? ` ${v.grade}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div>
                  <label className={labelClasses}>Brand *</label>
                  <input
                    type="text"
                    required
                    value={form.brand || ''}
                    onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
                    placeholder="BMW"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Model *</label>
                  <input
                    type="text"
                    required
                    value={form.model || ''}
                    onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
                    placeholder="X5 xDrive40i"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Year</label>
                  <input
                    type="number"
                    value={form.year || ''}
                    onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                    placeholder="2024"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Link URL</label>
                  <input
                    type="text"
                    value={form.href || ''}
                    onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))}
                    placeholder="/contact"
                    className={inputClasses}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClasses}>Vehicle image *</label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm font-semibold text-brand-muted hover:border-brand-gold/40 hover:text-brand-gold">
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UploadCloud className="h-4 w-4" />
                      )}
                      {uploading ? 'Uploading…' : 'Upload image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    <input
                      type="url"
                      value={form.image || ''}
                      onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                      placeholder="Or paste image URL"
                      className={inputClasses}
                    />
                  </div>
                  {form.image ? (
                    <div className="relative mt-3 h-36 w-full max-w-sm overflow-hidden rounded-xl border border-white/10">
                      <Image src={form.image} alt="Preview" fill className="object-cover" sizes="400px" />
                    </div>
                  ) : null}
                </div>
              </>
            )}

            <div>
              <label className={labelClasses}>Offer title (optional)</label>
              <input
                type="text"
                value={form.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Leave blank to auto-generate"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Badge *</label>
              <input
                type="text"
                required
                value={form.badge}
                onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder="Limited Offer"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Valid until *</label>
              <input
                type="text"
                required
                value={form.validUntil}
                onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))}
                placeholder="30th Sept 2026"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>CTA button text</label>
              <input
                type="text"
                value={form.cta || ''}
                onChange={(e) => setForm((p) => ({ ...p, cta: e.target.value }))}
                placeholder={source === 'custom' ? 'Inquire Now' : 'View Vehicle'}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Highlight *</label>
              <input
                type="text"
                required
                value={form.highlight}
                onChange={(e) => setForm((p) => ({ ...p, highlight: e.target.value }))}
                placeholder="Save LKR 850,000"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Highlight accent</label>
              <input
                type="text"
                value={form.highlightAccent || ''}
                onChange={(e) => setForm((p) => ({ ...p, highlightAccent: e.target.value }))}
                placeholder="free first service"
                className={inputClasses}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClasses}>Description *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className={inputClasses}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 text-base text-white">
                <input
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-black text-brand-gold focus:ring-brand-gold"
                />
                Featured on promotions page (only one at a time)
              </label>
            </div>

            {message.text ? (
              <div
                className={`sm:col-span-2 rounded-xl p-3 text-base font-medium ${
                  message.type === 'success'
                    ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border border-red-500/20 bg-red-500/10 text-red-400'
                }`}
              >
                {message.text}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-black gold-gradient disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingId ? 'Save changes' : 'Publish promotion'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-white/15 px-6 py-3 text-base font-semibold text-white hover:border-white/30"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {promotions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0A0A0A] px-6 py-14 text-center">
          <p className="text-base text-brand-muted">No promotion vehicles yet.</p>
          <p className="mt-1 text-sm text-brand-muted">
            Add a custom vehicle or pick one from showroom inventory.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {promotions.map((promo) => (
            <article
              key={promo.id}
              className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0A0A]"
            >
              <div className="relative aspect-[16/9] bg-black">
                {promo.image ? (
                  <Image src={promo.image} alt={promo.imageAlt} fill sizes="400px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-brand-muted">
                    No image
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-brand-gold/30 bg-brand-gold/5 px-2.5 py-0.5 text-sm font-bold uppercase tracking-wider text-brand-gold">
                    {promo.badge}
                  </span>
                  {promo.source === 'custom' ? (
                    <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-sm font-semibold text-white/70">
                      Not in showroom
                    </span>
                  ) : (
                    <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-sm font-semibold text-sky-300">
                      Showroom
                    </span>
                  )}
                  {promo.featured ? (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-sm font-semibold text-emerald-400">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-brand-gold">
                  {promo.brand}
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">{promo.title}</h3>
                <p className="mt-1 text-sm text-brand-muted">{promo.vehicleLabel}</p>
                <p className="mt-2 text-base text-brand-muted">Valid until {promo.validUntil}</p>
                <p className="mt-2 text-base font-semibold text-white">{promo.highlight}</p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(promo)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-brand-muted hover:border-brand-gold/40 hover:text-brand-gold"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(promo.id)}
                    disabled={deletingId === promo.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-brand-muted hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
                  >
                    {deletingId === promo.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Remove
                  </button>
                  <Link
                    href={promo.href}
                    target="_blank"
                    className="ml-auto text-sm font-semibold text-brand-gold hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
