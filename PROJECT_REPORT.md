# FOODLY — Project Report

## 1. Introduction
FOODLY is a food delivery web application built for real restaurants operating in Krishnagiri, Tamil Nadu. It was developed as a college project under the Naan Mudhalvan initiative to demonstrate full-stack web development skills: frontend UI/UX, backend data modeling, authentication, and role-based access control.

## 2. Objective
To build a working, deployable food ordering platform covering the complete customer journey (discover → order → track) alongside operational dashboards for restaurant owners and platform administrators, backed by a real relational database.

## 3. Tech stack
| Layer | Technology |
|---|---|
| Frontend framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Backend / Database | Supabase (managed PostgreSQL) |
| Authentication | Supabase Auth (email/password) with Row Level Security |
| Icons | lucide-react |

## 4. System design

### 4.1 Database schema
- **restaurants** — name, cuisine, locality, rating, delivery time, price range, branding gradient, hero image
- **menu_items** — linked to a restaurant, name, description, price, veg/non-veg flag, category, image
- **orders** — items (JSON), pricing breakdown, delivery address (JSON), payment method, status index, timestamps
- **addresses** — saved customer delivery addresses
- **profiles** — linked 1:1 to Supabase `auth.users`, stores `role` (customer/restaurant/admin) and, for restaurant owners, the `restaurant_id` they manage

### 4.2 Authentication & authorization
Sign-up creates a Supabase Auth user; a Postgres trigger (`handle_new_user`) automatically creates a matching `profiles` row with the selected role. Next.js middleware checks the authenticated user's role (via a server-side Supabase client reading cookies) before allowing access to `/checkout`, `/account`, `/orders`, `/restaurant/dashboard`, and `/admin/dashboard` — unauthenticated or wrong-role requests are redirected.

Row Level Security (RLS) policies enforce the same rules at the database layer, independent of the frontend: restaurant owners can only update orders belonging to their own restaurant; anyone can read the public menu/restaurant catalog; only the order's owner or an admin can act on it.

### 4.3 Core user flows
1. **Customer**: browse restaurants → view menu → add to cart (persisted in `localStorage`) → checkout (address → payment → confirm) → order written to `orders` table → live status tracking page (polls and advances the order's `status_index`) → order history with one-click reorder.
2. **Restaurant owner**: dashboard showing revenue/order stats for their linked restaurant, and a live list of incoming orders they can advance through the fulfillment pipeline.
3. **Admin**: platform-wide stats (users, restaurants, orders, revenue) and a directory of all restaurants.

## 5. Data used
Eight real Krishnagiri restaurants were sourced via Google Places (name, cuisine, real customer rating, locality, and a real photo with attribution): Hotel Sri Rajeshwari, Annapoorna Classic, Srirangam Cafe, Salem RR Biryani, Feast Pizza, Meat And Eat, Anu Krishna Sweets and Bakery, and Belgium Bliss.

## 6. Limitations and future work
- Payment is simulated (no real payment gateway integration).
- Order status progression is time-simulated rather than driven by real kitchen/delivery events.
- Restaurant photography is a placeholder mix (Google Places photos + generated brand marks) pending the restaurant owner uploading official photos.
- No push notifications; status updates are pull-based (polling).
- Future work: real payment gateway (Razorpay/Stripe), delivery partner tracking via geolocation, ratings/reviews submission, coupon system.

## 7. Conclusion
FOODLY demonstrates a complete, working full-stack implementation of a food delivery platform — real authentication and role-based access, a normalized relational schema enforced with Row Level Security, and a responsive UI covering both the customer and operator sides of the product.
