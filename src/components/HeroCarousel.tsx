"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_MS = 5500;

/** HD lifestyle JPEGs + Unsplash cars — same scenes as desktop */
const HERO_SLIDES = [
  {
    src: "/lifestyle/import-hero.jpg",
    alt: "Happy customers receiving keys in the QZERO showroom",
    position: "object-center",
  },
  {
    src: "/lifestyle/about-what-drives-us.jpg",
    alt: "Family choosing their next vehicle with our team",
    position: "object-[center_40%] sm:object-center",
  },
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=90",
    alt: "Luxury sports car in dramatic lighting",
    position: "object-[center_42%] sm:object-[center_35%]",
  },
  {
    src: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=2400&q=90",
    alt: "Luxury SUV under clear skies",
    position: "object-[center_40%] sm:object-[center_35%]",
  },
];

export default function HeroCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mountedSlides, setMountedSlides] = useState(() => new Set([0]));

  const goTo = useCallback((index: number) => {
    setSelectedIndex(index);
    setProgressKey((k) => k + 1);
    setMountedSlides((prev) => {
      const next = new Set(prev);
      next.add(index);
      next.add((index + 1) % HERO_SLIDES.length);
      return next;
    });
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSelectedIndex((i) => {
        const next = (i + 1) % HERO_SLIDES.length;
        setMountedSlides((prev) => {
          const set = new Set(prev);
          set.add(next);
          set.add((next + 1) % HERO_SLIDES.length);
          return set;
        });
        return next;
      });
      setProgressKey((k) => k + 1);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setMountedSlides((prev) => new Set(prev).add(1));
    }, 1200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_SLIDES.map((slide, i) => {
        if (!mountedSlides.has(i)) return null;
        const active = i === selectedIndex;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1000ms] ease-out ${
              active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              quality={90}
              className={`object-cover ${slide.position} brightness-[1.05] contrast-[1.04] saturate-[1.05] sm:brightness-[1.06] ${
                active ? "hero-ken-burns" : ""
              }`}
            />
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-black/15 sm:from-black/50 sm:via-black/15 sm:to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/85 via-transparent to-black/25 sm:from-brand-black/70 sm:to-black/5" />

      <div className="absolute bottom-2.5 left-1/2 z-20 flex w-[min(240px,65vw)] -translate-x-1/2 flex-col items-center gap-1.5 sm:bottom-8 sm:w-[min(280px,70vw)] sm:gap-3">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/15">
          <div
            key={progressKey}
            className={`h-full origin-left rounded-full bg-brand-gold ${
              paused ? "hero-progress-paused" : "hero-progress"
            }`}
            style={{ animationDuration: `${SLIDE_MS}ms` }}
          />
        </div>
        <div className="flex gap-2">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === selectedIndex
                  ? "w-8 bg-brand-gold"
                  : "w-2 bg-white/40 hover:bg-white/65"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
