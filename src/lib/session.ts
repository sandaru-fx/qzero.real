import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'qzero_admin_session';
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = {
  sub: string;
  email: string;
  exp: number;
};

function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET?.trim() || process.env.AUTH_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Local-only fallback so `next dev` works without .env — never use in production
  return 'dev-only-qzero-session-secret-min-32-chars';
}

function sign(payloadB64: string, secret: string): string {
  return createHmac('sha256', secret).update(payloadB64).digest('base64url');
}

/** Create a signed admin session token (HMAC). Not forgeable without SESSION_SECRET. */
export function createAdminSessionToken(adminId: string, email: string): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('SESSION_SECRET (min 32 characters) must be set in production.');
  }

  const payload: SessionPayload = {
    sub: adminId,
    email,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SEC,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${payloadB64}.${sign(payloadB64, secret)}`;
}

export function verifyAdminSessionToken(token: string): SessionPayload | null {
  if (!token || !token.includes('.')) return null;

  const secret = getSessionSecret();
  if (!secret) return null;

  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return null;

  const expected = sign(payloadB64, secret);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const raw = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as SessionPayload;
    if (!raw?.sub || !raw?.email || typeof raw.exp !== 'number') return null;
    if (raw.exp < Math.floor(Date.now() / 1000)) return null;
    return raw;
  } catch {
    return null;
  }
}

/** Generate a strong secret for .env (run once locally if needed). */
export function generateSessionSecret(): string {
  return randomBytes(48).toString('base64url');
}
