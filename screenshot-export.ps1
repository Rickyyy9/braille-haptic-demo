# =============================================================================
# screenshot-export.ps1
# Ambil screenshot setiap layar Braille Haptic via Chrome headless.
# Hasil: figma-export/*.png  (siap drag-drop ke Figma)
#
# Cara pakai:
#   1. Jalankan server dulu:  python -m http.server 8080  (di folder project)
#   2. Jalankan script ini:   powershell -ExecutionPolicy Bypass -File .\screenshot-export.ps1
# =============================================================================

param(
  [string]$BaseUrl = "http://127.0.0.1:8080",
  [int]$Width = 360,
  [int]$Height = 680,      # ukuran frame HP (konsisten dengan kartu di app)
  [int]$Scale = 2,         # 2 = retina, hasil lebih tajam di Figma
  [switch]$FullPage        # screenshot seluruh tinggi halaman
)

$ErrorActionPreference = "Stop"

# Lokasi Chrome (dicari otomatis)
$chrome = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $chrome) { throw "Chrome tidak ditemukan. Install Chrome atau sesuaikan path di script." }

# Folder output
$outDir = Join-Path $PSScriptRoot "figma-export"
if (!(Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

# Daftar layar (urut)
$screens = @(
  "splash","login","signup","home","dashboard","reader","practice",
  "gesture","contacts","companion","upload","profile","test","lesson"
)

Write-Host "Chrome : $chrome"
Write-Host "Output : $outDir"
Write-Host "Viewport: ${Width}x${Height} @${Scale}x"
Write-Host ""

# Profil sementara agar Chrome headless bersih
$tmpProfile = Join-Path $env:TEMP ("bh-chrome-" + [guid]::NewGuid().ToString("N").Substring(0,8))

$i = 0
foreach ($s in $screens) {
  $i++
  $num = "{0:D2}" -f $i
  $file = Join-Path $outDir ("{0}-{1}.png" -f $num, $s)
  $url = "$BaseUrl/?shot=1#$s"

  Write-Host ("  [{0}/{1}] {2}" -f $i, $screens.Count, $s)

  $args = @(
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=$Scale",
    "--window-size=${Width},${Height}",
    "--user-data-dir=$tmpProfile",
    "--screenshot=$file",
    # beri waktu JS render (splash auto-pindah dsb.)
    "--virtual-time-budget=3500",
    $url
  )

  & $chrome @args | Out-Null
}

# Bersihkan profil sementara
Remove-Item -LiteralPath $tmpProfile -Recurse -Force -ErrorAction SilentlyContinue

$count = (Get-ChildItem -LiteralPath $outDir -Filter "*.png").Count
Write-Host ""
Write-Host "Selesai. $count file PNG tersimpan di:"
Write-Host "  $outDir"
Write-Host ""
Write-Host "Langkah selanjutnya: buka Figma, lalu drag-drop semua file PNG dari folder di atas."
