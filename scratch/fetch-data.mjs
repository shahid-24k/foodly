// Fetch all restaurants and menu items from Supabase REST API directly
// Run with: node scratch/fetch-data.mjs

const SUPABASE_URL = 'https://uaptqazhwegkawyjmvrj.supabase.co';
const ANON_KEY = 'sb_publishable_K19gFDOiYwbdxOfXCxjEeQ_5-5PlT5P';

async function query(table, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log('=== RESTAURANTS ===');
  const restaurants = await query('restaurants', 'order=id');
  for (const r of restaurants) {
    console.log(`${r.id} | ${r.name} | ${r.cuisine} | ${r.rating}★ | ${r.delivery_time}min | ${r.locality} | veg=${r.is_veg} | hero_image: ${r.hero_image || 'NULL'}`);
  }
  console.log(`\nTotal restaurants: ${restaurants.length}`);

  console.log('\n=== MENU ITEMS ===');
  const items = await query('menu_items', 'order=restaurant_id,category,name');
  let currentRestaurant = '';
  for (const m of items) {
    if (m.restaurant_id !== currentRestaurant) {
      const r = restaurants.find(r => r.id === m.restaurant_id);
      console.log(`\n--- ${r?.name || m.restaurant_id} (${m.restaurant_id}) ---`);
      currentRestaurant = m.restaurant_id;
    }
    console.log(`  ${m.id} | ${m.name} | ${m.category} | ₹${m.price} | ${m.is_veg ? 'VEG' : 'NON-VEG'} | image: ${m.image_url || 'NULL'}`);
  }
  console.log(`\nTotal menu items: ${items.length}`);
}

main().catch(console.error);
