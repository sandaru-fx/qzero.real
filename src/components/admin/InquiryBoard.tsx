'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Clock, MoreVertical, Trash2, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
import { InquiryView, updateInquiryStatus, deleteInquiry } from '@/actions/inquiry';

type BoardProps = {
  inquiries: InquiryView[];
};

const COLUMNS = ['New', 'In Progress', 'Closed'] as const;

export default function InquiryBoard({ inquiries }: BoardProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: 'New' | 'In Progress' | 'Closed') => {
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
      <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111111] px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold/10">
          <MessageSquare className="h-6 w-6 text-brand-gold" />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-white">No inquiries yet</h2>
        <p className="mt-2 max-w-md text-sm text-brand-muted">
          Incoming leads from the contact form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const colInquiries = inquiries.filter((i) => i.status === col);
        
        return (
          <div key={col} className="flex flex-col rounded-2xl border border-white/5 bg-[#111111] p-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <h2 className="font-semibold text-white flex items-center gap-2">
                {col === 'New' && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                {col === 'In Progress' && <span className="h-2 w-2 rounded-full bg-brand-gold" />}
                {col === 'Closed' && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                {col}
              </h2>
              <span className="rounded-full bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-medium text-brand-muted">
                {colInquiries.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {colInquiries.map((inq) => (
                <div key={inq._id} className="group relative rounded-xl border border-white/5 bg-[#0A0A0A] p-4 transition-all hover:border-brand-gold/30">
                  {loadingId === inq._id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white">{inq.name}</h3>
                      <p className="mt-0.5 text-xs font-medium text-brand-gold">{inq.inquiryType}</p>
                    </div>
                    
                    {/* Dropdown Menu for Status */}
                    <div className="relative">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq._id, e.target.value as any)}
                        className="appearance-none rounded-lg border border-white/10 bg-[#1A1A1A] py-1 pl-2 pr-6 text-xs text-white outline-none focus:border-brand-gold"
                      >
                        {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <MoreVertical className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-muted" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-300 line-clamp-3">{inq.message}</p>

                  <div className="mt-4 flex flex-col gap-1.5 border-t border-white/5 pt-3">
                    <a href={`mailto:${inq.email}`} className="flex items-center gap-2 text-xs text-brand-muted hover:text-brand-gold">
                      <Mail className="h-3.5 w-3.5" /> {inq.email}
                    </a>
                    <a href={`tel:${inq.phone}`} className="flex items-center gap-2 text-xs text-brand-muted hover:text-brand-gold">
                      <Phone className="h-3.5 w-3.5" /> {inq.phone}
                    </a>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <button
                      onClick={() => handleDelete(inq._id)}
                      className="rounded p-1 text-gray-500 hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {colInquiries.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/5 p-6 text-center text-sm text-brand-muted">
                  No inquiries
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
