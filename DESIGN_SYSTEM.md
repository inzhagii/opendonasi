# OpenDonasi --- Design System

**Versi:** 1.0\
**Status:** Acuan visual dan komponen untuk prototype frontend\
**Keterkaitan:** Dokumen ini melengkapi `OPENDONASI_SPEC.md`. Jika ada
perubahan visual, perbarui dokumen ini dan spesifikasi terkait agar
keduanya tetap selaras.

------------------------------------------------------------------------

## 1. Tujuan dan karakter desain

Design system ini menjaga semua halaman OpenDonasi terasa sebagai satu
produk yang sama: rapi, hangat, mudah dipahami, dan dapat dipercaya.

Referensi awal: - **Amalsholeh** dan **Kitabisa** untuk pola halaman,
cara menyusun informasi program, dan alur donasi. - **Diginusa Studio**
untuk karakter visual yang bersih, terarah, dan tidak terasa seperti
template generik.

Referensi tersebut bukan untuk disalin persis. OpenDonasi harus punya
identitas dan susunan komponennya sendiri.

### Prinsip utama

1.  **Jelas sebelum dekoratif.** Informasi program, nominal, progress,
    dan tindakan utama harus mudah ditemukan.
2.  **Terasa manusiawi.** Gunakan bahasa Indonesia yang natural dan
    gambar yang sesuai konteks. Hindari copywriting bombastis atau
    kalimat generik berulang.
3.  **Warna secukupnya.** Biru adalah aksen utama; tidak semua permukaan
    harus biru.
4.  **Konsisten, bukan seragam secara paksa.** Gunakan token dan
    komponen yang sama, tetapi izinkan layout berubah sesuai kebutuhan
    desktop/mobile.
5.  **Tidak menambah elemen tanpa alasan.** Hindari dekorasi, badge,
    gradient, shadow, animasi, atau ikon tambahan yang tidak membantu
    pengguna.
6.  **Aset yang ada diprioritaskan.** Gunakan aset prototype yang sudah
    tersedia setelah fungsinya diidentifikasi. Jangan menggantinya tanpa
    alasan yang jelas.

------------------------------------------------------------------------

## 2. Fondasi visual

### 2.1 Font

-   Font utama: **Inter**.
-   Gunakan satu keluarga font di seluruh halaman agar identitas
    konsisten.
-   Utamakan keterbacaan dan hirarki yang jelas.
-   Jangan mengecilkan teks secara sembarangan untuk memaksakan konten
    masuk ke kartu.

### 2.2 Warna

  -----------------------------------------------------------------------
  Token                   Nilai                   Penggunaan
  ----------------------- ----------------------- -----------------------
  `primary`               `#2E7DFA`               Tombol utama, link
                                                  penting, indikator
                                                  aktif, aksen

  `primary-soft`          `#EFF6FF`               Latar aksen biru yang
                                                  lembut

  `background`            `#FFFFFF`               Latar utama halaman dan
                                                  permukaan kartu

  `background-soft`       `#F8FAFC`               Latar alternatif untuk
                                                  memisahkan section bila
                                                  diperlukan

  `text-primary`          `#172033`               Judul dan teks utama

  `text-secondary`        `#667085`               Deskripsi, label, dan
                                                  metadata

  `border`                `#E5E7EB`               Garis batas kartu,
                                                  input, dan pemisah

  `success`               `#16A34A`               Status berhasil

  `warning`               `#D97706`               Status menunggu atau
                                                  perlu perhatian

  `error`                 `#DC2626`               Error atau validasi
                                                  gagal

  `disabled`              `#98A2B3`               Teks atau kontrol
                                                  nonaktif
  -----------------------------------------------------------------------

Aturan warna: - Warna utama brand tetap `#2E7DFA`. Jangan mengubahnya
menjadi ungu atau warna utama lain. - Putih menjadi warna dominan. -
Gunakan `primary-soft` hanya untuk penekanan ringan, bukan sebagai latar
semua section. - Warna status hanya untuk status yang relevan. Jangan
memberi warna berbeda pada setiap kategori tanpa kebutuhan. - Pastikan
teks dan kontrol tetap memiliki kontras yang cukup. - Hindari gradient
sebagai gaya default.

