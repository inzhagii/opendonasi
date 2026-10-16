# OpenDonasi --- Product & Frontend Specification

**Versi:** 1.0\
**Status:** Acuan prototype frontend\
**Stack rencana:** React + Vite + Tailwind CSS\
**Bahasa antarmuka:** Bahasa Indonesia

Dokumen ini menjadi acuan bersama saat membangun prototype OpenDonasi.
Isinya merangkum halaman, susunan wireframe, navigasi, dan perilaku
interaksi yang sudah disepakati. Jika ada keputusan baru, perbarui
dokumen ini terlebih dahulu agar implementasi tidak berjalan dengan
asumsi berbeda.

------------------------------------------------------------------------

## 1. Tujuan dan batas project

OpenDonasi direncanakan sebagai platform penggalangan dana digital yang
membantu yayasan dan lembaga sosial menjalankan program donasi tanpa
harus membangun sistem digital sendiri. Prototype saat ini berfokus pada
**website publik dan pengalaman calon donatur**.

Inspirasi referensi: - **Amalsholeh** dan **Kitabisa**: referensi pola
konten, susunan halaman, dan alur pengguna. Bukan untuk disalin
persis. - **Diginusa Studio**: referensi karakter visual yang rapi,
matang, dan terasa dibuat oleh manusia.

### Termasuk dalam prototype

-   Halaman publik desktop dan mobile.
-   Halaman detail program dan kategori layanan.
-   Pencarian, filter, popover, accordion, carousel, dan modal.
-   Form donasi serta hasil simulasi transaksi.
-   Riwayat donasi dan profil berbasis data dummy.
-   Navigasi ant halaman melalui routing React.
-   Data dummy bersama agar program yang sama konsisten di seluruh
    halaman.

### Tidak termasuk untuk saat ini

-   Backend, database, CMS, API, atau dashboard page-builder.
-   Autentikasi sungguhan, pengelolaan akun nyata, dan keamanan akun
    lengkap.
-   Pembayaran atau transaksi uang sungguhan.
-   Integrasi payment gateway, WhatsApp API, atau layanan eksternal yang
    membutuhkan kredensial.
-   Sistem admin untuk mengubah halaman atau konten.

Tombol dan alur yang biasanya memerlukan layanan backend tetap boleh
didemonstrasikan dengan simulasi lokal yang jelas. Jangan memberi kesan
bahwa pembayaran sungguhan sudah diproses.

------------------------------------------------------------------------

## 2. Prinsip pengalaman dan visual

### Arah visual

OpenDonasi harus terasa bersih, hangat, mudah dipercaya, dan wajar untuk
platform sosial. Hindari tampilan yang terlalu dekoratif, terlalu banyak
gradient, efek mengilap, bentuk pil di mana-mana, animasi berlebihan,
atau komposisi yang terasa seperti template AI generik.

-   Font: **Inter**.
-   Warna utama: **`#2E7DFA`**.
-   Latar utama: putih.
-   Warna dipakai dengan hemat; biru menjadi aksen dan penanda tindakan
    utama, bukan latar semua komponen.
-   Kartu putih dengan border halus dan shadow lembut seperlunya.
-   Gunakan gambar manusia dan kegiatan sosial yang relevan. Jangan
    menambahkan gambar dekoratif jika tidak membantu konteks.
-   Hindari menumpuk banyak label, badge, atau ikon dalam satu kartu.
-   Isi, nominal, dan progress donasi harus mudah dibaca tanpa harus
    berinteraksi dengan hover.

### Aturan layout

-   Konten desktop: lebar maksimum **1320 px**, rata tengah.
-   Acuan desain mobile: lebar maksimum **448 px**; tetap responsif pada
    ukuran layar aktual.
-   Gunakan breakpoint standar Tailwind, kemudian cek ukuran transisi
    agar layout tidak patah.
-   Desktop umumnya memakai grid atau layout horizontal; mobile menyusun
    ulang konten bila perlu.
-   Jangan sampai carousel menyebabkan seluruh halaman mengalami
    horizontal overflow.
-   Jaga konsistensi padding, jarak antarkomponen, ukuran teks, dan
    alignment ant halaman.

