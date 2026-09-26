/* =========================================================================
   BRAILLE HAPTIC — PROTOTIPE DEMO
   Bagian 2: Data layar, render, navigasi.
   Teks diambil dari desain Figma asli ("Template" milik teman).
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. STATE
   ------------------------------------------------------------------------- */
const STATE = {
  screen: 'home',

  // Figma: profil "Braille Haptic" / "Bunda Haptic — Tenaga Didik Terlatih"
  user: { name: 'Bunda Haptic', role: 'Tenaga Didik Terlatih' },

  // Figma: kartu "SEDANG DIBACA — Laskar Pelangi / Andrea Hirata"
  book: {
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    progress: 68,
    page: 42,
    totalPage: 68,
  },

  // Figma: panel "Penyelarasan Haptic"
  settings: {
    wpm: 120,          // "120 WPM (Normal)"
    interaction: 85,   // "Interaksi Getaran 85% Kuota Aktif"
    tickMs: 90,        // "Durasi Tick 90 ms — Tinta Braille Tunggal"
    charGap: 150,      // "Jeda Karakter 150 ms — Pemutun Hmr"
    wordGap: 300,      // "Jeda Rata 300 ms — Perlukan Kata/Spasi"
    fullVibrate: true, // "Mode Layar Penuh Getar"
    serveAudio: false, // "Unggah Bank Suara (Audio Cues)"
  },

  // Figma: statistik latihan
  practice: {
    level: 'Level 2 Mahir Huruf',
    done: 21,
    target: 28,
    percent: 72,
    chars: 18,
    days: 5,
    accuracy: 94,
  },
};

/* -------------------------------------------------------------------------
   2. IKON SVG (Phosphor-style, stroke konsisten)
   ------------------------------------------------------------------------- */
const ICON = {
  home:   '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h3.5v-5.5h5V21H18a1 1 0 0 0 1-1V9.5"/>',
  book:   '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19a1 1 0 0 1 1 1v13"/><path d="M6.5 17H20v2.5A2.5 2.5 0 0 1 17.5 22H6.5A2.5 2.5 0 0 1 4 19.5v-14"/>',
  dumbbell: '<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/>',
  user:   '<circle cx="12" cy="8" r="3.5"/><path d="M5 20.5c1.2-3.6 3.8-5.5 7-5.5s5.8 1.9 7 5.5"/>',
  play:   '<path d="M7 5.5v13l11-6.5z"/>',
  pause:  '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  stop:   '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  prev:   '<path d="M18 6v12L8 12z"/><path d="M6 5v14"/>',
  next:   '<path d="M6 6v12l10-6z"/><path d="M18 5v14"/>',
  back:   '<path d="M15 5l-7 7 7 7"/>',
  chev:   '<path d="M9 6l6 6-6 6"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  more:   '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  shield: '<path d="M12 3l7 3v5.5c0 4.4-3 8.1-7 9.5-4-1.4-7-5.1-7-9.5V6z"/>',
  map:    '<path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13M15 6.5v13"/>',
  phone:  '<path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
  users:  '<circle cx="9" cy="8" r="3"/><path d="M3 19c.9-3 3.1-4.5 6-4.5S14.1 16 15 19"/><path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 14.7c2 .6 3.3 2 3.9 4.3"/>',
  upload: '<path d="M12 16V4M8 8l4-4 4 4"/><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  check:  '<path d="M5 12.5l4.5 4.5L19 7"/>',
  sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.4 2.4M15.6 15.6L18 18M18 6l-2.4 2.4M8.4 15.6L6 18"/>',
  hand:   '<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6a1.5 1.5 0 0 1 3 0v8.5a5.5 5.5 0 0 1-5.5 5.5H10a5 5 0 0 1-4.4-2.6L4 15.2a1.6 1.6 0 0 1 2.6-1.8L8 15"/>',
  clock:  '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  trend:  '<path d="M4 17l5-5 3.5 3.5L20 8"/><path d="M15.5 8H20v4.5"/>',
  info:   '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8h.01"/>',
  braille:'<circle cx="8" cy="6" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="8" cy="18" r="1.6"/><circle cx="16" cy="6" r="1.6"/><circle cx="16" cy="12" r="1.6"/><circle cx="16" cy="18" r="1.6"/>',
  // Sel braille + tanda centang: melambangkan modul latihan / progres belajar
  braillelearn: '<circle cx="7" cy="6.5" r="1.5"/><circle cx="7" cy="12" r="1.5"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="13.5" cy="12" r="1.5"/><circle cx="13.5" cy="17.5" r="1.5"/><path d="M16.5 14.5l2 2 3.5-4"/>',
  volume: '<path d="M5 9.5h3l4-3.5v12l-4-3.5H5z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10"/>',
  puzzle: '<path d="M13 3.5a2 2 0 0 1 2 2V7h2.5a2 2 0 0 1 0 4H15v2.5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 0-2-2v-2H8.5a2 2 0 0 1 0-4H11V7a2 2 0 0 0-2-2"/>',
  book2:  '<path d="M12 6.5C10.5 5 8.5 4.5 6 5v13c2.5-.5 4.5 0 6 1.5 1.5-1.5 3.5-2 6-1.5V5c-2.5-.5-4.5 0-6 1.5z"/><path d="M12 6.5V19.5"/>',
  grid:   '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  award:  '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5"/>',
  touch:  '<circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/>',
};

const svg = (name, cls = 'w-5 h-5', stroke = 1.75) =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false">${ICON[name] || ''}</svg>`;

/* -------------------------------------------------------------------------
   3. RENDER LAYAR
   ------------------------------------------------------------------------- */
const main = document.getElementById('appMain');
const nav  = document.getElementById('navList');

/* --- Logo mini brand (dipakai di header) --- */
function brandMark(size = 'w-6 h-6') {
  return `<span class="${size} rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">${svg('braille', 'w-4 h-4', 2)}</span>`;
}

/* ============ LAYAR 1 : ONBOARDING / HOME ============ */
function renderHome() {
  // Figma: "Braille Haptic" / "Bunda Haptic / Tenaga Didik Terlatih"
  return `
  <div class="min-h-full flex flex-col bg-white">
    <div class="relative">
      <!-- Busur gradient berlapis + noise halus -->
      <div class="absolute inset-x-0 top-0 h-52 decorative overflow-hidden" aria-hidden="true"
           style="background:
              radial-gradient(120% 120% at 50% -20%, #5A93F7 0%, #2B7BF3 26%, #0B5FCC 58%, #094BA3 82%, #0A3D80 100%);
              border-bottom-left-radius: 46% 40px; border-bottom-right-radius: 46% 40px;
              box-shadow: 0 18px 40px -22px rgba(11,95,204,.55);">
        <div class="absolute -left-10 top-6 w-40 h-40 rounded-full" style="background: radial-gradient(circle, rgba(255,255,255,.22), transparent 68%)"></div>
        <div class="absolute right-0 top-24 w-32 h-32 rounded-full" style="background: radial-gradient(circle, rgba(255,255,255,.14), transparent 70%)"></div>
      </div>

      <div class="relative px-6 pt-4 flex items-center justify-between text-white">
        <span class="text-xs font-semibold opacity-95 tabular">09:41</span>
        <div class="flex items-center gap-2 opacity-95 decorative" aria-hidden="true">
          ${svg('volume','w-3.5 h-3.5',2)}<span class="text-[10px]">Tel</span>
        </div>
      </div>

      <div class="relative flex flex-col items-center pt-3 pb-9 rise">
        <div class="w-[84px] h-[84px] rounded-full bg-white/95 p-[3px]"
             style="box-shadow: 0 8px 22px -8px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.5)">
          <div class="w-full h-full rounded-full flex items-center justify-center text-brand-600"
               style="background: linear-gradient(160deg,#D9E8FF,#B7D2FF); box-shadow: inset 0 2px 6px rgba(11,95,204,.18)">
            ${svg('user', 'w-9 h-9', 1.6)}
          </div>
        </div>
        <p class="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">Braille Haptic</p>
        <h1 class="text-[19px] font-extrabold text-white leading-tight">${STATE.user.name}</h1>
        <p class="text-[12.5px] text-white/90">${STATE.user.role}</p>
      </div>
    </div>

    <div class="px-5 -mt-3">
      <ul class="stagger space-y-0.5">
        ${homeItem('shield', 'Mode Aksesibilitas', 'Kontras, teks & getaran', { toggle: 'focus' })}
        ${homeItem('braille', 'Peta Gerakan Haptic', 'Pola getaran tiap huruf', { nav: 'gesture' })}
        ${homeItem('phone',  'Kontak Darurat', 'Hubungi pendamping')}
        ${homeItem('users',  'Kondisi Pendamping', 'Siapa yang mendampingi')}
        ${homeItem('upload', 'Unggah Buku Haptic', 'Impor file buku')}
      </ul>
    </div>

    <div class="mt-auto px-5 pb-4 pt-6 space-y-3">
      <button type="button" data-nav="dashboard"
              class="btn-primary w-full min-h-[54px] rounded-2xl
                     text-white font-bold text-[15px] tracking-[-0.01em]
                     flex items-center justify-center gap-2">
        ${svg('play', 'w-5 h-5')} Mulai Membaca
      </button>
      <p class="text-center text-[11.5px] text-ink-500">
        Dengan melanjutkan, kamu menyetujui panduan keselamatan braille.
      </p>
    </div>
  </div>`;
}