### 2.3 Tipografi

  Token         Desktop      Mobile Penggunaan
  ----------- --------- ----------- -----------------------------------------
  `display`       40 px       32 px Headline utama yang benar-benar dominan
  `h1`            32 px       28 px Judul halaman
  `h2`            24 px       22 px Judul section
  `h3`            20 px       18 px Judul kartu atau subbagian
  `body`          16 px   15--16 px Teks isi
  `small`         14 px       14 px Metadata dan teks pendukung
  `caption`       12 px       12 px Keterangan kecil

Aturan: - Gunakan bobot font secara terarah; tidak semua teks perlu
bold. - Judul section, judul program, nominal, dan metadata harus
memiliki hirarki yang mudah dibedakan. - Jangan menggunakan terlalu
banyak ukuran font di dalam satu komponen. - Pada mobile, pertahankan
ukuran sesuai tabel. Jika ruang kurang, ubah layout atau pemenggalan
teks terlebih dahulu.

### 2.4 Spacing

Gunakan skala berikut dan hindari angka acak jika token yang tersedia
sudah memadai.

  Token          Nilai
  ------------ -------
  `space-1`       4 px
  `space-2`       8 px
  `space-3`      12 px
  `space-4`      16 px
  `space-6`      24 px
  `space-8`      32 px
  `space-12`     48 px
  `space-16`     64 px

Penggunaan: - Jarak antarseksi desktop: 48--64 px. - Jarak antarseksi
mobile: 32--48 px. - Padding kartu: 16--20 px. - Jarak judul section ke
isi: konsisten dan disesuaikan dengan hierarki. - Hindari section yang
terlalu rapat atau terlalu renggang tanpa alasan.

### 2.5 Lebar konten dan grid

-   Maksimum konten desktop: **1320 px**, rata tengah.
-   Acuan maksimum desain mobile: **448 px**, tetapi layout harus tetap
    mengikuti lebar layar aktual.
-   Gunakan breakpoint standar Tailwind, kemudian uji ukuran transisi.
-   Grid daftar program desktop: **3 kolom**.
-   Mobile dapat menggunakan daftar kartu horizontal atau susunan
    vertikal sesuai wireframe.
-   Jangan memaksa grid desktop tetap tiga kolom pada layar sempit.
-   Jangan biarkan elemen dekoratif atau carousel menimbulkan horizontal
    overflow di seluruh halaman.

### 2.6 Radius, border, dan shadow

  -----------------------------------------------------------------------
  Elemen                              Standar
  ----------------------------------- -----------------------------------
  Kartu                               Radius 8--12 px

  Tombol dan input                    Radius 6--8 px

  Border                              `1px solid #E5E7EB` atau visual
                                      setara yang halus

  Shadow kartu                        Lembut dan selektif

  Shadow popover/modal                Cukup untuk membedakan layer, tidak
                                      berlebihan
  -----------------------------------------------------------------------

Kartu utama berwarna putih. Border menjadi pemisah dasar; shadow hanya
ditambahkan bila membantu membedakan kartu dari latar. Jangan membuat
semua elemen tampak mengambang.

------------------------------------------------------------------------

## 3. Aset dan aturan gambar

### 3.1 Prinsip umum

-   Gunakan aset yang sudah ada di project sebagai aset prototype.
-   Periksa isi, ukuran, dan fungsi setiap file sebelum mengganti,
    menghapus, atau memindahkannya.
-   Pertahankan file sumber asli. Penyesuaian ukuran dan cara tampil
    dilakukan melalui CSS atau layout.
-   Placeholder hanya digunakan jika aset yang dibutuhkan belum
    tersedia.

### 3.2 Pemisahan ikon