### Tipografi

  Jenis       Desktop      Mobile
  --------- --------- -----------
  Display       40 px       32 px
  H1            32 px       28 px
  H2            24 px       22 px
  H3            20 px       18 px
  Body          16 px   15--16 px
  Small         14 px       14 px
  Caption       12 px       12 px

### Spacing dan bentuk

-   Skala spacing: 4, 8, 12, 16, 24, 32, 48, 64 px.
-   Jarak section desktop: sekitar 48--64 px.
-   Jarak section mobile: sekitar 32--48 px.
-   Padding kartu: sekitar 16--20 px.
-   Radius kartu: 8--12 px.
-   Radius tombol dan input: 6--8 px.
-   Border tipis; shadow dipakai selektif, bukan pada setiap elemen.

### Gambar dan aset

-   Gunakan aset yang sudah tersedia di `src/assets/` sebagai aset
    prototype, setelah fungsi setiap file dipetakan.
-   Jangan menghapus atau mengganti aset yang belum teridentifikasi.
-   `icons_kategori` digunakan untuk kategori program.
-   `icons_layanan` digunakan untuk akses Donasi, Zakat, Infaq, Sedekah,
    dan Wakaf.
-   Banner/poster yang sudah memiliki tulisan di dalam gambar harus
    ditampilkan utuh. Jangan memotong teks, logo, atau objek penting.
-   Untuk banner, gambar boleh diperkecil dan sedikit berubah proporsi
    bila memang diperlukan, tetapi utamakan gambar utuh tanpa crop.
    Pilihan awal adalah `object-fit: contain`; hindari `cover` untuk
    poster yang perlu terlihat lengkap. Ruang kosong di sekitar gambar
    lebih baik daripada memotong informasi.
-   Kartu program memakai rasio gambar **16:9** di semua halaman dan
    perangkat. Gunakan ukuran kartu yang menyesuaikan layout tanpa
    mengubah rasio tersebut.
-   Placeholder boleh digunakan hanya untuk aset yang memang belum
    tersedia. Jangan mengganti aset yang sudah sesuai hanya demi
    keseragaman.

------------------------------------------------------------------------

## 3. Navigasi utama

### Desktop

Header berada dalam kontainer maksimum 1320 px dan berisi: - Logo
OpenDonasi; klik logo kembali ke Beranda. - Menu **Program**. - Menu
**Layanan** dengan popover berisi Zakat, Infaq, Sedekah, dan Wakaf. -
Menu **Tentang Kami**. - Menu **Bantuan** dengan popover berisi FAQ dan
Kontak. - Pencarian. - Tombol **Masuk** saat belum masuk; avatar/profil
bila menggunakan keadaan profil dummy.

Tidak perlu membangun proses login sungguhan. Tampilan akun hanya untuk
mendemonstrasikan prototype.

### Mobile

-   Header ringkas berisi logo dan kolom pencarian yang lebar.
-   Bottom navigation tetap di bawah layar dengan ikon dan indikator
    halaman aktif: **Home**, **Program**, **Layanan**, **Akun**.
-   Menu Layanan membuka popover/menu untuk Zakat, Infaq, Sedekah, dan
    Wakaf.
-   Bagian Akun menjadi akses menuju Profil, Donasi Saya, FAQ, Kontak,
    dan Tentang Kami sesuai rancangan profil.
-   Footer mobile dibuat ringkas; cukup Tentang Kami dan media sosial.
    Hindari footer desktop yang panjang di layar kecil.

### Aturan navigasi

-   Semua halaman yang tercantum di spesifikasi ini terhubung melalui
    routing React.
-   Tautan kartu program membuka detail program yang sesuai.
-   Filter dan pencarian memperbarui hasil tanpa membuat navigasi
    membingungkan.
-   Gunakan tautan atau tombol yang sesuai dengan tindakannya; jangan
    membuat elemen terlihat interaktif jika tidak melakukan apa pun.
-   **Donasi Saya hanya ditempatkan di area Profil/Akun**, bukan di menu
    Bantuan.
-   Kontak diarahkan ke email dan WhatsApp; tidak ada live chat.

------------------------------------------------------------------------

