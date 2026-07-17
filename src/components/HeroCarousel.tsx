"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_MS = 5500;

/** Bright showroom / people+vehicle slides — airier Indra-style light feel */
const HERO_SLIDES = [
  {
    src: "/lifestyle/import-hero.png",
    alt: "Happy customers receiving keys in the QZERO showroom",
    // People + keys: keep faces in frame on tall phones
    position: "object-[center_32%] sm:object-[center_28%]",
  },
  {
    src: "/lifestyle/about-what-drives-us.png",
    alt: "Family choosing their next vehicle with our team",
    position: "object-[center_42%] sm:object-[center_35%]",
  },
  {
    src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=85",
    alt: "Premium vehicle in bright daylight",
    position: "object-[center_45%] sm:object-center",
  },
  {
    src: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1920&q=85",
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
              quality={85}
              className={`object-cover ${slide.position} brightness-[1.04] contrast-[1.02] saturate-[1.03] sm:brightness-[1.06] sm:contrast-[1.03] sm:saturate-[1.04] ${
                active ? "hero-ken-burns" : ""
              }`}
            />
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-black/10 sm:from-black/50 sm:via-black/15 sm:to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-black/20 sm:from-brand-black/70 sm:to-black/5" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-brand-black to-transparent sm:h-28 sm:from-brand-black/80" />

      {/* Dots sit low so they don't collide with CTAs on short phones */}
      <div className="absolute bottom-5 left-1/2 z-20 flex w-[min(280px,70vw)] -translate-x-1/2 flex-col items-center gap-2.5 sm:bottom-8 sm:gap-3">
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