-   `src/assets/icons/icons_kategori/`: ikon untuk kategori program,
    misalnya Pendidikan, Kemanusiaan, Bencana, Semua, dan Lainnya sesuai
    aset yang tersedia.
-   `src/assets/icons/icons_layanan/`: ikon akses layanan Donasi, Zakat,
    Infaq, Sedekah, dan Wakaf.
-   Jangan menukar kedua kelompok ini atau menggunakan ikon kategori
    sebagai ikon layanan hanya karena bentuknya mirip.
-   Gunakan ikon dengan ukuran visual dan alignment yang konsisten.
    Jangan menambahkan emoji sebagai pengganti ikon aset resmi.

### 3.3 Banner dan poster

-   Banner homepage dan poster promosi menggunakan gambar yang tersedia
    dan sesuai konteks.
-   Banner dapat diperkecil agar pas dengan layout.
-   **Seluruh isi banner/poster harus tetap terlihat. Jangan memotong
    gambar, teks, logo, atau objek penting.**
-   Pilihan tampilan awal adalah `object-fit: contain`.
-   Hindari `object-fit: cover` untuk banner/poster yang sudah memiliki
    teks atau komposisi yang harus terlihat utuh.
-   Jika ruang kosong muncul akibat perbedaan rasio, terima ruang kosong
    tersebut daripada memotong konten.
-   Jika diperlukan sedikit perubahan proporsi agar sesuai layout,
    lakukan dengan hati-hati; jangan sampai tulisan atau logo tampak
    jelas gepeng. Utamakan `contain` dan ukuran area yang sesuai
    daripada meregangkan gambar.

### 3.4 Gambar kartu program

-   Rasio gambar kartu program **selalu 16:9** di desktop dan mobile.
-   Terapkan rasio yang sama di Beranda, Daftar Program, Hasil
    Pencarian, landing kategori layanan, dan komponen program lainnya.
-   Lebar kartu dapat berubah mengikuti grid atau carousel; rasio gambar
    tetap 16:9.
-   Gunakan perilaku gambar yang konsisten. Bila perlu crop pada foto
    program yang tidak mengandung teks, lakukan secara hati-hati dengan
    posisi fokus yang sesuai. Jangan pernah mengubah rasio tampilan
    menjadi berbeda-beda per halaman.
-   Jangan memasukkan tulisan promosi tambahan ke dalam gambar kartu
    bila judul dan informasi sudah ditampilkan sebagai teks UI.

### 3.5 Avatar dan gambar orang

-   Gunakan aset avatar yang disediakan bila tersedia.
-   Avatar donatur berbentuk lingkaran dan berukuran konsisten.
-   Jika belum ada foto, gunakan placeholder sederhana dan konsisten.
-   Jangan membuat avatar atau testimoni seolah-olah berasal dari orang
    nyata yang terverifikasi.

------------------------------------------------------------------------

## 4. Komponen inti

Nama file atau komponen dapat mengikuti struktur project, tetapi aturan
visual dan tanggung jawabnya harus konsisten.

### 4.1 Button

-   Tombol utama memakai warna `primary` dengan teks yang kontras.
-   Tombol sekunder menggunakan permukaan netral dan border yang jelas.
-   Gunakan ukuran tombol yang konsisten dan area sentuh yang nyaman di
    mobile.
-   Label singkat dan menjelaskan tindakan, misalnya **Donasi**,
    **Bagikan**, **Lihat Selengkapnya**, atau **Zakat Sekarang**.
-   Jangan menggunakan banyak gaya tombol yang tidak diperlukan.
-   Sediakan state normal, hover/focus, active, dan disabled.
-   Semua tombol harus melakukan tindakan yang sesuai; hindari tombol
    dekoratif yang tidak berfungsi.

### 4.2 Navbar desktop

-   Berada dalam kontainer 1320 px.
-   Logo, menu Program, Layanan, Tentang Kami, Bantuan, pencarian, dan
    area akun disusun rapi.
