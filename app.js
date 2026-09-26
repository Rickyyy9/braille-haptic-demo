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

  // Profil pengguna. Nama awal mengikuti desain Figma, lalu diganti oleh
  // nama yang diisi saat pendaftaran (disimpan di localStorage).
  user: {
    name: localStorage.getItem('bh_user_name') || 'Bunda Haptic',
    role: localStorage.getItem('bh_user_role') || 'Tenaga Didik Terlatih',
    email: localStorage.getItem('bh_user_email') || 'bunda@braillehaptic.id',
  },

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

  // Kontak darurat (dapat ditambah/dihapus, disimpan di localStorage)
  contacts: JSON.parse(localStorage.getItem('bh_contacts') || 'null') || [
    { name: 'Bunda Sari',   relation: 'Pendamping utama', phone: '+62 812-3456-7890' },
    { name: 'Pak Andi',     relation: 'Keluarga',         phone: '+62 813-2233-4455' },
    { name: 'Layanan 119',  relation: 'Darurat medis',    phone: '119' },
  ],

  // Kondisi pendamping (ditampilkan sebagai pilihan profil pengguna)
  companion: {
    // Kebutuhan pengguna utama
    needs: JSON.parse(localStorage.getItem('bh_needs') || 'null') || ['deafblind'],
    // Catatan kondisi pendamping (tuli, low-vision, dsb)
    note: localStorage.getItem('bh_companion_note') || '',
  },

  // Buku hasil unggahan
  uploaded: JSON.parse(localStorage.getItem('bh_uploaded') || 'null') || [],

  // Modul latihan yang sedang dibuka
  lessonId: 'dasar',
  lessonIdx: 0,       // indeks karakter/kata dalam modul
  lessonCharIdx: 0,   // indeks huruf dalam kata (untuk modul kata)
};

/* -------------------------------------------------------------------------
   1b. READER — sumber kata tunggal
   Reader immersive memakai READER_SENTENCES (didefinisikan di bagian LAYAR
   READER). Tidak ada lagi sumber kata ganda di sini agar selalu sinkron.
   ------------------------------------------------------------------------- */

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
  // Gestur (pengganti emoji)
  tap:      '<path d="M9 11V6a1.8 1.8 0 0 1 3.6 0v5"/><path d="M12.6 11V7.5a1.8 1.8 0 0 1 3.6 0V11"/><path d="M16.2 11.5a1.8 1.8 0 0 1 3.6 0V15a6 6 0 0 1-6 6h-1.2a5.5 5.5 0 0 1-4.4-2.2L6 15.6a1.7 1.7 0 0 1 2.5-2.2L9.6 15V8.5"/>',
  swipeR:   '<path d="M4 12h13"/><path d="M13 8l4 4-4 4"/><path d="M2 9v6"/>',
  swipeL:   '<path d="M20 12H7"/><path d="M11 8l-4 4 4 4"/><path d="M22 9v6"/>',
  swipeD:   '<path d="M12 4v13"/><path d="M8 13l4 4 4-4"/><path d="M9 2h6"/>',
  bookmark: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1z"/>',
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
function brandAppIcon(sizeClass = 'w-[96px] h-[96px]') {
  return `
    <div class="brand-app-icon ${sizeClass}">
      <div class="braille-grid" aria-hidden="true">
        <span class="braille-dot"></span>
        <span class="braille-dot empty"></span>
        <span class="braille-dot"></span>
        <span class="braille-dot"></span>
        <span class="braille-dot empty"></span>
        <span class="braille-dot"></span>
        <span class="braille-dot empty"></span>
        <span class="braille-dot"></span>
        <span class="braille-dot"></span>
      </div>
    </div>
  `;
}

function renderSplash() {
  return `
    <div class="splash-screen">
      ${brandAppIcon('w-[116px] h-[116px]')}
      <div class="brand-subtitle">Accessible Haptic Reader</div>
      <div class="brand-title">Braille Haptic</div>
      <div class="loading-bar" aria-label="Memuat aplikasi"></div>
    </div>
  `;
}

function renderLogin() {
  return `
    <div class="login-screen">
      <div class="login-card">
        <div class="login-header">
          ${brandAppIcon('w-[90px] h-[90px]')}
          <div>
            <div class="login-title">Braille Haptic</div>
            <div class="login-subtitle">Masuk sebagai pendamping &amp; fasilitator</div>
          </div>
        </div>

        <div class="input-wrap">
          <label for="loginEmail">Email</label>
          <input id="loginEmail" type="email" placeholder="nama@contoh.id" autocomplete="username" aria-label="Email" />
        </div>

        <div class="input-wrap">
          <label for="loginPassword">Password</label>
          <input id="loginPassword" type="password" placeholder="Masukkan kata sandi" autocomplete="current-password" aria-label="Password" />
        </div>

        <div class="helper-row">
          <span>Ingat saya</span>
          <a href="#" data-act="forgot">Lupa kata sandi?</a>
        </div>

        <div class="divider">atau</div>

        <div class="login-actions">
          <button type="button" id="btnLogin" class="login-btn primary" data-act="login">
            <span class="btn-label">Masuk</span>
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-check" aria-hidden="true">${svg('check','w-6 h-6',2.6)}</span>
          </button>
          <button type="button" class="login-btn secondary" data-act="signup">Buat akun baru</button>
        </div>

        <p class="login-note">
          Demo prototipe — isi email &amp; kata sandi apa saja untuk melanjutkan.
        </p>
      </div>
    </div>
  `;
}

function renderSignup() {
  return `
    <div class="login-screen">
      <div class="login-card">
        <div class="login-header">
          ${brandAppIcon('w-[90px] h-[90px]')}
          <div>
            <div class="login-title">Buat Akun</div>
            <div class="login-subtitle">Daftar sebagai pendamping &amp; fasilitator</div>
          </div>
        </div>

        <div class="input-wrap">
          <label for="signupName">Nama lengkap</label>
          <input id="signupName" type="text" placeholder="Nama kamu" autocomplete="name" aria-label="Nama lengkap" />
        </div>

        <div class="input-wrap">
          <label for="signupEmail">Email</label>
          <input id="signupEmail" type="email" placeholder="nama@contoh.id" autocomplete="email" aria-label="Email" />
        </div>

        <div class="input-wrap">
          <label for="signupPassword">Kata sandi</label>
          <input id="signupPassword" type="password" placeholder="Minimal 8 karakter" autocomplete="new-password" aria-label="Kata sandi" />
        </div>

        <div class="input-wrap">
          <label for="signupConfirm">Konfirmasi kata sandi</label>
          <input id="signupConfirm" type="password" placeholder="Ulangi kata sandi" autocomplete="new-password" aria-label="Konfirmasi kata sandi" />
        </div>

        <p id="signupError" class="form-error" role="alert" hidden></p>

        <div class="login-actions">
          <button type="button" id="btnSignup" class="login-btn primary" data-act="do-signup">
            <span class="btn-label">Buat Akun</span>
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-check" aria-hidden="true">${svg('check','w-6 h-6',2.6)}</span>
          </button>
        </div>

        <p class="login-note">
          Sudah punya akun?
          <a href="#" data-nav="login" class="note-link">Masuk di sini</a>
        </p>
        <p class="login-note">Demo prototipe — data tidak dikirim ke mana pun.</p>
      </div>
    </div>
  `;
}
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
        ${homeItem('phone',  'Kontak Darurat', 'Hubungi pendamping', { nav: 'contacts' })}
        ${homeItem('users',  'Kondisi Pendamping', 'Siapa yang mendampingi', { nav: 'companion' })}
        ${homeItem('upload', 'Unggah Buku Haptic', 'Impor file buku', { nav: 'upload' })}
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
      <p class="text-[13px] text-ink-500">${greeting()}, ${STATE.user.name}</p>
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

    <!-- Menu Cepat -->
    <section class="px-5 mt-6" aria-labelledby="lbl-quick">
      <div class="flex items-center justify-between">
        <h2 id="lbl-quick" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Menu Cepat</h2>
        <button type="button" class="text-[12.5px] font-semibold text-brand-600 hover:underline">Akses Cepat Tactile</button>
      </div>
      <div class="mt-3 grid grid-cols-2 gap-3 stagger">
        ${quickCard('book', 'Baca Toka', 'Live Braille Tactile', 'reader', 'ok', { chip: 'Toka' })}
        ${quickCard('upload', 'Impor Buku', 'Unggah buku haptic', 'upload', 'brand', { chip: 'Haptic' })}
        ${quickCard('braillelearn', 'Latihan Braille', 'Panduan & Kuis Haptic', 'practice', 'warn', { chip: 'Audiens' })}
        ${quickCard('user', STATE.user.name, STATE.user.role, 'act:profil', 'teal', { chip: 'Profil' })}
      </div>
    </section>

    <!-- Buku Terakhir -->
    <section class="px-5 mt-6" aria-labelledby="lbl-recent">
      <div class="flex items-center justify-between">
        <h2 id="lbl-recent" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Buku Terakhir</h2>
        <button type="button" data-nav="upload"
                class="text-[12.5px] font-semibold text-brand-600 hover:underline">Unggah buku</button>
      </div>
      <ul class="mt-3 space-y-3 stagger">
        ${recentRow('Bumi Manusia', 'Pramoedya Ananta Toer', 84, 'brand', 'reader')}
        ${recentRow('Panduan Braille Dasar', 'SS & Panduan', 100, 'ok', 'reader')}
        ${recentRow('Catatan Harian Sahabat', 'Kumpulan Fiktual', 12, 'warn', 'reader')}
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

