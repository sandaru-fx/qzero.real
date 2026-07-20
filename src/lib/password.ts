import { createHash, timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;
const LEGACY_SHA256 = /^[a-f0-9]{64}$/i;

function sha256Hex(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

/** bcrypt hash for new passwords / re-hash after legacy login */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function isLegacyPasswordHash(storedHash: string): boolean {
  return LEGACY_SHA256.test(storedHash) && !storedHash.startsWith('$2');
}

/**
 * Verify password against bcrypt (preferred) or legacy unsalted SHA-256.
 * Callers should re-hash with hashPassword() when isLegacyPasswordHash is true.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) return false;

  if (
    storedHash.startsWith('$2a$') ||
    storedHash.startsWith('$2b$') ||
    storedHash.startsWith('$2y$')
  ) {
    return bcrypt.compare(password, storedHash);
  }

  if (isLegacyPasswordHash(storedHash)) {
    const legacy = sha256Hex(password);
    try {
      return timingSafeEqual(Buffer.from(legacy, 'utf8'), Buffer.from(storedHash.toLowerCase(), 'utf8'));
    } catch {
      return false;
    }
  }

  return false;
}