## 4. Daftar halaman

  -----------------------------------------------------------------------
  No.                     Halaman                 Tujuan utama
  ----------------------- ----------------------- -----------------------
  01                      Beranda                 Menjelajahi layanan,
                                                  program unggulan, dan
                                                  dukungan donatur

  02                      Daftar Program          Menelusuri, mencari,
                                                  memfilter, dan
                                                  mengurutkan program

  03                      Detail Program Donasi   Memahami program dan
                                                  memulai donasi

  04                      Landing Zakat           Memahami zakat,
                                                  menggunakan kalkulator,
                                                  dan melihat program

  05                      Detail Zakat            Melihat program zakat
                                                  dan melanjutkan ke
                                                  simulasi pembayaran

  06                      Landing Infaq           Memahami layanan infaq
                                                  dan melihat program
                                                  terkait

  07                      Landing Sedekah         Memahami layanan
                                                  sedekah dan melihat
                                                  program terkait

  08                      Landing Wakaf           Memahami layanan wakaf
                                                  dan melihat program
                                                  terkait

  09                      Form Donasi             Memilih nominal dan
                                                  mengisi data donatur

  10                      Hasil Simulasi Donasi   Menampilkan status
                                                  transaksi simulasi
                                                  secara akurat

  11                      Tentang Kami            Menjelaskan OpenDonasi
                                                  dan dampak platform

  12                      FAQ                     Menjawab pertanyaan
                                                  umum dengan pencarian
                                                  dan accordion

  13                      Kontak                  Mengarahkan pengguna ke
                                                  email atau WhatsApp

  14                      Donasi Saya             Menampilkan riwayat
                                                  donasi dummy

  15                      Profil/Akun             Menjadi pintu masuk ke
                                                  fitur akun sederhana

  16                      Hasil Pencarian         Menampilkan hasil
                                                  sesuai kata kunci dan
                                                  filter

  17                      Komponen interaksi      Popover, modal, filter,
                          bersama                 accordion, dan state UI
                                                  yang dipakai lintas
                                                  halaman

  18                      Konsistensi lintas      Aturan bersama untuk
                          halaman                 kartu, status,
                                                  responsivitas, dan
                                                  interaksi
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 5. Wireframe dan kebutuhan tiap halaman

Wireframe berikut berupa spesifikasi struktur, bukan instruksi visual
yang harus diikuti secara kaku sampai setiap piksel. Jaga hierarki dan
urutan konten; detail spacing diselaraskan dengan design system.

### 01. Beranda

#### Desktop

1.  Header utama.
2.  Carousel banner hero 16:9 di dalam kontainer 1320 px, dengan sudut
    membulat.
3.  Akses cepat dengan judul **"Mau berbuat baik apa hari ini?"** dan
    lima pilihan: Donasi, Zakat, Infaq, Sedekah, Wakaf. Tampilkan ikon
    dan label saja; tidak perlu kartu mini atau teks penjelas.
4.  Section **"Ada Kebaikan yang Menantimu"** berisi carousel kartu
    program unggulan.
5.  Section **"Yang Baru di OpenDonasi"** berupa carousel poster/banner
    16:9.
6.  Section program dengan kategori ikon dan grid program.
7.  Section **"Dukungan & Doa Orang Baik"** berupa satu baris kartu
    dukungan.
8.  CTA penutup.
9.  Footer lengkap.

#### Mobile

1.  Header ringkas dan pencarian.
2.  Banner hero.
3.  Akses cepat; carousel horizontal dengan tiga item terlihat pada
    awalnya.
4.  Program unggulan berupa kartu horizontal yang dapat digeser.
5.  Carousel poster.
6.  Kategori program horizontal dan kartu program horizontal.
7.  Satu baris carousel Dukungan & Doa Orang Baik.
8.  CTA.
9.  Footer ringkas dan bottom navigation tetap.

#### Interaksi beranda

-   Banner dapat digeser manual dengan swipe/drag, tanpa tombol panah.
    Autoplay sekitar 6 detik; jeda sebentar setelah interaksi manual dan
    hormati preferensi reduced motion.
-   Titik indikator banner tampil di bawah banner.
-   Carousel program mendukung drag/swipe, tidak autoplay, dan berputar
    secara seamless bila memungkinkan.
-   Pada desktop carousel unggulan menampilkan tiga kartu penuh dan
    sebagian kartu berikutnya. Tombol panah diletakkan di sisi carousel,
    sejajar area kartu; gunakan fade tepi putih secara halus jika
    diperlukan.
