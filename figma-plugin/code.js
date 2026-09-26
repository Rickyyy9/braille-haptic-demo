const FRAME_KEYS = [
  '01-splash', '02-login', '03-signup', '04-home', '05-dashboard',
  '06-reader', '06b-reader-aktif', '06c-reader-pengaturan', '07-practice',
  '08-gesture', '09-contacts', '10-companion', '11-upload', '12-profile',
  '13-test', '14-lesson', '14b-lesson-kata',
  '15-reader-bumi', '15b-reader-bumi-aktif', '15c-reader-bumi-pengaturan',
  '16-reader-panduan', '16b-reader-panduan-aktif', '16c-reader-panduan-pengaturan',
  '17-reader-catatan', '17b-reader-catatan-aktif', '17c-reader-catatan-pengaturan',
  '18-reader-kancil', '18b-reader-kancil-aktif', '18c-reader-kancil-pengaturan',
  '19-reader-kata', '19b-reader-kata-aktif', '19c-reader-kata-pengaturan',
];

const NO_NAV = ['01-splash', '02-login', '03-signup'];

const NAV_LINKS = {
  Home: '04-home',
  Library: '05-dashboard',
  Latihan: '07-practice',
  Profil: '12-profile',
};

const LINKS = [
  { from: '02-login', find: 'Masuk sebagai Pendamping', to: '04-home' },
  { from: '02-login', find: 'Lanjut sebagai Pengguna', to: '04-home' },
  { from: '02-login', find: 'Daftar pendamping baru', to: '03-signup' },
  { from: '03-signup', find: 'Buat Akun', to: '04-home' },
  { from: '03-signup', find: 'Masuk di sini', to: '02-login' },

  { from: '04-home', find: 'Mulai Membaca', to: '05-dashboard' },
  { from: '04-home', find: 'Peta Gerakan Haptic', to: '08-gesture' },
  { from: '04-home', find: 'Kontak Darurat', to: '09-contacts' },
  { from: '04-home', find: 'Kondisi Pendamping', to: '10-companion' },
  { from: '04-home', find: 'Koleksi Buku', to: '11-upload' },

  { from: '05-dashboard', find: 'Lanjutkan Membaca', to: '06-reader' },
  { from: '05-dashboard', find: 'Baca Toka', to: '06-reader' },
  { from: '05-dashboard', find: 'Koleksi Buku', to: '11-upload' },
  { from: '05-dashboard', find: 'Latihan Braille', to: '07-practice' },
  { from: '05-dashboard', find: 'Lihat koleksi', to: '11-upload' },
  { from: '05-dashboard', find: 'Bumi Manusia', to: '15-reader-bumi' },
  { from: '05-dashboard', find: 'Panduan Braille Dasar', to: '16-reader-panduan' },
  { from: '05-dashboard', find: 'Catatan Harian Sahabat', to: '17-reader-catatan' },

  { from: '06-reader', find: 'LANJUTKAN MEMBACA', to: '06b-reader-aktif', t: 'smart' },
  { from: '06b-reader-aktif', find: 'Atur Kecepatan & Jeda', to: '06c-reader-pengaturan', t: 'smart' },
  { from: '06b-reader-aktif', find: 'Jeda', exact: true, to: '06-reader', t: 'smart' },
  { from: '06c-reader-pengaturan', find: 'Atur Kecepatan & Jeda', to: '06-reader', t: 'smart' },

  { from: '07-practice', find: 'Alfabet Dasar', to: '14-lesson' },
  { from: '07-practice', find: 'Alfabet Lanjutan', to: '14-lesson' },
  { from: '07-practice', find: 'Angka & Tanda Baca', to: '14-lesson' },
  { from: '07-practice', find: 'Kata Sehari-hari', to: '14b-lesson-kata' },
  { from: '07-practice', find: 'Alfabet Penutup', to: '14-lesson' },

  { from: '11-upload', find: 'Laskar Pelangi', to: '06-reader' },
  { from: '11-upload', find: 'Bumi Manusia', to: '15-reader-bumi' },
  { from: '11-upload', find: 'Panduan Braille Dasar', to: '16-reader-panduan' },
  { from: '11-upload', find: 'Catatan Harian Sahabat', to: '17-reader-catatan' },
  { from: '11-upload', find: 'Kancil Menyeberangi Sungai', to: '18-reader-kancil' },
  { from: '11-upload', find: 'Kata Sehari-hari', to: '19-reader-kata' },

  { from: '12-profile', find: 'Kondisi Pendamping', to: '10-companion' },
  { from: '12-profile', find: 'Kontak Darurat', to: '09-contacts' },
  { from: '12-profile', find: 'Koleksi Buku', to: '11-upload' },
  { from: '12-profile', find: 'Mode Pengujian', to: '13-test' },

  { from: '14-lesson', find: 'Selanjutnya', to: '14b-lesson-kata', t: 'smart' },
  { from: '14b-lesson-kata', find: 'Sebelumnya', to: '14-lesson', t: 'smart' },
];

