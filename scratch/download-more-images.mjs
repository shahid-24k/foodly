import fs from 'fs';
import path from 'path';

// Additional Krishnagiri Restaurants (r9 - r12)
const NEW_RESTAURANT_IMAGES = {
  r9: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&q=80',  // Saravana Bhavan - South Indian Meals & Tiffin
  r10: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80', // Hotel Tamilnadu - Chettinad Feast
  r11: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&q=80', // Tibetan Momos & Chinese
  r12: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', // Ambur Star Biryani
};

// Additional Menu Item Images
const NEW_MENU_IMAGES = {
  // r9: Hotel Saravana Bhavan
  'saravana-special-meals': 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&q=80',
  'ghee-roast-dosa': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80',
  'medu-vada-2pcs': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
  'mini-tiffin-combo': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
  'poori-masala-2pcs': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',

  // r10: Hotel Tamilnadu (TTDC)
  'chettinad-chicken-curry': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
  'nattu-kozhi-fry': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80',
  'fish-head-curry': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80',
  'south-indian-nonveg-meals': 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&q=80',

  // r11: Tibetan Momos & Chinese
  'steamed-chicken-momos-8pcs': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&q=80',
  'fried-veg-momos-8pcs': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80',
  'chicken-thukpa-soup': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
  'chilli-chicken-dry': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',

  // r12: Ambur Star Biryani
  'ambur-mutton-biryani': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=80',
  'ambur-chicken-biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'chicken-pakoda-200g': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80',
  'brinjal-khatte-salan': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
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
  console.log('Downloading additional restaurant images...');
  for (const [id, url] of Object.entries(NEW_RESTAURANT_IMAGES)) {
    const dest = path.join(process.cwd(), 'public', 'restaurants', `${id}.jpg`);
    try {
      await downloadFile(url, dest);
      console.log(`✓ public/restaurants/${id}.jpg`);
    } catch (err) {
      console.error(`✕ Failed ${id}:`, err.message);
    }
  }

  console.log('\nDownloading additional menu images...');
  for (const [id, url] of Object.entries(NEW_MENU_IMAGES)) {
    const dest = path.join(process.cwd(), 'public', 'menu', `${id}.jpg`);
    try {
      await downloadFile(url, dest);
      console.log(`✓ public/menu/${id}.jpg`);
    } catch (err) {
      console.error(`✕ Failed ${id}:`, err.message);
    }
  }

  console.log('\nDownloads complete!');
}

main().catch(console.error);
