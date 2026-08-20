# FOODLY — Food Delivery Web App (Krishnagiri)

A full-stack food delivery web app built for real restaurants in Krishnagiri, Tamil Nadu as part of our college project.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, lucide-react
- **Backend / Database**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **State Management**: React Context + `localStorage` for Cart

---

## Features

- **Live Restaurant & Food Search**: Instant search by restaurant name (partial/prefix), cuisines, tags, locality, and menu items/dishes (e.g. biryani, pizza, dosa, momos).
- **Responsive Layout & Grid**: Mobile-to-desktop fluid responsive grid (1 to 4 columns) with non-overlapping cards.
- **Compact Cart & Delivery Progress**: Compact thumbnail item rows, free delivery progress tracker, and transparent pricing breakdown.
- **2-Step Checkout**: Delivery address with type selection (Home, Work, Other) and selectable payment options (UPI, Card, Net Banking, COD).
- **Live Order Tracking**: 6-step visual status timeline with interactive progression.
- **Order History & Search**: Instant lookup by restaurant name or Order ID.
- **Favorites**: Heart toggle to bookmark preferred spots.
- **Role-Based Dashboards**:
  - **Customer**: Browse, cart, checkout, tracking, favorites, profile.
  - **Restaurant Owner**: Order management and full Menu CRUD (add/edit/delete menu items).
  - **Admin**: System-wide statistics.
- **Security**: Double-gated route protection (Next.js middleware + Postgres Row Level Security) with trigger-enforced privilege escalation protection.

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
git clone https://github.com/shahid-24k/foodly.git
cd foodly
npm install
cp .env.example .env.local
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (publishable) key |

Configured in `.env.local`. Reference copy in `.env.example`.

---

---

## Test Account
For testing the complete end-to-end flow (Browse → Cart → Checkout → Order Tracking → Orders History):

- **Role**: Customer (Test User)
- **Email**: `test@foodly.local`
- **Password**: `TestPass123!`

*(You can also register any new customer account directly via `/signup` with instant login enabled if auto-confirm is active in your Supabase project).*

---

## Setting Up Roles

1. **Customer**: Sign up via `/signup` with role "Customer".
2. **Restaurant Owner**: Sign up with role "Restaurant Owner", then link to a restaurant in Supabase SQL editor:
   ```sql
   UPDATE profiles SET restaurant_id = 'r1' WHERE email = 'owner@example.com';
   ```
3. **Admin**: Promote an account via Supabase SQL editor:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
   ```

---

## Project Structure

```
src/
  app/                     App Router pages
    page.tsx               Home page & featured carousel
    restaurants/           Listing with live search & cuisine filters
    restaurants/[id]/      Menu & item cart actions
    cart/                  Compact cart & delivery progress
    checkout/              2-step address & payment checkout
    orders/                Order history & search
    orders/[id]/           Live order tracking
    favorites/             Saved restaurants
    login/ signup/         Supabase authentication
    account/               Profile details
    restaurant/dashboard/  Restaurant owner view (orders + menu CRUD)
    admin/dashboard/       Admin view
  components/
    Header.tsx             Top navigation with cart badge & dark mode
    BottomNav.tsx          Mobile navigation bar
    RestaurantCard.tsx     Responsive restaurant card
    RestaurantCarousel.tsx Smooth horizontal scrolling carousel
    RestaurantMark.tsx     Hero image / fallback mark
    FoodImage.tsx          Menu item thumbnail with fallback
    FavoriteButton.tsx     Heart toggle connected to Supabase
    LoadingScreen.tsx      Splash screen with smooth fade transition
  lib/
    supabase/client.ts     Browser Supabase client
    supabase/server.ts     Server Supabase client
    cart-context.tsx       Cart state & calculation provider
    types.ts               TypeScript models & helpers
    data.ts                Fallback restaurant & menu dataset
  middleware.ts            Role-based route protection
supabase/
  schema.sql               PostgreSQL schema & RLS policies
```

---

## Known Limitations

- Payment is currently mocked (selectable options without charging real payment methods). Razorpay integration is planned for future production deployment.
- Push/SMS notifications are pull/poll based.