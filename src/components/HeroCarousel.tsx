"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const HERO_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80",
    alt: "Luxury sports car on scenic road",
  },
  {
    src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80",
    alt: "Premium sedan in showroom lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&q=80",
    alt: "Elegant coupe with dramatic backdrop",
  },
  {
    src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80",
    alt: "Luxury vehicle on open highway",
  },
];

export default function HeroCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  return (
    <>
      {/* Embla viewport */}
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className={`relative h-full min-w-0 flex-[0_0_100%] ${
                i === selectedIndex ? "hero-slide-active" : ""
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
                quality={85}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rich dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/60 to-black/30" />

      {/* Extra bottom fade for search bar readability */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent" />

      {/* Dot indicators */}
      <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-32">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === selectedIndex
                ? "w-8 bg-brand-gold"
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </>
  );
}