function quickCard(icon, title, sub, target, tone, extra = {}) {
  const tones = {
    ok:    'bg-ok-50 text-ok-700 border-ok-600/20',
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    warn:  'bg-warn-50 text-warn-700 border-warn-600/20',
    teal:  'bg-teal-600/10 text-teal-700 border-teal-600/20',
  };
  const t = tones[tone] || tones.brand;
  // target bisa berupa ID layar ("reader") ATAU action placeholder ("act:impor")
  const attr = target.startsWith('act:')
    ? `data-act="item"`
    : `data-nav="${target}"`;
  return `
  <button type="button" ${attr}
          class="surface surface-interactive text-left rounded-2xl p-3.5 min-h-[116px]
                 flex flex-col justify-between group">
    <span class="w-10 h-10 rounded-xl border ${t} flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.06]">${svg(icon, 'w-[19px] h-[19px]')}</span>
    <span class="mt-2">
      ${extra.chip ? `<span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${t} mb-1.5">${extra.chip}</span>` : ''}
      <span class="block text-[13.5px] font-bold text-ink-900 leading-tight tracking-[-0.01em]">${title}</span>
      <span class="block text-[11.5px] text-ink-500 mt-0.5">${sub}</span>
    </span>
  </button>`;
}

function recentRow(title, sub, pct, tone, nav) {
  const bar = { brand: 'bg-brand-600', ok: 'bg-ok-600', warn: 'bg-warn-600' }[tone] || 'bg-brand-600';
  const pctCls = { brand: 'text-brand-600', ok: 'text-ok-700', warn: 'text-warn-700' }[tone] || 'text-brand-600';
  // Buka buku ini di Reader (dengan membawa judul sebagai konteks)
  const attr = nav ? `data-open-book="${title}" data-nav="${nav}"` : '';
  const wrapperOpen = nav ? `<button type="button" ${attr} aria-label="Buka buku ${title}, progres ${pct} persen"
        class="surface surface-interactive w-full flex items-center gap-3 rounded-2xl p-3 text-left group">` : `<div class="surface flex items-center gap-3 rounded-2xl p-3">`;
  const wrapperClose = nav ? `</button>` : `</div>`;
  return `
  <li>
    ${wrapperOpen}
      <span class="w-11 h-11 shrink-0 rounded-xl text-brand-600 flex items-center justify-center decorative transition-transform duration-200 group-hover:scale-[1.05]"
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
    ${wrapperClose}
  </li>`;
}

/* ============ LAYAR 3 : READER (Immersive Braille View) ============ */

/* Kata-kata dalam paragraf yang akan dibaca */
const READER_SENTENCES = [
  'Perjalanan', 'Kancil', 'Menyeberangi', 'Sungai',
  'dengan', 'penuh', 'keberanian', 'dan', 'kecerdikan',
];
let readerWordIdx = 0; // indeks kata saat ini

function getReaderWord() {
  return READER_SENTENCES[readerWordIdx] || READER_SENTENCES[0];
}

/* Bangun sel braille besar untuk sebuah huruf.
   Layout titik: [1,4] [2,5] [3,6] — 2 kolom × 3 baris sesuai standar braille. */
function buildBigBrailleCell(ch, isActive = false, idx = 0) {
  const letter = ch.toLowerCase();
  const dots = HAPTIC.dotsFor(letter) || [];
  // Layout 6 titik: kiri=1,2,3 | kanan=4,5,6 → urutan render: 1,4,2,5,3,6
  const layout = [1, 4, 2, 5, 3, 6];
  const dotsHTML = layout.map((n, li) => {
    const on = dots.includes(n);
    // Nomor titik ditampilkan di atas dot saat tidak aktif (seperti gambar referensi)
    return `<span class="reader-bdot${on ? ' on' : ''}" aria-hidden="true"
      data-dot-num="${n}">${on ? '' : n}</span>`;
  }).join('');

  return `
  <div class="braille-word-cell${isActive ? ' active' : ''}" data-char-idx="${idx}"
       role="img" aria-label="Huruf ${ch.toUpperCase()}, titik braille ${dots.join(', ') || 'tidak ada'}">
    <div class="braille-cell-dots">${dotsHTML}</div>
    <span class="braille-cell-label">${ch.toUpperCase()}</span>
  </div>`;
}

function renderReader() {
  const word = getReaderWord();
  // Maksimal 9 huruf ditampilkan sekaligus
  const MAX_CELLS = 9;
  const chars = [...word].slice(0, MAX_CELLS);

  const cellsHTML = chars.map((ch, i) => buildBigBrailleCell(ch, i === 0, i)).join('');

  // Preview kalimat
  const sentenceWords = READER_SENTENCES.map((w, i) => {
    const isCur = i === readerWordIdx;
    return `<span class="inline ${isCur ? 'text-white font-bold underline underline-offset-4 decoration-white/60' : 'text-white/50'}" data-word-idx="${i}">${w}</span>`;
  }).join('<span class="text-white/30"> </span>');

  return `
  <!-- Layar immersive — full blue, dirancang khusus untuk pengguna deafblind -->
  <div id="readerImmersive" class="flex flex-col min-h-full select-none"
       style="background: linear-gradient(175deg, #2B7BF3 0%, #0B5FCC 40%, #094BA3 75%, #0A3D80 100%);"
       aria-label="Layar baca haptic braille. Ketuk sekali untuk mulai/jeda. Geser kanan 2 jari = kata berikutnya. Geser kiri 2 jari = keluar.">

    <!-- Dekorasi cahaya -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div style="position:absolute;top:-60px;left:-60px;width:260px;height:260px;border-radius:9999px;background:radial-gradient(circle,rgba(255,255,255,.18),transparent 68%)"></div>
      <div style="position:absolute;bottom:100px;right:-40px;width:200px;height:200px;border-radius:9999px;background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%)"></div>
    </div>

    <!-- Header buku -->
    <div class="relative px-5 pt-2 pb-2">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-white/70 text-[10px] font-semibold uppercase tracking-[0.14em]">Sedang Dibaca</p>
          <h1 class="text-white text-[16px] font-extrabold leading-tight tracking-[-0.018em] mt-0.5">${STATE.book.title}</h1>
          <p class="text-white/60 text-[11px] mt-0.5">${STATE.book.author}</p>
        </div>
        <div class="text-right shrink-0 ml-3">
          <div class="rounded-xl bg-white/15 border border-white/20 px-3 py-2">
            <p class="text-white/60 text-[9px] uppercase tracking-wider">Progres</p>
            <p class="text-white text-[14px] font-extrabold tabular">${STATE.book.progress}%</p>
          </div>
        </div>
      </div>
      <!-- Progress bar -->
      <div class="mt-2 h-1 rounded-full bg-white/20 overflow-hidden"
           role="progressbar" aria-valuenow="${STATE.book.progress}" aria-valuemin="0" aria-valuemax="100">
        <div class="h-full rounded-full bg-white/80 transition-[width] duration-700"
             style="width:${STATE.book.progress}%"></div>
      </div>
    </div>

    <!-- Preview kalimat -->
    <div class="relative px-4 py-1.5">
      <div class="rounded-xl bg-white/10 border border-white/15 px-3 py-2"
           style="backdrop-filter:blur(8px)">
        <p class="text-[12px] leading-relaxed font-access" aria-live="polite" id="sentencePreview">
          ${sentenceWords}
        </p>
      </div>
    </div>

    <!-- AREA UTAMA: Grid sel braille (maks 9 sel, 3×3) -->
    <div class="relative flex-1 px-3 pt-1 pb-0 flex flex-col">

      <!-- Status bar atas grid -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-white pulse" aria-hidden="true"></span>
          <p id="readerAutoStatus" class="text-white/80 text-[10px] font-semibold tracking-wide">Ketuk = Mulai/Jeda</p>
        </div>
        <div class="flex items-center gap-2">
          <span id="autoReadBadge" class="hidden items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full
                bg-amber-400 text-amber-900 border border-amber-300">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-900 pulse" aria-hidden="true"></span> AUTO AKTIF</span>
          <span class="text-white/50 text-[9.5px] font-semibold tabular">
            Kata <span id="wordIdxLabel">${readerWordIdx + 1}</span>/<span>${READER_SENTENCES.length}</span>
          </span>
        </div>
      </div>

      <!-- ===== GRID SEL BRAILLE ===== -->
      <div id="brailleWordGrid" class="braille-word-grid">
        ${cellsHTML}
      </div>

      <!-- Pola titik aktif -->
      <div class="mt-3 flex items-center justify-center">
        <div class="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1.5">
          <span class="w-2 h-2 rounded-full bg-white pulse" aria-hidden="true"></span>
          <p id="patternDots" class="text-[11px] font-semibold text-white/90">Titik —</p>
        </div>
      </div>

      <!-- ===== TABEL GESTUR ===== -->
      <div class="mt-2 rounded-2xl bg-white/10 border border-white/15 overflow-hidden">
        <div class="grid grid-cols-2 divide-x divide-white/10">
          <div class="px-3 py-2 text-center">
            <span class="inline-flex text-white/85" aria-hidden="true">${svg('tap', 'w-5 h-5', 1.9)}</span>
            <p class="text-[8.5px] text-white/70 font-semibold mt-0.5">Ketuk = Mulai/Jeda</p>
          </div>
          <div class="px-3 py-2 text-center">
            <span class="inline-flex items-center justify-center gap-0.5 text-white/85" aria-hidden="true">${svg('swipeR', 'w-5 h-5', 1.9)}<span class="text-[8px] font-bold">2</span></span>
            <p class="text-[8.5px] text-white/70 font-semibold mt-0.5">2 jari kanan = Kata selanjutnya</p>
          </div>
          <div class="px-3 py-2 text-center border-t border-white/10">
            <span class="inline-flex items-center justify-center gap-0.5 text-white/85" aria-hidden="true">${svg('swipeL', 'w-5 h-5', 1.9)}<span class="text-[8px] font-bold">2</span></span>
            <p class="text-[8.5px] text-white/70 font-semibold mt-0.5">2 jari kiri = Keluar</p>
          </div>
          <div class="px-3 py-2 text-center border-t border-white/10">
            <span class="inline-flex text-white/85" aria-hidden="true">${svg('swipeD', 'w-5 h-5', 1.9)}</span>
            <p class="text-[8.5px] text-white/70 font-semibold mt-0.5">Geser bawah = Kembali ke Library</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Status haptic -->
    <p id="hapticStatus" class="text-center text-[10px] text-white/60 px-4 pb-1 mt-1" role="status" aria-live="polite"></p>

    <!-- Tombol CTA bawah -->
    <div class="relative px-4 pb-3 pt-1 space-y-2">
      <!-- Tombol utama: Mulai/Jeda Auto Baca -->
      <button type="button" id="btnPlay" aria-pressed="false"
              class="w-full min-h-[54px] rounded-2xl font-extrabold text-[15px] tracking-[-0.01em]
                     flex items-center justify-center gap-3
                     transition-all duration-200 active:scale-[.98]"
              style="background: linear-gradient(180deg,#FFFFFF 0%,#E8F0FF 100%);
                     box-shadow: 0 4px 20px rgba(0,0,0,.25), 0 1px 0 rgba(255,255,255,.5) inset;
                     color: #0B5FCC;">
        <span id="playIcon">${svg('play', 'w-5 h-5')}</span>
        <span id="playLabel">LANJUTKAN MEMBACA</span>
      </button>
      <!-- Kontrol sekunder -->
      <div class="grid grid-cols-3 gap-2">
        <button type="button" id="btnPrev" aria-label="Huruf sebelumnya"
                class="min-h-[42px] rounded-xl bg-white/15 border border-white/20
                       text-white font-bold text-[11px] flex items-center justify-center gap-1
                       hover:bg-white/25 active:bg-white/30 transition-colors">
          ${svg('prev', 'w-3.5 h-3.5')} Prev
        </button>
        <button type="button" id="btnFeel" aria-label="Rasakan pola braille karakter ini"
                class="min-h-[42px] rounded-xl bg-white/15 border border-white/20
                       text-white font-bold text-[11px] flex items-center justify-center gap-1
                       hover:bg-white/25 active:bg-white/30 transition-colors">
          ${svg('hand', 'w-3.5 h-3.5')} Rasa
        </button>
        <button type="button" id="btnNext" aria-label="Huruf berikutnya"
                class="min-h-[42px] rounded-xl bg-white/15 border border-white/20
                       text-white font-bold text-[11px] flex items-center justify-center gap-1
                       hover:bg-white/25 active:bg-white/30 transition-colors">
          Next ${svg('next', 'w-3.5 h-3.5')}
        </button>
      </div>
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

/* Data modul latihan. `id` dipakai layar detail (lesson).
   `chars` = daftar karakter yang dilatih pada modul ini. */
const LESSONS = [
  {
    id: 'dasar',
    code: 'A–J', name: 'Alfabet Dasar (A–J)',
    sub: 'Kumpulan huruf braille pertama',
    status: 'Selesai 100%', tone: 'ok', meta: '10 Pelajaran',
    desc: 'Huruf A sampai J memakai titik 1, 2, 4, dan 5. Fondasi utama sebelum lanjut.',
    chars: ['A','B','C','D','E','F','G','H','I','J'],
  },
  {
    id: 'lanjutan',
    code: 'K–T', name: 'Alfabet Lanjutan (K–T)',
    sub: 'Tambahan titik 3',
    status: 'Progres 70%', tone: 'warn', meta: '8/10 Selesai',
    desc: 'Huruf K sampai T menambahkan titik 3 pada pola dasar. Perhatikan perbedaannya.',
    chars: ['K','L','M','N','O','P','Q','R','S','T'],
  },
  {
    id: 'angka',
    code: '#?', name: 'Angka & Tanda Baca',
    sub: 'Pola nomor 3, 4, 5, 6 serta tanda',
    status: 'Siap Dimulai', tone: 'brand', meta: '15 Karakter',
    desc: 'Angka memakai pola huruf A–J, sedangkan tanda baca punya pola khusus.',
    chars: ['1','2','3','4','5','6','7','8','9','0','.',',','?','!','-'],
  },
  {
    id: 'kata',
    code: 'Ww', name: 'Kata Sehari-hari (Daily Words)',
    sub: 'Latihan kontinuitas & gabungan',
    status: 'Lanjutan', tone: 'teal', meta: '5 Kata',
    desc: 'Latih merangkai huruf menjadi kata utuh yang sering dipakai sehari-hari.',
    chars: ['MAKAN','MINUM','TIDUR','PAGI','RUMAH'],  // kata utuh
    isWords: true,
  },
  {
    id: 'us',
    code: 'U–Z', name: 'Alfabet Penutup (U–Z)',
    sub: 'Tambahan titik 6',
    status: 'Siap Dimulai', tone: 'brand', meta: '6 Pelajaran',
    desc: 'Huruf U sampai Z menambahkan titik 6. Selesaikan untuk menguasai seluruh abjad.',
    chars: ['U','V','W','X','Y','Z'],
  },
];

function renderPractice() {
  const p = STATE.practice;
  const lessons = LESSONS;

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
                  <stop offset="0%" stop-color="#15803D" />
                  <stop offset="100%" stop-color="#12662F" />
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
    <button type="button" data-lesson="${l.id}" aria-label="Buka modul ${l.name}, ${l.status}"
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

/* ============ LAYAR 4b : DETAIL MODUL LATIHAN ============ */
function renderLesson() {
  const l = LESSONS.find(x => x.id === STATE.lessonId) || LESSONS[0];
  const i = STATE.lessonIdx % l.chars.length;
  const cur = l.chars[i];

  return `
  <div class="pb-6">
    <div class="px-5 pt-4 rise">
      <p class="text-[12.5px] text-ink-500">${l.name}</p>
      <h1 id="lessonTitle" class="text-[22px] font-extrabold text-ink-900 leading-tight tracking-[-0.022em] break-words">Latihan ${cur}</h1>
      <p class="mt-2 text-[13px] leading-relaxed text-ink-500 font-access">${l.desc}</p>
      <p id="lessonCounter" class="mt-2 text-[12px] font-semibold text-brand-600 tabular">
        ${i + 1} / ${l.chars.length}
      </p>
    </div>

    <!-- Kartu braille -->
    <section class="px-5 mt-4 rise" aria-labelledby="lbl-lb">
      <div class="sheen rounded-3xl text-white p-5 on-dark relative overflow-hidden"
           style="background: linear-gradient(155deg, #1E74E8 0%, #0B5FCC 45%, #094BA3 80%, #0A3D80 100%);
                  box-shadow: 0 1px 2px rgba(11,22,32,.1), 0 16px 34px -16px rgba(11,95,204,.6);">
        <h2 id="lbl-lb" class="sr-only">Pola braille untuk ${cur}</h2>

        <!-- Kata / karakter -->
        <div class="text-center">
          <div id="lessonChar"
               class="${l.isWords ? 'text-[30px]' : 'text-[56px]'} leading-none font-extrabold tracking-[-0.02em] break-words"
               style="text-shadow: 0 4px 14px rgba(0,0,0,.25)">${cur}</div>
          <p class="mt-2 text-[10px] tracking-[0.2em] text-white/75">${l.isWords ? 'KATA' : 'KARAKTER'}</p>
        </div>

        <!-- Sel braille per huruf (kata memakai banyak sel) -->
        <div class="mt-5 flex flex-col items-center">
          <div id="lessonCell" class="flex flex-wrap items-end justify-center gap-4"></div>
          <p class="mt-3 text-[10px] tracking-[0.2em] text-white/75">SEL BRAILLE</p>
        </div>

        <p id="lessonDots" class="mt-4 text-center text-[11.5px] text-white/90"></p>
      </div>
    </section>

    <!-- Tombol rasakan -->
    <section class="px-5 mt-4 rise">
      <button type="button" id="btnLessonFeel"
              class="btn-primary w-full min-h-[52px] rounded-2xl text-white font-bold text-[15px]
                     flex items-center justify-center gap-2">
        ${svg('hand','w-5 h-5')} Rasakan Pola Getaran
      </button>
      <p id="lessonStatus" class="mt-2 text-center text-[11.5px] text-ink-500" role="status" aria-live="polite"></p>
    </section>

    <!-- Kuis -->
    <section class="px-5 mt-4 rise" aria-labelledby="lbl-lq">
      <h2 id="lbl-lq" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">
        ${l.isWords ? 'Kata mana yang barusan bergetar?' : 'Karakter mana yang barusan bergetar?'}
      </h2>
      <!-- Pilihan jawaban diisi ulang oleh JS setiap kali pindah soal -->
      <div id="lessonOptions" class="mt-3 ${l.isWords ? 'grid grid-cols-2 gap-2.5' : 'grid grid-cols-4 gap-2.5'}"
           role="group" aria-label="Pilihan jawaban"></div>
      <p id="lessonFeedback" class="mt-3 text-center text-[13px] font-bold" role="status" aria-live="polite"></p>
    </section>

    <!-- Navigasi modul -->
    <section class="px-5 mt-4 rise">
      <div class="flex gap-3">
        <button type="button" id="btnLessonPrev"
                class="btn-ghost surface flex-1 min-h-[48px] rounded-xl font-bold text-[14px] text-ink-700
                       flex items-center justify-center gap-2">
          ${svg('prev','w-4 h-4',2)} Sebelumnya
        </button>
        <button type="button" id="btnLessonNext"
                class="btn-primary flex-1 min-h-[48px] rounded-xl font-bold text-[14px] text-white
                       flex items-center justify-center gap-2">
          Selanjutnya ${svg('next','w-4 h-4',2)}
        </button>
      </div>
    </section>
  </div>`;
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

    <!-- Daftar contoh huruf — A sampai Z lengkap -->
    <section class="px-5 mt-5" aria-labelledby="lbl-ex">
      <div class="flex items-end justify-between">
        <h2 id="lbl-ex" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Pola Huruf A&ndash;Z</h2>
        <span class="text-[11px] font-semibold text-ink-500">26 huruf</span>
      </div>
      <p class="text-[11.5px] text-ink-500 mt-1">Ketuk huruf untuk merasakan pola getarannya.</p>

      ${['A–J', 'K–T', 'U–Z'].map((label, gi) => {
        const groups = [['A','B','C','D','E','F','G','H','I','J'],
                        ['K','L','M','N','O','P','Q','R','S','T'],
                        ['U','V','W','X','Y','Z']];
        const chips = groups[gi].map(ch => gestureExample(ch)).join('');
        return `
        <div class="mt-3">
          <p class="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-500 mb-2">${label}</p>
          <ul class="grid grid-cols-5 gap-2 stagger">${chips}</ul>
        </div>`;
      }).join('')}
    </section>
  </div>`;
}

function gestureExample(ch) {
  const dots = HAPTIC.dotsFor(ch) || [];
  const layout = [1, 4, 2, 5, 3, 6];
  const dotList = dots.join(' ');
  return `
  <li>
    <button type="button" data-feel="${ch}" aria-label="Huruf ${ch}, titik braille ${dotList || 'tidak ada'}"
            class="surface surface-interactive w-full flex flex-col items-center gap-2 rounded-2xl p-2.5 pt-3 group">
      <span class="text-[18px] font-extrabold text-brand-600 transition-transform duration-200 group-hover:scale-[1.08]">${ch}</span>
      <span class="grid grid-cols-2 gap-x-1.5 gap-y-1" aria-hidden="true">
        ${layout.map(n => `<span class="w-2 h-2 rounded-full transition-colors ${dots.includes(n) ? 'bg-brand-600' : 'bg-brand-100'}"></span>`).join('')}
      </span>
    </button>
  </li>`;
}

/* ============ LAYAR 6 : KONTAK DARURAT ============ */
function renderContacts() {
  const items = STATE.contacts.map((c, i) => `
    <li>
      <div class="surface rounded-2xl p-3.5 flex items-center gap-3">
        <span class="w-11 h-11 shrink-0 rounded-full text-brand-600 flex items-center justify-center border border-brand-100"
              style="background: linear-gradient(160deg,#EEF5FF,#D9E8FF)" aria-hidden="true">
          ${svg('user','w-5 h-5',1.9)}
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-[14px] font-bold text-ink-900 truncate tracking-[-0.008em]">${c.name}</p>
          <p class="text-[11.5px] text-ink-500 truncate">${c.relation} • <span class="tabular">${c.phone}</span></p>
        </div>
        <button type="button" data-call="${i}" aria-label="Panggil ${c.name}"
                class="btn-ghost shrink-0 w-11 h-11 rounded-full bg-ok-50 text-ok-700 border border-ok-600/20
                       hover:bg-ok-600 hover:text-white flex items-center justify-center transition-colors">
          ${svg('phone','w-[18px] h-[18px]',2)}
        </button>
      </div>
    </li>`).join('');

  return `
  <div class="pb-6">
    <div class="px-5 pt-4 rise">
      <h1 class="text-[21px] font-extrabold text-ink-900 leading-tight tracking-[-0.022em]">Kontak Darurat</h1>
      <p class="mt-2 text-[13px] leading-relaxed text-ink-500 font-access">
        Hubungi pendamping dengan satu ketukan. Tombol panggil juga bergetar sebagai konfirmasi.
      </p>
    </div>

    ${STATE.contacts.length ? `
    <section class="px-5 mt-5 rise" aria-labelledby="lbl-contacts">
      <h2 id="lbl-contacts" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Daftar Kontak</h2>
      <ul class="mt-3 space-y-2.5 stagger">${items}</ul>
    </section>` : `
    <section class="px-5 mt-5 rise">
      <div class="surface rounded-2xl p-6 text-center">
        <p class="text-[13px] text-ink-500">Belum ada kontak. Tambahkan satu di bawah.</p>
      </div>
    </section>`}

    <!-- Tambah kontak -->
    <section class="px-5 mt-5 rise" aria-labelledby="lbl-add">
      <h2 id="lbl-add" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Tambah Kontak</h2>
      <div class="surface mt-3 rounded-2xl p-4 space-y-3">
        <div class="input-wrap">
          <label for="cName">Nama</label>
          <input id="cName" type="text" placeholder="Nama kontak" />
        </div>
        <div class="input-wrap">
          <label for="cRel">Hubungan</label>
          <input id="cRel" type="text" placeholder="Pendamping / Keluarga / Medis" />
        </div>
        <div class="input-wrap">
          <label for="cPhone">Nomor telepon</label>
          <input id="cPhone" type="tel" placeholder="+62 ..." inputmode="tel" />
        </div>
        <button type="button" id="btnAddContact"
                class="btn-primary w-full min-h-[48px] rounded-xl text-white font-bold text-[14px]
                       flex items-center justify-center gap-2">
          ${svg('check','w-4 h-4',2.4)} Simpan Kontak
        </button>
      </div>
    </section>

    <div class="px-5 mt-5">
      <a href="tel:119" class="btn-primary flex w-full min-h-[52px] rounded-2xl text-white font-bold text-[15px]
              items-center justify-center gap-2 no-underline">
        ${svg('phone','w-5 h-5',2)} Panggil Darurat 119
      </a>
    </div>
  </div>`;
}

/* ============ LAYAR 7 : KONDISI PENDAMPING ============ */
function renderCompanion() {
  const needs = [
    { id: 'deafblind', label: 'Deafblind (tuli & buta)', desc: 'Komunikasi sepenuhnya lewat haptic' },
    { id: 'lowvision', label: 'Low vision',             desc: 'Masih ada sisa penglihatan' },
    { id: 'deaf',      label: 'Tuli',                   desc: 'Tidak bisa mendengar' },
    { id: 'blind',     label: 'Buta',                   desc: 'Tidak bisa melihat' },
    { id: 'tactile',   label: 'Sensitif terhadap getaran', desc: 'Perlu getaran lebih lembut' },
  ];

  const chips = needs.map(n => {
    const on = STATE.companion.needs.includes(n.id);
    return `
    <button type="button" data-need="${n.id}" aria-pressed="${on}"
            class="surface surface-interactive text-left rounded-2xl p-3.5 flex items-start gap-3 w-full">
      <span class="w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors
                   ${on ? 'bg-brand-600 border-brand-600 text-white' : 'border-line text-transparent'}">
        ${svg('check','w-3.5 h-3.5',3)}
      </span>
      <span class="min-w-0">
        <span class="block text-[13.5px] font-bold text-ink-900 leading-tight">${n.label}</span>
        <span class="block text-[11.5px] text-ink-500 mt-0.5">${n.desc}</span>
      </span>
    </button>`;
  }).join('');

  return `
  <div class="pb-6">
    <div class="px-5 pt-4 rise">
      <h1 class="text-[21px] font-extrabold text-ink-900 leading-tight tracking-[-0.022em]">Kondisi Pendamping</h1>
      <p class="mt-2 text-[13px] leading-relaxed text-ink-500 font-access">
        Sesuaikan aplikasi dengan kebutuhan pengguna &amp; pendamping.
      </p>
    </div>

    <section class="px-5 mt-5 rise" aria-labelledby="lbl-needs">
      <h2 id="lbl-needs" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Kebutuhan Pengguna</h2>
      <div class="mt-3 grid grid-cols-1 gap-2.5 stagger" role="group" aria-label="Pilih kondisi">
        ${chips}
      </div>
    </section>

    <section class="px-5 mt-5 rise" aria-labelledby="lbl-note">
      <h2 id="lbl-note" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Catatan Pendamping</h2>
      <div class="surface mt-3 rounded-2xl p-4">
        <div class="input-wrap">
          <label for="companionNote">Catatan kondisi atau kebutuhan khusus</label>
          <textarea id="companionNote" rows="3"
                    class="w-full border rounded-2xl p-3 text-[14px] text-ink-900"
                    style="border-color: rgba(11,95,204,.15); background:#F7FAFF"
                    placeholder="Contoh: pendamping Tuli, komunikasi via teks singkat">${STATE.companion.note}</textarea>
        </div>
        <button type="button" id="btnSaveNote"
                class="btn-primary mt-3 w-full min-h-[48px] rounded-xl text-white font-bold text-[14px]
                       flex items-center justify-center gap-2">
          ${svg('check','w-4 h-4',2.4)} Simpan Catatan
        </button>
      </div>
    </section>

    <section class="px-5 mt-5 rise">
      <div class="rounded-2xl border border-brand-100 p-4"
           style="background: linear-gradient(180deg,#EEF5FF,#E4EFFF)">
        <h2 class="flex items-center gap-1.5 text-[13px] font-bold text-brand-700">
          ${svg('info','w-4 h-4')} Mengapa ini penting
        </h2>
        <p class="mt-2 text-[12.5px] text-ink-700 font-access leading-relaxed">
          Deafblind adalah spektrum. Mengetahui kondisi tiap pengguna membantu aplikasi
          memilih cara komunikasi yang tepat: haptic, teks besar, atau kombinasi keduanya.
        </p>
      </div>
    </section>
  </div>`;
}

/* ============ LAYAR 8 : UNGGAH BUKU HAPTIC ============ */
function renderUpload() {
  const list = STATE.uploaded.length ? STATE.uploaded.map((b, i) => `
    <li>
      <div class="surface rounded-2xl p-3.5 flex items-center gap-3">
        <span class="w-11 h-11 shrink-0 rounded-xl text-brand-600 flex items-center justify-center border border-brand-100"
              style="background: linear-gradient(160deg,#EEF5FF,#D9E8FF)" aria-hidden="true">
          ${svg('book2','w-5 h-5',1.7)}
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-[13.5px] font-bold text-ink-900 truncate">${b.title}</p>
          <p class="text-[11.5px] text-ink-500 truncate">${b.author} • ${b.pages} halaman</p>
        </div>
        <span class="shrink-0 text-[10.5px] font-bold rounded-md border px-1.5 py-0.5 bg-ok-50 text-ok-700 border-ok-600/20">Siap</span>
      </div>
    </li>`).join('')
    : `<li class="surface rounded-2xl p-6 text-center"><p class="text-[13px] text-ink-500">Belum ada buku diunggah.</p></li>`;

  return `
  <div class="pb-6">
    <div class="px-5 pt-4 rise">
      <h1 class="text-[21px] font-extrabold text-ink-900 leading-tight tracking-[-0.022em]">Unggah Buku Haptic</h1>
      <p class="mt-2 text-[13px] leading-relaxed text-ink-500 font-access">
        Impor file buku untuk dibaca. Prototipe ini menyimpan data buku secara lokal.
      </p>
    </div>

    <!-- Area unggah -->
    <section class="px-5 mt-5 rise" aria-labelledby="lbl-up">
      <h2 id="lbl-up" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Form Buku</h2>
      <div class="surface mt-3 rounded-2xl p-4 space-y-3">
        <div class="input-wrap">
          <label for="upTitle">Judul buku</label>
          <input id="upTitle" type="text" placeholder="Judul buku" />
        </div>
        <div class="input-wrap">
          <label for="upAuthor">Penulis</label>
          <input id="upAuthor" type="text" placeholder="Nama penulis" />
        </div>
        <div class="input-wrap">
          <label for="upPages">Jumlah halaman</label>
          <input id="upPages" type="number" min="1" inputmode="numeric" placeholder="Contoh: 120" />
        </div>

        <!-- Pilih file (demo) -->
        <div>
          <label class="text-[.72rem] font-bold tracking-[.08em] uppercase text-ink-500">File buku (opsional)</label>
          <label for="upFile"
                 class="mt-2 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed
                        border-brand-200 bg-brand-50/50 p-5 cursor-pointer hover:bg-brand-50 transition-colors text-center">
            <span class="text-brand-600">${svg('upload','w-7 h-7',1.8)}</span>
            <span id="upFileName" class="text-[12.5px] text-ink-700 font-semibold">Ketuk untuk memilih file</span>
            <span class="text-[11px] text-ink-500">PDF, TXT, atau EPUB (demo)</span>
          </label>
          <input id="upFile" type="file" accept=".pdf,.txt,.epub" class="sr-only" />
        </div>

        <button type="button" id="btnUpload"
                class="btn-primary w-full min-h-[50px] rounded-xl text-white font-bold text-[14.5px]
                       flex items-center justify-center gap-2">
          ${svg('upload','w-5 h-5',2)} Unggah Buku
        </button>
      </div>
    </section>

    <!-- Daftar buku -->
    <section class="px-5 mt-5 rise" aria-labelledby="lbl-myb">
      <div class="flex items-center justify-between">
        <h2 id="lbl-myb" class="text-[14px] font-bold text-ink-900 tracking-[-0.01em]">Buku Haptic Saya</h2>
        <span class="text-[11px] font-semibold text-ink-500">${STATE.uploaded.length} buku</span>
      </div>
      <ul class="mt-3 space-y-2.5 stagger" id="uploadList">${list}</ul>
    </section>
  </div>`;
}

/* ============ LAYAR 9 : PROFIL ============ */

/* Pilihan peran yang tersedia (dipakai di Edit Profil & pendaftaran) */
const ROLE_OPTIONS = [
  'Tenaga Didik Terlatih',
  'Pendamping Keluarga',
  'Guru SLB',
  'Terapis/Wiyata',
  'Relawan Komunitas',
  'Pengguna Mandiri',
];

function renderProfile() {
  const p = STATE.practice;
  const initial = (STATE.user.name || '?').trim().charAt(0).toUpperCase();

  return `
  <div class="pb-6">
    <!-- Kartu identitas -->
    <section class="px-5 pt-4 rise" aria-labelledby="lbl-me">
      <div class="sheen rounded-3xl text-white p-5 on-dark relative overflow-hidden"
           style="background: linear-gradient(150deg, #1E74E8 0%, #0B5FCC 45%, #094BA3 80%, #0A3D80 100%);
                  box-shadow: 0 1px 2px rgba(11,22,32,.1), 0 14px 30px -14px rgba(11,95,204,.55);">
        <div class="absolute -right-12 -top-12 w-40 h-40 rounded-full decorative"
             style="background: radial-gradient(circle,rgba(255,255,255,.18),transparent 68%)" aria-hidden="true"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-16 h-16 shrink-0 rounded-full bg-white/95 p-[3px]"
               style="box-shadow: 0 8px 20px -8px rgba(0,0,0,.4)">
            <div class="w-full h-full rounded-full flex items-center justify-center text-brand-600 text-[24px] font-extrabold"
                 style="background: linear-gradient(160deg,#D9E8FF,#B7D2FF)" aria-hidden="true">${initial}</div>
          </div>
          <div class="min-w-0 flex-1">
            <h1 id="lbl-me" class="text-[18px] font-extrabold leading-tight tracking-[-0.018em] truncate">${STATE.user.name}</h1>
            <p class="text-[12.5px] text-white/90 mt-0.5">${STATE.user.role}</p>
            <p class="text-[11.5px] text-white/75 mt-1 truncate">${STATE.user.email}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Edit profil -->
    <section class="px-5 mt-4 rise" aria-labelledby="lbl-edit">
      <h2 id="lbl-edit" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Edit Profil</h2>
      <div class="surface mt-3 rounded-2xl p-4 space-y-3">
        <div class="input-wrap" style="margin-top:0">
          <label for="pfName">Nama lengkap</label>
          <input id="pfName" type="text" value="${STATE.user.name}" autocomplete="name" />
        </div>
        <div class="input-wrap" style="margin-top:0">
          <label for="pfRole">Peran</label>
          <select id="pfRole" class="w-full">
            ${ROLE_OPTIONS.map(r => `<option value="${r}" ${r === STATE.user.role ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </div>
        <p id="profileError" class="form-error" role="alert" hidden></p>
        <button type="button" id="btnSaveProfile"
                class="btn-primary w-full min-h-[48px] rounded-xl text-white font-bold text-[14px]
                       flex items-center justify-center gap-2">
          ${svg('check','w-4 h-4',2.4)} Simpan Perubahan
        </button>
      </div>
    </section>

    <!-- Statistik & progres -->
    <section class="px-5 mt-4 rise" aria-labelledby="lbl-stat">
      <h2 id="lbl-stat" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Statistik &amp; Progres</h2>
      <div class="mt-3 grid grid-cols-2 gap-3">
        ${profileStat('Karakter dikuasai', p.chars, 'huruf', 'brand')}
        ${profileStat('Akurasi', p.accuracy + '%', '', 'ok')}
        ${profileStat('Hari latihan', p.days, 'hari', 'teal')}
        ${profileStat('Buku diunggah', STATE.uploaded.length, 'buku', 'warn')}
      </div>

      <!-- Progres belajar ringkas -->
      <div class="surface mt-3 rounded-2xl p-4">
        <div class="flex items-center justify-between">
          <span class="text-[12.5px] font-semibold text-ink-900">Progres belajar</span>
          <span class="text-[12.5px] font-bold text-ok-700 tabular">${p.percent}%</span>
        </div>
        <div class="mt-2 h-2 rounded-full bg-surface overflow-hidden"
             role="progressbar" aria-valuenow="${p.percent}" aria-valuemin="0" aria-valuemax="100"
             aria-label="Progres belajar ${p.percent} persen">
          <div class="h-full rounded-full" style="width:${p.percent}%; background: linear-gradient(90deg,#16A34A,#15803D)"></div>
        </div>
        <p class="mt-2 text-[11.5px] text-ink-500">${p.level} • ${p.done} dari ${p.target} modul selesai</p>
      </div>
    </section>

    <!-- Pintasan -->
    <section class="px-5 mt-4 rise" aria-labelledby="lbl-short">
      <h2 id="lbl-short" class="text-[15px] font-bold text-ink-900 tracking-[-0.012em]">Pintasan</h2>
      <div class="surface mt-3 rounded-2xl divide-y divide-line overflow-hidden">
        ${profileLinkRow('shield', 'Mode Aksesibilitas', 'access')}
        ${profileLinkRow('users', 'Kondisi Pendamping', 'companion')}
        ${profileLinkRow('phone', 'Kontak Darurat', 'contacts')}
        ${profileLinkRow('upload', 'Unggah Buku Haptic', 'upload')}
      </div>
    </section>

    <!-- Keluar -->
    <section class="px-5 mt-5 rise">
      <button type="button" id="btnLogout"
              class="btn-ghost w-full min-h-[50px] rounded-2xl font-bold text-[14.5px]
                     flex items-center justify-center gap-2 border"
              style="color:#B91C1C; background:#FEF2F2; border-color:rgba(185,28,28,.25)">
        ${svg('back','w-5 h-5',2.2)} Keluar Akun
      </button>
      <p class="mt-2 text-center text-[11px] text-ink-500">Data demo di perangkat ini tidak akan terhapus.</p>
    </section>
  </div>`;
}

function profileStat(label, value, unit, tone) {
  const tones = {
    brand: 'text-brand-600', ok: 'text-ok-700', teal: 'text-teal-700', warn: 'text-warn-700',
  };
  return `
  <div class="surface rounded-2xl p-4">
    <p class="text-[11.5px] font-semibold text-ink-500">${label}</p>
    <p class="mt-1.5 text-[22px] font-extrabold leading-none tabular tracking-[-0.02em] ${tones[tone] || tones.brand}">
      ${value}${unit ? ` <span class="text-[12px] font-semibold text-ink-500">${unit}</span>` : ''}
    </p>
  </div>`;
}

function profileLinkRow(icon, title, nav) {
  return `
  <button type="button" data-nav="${nav}"
          class="btn-ghost w-full flex items-center gap-3.5 p-4 text-left hover:bg-surface active:bg-brand-50 group">
    <span class="w-10 h-10 shrink-0 rounded-xl bg-brand-50 text-brand-600 border border-brand-100
                 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.05]">
      ${svg(icon, 'w-[19px] h-[19px]')}
    </span>
    <span class="min-w-0 flex-1 text-[14px] font-semibold text-ink-900">${title}</span>
    <span class="text-ink-300 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">${svg('chev','w-4 h-4',2)}</span>
  </button>`;
}

/* -------------------------------------------------------------------------
   4. ROUTER
   ------------------------------------------------------------------------- */
const SCREENS = {
  splash:    { render: renderSplash,    title: null,            back: false },
  login:     { render: renderLogin,     title: 'Login',         back: false },
  signup:    { render: renderSignup,    title: 'Buat Akun',     back: false },
  home:      { render: renderHome,      title: null,            back: false },
  dashboard: { render: renderDashboard, title: 'Beranda',       back: true  },
  reader:    { render: renderReader,    title: 'Baca Buku',     back: true  },
  practice:  { render: renderPractice,  title: 'Latihan Braille', back: true },
  gesture:   { render: renderGesture,   title: 'Peta Gestur',   back: true  },
  contacts:  { render: renderContacts,  title: 'Kontak Darurat', back: true },
  companion: { render: renderCompanion, title: 'Kondisi Pendamping', back: true },
  upload:    { render: renderUpload,    title: 'Unggah Buku',   back: true  },
  profile:   { render: renderProfile,   title: 'Profil',        back: true  },
  lesson:    { render: renderLesson,    title: 'Latihan',       back: true  },
};

const NAV_ITEMS = [
  { id: 'home',      label: 'Home',     icon: 'home' },
  { id: 'dashboard', label: 'Library',  icon: 'book' },
  { id: 'practice',  label: 'Latihan',  icon: 'braille' },
  { id: 'profile',   label: 'Profil',   icon: 'user' },
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
  // Layar full-bleed (splash & login) butuh wrapper setinggi penuh agar konten
  // benar-benar ter-center secara vertikal.
  const fullBleed = ['splash', 'login', 'signup'].includes(STATE.screen);
  document.body.classList.toggle('is-fullscreen', fullBleed);
  main.innerHTML = `<div class="${fullBleed ? 'screen-fill' : 'rise'}">${s.render()}</div>`;
  renderHeader(s);
  renderNav();
  bindNav(nav);
  bindNav(document.getElementById('appHeader'));
  bindScreenEvents();
}

function renderHeader(s) {
  const h = document.getElementById('appHeader');
  if (['splash', 'login', 'signup'].includes(STATE.screen)) { h.className = 'hidden'; h.innerHTML = ''; return; }
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
  if (['splash', 'login', 'signup'].includes(STATE.screen)) {
    nav.innerHTML = '';
    return;
  }

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

      // Jika tombol membawa info buku, muat buku itu ke Reader dulu
      const bookTitle = el.getAttribute('data-open-book');
      if (bookTitle) openBook(bookTitle);

      go(target);
      history.pushState({ screen: target }, '');
    });
  });
}

