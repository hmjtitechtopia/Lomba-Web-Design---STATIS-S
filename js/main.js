/* ==========================================================================
   main.js — titik masuk tunggal

   index.html hanya memuat berkas ini (type="module"); modul lain diimpor
   dari sini. Tugasnya: penanda bagian aktif di navigasi, lalu memanggil
   modul parallax, hotspot, dan arah angin.

   Penanda bagian memakai IntersectionObserver, bukan pendengar scroll
   tambahan, supaya seluruh halaman tetap punya SATU pendengar scroll —
   yang ada di js/parallax.js.
   ========================================================================== */

import { pasangParallax } from './parallax.js';
import { pasangHotspot } from './hotspot.js';
import { pasangArahAngin } from './arah-angin.js';

/* Menandai tautan navigasi yang bagiannya sedang terlihat dengan
   aria-current="true"; gaya garis bawahnya ada di css/main.css. */
function pasangPenandaBagian() {
  const tautan = [...document.querySelectorAll('.situs-nav a[href^="#"]')];

  if (tautan.length === 0) return;

  /* Peta id bagian → tautan, supaya pencarian saat menggulir murah. */
  const petaTautan = new Map();

  for (const satuTautan of tautan) {
    const id = satuTautan.getAttribute('href').slice(1);
    const bagian = document.getElementById(id);

    if (bagian) petaTautan.set(bagian, satuTautan);
  }

  if (petaTautan.size === 0) return;

  const bagianTerlihat = new Set();

  const bersihkanPenanda = () => {
    for (const satuTautan of petaTautan.values()) satuTautan.removeAttribute('aria-current');
  };

  const pengamat = new IntersectionObserver(
    (daftarEntri) => {
      /* Pengamat hanya melaporkan bagian yang BERUBAH, jadi daftar yang
         sedang terlihat dicatat sendiri di bagianTerlihat. */
      for (const entri of daftarEntri) {
        if (entri.isIntersecting) bagianTerlihat.add(entri.target);
        else bagianTerlihat.delete(entri.target);
      }

      bersihkanPenanda();

      /* Yang ditandai adalah bagian terlihat paling atas. Saat tidak ada
         (misalnya masih di hero), navigasi sengaja tanpa penanda. */
      const teratas = [...bagianTerlihat].sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
      )[0];

      if (teratas) petaTautan.get(teratas)?.setAttribute('aria-current', 'true');
    },
    {
      /* Pita pemicu di sekitar sepertiga atas layar: bagian dianggap aktif
         saat judulnya sudah lewat atas, bukan saat baru menyentuh bawah. */
      rootMargin: '-25% 0px -60% 0px',
    },
  );

  for (const bagian of petaTautan.keys()) pengamat.observe(bagian);
}

/* Tombol menu layar sempit. Figma hanya menggambar keadaan tertutup
   (855:682), jadi keadaan terbuka cukup menampilkan daftar tautan apa
   adanya — tanpa animasi dan tanpa menu melayang. */
function pasangTombolMenu() {
  const tombol = document.querySelector('#tombol-menu');
  const nav = document.querySelector('#situs-nav');

  if (!tombol || !nav) return;

  /* Daftar mulai tertutup; di desktop CSS menampilkannya kembali. */
  nav.hidden = true;

  const setel = (terbuka) => {
    nav.hidden = !terbuka;
    tombol.setAttribute('aria-expanded', String(terbuka));
  };

  tombol.addEventListener('click', () => {
    setel(tombol.getAttribute('aria-expanded') !== 'true');
  });

  /* Memilih satu bagian menutup menu lagi. */
  for (const tautan of nav.querySelectorAll('a')) {
    tautan.addEventListener('click', () => setel(false));
  }

  /* Escape menutup menu dan mengembalikan fokus ke tombolnya. */
  document.addEventListener('keydown', (peristiwa) => {
    if (peristiwa.key !== 'Escape' || nav.hidden) return;

    setel(false);
    tombol.focus();
  });

  /* Ketuk di luar header juga menutup menu. */
  document.addEventListener('click', (peristiwa) => {
    if (nav.hidden) return;
    if (peristiwa.target.closest('.situs-header')) return;

    setel(false);
  });
}

/* Header kini fixed, jadi ia butuh permukaan sendiri begitu pengunjung
   menggulir — tanpa itu tautan melayang di atas isi bagian. Keadaan ini
   dibaca dari penanda 1px di puncak halaman memakai IntersectionObserver,
   bukan pendengar scroll kedua. */
function pasangHeaderTertempel() {
  const header = document.querySelector('.situs-header');
  const penanda = document.querySelector('#penanda-atas');

  if (!header || !penanda) return;

  const pengamat = new IntersectionObserver(([entri]) => {
    header.classList.toggle('situs-header--tertempel', !entri.isIntersecting);
  });

  pengamat.observe(penanda);
}

pasangHeaderTertempel();
pasangTombolMenu();
pasangPenandaBagian();
pasangParallax();
pasangHotspot();
pasangArahAngin();
