'use server';

import connectToDatabase from '@/lib/mongodb';
import WhatsAppClick from '@/models/WhatsAppClick';
import { protectServerAction } from '@/lib/auth';
import type { WhatsAppClickSource, WhatsAppClickStats } from '@/types/whatsapp-click';

const VALID_SOURCES: WhatsAppClickSource[] = [
  'floating',
  'vehicle_inquire',
  'contact_owner',
  'contact_manager',
];

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysAgo(n: number) {
  const x = startOfDay();
  x.setDate(x.getDate() - n);
  return x;
}

/** Public — record a WhatsApp CTA click (fire-and-forget from the client). */
export async function trackWhatsAppClick(input: {
  source: WhatsAppClickSource;
  vehicleSlug?: string;
}) {
  try {
    const source = input.source;
    if (!VALID_SOURCES.includes(source)) {
      return { success: false as const };
    }
    await connectToDatabase();
    await WhatsAppClick.create({
      source,
      vehicleSlug: input.vehicleSlug?.trim() || '',
    });
    return { success: true as const };
  } catch {
    return { success: false as const };
  }
}

/** Admin — dashboard counts */
export async function getWhatsAppClickStats(): Promise<WhatsAppClickStats> {
  const empty: WhatsAppClickStats = {
    todayTotal: 0,
    todayFloating: 0,
    todayVehicleInquire: 0,
    todayContact: 0,
    weekTotal: 0,
    weekFloating: 0,
    weekVehicleInquire: 0,
    weekContact: 0,
    allTimeTotal: 0,
  };

  try {
    await protectServerAction();
    await connectToDatabase();

    const today = startOfDay();
    const week = daysAgo(7);

    const [todayRows, weekRows, allTimeTotal] = await Promise.all([
      WhatsAppClick.aggregate<{ _id: WhatsAppClickSource; count: number }>([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      WhatsAppClick.aggregate<{ _id: WhatsAppClickSource; count: number }>([
        { $match: { createdAt: { $gte: week } } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      WhatsAppClick.countDocuments({}),
    ]);

    const sum = (
      rows: { _id: WhatsAppClickSource; count: number }[],
      source?: WhatsAppClickSource
    ) => {
      if (!source) return rows.reduce((n, r) => n + r.count, 0);
      return rows.find((r) => r._id === source)?.count ?? 0;
    };

    return {
      todayTotal: sum(todayRows),
      todayFloating: sum(todayRows, 'floating'),
      todayVehicleInquire: sum(todayRows, 'vehicle_inquire'),
      todayContact:
        sum(todayRows, 'contact_owner') + sum(todayRows, 'contact_manager'),
      weekTotal: sum(weekRows),
      weekFloating: sum(weekRows, 'floating'),
      weekVehicleInquire: sum(weekRows, 'vehicle_inquire'),
      weekContact:
        sum(weekRows, 'contact_owner') + sum(weekRows, 'contact_manager'),
      allTimeTotal,
    };
  } catch {
    return empty;
  }
}
