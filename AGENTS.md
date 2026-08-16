# AGENTS.md — context for AI coding agents (Antigravity, Claude Code, Cursor, etc.)

Read this before making changes. It's the single source of truth for what this
project is, how it's structured, and what's already decided vs. still open.

## What this is
FOODLY — a food delivery web app for real restaurants in Krishnagiri, Tamil
Nadu, India. Built as a college project (Naan Mudhalvan initiative). The
person maintaining this (Shahid Khan / "Vegito") does not have laptop access
right now and is continuing this project from Google Antigravity using a
different LLM — you may be picking this up with zero prior context, hence
this file.

## Tech stack (do not swap without discussion)
- Next.js 14 App Router, TypeScript, Tailwind CSS
- Supabase: Postgres + Auth + Row Level Security (project ref `uaptqazhwegkawyjmvrj`,
  URL/anon key already in `.env.example` — this is the *publishable* key, safe
  to commit, not a secret)
- lucide-react for icons. No other UI kit (no shadcn, no MUI) — keep it that way.
- Cart state: React Context + `localStorage` (`src/lib/cart-context.tsx`) — NOT
  Supabase-backed. Only orders are persisted server-side.

## Architecture map
```
src/app/                     Next.js App Router pages (one folder per route)
  page.tsx                   Home — SERVER component, fetches restaurants directly
  restaurants/page.tsx       Listing — CLIENT component (filters need interactivity)
  restaurants/[id]/page.tsx  Detail + menu + add-to-cart — CLIENT component
  cart/, checkout/           Client components, use useCart() from cart-context
  orders/, orders/[id]/      Order history + live tracking (polls + advances status)
  login/, signup/            Supabase Auth email/password
  account/                   Profile + role-aware links
  restaurant/dashboard/      Restaurant-owner view — needs profiles.role = 'restaurant'
  admin/dashboard/           Admin view — needs profiles.role = 'admin'
src/components/              Header, BottomNav, RestaurantCard, RestaurantMark, FoodImage
src/lib/
  supabase/client.ts         Browser Supabase client (use in 'use client' components)
  supabase/server.ts         Server Supabase client (use in server components only)
  cart-context.tsx           Cart provider, localStorage-backed
  types.ts                   Shared TS types + STATUS_STEPS + money() formatter
src/middleware.ts            Role-based route protection (see below)
supabase/schema.sql          Full DB schema — reference copy of what's live in Supabase
```

## Auth & roles — how it actually works
1. Sign-up (`/signup`) calls `supabase.auth.signUp()` with `role` in
   `options.data` (customer or restaurant — admin has no public signup path).
2. A Postgres trigger `handle_new_user()` (see `supabase/schema.sql`) fires on
   `auth.users` insert and creates a matching row in `public.profiles` with
   that role.
3. `src/middleware.ts` reads the session cookie server-side and blocks
   `/checkout`, `/account`, `/orders`, `/restaurant/dashboard`, `/admin/*` for
   logged-out users or wrong roles, redirecting to `/login`.
4. **RLS policies in Postgres enforce the same rules independently of the
   frontend** — never assume the middleware is the only gate. If you add a
   new protected feature, add the RLS policy too, not just a frontend check.
5. To promote a test account to restaurant/admin, there's no UI for it by
   design — it's a manual SQL update (documented in README.md).

## Design system — "Tiffin Precision" (locked, do not change without asking)
This direction was deliberately chosen over two other options (a maximalist
"Market Stall" look and a structured "Banana Leaf Editorial" look) — don't
drift back toward either.

- **Palette** (Tailwind tokens in `tailwind.config.ts`): `mango` #E86A2E
  (the one saturated accent — use it for every primary action/highlight),
  `maroon` #C24A1D (hover/pressed state of the same accent — not a second
  brand color), `leaf` #4C7A5A (veg indicator only), `cream`/white canvas,
  `charcoal` #1E1B18 (text), `chip` #F7F3EC (neutral tag bg), `line` #E8E2D8
  (hairline borders — used instead of soft drop shadows almost everywhere),
  `ring` #F0DCC8 (the signature motif color).
- **Typography**: Space Grotesk (`font-display` class, headings/UI chrome) +
  IBM Plex Sans (body, default). Do not reintroduce Inter/Fraunces/Barlow
  Condensed — those were the previous direction, deliberately replaced.
