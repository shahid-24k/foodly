const SUPABASE_URL = 'https://uaptqazhwegkawyjmvrj.supabase.co';
const ANON_KEY = 'sb_publishable_K19gFDOiYwbdxOfXCxjEeQ_5-5PlT5P';

async function upsertRow(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error(`Failed to upsert ${table}:`, await res.text());
  } else {
    console.log(`✓ Upserted ${table}: ${data.id || data.name}`);
  }
}

const NEW_RESTAURANTS = [
  {
    id: 'r9',
    name: 'Hotel Saravana Bhavan',
    since: 'EST. 1981',
    cuisine: 'South Indian, Tiffin, Meals',
    locality: 'Old Bus Stand, Krishnagiri',
    rating: 4.6,
    delivery_time: 20,
    price_range: '₹₹',
    is_veg: true,
    offer: '20% OFF UPTO ₹50',
    tags: ['south', 'comfort', 'quick'],
    gradient_from: '#4C7A5A',
    gradient_to: '#2E5137',
    hero_image: '/restaurants/r9.jpg',
  },
  {
    id: 'r10',
    name: 'Hotel Tamilnadu (TTDC)',
    since: 'EST. 1978',
    cuisine: 'Chettinad, South Indian, Seafood',
    locality: 'Salem Main Road, Krishnagiri',
    rating: 4.2,
    delivery_time: 30,
    price_range: '₹₹₹',
    is_veg: false,
    offer: 'FLAT ₹100 OFF',
    tags: ['south', 'spicy', 'feast'],
    gradient_from: '#6ce574ff',
    gradient_to: '#8A2B08',
    hero_image: '/restaurants/r10.jpg',
  },
  {
    id: 'r11',
    name: 'Tibetan Momos & Chinese',
    since: 'EST. 2019',
    cuisine: 'Momos, Chinese, Tibetan',
    locality: 'Rayakottai Road, Krishnagiri',
    rating: 4.5,
    delivery_time: 25,
    price_range: '₹',
    is_veg: false,
    offer: 'FREE DELIVERY',
    tags: ['chinese', 'spicy', 'quick'],
    gradient_from: '#2ee8aaff',
    gradient_to: '#B34A1B',
    hero_image: '/restaurants/r11.jpg',
  },
  {
    id: 'r12',
    name: 'Ambur Star Biryani',
    since: 'EST. 1890',
    cuisine: 'Ambur Biryani, Seeraga Samba, Starters',
    locality: 'Hosur Main Road, Krishnagiri',
    rating: 4.7,
    delivery_time: 25,
    price_range: '₹₹',
    is_veg: false,
    offer: 'STARTERS @ ₹99',
    tags: ['biryani', 'spicy', 'feast'],
    gradient_from: '#8A2B08',
    gradient_to: '#521703',
    hero_image: '/restaurants/r12.jpg',
  },
];

