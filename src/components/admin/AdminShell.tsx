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
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Percent,
  ExternalLink,
} from 'lucide-react';
import { logoutAdmin } from '@/actions/auth';

const mainNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Inventory', href: '/admin/inventory', icon: Car },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
];

const contentNav = [
  { label: 'Promotions', href: '/admin/promotions', icon: Percent },
];

const systemNav = [
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

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
      className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-base font-semibold transition-all duration-200 ${
        active
          ? 'bg-brand-gold/10 text-brand-gold shadow-[inset_3px_0_0_0_#D4AF37]'
          : 'text-gray-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-brand-gold' : 'text-gray-400'}`} />
      <span className={active ? 'gold-text' : ''}>{label}</span>
    </Link>
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
    <div className="min-h-screen bg-[#050505] text-white">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/5 bg-[#0A0A0A] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/5 px-5">
          <Link href="/admin" className="flex items-center gap-3" onClick={closeMobile}>
            <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-brand-gold/30 bg-black">
              <Image src="/qzero-logo.png" alt="QZERO" width={40} height={40} className="object-contain" />
            </span>
            <div>
              <p className="text-base font-bold tracking-wide text-white">QZERO</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">Admin</p>
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

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          <div>
            <p className="mb-2.5 px-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-muted">
              Main
            </p>
            <div className="space-y-1">
              {mainNav.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={isActive(pathname, item.href)}
                  onClick={closeMobile}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2.5 px-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-muted">
              Content
            </p>
            <div className="space-y-1">
              {contentNav.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={isActive(pathname, item.href)}
                  onClick={closeMobile}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2.5 px-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-muted">
              System
            </p>
            <div className="space-y-1">
              {systemNav.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={isActive(pathname, item.href)}
                  onClick={closeMobile}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="space-y-2 border-t border-white/5 p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center gap-3.5 rounded-xl border border-brand-gold/20 bg-brand-gold/5 px-3.5 py-3 text-base font-semibold text-brand-gold transition-all hover:border-brand-gold/40 hover:bg-brand-gold/10"
          >
            <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            View Website
          </a>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-base font-semibold text-gray-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#050505]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-white/10 p-2 text-brand-muted hover:border-brand-gold/30 hover:text-brand-gold lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-brand-muted" />}
                  {crumb.href && index < breadcrumbs.length - 1 ? (
                    <Link href={crumb.href} className="text-brand-muted transition-colors hover:text-brand-gold">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={index === breadcrumbs.length - 1 ? 'font-medium text-white' : 'text-brand-muted'}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative rounded-full border border-white/10 p-2.5 text-brand-muted transition-colors hover:border-brand-gold/30 hover:text-brand-gold"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-gold" />
            </button>
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-[#111111] py-1.5 pl-1.5 pr-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                <User className="h-4 w-4" />
              </span>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white">Admin</p>
                <p className="text-[10px] text-brand-muted">QZERO International</p>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] bg-[#050505] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
