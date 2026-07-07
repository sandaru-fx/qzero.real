import Image from 'next/image';

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const galleryImages = images.length > 0 ? images : ['/qzero-logo.png'];

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-black">
      {/* ── Main scroll gallery ── */}
      <div
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {galleryImages.map((image, index) => (
          <div
            id={`vehicle-image-${index}`}
            key={`${image}-${index}`}
            className="relative aspect-[16/10] min-w-full snap-center"
          >
            <Image
              src={image}
              alt={`${title} image ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* ── Thumbnail strip ── */}
      {galleryImages.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto border-t border-white/5 bg-brand-card p-3"
          style={{ scrollbarWidth: 'none' }}
        >
          {galleryImages.map((image, index) => (
            <a
              key={`${image}-thumb-${index}`}
              href={`#vehicle-image-${index}`}
              className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 opacity-60 transition-all duration-300 hover:border-brand-gold/50 hover:opacity-100"
              aria-label={`View image ${index + 1}`}
            >
              <Image src={image} alt="" fill sizes="96px" className="object-cover" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