/* Muat sebuah buku ke Reader: set judul & jadikan kata-kata judul sebagai
   latihan baca braille, supaya apa yang dibaca sesuai dengan buku yang dibuka. */
function openBook(title) {
  STATE.book.title = title;
  // Pecah judul jadi kata-kata untuk dibaca haptic
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length) {
    // Mutasi isi array yang sama agar semua referensi tetap sinkron
    READER_SENTENCES.length = 0;
    words.forEach(w => READER_SENTENCES.push(w));
    readerWordIdx = 0;
    readerIdx = 0;
  }
  announce(`Membuka buku ${title}.`, true);
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
      const label = (el.querySelector('.font-semibold') || el.querySelector('.font-bold'))
        ?.textContent?.trim() || 'Fitur';
      announce(`${label} — belum diimplementasikan di prototipe ini.`, true);
    });
  });
  // Modul latihan -> buka detail modul
  main.querySelectorAll('[data-lesson]').forEach(el => {
    el.addEventListener('click', () => {
      STATE.lessonId = el.getAttribute('data-lesson');
      STATE.lessonIdx = 0;
      STATE.lessonCharIdx = 0;
      go('lesson');
      history.pushState({ screen: 'lesson' }, '');
    });
  });

  main.querySelectorAll('[data-act="forgot"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      announce('Fungsi lupa kata sandi belum diimplementasikan pada prototype.', true);
    });
  });

  // Tombol "Buat akun baru" -> buka layar pendaftaran
  main.querySelectorAll('[data-act="signup"]').forEach(el => {
    el.addEventListener('click', () => {
      go('signup');
      history.pushState({ screen: 'signup' }, '');
    });
  });

  // Tombol Masuk: loading -> sukses -> transisi ke Home (dengan haptic)
  const btnLogin = main.querySelector('#btnLogin');
  if (btnLogin) {
    btnLogin.addEventListener('click', () => handleLogin(btnLogin));
  }

  // Tombol Buat Akun: validasi -> loading -> sukses -> Home
  const btnSignup = main.querySelector('#btnSignup');
  if (btnSignup) {
    btnSignup.addEventListener('click', () => handleSignup(btnSignup));
  }

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

  // Event khusus per layar
  if (STATE.screen === 'reader')   bindReaderEvents();
  if (STATE.screen === 'gesture')  bindGestureEvents();
  if (STATE.screen === 'practice') bindPracticeEvents();
  if (STATE.screen === 'contacts') bindContactEvents();
  if (STATE.screen === 'companion') bindCompanionEvents();
  if (STATE.screen === 'upload') bindUploadEvents();
  if (STATE.screen === 'profile') bindProfileEvents();
  if (STATE.screen === 'lesson') bindLessonEvents();
}