const FRAME_LINKS = [
  { from: '01-splash', to: '02-login', trigger: { type: 'AFTER_TIMEOUT', timeout: 1.7 } },
  { from: '06-reader', to: '05-dashboard', trigger: { type: 'ON_DRAG' } },
  { from: '06b-reader-aktif', to: '05-dashboard', trigger: { type: 'ON_DRAG' } },
  { from: '06c-reader-pengaturan', to: '05-dashboard', trigger: { type: 'ON_DRAG' } },
];

/* Reader per buku (varian Laskar tetap 06/06b/06c):
   default -> aktif -> pengaturan dengan Smart Animate, geser = kembali ke Library */
const READER_SETS = [
  ['15-reader-bumi', '15b-reader-bumi-aktif', '15c-reader-bumi-pengaturan'],
  ['16-reader-panduan', '16b-reader-panduan-aktif', '16c-reader-panduan-pengaturan'],
  ['17-reader-catatan', '17b-reader-catatan-aktif', '17c-reader-catatan-pengaturan'],
  ['18-reader-kancil', '18b-reader-kancil-aktif', '18c-reader-kancil-pengaturan'],
  ['19-reader-kata', '19b-reader-kata-aktif', '19c-reader-kata-pengaturan'],
];
for (const [def, aktif, tune] of READER_SETS) {
  LINKS.push(
    { from: def, find: 'LANJUTKAN MEMBACA', to: aktif, t: 'smart' },
    { from: aktif, find: 'Atur Kecepatan & Jeda', to: tune, t: 'smart' },
    { from: aktif, find: 'Jeda', exact: true, to: def, t: 'smart' },
    { from: tune, find: 'Atur Kecepatan & Jeda', to: def, t: 'smart' },
  );
  FRAME_LINKS.push(
    { from: def, to: '05-dashboard', trigger: { type: 'ON_DRAG' } },
    { from: aktif, to: '05-dashboard', trigger: { type: 'ON_DRAG' } },
    { from: tune, to: '05-dashboard', trigger: { type: 'ON_DRAG' } },
  );
}

function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function transition(t) {
  if (t === 'instant') return null;
  return t === 'smart'
    ? { type: 'SMART_ANIMATE', easing: { type: 'EASE_IN_AND_OUT' }, duration: 0.35 }
    : { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.3 };
}

function mkReaction(destinationId, t, trigger) {
  return {
    trigger: trigger || { type: 'ON_CLICK' },
    actions: [{
      type: 'NODE',
      destinationId,
      navigation: 'NAVIGATE',
      transition: transition(t),
    }],
  };
}

async function setReaction(node, reaction) {
  if (typeof node.setReactionsAsync === 'function') {
    await node.setReactionsAsync([reaction]);
  } else {
    node.reactions = [reaction];
  }
}

async function tryReactions(node, reactions) {
  let last = null;
  for (const r of reactions) {
    try {
      await setReaction(node, r);
      return null;
    } catch (e) {
      last = e;
    }
  }
  return last;
}

function errText(e) {
  if (e === null || e === undefined) return 'unknown error';
  if (typeof e === 'string') return e;
  if (e.message) return e.message;
  try { return JSON.stringify(e); } catch (_) { return String(e); }
}

/* ==== Hover kartu huruf A-Z (While hovering -> State=Hover) ==== */