- **Signature element**: concentric rings referencing a stacked steel tiffin
  carrier (`RestaurantMark.tsx`, and the homepage hero). This is the one
  "bold" moment in an otherwise restrained, hairline-border, minimal-shadow
  UI — keep new UI quiet and let the rings stay the memorable bit.
- Border radius is mostly sharp/minimal (`rounded-lg` at most on cards) — the
  earlier `rounded-2xl`/`rounded-3xl` soft-bubble look was the old direction.

## Restaurant images — deliberately NOT hotlinked photos everywhere
Real photographed logos for these 8 small local businesses aren't reliably
available. Current approach: real Google Places photos where available
(`restaurants.hero_image`, with a required "Photo: Google" attribution caption
— don't remove that caption, it's a Google Places API attribution requirement),
falling back to the ring/monogram brand mark if the photo 404s
(`RestaurantMark.tsx` handles this with `onError`). The person maintaining
this said they'll upload their own real restaurant photos eventually — when
that happens, just update `restaurants.hero_image` in Supabase, no code
changes needed.

## DONE — completed in this session, do not redo
- **Checkout simplified**: 2 steps (address+payment merged, confirm separate),
  single total shown everywhere (cart, checkout, tracking) instead of a
  subtotal/fee/tax breakdown, "demo payment" disclaimer removed. See
  `checkout/page.tsx` and `cart/page.tsx`.
- **Order search**: `orders/page.tsx` now has a text search box (restaurant
  name or order ID).
- **Favorites**: `favorites` table + RLS added, `FavoriteButton.tsx` heart
  toggle on every `RestaurantCard`, `/favorites` page, linked from
  `BottomNav`, desktop `Header`, and `account/page.tsx`. Route is
  auth-protected via middleware.
- **Restaurant owner menu CRUD**: `restaurant/dashboard/page.tsx` now has an
  Orders/Menu tab switcher; the Menu tab lets an owner add/edit/delete their
  own `menu_items` (RLS policies `owner insert/update/delete menu` enforce
  this server-side, scoped to `profiles.restaurant_id`).
- **Privilege-escalation gap closed**: see task 8 below, already fixed.
- **NOT done — real technical constraint, not a decision**: task 1's
  "download real photos and commit as local files" could not be completed —
  the environment that did this work had no network access to
  `foodish-api.com` or Google's photo CDN to actually download files. The
  *data layer* is ready for it (schema already supports `hero_image` /
  `image_url` pointing to local `/restaurants/...` or `/menu/...` paths, no
  migration needed) — an agent with real internet access still needs to do
  the actual fetching. Task 1 below is still open for exactly this reason.