/* --- Detail modul latihan --- */
function bindLessonEvents() {
  const l = LESSONS.find(x => x.id === STATE.lessonId) || LESSONS[0];
  const statusEl = main.querySelector('#lessonStatus');
  const feedbackEl = main.querySelector('#lessonFeedback');
  const optionsEl = main.querySelector('#lessonOptions');

  const curItem = () => l.chars[STATE.lessonIdx % l.chars.length];

  /* Buat satu sel braille (6 titik) untuk sebuah huruf */
  const cellFor = (ch, active = false) => {
    const dots = HAPTIC.dotsFor(ch) || [];
    const layout = [1, 4, 2, 5, 3, 6];
    return `
    <div class="text-center">
      <div class="grid grid-cols-2 gap-x-3 gap-y-2 ${active ? 'bdot-active' : ''}">
        ${layout.map(n => `<span class="reader-bdot${dots.includes(n) ? ' on' : ''}" aria-hidden="true">${dots.includes(n) ? '' : n}</span>`).join('')}
      </div>
      <p class="mt-1.5 text-[10px] font-bold text-white/70">${ch.toUpperCase()}</p>
    </div>`;
  };

  /* Render ulang seluruh kartu sesuai soal saat ini */
  const renderCard = () => {
    const cur = curItem();
    const letters = [...cur];              // kata/frasa => per huruf
    const charEl = main.querySelector('#lessonChar');
    const cellEl = main.querySelector('#lessonCell');
    const dotsEl = main.querySelector('#lessonDots');

    if (charEl) charEl.textContent = cur;
    if (cellEl) {
      // Tampilkan satu sel braille untuk tiap huruf dalam kata
      cellEl.innerHTML = letters.map((ch, k) => cellFor(ch, false)).join('');
    }
    if (dotsEl) {
      if (l.isWords) {
        dotsEl.textContent = letters.map(ch => `${ch.toUpperCase()} (${(HAPTIC.dotsFor(ch) || []).join('')})`).join('  •  ');
      } else {
        const dots = HAPTIC.dotsFor(cur) || [];
        dotsEl.textContent = `Titik braille: ${dots.length ? dots.join(', ') : '—'}`;
      }
    }
    const label = main.querySelector('#lbl-lb');
    if (label) label.textContent = `Pola braille untuk ${cur}`;
    const titleEl = main.querySelector('#lessonTitle');
    if (titleEl) titleEl.textContent = `Latihan ${cur}`;
    const counterEl = main.querySelector('#lessonCounter');
    if (counterEl) counterEl.textContent = `${(STATE.lessonIdx % l.chars.length) + 1} / ${l.chars.length}`;
  };

  /* Render ulang pilihan jawaban untuk soal saat ini */
  const renderOptions = () => {
    const cur = curItem();
    const pool = l.chars.filter(c => c !== cur)
      .sort(() => 0.5 - Math.random())
      .slice(0, l.isWords ? 3 : 3);
    const options = [cur, ...pool].sort(() => 0.5 - Math.random());

    optionsEl.innerHTML = options.map(opt => `
      <button type="button" data-answer="${opt}" aria-pressed="false"
              class="btn-ghost min-h-[52px] rounded-xl border border-line bg-white ${l.isWords ? 'text-[14px]' : 'text-[16px]'} font-extrabold text-ink-900
                     hover:border-brand-300 active:bg-brand-50 transition-colors px-2">
        ${opt}
      </button>`).join('');

    optionsEl.querySelectorAll('[data-answer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const answer = curItem();
        const pick = btn.getAttribute('data-answer');
        const correct = pick === answer;
        if (feedbackEl) {
          feedbackEl.textContent = correct ? `Benar! Ini "${answer}".` : `Belum tepat. Jawaban: "${answer}".`;
          feedbackEl.style.color = correct ? '#15803D' : '#B91C1C';
        }
        vibrate(correct ? [22, 60, 22] : [50, 40, 50]);
        announce(correct ? `Benar. Ini ${answer}.` : `Belum tepat. Jawaban yang benar ${answer}.`, true);
        optionsEl.querySelectorAll('[data-answer]').forEach(b => {
          b.style.borderColor = ''; b.style.background = ''; b.setAttribute('aria-pressed', 'false');
        });
        btn.style.borderColor = correct ? '#15803D' : '#B91C1C';
        btn.style.background = correct ? '#ECFDF3' : '#FEF2F2';
        btn.setAttribute('aria-pressed', 'true');
      });
    });
  };

  const refresh = () => {
    renderCard();
    renderOptions();
    if (feedbackEl) feedbackEl.textContent = '';
  };

  /* Rasakan getaran: kata => semua huruf berurutan; karakter => satu pola */
  main.querySelector('#btnLessonFeel')?.addEventListener('click', async () => {
    const cur = curItem();
    vibrate([14, 40, 14]);
    if (l.isWords) {
      if (statusEl) statusEl.textContent = `Menggetarkan kata "${cur}" huruf demi huruf...`;
      await HAPTIC.buzzText(cur, (k, ch) => {
        if (statusEl) statusEl.textContent = `Huruf ${k + 1}/${cur.length}: "${ch.toUpperCase()}" bergetar...`;
        // sorot sel huruf yang sedang bergetar
        const cells = main.querySelectorAll('#lessonCell > div');
        cells.forEach((c, ci) => c.classList.toggle('bdot-active', ci === k));
      });
      const cells = main.querySelectorAll('#lessonCell > div');
      cells.forEach(c => c.classList.remove('bdot-active'));
    } else {
      if (statusEl) statusEl.textContent = `Menggetarkan pola "${cur.toUpperCase()}"...`;
      await HAPTIC.buzzText(cur);
    }
    if (statusEl) statusEl.textContent = 'Selesai. Sekarang pilih jawaban di bawah.';
  });

  // Navigasi soal
  const move = (dir) => {
    STATE.lessonIdx = (STATE.lessonIdx + dir + l.chars.length) % l.chars.length;
    STATE.lessonCharIdx = 0;
    refresh();
    const cur = curItem();
    vibrate([16]);
    announce(`${l.isWords ? 'Kata' : 'Karakter'} ${STATE.lessonIdx + 1} dari ${l.chars.length}: ${cur}`);
  };
  main.querySelector('#btnLessonPrev')?.addEventListener('click', () => move(-1));
  main.querySelector('#btnLessonNext')?.addEventListener('click', () => move(1));

  // Render awal
  refresh();
}

