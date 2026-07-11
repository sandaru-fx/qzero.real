'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Phone,
  Clock,
  Trash2,
  Loader2,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { InquiryView, updateInquiryStatus, deleteInquiry } from '@/actions/inquiry';

type BoardProps = {
  inquiries: InquiryView[];
};

const COLUMNS = ['New', 'In Progress', 'Closed'] as const;

const COLUMN_META: Record<
  (typeof COLUMNS)[number],
  { dot: string; hint: string }
> = {
  New: { dot: 'bg-sky-400', hint: 'Fresh leads' },
  'In Progress': { dot: 'bg-brand-gold', hint: 'Being handled' },
  Closed: { dot: 'bg-emerald-400', hint: 'Resolved' },
};

export default function InquiryBoard({ inquiries }: BoardProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (
    id: string,
    newStatus: 'New' | 'In Progress' | 'Closed'
  ) => {
    setLoadingId(id);
    await updateInquiryStatus(id, newStatus);
    setLoadingId(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    setLoadingId(id);
    await deleteInquiry(id);
    setLoadingId(null);
    router.refresh();
  };

  if (inquiries.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-gradient-to-b from-[#141414] to-[#0F0F0F] px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/10">
          <MessageSquare className="h-6 w-6 text-brand-gold" />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-white">No inquiries yet</h2>
        <p className="type-muted mt-2 max-w-md">
          When customers submit the contact form, leads will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const colInquiries = inquiries.filter((i) => i.status === col);
        const meta = COLUMN_META[col];

        return (
          <div
            key={col}
            className="flex flex-col rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#141414] to-[#0F0F0F] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
          >
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h2 className="flex items-center gap-2 text-base font-bold text-white">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  {col}
                </h2>
                <p className="mt-1 text-sm font-medium text-brand-muted">{meta.hint}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-0.5 text-sm font-bold text-white">
                {colInquiries.length}
              </span>
            </div>

            <div className="flex min-h-[120px] flex-col gap-3">
              {colInquiries.map((inq) => (
                <article
                  key={inq._id}
                  className="group relative rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-4 transition-all duration-200 hover:border-brand-gold/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                >
                  {loadingId === inq._id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/55 backdrop-blur-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-white">{inq.name}</h3>
                      <p className="mt-0.5 text-sm font-bold text-brand-gold">{inq.inquiryType}</p>
                    </div>

                    <select
                      value={inq.status}
                      onChange={(e) =>
                        handleStatusChange(
                          inq._id,
                          e.target.value as (typeof COLUMNS)[number]
                        )
                      }
                      className="shrink-0 rounded-lg border border-white/10 bg-[#1A1A1A] py-1.5 pl-2 pr-2 text-sm font-semibold text-white outline-none transition-colors focus:border-brand-gold"
                      aria-label="Change status"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="mt-3 line-clamp-3 text-base font-medium leading-relaxed text-gray-300">
                    {inq.message}
                  </p>

                  <div className="mt-4 flex flex-col gap-1.5 border-t border-white/5 pt-3">
                    <a
                      href={`mailto:${inq.email}`}
                      className="flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-gold"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{inq.email}</span>
                    </a>
                    <a
                      href={`tel:${inq.phone}`}
                      className="flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-gold"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {inq.phone}
                    </a>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(inq.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                      {col !== 'Closed' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              inq._id,
                              col === 'New' ? 'In Progress' : 'Closed'
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-gold/25 bg-brand-gold/10 px-2.5 py-1 text-xs font-bold text-brand-gold transition-colors hover:bg-brand-gold/20"
                          title="Move forward"
                        >
                          Next
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(inq._id)}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Delete inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {colInquiries.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/8 px-4 py-10 text-center text-base font-medium text-brand-muted">
                  Empty column
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
