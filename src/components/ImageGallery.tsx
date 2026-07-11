'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const galleryImages = images.length > 0 ? images : ['/qzero-logo.png'];
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const clamped = (index + galleryImages.length) % galleryImages.length;
      setActiveIndex(clamped);
    },
    [galleryImages.length],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-black">
      {/* ── Main image with arrows ── */}
      <div className="relative aspect-[16/10]">
        <Image
          src={galleryImages[activeIndex]}
          alt={`${title} image ${activeIndex + 1}`}
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          priority
          className="object-cover"
        />

        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-300 hover:bg-brand-gold hover:text-black"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-300 hover:bg-brand-gold hover:text-black"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {activeIndex + 1} / {galleryImages.length}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {galleryImages.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto border-t border-white/5 bg-brand-card p-3"
          style={{ scrollbarWidth: 'none' }}
        >
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-thumb-${index}`}
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
  );
}