const CARD_STROKE = { r: 138 / 255, g: 182 / 255, b: 1 }; /* #8AB6FF, ikut .surface-interactive:hover */
const CARD_SHADOWS = [
  { type: 'DROP_SHADOW', color: { r: 11 / 255, g: 22 / 255, b: 32 / 255, a: 0.05 }, offset: { x: 0, y: 2 }, radius: 4, spread: 0, visible: true, blendMode: 'NORMAL' },
  { type: 'DROP_SHADOW', color: { r: 11 / 255, g: 95 / 255, b: 204 / 255, a: 0.28 }, offset: { x: 0, y: 10 }, radius: 22, spread: -10, visible: true, blendMode: 'NORMAL' },
];

function mkChangeTo(destinationId, smart) {
  return {
    trigger: { type: 'ON_HOVER' },
    actions: [{
      type: 'NODE',
      destinationId,
      navigation: 'CHANGE_TO',
      transition: smart
        ? { type: 'SMART_ANIMATE', easing: { type: 'EASE_OUT' }, duration: 0.15 }
        : null,
    }],
  };
}

function hasDotGrid(n) {
  try {
    return n.findAll(d =>
      d.type !== 'TEXT' && d.width > 2 && d.width <= 14 && d.height > 2 && d.height <= 14
    ).length >= 4;
  } catch (_) { return false; }
}

function findLetterCards(gFrame) {
  const texts = gFrame.findAll(n =>
    n.type === 'TEXT' && /^[A-Z]$/.test((n.characters || '').trim())
  );
  const cards = {};
  const already = [];
  for (const t of texts) {
    const ch = t.characters.trim();
    if (cards[ch] || already.indexOf(ch) >= 0) continue;
    let cur = t;
    let best = null;
    let bestDots = null;
    let converted = false;
    while (cur.parent && cur.parent.id !== gFrame.id && cur.parent.type !== 'PAGE') {
      const p = cur.parent;
      if (p.type === 'INSTANCE' || p.type === 'COMPONENT' || p.type === 'COMPONENT_SET') {
        converted = true;
        break;
      }
      const okType = p.type === 'FRAME' || p.type === 'GROUP';
      const okSize = p.width >= 30 && p.width <= 110 && p.height >= 40 && p.height <= 135;
      if (okType && okSize) {
        best = p;
        if (hasDotGrid(p)) bestDots = p;
      }
      cur = p;
    }
    if (converted) already.push(ch);
    else if (bestDots || best) cards[ch] = bestDots || best;
  }
  const missing = [];
  for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    if (!cards[ch] && already.indexOf(ch) < 0) missing.push(ch);
  }
  return { cards, already, missing };
}

function styleHoverVariant(comp) {
  const nodes = [comp].concat(comp.findAll(() => true));
  const shadowHolder =
    nodes.find(n => n.type !== 'TEXT' && n.effects && n.effects.some(e => e.type === 'DROP_SHADOW')) ||
    nodes.find(n => (n.type === 'FRAME' || n.type === 'RECTANGLE') &&
      n.fills !== figma.mixed && Array.isArray(n.fills) &&
      n.fills.some(f => f.type === 'SOLID' && f.visible !== false &&
        f.color.r > 0.85 && f.color.g > 0.85 && f.color.b > 0.85)) ||
    comp;
  const whiteFrame =
    nodes.find(n => (n.type === 'FRAME' || n.type === 'RECTANGLE') &&
      n.fills !== figma.mixed && Array.isArray(n.fills) &&
      n.fills.some(f => f.type === 'SOLID' && f.visible !== false &&
        f.color.r > 0.85 && f.color.g > 0.85 && f.color.b > 0.85)) ||
    null;

  let strokeFound = false;
  for (const n of nodes) {
    if (n.type === 'TEXT' || !n.strokes || !n.strokes.length) continue;
    try {
      n.strokes = n.strokes.map(s => (s.type === 'SOLID' ? Object.assign({}, s, { color: CARD_STROKE }) : s));
      strokeFound = true;
    } catch (_) { /* node tak mendukung stroke — abaikan */ }
  }

  try {
    const keep = (shadowHolder.effects || []).filter(e => e.type !== 'DROP_SHADOW');
    shadowHolder.effects = keep.concat(CARD_SHADOWS);
  } catch (_) { /* efek gagal — abaikan */ }

  if (!strokeFound && whiteFrame) {
    try {
      whiteFrame.strokes = [{ type: 'SOLID', color: CARD_STROKE, opacity: 1 }];
      whiteFrame.strokeWeight = 1;
      whiteFrame.strokeAlign = 'INSIDE';
    } catch (_) { /* stroke gagal — abaikan */ }
  }

  const letter = nodes.find(n => n.type === 'TEXT' && /^[A-Z]$/.test((n.characters || '').trim()));
  if (letter && letter.fontSize !== figma.mixed) {
    try { letter.fontSize = Math.round(letter.fontSize * 1.08 * 2) / 2; } catch (_) { /* campuran — abaikan */ }
  }
}