const NEW_ITEMS = [
  // r9: Saravana Bhavan
  { id: 'saravana-special-meals', restaurant_id: 'r9', name: 'Saravana Special South Indian Meals', description: 'Banana leaf thali served with rice, sambar, vatha kuzhambu, rasam, kootu, poriyal, curd & appalam', price: 160, is_veg: true, category: 'Meals', image_url: '/menu/saravana-special-meals.jpg' },
  { id: 'ghee-roast-dosa', restaurant_id: 'r9', name: 'Special Ghee Roast Dosa', description: 'Crispy paper-thin dosa made with pure cow ghee, served with coconut chutney & tiffin sambar', price: 110, is_veg: true, category: 'Tiffin', image_url: '/menu/ghee-roast-dosa.jpg' },
  { id: 'medu-vada-2pcs', restaurant_id: 'r9', name: 'Crispy Medu Vada (2 Pcs)', description: 'Golden urad dal fritters served piping hot with coconut & tomato chutney', price: 55, is_veg: true, category: 'Tiffin', image_url: '/menu/medu-vada-2pcs.jpg' },
  { id: 'mini-tiffin-combo', restaurant_id: 'r9', name: 'Saravana Mini Tiffin Combo', description: 'Mini Dosa, Idli (1 pc), Vada (1 pc), Rava Kesari & Filter Coffee combo', price: 145, is_veg: true, category: 'Combos', image_url: '/menu/mini-tiffin-combo.jpg' },
  { id: 'poori-masala-2pcs', restaurant_id: 'r9', name: 'Poori Masala (2 Pcs)', description: 'Fluffy whole wheat pooris served with spiced potato onion masala', price: 75, is_veg: true, category: 'Tiffin', image_url: '/menu/poori-masala-2pcs.jpg' },

  // r10: Hotel Tamilnadu
  { id: 'chettinad-chicken-curry', restaurant_id: 'r10', name: 'Authentic Chettinad Chicken Curry', description: 'Farm chicken cooked with freshly ground roasted pepper, fennel, kalpasi & shallots', price: 240, is_veg: false, category: 'Main Course', image_url: '/menu/chettinad-chicken-curry.jpg' },
  { id: 'nattu-kozhi-fry', restaurant_id: 'r10', name: 'Nattu Kozhi Fry (Country Chicken)', description: 'Country chicken pan-fried with shallots, curry leaves & crushed black pepper', price: 270, is_veg: false, category: 'Starters', image_url: '/menu/nattu-kozhi-fry.jpg' },
  { id: 'fish-head-curry', restaurant_id: 'r10', name: 'Krishnagiri Dam Fish Curry', description: 'Fresh river fish cooked in tangy tamarind coconut gravy with green chillies', price: 230, is_veg: false, category: 'Main Course', image_url: '/menu/fish-head-curry.jpg' },
  { id: 'south-indian-nonveg-meals', restaurant_id: 'r10', name: 'Chettinad Non-Veg Meals', description: 'Rice, Chicken Gravy, Mutton Salan, Fish Curry, Rasam, Curd & Sweet', price: 220, is_veg: false, category: 'Meals', image_url: '/menu/south-indian-nonveg-meals.jpg' },

  // r11: Tibetan Momos
  { id: 'steamed-chicken-momos-8pcs', restaurant_id: 'r11', name: 'Steamed Chicken Momos (8 Pcs)', description: 'Juicy minced chicken dumplings wrapped thin, served with spicy garlic tomato chutney', price: 130, is_veg: false, category: 'Momos', image_url: '/menu/steamed-chicken-momos-8pcs.jpg' },
  { id: 'fried-veg-momos-8pcs', restaurant_id: 'r11', name: 'Crispy Fried Veg Momos (8 Pcs)', description: 'Crispy deep-fried vegetable dumplings stuffed with cabbage, carrot & cheese', price: 110, is_veg: true, category: 'Momos', image_url: '/menu/fried-veg-momos-8pcs.jpg' },
  { id: 'chicken-thukpa-soup', restaurant_id: 'r11', name: 'Tibetan Chicken Thukpa Soup', description: 'Hearty noodle soup with shredded chicken, spring onions & Tibetan aromatic spices', price: 150, is_veg: false, category: 'Soups', image_url: '/menu/chicken-thukpa-soup.jpg' },
  { id: 'chilli-chicken-dry', restaurant_id: 'r11', name: 'Indo-Chinese Chilli Chicken (Dry)', description: 'Crispy fried chicken tossed with capsicum, onions, soy sauce & green chillies', price: 180, is_veg: false, category: 'Chinese', image_url: '/menu/chilli-chicken-dry.jpg' },

  // r12: Ambur Star Biryani
  { id: 'ambur-mutton-biryani', restaurant_id: 'r12', name: 'Ambur Star Mutton Biryani', description: 'Authentic Seeraga Samba rice biryani cooked with tender mutton chunks & red chilli paste', price: 290, is_veg: false, category: 'Biryani', image_url: '/menu/ambur-mutton-biryani.jpg' },
  { id: 'ambur-chicken-biryani', restaurant_id: 'r12', name: 'Ambur Star Chicken Biryani', description: 'Traditional Ambur style chicken biryani served with brinjal pachadi & onion raita', price: 210, is_veg: false, category: 'Biryani', image_url: '/menu/ambur-chicken-biryani.jpg' },
  { id: 'chicken-pakoda-200g', restaurant_id: 'r12', name: 'Crispy Chicken Pakoda (200g)', description: 'Boneless chicken bites marinated in spices & fried crisp with curry leaves', price: 160, is_veg: false, category: 'Starters', image_url: '/menu/chicken-pakoda-200g.jpg' },
  { id: 'brinjal-khatte-salan', restaurant_id: 'r12', name: 'Ambur Ennai Kathirikai Salan', description: 'Tangy brinjal gravy cooked with sesame, peanut & tamarind — perfect biryani accompaniment', price: 70, is_veg: true, category: 'Sides', image_url: '/menu/brinjal-khatte-salan.jpg' },
];

async function main() {
  console.log('Seeding new restaurants into Supabase...');
  for (const r of NEW_RESTAURANTS) {
    await upsertRow('restaurants', r);
  }

  console.log('\nSeeding new menu items...');
  for (const m of NEW_ITEMS) {
    await upsertRow('menu_items', m);
  }

  console.log('\nDatabase seeding complete!');
}

main().catch(console.error);
