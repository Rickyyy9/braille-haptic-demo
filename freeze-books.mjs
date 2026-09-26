import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8080';
const WIDTH = 360;
const outDir = path.join(__dirname, 'figma-html');
fs.mkdirSync(outDir, { recursive: true });

const BOOKS = [
  { title: 'Bumi Manusia',               slug: 'bumi',    num: 15 },
  { title: 'Panduan Braille Dasar',      slug: 'panduan', num: 16 },
  { title: 'Catatan Harian Sahabat',     slug: 'catatan', num: 17 },
  { title: 'Kancil Menyeberangi Sungai', slug: 'kancil',  num: 18 },
  { title: 'Kata Sehari-hari',           slug: 'kata',    num: 19 },
];

function makeVariants() {
  const out = [];
  for (const b of BOOKS) {
    const openForBook = async (page, mode) => {
      await page.evaluate((t) => {
        openBook(t);
        renderShot('reader');
      }, b.title);
      if (mode === 'aktif') await page.click('#btnPlay');
      if (mode === 'pengaturan') await page.click('#btnTune');
    };
    out.push({
      file: `${b.num}-reader-${b.slug}`,
      screen: 'reader',
      settle: 300,
      act: (page) => openForBook(page, 'default'),
    });
    out.push({
      file: `${b.num}b-reader-${b.slug}-aktif`,
      screen: 'reader',
      settle: 1400,
      act: (page) => openForBook(page, 'aktif'),
    });
    out.push({
      file: `${b.num}c-reader-${b.slug}-pengaturan`,
      screen: 'reader',
      settle: 400,
      act: (page) => openForBook(page, 'pengaturan'),
    });
  }
  return out;
}

const VARIANTS = makeVariants();

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: WIDTH, height: 800 } });

console.log(`Base URL: ${BASE_URL}`);

for (const v of VARIANTS) {
  await page.goto(`${BASE_URL}/?shot=1&_=${Date.now()}#${v.screen}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  if (v.act) await v.act(page);
  await page.waitForTimeout(v.settle || 300);

  const result = await page.evaluate(() => {
    let css = '';
    document.querySelectorAll('style').forEach(st => {
      css += (st.textContent || '') + '\n';
    });
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = sheet.cssRules;
        if (rules) {
          for (const r of Array.from(rules)) css += r.cssText + '\n';
        }
      } catch (e) { /* cross-origin */ }
    }
    const bodyClone = document.body.cloneNode(true);
    bodyClone.querySelectorAll('script').forEach(el => el.remove());
    return {
      css,
      bodyHtml: bodyClone.innerHTML,
      bodyClass: document.body.className,
    };
  });

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=360, initial-scale=1" />
<title>Braille Haptic — ${v.file}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }

${result.css}
body.frozen { width: ${WIDTH}px; }
</style>
</head>
<body class="${result.bodyClass} frozen">
${result.bodyHtml}
</body>
</html>`;

  fs.writeFileSync(path.join(outDir, `${v.file}.html`), html, 'utf8');
  console.log(`  ${v.file}.html  (${(html.length / 1024).toFixed(1)} KB)`);
}

await browser.close();
console.log('Selesai.');