-   Layanan membuka popover Zakat, Infaq, Sedekah, dan Wakaf.
-   Bantuan membuka popover FAQ dan Kontak.
-   Donasi Saya tidak ditempatkan di menu Bantuan.
-   Jangan memenuhi header dengan badge atau dekorasi.

### 4.3 Header dan bottom navigation mobile

-   Header berisi logo dan kolom pencarian yang cukup lebar.
-   Bottom navigation tetap di bagian bawah layar.
-   Item: Home, Program, Layanan, Akun.
-   Halaman aktif memiliki indikator yang jelas tetapi tidak mencolok.
-   Beri ruang bawah konten agar bottom navigation tidak menutupi tombol
    atau teks.
-   Menu Layanan membuka pilihan Zakat, Infaq, Sedekah, Wakaf.
-   Donasi Saya berada di area Akun/Profil.

### 4.4 SectionHeader

-   Judul dan subjudul mengikuti hierarki tipografi yang ditetapkan.
-   Rata kiri atau tengah mengikuti wireframe tiap section; jangan
    memusatkan semua judul secara otomatis.
-   Jarak antara judul, subjudul, dan konten harus konsisten.
-   Tombol tambahan hanya tampil bila memang ada tindakan yang relevan.

### 4.5 CampaignCard

Gunakan satu komponen kartu utama untuk semua halaman, dengan variasi
layout hanya jika diperlukan.

Informasi yang dapat ditampilkan: - Gambar 16:9. - Judul program. - Nama
penggalang dana/organisasi. - Dana terkumpul. - Progress bar. - Sisa
waktu, bila relevan.

Aturan: - Dana terkumpul dan progress bar selalu terlihat langsung tanpa interaksi.
- Progress bar menggunakan warna utama untuk bagian yang terkumpul dan warna netral untuk sisanya.
- Persentase numerik donasi ditampilkan secara eksklusif melalui tooltip saat kursor hover di atas indikator progres pada desktop. Pada mobile, progres disajikan visual melalui bilah tanpa mewajibkan persentase numerik terlihat terus-menerus.
- Judul dan nama penggalang dana harus memiliki hierarki yang jelas.
- Hindari metadata berlebihan dan badge yang tidak dibutuhkan.
- Jangan menampilkan tombol Bagikan di kartu program.
- Kartu mengarah ke detail program yang sesuai.
- Pada layout horizontal mobile, gambar menempati sekitar separuh lebar kartu dan informasi berada di sampingnya; gambar tetap 16:9.

### 4.6 ProgressBar

-   Bentuk sederhana dan mudah dibaca.
-   Warna progress menggunakan `primary`, bagian yang belum tercapai
    menggunakan warna netral.
-   Nominal terkumpul dan target (jika tersedia) tetap tampil sebagai
    teks; progress bar bukan pengganti informasi angka.
-   Jangan menampilkan persentase yang bertentangan dengan
    nominal/target.
-   Jika target tidak tersedia, jangan membuat persentase palsu.

### 4.7 Carousel

-   Carousel hero: rasio banner mengikuti aset dan layout, gambar utuh
    tanpa crop (`object-contain`); indikator titik di bawah.
-   Gambar banner grafis ditampilkan bersih tanpa overlay teks HTML atau
    gradasi gelap yang menduplikasi teks grafis di dalam banner.
    Aksesibilitas dipertahankan via atribut alt yang bermakna atau teks
    screen reader (`sr-only`).
-   Hero berganti otomatis sekitar setiap 6 detik, mendukung swipe/drag,
    tidak memakai tombol panah, dan berhenti sejenak setelah interaksi
    manual.
-   Carousel program unggulan: manual drag/swipe, tanpa autoplay,
    menampilkan sebagian kartu berikutnya pada desktop untuk memberi
    petunjuk bahwa konten bisa digeser.
-   Carousel poster: manual swipe/drag.
-   Carousel Dukungan & Doa: satu baris kartu, autoplay lambat, loop,
    dan tetap bisa digeser manual.
