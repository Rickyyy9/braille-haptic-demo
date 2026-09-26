const FRAME_KEYS = [
  '01-splash', '02-login', '03-signup', '04-home', '05-dashboard',
  '06-reader', '06b-reader-aktif', '06c-reader-pengaturan', '07-practice',
  '08-gesture', '09-contacts', '10-companion', '11-upload', '12-profile',
  '13-test', '14-lesson', '14b-lesson-kata',
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
  { from: '04-home', find: 'Bumi Manusia', to: '06-reader' },
  { from: '04-home', find: 'Lihat koleksi', to: '11-upload' },

  { from: '05-dashboard', find: 'Lanjutkan Membaca', to: '06-reader' },
  { from: '05-dashboard', find: 'Baca Toka', to: '06-reader' },
  { from: '05-dashboard', find: 'Koleksi Buku', to: '11-upload' },
  { from: '05-dashboard', find: 'Latihan Braille', to: '07-practice' },
  { from: '05-dashboard', find: 'Lihat koleksi', to: '11-upload' },
  { from: '05-dashboard', find: 'Bumi Manusia', to: '06-reader' },
  { from: '05-dashboard', find: 'Panduan Braille Dasar', to: '06-reader' },
  { from: '05-dashboard', find: 'Catatan Harian Sahabat', to: '06-reader' },

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
  { from: '11-upload', find: 'Bumi Manusia', to: '06-reader' },
  { from: '11-upload', find: 'Panduan Braille Dasar', to: '06-reader' },
  { from: '11-upload', find: 'Catatan Harian Sahabat', to: '06-reader' },
  { from: '11-upload', find: 'Kancil Menyeberangi Sungai', to: '06-reader' },
  { from: '11-upload', find: 'Kata Sehari-hari', to: '06-reader' },

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

function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function transition(t) {
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
  let cur = text;
  while (cur.parent && cur.parent.id !== frame.id && cur.parent.type !== 'PAGE') {
    cur = cur.parent;
    const h = cur.height || 0;
    const w = cur.width || 0;
    const okType = ['GROUP', 'FRAME', 'INSTANCE', 'COMPONENT', 'RECTANGLE'].includes(cur.type);
    if (okType && h <= 160 && h >= bestH && w <= frame.width * 0.75) {
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
      errors.push(`${link.from} > "${link.find}": ${e.message}`);
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
        errors.push(`nav ${key} > ${label}: ${e.message}`);
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
      await setReaction(src.node, mkReaction(dst.node.id, 'dissolve', fl.trigger));
      wired++;
      lines.push(`OK    ${fl.from} -> ${fl.to}  (${fl.trigger.type})`);
    } catch (e) {
      errors.push(`${fl.from} frame-link: ${e.message}`);
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
    errors.push(`flow starting point: ${e.message}`);
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
  figma.notify('Plugin error: ' + e.message, { error: true });
  figma.closePlugin();
});
