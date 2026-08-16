const SUPABASE_URL = 'https://uaptqazhwegkawyjmvrj.supabase.co';
const ANON_KEY = 'sb_publishable_K19gFDOiYwbdxOfXCxjEeQ_5-5PlT5P';

async function patchRow(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error(`Failed to patch ${table} ${id}: ${res.status} ${txt}`);
  } else {
    console.log(`✓ Updated ${table} ${id}`);
  }
}

async function main() {
  console.log('Updating restaurant hero_image paths and r6 data...');
  const restaurants = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'];
  for (const id of restaurants) {
    const patchData = { hero_image: `/restaurants/${id}.jpg` };
    if (id === 'r6') {
      patchData.rating = 4.4;
      patchData.delivery_time = 22;
      patchData.cuisine = 'Burgers, Grill';
    }
    await patchRow('restaurants', id, patchData);
  }

  console.log('\nUpdating menu item image_url paths...');
  const menuRes = await fetch(`${SUPABASE_URL}/rest/v1/menu_items?select=id`, {
    headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
  });
  const items = await menuRes.json();
  for (const m of items) {
    await patchRow('menu_items', m.id, { image_url: `/menu/${m.id}.jpg` });
  }

  console.log('\nDatabase update completed successfully!');
}

main().catch(console.error);