/* --- Profil --- */
function bindProfileEvents() {
  // Simpan perubahan profil
  main.querySelector('#btnSaveProfile')?.addEventListener('click', () => {
    const nameEl = document.getElementById('pfName');
    const roleEl = document.getElementById('pfRole');
    const errEl = document.getElementById('profileError');
    const name = nameEl.value.trim();
    const role = roleEl.value.trim() || 'Tenaga Didik Terlatih';

    const fail = (msg) => {
      if (errEl) { errEl.hidden = false; errEl.textContent = msg; }
      vibrate([40, 40, 40]);
      announce(msg, true);
      nameEl.focus();
    };
    if (!name) return fail('Nama tidak boleh kosong.');
    if (errEl) { errEl.hidden = true; errEl.textContent = ''; }

    STATE.user.name = name;
    STATE.user.role = role;
    try {
      localStorage.setItem('bh_user_name', name);
      localStorage.setItem('bh_user_role', role);
    } catch (e) {}

    vibrate([22, 60, 22]);
    announce(`Profil diperbarui. Nama disimpan sebagai ${name}.`, true);
    render();
  });

  // Keluar akun: kembali ke layar login, tawarkan hapus data demo
  main.querySelector('#btnLogout')?.addEventListener('click', () => {
    vibrate([30, 50, 30]);
    const flash = document.getElementById('screenFlash');
    announce('Keluar dari akun. Membuka halaman masuk.', true);
    if (flash) flash.classList.add('on');
    setTimeout(() => {
      go('login');
      history.pushState({ screen: 'login' }, '');
      if (flash) flash.classList.remove('on');
    }, 260);
  });
}