function homeItem(icon, title, sub, opts = {}) {
  const isToggle = opts.toggle === 'focus';
  const attrs = isToggle ? `data-toggle="focus" aria-pressed="false"`
    : opts.nav ? `data-nav="${opts.nav}"`
    : `data-act="item"`;
  const trailing = isToggle
    ? `<span data-toggle-label class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface text-ink-500 border border-line transition-colors">Nonaktif</span>`
    : `<span class="text-ink-300 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">${svg('chev', 'w-4 h-4', 2)}</span>`;

  return `
  <li>
    <button type="button" ${attrs}
            class="btn-ghost w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-left
                   hover:bg-brand-50 active:bg-brand-100 group">
      <span class="w-11 h-11 shrink-0 rounded-xl bg-brand-50 text-brand-600 border border-brand-100
                   flex items-center justify-center transition-all duration-200
                   group-hover:bg-white group-hover:shadow-hair group-hover:scale-[1.04]">
        ${svg(icon, 'w-[22px] h-[22px]')}
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-[15px] font-semibold text-ink-900 leading-snug tracking-[-0.008em]">${title}</span>
        <span class="block text-[12.5px] text-ink-500 truncate">${sub}</span>
      </span>
      ${trailing}
    </button>
  </li>`;
}

/* ============ LAYAR 2 : DASHBOARD ============ */
function renderDashboard() {
  // Figma: "Halo, Selamat Datang" + "Sensui layar kapan saja untuk umpan balik getaran tactile."
  return `
  <div class="pb-6">
    <div class="px-5 pt-4 rise">
      <p class="text-[13px] text-ink-500">${greeting()},</p>
      <h1 class="text-[23px] font-extrabold text-ink-900 leading-[1.12] tracking-[-0.024em]">Selamat Datang</h1>
      <p class="mt-2 text-[13px] leading-relaxed text-ink-500 font-access">
        Sentuh layar kapan saja untuk umpan balik getaran tactile.
      </p>
    </div>

    <!-- Kartu Sedang Dibaca -->
    <section class="px-5 mt-4 rise" aria-labelledby="lbl-now">
      <div class="sheen rounded-3xl text-white p-4 on-dark relative overflow-hidden"
           style="background: linear-gradient(150deg, #1E74E8 0%, #0B5FCC 42%, #094BA3 78%, #0A3D80 100%);
                  box-shadow: 0 1px 2px rgba(11,22,32,.1), 0 14px 30px -14px rgba(11,95,204,.55);">
        <div class="absolute -right-12 -top-12 w-44 h-44 rounded-full decorative"
             style="background: radial-gradient(circle,rgba(255,255,255,.20),transparent 68%)" aria-hidden="true"></div>
        <div class="absolute left-0 bottom-0 w-32 h-32 rounded-full decorative"
             style="background: radial-gradient(circle,rgba(255,255,255,.10),transparent 70%)" aria-hidden="true"></div>
        <div class="relative">
          <h2 id="lbl-now" class="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/90">
            ${svg('book', 'w-3.5 h-3.5', 2)} Sedang Dibaca
          </h2>
          <div class="mt-3 flex gap-3.5">
            <div class="w-16 h-[88px] rounded-xl bg-white/95 shrink-0 decorative flex items-center justify-center text-brand-600"
                 style="box-shadow: 0 6px 16px -6px rgba(0,0,0,.45)" aria-hidden="true">${svg('book2', 'w-7 h-7', 1.6)}</div>
            <div class="min-w-0">
              <p class="text-[16.5px] font-bold leading-snug tracking-[-0.012em]">${STATE.book.title}</p>
              <p class="text-[12.5px] text-white/90 mt-0.5">${STATE.book.author}</p>
              <p class="mt-2 inline-flex items-center gap-1 text-[11px] bg-white/20 rounded-full px-2.5 py-1 border border-white/15">
                ${svg('clock', 'w-3 h-3', 2)} Buku 4 • Derning Lancong Sekalar
              </p>
            </div>
          </div>

          <!-- Figma: KARAKTER AKTIF "K" + 68% Selesai -->
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-white/10 px-3.5 py-2.5 border border-white/10">
              <p class="text-[9.5px] uppercase tracking-[0.12em] text-white/80">Karakter Aktif</p>
              <p class="text-[22px] font-extrabold leading-tight tabular">K</p>
            </div>
            <div class="rounded-xl bg-white/10 px-3.5 py-2.5 border border-white/10">
              <p class="text-[9.5px] uppercase tracking-[0.12em] text-white/80">Progres</p>
              <p class="text-[22px] font-extrabold leading-tight tabular">${STATE.book.progress}% <span class="text-[11px] font-semibold text-white/85">Selesai</span></p>
            </div>
          </div>

          <button type="button" data-nav="reader"
                  class="mt-4 w-full min-h-[48px] rounded-xl bg-white text-brand-700 font-bold text-[14px]
                         tracking-[-0.008em] btn-ghost hover:bg-brand-50 active:bg-brand-100
                         flex items-center justify-center gap-2"
                  style="box-shadow: 0 4px 14px -6px rgba(0,0,0,.35)">
            ${svg('play', 'w-4 h-4')} Lanjutkan Membaca
          </button>
        </div>
      </div>
    </section>

    <!-- Menu Cepat (Figma: Baca Toka / Impor Buku / Latihan Braille / Aria Sari) -->
    <section class="px-5 mt-6" aria-labelledby="lbl-quick">
      <div class="flex items-center justify-between">
        <h2 id="lbl-quick" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Menu Cepat</h2>
        <button type="button" class="text-[12.5px] font-semibold text-brand-600 hover:underline">Akses Cepat Tactile</button>
      </div>
      <div class="mt-3 grid grid-cols-2 gap-3 stagger">
        ${quickCard('book', 'Baca Toka', 'Live Braille Tactile', 'reader', 'ok', { chip: 'Toka' })}
        ${quickCard('upload', 'Impor Buku', 'Haptic PDF Reader', 'detail', 'brand', { chip: 'Haptic PDF' })}
        ${quickCard('braillelearn', 'Latihan Braille', 'Panduan & Kuis Haptic', 'practice', 'warn', { chip: 'Audiens' })}
        ${quickCard('users', 'Aria Sari', 'Ari Sari (Tuli)', 'gesture', 'teal', { chip: 'Tuli' })}
      </div>
    </section>

    <!-- Buku Terakhir -->
    <section class="px-5 mt-6" aria-labelledby="lbl-recent">
      <h2 id="lbl-recent" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Buku Terakhir</h2>
      <ul class="mt-3 space-y-3 stagger">
        ${recentRow('Bumi Manusia', 'Pramoedya Ananta Toer', 84, 'brand')}
        ${recentRow('Panduan Braille Dasar', 'SS & Panduan', 100, 'ok')}
        ${recentRow('Catatan Harian Sahabat', 'Kumpulan Fiktual', 12, 'warn')}
      </ul>
    </section>

    <!-- Tip Tactile (Figma: teks panjang) -->
    <section class="px-5 mt-6" aria-labelledby="lbl-tip">
      <div class="rounded-2xl border border-brand-100 p-4"
           style="background: linear-gradient(180deg, #EEF5FF, #E4EFFF); box-shadow: inset 0 1px 0 rgba(255,255,255,.7)">
        <h2 id="lbl-tip" class="flex items-center gap-1.5 text-[13px] font-bold text-brand-700">
          ${svg('sparkle', 'w-4 h-4')} Tip Tactile
        </h2>
        <ul class="mt-2.5 space-y-2 text-[12.5px] text-ink-700 font-access leading-relaxed">
          <li class="flex gap-2"><span class="text-brand-600 shrink-0">•</span> Jari jari jangan diangkat sepenuhnya agar getaran terbaca stabil.</li>
          <li class="flex gap-2"><span class="text-brand-600 shrink-0">•</span> Nilai lebih besar memudahkan pemula mengenali titik braille.</li>
          <li class="flex gap-2"><span class="text-brand-600 shrink-0">•</span> Uji coba tarikan getaran dengan ritme yang tenang.</li>
        </ul>
      </div>
    </section>
  </div>`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 19) return 'Selamat sore';
  return 'Selamat malam';
}

