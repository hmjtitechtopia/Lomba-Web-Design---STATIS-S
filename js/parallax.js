/* ==========================================================================
   parallax.js — gerak lapisan 2.5D

   Satu modul untuk SEMUA adegan parallax di halaman. Adegan ditandai di
   index.html dengan data-adegan, dan tiap lapisan di dalamnya membawa
   faktor kecepatannya sendiri:

     <div data-adegan="hero">
       <div class="lapis" data-geser-y="0.12" data-geser-x="0.02"></div>
       ...
     </div>

   Jadi urutan dan kecepatan lapisan dibaca dari HTML, bukan dari daftar
   tersembunyi di dalam JavaScript. Menambah lapisan = menambah satu baris
   HTML; berkas ini tidak perlu diubah.

   Dua adegan yang dipakai sekarang:
     "hero"   — langit sampai ombak depan, kapal IKUT bergerak.
     "bagian" — bagian 03; hanya lapisan ombak yang diberi data-geser-*,
                kapal sengaja tanpa atribut itu sehingga diam.

   Cara kerjanya: satu pendengar scroll (passive) hanya menaikkan bendera,
   lalu requestAnimationFrame yang menghitung dan menulis. Yang ditulis
   hanya dua custom property, --geser-x dan --geser-y, yang dipakai
   css/motion.css di dalam translate3d. top/left tidak pernah disentuh.
   ========================================================================== */

/* Batas layar sempit harus sama dengan @media (max-width: 599px)
   di css/motion.css, supaya lapisan opsional berhenti dihitung di JS
   dan berhenti digeser di CSS pada titik yang sama. */
const LAYAR_SEMPIT = window.matchMedia('(max-width: 599px)');
const GERAK_DIKURANGI = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Simpangan maksimum sebagai pecahan tinggi adegan. Penjaga supaya lapisan
   dengan faktor besar tidak pernah keluar dari pita yang dipesan main.css. */
const BATAS_SIMPANGAN = 0.5;

let adeganTerdaftar = [];
let adaPermintaanGambar = false;

/* Baca satu adegan dari DOM sekali saja, supaya loop gambar tidak
   memanggil querySelectorAll berulang kali. */
function bacaAdegan(elemenAdegan) {
  const lapisan = [...elemenAdegan.querySelectorAll('[data-geser-y], [data-geser-x]')].map((elemen) => ({
    elemen,
    geserY: Number.parseFloat(elemen.dataset.geserY) || 0,
    geserX: Number.parseFloat(elemen.dataset.geserX) || 0,
    opsional: elemen.dataset.lapisOpsional === 'ya',
  }));

  return { elemen: elemenAdegan, lapisan };
}

/* Posisi adegan terhadap layar, dinormalkan ke -0.5 … 0.5:
   -0.5 = adegan baru muncul dari bawah, 0 = tepat di tengah layar,
   0.5 = adegan sudah keluar di atas. Dipakai sebagai satu-satunya
   masukan gerak, jadi semua lapisan selalu sefase. */
function hitungKemajuan(elemenAdegan) {
  const kotak = elemenAdegan.getBoundingClientRect();
  const tinggiLayar = window.innerHeight;
  const rentang = tinggiLayar + kotak.height;

  if (rentang === 0) return 0;

  const kemajuan = (tinggiLayar - kotak.top) / rentang;

  return Math.min(Math.max(kemajuan, 0), 1) - 0.5;
}

function gambarSemuaAdegan() {
  adaPermintaanGambar = false;

  /* Saat gerak dikurangi, tidak ada yang dihitung sama sekali — bukan hanya
     disembunyikan CSS. Pemeriksaan ada di sini, bukan hanya di pemasangan,
     karena pengguna bisa mengubah pengaturannya saat halaman terbuka. */
  if (GERAK_DIKURANGI.matches) return;

  const layarSempit = LAYAR_SEMPIT.matches;

  for (const adegan of adeganTerdaftar) {
    const kotak = adegan.elemen.getBoundingClientRect();

    /* Adegan yang jauh di luar layar tidak perlu dihitung. */
    if (kotak.bottom < 0 || kotak.top > window.innerHeight) continue;

    const kemajuan = hitungKemajuan(adegan.elemen);

    for (const lapis of adegan.lapisan) {
      /* Di layar sempit, lapisan opsional dibiarkan diam supaya scroll HP
         tetap ringan. CSS juga sudah menetralkan transform-nya. */
      if (layarSempit && lapis.opsional) continue;

      const simpanganMaks = kotak.height * BATAS_SIMPANGAN;
      const geserY = Math.min(Math.max(kemajuan * lapis.geserY * kotak.height, -simpanganMaks), simpanganMaks);
      const geserX = kemajuan * lapis.geserX * kotak.width;

      lapis.elemen.style.setProperty('--geser-y', `${geserY.toFixed(1)}px`);
      lapis.elemen.style.setProperty('--geser-x', `${geserX.toFixed(1)}px`);
    }
  }
}

/* Scroll dan resize hanya menjadwalkan satu gambar per frame. */
function jadwalkanGambar() {
  if (adaPermintaanGambar) return;

  adaPermintaanGambar = true;
  window.requestAnimationFrame(gambarSemuaAdegan);
}

/* Saat gerak dikurangi, semua geseran dikembalikan ke nol supaya
   lapisan berhenti tepat di posisi yang ditentukan main.css. */
function nolkanSemuaGeseran() {
  for (const adegan of adeganTerdaftar) {
    for (const lapis of adegan.lapisan) {
      lapis.elemen.style.setProperty('--geser-y', '0px');
      lapis.elemen.style.setProperty('--geser-x', '0px');
    }
  }
}

export function pasangParallax() {
  const elemenAdegan = document.querySelectorAll('[data-adegan]');

  if (elemenAdegan.length === 0) return;

  adeganTerdaftar = [...elemenAdegan].map(bacaAdegan);

  /* Satu pendengar scroll untuk seluruh halaman. passive: true memberi
     tahu browser bahwa gulir tidak akan dibatalkan di sini. */
  window.addEventListener('scroll', jadwalkanGambar, { passive: true });
  window.addEventListener('resize', jadwalkanGambar, { passive: true });

  /* Hormati pengaturan sistem, termasuk bila diubah saat halaman terbuka. */
  const terapkanPengaturanGerak = () => {
    if (GERAK_DIKURANGI.matches) {
      nolkanSemuaGeseran();
      return;
    }

    jadwalkanGambar();
  };

  GERAK_DIKURANGI.addEventListener('change', terapkanPengaturanGerak);
  LAYAR_SEMPIT.addEventListener('change', terapkanPengaturanGerak);

  terapkanPengaturanGerak();
}
