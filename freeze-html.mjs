/* =============================================================================
   freeze-html.mjs
   Membuat 14 file .html STATIS dari tiap layar Braille Haptic, siap di-drop
   ke plugin Figma "html2figma" (yang TIDAK menjalankan JavaScript).

   Cara kerja:
     - Buka tiap layar via ?shot=1#layar (JS + Tailwind dijalankan browser)
     - Ambil HTML hasil render final
     - Kumpulkan semua CSS (Tailwind runtime + <style>) lalu inline ke <style>
     - Simpan ke figma-html/<nomor>-<layar>.html

   Cara pakai:
     1. Jalankan server:  python -m http.server 8080   (di folder project)
     2. node freeze-html.mjs
     3. Drop file .html ke plugin html2figma di Figma
   ============================================================================= */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8080';
const WIDTH = 360;

const SCREENS = [
  'splash', 'login', 'signup', 'home', 'dashboard', 'reader', 'practice',
  'gesture', 'contacts', 'companion', 'upload', 'profile', 'test', 'lesson',
];

const outDir = path.join(__dirname, 'figma-html');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: WIDTH, height: 800 } });

console.log(`Base URL : ${BASE_URL}`);
console.log(`Output   : ${outDir}\n`);

let i = 0;
for (const s of SCREENS) {
  i++;
  const num = String(i).padStart(2, '0');
  const file = path.join(outDir, `${num}-${s}.html`);

  await page.goto(`${BASE_URL}/?shot=1&_=${Date.now()}#${s}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900); // tunggu Tailwind runtime & font settle

  // Ambil HTML final + CSS yang sudah di-inline oleh Tailwind runtime.
  // cdn.tailwindcss.com menyuntik <style> ke <head>; <style> manual juga ada.
  const result = await page.evaluate(() => {
    // Kumpulkan semua CSS dari stylesheet + <style> inline
    let css = '';

    // 1) CSS dari <style> hasil Tailwind runtime & kode
    document.querySelectorAll('style').forEach(st => {
      css += (st.textContent || '') + '\n';
    });

    // 2) CSS dari stylesheet yang sudah selesai dimuat (same-origin / data)
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = sheet.cssRules;
        if (rules) {
          for (const r of Array.from(rules)) css += r.cssText + '\n';
        }
      } catch (e) { /* cross-origin (mis. Google Fonts) -> dilewati */ }
    }

    // Ambil HTML body konten (tanpa <script>).
    const bodyClone = document.body.cloneNode(true);
    bodyClone.querySelectorAll('script').forEach(el => el.remove());

    return {
      css,
      bodyHtml: bodyClone.innerHTML,
      bodyClass: document.body.className,
    };
  });

  // Font Google: sisipkan <link> agar tetap termuat (plugin boleh request font absolut)
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=360, initial-scale=1" />
<title>Braille Haptic — ${s}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
/* ==== Reset minimal ==== */
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }

/* ==== CSS hasil render (Tailwind runtime + style asli) ==== */
${result.css}

/* ==== Bingkai 360px untuk import Figma ==== */
body.frozen { width: ${WIDTH}px; }
</style>
</head>
<body class="${result.bodyClass} frozen">
${result.bodyHtml}
</body>
</html>`;

  fs.writeFileSync(file, html, 'utf8');
  console.log(`  [${i}/${SCREENS.length}] ${num}-${s}.html  (${(html.length/1024).toFixed(1)} KB)`);
}

await browser.close();

const count = fs.readdirSync(outDir).filter(f => f.endsWith('.html')).length;
console.log(`\nSelesai. ${count} file HTML di:\n  ${outDir}`);
console.log(`\nDrop salah satu file .html ke plugin html2figma di Figma.`);