function score(frameName, key) {
  const f = norm(frameName);
  const k = norm(key);
  const k2 = norm(key.replace(/^\d+[a-z]?-/, ''));
  if (f === k) return 100;
  if (f.endsWith(k)) return 85;
  if (f.includes(k)) return 65;
  if (k2 && f.endsWith(k2)) return 45;
  if (k2 && f.includes(k2)) return 30;
  return 0;
}

function isTopFrame(n) {
  return n.type === 'FRAME' || n.type === 'COMPONENT' || n.type === 'INSTANCE';
}

function pickHotspot(text, frame) {
  let best = text;
  let bestH = text.height || 0;
  const wMaxCard = frame.width * 0.75;
  const wMaxButton = frame.width * 0.95;
  let cur = text;
  while (cur.parent && cur.parent.id !== frame.id && cur.parent.type !== 'PAGE') {
    cur = cur.parent;
    const h = cur.height || 0;
    const w = cur.width || 0;
    const okType = ['GROUP', 'FRAME', 'INSTANCE', 'COMPONENT', 'RECTANGLE'].includes(cur.type);
    /* kartu: sempit (<=75% lebar) dan pendek; tombol full-width: tinggi <=96px */
    const okCard = h <= 160 && w <= wMaxCard;
    const okButton = h <= 96 && w <= wMaxButton;
    if (okType && (okCard || okButton) && h >= bestH) {
      best = cur;
      bestH = h;
    }
  }
  return best;
}

