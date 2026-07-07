import Image from 'next/image';

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const galleryImages = images.length > 0 ? images : ['/qzero-logo.png'];

  return (
    <div className="overflow-hidden rounded-lg border border-brand-line bg-black">
      <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {galleryImages.map((image, index) => (
          <div id={`vehicle-image-${index}`} key={`${image}-${index}`} className="relative aspect-[16/10] min-w-full snap-center">
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
      {galleryImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-t border-brand-line p-3">
          {galleryImages.map((image, index) => (
            <a
              key={`${image}-thumb-${index}`}
              href={`#vehicle-image-${index}`}
              className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-brand-line"
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