-   Carousel poster bisa digeser.
-   Kategori program memfilter program yang terlihat.
-   Pada desktop, tampilkan satu baris kategori yang mencakup **Semua**,
    maksimal empat kategori lain, lalu **Lainnya** jika masih ada
    kategori tambahan. Pilihan di Lainnya dibuka lewat popover.
-   Grid desktop menampilkan tiga kolom dan dua baris awal, lalu tombol
    **"Lihat Selengkapnya"**.
-   Pada mobile, kartu program dalam section listing menggunakan layout
    horizontal dengan gambar sekitar separuh lebar kartu dan informasi
    di sebelahnya. Rasio gambar tetap 16:9.
-   Dukungan & Doa memakai autoplay lambat, loop, dan swipe manual. Jika
    memungkinkan, hentikan sementara saat pengguna berinteraksi.
-   Tombol **Aamiin** berfungsi seperti like: tekan untuk menambah,
    tekan kembali untuk membatalkan. Perubahan hanya disimpan lokal.
-   Pesan donatur hanya ditampilkan bila memang ada. Jangan membuat
    pesan panjang secara otomatis untuk semua kartu.

### 02. Daftar Program

#### Desktop

-   Header.
-   Hero/banner halaman program.
-   Judul dan pengantar singkat.
-   Kategori program.
-   Kontrol Filter dan Urutkan yang membuka popover.
-   Grid kartu program tiga kolom.
-   Tombol **"Lihat Selengkapnya"** bila daftar awal dibatasi.
-   Footer.

#### Mobile

-   Header dan pencarian.
-   Hero.
-   Kategori horizontal.
-   Filter dan Urutkan yang mudah dijangkau.
-   Kartu program horizontal.
-   Bottom navigation.

#### Interaksi

-   Kategori, filter, dan urutan memperbarui hasil yang ditampilkan.
-   Gunakan popover, bukan dropdown browser yang tampilannya tidak
    konsisten.
-   Sediakan empty state ketika tidak ada program yang cocok.
-   Kartu mengarah ke halaman detail program.
-   Status program dan status transaksi tidak boleh dicampur.

### 03. Detail Program Donasi

#### Desktop

-   Header.
-   Banner program.
-   Area konten dua kolom.
-   Kolom utama: judul, informasi penggalang dana, cerita program,
    berita terbaru, dan daftar donatur.
-   Kolom samping: dana terkumpul, target bila tersedia, progress, batas
    waktu, jumlah donatur, tombol Donasi dan Bagikan.
-   Footer.

#### Mobile

-   Header.
-   Banner dan judul.
-   Ringkasan nominal, progress, sisa waktu, serta jumlah donatur.
-   Informasi penggalang dana.
-   Tentang Program/cerita.
-   Berita Terbaru.
-   Daftar Donatur dan pesan dukungan.
-   CTA donasi dan bagikan yang menempel di bagian bawah **hanya ketika
    tombol donasi utama di konten sudah keluar dari area pandang**.

#### Interaksi dan konten

-   Progress bar dan nominal selalu terlihat. Persentase boleh
    ditampilkan saat hover pada desktop, tetapi informasi dana dan
    progress tidak boleh hanya muncul saat hover.
-   Cerita atau berita panjang dapat diringkas dengan **"Lihat
    selengkapnya"**.
-   Pesan donatur bersifat opsional; tampilkan hanya jika ada.
-   Bagikan menggunakan share API browser bila tersedia, atau
    menyediakan opsi salin tautan sebagai fallback.
-   Tombol Donasi menuju form donasi dengan program terkait.
-   Jangan menampilkan tombol Bagikan di kartu program; tombol ini
    berada di halaman detail.

### 04. Landing Zakat

-   Header dan banner hero 16:9.
-   Judul dan pengantar layanan zakat.
-   Bagian kalkulator zakat yang mudah dipahami.
-   Form nilai aset/komponen yang diperlukan sesuai kalkulator
    prototype.
-   Hasil estimasi dengan penjelasan bahwa hasil merupakan simulasi.
-   Kategori/filter program zakat.
-   Daftar kartu program.
-   Footer.

#### Interaksi