-   Hormati `prefers-reduced-motion` bila memungkinkan.
-   Animasi harus lembut dan tidak mengganggu pembacaan.
-   Pastikan gesture carousel tidak membuat seluruh halaman ikut
    bergeser horizontal.

### 4.8 Kategori program

-   Menggunakan aset dari `icons_kategori`.
-   Desktop: satu baris berisi Semua, maksimal empat kategori lainnya,
    dan Lainnya bila masih ada kategori tambahan.
-   Lainnya membuka popover berisi kategori yang tersisa.
-   Mobile: carousel horizontal dengan sekitar tiga ikon kategori
    terlihat pada awalnya.
-   Pemilihan kategori memperbarui daftar program.
-   Gaya ikon, jarak, label, dan indikator terpilih konsisten.

### 4.9 Akses cepat layanan

-   Menggunakan aset dari `icons_layanan`. Pengecualian sementara yang
    disetujui: Layanan Zakat menggunakan aset `src/assets/icons/icons_kategori/zakat.svg`
    karena keterbatasan aset fisik di folder layanan. Jangan mengganti
    ikon Infaq atau Wakaf tanpa aset alternatif yang terbukti sesuai.
-   Judul section homepage: **"Mau berbuat baik apa hari ini?"**
-   Pilihan: Donasi, Zakat, Infaq, Sedekah, Wakaf.
-   Tampilkan ikon dan label saja, tanpa kartu mini atau layer
    penjelasan.
-   Desktop menampilkan susunan yang seimbang; mobile memakai carousel
    horizontal dengan tiga item terlihat pada awalnya.
-   Setiap item mengarah ke halaman layanan atau daftar program yang
    sesuai.

### 4.10 Dukungan & Doa Orang Baik

-   Judul section: **"Dukungan & Doa Orang Baik"**.
-   Satu baris carousel, baik desktop maupun mobile.
-   Kartu dapat berisi avatar bulat, nama donatur, program yang
    didukung, pesan opsional, dan tombol Aamiin.
-   Pesan hanya muncul bila ada.
-   Aamiin dapat diaktifkan dan dibatalkan; perubahan hanya lokal pada
    prototype.
-   Autoplay perlahan dan tidak mengganggu interaksi.

### 4.11 Input dan filter

-   Input memakai border halus, teks terbaca, dan label yang jelas.
-   State fokus harus terlihat.
-   Pesan validasi muncul dekat input terkait.
-   Filter dan pengurutan memakai popover, bukan dropdown browser yang
    tampak berbeda antarplatform.
-   Filter yang aktif harus mudah diketahui dan dibersihkan.
-   Hasil kosong harus memiliki pesan dan tindakan yang membantu.

### 4.12 Popover dan modal

-   Menu Layanan, Bantuan, Lainnya, Filter, dan Urutkan memakai pola
    popover yang sama.
-   Popover tidak boleh terpotong tepi layar atau keluar dari viewport.
-   Modal digunakan hanya untuk kebutuhan yang jelas.
-   Sediakan cara menutup yang mudah ditemukan.
-   Jangan menampilkan modal secara berlebihan untuk tindakan sederhana.

### 4.13 Status dan feedback

State umum: - Normal. - Loading. - Empty. - Error. - Disabled. -
Filter/pencarian aktif. - Status transaksi.

Gunakan warna semantik seperlunya, disertai label teks yang jelas.
Jangan hanya membedakan status lewat warna.

Khusus transaksi: - **Menunggu Pembayaran** tidak boleh ditampilkan
sebagai berhasil. - **Berhasil** dalam prototype harus tetap jelas
sebagai hasil simulasi. - Status program (misalnya program masih
berjalan atau berakhir) berbeda dari status transaksi donatur.

------------------------------------------------------------------------

## 5. Pola layout per halaman

### Beranda

-   Hero banner 16:9 dalam kontainer maksimum 1320 px, bukan full-width
    seluruh browser.
-   Akses cepat layanan.
-   Carousel program unggulan.
-   Carousel poster.
-   Kategori dan grid program.
-   Satu baris Dukungan & Doa Orang Baik.
-   CTA dan footer.
-   Mobile menggunakan header ringkas, konten yang disusun ulang, footer
    sederhana, dan bottom navigation.

