import { createHash } from 'crypto';

/** Password hashing helper — must NOT live in a 'use server' file (exports there must be async). */
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}