-   Hasil kalkulator diperbarui saat input berubah.
-   Validasi input angka dan hindari hasil negatif.
-   Jelaskan asumsi perhitungan secara singkat; jangan mengklaim hasil
    sebagai nasihat agama atau perhitungan resmi.
-   Kategori, filter, dan kartu mengikuti pola halaman daftar program.
-   Pada mobile, kontrol dan hasil kalkulator disusun vertikal.

### 05. Detail Zakat

-   Struktur mengikuti Detail Program Donasi.
-   Sediakan kalkulator atau akses menuju kalkulator zakat pada bagian
    yang relevan.
-   CTA utama bertuliskan **"Zakat Sekarang"**.
-   Gaya tombol dapat dibedakan secara halus dari donasi umum, tetapi
    tetap mengikuti token warna dan komponen bersama.
-   Tombol mengarah ke form simulasi dengan konteks program zakat.

### 06. Landing Infaq

-   Hero/banner 16:9.
-   Pengantar singkat mengenai infaq.
-   Program infaq terkait.
-   Filter/kategori bila diperlukan.
-   Kartu program mengikuti komponen utama.
-   Footer.

Tidak perlu kalkulator. Hindari paragraf panjang; gunakan penjelasan
secukupnya untuk membantu pengguna memahami layanan.

### 07. Landing Sedekah

-   Hero/banner 16:9.
-   Pengantar singkat mengenai sedekah.
-   Program sedekah terkait.
-   Filter/kategori bila diperlukan.
-   Kartu program mengikuti komponen utama.
-   Footer.

Tidak perlu kalkulator. Pertahankan susunan dan perilaku yang konsisten
dengan landing Infaq.

### 08. Landing Wakaf

-   Hero/banner 16:9.
-   Pengantar layanan wakaf.
-   Program wakaf terkait.
-   Filter/kategori bila diperlukan.
-   Kartu program mengikuti komponen utama.
-   Footer.

Tidak perlu kalkulator. Konten dummy harus tetap wajar dan tidak membuat
klaim hukum atau pengelolaan wakaf yang belum diverifikasi.

### 09. Form Donasi

#### Desktop

-   Header.
-   Ringkasan program dan form di kolom utama.
-   Ringkasan nominal di kolom samping.
-   Footer atau penutup yang tidak mengganggu proses pengisian.

#### Mobile

-   Header ringkas.
-   Ringkasan/banner program di atas.
-   Form tersusun vertikal.
-   Ringkasan nominal dekat tombol lanjutkan.

#### Field dan interaksi

-   Pilihan nominal preset.
-   Input nominal sendiri.
-   Nama donatur.
-   Email.
-   Nomor telepon opsional.
-   Pesan doa/dukungan opsional.
-   Checkbox anonim dengan label **"Hamba Allah"**.
-   Total nominal diperbarui saat pilihan berubah.
-   Validasi input wajib dan format email.
-   Bila anonim dipilih, gunakan nama tampilan "Hamba Allah" pada
    ringkasan, tetapi jangan menghapus input nama secara tidak terduga.
-   Tampilkan pemberitahuan yang jelas bahwa ini **simulasi frontend dan
    tidak memproses pembayaran sungguhan**.
-   Lanjutkan ke halaman hasil simulasi, dengan data form dibawa melalui
    state aplikasi atau mekanisme lokal yang sederhana.

### 10. Hasil Simulasi Donasi

-   Tampilkan status transaksi yang sesuai.
-   Nomor referensi dummy, misalnya `OD-XXXXXX`.
-   Ringkasan program dan nominal.
-   Tindakan untuk kembali ke detail program atau beranda.
-   Bila status **Menunggu Pembayaran**, jangan menampilkan kalimat yang
    menyatakan pembayaran sudah berhasil.
-   Bila status **Berhasil** digunakan dalam simulasi, beri konteks yang
    jelas bahwa status tersebut merupakan hasil demo lokal.
-   Jangan mengirim data ke backend atau payment gateway.

### 11. Tentang Kami

-   Hero dan pengantar tentang OpenDonasi.
-   Statistik dampak dalam layout yang terinspirasi referensi yang sudah
    dibahas.
-   Penjelasan peran OpenDonasi.
-   Informasi legalitas jika data tersedia.
-   Footer.

