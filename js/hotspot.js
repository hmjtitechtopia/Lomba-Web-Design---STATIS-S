/* ==========================================================================
   hotspot.js — bagian 03 "Bagian Perahu"

   Satu sumber kebenaran: variabel bagianAktif. Chip, titik hotspot, dan
   kartu penjelasan semuanya menggambar ulang dari nilai itu, sehingga tidak
   mungkin ada dua pilihan aktif sekaligus.

   Titik hotspot TIDAK diposisikan di berkas ini. Posisinya ditulis sebagai
   persen (--x / --y) pada tiap tombol di index.html, relatif terhadap
   .kapal-bungkus yang mengikuti gambar kapal. Dengan begitu titik tetap
   menempel walau kapal digeser atau diskalakan, dan berkas ini hanya
   mengurus keadaan pilihan.
   ========================================================================== */

/* TODO verifikasi: nama DAN penjelasan keempat bagian ini belum diperiksa
   terhadap ilustrasi 2D Arla maupun sumber di BLUEPRINT_KIT/02. Dokumen 02
   mencatat istilah "cadik" sebagai belum didukung sumber, dan dokumen 07
   masih membuka baris "Nama dan posisi hotspot". Penjelasan di bawah
   bersifat fungsional dan umum, bukan klaim budaya. Jangan menambah
   bagian baru sebelum tim menandainya pada ilustrasi. */
const DAFTAR_BAGIAN = [
  { kunci: 'layar',   nama: 'Layar',   isi: 'Menangkap tiupan angin dan mengubahnya menjadi dorongan.' },
  { kunci: 'tiang',   nama: 'Tiang',   isi: 'Menopang layar supaya tetap berdiri menghadap angin.' },
  { kunci: 'lambung', nama: 'Lambung', isi: 'Badan perahu yang mengapung dan menjaga arahnya di air.' },
  { kunci: 'cadik',   nama: 'Cadik',   isi: 'Penyeimbang di samping lambung agar perahu tidak mudah terbalik.' },
];

function cariIndeks(kunci) {
  const indeks = DAFTAR_BAGIAN.findIndex((bagian) => bagian.kunci === kunci);

  return indeks === -1 ? 0 : indeks;
}

export function pasangHotspot() {
  const kartu = document.querySelector('#kartu-bagian');
  const bungkus = document.querySelector('#kapal-bungkus');

  if (!kartu || !bungkus) return;

  const gambarKapal = document.querySelector('#kapal-gambar');
  const daftarHotspot = document.querySelector('#hotspot-daftar');
  const semuaChip = [...document.querySelectorAll('.chip[data-bagian]')];
  const semuaHotspot = [...document.querySelectorAll('.hotspot[data-bagian]')];

  const kartuIndeks = document.querySelector('#kartu-indeks');
  const kartuJudul = document.querySelector('#kartu-judul');
  const kartuIsi = document.querySelector('#kartu-isi');
  const tombolBerikutnya = document.querySelector('#kartu-berikutnya');
  const tombolSebelumnya = document.querySelector('#kartu-sebelumnya');
  const namaBerikutnya = document.querySelector('#kartu-berikutnya-nama');

  let indeksAktif = 0;

  /* Gambar ulang seluruh keadaan dari indeksAktif. */
  function gambar({ pindahkanFokus = false } = {}) {
    const aktif = DAFTAR_BAGIAN[indeksAktif];
    const berikutnya = DAFTAR_BAGIAN[(indeksAktif + 1) % DAFTAR_BAGIAN.length];

    for (const chip of semuaChip) {
      chip.setAttribute('aria-pressed', String(chip.dataset.bagian === aktif.kunci));
    }

    /* aria-expanded dipakai karena hotspot membuka/menutup kartu
       penjelasan; hanya satu yang boleh true. */
    for (const hotspot of semuaHotspot) {
      hotspot.setAttribute('aria-expanded', String(hotspot.dataset.bagian === aktif.kunci));
    }

    /* Bagian yang aktif ditandai di kartu dan di pembungkus kapal: CSS
       memakainya untuk menyembunyikan label titik yang sedang aktif dan
       untuk menampilkan penghubung kartu–hotspot (hanya keadaan Layar,
       satu-satunya yang digambar Figma). */
    kartu.setAttribute('data-bagian-aktif', aktif.kunci);
    bungkus.setAttribute('data-bagian-aktif', aktif.kunci);

    kartuIndeks.textContent = String(indeksAktif + 1);
    kartuJudul.textContent = aktif.nama;
    kartuIsi.textContent = aktif.isi;
    namaBerikutnya.textContent = berikutnya.nama;

    /* Pemicu animasi kedip singkat di motion.css. Atribut dilepas pada
       frame berikutnya supaya animasinya bisa jalan lagi nanti. */
    kartu.setAttribute('data-berganti', 'ya');
    window.requestAnimationFrame(() => kartu.removeAttribute('data-berganti'));

    /* Setelah tombol "Berikutnya" ditekan, fokus pindah ke kartu agar
       pembaca layar membacakan isi barunya. */
    if (pindahkanFokus) kartu.focus();
  }

  function pilih(kunci, opsi) {
    indeksAktif = cariIndeks(kunci);
    gambar(opsi);
  }

  for (const chip of semuaChip) {
    chip.addEventListener('click', () => pilih(chip.dataset.bagian));
  }

  for (const hotspot of semuaHotspot) {
    hotspot.addEventListener('click', () => pilih(hotspot.dataset.bagian));
  }

  tombolBerikutnya.addEventListener('click', () => {
    indeksAktif = (indeksAktif + 1) % DAFTAR_BAGIAN.length;
    gambar({ pindahkanFokus: true });
  });

  /* "Sebelumnya" hanya digambar pada sheet mobile, tetapi tetap dipasang
     di sini supaya keduanya bekerja dengan keadaan yang sama. */
  if (tombolSebelumnya) {
    tombolSebelumnya.addEventListener('click', () => {
      indeksAktif = (indeksAktif - 1 + DAFTAR_BAGIAN.length) % DAFTAR_BAGIAN.length;
      gambar({ pindahkanFokus: true });
    });
  }

  /* Kartu perlu bisa menerima fokus terprogram tanpa masuk urutan Tab. */
  kartu.setAttribute('tabindex', '-1');

  /* Titik hotspot baru ditampilkan setelah gambar kapal benar-benar ada.
     Kalau gambar gagal, titiknya tetap tersembunyi supaya tidak ada titik
     mengambang tanpa kapal; chip dan kartu tetap dipakai seperti biasa
     (dokumen 03, "Kondisi awal, memuat, dan gagal"). */
  function tampilkanHotspot() {
    daftarHotspot.hidden = false;
    bungkus.classList.remove('kapal-bungkus--gagal');
  }

  function sembunyikanHotspot() {
    daftarHotspot.hidden = true;
    bungkus.classList.add('kapal-bungkus--gagal');
  }

  if (!gambarKapal) {
    sembunyikanHotspot();
  } else if (gambarKapal.complete) {
    /* naturalWidth 0 pada gambar yang sudah "complete" berarti gagal. */
    if (gambarKapal.naturalWidth > 0) tampilkanHotspot();
    else sembunyikanHotspot();
  } else {
    gambarKapal.addEventListener('load', tampilkanHotspot, { once: true });
    gambarKapal.addEventListener('error', sembunyikanHotspot, { once: true });
  }

  gambar();
}
