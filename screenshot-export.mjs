/* =============================================================================
   screenshot-export.mjs
   Screenshot otomatis setiap layar Braille Haptic pakai Playwright.
   Hasil: figma-export/*.png dengan tinggi PAS mengikuti konten (full-page).

   Cara pakai:
     1. Jalankan server:  python -m http.server 8080   (di folder project)
     2. npm install -D playwright && npx playwright install chromium
     3. node screenshot-export.mjs
   ============================================================================= */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8080';
const WIDTH = 360;          // lebar frame HP
const SCALE = 2;            // 2 = retina (gambar 720px, tajam untuk Figma)

const SCREENS = [
  'splash', 'login', 'signup', 'home', 'dashboard', 'reader', 'practice',
  'gesture', 'contacts', 'companion', 'upload', 'profile', 'test', 'lesson',
];

const outDir = path.join(__dirname, 'figma-export');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({
  viewport: { width: WIDTH, height: 800 },
  deviceScaleFactor: SCALE,
});

console.log(`Base URL : ${BASE_URL}`);
console.log(`Output   : ${outDir}`);
console.log(`Width    : ${WIDTH} @${SCALE}x\n`);

let i = 0;
for (const s of SCREENS) {
  i++;
  const num = String(i).padStart(2, '0');
  const file = path.join(outDir, `${num}-${s}.png`);

  // Tambahkan query unik agar setiap navigasi benar-benar memuat ulang
  // (mengganti hash saja tidak memicu boot() ulang di browser).
  await page.goto(`${BASE_URL}/?shot=1&_=${Date.now()}#${s}`, { waitUntil: 'networkidle' });
  // Beri waktu font & layout settling
  await page.waitForTimeout(900);

  await page.screenshot({ path: file, fullPage: true });
  console.log(`  [${i}/${SCREENS.length}] ${num}-${s}.png`);
}

await browser.close();

const count = fs.readdirSync(outDir).filter(f => f.endsWith('.png')).length;
console.log(`\nSelesai. ${count} file PNG di:\n  ${outDir}`);