Batasan konten: - Jangan menambahkan bagian visi dan misi. - Jangan
menambahkan bagian "cara kerja". - Jangan menambahkan cerita dampak. -
Jangan menambahkan FAQ di halaman ini. - Jangan menambahkan CTA
promosi. - Hapus bagian **"Siapa Kami"**. - Statistik seperti "10 juta"
hanya placeholder dan tidak boleh dianggap data nyata sebelum
diverifikasi. Tandai sebagai data demo jika tetap dipakai dalam
prototype.

### 12. FAQ

-   Header.
-   Judul dan pengantar singkat.
-   Kolom pencarian pertanyaan.
-   Kategori pertanyaan.
-   Daftar accordion.
-   Tautan ke Kontak jika jawaban tidak ditemukan.
-   Footer.

#### Interaksi

-   Pencarian menyaring pertanyaan berdasarkan kata kunci.
-   Accordion membuka dan menutup jawaban.
-   Empty state mengarahkan pengguna ke halaman Kontak.
-   Gunakan pertanyaan dummy yang masuk akal dan tidak menjanjikan
    layanan yang belum tersedia.

### 13. Kontak

-   Header.
-   Judul **"Butuh Bantuan?"**.
-   Kartu kontak email.
-   Kartu kontak WhatsApp.
-   Tautan ke FAQ.
-   Footer.

Tidak ada live chat. Gunakan alamat email dan nomor WhatsApp yang memang
disediakan atau placeholder yang jelas; jangan mengarang kontak nyata.

### 14. Donasi Saya

-   Halaman riwayat donasi sederhana berbasis data dummy.
-   Setiap entri menampilkan program, tanggal, nominal, dan status
    transaksi.
-   Filter tanggal dan status melalui popover.
-   Tidak menggunakan tab ringkasan **"Semua / Berhasil / Menunggu"**.
-   Status transaksi, misalnya **Berhasil** atau **Menunggu
    Pembayaran**, harus berbeda makna dari status program.
-   Data dapat berasal dari simulasi donasi yang dilakukan dalam sesi
    prototype bila memungkinkan. Jika tidak, gunakan data dummy
    terpusat.
-   Akses halaman hanya melalui area Profil/Akun, bukan menu Bantuan.
-   Tidak memerlukan autentikasi sungguhan.

### 15. Profil/Akun

-   Profil dummy dengan avatar/logo dan informasi sederhana.
-   Tautan ke Donasi Saya, Kontak, FAQ, dan Tentang Kami.
-   Navigasi konsisten dengan bottom navigation mobile.
-   Tidak perlu membangun pengaturan keamanan, login, reset password,
    atau autentikasi penuh.
-   Jika belum ada pengguna yang benar-benar masuk, jelaskan bahwa
    profil merupakan tampilan demo atau gunakan keadaan profil dummy
    yang konsisten.

### 16. Hasil Pencarian

-   Header dan kolom pencarian berisi kata kunci yang sedang dicari.
-   Judul hasil pencarian dan jumlah hasil jika tersedia.
-   Filter kategori, status program, dan urutan.
-   Grid tiga kolom desktop.
-   Layout kartu yang sesuai wireframe mobile.
-   Empty state dengan pesan yang membantu dan opsi menghapus filter
    atau mengubah kata kunci.
-   Pencarian memanfaatkan data dummy bersama, bukan daftar program
    berbeda yang dibuat khusus untuk halaman ini.

------------------------------------------------------------------------

## 6. Komponen dan pola interaksi bersama

Komponen ini digunakan lintas halaman agar perilaku dan tampilan tidak
berbeda-beda.

### Komponen utama

-   `Navbar`
-   `MobileBottomNav`
-   `Button`
-   `SectionHeader`
-   `CampaignCard`
-   `ProgressBar`
-   `Carousel`
-   `Popover`
-   `Modal`
-   `Accordion`
-   `SearchInput`
-   `FilterPopover`
-   `EmptyState`
-   `LoadingState`
-   `ErrorState`
-   `StatusLabel` atau komponen status transaksi yang sederhana

Nama komponen boleh disesuaikan dengan konvensi project, tetapi tanggung
jawabnya harus tetap jelas.

### Kartu program

