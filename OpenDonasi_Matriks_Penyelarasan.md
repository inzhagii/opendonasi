# OpenDonasi — Matriks Penyelarasan Produk, Dokumen, dan Implementasi

**Versi:** 1.0  
**Tanggal:** 19 Oktober 2026  
**Status:** Draft audit untuk review Product Owner — *belum menjadi izin mengubah kode*  
**Basis proyek:** ZIP terbaru `opendonasi2.zip`  
**Acuan produk:** `OPENDONASI_SPEC.md`, `DESIGN_SYSTEM.md`, `GEMINI.md`, `OPENDONASI_IMPLEMENTATION_PLAN.md`, dan keputusan Product Owner dalam percakapan.

## 0. Tujuan dan aturan kerja

Dokumen ini menyelaraskan rencana awal dengan kode aktual supaya pengembangan tidak melenceng. ZIP terbaru adalah sumber fakta untuk kondisi kode; dokumen produk adalah sumber kebutuhan; keputusan terbaru Product Owner mengatasi preferensi visual yang belum eksplisit di dokumen.

### Aturan yang tidak boleh dilanggar

1. **Jangan redesign Homepage.** Tampilan Homepage dalam ZIP terbaru diperlakukan sebagai baseline visual yang dilindungi. Perubahan UI hanya boleh dilakukan jika memang diperlukan, dijelaskan dampaknya, dan disetujui Product Owner.
2. **Pisahkan perubahan visual dan perilaku.** Perbaikan carousel/filter/modal/tautan tidak otomatis memberi izin untuk mengganti layout, aset, warna, tipografi, radius, atau proporsi kartu.
3. **Jangan mengubah stack atau menambah dependensi tanpa alasan dan persetujuan.** Pertahankan React + Vite, React Router, dan Tailwind yang sudah ada, kecuali audit membuktikan ada hambatan.
4. **Satu sumber data.** Kampanye yang sama harus memiliki nilai dan identitas konsisten di Beranda, katalog, pencarian, detail, layanan, dan riwayat.
5. **Prototype saja.** Tidak ada backend, autentikasi nyata, payment gateway, atau transaksi uang sungguhan. Setiap alur yang disimulasikan harus diberi penanda yang jelas.
6. **Tidak mengarang isi/angka.** Konten, jumlah donatur, nominal, update program, dan testimoni harus bersumber dari data dummy yang memang disediakan atau ditandai jelas sebagai data demo.
7. **Audit sebelum implementasi.** Jika dokumen bertentangan atau ada keputusan produk yang belum jelas, tandai dan minta persetujuan; jangan menebak.
8. **Tidak menghapus aset atau melakukan konversi massal tanpa verifikasi dan persetujuan.** Ekstensi file tidak selalu mencerminkan format binernya.
9. **Satu fase satu persetujuan.** Laporan implementer, lint/build, dan screenshot bukan pengganti review Product Owner.
10. **Standar UI anti-template generik tetap berlaku.** Tidak menggunakan gradient ungu-biru dekoratif, glow, glassmorphism, ikon emoji, bayangan berlebihan, card-soup, animasi tak perlu, atau statistik palsu.

## 1. Ringkasan kondisi proyek terbaru

