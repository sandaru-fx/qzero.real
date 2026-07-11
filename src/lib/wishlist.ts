const STORAGE_KEY = 'qzero_wishlist';

export function readWishlistIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function writeWishlistIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent('qzero-wishlist-change', { detail: ids }));
}

export function toggleWishlistId(id: string): string[] {
  const current = readWishlistIds();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  writeWishlistIds(next);
  return next;
}

export { STORAGE_KEY };