-   Satu komponen utama digunakan lintas halaman.
-   Rasio gambar **16:9** pada desktop dan mobile.
-   Informasi minimal: judul, penggalang dana/organisasi, dana
    terkumpul, progress, dan sisa waktu jika relevan.
-   Nominal dan progress selalu terlihat.
-   Variasi kartu hanya untuk kebutuhan layout yang benar-benar berbeda,
    misalnya kartu horizontal mobile. Hindari duplikasi komponen dengan
    isi hampir sama.
-   Data yang tidak tersedia tidak boleh diisi dengan klaim palsu;
    sembunyikan informasi opsional atau gunakan data demo yang
    konsisten.

### Popover

Popover digunakan untuk: - Menu Layanan. - Menu Bantuan. - Kategori
**Lainnya**. - Filter. - Pengurutan. - Filter riwayat donasi.

Popover harus bisa dibuka dan ditutup dengan wajar, tidak terpotong tepi
layar, dan tetap nyaman digunakan pada mobile.

### Modal

Gunakan modal hanya bila ada kebutuhan yang jelas, misalnya informasi
tambahan atau tindakan konfirmasi. Modal harus mudah ditutup dan tidak
menutupi navigasi secara tidak sengaja.

### Carousel

-   Mendukung mouse drag di desktop dan swipe di mobile bila sesuai.
-   Tidak menggunakan autoplay untuk carousel program unggulan.
-   Banner hero memakai autoplay sekitar 6 detik, dengan indikator titik
    dan jeda setelah interaksi manual.
-   Carousel Dukungan & Doa bergerak perlahan, loop, dan tetap dapat
    digeser manual.
-   Hindari gerakan cepat, efek berlebihan, atau animasi yang mengganggu
    pembacaan.
-   Hormati preferensi `prefers-reduced-motion` jika memungkinkan.

### State umum

Tentukan sejak awal: - Normal. - Loading. - Empty. - Error. -
Disabled. - Hasil filter/pencarian. - Status transaksi yang berbeda.

Tidak semua halaman harus menampilkan semua state pada waktu yang sama.
Tampilkan state sesuai konteks.

------------------------------------------------------------------------

## 7. Alur navigasi utama

### Menemukan dan mendukung program

1.  Pengguna membuka Beranda atau Daftar Program.
2.  Memilih kategori, mencari program, atau menggunakan filter.
3.  Membuka kartu program.
4.  Membaca Detail Program.
5.  Menekan Donasi.
6.  Memilih nominal dan mengisi Form Donasi.
7.  Melihat Hasil Simulasi Donasi dengan status yang tepat.
8.  Kembali ke Detail Program atau Beranda.

### Jalur layanan

-   Beranda → Zakat → Kalkulator/Daftar Program Zakat → Detail Zakat →
    Zakat Sekarang → Form Donasi → Hasil Simulasi.
-   Beranda → Infaq → Daftar Program Infaq → Detail Program → Form
    Donasi.
-   Beranda → Sedekah → Daftar Program Sedekah → Detail Program → Form
    Donasi.
-   Beranda → Wakaf → Daftar Program Wakaf → Detail Program → Form
    Donasi.

### Jalur bantuan

-   Header desktop → Bantuan → FAQ atau Kontak.
-   Mobile → Akun → FAQ atau Kontak.
-   FAQ → Kontak bila jawaban tidak ditemukan.
-   Kontak → WhatsApp atau email menggunakan alamat yang sudah
    disediakan.

### Jalur akun

-   Header desktop → Masuk/profil dummy.
-   Bottom navigation mobile → Akun → Profil.
-   Profil → Donasi Saya, Kontak, FAQ, atau Tentang Kami.
-   Donasi Saya menampilkan riwayat dummy; tidak membutuhkan login
    sungguhan.

### Jalur pencarian

-   Kolom pencarian → Hasil Pencarian → filter/urutkan → Detail Program.
-   Hasil kosong → ubah kata kunci atau hapus filter.

------------------------------------------------------------------------

## 8. Sumber data dummy

Gunakan satu sumber data bersama di dalam project, bukan mendefinisikan
ulang program yang sama pada setiap halaman.

