# Braille Haptic — Prototipe Pembaca Buku Digital Haptic Braille

Prototipe demo aplikasi pembaca buku digital berbasis **haptic braille** untuk penyandang **deafblind** (tuli-buta).

> ⚠️ **Status: Prototipe / Demo.** Ini bukan aplikasi produksi. Pemetaan braille masih subset umum, bukan UEB lengkap.

---

## Apa ini?

Sebuah prototipe antarmuka yang mengeksplorasi bagaimana penyandang deafblind dapat membaca buku digital melalui **pola getaran (haptic)** yang merepresentasikan sel braille 6-titik.

Prototipe ini dibangun dari desain Figma, dikonversi menjadi kode HTML + Tailwind CSS dengan fokus pada **aksesibilitas WCAG AA**.

## Demo

- **Live demo:** aktifkan GitHub Pages (lihat bagian [Deploy](#deploy-ke-github-pages))
- **Jalankan lokal:** buka `index.html` di browser, atau:
  ```bash
  # Python
  python -m http.server 8000
  # lalu buka http://localhost:8000
  ```

> 💡 **Getaran** hanya berfungsi di **Android (Chrome/Firefox)** melalui Web Vibration API.
> Di iOS Safari & desktop, otomatis beralih ke **simulasi visual**.

## Fitur

### 5 Layar
| Layar | Isi |
|-------|-----|
| **Home / Onboarding** | Profil pengguna, menu utama, toggle Mode Aksesibilitas |
| **Dashboard** | Kartu "Sedang Dibaca", progres, menu cepat, buku terakhir, tip tactile |
| **Reader** | Kalimat sumber, **sel braille 6-titik beranimasi**, kontrol pemutaran, panel penyelarasan haptic |
| **Latihan Braille** | Ring progres, statistik, kuis haptic, kurikulum modul |
| **Peta Gestur Haptic** | Grid 6 titik interaktif + contoh pola huruf |

### Aksesibilitas
- **Kontras WCAG AA terverifikasi** — semua pasangan warna utama diuji ≥4.5:1
  (desain Figma asli memiliki beberapa pelanggaran kontras yang dikoreksi di sini)
- **Font [Atkinson Hyperlegible](https://brailleinstitute.org/freefont)** — dirancang untuk keterbacaan low-vision
- **ARIA lengkap** — `role="switch"`, `role="progressbar"`, `aria-live`, `aria-pressed`, label ikon
- **Fokus keyboard** jelas (3px outline, WCAG 2.4.11)
- **`prefers-reduced-motion`** dihormati — semua animasi berhenti
- **Touch target ≥44px**
- **Warna bukan satu-satunya indikator** (selalu ada teks pendamping)
- **Mode Fokus** — menyembunyikan dekorasi, memperbesar teks

### Mikro-interaksi
- Animasi masuk layar (stagger)
- **Tick braille visual** — tiap titik aktif "mengetuk" berurutan, sinkron dengan getaran
- Hover lift & press feedback pada tombol
- Indikator nav aktif

## Teknologi

- **HTML + JavaScript vanilla** (tanpa build step)
- **[Tailwind CSS](https://tailwindcss.com)** via CDN
- **[Web Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API)** untuk simulasi haptic
- **Font Google:** Atkinson Hyperlegible + Inter

Tanpa dependensi, tanpa `npm install`, tanpa framework. Cukup buka di browser.

## Struktur

```
.
├── index.html   # Struktur, konfigurasi Tailwind, design token, mesin haptic dasar
├── app.js       # Data layar, render, router, event binding
└── README.md
```

## Alur Aplikasi

1. **Splash** — logo + animasi titik braille menyala berurutan (disertai haptic)
2. **Login** — layar masuk untuk pendamping/fasilitator
3. **Home** — profil pengguna + menu utama
4. **Dashboard** — kartu buku, menu cepat, buku terakhir
5. **Reader** — tampilan braille imersif dengan kontrol gestur
6. **Latihan Braille** — modul & kuis
7. **Peta Gestur** — pola huruf A–Z

### Catatan tentang Login (Demo)

Pada prototipe ini, halaman login **tidak terhubung ke backend apa pun** — isi email
dan password apa saja, lalu tekan Masuk untuk melanjutkan. Ini murni untuk
menampilkan alur UI.

**Rencana pengembangan autentikasi:**

- Login diperuntukkan bagi **pendamping/fasilitator** yang mendampingi pengguna.
- Untuk **pengguna deafblind**, hindari autentikasi berbasis mengetik password
  (sulit diakses). Gunakan **passkey / biometrik / kode sentuh** sesuai
  pedoman WCAG 2.2 *Accessible Authentication* — jangan memaksa tes kognitif.
- Autentikasi produksi memerlukan backend (misalnya Supabase/Firebase atau server sendiri).

## Cara Kerja Mesin Haptic

Setiap karakter Latin dipetakan ke kumpulan titik braille (1–6). Contoh:

```
A = titik 1        K = titik 1, 3
B = titik 1, 2     L = titik 1, 2, 3
```

Pola getaran dibangun dari titik-titik aktif ini, lalu diputar via `navigator.vibrate()`.

```js
// Lihat objek HAPTIC di index.html
HAPTIC.buzzChar('k');        // getarkan satu karakter
await HAPTIC.buzzText('kaba'); // putar seluruh kata berurutan
```

## Catatan Desain

Ini adalah aplikasi untuk penyandang **deafblind**, artinya:

1. **Antarmuka sesungguhnya adalah haptic**, bukan layar. Lapisan visual di sini
   berfungsi sebagai pengelola/instruktur atau untuk pengguna low-vision — bukan UI utama
   bagi pengguna deafblind total.
2. Pemetaan braille di prototipe ini adalah **subset umum**, bukan standar UEB lengkap.
3. Uji coba dengan deafblind user asli sangat disarankan sebelum pengembangan lanjut.

## Deploy ke GitHub Pages

1. Push repo ini ke GitHub
2. Buka **Settings → Pages**
3. Source: **Deploy from a branch** → Branch: **main** → Folder: **/ (root)**
4. Simpan → tunggu 1–2 menit
5. Demo tersedia di `https://<username>.github.io/<repo>/`

File `.nojekyll` sudah disertakan agar Pages tidak memproses file dengan Jekyll.

## Lisensi

Belum ditentukan.