### Daftar Program dan Hasil Pencarian

-   Hero/heading, kategori, filter dan urutan, lalu daftar program.
-   Desktop memakai grid tiga kolom.
-   Mobile memakai kartu horizontal sesuai wireframe.
-   Kartu tetap memakai komponen dan rasio gambar 16:9 yang sama.

### Detail Program

-   Desktop: konten utama di kiri dan ringkasan/CTA di kolom samping.
-   Mobile: semua konten tersusun vertikal.
-   CTA Donasi dan Bagikan menjadi sticky di bagian bawah hanya setelah
    CTA utama di konten keluar dari area pandang.
-   Informasi dana dan progress selalu terlihat.

### Landing Zakat

-   Hero, pengantar, kalkulator zakat, hasil estimasi, dan program
    terkait.
-   Hasil kalkulator jelas merupakan estimasi/simulasi.

### Landing Infaq, Sedekah, Wakaf

-   Hero, pengantar seperlunya, dan program terkait.
-   Tidak menambahkan kalkulator zakat ke halaman layanan lain.

### Form Donasi

-   Desktop dua kolom: ringkasan program/form dan ringkasan nominal.
-   Mobile bertumpuk vertikal.
-   Nominal, data donatur, opsi anonim, dan total terlihat jelas.
-   Peringatan simulasi pembayaran ditampilkan sebelum pengguna
    melanjutkan.

### Hasil Simulasi Donasi

-   Status transaksi, referensi dummy, ringkasan program dan nominal,
    serta tindakan berikutnya.
-   Jangan memberi kesan uang telah berpindah jika transaksi hanya
    simulasi.

### Tentang Kami

-   Hero/pengantar, statistik dampak placeholder, peran OpenDonasi,
    informasi legalitas bila tersedia.
-   Tidak menambahkan visi-misi, cara kerja, cerita dampak, FAQ, CTA
    promosi, atau bagian "Siapa Kami" yang sudah ditiadakan dari
    rancangan.

### FAQ dan Kontak

-   FAQ: pencarian dan accordion; kontak menjadi jalur bantuan jika
    jawaban tidak ditemukan.
-   Kontak: judul "Butuh Bantuan?", email, WhatsApp, dan tautan FAQ.
    Tidak ada live chat.

### Donasi Saya dan Profil/Akun

-   Tampilan sederhana dengan data dummy.
-   Riwayat menampilkan program, tanggal, nominal, dan status transaksi;
    filter tanggal/status melalui popover.
-   Tidak menggunakan tab ringkasan Semua/Berhasil/Menunggu.
-   Donasi Saya hanya dapat diakses dari area Profil/Akun.
-   Tidak membangun autentikasi penuh.

------------------------------------------------------------------------

## 6. Responsivitas

### Desktop

-   Konten terpusat dengan maksimum 1320 px.
-   Grid program tiga kolom.
-   Navbar horizontal.
-   Carousel memberi petunjuk visual untuk konten berikutnya tanpa
    membuat layout ramai.

### Mobile

-   Layout mengikuti lebar perangkat dengan padding yang nyaman; 448 px
    adalah batas acuan desain, bukan lebar paksa untuk semua perangkat.
-   Tipografi mengikuti skala mobile.
-   Akses cepat dan kategori dapat digeser horizontal.
-   Kartu program horizontal pada section yang ditentukan wireframe.
-   Header dan bottom navigation tidak boleh menutupi konten.
-   Semua target sentuh harus nyaman digunakan.

### Ukuran transisi

Uji ukuran di antara desktop dan mobile, bukan hanya dua ukuran ekstrem.
Jika konten mulai sesak, ubah grid, wrapping, atau susunan layout
terlebih dahulu. Jangan menyelesaikannya dengan mengecilkan semua teks.

------------------------------------------------------------------------

## 7. Aksesibilitas dan detail interaksi

