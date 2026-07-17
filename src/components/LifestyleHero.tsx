import type { ReactNode } from 'react';
import Image from 'next/image';

type LifestyleHeroProps = {
  image: string;
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbs?: string;
  objectPosition?: string;
  minHeight?: string;
  children?: ReactNode;
};

export default function LifestyleHero({
  image,
  eyebrow,
  title,
  description,
  breadcrumbs,
  objectPosition = 'center 35%',
  minHeight = 'min-h-[52svh] sm:min-h-[58svh]',
  children,
}: LifestyleHeroProps) {
  return (
    <section className={`relative overflow-hidden border-b border-white/5 ${minHeight}`}>
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-black/10 to-black/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,0.08),transparent_55%)]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-14 lg:px-9 lg:pb-16">
        {breadcrumbs && (
          <p className="type-meta mb-4 text-white/50">{breadcrumbs}</p>
        )}
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="type-body mt-5 max-w-2xl text-gray-200">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