Data yang disiapkan: - Program: ID, slug, judul, gambar, kategori,
penggalang, nominal terkumpul, target jika tersedia, progress, sisa
waktu, jumlah donatur, deskripsi, berita, dan daftar dukungan. -
Kategori program. - Layanan: Donasi, Zakat, Infaq, Sedekah, Wakaf. -
Donatur dan pesan dukungan opsional. - Riwayat donasi dan status
transaksi. - Pertanyaan FAQ. - Informasi kontak placeholder jika data
nyata belum disediakan.

Gunakan ID/slug stabil untuk menghubungkan kartu, detail, dan transaksi
simulasi. Nominal, persentase progress, target, dan sisa waktu harus
konsisten satu sama lain bila ditampilkan sebagai data demo.

Jangan mengarang angka statistik perusahaan, legalitas, kontak, atau
klaim bahwa suatu program telah diverifikasi. Jika nilai masih contoh,
perlakukan sebagai data dummy yang jelas.

------------------------------------------------------------------------

## 9. Responsivitas dan pemeriksaan kualitas

Uji setidaknya: - Desktop lebar. - Laptop atau ukuran transisi. - Mobile
sempit. - Mobile sekitar lebar desain 390--448 px.

Periksa: - Tidak ada horizontal overflow pada halaman. - Header,
popover, modal, dan bottom navigation tidak menutupi konten penting. -
Semua gambar banner/poster tampil utuh tanpa crop. - Semua gambar kartu
program menggunakan rasio 16:9. - Teks tidak terpotong dan ukuran tetap
terbaca. - Carousel dapat digunakan dengan mouse dan sentuhan. - Tombol,
filter, pencarian, accordion, Aamiin, dan navigasi memiliki aksi yang
nyata. - Empty state dan status transaksi tampil sesuai konteks. - Link
antarhalaman menuju tujuan yang benar. - Data program konsisten di
beranda, hasil pencarian, listing, detail, dan riwayat simulasi. - Tidak
ada klaim pembayaran sungguhan atau layanan backend yang belum tersedia.

------------------------------------------------------------------------

## 10. Batasan implementasi dan aturan kerja

1.  Jangan membuat ulang project React + Vite jika project yang ada
    masih bisa digunakan.
2.  Jangan menghapus atau mengganti aset tanpa memeriksa kegunaannya.
3.  Jangan mengubah warna utama, font, rasio gambar kartu, atau
    keputusan wireframe tanpa persetujuan.
4.  Jangan menambahkan halaman, section, badge, animasi, atau fitur yang
    tidak diminta hanya karena terlihat menarik.
5.  Utamakan komponen yang dapat digunakan ulang, tetapi jangan
    memaksakan satu layout identik untuk kebutuhan yang memang berbeda.
6.  Jangan membuat semua section menjadi kartu; gunakan layout sederhana
    jika lebih cocok.
7.  Jangan mengisi ruang kosong dengan dekorasi yang tidak punya fungsi.
8.  Hindari copywriting yang terlalu bombastis, berulang, atau generik.
    Gunakan bahasa Indonesia yang jelas, natural, dan relevan dengan
    kebutuhan donatur.
9.  Jangan menulis klaim palsu tentang dampak, legalitas, verifikasi,
    atau keberhasilan transaksi.
10. Bangun dan periksa bertahap. Selesaikan fondasi dan komponen bersama
    sebelum memperluas implementasi ke semua halaman.
11. Jika instruksi baru bertentangan dengan dokumen ini, berhenti dan
    minta klarifikasi alih-alih menebak.
12. Prototype harus tetap berjalan tanpa backend dan tanpa kredensial
    eksternal.

------------------------------------------------------------------------

## 11. Tahapan kerja yang disarankan

1.  Audit project dan aset yang sudah ada.
2.  Finalisasi dokumen spesifikasi serta design system.
3.  Siapkan fondasi React + Vite, Tailwind, routing, font, token, dan
    struktur folder.
4.  Implementasikan komponen bersama.
5.  Implementasikan Beranda dan evaluasi desktop/mobile.
6.  Implementasikan halaman listing, detail, layanan, donasi, bantuan,
    akun, dan pencarian.
7.  Uji navigasi, interaksi, state, responsivitas, dan konsistensi data.

**Status dokumen:** spesifikasi produk dan frontend untuk prototype.
Dokumen ini bukan prompt implementasi dan tidak memerintahkan
pembangunan semua halaman sekaligus.
