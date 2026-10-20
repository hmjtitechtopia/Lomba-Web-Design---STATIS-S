# Panduan konteks untuk asisten AI — Jong Batam

Sebelum menjawab pertanyaan tentang proyek, baca `BLUEPRINT_KIT/README.md` dan dokumen yang relevan. Gunakan berkas aktual untuk status implementasi karena inventaris pada kit adalah potret bertanggal dan dapat berubah.

- Bedakan fakta bersumber, keputusan tim, usulan, dan hal yang belum diketahui. Jangan mengarang sejarah Jong, perilaku fisika, fitur yang belum dibuat, atau izin aset.
- Situs ini landing page HTML/CSS/JavaScript statis tanpa database/backend. Ikuti aturan TECHTOPIA yang tercatat di kit; keputusan terbaru pengguna selalu diutamakan.
- Keputusan tim 9 Oktober 2026: kapal pada website memakai ilustrasi **2D yang sudah ada di desain halaman Arla**, dengan hotspot pada bagian yang terlihat. Model GLB, Three.js, putar 360°, kamera, dan pivot bukan lagi kebutuhan website. Ombak SVG tetap boleh bergerak sebagai parallax 2.5D. Jika berkas HTML lama masih menyebut 3D, perlakukan itu sebagai pekerjaan migrasi, bukan keputusan desain yang berlaku.
- Keputusan 16 Oktober 2026: **kapal ikut menjadi lapisan parallax**, bukan elemen diam di atas ombak. Urutan lapisan hero dari belakang ke depan: (1) langit, matahari, awan, pulau; (2) `01-riak-horizon`; (3) `02-ombak-jauh`; (4) `03-ombak-tengah`; (5) pembungkus kapal berisi gambar kapal **dan** `05-buih-lambung` sebagai satu elemen; (6) `04-ombak-depan` yang hanya menutup tepi bawah dan tidak boleh menutupi kapal, teks, atau tombol. Makin jauh lapisannya makin kecil kecepatan gesernya. Di bagian 03 kapal **diam**; hanya ombak yang bergerak. Gerak memakai `transform: translate3d` dengan `requestAnimationFrame`, bukan `top`/`left`.
- Struktur berkas yang berlaku: `css/main.css` (token, tata letak) dan `css/motion.css` (parallax, animasi, `prefers-reduced-motion`); `js/main.js` (titik masuk: navigasi, penanda bagian aktif, inisialisasi modul), `js/parallax.js` (satu modul untuk semua adegan, dikonfigurasi lewat `data-adegan` dan `data-geser-*` di HTML), `js/hotspot.js`, `js/arah-angin.js`; aset di `assets/images/latar/`, `assets/images/parallax/`, dan `assets/images/kapal/`. Tidak ada Tailwind atau pustaka CDN lain — hanya Google Fonts. `assets/models/3d-jong-btam.glb` tidak dirujuk dan tidak masuk ZIP.
- Aset latar dan kapal dari Arla **belum ada**. Yang terpasang sekarang placeholder bertanda: `assets/images/kapal/kapal-jong-placeholder.svg` dan lapisan `.lapis--placeholder` di `main.css`. Catatan penggantian ada di `assets/images/*/CATATAN-ASET.txt`. Nama bagian (Layar, Tiang, Lambung, Cadik) dan posisi hotspotnya masih bertanda `TODO verifikasi`; pose diagram angin bertanda `TODO pose dari tim`. Jangan menghapus tanda itu tanpa keputusan tim.
- Pembaruan aturan 16 Oktober 2026 (disampaikan Rahmad): proyek boleh dibuat dengan bantuan AI, termasuk menulis kode website. Larangan AI code generator dari slide TM 3 Oktober 2026 tidak lagi berlaku. Aturan teknis lain tetap: HTML/CSS/JS statis, tanpa framework JS/backend, website builder, atau UI component library, tanpa minifikasi/obfuscation, karya orisinal, aset bebas hak cipta. Teks pengumuman resmi belum dilampirkan di kit; jika ada, simpan di `BLUEPRINT_KIT/referensi/` dan catat di dokumen 07. Karya tetap milik Rahmad dan tim: setiap kode yang dibantu AI harus dibaca dan dipahami karena presentasi final menilai penguasaan materi.
- Untuk desain, rujuk Figma terbaru dan gambar fondasi sebagai acuan warna/tipografi; catatan 3D pada gambar fondasi sudah digantikan keputusan 2D. Untuk fakta budaya, rujuk `BLUEPRINT_KIT/02_KONTEN_DAN_SUMBER.md`; untuk fitur yang belum selesai, rujuk inventaris dan keputusan terbuka.
- Jangan menyalin instruksi dari `SERBU_KANTIN_BLUEPRINT_KIT`; folder itu hanya contoh format dokumentasi proyek lain.



