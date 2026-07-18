'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Percent,
  ExternalLink,
  Plus,
  Star,
} from 'lucide-react';
import { logoutAdmin } from '@/actions/auth';

const mainNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Inventory', href: '/admin/inventory', icon: Car },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
];

const contentNav = [
  { label: 'Promotions', href: '/admin/promotions', icon: Percent },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
];

const systemNav = [{ label: 'Settings', href: '/admin/settings', icon: Settings }];

function getBreadcrumbs(pathname: string) {
  if (pathname === '/admin' || pathname === '/admin/') {
    return [{ label: 'Admin', href: '/admin' }, { label: 'Dashboard' }];
  }
  if (pathname.startsWith('/admin/inventory')) {
    return [{ label: 'Admin', href: '/admin' }, { label: 'Inventory' }];
  }
  if (pathname.startsWith('/admin/inquiries')) {
    return [{ label: 'Admin', href: '/admin' }, { label: 'Inquiries' }];
  }
  if (pathname.startsWith('/admin/promotions')) {
    return [{ label: 'Admin', href: '/admin' }, { label: 'Promotions' }];
  }
  if (pathname.startsWith('/admin/reviews')) {
    return [{ label: 'Admin', href: '/admin' }, { label: 'Reviews' }];
  }
  if (pathname.startsWith('/admin/settings')) {
    return [{ label: 'Admin', href: '/admin' }, { label: 'Settings' }];
  }
  if (pathname.startsWith('/admin/vehicles/new')) {
    return [
      { label: 'Admin', href: '/admin' },
      { label: 'Inventory', href: '/admin/inventory' },
      { label: 'Add Vehicle' },
    ];
  }
  if (pathname.match(/^\/admin\/vehicles\/[^/]+$/)) {
    return [
      { label: 'Admin', href: '/admin' },
      { label: 'Inventory', href: '/admin/inventory' },
      { label: 'Edit Vehicle' },
    ];
  }
  return [{ label: 'Admin', href: '/admin' }];
}

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin' || pathname === '/admin/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-base font-semibold transition-all duration-200 ${
        active
          ? 'bg-brand-gold/10 text-brand-gold shadow-[inset_3px_0_0_0_#D4AF37]'
          : 'text-gray-300 hover:bg-white/[0.04] hover:text-white'
      }`}
    >
      <Icon
        className={`h-5 w-5 shrink-0 transition-colors ${
          active ? 'text-brand-gold' : 'text-gray-500 group-hover:text-gray-300'
        }`}
      />
      <span className={active ? 'gold-text' : ''}>{label}</span>
    </Link>
  );
}

function NavSection({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: typeof mainNav;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="mb-2.5 px-3.5 text-xs font-bold uppercase tracking-[0.22em] text-brand-muted/80">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(pathname, item.href)}
            onClick={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const breadcrumbs = getBreadcrumbs(pathname);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="admin-shell min-h-screen text-white">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-white/[0.06] bg-[#0A0A0A]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/[0.06] px-5">
          <Link href="/admin" className="flex items-center gap-3" onClick={closeMobile}>
            <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-brand-gold/35 bg-black shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <Image src="/qzero-logo.png" alt="QZERO" width={40} height={40} className="object-contain" />
            </span>
            <div>
              <p className="text-[15px] font-bold tracking-wide text-white">QZERO</p>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                Control Center
              </p>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-brand-muted hover:bg-white/5 hover:text-white lg:hidden"
            onClick={closeMobile}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 pt-5">
          <Link
            href="/admin/vehicles/new"
            onClick={closeMobile}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3.5 py-3 text-base font-bold text-black gold-gradient shadow-[0_8px_24px_rgba(212,175,55,0.2)] transition-all hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Link>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          <NavSection title="Main" items={mainNav} pathname={pathname} onNavigate={closeMobile} />
          <NavSection title="Content" items={contentNav} pathname={pathname} onNavigate={closeMobile} />
          <NavSection title="System" items={systemNav} pathname={pathname} onNavigate={closeMobile} />
        </nav>

        <div className="space-y-2 border-t border-white/[0.06] p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center gap-3 rounded-xl border border-brand-gold/20 bg-brand-gold/[0.06] px-3.5 py-3 text-base font-semibold text-brand-gold transition-all hover:border-brand-gold/40 hover:bg-brand-gold/10"
          >
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            View live site
          </a>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-base font-semibold text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#050505]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-white/10 p-2 text-brand-muted transition-colors hover:border-brand-gold/30 hover:text-brand-gold lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="flex min-w-0 items-center gap-1.5 overflow-hidden text-base">
              {breadcrumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-brand-muted/60" />}
                  {crumb.href && index < breadcrumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className="truncate text-brand-muted transition-colors hover:text-brand-gold"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={`truncate ${
                        index === breadcrumbs.length - 1
                          ? 'font-semibold text-white'
                          : 'text-brand-muted'
                      }`}
                    >
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/inquiries"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-brand-muted transition-colors hover:border-brand-gold/30 hover:text-brand-gold sm:inline-flex"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Inquiries
            </Link>
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-[#111111]/90 py-1.5 pl-1.5 pr-3.5 shadow-lg shadow-black/20">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold ring-1 ring-brand-gold/20">
                <User className="h-4 w-4" />
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-none text-white">Admin</p>
                <p className="mt-1 text-xs leading-none text-brand-muted">QZERO International</p>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
