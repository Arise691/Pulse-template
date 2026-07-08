# PULSE — Creative Studio Landing Page Template

Template landing page bergaya agensi kreatif/studio digital, fokus ke animasi:
parallax scroll, teks kinetik (kata muncul satu-satu), kursor custom, efek
ripple di setiap klik/tap, galeri geser horizontal, counter angka animasi,
dan testimonial otomatis bergilir. Murni HTML, CSS, JavaScript — tanpa
framework, tanpa library animasi eksternal (GSAP dll).

## Struktur

```
pulse/
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
└── assets/icons/
```

## Fitur Animasi yang Disertakan

- **Loading screen** dengan progress bar
- **Scroll progress bar** di bagian atas halaman
- **Kursor custom** dengan efek membesar di atas elemen interaktif (desktop)
- **Ripple/pulse di setiap klik atau tap** — termasuk di HP
- **Teks kinetik** — kata-kata di hero muncul satu per satu
- **Parallax** — bentuk dekoratif di hero bergerak beda kecepatan saat scroll
- **Stagger reveal** — kartu/section muncul berurutan saat discroll
- **Galeri geser horizontal** dengan drag-to-scroll dan indikator titik
- **Counter angka animasi** yang menghitung naik saat terlihat di layar
- **Testimonial otomatis bergilir** dengan indikator titik
- **Marquee/teks berjalan** infinite, berhenti saat di-hover

## Cara Kustomisasi untuk Klien Baru

1. **Nama brand** — ganti "PULSE" di navbar, footer, dan loading screen.
2. **Nomor WhatsApp** — cari-ganti `6285624396423` di `index.html`.
3. **Warna** — ganti 3 variabel utama di `style.css`: `--lime`, `--pink`, `--blue`.
4. **Teks kinetik hero** — edit isi `.kinetic-word` di bagian hero.
5. **Layanan/Karya/Testimoni** — edit isi masing-masing section sesuai kebutuhan.

## Deploy

Sama seperti template lain — upload ke GitHub, aktifkan GitHub Pages di
Settings → Pages, pilih branch `main`, folder root. Semua path di sini
sudah relatif dari awal, tidak perlu penyesuaian tambahan.