| Area | Bukti pada ZIP terbaru | Status awal | Tindakan penyelarasan |
|---|---|---|---|
| Stack | `package.json`, React/Vite, React Router, Tailwind | Fondasi sudah ada | Pertahankan; jangan migrasi tanpa kebutuhan terbukti |
| Beranda | `src/features/home/HomePage.jsx` menggabungkan tujuh seksi terpisah | UI sudah diimplementasikan; perilaku perlu dicocokkan | Ambil screenshot baseline dan audit interaksi satu per satu |
| Route | `src/app/routes.jsx` mendefinisikan 16 route produk dan wildcard 404 | Route ada, tetapi 15 route non-home masih memakai `RoutePlaceholder` | Ganti placeholder bertahap berdasarkan spesifikasi, bukan sekaligus |
| Komponen bersama | Header, MobileBottomNav, Footer, RootLayout, Button, Container, SectionHeading, Badge, Input, ProgressBar, CampaignCard | Fondasi komponen ada | Audit API, penggunaan, aksesibilitas, dan konsistensi sebelum refactor |
| Data | `src/data/campaigns.js`, `content.js`, `userHistory.js` | Data terpusat sebagian | Petakan semua entitas/relasi; cegah duplikasi dan fallback berbasis indeks yang rapuh |
| State donasi | `DonationContext.jsx`, `donationContextInstance.js`, `useDonation.js` | State lokal tersedia | Verifikasi submit, refresh, konfirmasi, riwayat, dan tidak mengubah agregat kampanye |
| Dokumen | Empat dokumen acuan dan README ada di root proyek | Ada, tetapi perlu dicek terhadap kode terbaru | Perbarui setelah matriks dan keputusan disepakati; jangan menimpa detail lama tanpa review |
| QA | Script `lint` dan `build` ada | Perlu dijalankan di workspace terbaru | Catat hasil nyata, lalu browser test desktop/mobile dan interaksi |
| Version control | Status `.git` tidak disimpulkan dari daftar ZIP saja | Belum diverifikasi | Periksa workspace aktif; jangan menginisialisasi/mengubah Git tanpa izin |

## 2. Matriks penyelarasan 16 halaman

Status yang digunakan:
- **Ada sebagai halaman nyata:** implementasi khusus halaman tersedia.
- **Kerangka/placeholder:** route ada, tetapi konten utamanya masih komponen pengujian.
- **Perlu audit browser:** fungsi/visual harus diuji langsung; belum dianggap lolos hanya karena ada kode.
- **Belum diverifikasi:** perlu inspeksi lebih lanjut.

