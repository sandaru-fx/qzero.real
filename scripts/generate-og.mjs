import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const W = 1200;
const H = 630;

const bg = await sharp('public/lifestyle/import-hero.jpg')
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.72, saturation: 0.9 })
  .toBuffer();

const overlay = Buffer.from(`<svg width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="60" y="290" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" fill="#ffffff">Qzero International</text>
  <text x="60" y="360" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="600" fill="#D4AF37">Pvt Ltd · Premium Vehicles · Sri Lanka</text>
  <text x="60" y="520" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#ffffff" fill-opacity="0.9">qzero.lk</text>
</svg>`);

const logo = await sharp('public/qzero-favicon.png').resize(140, 140).png().toBuffer();

await sharp(bg)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 70, left: 60 },
  ])
  .jpeg({ quality: 88 })
  .toFile('public/og-default.jpg');

console.log('Created public/og-default.jpg');
