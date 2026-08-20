# FOODLY — Project Report

## 1. Introduction

FOODLY is a food delivery web app for real restaurants in Krishnagiri, Tamil Nadu. Built as a college project under the Naan Mudhalvan initiative — the idea was to cover the full stack: frontend UI, backend data, authentication, and role-based access, all working together as a real deployable product.

## 2. Objective

Build a working food ordering platform that covers the whole customer flow (discover restaurants → order food → track delivery) plus dashboards for restaurant owners and a platform admin, all backed by a real relational database with proper access control.

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Backend / DB | Supabase (managed PostgreSQL) |
| Auth | Supabase Auth (email/password) with Row Level Security |
| Icons | lucide-react |

## 4. How It's Built

### 4.1 Database

Five main tables:
- **restaurants** — name, cuisine, locality, rating, delivery time, price range, branding colors, hero image
- **menu_items** — linked to a restaurant; name, description, price, veg/non-veg, category, image
- **orders** — items as JSON, pricing, delivery address as JSON, payment method, status index, timestamps
- **addresses** — saved customer delivery addresses
- **profiles** — one per Supabase auth user; stores role (customer / restaurant / admin) and optionally which restaurant they manage

### 4.2 Auth & Access Control

When someone signs up, Supabase Auth creates the user and a Postgres trigger (`handle_new_user`) creates a matching row in `profiles` with their chosen role. The Next.js middleware checks the user's role via a server-side Supabase client (reading cookies) before allowing access to protected routes like `/checkout`, `/orders`, `/restaurant/dashboard`, and `/admin/dashboard`. Wrong role or not logged in → redirect to `/login`.

On top of that, Postgres Row Level Security policies enforce the same rules at the database layer — so even if someone bypasses the frontend, the DB won't let them do anything they shouldn't. Restaurant owners can only manage their own restaurant's orders and menu. A `prevent_privilege_escalation` trigger stops anyone from changing their own role or restaurant_id through the client API.

### 4.3 User Flows

1. **Customer**: browse restaurants → look at a menu → add to cart (stored in localStorage) → checkout (address + payment → confirm) → order saved to DB → status tracking page (polls for updates) → order history with reorder
2. **Restaurant owner**: dashboard with order stats, live incoming orders they can advance through the pipeline, and full menu management (add/edit/delete items)
3. **Admin**: platform-wide stats (total users, restaurants, orders, revenue) and a list of all restaurants

## 5. Data Sources

The 8 restaurants are real places in Krishnagiri, sourced via Google Places — names, cuisines, ratings, localities, and photos (with attribution where required): Hotel Sri Rajeshwari, Annapoorna Classic, Srirangam Cafe, Salem RR Biryani, Feast Pizza, Meat And Eat, Anu Krishna Sweets and Bakery, and Belgium Bliss. Some ratings were cross-checked against Swiggy listings.

## 6. Limitations & Future Work

- Payment is simulated — three options shown but no real gateway. Razorpay is the plan when it's time.
- Order status auto-advances on a timer for demo purposes. In a real version this would be driven by the restaurant/delivery side.
- Photos are a mix of Google Places images and generated brand marks. Real restaurant photos can be uploaded anytime.
- No push notifications — status updates are poll-based.
- Future: real payment (Razorpay), delivery tracking with geolocation, customer ratings/reviews, coupon system.

## 7. Conclusion

FOODLY covers the core of a food delivery platform end-to-end — real auth with role-based access, a normalized database with Row Level Security, and a responsive UI for both customers and operators. It's a working demo, not a mockup, and the code is structured to be extended with real payment and real-time features later.
