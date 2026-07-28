'use client';

import { useState, useCallback, useEffect, useRef, type TouchEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const galleryImages = images.length > 0 ? images : ['/qzero-logo.png'];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      const clamped = (index + galleryImages.length) % galleryImages.length;
      setActiveIndex(clamped);
    },
    [galleryImages.length]
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (e.key === 'ArrowRight') goTo(activeIndex + 1);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, activeIndex, goTo]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) goTo(activeIndex - 1);
    else goTo(activeIndex + 1);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-white/5 bg-black">
        <div
          className="relative aspect-[16/10] cursor-zoom-in"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={galleryImages[activeIndex]}
            alt={`${title} image ${activeIndex + 1}`}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority
            quality={90}
            className="object-contain object-center"
          />

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex - 1);
                }}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-300 hover:bg-brand-gold hover:text-black"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex + 1);
                }}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-300 hover:bg-brand-gold hover:text-black"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {activeIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}

          <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md">
            <Expand className="h-4 w-4" />
          </span>
        </div>

        {galleryImages.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto border-t border-white/5 bg-brand-card p-3"
            style={{ scrollbarWidth: 'none' }}
          >
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-thumb-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
                  index === activeIndex
                    ? 'border-brand-gold opacity-100 ring-1 ring-brand-gold'
                    : 'border-white/10 opacity-60 hover:border-brand-gold/50 hover:opacity-100'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image src={image} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close lightbox"
            onClick={() => setLightboxOpen(false)}
          />
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:text-brand-gold"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-gold hover:text-black sm:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-gold hover:text-black sm:right-6"
                aria-label="Next image"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <div
            className="relative z-[1] h-[70vh] w-full max-w-5xl"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[activeIndex]}
              alt={`${title} enlarged ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
