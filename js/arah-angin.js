/* ==========================================================================
   arah-angin.js — bagian 05 "Coba Arah Angin"

   Tiga pilihan: depan, samping, belakang. Satu tombol aktif, satu sudut
   panah, satu pose diagram, dan satu kalimat penjelasan — semuanya digambar
   dari satu variabel arahAktif, jadi tidak bisa saling tertinggal.

   Batas yang disepakati tim (dokumen 01 dan 03): tidak ada angka kecepatan,
   durasi, atau klaim hasil simulasi fisika. Kalimat di bawah hanya
   menjelaskan ARAH datangnya angin terhadap arah hadap Jong — hal yang
   memang terlihat pada diagram.
   ========================================================================== */

/* gerak = teks Label/Gerak di atas panggung (Figma 855:507).

   TODO pose dari tim: Figma hanya menggambar SATU keadaan panggung, yaitu
   "Samping" (855:395). Ilustrasi untuk "depan" dan "belakang" belum ada,
   jadi gambar panggung tidak berubah saat pilihan berganti — yang berubah
   label, judul, dan penjelasan. Lihat dokumen 07, baris "Posisi layar
   untuk tiga arah angin". */
const DAFTAR_ARAH = [
  {
    kunci: 'depan',
    gerak: 'Tertahan di depan',
    judul: 'Angin dari depan',
    isi: 'Angin datang dari arah haluan, berlawanan dengan arah hadap Jong.',
  },
  {
    kunci: 'samping',
    gerak: 'Lurus ke depan',
    judul: 'Angin dari samping',
    isi: 'Angin datang dari samping lambung, menyilang arah hadap Jong.',
  },
  {
    kunci: 'belakang',
    gerak: 'Terdorong maju',
    judul: 'Angin dari belakang',
    isi: 'Angin datang dari arah belakang, searah dengan arah hadap Jong.',
  },
];

/* Keadaan awal, juga dipakai tombol "Coba arah lain". */
const KEADAAN_AWAL = {
  judul: 'Belum ada arah yang dipilih',
  isi: 'Pilih salah satu arah di atas untuk melihat penjelasannya.',
};

export function pasangArahAngin() {
  const judul = document.querySelector('#angin-judul');
  const isi = document.querySelector('#angin-isi');

  if (!judul || !isi) return;

  const labelGerak = document.querySelector('#angin-label-gerak');
  const semuaTombol = [...document.querySelectorAll('.tombol--pilihan[data-angin]')];
  const tombolUlang = document.querySelector('#angin-ulang');

  /* null = belum memilih apa pun. */
  let arahAktif = null;

  function gambar() {
    for (const tombol of semuaTombol) {
      tombol.setAttribute('aria-pressed', String(arahAktif !== null && tombol.dataset.angin === arahAktif.kunci));
    }

    /* Label gerak ikut pilihan; saat belum memilih dipakai teks keadaan
       yang digambar Figma ("Lurus ke depan"). */
    if (labelGerak) {
      labelGerak.textContent = arahAktif ? arahAktif.gerak : 'Lurus ke depan';
    }

    judul.textContent = arahAktif ? arahAktif.judul : KEADAAN_AWAL.judul;
    isi.textContent = arahAktif ? arahAktif.isi : KEADAAN_AWAL.isi;
  }

  for (const tombol of semuaTombol) {
    tombol.addEventListener('click', () => {
      arahAktif = DAFTAR_ARAH.find((arah) => arah.kunci === tombol.dataset.angin) ?? null;
      gambar();
    });
  }

  /* "Coba arah lain" mengosongkan pilihan dan memindahkan fokus ke tombol
     pertama, supaya pengguna keyboard langsung bisa memilih lagi. */
  if (tombolUlang) {
    tombolUlang.addEventListener('click', () => {
      arahAktif = null;
      gambar();
      semuaTombol[0]?.focus();
    });
  }

  gambar();
}
