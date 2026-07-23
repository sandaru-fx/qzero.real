# Qzero International — Digital Showroom

Official website for **Qzero International Pvt Ltd** — premium vehicle showroom, import guidance, and client concierge.

- **Live site:** [https://qzero.lk](https://qzero.lk)
- **Stack:** Next.js (App Router), MongoDB, Cloudinary, Vercel

---

## Features

### Public site
- Home, showroom / vehicle listings, promotions, reviews, about, contact
- Vehicle detail pages with WhatsApp inquiry
- Client review submission (admin approval before publish)
- SEO: metadata, Open Graph, `sitemap.xml`, `robots.txt`

### Admin (`/admin`)
- Inventory CRUD, promotions, reviews moderation
- Inquiries, site settings
- Signed session auth + bcrypt passwords
- WhatsApp click interest stats on the dashboard

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment

Copy `.env.example` → `.env.local` and fill in values:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | Admin session signing (min 32 chars, **required in production**) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin bootstrap (only if DB has no admin) |
| `CLOUDINARY_*` | Image uploads |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Rate limiting (Upstash / Vercel KV) |
| `RESEND_API_KEY` | Optional contact email delivery |

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 4. Build

```bash
npm run build
npm start
```

---

## Useful scripts

```bash
npm run seed                 # seed sample vehicles
npm run seed:more            # more sample vehicles
npm run seed:reviews         # sample reviews
npm run seed:reviews:featured
```

---

## Project structure (high level)

```
src/app/(user)/     # Public pages
src/app/admin/      # Admin dashboard
src/actions/        # Server actions
src/components/     # UI + admin components
src/models/         # Mongoose models
src/config/         # Site config / layout
public/             # Static assets, favicon, lifestyle images
```

---

## Deploy (Vercel)

1. Connect the GitHub repo (`qzero.real`) to Vercel  
2. Add the same env vars under **Settings → Environment Variables**  
3. Attach custom domain **qzero.lk** / **www.qzero.lk**  
4. After deploy, verify:
   - https://qzero.lk/robots.txt  
   - https://qzero.lk/sitemap.xml  

---

## SEO / Search Console

1. Confirm meta tags on the live homepage  
2. Submit `https://www.qzero.lk` (or apex) in [Google Search Console](https://search.google.com/search-console)  
3. Submit sitemap: `sitemap.xml`  
4. Indexing can take a few days  

---

## Security notes

- Never commit `.env.local` or credential dumps  
- Production requires a strong `SESSION_SECRET`  
- Public forms and admin login are IP rate-limited when KV is configured  

---

## License

Private project for Qzero International Pvt Ltd. All rights reserved.
