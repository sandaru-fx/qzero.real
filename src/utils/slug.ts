export function createVehicleSlug(brand: string, model: string): string {
  const baseSlug = `${brand} ${model}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const uniqueSuffix = Date.now().toString(36);
  return `${baseSlug || 'vehicle'}-${uniqueSuffix}`;
}
