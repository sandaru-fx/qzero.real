import type { ReactNode } from 'react';
import Image from 'next/image';

type LifestyleHeroProps = {
  image: string;
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbs?: string;
  objectPosition?: string;
  /** Desktop min-height only — mobile uses a landscape photo band so the full scene shows */
  minHeight?: string;
  children?: ReactNode;
  /** Optional right-side block (desktop) / below copy (mobile) */
  aside?: ReactNode;
};

export default function LifestyleHero({
  image,
  eyebrow,
  title,
  description,
  breadcrumbs,
  objectPosition = 'center 35%',
  minHeight = 'sm:min-h-[58svh]',
  children,
  aside,
}: LifestyleHeroProps) {
  return (
    <section
      className={`relative overflow-hidden border-b border-white/5 bg-brand-black ${minHeight}`}
    >
      {/*
        Mobile: landscape photo band (less crop — same idea as home hero).
        Desktop: full-bleed cinematic image behind copy.
      */}
      <div className="relative aspect-[16/10] w-full sm:absolute sm:inset-0 sm:aspect-auto">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
          style={{ objectPosition }}
        />
        {/* Mobile: light veil. Desktop: stronger cinematic overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15 sm:from-transparent sm:via-transparent sm:to-transparent" />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-black/65 via-black/30 to-transparent sm:block" />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-brand-black/90 via-black/10 to-black/5 sm:block" />
        <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,0.08),transparent_55%)] sm:block" />
      </div>

      {/*
        Mobile: solid dark panel under the photo.
        Desktop: copy overlaid on the image (left-aligned + optional aside).
      */}
      <div className="relative z-10 border-t border-white/10 bg-[#070707] px-4 pb-10 pt-8 sm:absolute sm:inset-0 sm:flex sm:flex-col sm:justify-end sm:border-0 sm:bg-transparent sm:px-6 sm:pb-14 sm:pt-28 lg:px-9 lg:pb-16">
        <div className="mx-auto w-full max-w-[1600px] text-center sm:pr-[min(28rem,42%)] sm:text-left">
          {breadcrumbs && (
            <p className="type-meta mb-4 text-white/50">{breadcrumbs}</p>
          )}
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">{eyebrow}</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:mx-0 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="type-body mx-auto mt-4 max-w-2xl text-gray-300 sm:mx-0 sm:mt-5 sm:text-gray-200">
              {description}
            </p>
          )}
          {children ? (
            <div className="mx-auto mt-6 max-w-2xl sm:mx-0">{children}</div>
          ) : null}
        </div>

        {aside ? (
          <div className="mt-10 w-full sm:absolute sm:bottom-14 sm:right-6 sm:mt-0 sm:w-[min(100%,26rem)] lg:bottom-16 lg:right-9 xl:right-12">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}