/* --- Kontak Darurat --- */
function bindContactEvents() {
  // Panggil: beri umpan balik haptic lalu buka dialer
  main.querySelectorAll('[data-call]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = +btn.getAttribute('data-call');
      const c = STATE.contacts[idx];
      vibrate([20, 60, 20]);
      announce(`Memanggil ${c.name}.`, true);
      // Buka aplikasi telepon (aman di prototipe)
      window.location.href = `tel:${c.phone.replace(/[^\d+]/g, '')}`;
    });
  });

  // Simpan kontak baru
  main.querySelector('#btnAddContact')?.addEventListener('click', () => {
    const name  = document.getElementById('cName').value.trim();
    const rel   = document.getElementById('cRel').value.trim() || 'Kontak';
    const phone = document.getElementById('cPhone').value.trim();

    if (!name || !phone) {
      vibrate([40, 40, 40]);
      announce('Nama dan nomor telepon wajib diisi.', true);
      (!name ? document.getElementById('cName') : document.getElementById('cPhone')).focus();
      return;
    }

    STATE.contacts.push({ name, relation: rel, phone });
    try { localStorage.setItem('bh_contacts', JSON.stringify(STATE.contacts)); } catch (e) {}
    vibrate([22, 60, 22]);
    announce(`Kontak ${name} disimpan.`, true);
    render();
  });
}

