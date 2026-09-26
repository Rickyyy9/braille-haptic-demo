# Braille Haptic — Ringkasan Sesi (untuk lanjut di laptop lain)

Proyek: prototipe "Braille Haptic" (pembaca Braille haptic untuk tunarungu-tunanetra) — single-file HTML + Tailwind CDN + vanilla JS.

## Info Dasar
- **User**: Rickyyy9 / dapa20 (tim 2, kolaborator dengan push access)
- **Repo**: https://github.com/Rickyyy9/braille-haptic-demo — GitHub Pages https://rickyyy9.github.io/braille-haptic-demo/
- **Stack**: single-file HTML + Tailwind CDN + vanilla JS (tanpa build). Windows; gunakan `python` (bukan `python3`); PowerShell; project di `C:\Users\Laptop gawe\braille-haptic-demo`.
- **gh CLI**: `C:\Program Files\GitHub CLI\gh.exe`; perlu `gh auth login` untuk push.
- **Figma**: user pakai **Figma web** (bukan desktop) untuk desain; **Figma desktop** hanya untuk menjalankan plugin development.
- **Web Vibration API**: Android saja — dicatat jujur di proposal.
- **Aksesibilitas**: WCAG AA contrast; font Atkinson Hyperlegible; ikon SVG saja (tanpa emoji).
- **Bahasa respons**: Indonesia.
- **Direktif**: jangan commit/push ke GitHub kecuali diminta (kecuali commit terakhir yang sudah di-push).

## Struktur Utama
- `app.js` — semua 14-19 layar; `STATE` (screen, user, book, settings, practice, contacts); `SCREENS` (1664); `RENDER_*`; `bindNav`, `bindScreenEvents`, `bindReaderGestures`, `openBook`, `bindTunePanel`, `startAutoRead`, `renderShot` (shot mode untuk Figma import); `boot()`.
- `index.html` — HAPTIC engine (`buzzText`, `letterGapMs:420`, `tickMs:90`); `focusMode`; style `.surface` / `.surface-interactive`; bottom nav; shot CSS; `#appMain`.
- `figma-html/` — file HTML statis untuk import ke Figma (html.to.design): `01-splash` … `14-lesson`, `06b-reader-aktif`, `06c-reader-pengaturan`, `14b-lesson-kata`, + varian per buku `15…19`.
- `freeze-variants.mjs` — generator 14 layar asli. `freeze-books.mjs` — generator 15 frame reader per buku.
- `figma-plugin/manifest.json` + `code.js` — plugin Figma "Braille Haptic Wiring" (auto-matching frame, wiring hotspot/nav/gesture/flow; ditambah link per-buku).
- `inject-nav.ps1` — menyuntikkan bottom nav ke file figma-html (idempoten; skip splash/login/signup; file `reader` tidak dapat padding-bottom `.shot-scroll`).
- `D:\wa\slide-switchfest.html`, `D:\wa\bottom-nav.svg`, `D:\wa\Proposal_UIUX_Haptic_Braille_SwitchFest_2026.md` — presentasi, vektor nav, proposal.

## Alur Figma
1. Generate: `node freeze-books.mjs` (butuh server `python -m http.server 8080` di project; Playwright channel:'chrome'; output ke `figma-html/?shot=1#<screen>`).
2. Import ke Figma via html.to.design (1 halaman, frame name = nama file).
3. Jalankan plugin **Braille Haptic Wiring** (Figma desktop → Plugins → Development → Import plugin from manifest → pilih `figma-plugin/manifest.json`) — report panel muncul; tidak perlu import ulang saat kode plugin berubah (load dari disk tiap run).

## Commit Terakhir: `d608e20` (main, sudah di-push)
- **App**: `LIBRARY` sekarang punya `progress` (Laskar 68, Bumi Manusia 84, Panduan 100, Catatan 12, Kancil 0, Kata 30). `openBook(title)` sync `author/progress/page/totalPage` dari koleksi (fix: sebelum Bumi Manusia tetap tampil "Andrea Hirata • 68%").
- **Plugin**: +15 frame key (`15-reader-bumi` … `19-reader-kata` × default/aktif/pengaturan); link Koleksi Buku & dashboard → reader per buku; transisi `smart` default→aktif→pengaturan, `Jeda`→default, `Atur Kecepatan & Jeda`→default, `ON_DRAG` tiap state → dashboard; **`pickHotspot`** sekarang terima tombol full-width (tinggi ≤96px, lebar ≤95% frame) agar klik ikon tengah tombol juga aktif.
- Generator `freeze-books.mjs` + 15 file reader per buku (nav sudah disuntik via `inject-nav.ps1`).

## Status Figma (sebelum user import terakhir)
- 15 frame baru belum di-import ke Figma (user belum sempat import setelah commit terakhir).
- Plugin run pertama sukses: 98 hotspot, SEMUA TERPASANG, 0 error (versi sebelum per-buku).

## Masalah Terakhir & Fix
- **Tombol "Jeda" (JEDA) di reader aktif tidak bisa diklik**: hotspot hanya nempel di teks "JEDA", bukan tombolnya (ikon `||` di tengah → klik tengah miss). Di app tidak ada masalah (event DOM bubble). Fix: perlebar `pickHotspot` (lihat di atas). Verifikasi 13/13 uji mock lolos.
  - **Aksi**: jalankan ulang plugin saja (TIDAK perlu import ulang).

## Langkah Selanjutnya (sesi baru)
1. Import 15 file dari `figma-html/` ke halaman Figma yang sama (nama frame = nama file).
2. Jalankan plugin → cek panel: 32 key `OK`, HOTSPOT tanpa `MISS`, `HOVER A-Z: sudah terpasang`.
3. Test Present: Koleksi Buku → buku apa pun → judul/penulis/progres benar → LANJUTKAN (aktif, judul tetap) → Atur Kecepatan → geser → Library; tombol JEDA klik di bagian mana pun → kembali terjeda.
4. [Opsional] Hover kartu A–Z sudah terpasang di 08-gesture (component set `State=Default`/`State=Hover`, While hovering → Change to, Smart Animate 150ms).

## Masalah & Catatan
- Proposal Lampiran A "Detail buku"/"Onboarding" screen mismatch belum diselesaikan.
- Plugin edit di `figma-plugin/code.js` sengaja **belum di-commit** sebelumnya (tapi sudah termasuk di `d608e20`).
- 8 live behavior test (Playwright) sebelumnya semua PASS (play start/pause, empty-tap pause, tune panel open, profile toggle, lesson cells/options).

## File Penting (app.js)
- `STATE` (L10), `LIBRARY` (L1365), `openBook` (L~1802), `go` (L1696), `renderShot`/`boot`, `bindReaderGestures`/`handleGestureEnd`, `renderReader` (~L398/604), `bindTunePanel` (~L2632), `renderGesture` (~L1100-1194, grid A–Z).
