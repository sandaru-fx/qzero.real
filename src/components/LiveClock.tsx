'use client';

import { useEffect, useState } from 'react';

export default function LiveClock() {
  const [timeData, setTimeData] = useState<{ time: string; date: string } | null>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Colombo',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      const date = now.toLocaleDateString('en-US', {
        timeZone: 'Asia/Colombo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setTimeData({ time: time.toLowerCase(), date });
    };

    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeData) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-gray-700 animate-pulse" />
        <span className="font-mono text-gray-600">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold/50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-gold" />
      </span>
      <span className="font-mono tracking-tight">
        {timeData.time} <span className="mx-1.5 text-white/20">|</span> Sri Lanka <span className="mx-1.5 text-white/20">|</span> {timeData.date}
      </span>
    </div>
  );
}