/* --- Kondisi Pendamping --- */
function bindCompanionEvents() {
  main.querySelectorAll('[data-need]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-need');
      const arr = STATE.companion.needs;
      const i = arr.indexOf(id);
      if (i >= 0) arr.splice(i, 1); else arr.push(id);
      try { localStorage.setItem('bh_needs', JSON.stringify(arr)); } catch (e) {}

      const on = arr.includes(id);
      btn.setAttribute('aria-pressed', String(on));
      const mark = btn.querySelector('span');
      mark.className = `w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors `
        + (on ? 'bg-brand-600 border-brand-600 text-white' : 'border-line text-transparent');
      vibrate(on ? [18, 50, 18] : [30]);
      announce(`${btn.querySelector('.font-bold').textContent} ${on ? 'dipilih' : 'dibatalkan'}.`, true);
    });
  });

  main.querySelector('#btnSaveNote')?.addEventListener('click', () => {
    const val = document.getElementById('companionNote').value.trim();
    STATE.companion.note = val;
    try { localStorage.setItem('bh_companion_note', val); } catch (e) {}
    vibrate([20, 50, 20]);
    announce('Catatan pendamping disimpan.', true);
  });
}

/* --- Unggah Buku Haptic --- */
function bindUploadEvents() {
  // Nama file tampil saat dipilih
  const fileInput = main.querySelector('#upFile');
  const fileName = main.querySelector('#upFileName');
  fileInput?.addEventListener('change', () => {
    const f = fileInput.files && fileInput.files[0];
    if (fileName) fileName.textContent = f ? f.name : 'Ketuk untuk memilih file';
    if (f) announce(`File ${f.name} dipilih.`, true);
  });

  main.querySelector('#btnUpload')?.addEventListener('click', () => {
    const title  = document.getElementById('upTitle').value.trim();
    const author = document.getElementById('upAuthor').value.trim() || 'Tanpa penulis';
    const pages  = parseInt(document.getElementById('upPages').value, 10) || 0;

    if (!title) {
      vibrate([40, 40, 40]);
      announce('Judul buku wajib diisi.', true);
      document.getElementById('upTitle').focus();
      return;
    }

    const file = fileInput?.files?.[0];
    STATE.uploaded.push({
      title,
      author,
      pages: pages || '—',
      file: file ? file.name : null,
    });
    try { localStorage.setItem('bh_uploaded', JSON.stringify(STATE.uploaded)); } catch (e) {}

    vibrate([22, 60, 22]);
    announce(`Buku ${title} berhasil diunggah.`, true);
    render();
  });
}

/* -------------------------------------------------------------------------
   5b. ANIMASI & TRANSISI
   ------------------------------------------------------------------------- */

/* Getaran halus (dihormati bila perangkat mendukung) */
function vibrate(pattern) {
  if (HAPTIC.supported && HAPTIC.enabled) {
    try { navigator.vibrate(pattern); } catch (e) { /* diabaikan */ }
  }
}

/* Pola haptic khusus untuk animasi */
const ANIM_HAPTIC = {
  splash:  [18, 90, 18, 90, 26],   // ketukan lembut saat splash
  success: [22, 60, 22, 60, 60],   // konfirmasi login berhasil
};

/* Transisi splash -> login (dipanggil dari boot) */
function goToLogin() {
  const flash = document.getElementById('screenFlash');
  if (flash) {
    flash.classList.add('on');
    setTimeout(() => {
      STATE.screen = 'login';
      render();
      announce('Selamat datang. Silakan masuk untuk melanjutkan.');
      flash.classList.remove('on');
    }, 260);
  } else {
    STATE.screen = 'login';
    render();
  }
}

/* Alur login: loading -> sukses -> flash -> Home */
function handleLogin(btn) {
  if (btn.classList.contains('is-loading') || btn.classList.contains('is-success')) return;

  const emailEl = document.getElementById('loginEmail');
  const passEl  = document.getElementById('loginPassword');
  const email = (emailEl && emailEl.value.trim()) || '';
  const pass  = (passEl && passEl.value) || '';

  // Validasi sederhana dengan pesan jelas (bukan hanya warna)
  if (!email || !pass) {
    announce('Email dan kata sandi wajib diisi.', true);
    if (emailEl) emailEl.focus();
    vibrate([40, 40, 40]);
    return;
  }

  btn.classList.add('is-loading');
  btn.setAttribute('aria-busy', 'true');
  announce('Sedang masuk, mohon tunggu.');
  vibrate([14, 60, 14]);

  setTimeout(() => {
    btn.classList.remove('is-loading');
    btn.classList.add('is-success');
    btn.setAttribute('aria-busy', 'false');
    announce('Berhasil masuk. Membuka beranda.');
    vibrate(ANIM_HAPTIC.success);

    const flash = document.getElementById('screenFlash');
    setTimeout(() => {
      if (flash) flash.classList.add('on');
      setTimeout(() => {
        go('home');
        history.pushState({ screen: 'home' }, '');
        if (flash) flash.classList.remove('on');
      }, 220);
    }, 520);
  }, 1300);
}

/* Helper: tampilkan pesan error pada form pendaftaran (bukan hanya warna) */
function showFormError(msg) {
  const box = document.getElementById('signupError');
  if (!box) return;
  if (!msg) { box.hidden = true; box.textContent = ''; return; }
  box.hidden = false;
  box.textContent = msg;
  announce(msg, true);
}

/* Alur buat akun: validasi -> loading -> sukses -> Home */
function handleSignup(btn) {
  if (btn.classList.contains('is-loading') || btn.classList.contains('is-success')) return;

  const nameEl  = document.getElementById('signupName');
  const emailEl = document.getElementById('signupEmail');
  const passEl  = document.getElementById('signupPassword');
  const confEl  = document.getElementById('signupConfirm');

  const name  = (nameEl && nameEl.value.trim()) || '';
  const email = (emailEl && emailEl.value.trim()) || '';
  const pass  = (passEl && passEl.value) || '';
  const conf  = (confEl && confEl.value) || '';

  // Validasi berurutan dengan pesan spesifik + fokus ke field bermasalah
  const fail = (msg, el) => { showFormError(msg); vibrate([40, 40, 40]); if (el) el.focus(); };

  if (!name)                 return fail('Nama lengkap wajib diisi.', nameEl);
  if (!email)                return fail('Email wajib diisi.', emailEl);
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail('Format email belum benar.', emailEl);
  if (!pass)                 return fail('Kata sandi wajib diisi.', passEl);
  if (pass.length < 8)       return fail('Kata sandi minimal 8 karakter.', passEl);
  if (!conf)                 return fail('Konfirmasi kata sandi wajib diisi.', confEl);
  if (pass !== conf)         return fail('Kata sandi dan konfirmasinya tidak sama.', confEl);

  showFormError('');
  btn.classList.add('is-loading');
  btn.setAttribute('aria-busy', 'true');
  announce('Membuat akun, mohon tunggu.');
  vibrate([14, 60, 14]);

  setTimeout(() => {
    btn.classList.remove('is-loading');
    btn.classList.add('is-success');
    btn.setAttribute('aria-busy', 'false');

    // Simpan identitas pengguna agar muncul di profil Home, sapaan Dashboard,
    // kartu Menu Cepat, dan halaman Profil.
    STATE.user.name = name;
    STATE.user.email = email;
    try {
      localStorage.setItem('bh_user_name', name);
      localStorage.setItem('bh_user_email', email);
    } catch (e) { /* diabaikan */ }

    announce(`Akun berhasil dibuat untuk ${name}. Membuka beranda.`);
    vibrate(ANIM_HAPTIC.success);

    const flash = document.getElementById('screenFlash');
    setTimeout(() => {
      if (flash) flash.classList.add('on');
      setTimeout(() => {
        go('home');
        history.pushState({ screen: 'home' }, '');
        if (flash) flash.classList.remove('on');
      }, 220);
    }, 520);
  }, 1300);
}

/* --- Reader (Immersive) --- */
let readerIdx = 0;       // indeks huruf dalam kata saat ini
let readerAutoPlaying = false;