async function main() {
  const lines = [];
  let wired = 0;

  try {
    if (typeof figma.loadAllPagesAsync === 'function') await figma.loadAllPagesAsync();
  } catch (e) { /* lanjut dengan page yang sudah termuat */ }

  const all = [];
  for (const page of figma.root.children) {
    for (const child of page.children) {
      if (isTopFrame(child)) all.push({ node: child, page });
    }
  }

  const resolved = {};
  const used = new Set();
  const sortedKeys = FRAME_KEYS.slice().sort((a, b) => norm(b).length - norm(a).length);
  for (const key of sortedKeys) {
    let best = null;
    let bestS = 0;
    for (const c of all) {
      if (used.has(c.node.id)) continue;
      const s = score(c.node.name, key);
      if (s > bestS) { bestS = s; best = c; }
    }
    if (best && bestS >= 30) {
      resolved[key] = best;
      used.add(best.node.id);
    }
  }

  lines.push('== FRAME ==');
  for (const key of FRAME_KEYS) {
    const r = resolved[key];
    lines.push(r ? `OK    ${key}  ->  "${r.node.name}"` : `MISS  ${key}`);
  }

  const missingFrames = FRAME_KEYS.filter(k => !resolved[k]);
  const missingHotspots = [];
  const errors = [];

  lines.push('');
  lines.push('== HOTSPOT ==');
  for (const link of LINKS) {
    try {
      const src = resolved[link.from];
      const dst = resolved[link.to];
      if (!src || !dst) {
        missingHotspots.push(`${link.from} > "${link.find}" (frame belum terpasang)`);
        continue;
      }
      const f = norm(link.find);
      const texts = src.node.findAll(n =>
        n.type === 'TEXT' && (link.exact ? norm(n.characters) === f : norm(n.characters).includes(f))
      );
      if (!texts.length) {
        missingHotspots.push(`${link.from} > "${link.find}"`);
        continue;
      }
      const seen = new Set();
      for (const t of texts) {
        const target = pickHotspot(t, src.node);
        if (seen.has(target.id)) continue;
        seen.add(target.id);
        if (src.page.id !== dst.page.id) {
          errors.push(`${link.from}: frame tujuan beda page (prototipe Figma harus 1 page)`);
          continue;
        }
        await setReaction(target, mkReaction(dst.node.id, link.t));
        wired++;
      }
    } catch (e) {
      errors.push(`${link.from} > "${link.find}": ${errText(e)}`);
    }
  }

  lines.push('');
  lines.push('== NAV BAWAH ==');
  for (const key of FRAME_KEYS) {
    if (NO_NAV.includes(key)) continue;
    const src = resolved[key];
    if (!src) continue;
    for (const label of Object.keys(NAV_LINKS)) {
      const destKey = NAV_LINKS[label];
      if (destKey === key) continue;
      const dst = resolved[destKey];
      if (!dst) continue;
      try {
        const f = norm(label);
        const texts = src.node.findAll(n => n.type === 'TEXT' && norm(n.characters) === f);
        const seen = new Set();
        for (const t of texts) {
          const target = pickHotspot(t, src.node);
          if (seen.has(target.id)) continue;
          seen.add(target.id);
          await setReaction(target, mkReaction(dst.node.id));
          wired++;
        }
      } catch (e) {
        errors.push(`nav ${key} > ${label}: ${errText(e)}`);
      }
    }
  }

  lines.push('');
  lines.push('== GESTUR / TIMEOUT ==');
  for (const fl of FRAME_LINKS) {
    try {
      const src = resolved[fl.from];
      const dst = resolved[fl.to];
      if (!src || !dst) { lines.push(`MISS  ${fl.from} -> ${fl.to}`); continue; }
      const err = await tryReactions(src.node, [
        mkReaction(dst.node.id, 'instant', fl.trigger),
        mkReaction(dst.node.id, 'smart', fl.trigger),
        mkReaction(dst.node.id, 'dissolve', fl.trigger),
      ]);
      if (err) {
        errors.push(`${fl.from} frame-link (${fl.trigger.type}): ${errText(err)}`);
        lines.push(`MISS  ${fl.from} -> ${fl.to}  (${fl.trigger.type})`);
      } else {
        wired++;
        lines.push(`OK    ${fl.from} -> ${fl.to}  (${fl.trigger.type})`);
      }
    } catch (e) {
      errors.push(`${fl.from} frame-link: ${errText(e)}`);
    }
  }

  try {
    const splash = resolved['01-splash'];
    if (splash) {
      figma.currentPage.flowStartingPoints = [{ nodeId: splash.node.id, name: 'Braille Haptic' }];
      lines.push('');
      lines.push('OK    flow starting point -> 01-splash');
    }
  } catch (e) {
    errors.push(`flow starting point: ${errText(e)}`);
  }

  lines.push('');
  lines.push('== HOVER KARTU A-Z ==');
  try {
    const g = resolved['08-gesture'];
    if (!g) {
      lines.push('MISS  HOVER A-Z: frame 08-gesture tak ditemukan');
      missingHotspots.push('hover A-Z: frame 08-gesture tak ditemukan');
    } else {
      const found = findLetterCards(g.node);
      const fresh = Object.keys(found.cards).sort();
      if (found.missing.length) {
        const detail = `huruf tak ditemukan: ${found.missing.join(', ')}`;
        lines.push(`MISS  HOVER A-Z: ${detail}`);
        missingHotspots.push(`hover A-Z (${found.missing.length}): ${detail}`);
      }
      if (fresh.length) {
        let maxBottom = 0;
        for (const c of g.page.children) {
          if ('y' in c && 'height' in c) {
            maxBottom = Math.max(maxBottom, c.y + c.height);
          }
        }
        const parkX = g.node.x;
        const parkY = maxBottom + 200;
        let ok = 0;
        const fail = [];
        let i = 0;
        for (const ch of fresh) {
          i++;
          try {
            const card = found.cards[ch];
            const parent = card.parent;
            const idx = parent.children.indexOf(card);
            const x0 = card.x;
            const y0 = card.y;
            const comp = figma.createComponentFromNode(card);
            const hover = comp.clone();
            styleHoverVariant(hover);
            const inst = comp.createInstance();
            parent.insertChild(idx, inst);
            if (!parent.layoutMode || parent.layoutMode === 'NONE') {
              inst.x = x0;
              inst.y = y0;
            }
            const set = figma.combineAsVariants([comp, hover], g.page);
            set.name = 'Kartu Huruf ' + ch;
            comp.name = 'State=Default';
            hover.name = 'State=Hover';
            try {
              comp.x = 16;
              comp.y = 16;
              hover.x = 16;
              hover.y = 16 + comp.height + 16;
              set.resizeWithoutConstraints(
                Math.max(comp.width, hover.width) + 32,
                16 + comp.height + 16 + hover.height + 16
              );
            } catch (_) { /* penataan kosmetik gagal — abaikan */ }
            set.x = parkX;
            set.y = parkY + i * 130;
            const err = await tryReactions(comp, [
              mkChangeTo(hover.id, true),
              mkChangeTo(hover.id, false),
            ]);
            if (err) fail.push(`${ch}: ${errText(err)}`);
            else ok++;
          } catch (e) {
            fail.push(`${ch}: ${errText(e)}`);
          }
        }
        if (ok) {
          const extra = found.already.length ? `, ${found.already.length} sudah ada sebelumnya` : '';
          lines.push(`OK    HOVER A-Z: ${ok} kartu terpasang${extra}`);
        }
        for (const f of fail) errors.push(`HOVER A-Z ${f}`);
      } else if (found.already.length) {
        lines.push(`OK    HOVER A-Z: sudah terpasang (${found.already.length} kartu)`);
      }
    }
  } catch (e) {
    errors.push(`HOVER A-Z: ${errText(e)}`);
  }

  lines.push('');
  lines.push('== RINGKASAN ==');
  lines.push(`Hotspot terpasang: ${wired}`);
  if (missingFrames.length) lines.push(`Frame tak ditemukan: ${missingFrames.join(', ')}`);
  if (missingHotspots.length) {
    lines.push(`Hotspot tak ditemukan (${missingHotspots.length}):`);
    for (const m of missingHotspots) lines.push(`  - ${m}`);
  }
  if (errors.length) {
    lines.push(`Error (${errors.length}):`);
    for (const e of errors) lines.push(`  - ${e}`);
  }
  if (!missingFrames.length && !missingHotspots.length && !errors.length) {
    lines.push('SEMUA TERPASANG — tidak ada masalah.');
  }

  const problems = missingFrames.length + missingHotspots.length + errors.length;
  figma.notify(problems
    ? `Wiring: ${wired} hotspot terpasang, ${problems} masalah — lihat panel laporan`
    : `Wiring selesai: ${wired} hotspot terpasang, tidak ada masalah`);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Inter, sans-serif; font-size: 11.5px; background: #1e1e1e; color: #ddd; margin: 0; padding: 10px; }
  pre { white-space: pre-wrap; word-break: break-word; font-family: Menlo, monospace; font-size: 10.5px; line-height: 1.5; margin: 0; }
  .ok { color: #6fdc8c; } .bad { color: #ff8a80; } .head { color: #82b1ff; font-weight: 700; }
  button { margin-top: 10px; width: 100%; padding: 7px; background: #0d99ff; color: #fff; border: 0; border-radius: 5px; font-weight: 600; cursor: pointer; }
</style></head>
<body>
<pre id="out"></pre>
<button onclick="parent.postMessage({ pluginMessage: { type: 'close' } }, '*')">Tutup</button>
<script>
  onmessage = (e) => {
    const lines = e.data.pluginMessage.lines;
    document.getElementById('out').innerHTML = lines.map(l => {
      const esc = l.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      if (/^==/.test(l)) return '<span class="head">' + esc + '</span>';
      if (/^(MISS|ERR|Hotspot tak ditemukan|Error)/.test(l) || /^  - /.test(l)) return '<span class="bad">' + esc + '</span>';
      if (/^OK/.test(l) || /^SEMUA/.test(l)) return '<span class="ok">' + esc + '</span>';
      return esc;
    }).join('\\n');
  };
</script>
</body>
</html>`;

  figma.showUI(html, { width: 440, height: 520 });
  figma.ui.postMessage({ type: 'report', lines });
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'close') figma.closePlugin();
};

main().catch(e => {
  figma.notify('Plugin error: ' + errText(e), { error: true });
  figma.closePlugin();
});
