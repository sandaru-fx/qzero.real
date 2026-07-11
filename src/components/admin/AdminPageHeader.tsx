import Link from 'next/link';
import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="type-muted mt-2 max-w-2xl">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function AdminPrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-bold text-black gold-gradient shadow-[0_0_24px_rgba(212,175,55,0.22)] transition-all duration-300 hover:scale-[1.02] hover:opacity-95"
    >
      {children}
    </Link>
  );
}

export function AdminPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#141414] to-[#0F0F0F] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}