| # | Halaman dan route rencana | Kondisi aktual pada ZIP | Kesenjangan terhadap rencana awal | Target penyelarasan dan kriteria penerimaan |
|---:|---|---|---|---|
| 1 | **Beranda** `/` | `HomePage.jsx` dan tujuh komponen khusus sudah ada | UI dinilai pengguna hampir sesuai; perilaku beberapa komponen belum selaras | Pertahankan tampilan. Hero: rasio/banner utuh, autoplay sekitar 6 detik, indikator, swipe/drag, jeda setelah interaksi sesuai spesifikasi. Unggulan: geser manual kanan/kiri, tanpa autoplay, panah desktop, swipe mobile. Poster/banner tidak berubah menjadi kumpulan kartu generik. Kategori mengubah grid. Aamiin toggle lokal (+1/-1 per sesi) dan tidak mengubah agregat kampanye. CTA/tautan bekerja. Tidak ada horizontal overflow. Screenshot sebelum/sesudah harus sebanding. |
| 2 | **Daftar Program** `/program` | Route menggunakan `RoutePlaceholder`; ada showcase `CampaignCard`, bukan katalog final | Belum ada halaman katalog sesuai spesifikasi | Buat katalog dari sumber data kampanye yang sama; kategori, filter target/sisa hari, sort (terbaru, mendesak, dana terbanyak), load more, empty state dan reset. Klik kartu ke detail yang tepat. |
| 3 | **Detail Program** `/program/:slug` | `RoutePlaceholder`; slug divalidasi untuk demo, bukan detail produk | Narasi, update, donatur, sidebar, share, sticky CTA belum diwujudkan sebagai halaman | Detail dari slug data pusat; progress/nominal konsisten; deskripsi expand/collapse; share Web Share/fallback copy; sidebar sticky desktop; sticky CTA mobile hanya setelah CTA utama terlewat; slug tidak valid menampilkan 404 spesifik. |
| 4 | **Landing Zakat** `/zakat` | `RoutePlaceholder` | Edukasi, program zakat, dan kalkulator belum menjadi halaman fungsional | Banner tampil utuh; hanya kampanye `serviceType=zakat`; kalkulator input reaktif dan tervalidasi, aturan nisab dan 2,5% mengikuti spesifikasi yang disetujui; label simulasi; lanjutkan nominal ke form donasi. |
| 5 | **Detail Zakat** `/zakat/:slug` | `RoutePlaceholder` | Detail khusus zakat dan mini kalkulator belum ada | Validasi slug dan tipe zakat; CTA “Zakat Sekarang”; mini kalkulator mengisi nominal form; parameter konteks zakat terbawa. Invalid slug menghasilkan error state yang jelas. |
| 6 | **Landing Infaq** `/infaq` | `RoutePlaceholder` | Halaman layanan belum dibuat | Intro dan banner; hanya program infaq; tidak menampilkan kalkulator zakat; gunakan CampaignCard bersama; empty state yang layak. |
| 7 | **Landing Sedekah** `/sedekah` | `RoutePlaceholder` | Halaman layanan belum dibuat | Konten dan program sedekah; struktur sekeluarga dengan Infaq; filter relevan; tanpa kalkulator zakat. |
| 8 | **Landing Wakaf** `/wakaf` | `RoutePlaceholder` | Halaman layanan dan poster wakaf belum dibuat | Konten wakaf dan program relevan; banner/poster yang mengandung teks tampil utuh tanpa crop; gunakan data pusat. |
| 9 | **Form Donasi** `/donasi/:slug` | `RoutePlaceholder`; `DonationContext` tersedia | Form transaksi belum diwujudkan | Nominal preset dan custom; validasi input; identitas dan opsi anonim; doa dukungan; metode pembayaran demo; ringkasan dan biaya Rp0; parameter nominal dari kalkulator; penanda simulasi. Submit valid mencatat satu transaksi demo dan tidak mengubah total kampanye. |
| 10 | **Hasil Simulasi Donasi** `/hasil-donasi` | `RoutePlaceholder` | Ringkasan hasil dan status transaksi belum dibuat | Tampilkan referensi demo dan status yang konsisten dengan alur (mis. menunggu pembayaran atau skenario berhasil); jangan menyatakan uang sungguhan telah diproses; data harus berasal dari transaksi yang baru dibuat, bukan nilai hardcoded. |
| 11 | **Tentang Kami** `/tentang` | `RoutePlaceholder` | Konten profil platform belum dibuat | Halaman informasi sesuai spesifikasi dan identitas OpenDonasi; tidak mengarang klaim organisasi/angka/mitra. |
| 12 | **FAQ/Pusat Bantuan** `/faq` | `RoutePlaceholder` | Pencarian FAQ dan accordion belum dibuat | Pertanyaan dari data konten yang disetujui; pencarian memfilter; accordion dapat dioperasikan keyboard; empty state saat tidak ada hasil. |
| 13 | **Kontak Bantuan** `/kontak` | `RoutePlaceholder` | Informasi kontak dan aksi bantuan belum dibuat | Saluran demo diberi label yang jujur; jangan membuat nomor/akun kontak seolah-olah nyata. Tautan hanya memakai data yang disediakan atau placeholder yang eksplisit. |
| 14 | **Donasi Saya** `/donasi-saya` | `RoutePlaceholder`; state sesi donasi ada | Riwayat belum terhubung ke UI | Baca dari sumber state donasi lokal yang sama; empty state jika belum ada; nominal, status, waktu, dan referensi konsisten; jelaskan bahwa riwayat hanya demo/sesi lokal. |
| 15 | **Profil/Akun** `/profil` | `RoutePlaceholder` | Halaman profil demo belum dibuat | Profil sederhana, tanpa mengklaim autentikasi nyata; tautan ke Donasi Saya; jika sesi kosong, tampilkan keadaan yang tepat. |
| 16 | **Hasil Pencarian** `/search?q=...` | `RoutePlaceholder`; hitung hasil judul secara sederhana untuk showcase | Belum ada hasil pencarian yang sesungguhnya | Ambil query dari URL; cari pada field yang ditentukan spesifikasi; hasil klik ke detail yang benar; empty state dan reset/ubah query; pertahankan query saat navigasi jika relevan. |
| — | **404 wildcard** `*` | Mengarah ke `RoutePlaceholder` | Placeholder pengujian, bukan halaman 404 produk | Buat ErrorState 404 dengan pesan dan jalan kembali; tidak menampilkan showcase komponen atau menyamar sebagai halaman yang valid. |

