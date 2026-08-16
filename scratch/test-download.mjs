import fs from 'fs';
import path from 'path';

async function testDownload() {
  const url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80'; // Biryani photo
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.mkdirSync('public/restaurants', { recursive: true });
  fs.writeFileSync('public/restaurants/test.jpg', buffer);
  console.log('Successfully saved test.jpg, size:', buffer.length);
}

testDownload().catch(console.error);
