-- FOODLY REAL-WORLD CATALOG MIGRATION & SEED FOR KRISHNAGIRI, TAMIL NADU
-- Run this in Supabase SQL Editor to populate the verified public catalog.

-- 1. Add provenance columns if not present
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS catalog_source text NOT NULL DEFAULT 'verified_public';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS last_verified_at timestamptz DEFAULT now();
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS source_name text DEFAULT 'Krishnagiri Public Listings';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS source_url text;

ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS last_verified_at timestamptz DEFAULT now();
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS source_name text DEFAULT 'Public Restaurant Menu Snapshot';
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS source_url text;

-- 2. Clean & Seed Real Restaurants in Krishnagiri
INSERT INTO restaurants (id, name, since, cuisine, locality, rating, delivery_time, price_range, is_veg, offer, tags, gradient_from, gradient_to, hero_image, catalog_source, last_verified_at, source_name)
VALUES
  ('r1', 'Hotel Sri Rajeshwari', 'Since 1963', 'North Indian, South Indian, Biryani', 'Krishnagiri Locality', 3.9, 33, '₹₹', false, '20% OFF UPTO ₹50', ARRAY['north', 'south', 'biryani', 'comfort', 'feast'], '#8C2F1B', '#5C1D10', 'https://lh3.googleusercontent.com/place-photos/AG9NLjAPxs1DUJYd-Xyi27tgPDA9MhxAAjNwJlgrNLZusZEX2Wcd2xcGuNzoVT5rT58LvNoiGzcoIkCs413saVrH3h-SyDoxy56lhFkRkL2q0cjRPrwMkxqt9nSnhZ5hdmmEGXICqRFtqLjxRh1m3A=s800-w800-h600', 'verified_public', now(), 'Google Places & Swiggy Krishnagiri'),
  ('r2', 'Annapoorna Classic', null, 'Chinese, North Indian, South Indian, Biryani', 'Krishnagiri Locality', 3.7, 42, '₹₹', false, 'Flat 20% OFF', ARRAY['chinese', 'north', 'south', 'biryani', 'comfort'], '#B5451F', '#7A2C12', 'https://lh3.googleusercontent.com/place-photos/AG9NLjD50gymGJPo0jTn2GIRY_KNe_wd0MxPx0VJmpr-4e4DKHjmwEfxVZh49wTk4Sov8S-PS76ypn9xbPvi59M-FYAxH82lel8x4tm53SSSFBac4Z3aFTTZldpx1FOWU1DFDLoQ_V6dmkR3pz9ihZs=s800-w800-h600', 'verified_public', now(), 'Google Places & Swiggy Krishnagiri'),
  ('r3', 'Srirangam Cafe', null, 'Chinese, South Indian, Tiffin', 'Krishnagiri', 2.9, 42, '₹', true, '60% OFF UPTO ₹120', ARRAY['chinese', 'south', 'cafe', 'quick'], '#4C7A3D', '#2E4F26', 'https://lh3.googleusercontent.com/place-photos/AG9NLjDCDBGH8PmocBIiA4Ok-uL8zR420DhN6mD0KQ86MB5ym2ABCKt-qT4vCxYk75FJkmrkxGACm4WwqhTQXMuWu5f5u4v1oQ7AswsCMKKzrQhjV6fcy_82rIHWZ-CHoRMYBA5HxXFSw3MYTrD2uA=s800-w800-h600', 'verified_public', now(), 'Google Places & Public Listings'),
  ('r4', 'Salem RR Biryani', null, 'Biryani, Kebabs', 'Ramapuram, Krishnagiri', 3.7, 36, '₹₹', false, 'Bestseller', ARRAY['biryani', 'spicy', 'feast'], '#F0A93B', '#C97F1E', 'https://lh3.googleusercontent.com/place-photos/AG9NLjDQd4q2iVDbDfLagCYpuP_XrmHy_byvW3TPBuiV3OZglEWL6uh32X4ZU2KrXbBRNBK3qbFSVQLal8B_63HaTERGSlBv2pJAkpG0sETExAdd1_zoRCx9mUAVEOHaeY83zeWJ2aus1TROdK1A_w=s800-w800-h600', 'verified_public', now(), 'Google Places Krishnagiri'),
  ('r5', 'Feast Pizza', null, 'Pizza, Pasta, Sides', 'Krishnagiri Locality', 4.3, 39, '₹₹', false, 'Buy 1 Get 1', ARRAY['pizza', 'quick', 'comfort'], '#C23B22', '#8C2117', 'https://lh3.googleusercontent.com/place-photos/AG9NLjDP69OaVJakk6xAc03NTj65R0SiMJI0h_Uzu2XjsVRhNBGhfRogJBDTBpfHe0TwCqyD6-UmWQx8AGy9p40am35vbGamWRUhBTGJun_mg9VUHYJoOyy5UeTpymOkUbLdBbBD2w4U8q4G_9j_jQ=s800-w800-h600', 'verified_public', now(), 'Google Places Krishnagiri'),
  ('r6', 'Meat And Eat', null, 'Burgers, Grill, Fast Food', 'Rayakottai Main Road, Krishnagiri', 4.4, 22, '₹₹₹', false, 'New on Foodly', ARRAY['grill', 'spicy', 'feast'], '#2B2420', '#4A3B2E', 'https://lh3.googleusercontent.com/place-photos/AG9NLjDGS7QDhdTKFmQMYLPrKuTqpPunCPVeioOHUagS-aYs77S92-Q7dbCO-pYYFgscgguJYWTVBYGgal45Vq1yIacEmc6QBaZsEoLtTZR0fvj0cmn0CjuMcIRcsWgge3vfnty5CuQTYPvIO6HMZA=s800-w444-h344', 'verified_public', now(), 'Swiggy Krishnagiri Live Listing'),
  ('r7', 'Anukrishna Sweets & Bakery', null, 'Bakery, Sweets, Snacks', 'Krishnagiri Town Center', 4.1, 32, '₹', true, '20% OFF', ARRAY['bakery', 'sweet', 'quick'], '#E8951F', '#B5661A', 'https://lh3.googleusercontent.com/place-photos/AG9NLjAYmuno_NFKi0SttUFcGlMfx4O218A4vv5DDaPQy9nNNA6S7mjCmB3KktVrU9_CCfNIvXFsEaMhDiHZGpnvvS4RAhFZSsKjY39_zO0qKaXJtZl-a5919X22zaGQgR7Hyf_5FGByuyvpHZiQD9c=s800-w576-h600', 'verified_public', now(), 'Google Places Krishnagiri'),
  ('r8', 'Belgium Bliss', null, 'Waffles, Shakes, Desserts', 'Katiganapalli, Krishnagiri', 4.5, 45, '₹₹', true, 'ITEMS AT ₹149', ARRAY['bakery', 'cafe', 'sweet', 'quick'], '#D98C3D', '#A85F22', 'https://lh3.googleusercontent.com/place-photos/AG9NLjB5b8Z6wzVrAf6v64y9cbBaVesnhXD6xKyCiy9X8XYIZqc0VwlFSIxusl2COnDWR_Ae6MU6OddrIoku5WLGSkyNblPMIpsG69BEwcXKp6espsoTrIDmTwfpkTf8iEj9DlkNlCdnAnH5I8HoVQ=s800-w800-h600', 'verified_public', now(), 'Google Places Krishnagiri')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  since = EXCLUDED.since,
  cuisine = EXCLUDED.cuisine,
  locality = EXCLUDED.locality,
  rating = EXCLUDED.rating,
  delivery_time = EXCLUDED.delivery_time,
  price_range = EXCLUDED.price_range,
  is_veg = EXCLUDED.is_veg,
  offer = EXCLUDED.offer,
  tags = EXCLUDED.tags,
  gradient_from = EXCLUDED.gradient_from,
  gradient_to = EXCLUDED.gradient_to,
  hero_image = EXCLUDED.hero_image,
  catalog_source = EXCLUDED.catalog_source,
  last_verified_at = EXCLUDED.last_verified_at,
  source_name = EXCLUDED.source_name;