## 3. Pemetaan Homepage: baseline visual dan interaksi

| Seksi | Komponen aktual | Perilaku yang direncanakan | Batas perubahan |
|---|---|---|---|
| Hero | `HeroCarousel` | Autoplay ~6 detik; indikator; swipe/drag; tanpa panah jika mengikuti spec; jeda setelah interaksi manual | Jangan ganti gambar, komposisi, crop, ukuran, atau layout tanpa persetujuan |
| Akses cepat | `QuickServiceBar` | Lima pilihan: Donasi, Zakat, Infaq, Sedekah, Wakaf; tiap tautan menuju route benar | Pertahankan tampilan dan aset yang dipakai; pemetaan ikon yang belum jelas ditandai untuk keputusan, bukan ditebak |
| Program unggulan | `FeaturedCampaignCarousel` | Manual only; swipe/drag; tombol panah desktop; kartu berikutnya tampak sebagian jika demikian di UI baseline | Fokus pada navigasi carousel; jangan redesign kartu, spacing, atau jumlah kartu terlihat tanpa persetujuan |
| Yang Baru | `PosterCarousel` | Banner/poster berperilaku seperti banner sesuai desain yang ada | Jangan ubah menjadi grid/kumpulan CampaignCard; validasi pemetaan slug poster ke kampanye |
| Kategori dan grid | `CategoryProgramSection` | Pemilihan kategori mengubah daftar; grid desktop 3 kolom dan 2 baris awal sesuai spec; mobile kartu horizontal jika demikian di acuan | Pertahankan visual baseline; perbaiki state filter/empty state dan tautan |
| Doa dan dukungan | `PrayerCarousel` | Navigasi doa; Aamiin toggle lokal; modal detail jika ditentukan spec | Jangan mengubah total dana/jumlah donatur kampanye; jangan menampilkan angka palsu |
| CTA penutup | `ClosingCta` | CTA menuju halaman/aksi yang benar | Pertahankan desain; perbaiki tujuan tautan jika salah |
| Layout bersama | `Header`, `MobileBottomNav`, `Footer`, `RootLayout` | Navigasi konsisten desktop/mobile | Jangan sampai menu mobile bocor ke desktop, menutup konten, atau menambah duplikasi header/footer |

## 4. Matriks lintas fitur dan integritas data