function bindReaderEvents() {
  const status = main.querySelector('#hapticStatus');
  const autoStatusEl = main.querySelector('#readerAutoStatus');
  const autoReadBadge = main.querySelector('#autoReadBadge');
  const curWord = getReaderWord();
  highlightCell(0);
  updateHapticStatus(status, curWord[0]);

  /* ---- Tombol Rasa ---- */
  main.querySelector('#btnFeel').addEventListener('click', async () => {
    const ch = getReaderWord()[readerIdx] || getReaderWord()[0];
    highlightCell(readerIdx);
    updateHapticStatus(status, ch);
    await HAPTIC.buzzText(ch);
  });

  /* ---- Tombol Prev / Next huruf ---- */
  main.querySelector('#btnPrev').addEventListener('click', () => {
    const word = getReaderWord();
    readerIdx = (readerIdx - 1 + word.length) % word.length;
    previewChar(readerIdx, status);
  });
  main.querySelector('#btnNext').addEventListener('click', () => {
    const word = getReaderWord();
    readerIdx = (readerIdx + 1) % word.length;
    previewChar(readerIdx, status);
  });

  /* ---- Tombol Play / Auto Baca ---- */
  const play = main.querySelector('#btnPlay');
  const playIcon = main.querySelector('#playIcon');
  const playLabel = main.querySelector('#playLabel');

  async function startAutoRead() {
    readerAutoPlaying = true;
    play.setAttribute('aria-pressed', 'true');
    playIcon.innerHTML = svg('pause', 'w-5 h-5');
    playLabel.textContent = 'JEDA';
    if (autoReadBadge) autoReadBadge.classList.remove('hidden');
    if (autoStatusEl) autoStatusEl.textContent = 'Auto-baca aktif — ketuk 2 jari untuk jeda';
    play.style.background = 'linear-gradient(180deg,#FFD700 0%,#F59E0B 100%)';
    play.style.color = '#0A3D80';

    announce(HAPTIC.supported ? 'Auto-baca aktif. Rasakan getaran.' : 'Auto-baca aktif. Simulasi visual.', true);

    // Baca semua kata secara berurutan dari posisi saat ini
    for (let wi = readerWordIdx; wi < READER_SENTENCES.length; wi++) {
      if (!readerAutoPlaying) break;
      readerWordIdx = wi;
      readerIdx = 0;
      refreshReaderUI();

      const word = READER_SENTENCES[wi];
      await HAPTIC.buzzText(word, (i, ch) => {
        if (!readerAutoPlaying) return;
        highlightCell(i);
        updateHapticStatus(status, ch);
      });

      if (!readerAutoPlaying) break;
      // Jeda antar kata
      await HAPTIC._sleep(STATE.settings.wordGap);
    }

    stopAutoRead();
  }

  function stopAutoRead() {
    readerAutoPlaying = false;
    HAPTIC.stop();
    play.setAttribute('aria-pressed', 'false');
    playIcon.innerHTML = svg('play', 'w-5 h-5');
    playLabel.textContent = 'LANJUTKAN MEMBACA';
    if (autoReadBadge) autoReadBadge.classList.add('hidden');
    if (autoStatusEl) autoStatusEl.textContent = 'Ketuk 2 jari = Auto-Baca';
    play.style.background = 'linear-gradient(180deg,#FFFFFF 0%,#E8F0FF 100%)';
    play.style.color = '#0B5FCC';
  }

  play.addEventListener('click', () => {
    if (readerAutoPlaying) stopAutoRead();
    else startAutoRead();
  });

  /* ---- Gestur Swipe ---- */
  bindReaderGestures(status, stopAutoRead);
}

function refreshReaderUI() {
  const word = getReaderWord();
  const chars = [...word];
  const grid = main.querySelector('#brailleWordGrid');
  if (grid) {
    grid.innerHTML = chars.map((ch, i) => buildBigBrailleCell(ch, i === readerIdx, i)).join('');
  }
  const wordLabel = main.querySelector('#wordIdxLabel');
  if (wordLabel) wordLabel.textContent = readerWordIdx + 1;

  // Update kalimat preview
  const preview = main.querySelector('#sentencePreview');
  if (preview) {
    preview.innerHTML = READER_SENTENCES.map((w, i) => {
      const isCur = i === readerWordIdx;
      return `<span class="inline ${isCur ? 'text-white font-bold underline underline-offset-4 decoration-white/60' : 'text-white/50'}">${w}</span>`;
    }).join('<span class="text-white/30"> </span>');
  }
}

function highlightCell(idx) {
  const grid = main.querySelector('#brailleWordGrid');
  if (!grid) return;
  const word = getReaderWord();
  const ch = word[idx] || word[0];
  grid.querySelectorAll('.braille-word-cell').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
  // Update label pola titik braille
  const dots = HAPTIC.dotsFor(ch.toLowerCase()) || [];
  const patternEl = main.querySelector('#patternDots');
  if (patternEl) {
    patternEl.textContent = dots.length
      ? `${ch.toUpperCase()} — Titik ${dots.join(', ')}`
      : `${ch.toUpperCase()} — Spasi`;
  }
}

function bindReaderGestures(status, onStop) {
  const el = main.querySelector('#readerImmersive');
  if (!el) return;

  // State bersama untuk touch & mouse
  let startX = 0, startY = 0;
  let startTime = 0;
  let fingers = 0;
  let tapCount = 0;
  let tapTimer = null;
  let longPressTimer = null;
  let didLongPress = false;
  let mouseDown = false;
  let mouseMoved = false;

  /* ---------- helpers navigasi ---------- */
  function nextWord() {
    if (onStop) onStop();
    readerWordIdx = Math.min(readerWordIdx + 1, READER_SENTENCES.length - 1);
    readerIdx = 0;
    refreshReaderUI();
    const w = getReaderWord();
    drawBraille(w[0].toUpperCase(), true);
    highlightCell(0);
    updateHapticStatus(status, w[0]);
    announce(`Kata berikutnya: ${w}`, true);
    if (HAPTIC.supported) navigator.vibrate([30, 50, 30]);
  }

  function prevWord() {
    if (onStop) onStop();
    readerWordIdx = Math.max(readerWordIdx - 1, 0);
    readerIdx = 0;
    refreshReaderUI();
    const w = getReaderWord();
    drawBraille(w[0].toUpperCase(), true);
    highlightCell(0);
    updateHapticStatus(status, w[0]);
    announce(`Kata sebelumnya: ${w}`, true);
    if (HAPTIC.supported) navigator.vibrate([60]);
  }

  function exitReader() {
    if (onStop) onStop();
    announce('Keluar dari mode baca.', true);
    if (HAPTIC.supported) navigator.vibrate([80, 40, 80]);
    setTimeout(() => {
      go('dashboard');
      history.pushState({ screen: 'dashboard' }, '');
    }, 150);
  }

  function repeatWord() {
    const w = getReaderWord();
    announce(`Mengulang kata: ${w}`, true);
    HAPTIC.buzzText(w, (i, ch) => {
      readerIdx = i;
      drawBraille(ch.toUpperCase(), true);
      highlightCell(i);
      updateHapticStatus(status, ch);
    });
  }

  function saveBookmark() {
    announce(`Bookmark disimpan di kata ${readerWordIdx + 1}: ${getReaderWord()}`, true);
    if (HAPTIC.supported) navigator.vibrate([40, 30, 40, 30, 120]);
    showToast(`Bookmark disimpan — "${getReaderWord()}"`);
  }

  /* ---------- inti gestur: dipakai oleh touch & mouse ---------- */
  function handleGestureEnd(dx, dy, dt, numFingers, isLong) {
    if (isLong) { saveBookmark(); return; }

    const absDx = Math.abs(dx), absDy = Math.abs(dy);
    const isSwipe = dt < 700 && (absDx > 45 || absDy > 45);

    /* --- 2 jari (touch) atau tombol kanan mouse (mouse) --- */
    if (numFingers >= 2) {
      if (isSwipe && absDx > absDy) {
        dx > 0 ? nextWord() : exitReader();
      }
      return;
    }

    /* --- swipe 1 jari / mouse drag --- */
    if (isSwipe) {
      if (absDy > absDx && absDy > 45) {
        if (dy > 0) exitReader();
      } else if (absDx > absDy && absDx > 45) {
        if (onStop) onStop();
        const word = getReaderWord();
        if (dx < 0) readerIdx = (readerIdx + 1) % word.length;
        else        readerIdx = (readerIdx - 1 + word.length) % word.length;
        previewChar(readerIdx, status);
      }
      return;
    }

    /* --- tap --- */
    if (absDx < 15 && absDy < 15 && dt < 500) {
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => {
        if (tapCount === 1) main.querySelector('#btnPlay')?.click();
        else if (tapCount >= 2) repeatWord();
        tapCount = 0;
      }, 280);
    }
  }

  /* ==================== TOUCH EVENTS ==================== */
  el.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
    fingers = e.touches.length;
    didLongPress = false;
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => { didLongPress = true; saveBookmark(); }, 650);
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    clearTimeout(longPressTimer);
    if (didLongPress) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    handleGestureEnd(dx, dy, Date.now() - startTime, fingers, false);
  }, { passive: true });

  /* ==================== MOUSE EVENTS ==================== */
  // Klik kanan mouse = simulasi 2 jari (untuk test di desktop)
  el.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // Klik kanan tanpa drag = tampilkan info
    showToast('Tip: Drag kanan = kata selanjutnya | Drag kiri = keluar');
  });

  el.addEventListener('mousedown', (e) => {
    if (e.button === 2) return; // kanan ditangani contextmenu
    mouseDown = true;
    mouseMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    startTime = Date.now();
    // Simulasi 2 jari dengan Alt/Shift key
    fingers = (e.altKey || e.shiftKey) ? 2 : 1;
    didLongPress = false;
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => {
      if (mouseDown && !mouseMoved) { didLongPress = true; saveBookmark(); }
    }, 650);
    e.preventDefault(); // cegah seleksi teks
  });

  el.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
    if (dx > 8 || dy > 8) mouseMoved = true;
  });

  el.addEventListener('mouseup', (e) => {
    if (!mouseDown) return;
    mouseDown = false;
    clearTimeout(longPressTimer);
    if (didLongPress) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    handleGestureEnd(dx, dy, Date.now() - startTime, fingers, false);
  });

  // Mouse meninggalkan area = batalkan
  el.addEventListener('mouseleave', () => {
    mouseDown = false;
    clearTimeout(longPressTimer);
  });
}

function previewChar(i, status) {
  const word = getReaderWord();
  const ch = word[i];
  readerIdx = i;
  drawBraille(ch.toUpperCase(), true);
  highlightCell(i);
  updateHapticStatus(status, ch);
  announce(`Huruf ${i + 1} dari ${word.length}: ${ch}`);
}

/* Perbarui chip "Titik —" sesuai huruf aktif.
   Catatan: grid sel braille besar kini dirender oleh refreshReaderUI()/#brailleWordGrid.
   Fungsi ini hanya menyinkronkan chip penanda titik (dan aman dipanggil kapan saja). */
function drawBraille(letter) {
  const chip = document.getElementById('patternDots');
  if (!chip) return;
  const dots = HAPTIC.dotsFor(letter) || [];
  chip.textContent = dots.length ? `Titik ${dots.join(', ')}` : 'Titik —';
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

  STATE.screen = 'splash';
  render();

  // Haptic lembut saat splash muncul (beri tahu pengguna app siap)
  setTimeout(() => vibrate(ANIM_HAPTIC.splash), 500);

  // Splash -> login (dengan transisi halus)
  setTimeout(goToLogin, 1700);

  setTimeout(() => {
    if (!HAPTIC.supported) {
      showToast('Catatan: getaran hanya berfungsi di Android (Chrome). Di perangkat ini memakai simulasi visual.');
    }
  }, 2100);

  history.replaceState({ screen: 'splash' }, '');
  window.addEventListener('popstate', (e) => {
    STATE.screen = (e.state && e.state.screen) || 'splash';
    render();
    main.scrollTop = 0;
  });
}

boot();