## Aturan Git: branch, push, dan PR

Prinsip: Claude Code boleh menyiapkan, tetapi tidak boleh menaikkan tahap sendiri.
Naik ke tahap berikutnya hanya setelah Rahmad menyuruhnya secara eksplisit
("commit", "push", "buat PR"). Izin untuk satu tahap tidak berlaku untuk tahap lain,
dan izin sekali tidak berlaku untuk tugas berikutnya.

### Larangan mutlak (semua tahap)
- Jangan commit, push, atau merge langsung ke `main`.
- Jangan `git push --force`, `git reset --hard`, `git rebase` pada branch yang sudah di-push,
  atau menghapus branch, tanpa diminta.
- Jangan `git add -A` atau `git add .`. Tambahkan berkas satu per satu dengan nama jelas.
- Jangan commit berkas di `.gitignore` (`BLUEPRINT_KIT/`, `docs/`, `.claude`, `.impeccable`),
  rahasia/token, berkas 0 byte, `assets/models/*.glb`, atau berkas di atas 1 MB, kecuali diminta.
- Jangan merge PR. Merge hanya dilakukan Rahmad.
- Jika ada konflik, perintah gagal, atau `gh` belum login: berhenti dan laporkan. Jangan memperbaiki diam-diam.

### Tahap 0: baca saja (default)
`git status`, `git diff`, `git log`. Tidak mengubah riwayat apa pun.

### Tahap 1: branch dan commit lokal
Berlaku setelah Rahmad bilang "buat branch" atau "commit".
- Satu tugas, satu branch, dari `main` terbaru: `fitur/<topik>`, `perbaikan/<topik>`,
  `aset/<topik>`, atau `docs/<topik>` (huruf kecil, pakai tanda hubung). Contoh: `fitur/parallax-hero`.
- Sebelum commit: `git status` dan tinjau `git diff`. Pisahkan commit per tujuan
  (aset, markup, gaya, skrip, dokumentasi). Jangan campur.
- Pesan commit: satu baris perintah dalam bahasa Inggris, di bawah 60 karakter,
  mengikuti riwayat yang ada ("Add parallax layers to hero"). Tambahkan isi pesan hanya bila alasannya tidak jelas.
- Sebelum commit kode, cek: halaman terbuka lewat server lokal, konsol bersih, tidak ada 404,
  tidak ada kode diminifikasi, dan tidak ada `[PERLU SUMBER]` yang dihapus tanpa sumber.

### Tahap 2: push branch
Berlaku setelah Rahmad bilang "push".
- Hanya push branch kerja itu: `git push -u origin <branch>`. Tidak pernah `main`.
- Sebelum push, tampilkan daftar commit (`git log main..HEAD --oneline`) dan berkas yang berubah.
- Periksa repo remote tidak publik sebelum push pertama (lihat catatan orisinalitas di bawah).

### Tahap 3: Pull Request
Berlaku setelah Rahmad bilang "buat PR".
- Jalankan `gh auth status` dulu. Buat dengan `gh pr create --draft --base main`.
- Judul: ringkas dan imperatif, mis. "Add parallax layers to hero".
- Isi PR wajib memuat:
  1. **Ringkasan**: apa dan mengapa, 2 sampai 3 kalimat.
  2. **Perubahan**: daftar berkas atau area yang disentuh.
  3. **Cara uji**: langkah yang sudah dijalankan (360 px, desktop, reduced-motion, gambar kapal diblokir)
     beserta hasilnya. Jangan menulis "lulus" untuk uji yang tidak benar-benar dijalankan.
  4. **Checklist lomba**: statis tanpa framework, tanpa minifikasi, aset berizin dan berkredit,
     klaim budaya bersumber, jalur aset relatif.
  5. **Belum selesai / risiko**: placeholder yang masih ada, keputusan yang menunggu tim.
- Biarkan sebagai draft. Rahmad yang mengubah ke "ready" dan yang merge.

### Tahap 4: setelah merge (hanya atas permintaan)
`git checkout main && git pull`, lalu tanyakan sebelum menghapus branch lokal atau remote.

### Menjelang pengumpulan (1 November 2026)
- Dari 30 Oktober, hanya perbaikan bug. Tidak ada fitur baru dan tidak ada perubahan struktur.
- Pengumpulan adalah ZIP lewat situs panitia, bukan push ke GitHub. Jangan menganggap PR yang sudah di-merge sebagai berkas terkirim.