| Area | Ketentuan dari rencana | Pemeriksaan yang diperlukan | Kriteria lulus |
|---|---|---|---|
| Sumber data | Satu sumber data mock untuk kampanye, kategori, layanan, banner, doa, FAQ, dan update terkait | Audit `campaigns.js`, `content.js`, `userHistory.js`, context dan pemakaian tiap komponen | Kampanye dengan ID/slug sama punya judul, penggalang, target, terkumpul, progres, dan sisa hari yang konsisten di semua halaman |
| Slug dan route | Semua link harus menuju entitas yang benar | Cocokkan semua href/Link dengan dataset dan daftar route | Tidak ada slug hardcoded yang salah; invalid slug ditangani sebagai 404; tidak fallback diam-diam ke kampanye lain |
| Nominal/progres | Data nominal dan progress terlihat tanpa hover | Periksa formatter, progress, batas target dan nilai data | Persentase sesuai aturan perhitungan yang disepakati; angka tidak saling bertentangan |
| Donasi demo | Tidak ada pembayaran nyata | Audit `DonationContext`, `useDonation`, form, hasil, riwayat | Submit valid tercatat sekali; refresh tidak menggandakan; tidak mengubah aggregate kampanye; status tidak menyesatkan |
| Penyimpanan | Riwayat demo berbasis sesi lokal sesuai spec | Uji sessionStorage, reload, tab/sesi baru dan data invalid | Perilaku penyimpanan jelas dan aman terhadap JSON rusak; tidak mengklaim database persisten |
| Search/filter/sort | Kontrol harus mengubah hasil aktual | Uji kombinasi query, kategori, filter dan sort | Hasil cocok, empty state benar, reset berfungsi, URL query dipertahankan sesuai kebutuhan |
| Modal/popover | Klik luar, Escape, fokus, dan kontrol penutupan | Uji keyboard dan mouse/touch | Bisa dibuka/ditutup, tidak menjebak fokus secara salah, tidak menutup saat interaksi internal yang sah |
| Media | Gambar program 16:9; poster/banner bertulisan tampil utuh | Periksa file binary, pemetaan asset, object-fit dan fallback | Tidak ada broken image/crop teks; jangan konversi atau rename massal tanpa izin |
| Aset ikon | Ikon kategori dan layanan tidak dipertukarkan | Buat mapping file → tujuan → komponen | Semua ikon sesuai makna; kekurangan/warna bawaan yang konflik dengan design system ditandai untuk keputusan |
| Aksesibilitas | Label input, tombol bernama jelas, keyboard, fokus | Audit DOM/interaksi dan contrast dasar | Kontrol utama dapat dipakai keyboard; input memiliki label; gambar punya alt yang bermakna |
| Responsif | Target desktop dan mobile sesuai dokumen | Uji 1440×900, 1280×800, 820×900, 390×844, 320×650; tambahkan 430px bila perlu | Tidak ada horizontal overflow; tidak ada CTA/nav menutupi konten; komposisi baseline tetap terjaga |
| Bahasa dan trust | UI bahasa Indonesia; simulasi jujur | Periksa teks dan status | Tidak ada copy bawaan Inggris yang tertinggal tanpa alasan; tidak ada klaim transaksi nyata atau statistik rekaan |

## 5. Design system: aturan yang perlu dipertahankan

| Elemen | Acuan awal | Arahan penyelarasan |
|---|---|---|
| Brand utama | Biru `#2E7DFA` | Pertahankan sebagai warna utama umum |
| Warna layanan | Zakat `#159947`; Infaq `#0D9488`; Sedekah `#E87924`; Wakaf `#7C55C7` | Dipakai pada konteks layanan terkait saja; jangan biarkan warna layanan mengubah identitas kartu kampanye umum |
| Tipografi | Inter; skala Display/H1/H2/H3/Body/Small/Caption sesuai `DESIGN_SYSTEM.md` | Jangan mengganti font/skala tanpa keputusan; verifikasi pemuatan font aktual |
| Container | Maksimal sekitar 1320px, terpusat | Bandingkan dengan Homepage baseline; jangan ubah lebar karena refactor |
| Gambar program | Rasio 16:9 | Pertahankan desktop dan mobile |
| Banner/poster berteks | Prioritas tampil utuh (`object-fit: contain`) | Jangan crop tulisan; periksa ruang kosong secara visual sebelum perubahan |
| Kartu dan kontrol | Radius kartu 8–12px; tombol/input 6–8px; border netral halus | Hindari radius/pill dan shadow berlebihan |
| Gaya UI | Bersih, hangat, kredibel, tidak generik | Tidak ada gradient dekoratif ungu-biru, glow, glassmorphism, emoji UI, 3D, animasi berlebihan, atau card-soup |
| Aset | Gunakan aset lokal yang tersedia | Jangan ganti dengan stok/generik; jangan konversi massal tanpa verifikasi format dan persetujuan |