## OPEN TASKS for the next agent (Antigravity/Gemini) — do these next
1. **Set real photos for every restaurant and every menu item — DECIDED, do this:**
   - **Agent sources the photos**, not the person — fetch real ones (Google
     Places API for restaurant photos; web search / a real food-photo source
     for each of the ~35 menu items, matched to the actual dish name).
   - **Download and commit them as local files**, not hotlinks — one file per
     restaurant under `public/restaurants/<restaurant-id>.jpg` and one per
     dish under `public/menu/<menu-item-id>.jpg`. Update
     `restaurants.hero_image` and `menu_items.image_url` in Supabase to point
     to the local `/restaurants/...` / `/menu/...` paths instead of external
     URLs. This removes the hotlink-reliability problem entirely.
   - Respect Google Places photo attribution requirements for any restaurant
     photo sourced that way (keep a visible "Photo: Google" credit — see
     `RestaurantMark.tsx`'s existing attribution caption pattern).
   - **Redesign the fallback** (`RestaurantMark.tsx`'s ring badge, and
     `FoodImage.tsx`'s gradient fallback) to complement real photography once
     it's mostly in place — it no longer needs to *be* the primary visual,
     just a graceful default for the rare missing image. Keep it consistent
     with the Tiffin Precision tokens (ring color, mango accent), just
     simpler/quieter than the current version.
2. ~~Simplify the billing/order flow~~ — **DONE, see "DONE" section above.**
3. ~~Give restaurant owners menu CRUD~~ — **DONE, see "DONE" section above.**
4. **Real payment gateway — future work, not urgent.** Currently fully
   mocked and that's fine for now. When it's time: Razorpay is the intended
   provider (standard for Indian UPI/card payments) — don't build toward
   Stripe or another gateway without checking back here first.
5. **Real-time order updates — future work, not urgent.** Order tracking
   currently polls (`orders/[id]/page.tsx` re-fetches on an interval). Replace
   with a Supabase Realtime subscription on the `orders` table when there's
   time — not required for the current submission.
6. ~~Add search to order history~~ — **DONE, see "DONE" section above.**
7. ~~Bring back favorites~~ — **DONE, see "DONE" section above.** Date-range
   filter on order search is still a nice-to-have, not required.
8. **Restaurant-claiming is now access-controlled, but still SQL-only —
   FIXED the vulnerability, the workflow itself is still a future task.**
   A real gap was found and closed: the RLS `update own profile` policy
   originally let ANY logged-in user set their own `role`/`restaurant_id` via
   a direct client call (`supabase.from('profiles').update(...)`), not just
   via SQL editor as the README implied. A `before update` trigger
   (`prevent_privilege_escalation`, see `supabase/schema.sql`) now blocks
   that — only an admin (or a direct SQL/service-role session) can change
   those two columns. **This is done, don't redo it.** What's still a real
   future task: replace the manual-SQL promotion flow with a proper in-app
   claim-request/approval workflow (a `claim_requests` table, a request UI
   for restaurant accounts, an approve/reject UI in `admin/dashboard` that
   sets `restaurant_id` server-side). The trigger above will keep protecting
   that new flow too — don't remove it when building this.
9. **Cross-check restaurant/menu data against real Swiggy listings.** The
   person is sharing Swiggy screenshots of the actual Krishnagiri restaurants
   for accuracy. Already corrected from a real screenshot: `r6` (Meat And
   Eat) is actually **4.4★, 20–25 min, "Burgers, Grill"** category (was
   3.6★/34min/"Grill, Kebabs, BBQ" from an earlier Google Places lookup —
   Google Places and Swiggy don't always agree; when they conflict, prefer
   whatever the person's own screenshot shows). If more screenshots come in,
   update `restaurants`/`menu_items` rows in Supabase to match — ratings,
   delivery time windows, cuisine labels, item names/prices are all fair
   game to correct this way. Do NOT copy the actual photos out of Swiggy
   screenshots into this project — those are Swiggy/restaurant-owned images,
   not freely reusable; keep sourcing photos independently (task 1 above).
## DECIDED — do not re-litigate these
- Order status auto-advance timer on the tracking page **stays** (~4.5s
  interval) — it's deliberate, useful for a live demo/viva. Don't remove it
  when doing the checkout simplification above.
- **No role-switcher UI.** The Next.js version intentionally has no
  "switch role" demo control (unlike an earlier prototype version of this
  project) — real Supabase Auth login/signup replaced that need entirely.
  Don't add one back.
- **Account page avatar**: `profiles.avatar_url` column exists (see
  `supabase/schema.sql`) and `account/page.tsx` already renders it when
  present, falling back to initials otherwise. The person will upload their
  own real photo (of food they cook/eat) as their profile picture manually
  via Supabase — no agent action needed here beyond leaving this working.

## Known limitations / explicitly out of scope right now
- Payment is a mocked 3-option selector (UPI/Card/COD) — see task 4 above for
  the plan to eventually make this real.
- Order status auto-advances on a client-side timer to simulate a kitchen
  workflow — not driven by real restaurant-side events yet (the restaurant
  dashboard *can* manually advance status too — both paths write to the same
  `orders.status_index` column). This is intentional, see "DECIDED" above.
- No notifications (push/SMS/email) — status changes are pull/poll-based.
- No coupon system, no reviews/ratings submission from customers yet.
- No menu CRUD for restaurant owners yet — see task 3 above.

## Commands
- `npm install`
- `cp .env.example .env.local`
- `npm run dev` — local dev server
- `npm run build` — production build. **Always run this before considering a
  change done** — this project has already caught real TypeScript errors this
  way (see git history / PROJECT_REPORT.md) that a visual read-through missed.

## Ground rules for whoever/whatever picks this up next
- Don't add a new UI library, CSS framework, or font family without a strong
  reason — the design system above is intentional, not a placeholder.
- Don't remove the Google Photos attribution caption in `RestaurantMark.tsx`.
- Don't bypass RLS with a service-role key in client code, ever.
- Prefer editing existing components over creating parallel ones — there is
  exactly one `RestaurantCard`, one `FoodImage`, one `RestaurantMark`; keep it
  that way.
- If you change the color tokens or typography, update this file's "Design
  system" section in the same change — it should never go stale.