function quickCard(icon, title, sub, nav, tone, extra = {}) {
  const tones = {
    ok:    'bg-ok-50 text-ok-600 border-ok-600/20',
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    warn:  'bg-warn-50 text-warn-600 border-warn-600/20',
    teal:  'bg-teal-600/10 text-teal-600 border-teal-600/20',
  };
  const chipTone = {
    ok:    'bg-ok-50 text-ok-600 border-ok-600/20',
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    warn:  'bg-warn-50 text-warn-600 border-warn-600/20',
    teal:  'bg-teal-600/10 text-teal-600 border-teal-600/20',
  };
  const t = tones[tone] || tones.brand;
  return `
  <button type="button" data-nav="${nav}"
          class="surface surface-interactive text-left rounded-2xl p-3.5 min-h-[116px]
                 flex flex-col justify-between group">
    <span class="w-10 h-10 rounded-xl border ${t} flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.06]">${svg(icon, 'w-[19px] h-[19px]')}</span>
    <span class="mt-2">
      ${extra.chip ? `<span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${chipTone[tone]} mb-1.5">${extra.chip}</span>` : ''}
      <span class="block text-[13.5px] font-bold text-ink-900 leading-tight tracking-[-0.01em]">${title}</span>
      <span class="block text-[11.5px] text-ink-500 mt-0.5">${sub}</span>
    </span>
  </button>`;
}

function recentRow(title, sub, pct, tone) {
  const bar = { brand: 'bg-brand-600', ok: 'bg-ok-600', warn: 'bg-warn-600' }[tone] || 'bg-brand-600';
  const pctCls = { brand: 'text-brand-600', ok: 'text-ok-700', warn: 'text-warn-700' }[tone] || 'text-brand-600';
  return `
  <li>
    <div class="surface flex items-center gap-3 rounded-2xl p-3 transition-shadow hover:shadow-sm">
      <span class="w-11 h-11 shrink-0 rounded-xl text-brand-600 flex items-center justify-center decorative"
            style="background: linear-gradient(160deg,#EEF5FF,#D9E8FF); box-shadow: inset 0 1px 0 rgba(255,255,255,.8)"
            aria-hidden="true">
        ${svg('book2', 'w-5 h-5', 1.7)}
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-[13.5px] font-semibold text-ink-900 truncate tracking-[-0.008em]">${title}</p>
        <p class="text-[11.5px] text-ink-500 truncate">${sub}</p>
        <div class="mt-2 h-1.5 rounded-full bg-surface overflow-hidden"
             role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"
             aria-label="Progres ${title} ${pct} persen">
          <div class="h-full ${bar} rounded-full transition-[width] duration-500" style="width:${pct}%"></div>
        </div>
      </div>
      <span class="text-[12px] font-bold ${pctCls} shrink-0 self-start mt-0.5 tabular">${pct}%</span>
    </div>
  </li>`;
}

/* ============ LAYAR 3 : READER ============ */
function renderReader() {
  // Kalimat Figma: "Suara lincong tua berdenting nyaring di halaman sekolah kami yang sunyi."
  return `
  <div class="pb-6">
    <div class="px-5 pt-4 rise">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h1 class="text-[19px] font-extrabold text-ink-900 leading-tight tracking-[-0.02em]">${STATE.book.title}</h1>
          <p class="text-[12.5px] text-ink-500 mt-1">Buku • ${STATE.book.author} • Derning Lancong Sekalar</p>
        </div>
        <div class="shrink-0 text-right rounded-xl bg-surface border border-line px-3 py-1.5">
          <p class="text-[10px] uppercase tracking-wider text-ink-500">Karakter</p>
          <p class="text-[15px] font-extrabold text-ink-900 tabular">14 / 68</p>
        </div>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <span class="text-[12px] text-ink-500">Halaman 42 dari 68</span>
        <span class="text-[12px] font-bold text-ok-700 tabular">23% Selesai</span>
      </div>
      <div class="mt-2 h-2 rounded-full bg-surface overflow-hidden" style="box-shadow: inset 0 1px 2px rgba(11,22,32,.08)"
           role="progressbar" aria-valuenow="23" aria-valuemin="0" aria-valuemax="100"
           aria-label="Progres membaca 23 persen">
        <div class="h-full rounded-full transition-[width] duration-500"
             style="width:23%; background: linear-gradient(90deg,#16A34A,#15803D)"></div>
      </div>
    </div>

    <!-- Kalimat sumber -->
    <section class="px-5 mt-5 rise" aria-labelledby="lbl-sentence">
      <div class="rounded-2xl p-4 border border-line"
           style="background: linear-gradient(180deg,#F8FBFF,#F1F6FC); box-shadow: inset 0 1px 0 rgba(255,255,255,.8)">
        <h2 id="lbl-sentence" class="sr-only">Kalimat yang sedang dibaca</h2>
        <p class="text-[16px] leading-[1.75] text-ink-900 font-access">
          Suara lincong tua berdenting nyaring di halaman sekolah
          <mark id="markChar" class="bg-brand-100 text-brand-800 font-bold rounded-md px-1.5 py-0.5 ring-1 ring-brand-200">k</mark>ami yang sunyi.
        </p>
      </div>
    </section>

    <!-- Kartu BRAILLE -->
    <section class="px-5 mt-4 rise" aria-labelledby="lbl-braille">
      <div class="sheen rounded-3xl text-white p-5 on-dark relative overflow-hidden"
           style="background: linear-gradient(155deg, #1E74E8 0%, #0B5FCC 45%, #094BA3 80%, #0A3D80 100%);
                  box-shadow: 0 1px 2px rgba(11,22,32,.1), 0 16px 34px -16px rgba(11,95,204,.6);">
        <div class="absolute -right-14 -top-14 w-48 h-48 rounded-full decorative"
             style="background: radial-gradient(circle,rgba(255,255,255,.18),transparent 68%)" aria-hidden="true"></div>
        <div class="relative">
          <!-- Chip "Pola Getaran" -->
          <div class="inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/25 px-3 py-1.5 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-white pulse" aria-hidden="true"></span>
            <p id="patternChip" class="text-[11.5px] font-semibold tracking-[-0.005em]">
              Pola Getaran: Titik <span id="patternDots">1, 3, 5</span> (Aktif + Bergetar)
            </p>
          </div>

          <div class="mt-5 flex items-center justify-center gap-9">
            <div class="text-center">
              <div id="bigChar" class="text-[68px] leading-none font-extrabold tracking-[-0.03em]"
                   style="text-shadow: 0 4px 14px rgba(0,0,0,.25)">K</div>
              <p class="mt-2 text-[10px] tracking-[0.2em] text-white/75">ALFABET LATIN</p>
            </div>
            <div class="w-px h-20 bg-white/20" aria-hidden="true"></div>
            <div class="text-center">
              <div id="brailleCell" class="grid grid-cols-2 gap-x-5 gap-y-2.5" aria-hidden="true"></div>
              <p class="mt-2.5 text-[10px] tracking-[0.2em] text-white/75">SEL BRAILLE</p>
            </div>
          </div>

          <button type="button" id="btnFeel"
                  class="btn-ghost mt-5 w-full min-h-[50px] rounded-xl bg-white text-brand-700 font-bold text-[14.5px]
                         hover:bg-brand-50 active:bg-brand-100
                         flex items-center justify-center gap-2"
                  style="box-shadow: 0 6px 18px -8px rgba(0,0,0,.4)">
            ${svg('hand', 'w-5 h-5')} Rasakan pola braille ini
          </button>
          <p id="hapticStatus" class="mt-2.5 text-center text-[11.5px] text-white/90" role="status" aria-live="polite"></p>
        </div>
      </div>
    </section>

    <!-- Kontrol pemutaran -->
    <section class="px-5 mt-6" aria-labelledby="lbl-play">
      <div class="flex items-center justify-between">
        <h2 id="lbl-play" class="text-[13px] font-bold text-ink-900 tracking-[-0.01em]">Pengendali Sudut Haptic</h2>
        <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ok-700">
          <span class="w-1.5 h-1.5 rounded-full bg-ok-600 pulse" aria-hidden="true"></span> Sinkron getaran aktif
        </span>
      </div>

      <div class="mt-4 flex items-center justify-center gap-5">
        <button type="button" id="btnPrev" aria-label="Karakter sebelumnya"
                class="btn-ghost surface w-12 h-12 rounded-full text-ink-700
                       hover:bg-surface active:bg-brand-50 flex items-center justify-center">
          ${svg('prev', 'w-5 h-5')}
        </button>
        <button type="button" id="btnPlay" aria-pressed="false"
                class="btn-primary w-[68px] h-[68px] rounded-full text-white
                       flex items-center justify-center">
          <span id="playIcon">${svg('play', 'w-7 h-7')}</span>
          <span class="sr-only" id="playLabel">Putar pembacaan haptic</span>
        </button>
        <button type="button" id="btnNext" aria-label="Karakter berikutnya"
                class="btn-ghost surface w-12 h-12 rounded-full text-ink-700
                       hover:bg-surface active:bg-brand-50 flex items-center justify-center">
          ${svg('next', 'w-5 h-5')}
        </button>
      </div>
    </section>

    <!-- Panel Penyelarasan Haptic -->
    <section class="px-5 mt-6" aria-labelledby="lbl-align">
      <div class="flex items-center justify-between">
        <h2 id="lbl-align" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Penyelarasan Haptic</h2>
        <span class="text-[10.5px] font-bold rounded-full bg-brand-50 text-brand-600 border border-brand-100 px-2.5 py-1">Profil: Presisi Ideal</span>
      </div>

      <!-- Kecepatan Membaca -->
      <div class="surface mt-3 rounded-2xl p-4">
        <div class="flex items-center justify-between">
          <label for="wpm" class="text-[13px] font-semibold text-ink-900">Kecepatan Membaca (WPM)</label>
          <span class="text-[12px] font-bold text-brand-600 tabular"><span id="wpmVal">${STATE.settings.wpm}</span> WPM <span class="text-ink-500 font-medium">(Normal)</span></span>
        </div>
        <input id="wpm" type="range" min="60" max="240" step="5" value="${STATE.settings.wpm}"
               class="mt-3 w-full accent-brand-600 cursor-pointer" aria-describedby="wpmHelp" />
        <div class="flex justify-between text-[10.5px] text-ink-500 mt-1.5" id="wpmHelp">
          <span>Lambat (60)</span><span>Ideal (120)</span><span>Cepat (240)</span>
        </div>
      </div>

      <!-- Interaksi Getaran + Durasi Tick -->
      <div class="mt-3 grid grid-cols-2 gap-3 stagger">
        ${metricCard('Interaksi Getaran', STATE.settings.interaction, '%', 'Kuota Aktif', 'ok')}
        ${metricCard('Durasi Tick', STATE.settings.tickMs, 'ms', 'Tinta Braille Tunggal', 'brand')}
        ${metricCard('Jeda Karakter', STATE.settings.charGap, 'ms', 'Pemutun Hmr', 'brand')}
        ${metricCard('Jeda Rata', STATE.settings.wordGap, 'ms', 'Perlukan Kata/Spasi', 'brand')}
      </div>

      <div class="surface mt-3 rounded-2xl divide-y divide-line overflow-hidden">
        ${switchRow('fullVibrate', 'Mode Layar Penuh Getar', 'Seluruh permukaan layar bergetar bersamaan', STATE.settings.fullVibrate)}
        ${switchRow('serveAudio', 'Unggah Bank Suara (Audio Cues)', 'Suara beri tahu untuk para pendamping', STATE.settings.serveAudio)}
      </div>
    </section>

    <!-- Tombol Read Text -->
    <div class="px-5 mt-5">
      <button type="button" id="btnReadText"
              class="btn-primary w-full min-h-[54px] rounded-2xl text-white font-bold text-[15px]
                     flex items-center justify-center gap-2">
        ${svg('braille', 'w-5 h-5', 2)} Read Text
      </button>
    </div>
  </div>`;
}

function metricCard(label, value, unit, sub, tone) {
  const tones = { ok: 'text-ok-700 bg-ok-50 border-ok-600/20', brand: 'text-brand-600 bg-brand-50 border-brand-100' };
  const t = tones[tone] || tones.brand;
  return `
  <div class="surface rounded-2xl p-4">
    <p class="text-[11.5px] font-semibold text-ink-500">${label}</p>
    <p class="mt-1.5 text-[23px] font-extrabold leading-none text-ink-900 tabular tracking-[-0.02em]">${value} <span class="text-[12px] font-semibold text-ink-500">${unit}</span></p>
    <span class="mt-2.5 inline-block text-[10.5px] font-bold rounded-md border px-1.5 py-0.5 ${t}">${sub}</span>
  </div>`;
}

function switchRow(key, title, sub, on) {
  return `
  <div class="flex items-center gap-3 p-4 transition-colors hover:bg-surface/60">
    <div class="min-w-0 flex-1">
      <p class="text-[13px] font-semibold text-ink-900 leading-snug">${title}</p>
      <p class="text-[11.5px] text-ink-500 leading-snug mt-0.5">${sub}</p>
    </div>
    <button type="button" role="switch" data-switch="${key}" aria-checked="${on}"
            class="relative shrink-0 w-[52px] h-[30px] rounded-full transition-colors duration-200
                   ${on ? 'bg-brand-600' : 'bg-ink-300'}"
            style="box-shadow: inset 0 1px 2px rgba(11,22,32,.18)"
            aria-label="${title}">
      <span class="absolute top-[3px] left-[3px] w-6 h-6 rounded-full bg-white transition-transform duration-200 ease-out
                   ${on ? 'translate-x-[22px]' : ''}"
            style="box-shadow: 0 1px 3px rgba(11,22,32,.28)"></span>
    </button>
  </div>`;
}

/* ============ LAYAR 4 : LATIHAN BRAILLE ============ */
function renderPractice() {
  const p = STATE.practice;
  // Figma: modul "Alfabet Dasar (A–J) Selesai 100%", "Alfabet Lanjutan (K–T) Progres 70%", "Angka & Tanda Baca", "Kata Sehari-hari"
  const lessons = [
    { code: 'A–J', name: 'Alfabet Dasar (A–J)',   sub: 'Kumpulan huruf braille pertama',   status: 'Selesai 100%', tone: 'ok',   meta: '10 Pelajaran' },
    { code: 'K–T', name: 'Alfabet Lanjutan (K–T)', sub: 'Progres 70%',                      status: 'Progres 70%',  tone: 'warn', meta: '8/10 Selesai' },
    { code: '#?',  name: 'Angka & Tanda Baca',      sub: 'Pola nomor 3, 4, 5, 6 serta tanda', status: 'Siap Dimulai', tone: 'brand', meta: 'Durasi 15m' },
    { code: 'Ww',  name: 'Kata Sehari-hari (Daily Words)', sub: 'Latihan kontinuitas & baban', status: 'Lanjutan', tone: 'teal', meta: '' },
  ];

  // Kuis interaktif Figma: "Pilih huruf yang cocok: M D L B"
  const quiz = ['M', 'D', 'L', 'B'];

  return `
  <div class="pb-6">
    <div class="px-5 pt-4 rise">
      <p class="text-[12.5px] text-ink-500">Program Latihan Terpandu</p>
      <h1 class="text-[23px] font-extrabold text-ink-900 leading-[1.12] tracking-[-0.024em]">Latihan Braille</h1>
      <p class="mt-2 text-[13px] leading-relaxed text-ink-500 font-access">
        Kenali pola getaran dan bentik titik. Aktifkan latihan braille melalu sentuhan langsung.
      </p>
    </div>

    <!-- Status + streak -->
    <section class="px-5 mt-4 rise" aria-labelledby="lbl-streak">
      <div class="surface rounded-2xl p-4">
        <h2 id="lbl-streak" class="flex items-center justify-between text-[12px] font-semibold text-ink-900">
          <span class="inline-flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-ok-600 pulse" aria-hidden="true"></span> Sensor Tactile Siap
          </span>
          <span class="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600">${svg('target','w-3.5 h-3.5',2)} Level 2</span>
        </h2>
        <div class="mt-3.5 grid grid-cols-3 gap-2 text-center divide-x divide-line">
          <div><p class="text-[22px] font-extrabold text-ink-900 tabular tracking-[-0.02em]">18</p><p class="text-[11px] text-ink-500 mt-0.5">Karakter</p></div>
          <div><p class="text-[22px] font-extrabold text-ink-900 tabular tracking-[-0.02em]">5</p><p class="text-[11px] text-ink-500 mt-0.5">Hari Latihan</p></div>
          <div><p class="text-[22px] font-extrabold text-ok-700 tabular tracking-[-0.02em]">94%</p><p class="text-[11px] text-ink-500 mt-0.5">Akurasi</p></div>
        </div>
      </div>
    </section>

    <!-- Progres ring -->
    <section class="px-5 mt-4 rise" aria-labelledby="lbl-prog">
      <div class="surface rounded-3xl p-5">
        <div class="flex items-center gap-5">
          <div class="relative w-[96px] h-[96px] shrink-0" role="img"
               aria-label="Progres latihan ${p.percent} persen, ${p.done} dari ${p.target} modul">
            <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#22C55E" />
                  <stop offset="100%" stop-color="#15803D" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="52" fill="none" stroke="#E2EAF3" stroke-width="12" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#ringGrad)" stroke-width="12"
                      stroke-linecap="round" stroke-dasharray="${(2 * Math.PI * 52).toFixed(1)}"
                      stroke-dashoffset="${(2 * Math.PI * 52 * (1 - p.percent / 100)).toFixed(1)}" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-[21px] font-extrabold text-ink-900 leading-none tabular tracking-[-0.02em]">${p.percent}%</span>
              <span class="text-[10px] font-semibold text-ink-500 mt-1">Selesai</span>
            </div>
          </div>
          <div class="min-w-0">
            <p class="inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 px-2.5 py-1 text-[11px] font-bold">
              ${svg('award', 'w-3.5 h-3.5', 2)} Level 2 Mahir Huruf
            </p>
            <h2 id="lbl-prog" class="mt-2.5 text-[13px] font-bold text-ink-900">Progres Belajar</h2>
            <p class="text-[12.5px] text-ink-500 mt-1 font-access leading-relaxed">
              <strong class="text-ink-900">${p.done}</strong> dari <strong class="text-ink-900">${p.target}</strong> modul selesai.
              Berhasil menyelesaikan satu sesi latihan braille.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tantangan Harian: Kuis Haptic Tactile -->
    <section class="px-5 mt-5" aria-labelledby="lbl-quiz">
      <div class="flex items-center justify-between">
        <h2 id="lbl-quiz" class="text-[14px] font-bold text-ink-900 tracking-[-0.012em]">Tantangan Harian: Kuis Haptic</h2>
        <span class="text-[10.5px] font-bold rounded-full bg-brand-50 text-brand-600 border border-brand-100 px-2.5 py-1">Soal 4/10</span>
      </div>
      <div class="surface mt-3 rounded-2xl p-4">
        <p class="text-[12.5px] text-ink-700 font-access leading-relaxed">
          Pola getaran dipancarkan secara berurutan. Sentuh tombol dan tebak karakter yang dimaksudkan.
        </p>
        <button type="button" id="btnQuizPlay"
                class="btn-primary mt-3 w-full min-h-[88px] rounded-2xl text-white
                       flex flex-col items-center justify-center gap-1.5">
          <span class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center ring-1 ring-white/25">${svg('play','w-5 h-5')}</span>
          <span class="text-[14px] font-bold tracking-[-0.01em]">Ketuk untuk Putar Pola Getaran</span>
        </button>
        <p class="mt-2.5 flex items-center justify-center gap-1.5 text-[11.5px] text-ink-500">
          ${svg('touch', 'w-3.5 h-3.5', 2)} Siap memancarkan ritme titik 1&ndash;3&ndash;5
        </p>
      </div>

      <!-- Pilihan huruf -->
      <div class="mt-3.5">
        <p class="text-[12px] font-semibold text-ink-700 mb-2">Pilih huruf yang cocok:</p>
        <div class="grid grid-cols-4 gap-2.5" role="group" aria-label="Pilihan huruf">
          ${quiz.map((q, i) => `
            <button type="button" data-quiz="${q}" ${i === 0 ? 'aria-pressed="true"' : 'aria-pressed="false"'}
                    class="btn-ghost min-h-[54px] rounded-xl border text-[18px] font-extrabold
                           ${i === 0 ? 'bg-brand-600 text-white border-brand-600' : 'surface text-ink-900 hover:border-brand-300 active:bg-brand-50'}">
              ${q}
            </button>`).join('')}
        </div>
      </div>

      <button type="button" id="btnQuizNext"
              class="btn-primary mt-3 w-full min-h-[50px] rounded-xl text-white font-bold text-[14px]
                     flex items-center justify-center gap-2">
        Lanjut ke Soal Berikutnya ${svg('arrowR', 'w-4 h-4', 2)}
      </button>
    </section>

    <!-- Kurikulum Modul Tactile -->
    <section class="px-5 mt-6" aria-labelledby="lbl-modul">
      <div class="flex items-center justify-between">
        <h2 id="lbl-modul" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Kurikulum Modul Tactile</h2>
        <button type="button" class="text-[12.5px] font-semibold text-brand-600 hover:underline">Semua</button>
      </div>
      <p class="text-[11.5px] text-ink-500 mt-1">Program berkelanjutan dari tingkat pemula hingga tahap mahir.</p>
      <ul class="mt-3 stagger space-y-2.5">
        ${lessons.map(lessonRow).join('')}
      </ul>
    </section>

    <!-- Preferensi Latihan Haptic -->
    <section class="px-5 mt-5" aria-labelledby="lbl-pref">
      <h2 id="lbl-pref" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Preferensi Latihan Haptic</h2>
      <p class="text-[11.5px] text-ink-500 mt-1">Disesuaikan untuk sensasi rabaan optimal.</p>
      <div class="surface mt-3 rounded-2xl divide-y divide-line overflow-hidden">
        ${switchRow('fullVibrate', 'Getaran Lambat (Bimbingan)', 'Jeda antar tick 300 ms untuk pemula', true)}
        ${switchRow('serveAudio', 'Umpan Balik Suara Pelatih', 'Suara benar tiap umpan pendamping', false)}
      </div>
      <p class="mt-3 rounded-xl bg-surface p-3 text-[11.5px] text-ink-500 font-access leading-relaxed">
        Tip: Sentuhan lambat membantu tubuh jauh lebih cepat, hasil latihan yang terjaga saat pola
        diulang. Mode getah haptic ditelusuri sering membantu refleksi sempurna.
      </p>
    </section>

    <div class="px-5 mt-5">
      <button type="button" id="btnReadText2"
              class="btn-primary w-full min-h-[54px] rounded-2xl text-white font-bold text-[15px]
                     flex items-center justify-center gap-2">
        ${svg('braille', 'w-5 h-5', 2)} Read Text
      </button>
    </div>
  </div>`;
}

function lessonRow(l) {
  const badge = {
    ok:    'bg-ok-50 text-ok-700 border border-ok-600/20',
    warn:  'bg-warn-50 text-warn-700 border border-warn-600/20',
    brand: 'bg-brand-50 text-brand-600 border border-brand-100',
    teal:  'bg-teal-600/10 text-teal-700 border border-teal-600/20',
  }[l.tone] || 'bg-brand-50 text-brand-600 border border-brand-100';

  const statusChip = {
    ok:    'bg-ok-50 text-ok-700 border border-ok-600/20',
    warn:  'bg-warn-50 text-warn-700 border border-warn-600/20',
    brand: 'bg-brand-50 text-brand-600 border border-brand-100',
    teal:  'bg-teal-600/10 text-teal-700 border border-teal-600/20',
  }[l.tone] || 'bg-brand-50 text-brand-600 border border-brand-100';

  return `
  <li>
    <button type="button" data-act="lesson" aria-label="Modul ${l.name}, ${l.status}"
            class="surface surface-interactive w-full flex items-center gap-3.5 rounded-2xl p-3.5 text-left group">
      <span class="w-12 h-12 shrink-0 rounded-xl font-extrabold flex items-center justify-center ${badge} text-[15px] transition-transform duration-200 group-hover:scale-[1.05]">
        ${l.code}
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-[14px] font-semibold text-ink-900 leading-snug tracking-[-0.008em]">${l.name}</span>
        <span class="block text-[12px] text-ink-500 mt-0.5 truncate">${l.sub}</span>
      </span>
      <span class="shrink-0 text-right">
        <span class="block text-[10.5px] font-bold rounded-md border px-1.5 py-0.5 ${statusChip}">${l.status}</span>
        ${l.meta ? `<span class="block text-[10px] text-ink-500 mt-1">${l.meta}</span>` : ''}
      </span>
    </button>
  </li>`;
}

/* ============ LAYAR 5 : PETA GESTUR HAPTIC ============ */
function renderGesture() {
  // Frame Figma: blok biru besar berisi grid titik braille
  return `
  <div class="pb-6">
    <div class="px-5 pt-4 rise">
      <h1 class="text-[21px] font-extrabold text-ink-900 leading-tight tracking-[-0.022em]">Peta Gerakan Haptic</h1>
      <p class="mt-2 text-[13px] leading-relaxed text-ink-500 font-access">
        Pelajari pola getaran tiap huruf. Enam titik braille dipetakan ke permukaan layar.
      </p>
    </div>

    <!-- Peta tactile huruf -->
    <section class="px-5 mt-5 rise" aria-labelledby="lbl-map">
      <h2 id="lbl-map" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Peta Titik Braille</h2>
      <div class="sheen mt-3 rounded-3xl p-5 on-dark relative overflow-hidden"
           style="background: linear-gradient(155deg, #1E74E8 0%, #0B5FCC 45%, #094BA3 80%, #0A3D80 100%);
                  box-shadow: 0 1px 2px rgba(11,22,32,.1), 0 16px 34px -16px rgba(11,95,204,.6);">
        <div class="absolute -right-14 -top-14 w-48 h-48 rounded-full decorative"
             style="background: radial-gradient(circle,rgba(255,255,255,.18),transparent 68%)" aria-hidden="true"></div>
        <div class="relative">
          <p class="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/80">Peta Titik Braille — Referensi</p>

        <!-- Grid 6 titik: 2 kolom x 3 baris (vertikal, sesuai sel braille) -->
        <div class="mt-4 mx-auto grid grid-cols-2 gap-3 w-[168px]" id="gestureGrid">
          ${[1,4,2,5,3,6].map(n => `
            <button type="button" data-dot="${n}" aria-label="Titik braille ${n}"
                    class="w-20 h-20 rounded-2xl bg-white/20 border border-white/30
                           flex items-center justify-center text-[22px] font-extrabold text-white
                           hover:bg-white/30 active:bg-white/40 transition-all duration-150
                           active:scale-95 focus-visible:outline-white"
                    style="box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 4px 12px -6px rgba(0,0,0,.4)">
              ${n}
            </button>`).join('')}
        </div>
        <p class="mt-3.5 text-center text-[11.5px] text-white/90">
          Ketuk angka untuk merasakan pola getaran titik tersebut. Kolom kiri 1&ndash;2&ndash;3, kolom kanan 4&ndash;5&ndash;6.
        </p>
      </div>
    </section>

    <!-- Penjelasan tata letak -->
    <section class="px-5 mt-5" aria-labelledby="lbl-layout">
      <h2 id="lbl-layout" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Tata Letak Titik</h2>
      <div class="surface mt-3 rounded-2xl p-4">
        <div class="flex items-center gap-5">
          <div class="grid grid-cols-2 gap-x-6 gap-y-3 shrink-0" aria-hidden="true">
            ${[1,4,2,5,3,6].map(n => `<span class="w-9 h-9 rounded-full text-white text-[13px] font-bold flex items-center justify-center" style="background: linear-gradient(160deg,#2B7BF3,#0B5FCC); box-shadow: 0 3px 8px -3px rgba(11,95,204,.6)">${n}</span>`).join('')}
          </div>
          <ul class="text-[12px] text-ink-700 font-access leading-relaxed space-y-1.5">
            <li><strong class="text-ink-900">Kolom kiri</strong> &mdash; titik 1, 2, 3</li>
            <li><strong class="text-ink-900">Kolom kanan</strong> &mdash; titik 4, 5, 6</li>
            <li><strong class="text-ink-900">Baris</strong> &mdash; atas, tengah, bawah</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Daftar contoh huruf -->
    <section class="px-5 mt-5" aria-labelledby="lbl-ex">
      <h2 id="lbl-ex" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Contoh Pola</h2>
      <ul class="mt-3 grid grid-cols-2 gap-2.5 stagger">
        ${['A','B','C','K','L','M'].map(ch => gestureExample(ch)).join('')}
      </ul>
    </section>
  </div>`;
}

function gestureExample(ch) {
  const dots = HAPTIC.dotsFor(ch) || [];
  const layout = [1, 4, 2, 5, 3, 6];
  return `
  <li>
    <button type="button" data-feel="${ch}" aria-label="Huruf ${ch}, ${dots.length} titik"
            class="surface surface-interactive w-full flex items-center gap-3 rounded-2xl p-3 group">
      <span class="w-11 h-11 shrink-0 rounded-xl text-brand-600 border border-brand-100 flex items-center justify-center text-[20px] font-extrabold transition-transform duration-200 group-hover:scale-[1.05]"
            style="background: linear-gradient(160deg,#EEF5FF,#D9E8FF)">${ch}</span>
      <span class="grid grid-cols-2 gap-x-2 gap-y-1" aria-hidden="true">
        ${layout.map(n => `<span class="w-2.5 h-2.5 rounded-full transition-colors ${dots.includes(n) ? 'bg-brand-600' : 'bg-brand-100'}"></span>`).join('')}
      </span>
    </button>
  </li>`;
}

/* -------------------------------------------------------------------------
   4. ROUTER
   ------------------------------------------------------------------------- */
const SCREENS = {
  home:      { render: renderHome,      title: null,            back: false },
  dashboard: { render: renderDashboard, title: 'Beranda',       back: true  },
  reader:    { render: renderReader,    title: 'Baca Buku',     back: true  },
  practice:  { render: renderPractice,  title: 'Latihan Braille', back: true },
  gesture:   { render: renderGesture,   title: 'Peta Gestur',   back: true  },
};

const NAV_ITEMS = [
  { id: 'home',      label: 'Home',    icon: 'home' },
  { id: 'dashboard', label: 'Library', icon: 'book' },
  { id: 'reader',    label: 'Practice',icon: 'braille' },
  { id: 'practice',  label: 'Profile', icon: 'user' },
];

function go(screen) {
  if (!SCREENS[screen]) return;
  STATE.screen = screen;
  render();
  main.scrollTop = 0;
  main.focus({ preventScroll: true });
  announce(SCREENS[screen].title ? `Layar ${SCREENS[screen].title}` : 'Layar Beranda');
}

function render() {
  const s = SCREENS[STATE.screen];
  main.innerHTML = `<div class="rise">${s.render()}</div>`;
  renderHeader(s);
  renderNav();
  bindNav(nav);
  bindNav(document.getElementById('appHeader'));
  bindScreenEvents();
}

function renderHeader(s) {
  const h = document.getElementById('appHeader');
  if (STATE.screen === 'home') { h.className = 'hidden'; h.innerHTML = ''; return; }

  h.className = 'flex items-center gap-2.5 px-4 py-2.5 sticky top-0 z-30 border-b border-line'
    + ' bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70';
  h.style.boxShadow = '0 1px 0 rgba(11,22,32,.03), 0 6px 16px -14px rgba(11,22,32,.35)';
  h.innerHTML = `
    ${s.back ? `
      <button type="button" id="btnBack" aria-label="Kembali"
              class="btn-ghost w-9 h-9 -ml-1 rounded-full hover:bg-surface active:bg-brand-50 flex items-center justify-center text-ink-900">
        ${svg('back', 'w-5 h-5', 2)}
      </button>` : '<span class="w-9"></span>'}
    <div class="flex items-center gap-2.5 min-w-0 flex-1">
      ${brandMark()}
      <div class="min-w-0">
        <p class="text-[12.5px] font-bold text-ink-900 leading-tight truncate tracking-[-0.01em]">Braille Haptic · ${s.title || ''}</p>
        <p class="text-[10px] text-ink-500 leading-tight flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-ok-600 pulse" aria-hidden="true"></span> Haptic Engine: Ready
        </p>
      </div>
    </div>
    <button type="button" class="btn-ghost w-9 h-9 rounded-full hover:bg-surface flex items-center justify-center text-ink-500" aria-label="Cari">${svg('search','w-5 h-5',2)}</button>
    <button type="button" data-nav="home" class="btn-ghost w-9 h-9 rounded-full hover:bg-surface flex items-center justify-center text-ink-500" aria-label="Profil pengguna">
      <span class="w-7 h-7 rounded-full text-brand-600 flex items-center justify-center border border-brand-200" style="background: linear-gradient(160deg,#EEF5FF,#D9E8FF)">${svg('user','w-4 h-4',2)}</span>
    </button>`;

  document.getElementById('btnBack')?.addEventListener('click', () => history.back());
}

function renderNav() {
  nav.innerHTML = NAV_ITEMS.map(item => {
    const active = item.id === STATE.screen;
    return `
    <li class="flex-1">
      <button type="button" data-nav="${item.id}" ${active ? 'aria-current="page"' : ''}
              class="btn-ghost w-full min-h-[62px] flex flex-col items-center justify-center gap-1 py-2 relative
                     ${active ? 'text-brand-600' : 'text-ink-500 hover:text-ink-900'}">
        ${active ? '<span class="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[3px] rounded-full bg-brand-600" aria-hidden="true"></span>' : ''}
        <span class="transition-transform duration-200 ${active ? 'scale-[1.06]' : ''}">${svg(item.icon, 'w-[22px] h-[22px]', active ? 2.1 : 1.75)}</span>
        <span class="text-[10.5px] font-semibold tracking-[-0.005em]">${item.label}</span>
      </button>
    </li>`;
  }).join('');
}

/* -------------------------------------------------------------------------
   5. EVENT BINDING
   ------------------------------------------------------------------------- */
function bindNav(root) {
  if (!root) return;
  root.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-nav');
      go(target);
      history.pushState({ screen: target }, '');
    });
  });
}

function bindScreenEvents() {
  bindNav(main);

  // Toggle fokus mode
  main.querySelectorAll('[data-toggle="focus"]').forEach(b => {
    b.setAttribute('aria-pressed', String(focusMode.on));
    b.addEventListener('click', () => focusMode.toggle());
  });

  // Item placeholder
  main.querySelectorAll('[data-act="item"]').forEach(el => {
    el.addEventListener('click', () => {
      const label = el.querySelector('.font-semibold')?.textContent?.trim() || 'Fitur';
      announce(`${label} — belum diimplementasikan di prototipe ini.`, true);
    });
  });
  main.querySelectorAll('[data-act="lesson"]').forEach(el => {
    el.addEventListener('click', () => {
      announce(`${el.getAttribute('aria-label')} — belum diimplementasikan di prototipe ini.`, true);
    });
  });

  // Toggle switch
  main.querySelectorAll('[data-switch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-switch');
      const on = btn.getAttribute('aria-checked') !== 'true';
      btn.setAttribute('aria-checked', String(on));
      STATE.settings[key] = on;
      btn.classList.toggle('bg-brand-600', on);
      btn.classList.toggle('bg-ink-300', !on);
      btn.querySelector('span').classList.toggle('translate-x-[22px]', on);
      announce(`${btn.getAttribute('aria-label')} ${on ? 'diaktifkan' : 'dinonaktifkan'}`, true);
      if (key === 'fullVibrate') {
        if (on && !focusMode.on) focusMode.toggle();
        if (!on && focusMode.on) focusMode.toggle();
      }
    });
  });

  // Slider WPM
  const wpm = main.querySelector('#wpm');
  if (wpm) wpm.addEventListener('input', () => {
    STATE.settings.wpm = +wpm.value;
    main.querySelector('#wpmVal').textContent = wpm.value;
  });

  // Event khusus per layar
  if (STATE.screen === 'reader')   bindReaderEvents();
  if (STATE.screen === 'gesture')  bindGestureEvents();
  if (STATE.screen === 'practice') bindPracticeEvents();
}

/* --- Reader --- */
let readerIdx = 0;
const READER_WORD = 'kaba';

function bindReaderEvents() {
  drawBraille('K');
  const status = main.querySelector('#hapticStatus');

  main.querySelector('#btnFeel').addEventListener('click', async () => {
    const ch = READER_WORD[readerIdx] || 'k';
    updateHapticStatus(status, ch);
    drawBraille(ch.toUpperCase(), true);
    markChar(ch);
    await HAPTIC.buzzText(ch);
  });

  const play = main.querySelector('#btnPlay');
  const playIcon = main.querySelector('#playIcon');
  const playLabel = main.querySelector('#playLabel');
  let playing = false;

  play.addEventListener('click', async () => {
    playing = !playing;
    play.setAttribute('aria-pressed', String(playing));
    playIcon.innerHTML = playing ? svg('pause', 'w-7 h-7') : svg('play', 'w-7 h-7');
    playLabel.textContent = playing ? 'Jeda pembacaan haptic' : 'Putar pembacaan haptic';

    if (playing) {
      announce(HAPTIC.supported ? 'Memutar pola braille. Rasakan getaran.' : 'Getaran tidak tersedia. Menampilkan simulasi visual.', true);
      await HAPTIC.buzzText(READER_WORD, (i, ch) => {
        drawBraille(ch.toUpperCase(), true);
        markChar(ch);
        updateHapticStatus(status, ch);
      });
      playing = false;
      play.setAttribute('aria-pressed', 'false');
      playIcon.innerHTML = svg('play', 'w-7 h-7');
      playLabel.textContent = 'Putar pembacaan haptic';
    } else {
      HAPTIC.stop();
    }
  });

  main.querySelector('#btnPrev').addEventListener('click', () => {
    readerIdx = (readerIdx - 1 + READER_WORD.length) % READER_WORD.length;
    previewChar(readerIdx, status);
  });
  main.querySelector('#btnNext').addEventListener('click', () => {
    readerIdx = (readerIdx + 1) % READER_WORD.length;
    previewChar(readerIdx, status);
  });
  main.querySelector('#btnReadText')?.addEventListener('click', () => {
    announce('Membaca teks dengan getaran braille.', true);
  });
}

function previewChar(i, status) {
  const ch = READER_WORD[i];
  drawBraille(ch.toUpperCase(), true);
  markChar(ch);
  updateHapticStatus(status, ch);
  announce(`Karakter ${i + 1} dari ${READER_WORD.length}: ${ch}`);
}

function markChar(ch) {
  const m = document.getElementById('markChar');
  if (m) m.textContent = ch;
}

function drawBraille(letter, animate = false) {
  const cell = document.getElementById('brailleCell');
  const big = document.getElementById('bigChar');
  const chip = document.getElementById('patternDots');
  if (!cell) return;
  const dots = HAPTIC.dotsFor(letter) || [];
  if (big) {
    big.textContent = letter || '—';
    if (animate) {
      big.style.animation = 'none';
      void big.offsetWidth; // paksa reflow agar animasi bisa dimainkan ulang
      big.style.animation = 'riseIn .28s cubic-bezier(.16,.84,.44,1)';
    }
  }
  if (chip) chip.textContent = dots.length ? dots.join(', ') : '—';

  const layout = [1, 4, 2, 5, 3, 6];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cell.innerHTML = layout.map((n, i) => {
    const on = dots.includes(n);
    // Titik aktif diberi denyut berurutan agar terasa seperti "mengetuk"
    const delay = animate && on && !reduce ? `style="animation-delay:${i * 55}ms"` : '';
    return `<span class="bdot ${on ? 'on' : ''}${animate && on && !reduce ? ' tick' : ''}" ${delay}></span>`;
  }).join('');
}

function updateHapticStatus(el, ch) {
  if (!el) return;
  if (!HAPTIC.supported) {
    el.textContent = 'Getaran tidak tersedia di perangkat ini — simulasi visual ditampilkan.';
    return;
  }
  const dots = HAPTIC.dotsFor(ch);
  const list = !dots ? 'tidak dikenal' : dots.join(' + ');
  el.textContent = `Pola "${ch.toUpperCase()}" = titik ${list}.`;
}

/* --- Gesture --- */
function bindGestureEvents() {
  main.querySelectorAll('[data-dot]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const n = +btn.getAttribute('data-dot');
      if (HAPTIC.supported) {
        navigator.vibrate([HAPTIC.tickMs * 2, 120, HAPTIC.tickMs * 2]);
      }
      announce(`Titik braille ${n} bergetar.`, true);
    });
  });
  main.querySelectorAll('[data-feel]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const ch = btn.getAttribute('data-feel');
      announce(`Memutar pola huruf ${ch}.`, true);
      await HAPTIC.buzzText(ch);
    });
  });
}

/* --- Practice --- */
function bindPracticeEvents() {
  let selected = 'M';
  main.querySelectorAll('[data-quiz]').forEach(btn => {
    btn.addEventListener('click', () => {
      selected = btn.getAttribute('data-quiz');
      main.querySelectorAll('[data-quiz]').forEach(b => {
        const on = b === btn;
        b.setAttribute('aria-pressed', String(on));
        b.classList.toggle('bg-brand-600', on);
        b.classList.toggle('text-white', on);
        b.classList.toggle('border-brand-600', on);
        b.classList.toggle('bg-white', !on);
        b.classList.toggle('text-ink-900', !on);
        b.classList.toggle('border-line', !on);
      });
      announce(`Memilih huruf ${selected}.`, true);
    });
  });

  main.querySelector('#btnQuizPlay')?.addEventListener('click', async () => {
    announce('Memutar pola getaran teka-teki.', true);
    await HAPTIC.buzzText('klm');
  });

  main.querySelector('#btnQuizNext')?.addEventListener('click', () => {
    announce('Soal berikutnya. Memutar pola getaran baru.', true);
  });
  main.querySelector('#btnReadText2')?.addEventListener('click', () => {
    announce('Membaca teks dengan getaran braille.', true);
  });
}

/* -------------------------------------------------------------------------
   6. HAPTIC ENGINE (dipindah ke bawah agar mudah dibaca terpisah)
   ------------------------------------------------------------------------- */
/* Definisi HAPTIC ada di index.html <script> agar bisa diuji terpisah. */

/* -------------------------------------------------------------------------
   7. BOOTSTRAP
   ------------------------------------------------------------------------- */
function boot() {
  focusMode.init();

  setTimeout(() => {
    if (!HAPTIC.supported) {
      showToast('Catatan: getaran hanya berfungsi di Android (Chrome). Di perangkat ini memakai simulasi visual.');
    }
  }, 900);

  history.replaceState({ screen: 'home' }, '');
  window.addEventListener('popstate', (e) => {
    STATE.screen = (e.state && e.state.screen) || 'home';
    render();
    main.scrollTop = 0;
  });

  render();
}

boot();