## 6. Konflik, risiko, dan keputusan yang perlu ditangani

### 6.1 Perbedaan rencana vs implementasi

- `src/app/routes.jsx` memiliki 16 route utama, tetapi route selain `/` saat ini memakai `RoutePlaceholder`. Artinya route terdaftar tidak sama dengan halaman selesai.
- `RoutePlaceholder` memuat showcase komponen, badge tahap, dan tautan uji route. Elemen ini harus dihilangkan dari halaman produk ketika route tersebut diimplementasikan, bukan sekadar diberi teks yang lebih bagus.
- Beranda memiliki implementasi khusus; perbaikan interaksi harus dipisahkan dari pembangunan halaman lain.

### 6.2 Risiko aset

- Riwayat audit lama menemukan file berekstensi `.png` yang format biner sebenarnya AVIF/WebP. Validasi ulang terhadap ZIP terbaru sebelum loader/rename/konversi.
- Ada laporan sebelumnya tentang nomor gambar yang tidak berurutan dan satu nama file dengan spasi. Jangan membangun pemetaan berdasarkan loop angka; gunakan import eksplisit dan mapping yang tervalidasi.
- Dokumen lama mencatat ketidaksesuaian warna ungu bawaan beberapa SVG dengan design system. Audit tampilan aktual dulu; jangan mengubah warna atau cara render ikon massal tanpa uji kecil dan persetujuan.
- Spec memerlukan lima akses layanan, sementara audit aset lama hanya menemukan empat ikon layanan. Perlu mapping yang disetujui; jangan menciptakan ikon pengganti secara diam-diam.

### 6.3 Konflik atau asumsi yang tidak boleh diselesaikan diam-diam

1. Jika jumlah banner, isi poster, jumlah kartu, atau perilaku carousel berbeda antara dokumen dan Homepage aktual, pertahankan UI yang ada sementara dan tandai konflik untuk Product Owner.
2. Jika detail status donasi demo tidak konsisten antara form dan hasil, tetapkan aturan produk sebelum implementasi.
3. Jika kalkulator zakat memiliki perbedaan soal nisab, periode, atau input, jangan mengarang rumus; ikuti ketentuan yang ada di spec dan tandai kekosongan.
4. Jika aset/isi kontak/FAQ belum tersedia, jangan mengarang data seolah-olah nyata.
5. Jika ada refactor yang dapat mengubah visual Homepage, pecah perubahan dan tunjukkan dampak sebelum disetujui.

## 7. Rencana fase setelah sinkronisasi disetujui

| Fase | Ruang lingkup | Output wajib | Gate persetujuan |
|---|---|---|---|
| **A — Audit silang** | Verifikasi seluruh file, route, komponen, data, dokumen, dan hasil lint/build | Matriks diperbarui dengan bukti per file dan hasil uji nyata; daftar konflik | Product Owner menyetujui matriks dan konflik prioritas |
| **B — Sinkronisasi dokumen** | Perbarui spec/plan/instruksi hanya untuk keputusan yang disetujui | Dokumen selaras; keputusan terbuka dicatat; changelog perubahan dokumen | Product Owner menyetujui dokumen yang telah direvisi |
| **C — Baseline dan perlindungan Homepage** | Screenshot baseline dan test checklist untuk interaksi | Screenshot viewport tetap; daftar perilaku; regression checklist | Product Owner menyetujui baseline dan definisi “UI tidak berubah” |
| **D — Fondasi hanya bila diperlukan** | Perbaiki route/layout/shared component/data contract berdasarkan gap terbukti | Tidak ada placeholder showcase yang bocor; struktur stabil; data konsisten | Lint/build dan uji smoke lulus; visual Homepage dibandingkan |
| **E — Homepage interaction parity** | Perbaiki interaksi yang terbukti belum sesuai | Carousel, filter, poster, doa, CTA dan navigasi memenuhi acceptance criteria | Review browser dan screenshot oleh Product Owner |
| **F — Katalog dan detail** | `/program`, `/program/:slug`, `/zakat/:slug`, search | Halaman fungsional dengan state valid/empty/error | Semua alur masuk-keluar dan data lulus uji |
| **G — Layanan dan kalkulator** | `/zakat`, `/infaq`, `/sedekah`, `/wakaf`, kalkulator | Landing layanan dan kalkulator sesuai spec | Rumus, parameter, dan filter disetujui dan diuji |
| **H — Donasi simulasi** | Form, hasil, riwayat | Alur simulasi konsisten, jelas, tanpa aggregate mutation | Skenario validasi, reload, dan duplicate-submit lulus |
| **I — Informasi/akun dan QA akhir** | Tentang, FAQ, kontak, profil, 404, responsif, aksesibilitas | Semua route siap demo; laporan QA | Product Owner menerima keseluruhan prototype |

