# FOODLY — Krishnagiri Food Delivery Web App

> **Continuing this in an AI IDE (Antigravity, Cursor, Claude Code, etc.)?**
> Read `AGENTS.md` first — it has the architecture map, design system rules,
> and what's deliberately out of scope.

A full-stack food delivery platform for real restaurants in Krishnagiri, Tamil Nadu, built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase (Postgres + Auth).

## Features
- Real Krishnagiri restaurants (Hotel Sri Rajeshwari, Annapoorna Classic, Srirangam Cafe, Salem RR Biryani, Feast Pizza, Meat And Eat, Anu Krishna Sweets and Bakery, Belgium Bliss) with real ratings/localities, cross-checked against live Swiggy listings
- Home, restaurant listing with filters, restaurant detail with categorized menu
- Cart, simplified 2-step checkout (address+payment together → confirm), single total shown throughout (no line-item breakdown)
- Order placed as a real database row, live order tracking with a 6-step status timeline
- Order history with search (by restaurant or order ID) and reorder
- Favorites — save restaurants, view them on `/favorites`
- **Real authentication** (Supabase Auth, email/password) with three roles: customer, restaurant owner, admin
- Role-protected routes via middleware (`/restaurant/dashboard`, `/admin/dashboard`, `/checkout`, `/account`, `/orders`, `/favorites`)
- Restaurant dashboard: stats, live incoming orders, advance order status, **and full menu management (add/edit/delete your own menu items)**
- Admin dashboard (platform-wide stats, restaurant list)
- Privilege-escalation protection: a database trigger stops a logged-in user from setting their own `role` or `restaurant_id` — only an admin (or direct SQL access) can do that

## Tech stack
Next.js 14 App Router · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, Row Level Security) · lucide-react icons

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` (already points at the live project's public URL + anon key — safe to keep, this is the publishable key, not a secret)
3. `npm run dev` → open http://localhost:3000

The Supabase project is already live and seeded (restaurants, menu items, 8 real Krishnagiri restaurants). If you want your **own** Supabase project instead, run `supabase/schema.sql` in a fresh project's SQL editor and update `.env.local`.

## Running & maintaining day to day
```bash
npm run dev      # local dev server, http://localhost:3000, hot reload
npm run build    # production build — ALWAYS run this before pushing/deploying;
                  # it catches real TypeScript errors a visual check misses
npm run start    # runs the production build locally (run `npm run build` first)
npm run lint     # ESLint
```
Database changes go through the Supabase SQL editor (Dashboard → SQL Editor)
or the Supabase CLI if you install it — this repo doesn't use a migration
tool, `supabase/schema.sql` is a manually-kept reference copy of what's live.
When you change the schema, update that file in the same commit.

## Deploying
This is a standard Next.js app — no special build steps. **Vercel** (made by
the Next.js team) is the simplest option:
```bash
npm install -g vercel     # one-time
vercel login               # one-time, opens a browser to authenticate
vercel                     # first deploy — follow the prompts, it detects Next.js automatically
vercel --prod               # every deploy after that, once you're happy with a preview
```
Either let `vercel` prompt you for the two environment variables on first
deploy, or set them ahead of time:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```
(values are in `.env.example` — the anon key is safe to use here, it's
publishable by design, not a secret). After deploying, add the deployed URL
to Supabase under Authentication → URL Configuration → Redirect URLs, or
email confirmation links after signup will point back to `localhost`.

If you'd rather not use Vercel: `npm run build && npm run start` works on any
host that can run a Node process (Railway, Render, a plain VPS, etc.) — just
set the same two environment variables there.

## Adding your own restaurant photos
Restaurant cards currently show a generated brand-mark badge (monogram + gradient) layered over the restaurant's Google Places photo, since most of these small local businesses don't have official downloadable logos. To swap in your own photos:
1. Add your image files under `public/restaurants/`
2. Update the `hero_image` column for each restaurant in Supabase (Table Editor → `restaurants`), or run an `UPDATE` statement pointing to `/restaurants/your-file.jpg`
3. Same pattern for dish photos via `menu_items.image_url`

## Setting up roles for your submission/demo
- **Customer**: anyone who signs up with the "Customer" option — no extra step.
- **Restaurant owner**: sign up with the "Restaurant owner" option, then in Supabase SQL editor link them to a restaurant:
  ```sql
  update profiles set restaurant_id = 'r1' where email = 'owner@example.com';
  ```
- **Admin**: no public signup path (by design). Promote an existing account:
  ```sql
  update profiles set role = 'admin' where email = 'you@example.com';
  ```

## Project structure
```
src/app/            Next.js App Router pages
src/components/      Shared UI (Header, BottomNav, RestaurantCard, RestaurantMark, FoodImage)
src/lib/             Supabase clients, cart context, shared types
src/middleware.ts    Role-based route protection
supabase/schema.sql  Full DB schema for reference / self-hosting
```

## Known limitations (be upfront about these in a viva)
- Payment is a mocked 3-option selector (UPI/Card/COD) — no real payment gateway is integrated.
- Order status auto-advances on a timer to simulate a kitchen workflow; a real deployment would replace this with restaurant-side actions only.
- Restaurant images are a mix of real Google Places photos (with attribution) and generated brand marks — see "Adding your own restaurant photos" above to replace them with your own.
