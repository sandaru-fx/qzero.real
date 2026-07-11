import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseParams: Record<string, string | undefined>;
};

export default function Pagination({ currentPage, totalPages, baseParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(baseParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    return qs ? `/vehicles?${qs}` : '/vehicles';
  };

  return (
    <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-full border border-brand-line px-5 py-2.5 text-base font-semibold text-white transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full border border-brand-line/50 px-5 py-2.5 text-base text-brand-muted opacity-50">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}

      <span className="text-base text-brand-muted">
        Page <span className="font-semibold text-white">{currentPage}</span> of{' '}
        <span className="font-semibold text-white">{totalPages}</span>
      </span>

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-full border border-brand-line px-5 py-2.5 text-base font-semibold text-white transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full border border-brand-line/50 px-5 py-2.5 text-base text-brand-muted opacity-50">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
