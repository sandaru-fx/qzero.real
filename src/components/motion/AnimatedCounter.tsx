'use client';

import { useEffect, useRef, useState } from 'react';

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  label: string;
  durationMs?: number;
};

export default function AnimatedCounter({
  value,
  suffix = '',
  label,
  durationMs = 1400,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, durationMs]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        <span className="gold-text">
          {display}
          {suffix}
        </span>
      </p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-muted sm:text-base">
        {label}
      </p>
    </div>
  );
}
