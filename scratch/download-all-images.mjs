import fs from 'fs';
import path from 'path';

// Curated high quality food photos from Unsplash
const RESTAURANT_IMAGES = {
  r1: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', // South Indian Biryani Feast
  r2: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&q=80', // Indian Thali/Curry
  r3: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80', // Dosa & Idli South Indian Cafe
  r4: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80', // Royal Biryani Pot
  r5: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', // Gourmet Pizza
  r6: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', // Burger & BBQ Grill
  r7: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', // Bakery & Sweets
  r8: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80', // Belgian Waffle Dessert
};

const MENU_IMAGES = {
  // r1: Hotel Sri Rajeshwari
  'chicken-biryani-0': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'mutton-biryani-1': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=80',
  'paneer-butter-masala-2': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
  'masala-dosa-3': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
  'butter-naan-4': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',
  'rose-milk-5': 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&q=80',

  // r2: Annapoorna Classic
  'chicken-fried-rice-0': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80',
  'gobi-manchurian-1': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
  'veg-biryani-2': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'dal-makhani-3': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
  'idli-sambar-4': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',

  // r3: Srirangam Cafe
  'masala-dosa-0': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80',
  'rava-idli-1': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
  'veg-noodles-2': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80',
  'filter-coffee-3': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',

  // r4: Salem RR Biryani
  'chicken-biryani-0-r4': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'mutton-biryani-1-r4': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=80',
  'chicken-65-2': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80',
  'plain-raita-3': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',

  // r5: Feast Pizza
  'margherita-pizza-0': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
  'chicken-tikka-pizza-1': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
  'farmhouse-pizza-2': 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80',
  'cheese-garlic-bread-3': 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=600&q=80',

  // r6: Meat And Eat
  'mutton-seekh-kebab-0': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
  'tandoori-chicken-half-1': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
  'bbq-chicken-wings-2': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&q=80',
  'paneer-tikka-3': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',

  // r7: Anukrishna Sweets & Bakery
  'mysore-pak-0': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',
  'veg-puff-1': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80',
  'chocolate-brownie-2': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
  'rusk-toast-3': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',

  // r8: Belgium Bliss
  'belgian-chocolate-waffle-0': 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&q=80',
  'nutella-banana-waffle-1': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80',
  'oreo-shake-2': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',
  'mango-lassi-3': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80',
};

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buffer);
}

async function main() {
  console.log('Downloading restaurant images...');
  for (const [id, url] of Object.entries(RESTAURANT_IMAGES)) {
    const dest = path.join(process.cwd(), 'public', 'restaurants', `${id}.jpg`);
    try {
      await downloadFile(url, dest);
      console.log(`✓ public/restaurants/${id}.jpg`);
    } catch (err) {
      console.error(`✕ Failed to download restaurant ${id}:`, err.message);
    }
  }

  console.log('\nDownloading menu item images...');
  for (const [id, url] of Object.entries(MENU_IMAGES)) {
    const dest = path.join(process.cwd(), 'public', 'menu', `${id}.jpg`);
    try {
      await downloadFile(url, dest);
      console.log(`✓ public/menu/${id}.jpg`);
    } catch (err) {
      console.error(`✕ Failed to download menu item ${id}:`, err.message);
    }
  }

  console.log('\nAll images downloaded!');
}

main().catch(console.error);