**Catatan urutan:** Fase E dapat dilakukan sebelum F jika Product Owner ingin menyempurnakan interaksi Beranda terlebih dahulu. Namun perubahan kode tetap tidak dimulai sebelum fase A–C disetujui. Jika audit menemukan ketergantungan fondasi yang nyata, fondasi dikerjakan dahulu dalam lingkup minimum.

## 8. Checklist acceptance global

- [ ] Semua route dalam spec bisa dibuka langsung dan navigasi browser Back/Forward berfungsi.
- [ ] Semua tautan internal menuju route/slug yang benar.
- [ ] Invalid route dan invalid slug menampilkan error/404 yang sesuai.
- [ ] Data kampanye konsisten lintas Beranda, katalog, pencarian, detail, layanan, dan riwayat.
- [ ] Nominal dan progress selalu terlihat, tidak hanya saat hover.
- [ ] Transaksi simulasi tidak mengubah aggregate kampanye dan tidak mengklaim pembayaran nyata.
- [ ] Semua kontrol interaktif memiliki hasil nyata; tidak ada tombol dekoratif tanpa aksi.
- [ ] Modal/popover/carousel/filter/search diuji dengan mouse, touch, dan keyboard yang relevan.
- [ ] Tidak ada gambar rusak, crop poster bertulisan, atau penggantian aset tanpa izin.
- [ ] Tidak ada horizontal overflow pada viewport target.
- [ ] UI Homepage tidak mengalami perubahan visual yang tidak disetujui.
- [ ] `npm run lint` dan `npm run build` dijalankan dan hasil aktual dicatat.
- [ ] Browser console bersih dari error; uji alur kritis selesai.
- [ ] Perubahan direview melalui diff; tidak ada file/aset terhapus tanpa alasan dan izin.
- [ ] Fase tidak ditandai selesai sampai Product Owner menyetujui hasilnya.

## 9. Cara menggunakan matriks ini

1. Audit implementasi aktual dan isi kolom bukti file/baris serta hasil uji browser.
2. Tandai setiap gap sebagai **Bug**, **Belum diimplementasikan**, **Ketidaksesuaian dokumen**, **Risiko**, atau **Keputusan Product Owner**.
3. Jangan mengubah kode saat audit silang berlangsung.
4. Bahas konflik yang mengubah perilaku produk atau tampilan sebelum menyunting dokumen.
5. Setelah Product Owner menyetujui matriks, revisi dokumen utama secara terkendali dan catat apa yang berubah beserta alasannya.
6. Baru susun instruksi implementasi per fase; setiap instruksi harus memuat batas scope, file yang boleh diubah, acceptance criteria, pengujian, bukti screenshot, dan kondisi berhenti.

**Status akhir dokumen ini:** Draft untuk dibahas bersama. Ini adalah peta kerja dan kontrol anti-drift, bukan klaim bahwa semua fungsi sudah diuji atau izin otomatis untuk memodifikasi proyek.
