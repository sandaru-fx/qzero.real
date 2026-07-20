import { headers } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

export const RATE_LIMIT_MESSAGE = 'Too many requests. Please try again later.';

type RateLimitResult =
  | { ok: true }
  | { ok: false; error: string };

function isKvConfigured(): boolean {
  return Boolean(
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
      (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

/**
 * `@vercel/kv` reads KV_REST_API_*. If only Upstash Marketplace vars exist, mirror them.
 */
function ensureKvEnvAliases() {
  if (!process.env.KV_REST_API_URL && process.env.UPSTASH_REDIS_REST_URL) {
    process.env.KV_REST_API_URL = process.env.UPSTASH_REDIS_REST_URL;
  }
  if (!process.env.KV_REST_API_TOKEN && process.env.UPSTASH_REDIS_REST_TOKEN) {
    process.env.KV_REST_API_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  }
}

let loginLimiter: Ratelimit | null = null;
let publicFormLimiter: Ratelimit | null = null;

function getLoginLimiter(): Ratelimit | null {
  if (!isKvConfigured()) return null;
  ensureKvEnvAliases();
  if (!loginLimiter) {
    loginLimiter = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: 'rl:admin-login',
    });
  }
  return loginLimiter;
}

function getPublicFormLimiter(): Ratelimit | null {
  if (!isKvConfigured()) return null;
  ensureKvEnvAliases();
  if (!publicFormLimiter) {
    publicFormLimiter = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'rl:public-form',
    });
  }
  return publicFormLimiter;
}

/** Best-effort client IP from reverse-proxy headers (Vercel / common proxies). */
export async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get('x-forwarded-for');
    if (forwarded) {
      const first = forwarded.split(',')[0]?.trim();
      if (first) return first;
    }
    const realIp = h.get('x-real-ip')?.trim();
    if (realIp) return realIp;
    const vercel = h.get('x-vercel-forwarded-for')?.trim();
    if (vercel) return vercel.split(',')[0]?.trim() || vercel;
  } catch {
    // headers() unavailable in some contexts
  }
  return 'unknown';
}

async function enforce(
  limiter: Ratelimit | null,
  key: string
): Promise<RateLimitResult> {
  if (!limiter) {
    // KV not configured — do not crash; skip limiting (local/dev)
    return { ok: true };
  }

  try {
    const { success } = await limiter.limit(key);
    if (!success) {
      return { ok: false, error: RATE_LIMIT_MESSAGE };
    }
    return { ok: true };
  } catch (error) {
    console.error('[rate-limit] Redis error — allowing request:', error);
    return { ok: true };
  }
}

/** Admin login: 5 attempts / 15 minutes / IP */
export async function rateLimitAdminLogin(): Promise<RateLimitResult> {
  const ip = await getClientIp();
  return enforce(getLoginLimiter(), `login:${ip}`);
}

/** Public forms (contact, review submit, review image upload): 3 / hour / IP */
export async function rateLimitPublicForm(action: string): Promise<RateLimitResult> {
  const ip = await getClientIp();
  return enforce(getPublicFormLimiter(), `form:${action}:${ip}`);
}