-   Tombol, tautan, input, dan accordion harus dapat digunakan dengan
    keyboard bila memungkinkan.
-   Fokus keyboard harus terlihat.
-   Gunakan label yang jelas pada input; jangan mengandalkan placeholder
    sebagai satu-satunya label.
-   Ikon dekoratif tidak perlu dibacakan oleh screen reader; ikon yang
    bertindak sebagai tombol perlu nama aksesibel.
-   Jangan mengandalkan warna saja untuk membedakan status.
-   Hormati preferensi reduced motion.
-   Carousel harus tetap dapat digunakan tanpa autoplay dan tidak
    memaksa pengguna mengejar konten yang bergerak.
-   Jangan memindahkan fokus secara mengejutkan saat popover atau modal
    dibuka/ditutup.

------------------------------------------------------------------------

## 8. Hal yang harus dihindari

-   Mengganti primary blue `#2E7DFA` atau font Inter tanpa persetujuan.
-   Memakai ikon kategori untuk layanan atau sebaliknya.
-   Memotong banner/poster yang memiliki teks atau komposisi penting.
-   Mengubah rasio gambar kartu program dari 16:9.
-   Menyembunyikan nominal dan progress donasi sampai hover.
-   Membuat kartu yang sama dengan implementasi terpisah di setiap
    halaman.
-   Menambahkan badge, gradient, shadow, rounded-pill, animasi, atau
    dekorasi tanpa kebutuhan.
-   Membuat semua section terlihat seperti kumpulan kartu.
-   Menambahkan section/fitur yang tidak ada di spesifikasi produk.
-   Menggunakan angka dampak, legalitas, kontak, atau status verifikasi
    palsu seolah-olah nyata.
-   Mengklaim simulasi sebagai transaksi sungguhan.
-   Menghapus aset sebelum kegunaannya dipastikan.
-   Membuat desain desktop yang tidak dipikirkan ulang untuk mobile.

------------------------------------------------------------------------

## 9. Checklist konsistensi sebelum menyatakan halaman selesai

-   [ ] Font Inter dan warna utama sesuai token.
-   [ ] Hierarki tipografi sesuai skala.
-   [ ] Spacing, radius, border, dan shadow konsisten.
-   [ ] Gambar kartu program memakai rasio 16:9.
-   [ ] Banner/poster yang berisi teks tampil utuh tanpa crop.
-   [ ] Ikon kategori dan ikon layanan berasal dari kelompok aset yang
    benar.
-   [ ] Nominal dan progress donasi selalu terlihat.
-   [ ] Kartu memakai komponen bersama.
-   [ ] Header, popover, modal, dan bottom navigation bekerja dengan
    baik.
-   [ ] Tidak ada horizontal overflow pada halaman.
-   [ ] Layout diperiksa pada desktop, mobile, dan ukuran transisi.
-   [ ] Semua kontrol interaktif punya tindakan yang sesuai.
-   [ ] Loading, empty, error, disabled, dan status transaksi
    ditampilkan sesuai konteks.
-   [ ] Data dummy konsisten di seluruh halaman.
-   [ ] Tidak ada konten, statistik, atau klaim layanan yang dibuat
    seolah-olah nyata tanpa dasar.

------------------------------------------------------------------------

## 10. Aturan perubahan design system

Design system ini adalah baseline yang dikunci untuk implementasi awal.
Perubahan dapat dilakukan jika ada alasan UX yang jelas atau ditemukan
masalah saat pengujian, tetapi: 1. Jangan mengubah keputusan yang telah
dikunci secara diam-diam. 2. Catat perubahan di dokumen ini dan
`OPENDONASI_SPEC.md`. 3. Periksa dampaknya pada halaman dan komponen
lain. 4. Pilih solusi paling sederhana yang menyelesaikan masalah. 5.
Jangan menambah variasi visual hanya karena bisa dibuat.

**Status:** Design system prototype OpenDonasi v1.0. Ini adalah dokumen
acuan visual, bukan prompt implementasi.
