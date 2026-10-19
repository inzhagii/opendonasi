# OPENDONASI_SPEC.md

## 1. Tujuan Dokumen
Dokumen ini adalah spesifikasi produk dan interaksi untuk prototype frontend OpenDonasi. Gunakan sebagai acuan implementasi di Antigravity bersama `GEMINI.md` dan `DESIGN_SYSTEM.md`.

- `GEMINI.md`: aturan kerja dan standar implementasi.
- `DESIGN_SYSTEM.md`: aturan visual dan komponen.
- `OPENDONASI_SPEC.md`: halaman, navigasi, perilaku, data dummy, dan batas prototype.

Dokumen ini merangkum keputusan yang sudah disepakati. Jangan menambahkan fitur atau mengubah keputusan utama tanpa alasan dan persetujuan.

## 2. Tujuan dan Batas Prototype

OpenDonasi adalah prototype frontend platform donasi dan layanan kebaikan. Tujuan utamanya adalah menunjukkan pengalaman pengguna dan alur halaman yang dapat diuji.

### Termasuk
- Beranda dan navigasi utama.
- Daftar program, kategori, filter, pengurutan, dan pencarian.
- Detail program, profil penggalang, berita, pencairan dana, dan daftar donatur.
- Landing layanan Zakat, Infaq, Sedekah, dan Wakaf.
- Kalkulator zakat.
- Form donasi dan halaman konfirmasi donasi simulasi.
- Akses akun sederhana tanpa autentikasi sungguhan.
- Data dummy lokal yang konsisten.

### Tidak termasuk
- Backend, database, CMS, autentikasi sungguhan, verifikasi identitas nyata, dan integrasi payment gateway.
- Pembayaran, transfer, pencairan dana, atau transaksi keuangan nyata.
- Klaim bahwa data demo merupakan data organisasi atau donatur sungguhan.
- Fitur admin atau dashboard pengelola, kecuali disepakati sebagai ruang lingkup baru.

Semua status dan nomor referensi transaksi harus jelas merupakan simulasi. Jangan mengklaim pembayaran berhasil secara nyata dan jangan mengubah total dana atau jumlah donatur akibat transaksi demo.

## 3. Prinsip Produk
1. Utamakan keterbacaan, kepercayaan, dan kemudahan menemukan program atau layanan.
2. Pertahankan visual yang bersih dan konsisten; jangan menambahkan dekorasi atau animasi berlebihan.
3. Nominal, progres, judul program, penggalang, dan sisa waktu memiliki hierarki yang jelas.
4. Komponen yang sama harus terlihat dan berperilaku konsisten lintas halaman.
5. Mobile bukan sekadar desktop yang diperkecil; susunan mengikuti wireframe responsif.
6. Tombol harus memiliki perilaku yang nyata di dalam prototype. Jangan menampilkan kontrol aktif tanpa fungsi.
7. Gunakan aset yang sudah disediakan dalam project sebelum membuat placeholder.
8. Jika keputusan wireframe dan implementasi bertentangan, pertahankan keputusan terbaru yang disetujui dan jangan mengubah desain diam-diam.

## 4. Peta Halaman

### Halaman utama
1. Beranda.
2. Program (daftar seluruh program).
3. Hasil Pencarian.
4. Landing Zakat.
5. Kalkulator Zakat.
6. Landing Infaq.
7. Landing Sedekah.
8. Landing Wakaf.
9. Form Donasi.
10. Konfirmasi Donasi.
11. Akun/Donasi Saya versi sederhana.

### Halaman terkait program
12. Detail Program Donasi.
13. Profil Penggalang Dana.
14. Berita Terbaru program.
15. Detail Berita.
16. Pencairan Dana.
17. Daftar Donatur.

### Halaman fallback
18. Halaman 404 (Halaman Tidak Ditemukan): Rute wildcard `*` menampilkan pesan bersahabat bahwa halaman tidak ditemukan, penjelasan singkat, dan tombol CTA 'Kembali ke Beranda'. Bukan panel pengujian internal pengembang.

Halaman turunan yang sudah dirancang pada Detail Program tidak boleh dibuat sebagai fitur kedua dengan tujuan yang sama. Berita Terbaru dan Detail Berita adalah satu rangkaian; Donatur dan Daftar Donatur adalah satu rangkaian; Pencairan Dana adalah satu halaman turunan; Kalkulator Zakat hanya satu halaman kalkulator yang dibuka dari landing Zakat.

## 5. Navigasi Umum

### Desktop
- Gunakan navbar utama dengan container maksimal 1320 px.
- Logo di kiri dan dapat diklik untuk kembali ke Beranda.
- Menu Program, Layanan, dan Bantuan berada di area tengah sesuai wireframe.
- Layanan dan Bantuan membuka popover/menu pilihan tanpa ikon panah dekoratif.
- Popover memiliki cara menutup yang jelas dan dapat ditutup dengan tombol close, klik di luar, atau Escape.
- Area kanan memuat Search, Daftar, dan Login dengan jarak yang nyaman; Daftar/Login berada di sisi paling kanan sesuai rancangan.
- Search bukan input dekoratif: Enter atau memilih rekomendasi membawa pengguna ke hasil pencarian atau tujuan khusus yang sesuai.

### Mobile
- Header umum memiliki lebar responsif; sekitar 430 px adalah acuan konten, bukan batas perangkat tetap.
- Logo berada di kiri, search di kanan.
- Beranda dan halaman umum menggunakan bottom navigation mobile sesuai wireframe awal. Itemnya mencakup Beranda, Program, tombol/akses donasi sesuai rancangan, dan Akun/Bantuan sesuai struktur final yang telah disepakati di desain.
- Saat masuk Detail Program, bottom navigation umum digantikan CTA tetap khusus halaman detail, dan tombol kembali tersedia pada area banner/header.
- Halaman khusus seperti Kalkulator Zakat, Form Donasi, Konfirmasi, Berita, Donatur, dan Pencairan Dana menggunakan header ringkas sesuai wireframe masing-masing.
- Jangan menampilkan dua navigasi bawah sekaligus.

### Navigasi kembali
- Gunakan riwayat navigasi jika tersedia agar pengguna dapat kembali ke konteks sebelumnya.
- Jika halaman dibuka langsung dan tidak memiliki riwayat yang berguna, sediakan fallback ke halaman induk yang masuk akal.
- Saat kembali dari Detail Program ke daftar program, pertahankan kategori/filter/posisi daftar jika sederhana untuk dilakukan.

## 6. Beranda

Urutan section:
1. Navbar/header sesuai perangkat.
2. Hero banner carousel.
3. Quick Action.
4. Unggulan.
5. Yang Baru di OpenDonasi.
6. Program.
7. Dukungan & Doa Orang Baik.
8. Footer.

### 6.1 Hero banner
- Awal berisi tiga banner.
- Rasio gambar 16:9.
- Desktop: maksimal 1320 px; mobile: maksimal konten sekitar 430 px sesuai wireframe.
- Gambar ditampilkan utuh tanpa crop (`object-contain`); hindari distorsi dan pemotongan subjek penting.
- Gambar banner grafis ditampilkan bersih tanpa overlay teks HTML atau gradasi gelap yang menduplikasi teks grafis poster. Aksesibilitas dipertahankan via atribut alt yang bermakna atau elemen pembaca layar (`sr-only`).
- Autoplay awal setiap 6 detik.
- Dapat digeser manual ke kanan/kiri dan berputar tanpa ujung secara natural.
- Memiliki dot indicator; hero Beranda tidak memakai tombol panah.
- Setelah interaksi manual, jeda autoplay sejenak agar tidak melawan pengguna.
- Klik banner mengarah sesuai isi banner. Banner tentang Zakat membuka landing Zakat; banner program membuka halaman terkait.
- Jika aset banner memiliki rasio yang berbeda, pertahankan gambar utuh dan izinkan ruang kosong yang wajar daripada memotong bagian penting.

### 6.2 Quick Action
- Menggunakan ikon yang disediakan dalam aset project.
- Pengecualian sementara yang disetujui: Layanan Zakat menggunakan aset `src/assets/icons/icons_kategori/zakat.svg` karena keterbatasan aset layanan yang tersedia. Jangan mengganti ikon Infaq atau Wakaf tanpa aset alternatif yang terbukti sesuai.
- Selalu tampilkan teks “Mau berbuat baik apa hari ini?” atau copy final yang telah disepakati.
- Desktop: heading rata tengah; mobile: rata kiri.
- Mobile menampilkan empat item awal; jika lebih banyak, gunakan carousel horizontal.
- Wadah ikon acuan 56 × 56 px.
- State awal: wadah biru, ikon putih. Hover/focus desktop: wadah putih, ikon biru, border biru, dengan transisi ringan.
- Keterangan berada di bawah wadah ikon, ukurannya nyaman dibaca.
- Desktop menggunakan susunan yang lebih lapang, tidak ramai, dan mengikuti karakter komponen mobile.

### 6.3 Unggulan
- Menggunakan komponen Card Biasa.
- Desktop: tiga kartu utama dan bagian kartu berikutnya sedikit terlihat di kiri/kanan. Lebar area section maksimal 1320 px.
- Mobile: dua kartu utama dan peek kartu di kiri/kanan. Section ini full-width pada mobile.
- Carousel dapat digeser manual dan infinite loop; susunan tiga kartu utama (desktop) atau dua kartu utama (mobile) tetap seimbang setelah bergeser.
- Gunakan fade/overlay putih pada ujung carousel secara halus bila diperlukan, tanpa efek 3D.
- Tampilkan tombol panah desktop sesuai wireframe.
- Tidak ada tombol “Lihat Selengkapnya” untuk Unggulan.

### 6.4 Yang Baru di OpenDonasi
- Gambar rasio 16:9.
- Satu banner utama dengan sedikit bagian banner di kiri/kanan terlihat; peek lebih kecil daripada Unggulan, hanya beberapa persen dan disesuaikan agar fokus tetap pada banner utama.
- Desktop maksimal 1320 px; mobile full-width.
- Dapat digeser manual dan autoplay dengan jeda yang nyaman.
- Infinite loop tanpa efek putar 3D atau gerakan berlebihan.

### 6.5 Program di Beranda
- Heading section sesuai rancangan.
- Kategori tampil tepat di bawah judul; kategori dapat digeser horizontal pada mobile.
- Desktop menampilkan 9 Card Biasa dalam grid 3 × 3.
- Tombol “Lihat Selengkapnya” membuka halaman Program yang menampilkan daftar program lengkap.
- Mobile menampilkan Card Horizontal satu per baris, enam kartu awal, lalu tautan/tombol menuju daftar program lengkap.
- Jangan menggandakan komponen card dengan desain berbeda dari halaman lain.

### 6.6 Dukungan & Doa Orang Baik
- Menggunakan Card Doa dengan susunan profil/inisial, nama, waktu, judul program atau layanan, pesan, dan aksi Aamiin.
- Jangan menampilkan kalimat “berdonasi untuk program” atau label sejenis; cukup nama program atau layanan sebagai tautan biru.
- Tautan program/layanan membuka detail terkait.
- Aamiin berfungsi sebagai aksi like sederhana dan menampilkan jumlahnya jika tersedia pada data dummy.
- Card dapat diklik untuk membuka popover detail dengan tombol close; pada mobile boleh menggunakan bottom sheet.
- Satu baris horizontal dengan gerakan carousel otomatis yang pelan dan dapat digeser manual.
- Acuan ukuran mobile sekitar 198 × 202 px, disesuaikan secara responsif tanpa membuat konten rapat.
- Section full-width pada mobile.

### 6.7 Footer
- Mengikuti susunan footer yang sudah direncanakan.
- Memuat navigasi informasi dan ikon sosial media dari aset yang disediakan jika tersedia.
- Desktop dan mobile responsif; jarak antar kelompok cukup dan tidak berdempetan.
- Section footer full-width pada mobile.

## 7. Komponen Card Program

Gunakan komponen yang sama di Beranda, Program, Pencarian, Profil Penggalang, dan rekomendasi.

### 7.1 Card Biasa
- Desktop: gambar 16:9 di bagian atas; informasi berada dalam satu wadah yang menyatu dengan gambar.
- Padding area teks acuan: top 16 px, kiri/kanan 24 px, bottom 48 px pada desain desktop referensi; sesuaikan responsif agar tidak boros ruang di layar kecil.
- Nominal dana terkumpul dan progress bar selalu terlihat langsung. Persentase numerik donasi ditampilkan secara eksklusif melalui tooltip saat kursor hover di atas indikator progres pada desktop. Pada mobile, progres disajikan visual melalui bilah progres bar tanpa mewajibkan persentase numerik terlihat terus-menerus.
- Tidak memakai efek dekoratif yang tidak diperlukan.

### 7.2 Card Horizontal
- Mobile: satu card per baris, gambar di kiri sekitar 50% lebar card dan informasi di kanan.
- Gambar tetap rasio 16:9.
- Informasi: judul, penggalang, indikator progres, dana terkumpul, dan sisa hari dengan ikon `time.svg`.
- Progress dan informasi penting terlihat tanpa hover.
- Jaga ruang antarteks; jangan mengecilkan teks utama secara berlebihan.
- Ukuran gambar dan teks menyesuaikan lebar layar; 430 px hanya acuan desain, bukan fixed width.

### 7.3 Perilaku card
- Klik card membuka Detail Program yang sesuai.
- Semua informasi pada card dan detail harus berasal dari record program yang sama.
- Data dummy harus konsisten antarhalaman.
- Jangan mengarang persentase, nominal, atau sisa waktu yang tidak konsisten dengan data.

## 8. Halaman Program

### Struktur
1. Navbar utama.
2. Hero/banner carousel 16:9.
3. Toolbar kategori, filter, dan urutkan.
4. Daftar program.

### Banner
- Desktop maksimal 1320 px; mobile full-width.
- Awal dapat menggunakan tiga banner dan perilaku carousel mengikuti komponen banner yang sama jika cocok dengan konten.
- Autoplay, drag/swipe, dan infinite loop mengikuti spesifikasi banner.
- Klik banner mengikuti tujuan kontennya.

### Toolbar
Toolbar memuat:
- Semua Kategori.
- Filter.
- Urutkan.

Kategori terpisah dari filter; jangan memasukkan kategori sebagai pilihan di dalam Filter.

**Semua Kategori**
- Membuka popover berisi kategori dan ikon yang tersedia.
- Memilih kategori menyaring daftar.
- Pilihan aktif terlihat dan pengguna dapat kembali ke semua kategori.

**Filter**
- Membuka popover filter program sesuai data dummy dan wireframe yang disepakati.
- Filter dapat mencakup status program atau rentang nominal/target bila datanya tersedia.
- Jangan menampilkan opsi filter yang tidak memiliki fungsi.
- Tidak memuat pilihan kategori.

**Urutkan**
- Terbaru.
- Dana terkumpul terbanyak.
- Mendekati target.
- Urutan “mendekati target” menggunakan data progres yang tersedia; jangan mengarang nilai.

Toolbar dan popover harus nyaman dipakai pada desktop maupun mobile; pada layar kecil, popover boleh berubah menjadi panel/bottom sheet.

### Daftar program
- Desktop: grid tiga kolom, jarak antarcard konsisten.
- Mobile: Card Horizontal satu per baris, maksimal lebar konten sekitar 430 px sebagai acuan responsif.
- Hasil kategori/filter/sort memperbarui daftar.
- “Lihat Selengkapnya” memuat kartu tambahan pada halaman yang sama atau membuka daftar lengkap sesuai konteks; pada Beranda, tombol membuka halaman Program.
- State kosong menampilkan pesan yang membantu dan cara membersihkan filter.
- Jangan menampilkan hasil yang tidak sesuai dengan filter aktif.

## 9. Pencarian

### Search control
- Desktop tersedia di sisi kanan navbar; mobile tersedia di kanan logo.
- Tampilan pencarian dibuat jelas dan menarik secara sederhana, bukan input polos tanpa hierarki.
- Search dapat dibuka sebagai input/overlay sesuai wireframe.
- Tersedia tombol close yang jelas.
- Ketik sebagian kata, misalnya “ban”, menampilkan rekomendasi yang relevan jika data dummy cocok.
- Rekomendasi tidak boleh dibuat seolah-olah hasil nyata dari server; gunakan pencocokan data lokal.
- Enter atau memilih rekomendasi membuka tujuan yang tepat.

### Halaman Hasil Pencarian
- Bagian atas memuat input dengan kata yang dicari dan tombol close/kembali.
- Di bawahnya langsung hasil yang relevan; tidak ada kategori atau toolbar filter tambahan.
- Hasil program menggunakan Card Biasa pada desktop dan Card Horizontal pada mobile, konsisten dengan halaman lain.
- Pencarian dilakukan terhadap judul program, penggalang, dan istilah relevan dari data dummy.
- Pencarian istilah layanan khusus seperti “zakat” dapat diarahkan ke landing Zakat jika intent-nya jelas; pencarian program terkait zakat tetap dapat menunjukkan program yang cocok bila sesuai.
- Jika tidak ada hasil, tampilkan empty state yang sopan dengan kata kunci dan saran mencoba istilah lain.
- Menutup pencarian kembali ke konteks sebelumnya jika memungkinkan.

## 10. Landing Layanan

Layanan: Zakat, Infaq, Sedekah, dan Wakaf.

### Header layanan
- Mobile menggunakan header ringkas dengan tombol kembali, nama layanan, dan X/close sesuai wireframe.
- Desktop menggunakan navbar utama, sesuai keputusan terbaru untuk halaman layanan desktop.
- Gunakan warna aksen khusus layanan secara terbatas; design system, kartu program, tipografi, spacing, dan kontrol tetap konsisten.
- Aksen layanan tidak mengganti warna biru pada card program.

### Struktur umum
1. Header.
2. Banner layanan 16:9, carousel jika tersedia.
3. Toolbar kategori, filter, dan urutkan khusus layanan.
4. Konten khusus layanan.
5. Daftar Card Biasa (desktop) atau Card Horizontal (mobile).

### Zakat
- Landing Zakat memiliki banner, toolbar, bagian Kalkulator Zakat, lalu daftar program zakat.
- Kategori/filter/urutkan khusus zakat tetap hanya menampilkan opsi yang relevan dan didukung data.
- CTA “Hitung Zakat”/“Hitung Sekarang” membuka halaman Kalkulator Zakat. Kalkulator tidak ditempatkan sebagai form panjang langsung di landing.
- CTA zakat pada detail program atau alur donasi memakai aksen zakat sesuai desain; card program tetap biru.

### Infaq, Sedekah, dan Wakaf
- Struktur dasarnya mengikuti landing Zakat tanpa kalkulator.
- Masing-masing memiliki aksen layanan berbeda sesuai design system.
- Daftar program, toolbar, dan card tetap menggunakan komponen bersama.
- Klik program membuka Detail Program yang sesuai.

## 11. Kalkulator Zakat

Kalkulator hanya satu halaman, dibuka dari CTA pada landing Zakat.

### Header dan pilihan jenis
- Header ringkas dengan tombol kembali dan judul halaman.
- Pilihan jenis: Penghasilan dan Maal.
- Default: Penghasilan.
- Pengguna dapat berganti jenis; input menyesuaikan jenis yang dipilih.
- Input dikelompokkan per bagian, disertai penjelasan ringkas dan bantuan kontekstual.

### Zakat Penghasilan
- Input penghasilan bulanan.
- Input penghasilan tambahan bila ada.
- Input pengurang yang relevan bila digunakan oleh rumus yang dipilih.
- Tampilkan nisab/acuan yang digunakan dan sumber/label acuan secara transparan sebagai data konfigurasi demo.
- Beri keterangan bahwa hasil adalah estimasi dan aturan dapat berbeda menurut acuan yang digunakan.
- Perhitungan zakat 2,5% diterapkan hanya ketika ketentuan nisab yang digunakan terpenuhi.

### Zakat Maal
- Input nilai harta relevan, misalnya uang/tabungan dan aset yang masuk perhitungan.
- Input kewajiban/utang jangka pendek yang diperhitungkan, bila disertakan dalam rumus.
- Input periode kepemilikan/haul bila relevan.
- Tampilkan acuan nisab dan aturan haul yang dipakai.
- Hindari mengklaim semua jenis aset mengikuti satu rumus; jelaskan cakupan kalkulator prototype.

### Hasil
- Tombol hitung memvalidasi input.
- Hasil menampilkan nilai dasar yang dihitung, acuan nisab, status memenuhi/belum memenuhi, persentase, dan estimasi zakat.
- Sediakan aksi hitung ulang/edit input.
- Jika memenuhi ketentuan, CTA untuk melanjutkan ke donasi zakat membuka Form Donasi dengan nominal awal dari hasil kalkulator. Nominal tersebut tetap bisa diubah.
- Jika belum memenuhi nisab, jelaskan hasil dengan netral dan jangan memaksa pengguna berdonasi.
- Nilai nisab dan contoh angka harus disimpan sebagai konfigurasi dummy yang jelas dan mudah diperbarui, bukan disebar di banyak komponen.
- Kalkulator merupakan estimasi edukatif, bukan konsultasi atau keputusan keagamaan yang mengikat.

## 12. Detail Program Donasi

### Navigasi dan banner
- Tidak menggunakan navbar utama.
- Banner program 16:9, desktop maksimal 1320 px dan mobile full-width.
- Gambar sesuai card program dan ditampilkan tanpa distorsi.
- Tombol kembali di kiri atas banner.
- Tombol Share di kanan atas banner.
- Klik kembali menggunakan riwayat sebelumnya; jika tidak ada, fallback ke halaman Program.

### Ringkasan program
Urutan informasi:
1. Judul program.
2. Dana terkumpul dan target.
3. Sisa hari dengan ikon `time.svg`.
4. Progress dan persentase.
5. Jumlah donatur.
6. Identitas penggalang yang dapat diklik.
7. Tentang Program.
8. Berita Terbaru.
9. Pencairan Dana.
10. Donatur.

Gunakan container desktop maksimal 1320 px dan padding yang nyaman. Pada layar kecil, susun informasi bertumpuk agar mudah dibaca.

### Penggalang
- Tampilkan nama dan identitas singkat.
- Klik identitas membuka Profil Penggalang Dana; jangan menduplikasi halaman profil di popover bila tujuan pengguna adalah melihat profil lengkap.
- Jika ada status verifikasi, hanya tampilkan jika tersedia pada data dummy.

### Tentang Program
- Tampilkan cuplikan cerita.
- Gunakan fade putih ringan di bagian bawah dan aksi “Lihat Selengkapnya”.
- Klik memperluas teks secara inline; sediakan “Tampilkan lebih sedikit”.
- Hindari gradient dekoratif berwarna.

### Baris navigasi turunan
- Berita Terbaru: ringkasan jumlah/pembaruan dan navigasi ke halaman Berita Terbaru program.
- Pencairan Dana: ringkasan dan navigasi ke halaman Pencairan Dana.
- Donatur: jumlah donatur dan navigasi ke Daftar Donatur.
- Baris dapat diklik dan memiliki affordance yang jelas.

### CTA tetap
- Desktop: Share berada di banner dan CTA Donasi berada di area ringkasan dana.
- Mobile: action bar tetap di bawah berisi hanya tombol Donasi Sekarang dengan lebar penuh area aksi.
- Tidak ada tombol Share di bottom action bar.
- Action bar mobile menggantikan bottom navigation umum di halaman detail.
- Beri padding bawah agar konten tidak tertutup CTA.
- CTA membuka Form Donasi untuk program yang sedang dilihat.

## 13. Profil Penggalang Dana

- Header ringkas menampilkan nama halaman dan tombol kembali; tidak memakai navbar utama.
- Tampilkan avatar/logo, nama penggalang, jenis penggalang, deskripsi singkat, dan status verifikasi hanya jika tersedia.
- Daftar program yang dimiliki penggalang menggunakan Card Biasa dan Card Horizontal yang sama dengan halaman lain.
- Desktop: daftar program dalam carousel horizontal dengan kontrol yang jelas.
- Mobile: Card Horizontal satu per baris, ditumpuk ke bawah.
- Klik program membuka Detail Program.
- Jika belum ada program, tampilkan empty state yang sederhana.
- Jangan membuat card khusus yang menyimpang dari ukuran dan informasi card global.

## 14. Berita Terbaru dan Detail Berita

### Berita Terbaru
- Dibuka dari baris Berita Terbaru pada Detail Program.
- Header ringkas dengan tombol kembali dan judul.
- Daftar berita milik program tersebut, terbaru di bagian atas.
- Setiap item dapat berisi gambar jika tersedia, judul, tanggal, ringkasan, dan tautan “Selengkapnya”.
- Gunakan layout bersih dan mudah dibaca; jangan menggunakan navbar utama.

### Detail Berita
- Dibuka saat pengguna memilih item berita.
- Header ringkas dengan tombol kembali.
- Tampilkan judul, tanggal, penggalang, gambar utama bila ada, dan isi berita.
- Tampilkan tautan ke program terkait agar pengguna dapat kembali ke Detail Program.
- Jika berita tidak ditemukan, tampilkan pesan dan aksi kembali.
- Detail Berita adalah kelanjutan Berita Terbaru, bukan fitur berita terpisah.

## 15. Pencairan Dana

- Dibuka dari bagian Pencairan Dana pada Detail Program.
- Header ringkas dengan tombol kembali dan judul.
- Daftar pencairan diurutkan dari tanggal terbaru.
- Setiap item menampilkan nominal, tanggal, tujuan/ringkasan penggunaan, dan informasi publik yang relevan.
- Jangan menampilkan nomor rekening pribadi lengkap.
- Data harus berasal dari data dummy yang konsisten dan diberi konteks sebagai informasi simulasi jika tidak ada data aktual.
- Jika belum ada pencairan, tampilkan empty state yang jelas.

## 16. Daftar Donatur

- Dibuka dari bagian Donatur pada Detail Program.
- Header ringkas dengan tombol kembali dan judul.
- Tiga tab/filter: Terbaru, Dengan Doa, Terbesar.

### Terbaru
- Semua donasi, baik dengan doa maupun tanpa doa.
- Urutan waktu terbaru ke terlama.
- Tampilkan nama publik/inisial, waktu, dan nominal sesuai pengaturan privasi dummy.

### Dengan Doa
- Hanya donasi yang memiliki pesan doa.
- Tampilkan nama/inisial, waktu, nominal, dan pesan.
- Tombol Aamiin berfungsi sebagai interaksi demo; jumlah dapat berubah lokal jika diimplementasikan, tetapi tidak memengaruhi dana terkumpul.

### Terbesar
- Semua donasi, dengan atau tanpa doa.
- Urutkan nominal terbesar ke terkecil.

### Aturan privasi dan interaksi
- Donasi anonim ditampilkan sebagai “Hamba Allah” atau label anonim yang disepakati.
- Jangan menampilkan informasi pribadi yang tidak diperlukan.
- Tab aktif harus jelas.
- Pergantian tab memperbarui daftar tanpa membuka halaman baru.
- Jika daftar kosong, tampilkan empty state.
- Daftar dapat memuat data tambahan bila diperlukan, tanpa menambah sistem backend.

## 17. Form Donasi

### Navigasi dan layout
- Form dibuka dari CTA Donasi Sekarang pada Detail Program atau CTA layanan yang relevan.
- Tidak perlu navbar utama; gunakan header ringkas dengan tombol kembali dan judul yang jelas.
- Layout satu kolom pada desktop maupun mobile; lebar form dibatasi agar mudah dibaca.
- Pada bagian atas, banner program di kiri dan judul program serta penggalang di kanan pada desktop. Mobile menyesuaikan secara responsif tanpa mengubah hierarki.
- Di samping banner hanya tampil judul dan nama penggalang dana, bukan ringkasan panjang.

### Urutan form
1. Ringkasan program (banner, judul, penggalang).
2. Pilih nominal donasi.
3. Nominal cepat dan input nominal sendiri.
4. Nama donatur.
5. Pilihan “Sembunyikan nama saya” di bawah input nama donatur.
6. Nomor telepon.
7. Metode pembayaran.
8. Doa/pesan.
9. Ringkasan donasi di bawah bagian doa/pesan.
10. CTA lanjutkan.

### Perilaku
- Nominal cepat dapat dipilih; pilihan aktif terlihat.
- Input nominal sendiri memperbarui total secara otomatis.
- Validasi nominal harus menghindari nilai kosong atau tidak valid.
- Nama donatur dan nomor telepon memiliki label dan validasi sederhana.
- “Sembunyikan nama saya” membuat nama pada tampilan publik menjadi anonim; tidak menghapus data form yang diperlukan oleh simulasi.
- Metode pembayaran membuka popover/panel pilihan pada desktop dan mobile. Pilihan hanya metode demo, tidak memulai pembayaran sungguhan.
- Doa/pesan bersifat opsional.
- Ringkasan donasi berada di bawah doa/pesan, bukan di samping form.
- Biaya layanan prototype Rp0.
- Total diperbarui otomatis dan tetap bisa ditinjau sebelum lanjut.
- Tombol lanjutkan membawa data form ke halaman Konfirmasi Donasi.
- Jangan mengirim data ke layanan eksternal.

## 18. Konfirmasi Donasi

- Dibuka setelah form donasi valid dikirim secara lokal.
- Menampilkan nama program, nominal, metode demo, status, dan nomor referensi simulasi.
- Nomor atau petunjuk pembayaran harus jelas bertanda **DEMO** dan tidak boleh terlihat seperti nomor pembayaran aktif.
- Status awal dapat berupa “Menunggu Pembayaran”.
- Jangan menampilkan tombol “Simulasikan Berhasil” di halaman Menunggu Pembayaran.
- Skenario “Berhasil” adalah skenario demo terpisah, bukan aksi pembayaran nyata pada halaman menunggu.
- Sediakan navigasi kembali ke Detail Program dan/atau Beranda sesuai wireframe.
- Status demo tidak mengubah dana terkumpul atau jumlah donatur.
- Jangan mengklaim transaksi benar-benar dibayar, diterima, atau dicairkan.

## 19. Akun dan Donasi Saya

- Prototype tidak menggunakan autentikasi sungguhan.
- Akses Akun dapat menampilkan pilihan sederhana untuk masuk/daftar demo atau menjelaskan bahwa fitur akun hanya simulasi.
- Jangan meminta kata sandi sungguhan atau mengirim kredensial ke layanan mana pun.
- Jika menyediakan form demo, gunakan data lokal dan jelaskan bahwa ini bukan login nyata.
- Donasi Saya hanya menampilkan riwayat dummy atau status demo yang tersedia.
- Saat belum ada data, tampilkan empty state dengan jalur kembali ke Program atau Beranda.
- Jangan membuat dashboard kompleks atau pengelolaan akun di luar kebutuhan prototype.

## 20. Data Dummy dan Aturan Konsistensi

- Simpan data program, kategori, penggalang, banner, berita, pencairan, dan donatur di sumber lokal yang terpusat.
- Gunakan ID stabil untuk menghubungkan card, detail, berita, profil, pencairan, dan donatur.
- Jangan menyalin record program yang sama ke banyak file dengan nilai berbeda.
- Jika data nominal dan target tersedia, progress dihitung dari data tersebut dan dibatasi pada rentang yang masuk akal.
- Data tanggal, sisa hari, total dana, jumlah donatur, dan persentase harus konsisten satu sama lain.
- Tandai data demo secara jelas pada halaman transaksi.
- Gunakan placeholder bila aset tidak tersedia, bukan URL atau file yang ditebak.
- Tidak perlu state management library untuk prototype jika state React sederhana sudah cukup.

## 21. State UI Wajib

Sediakan state yang sesuai untuk:
- Loading sederhana bila diperlukan.
- Tidak ada hasil pencarian.
- Tidak ada program setelah filter.
- Kategori/filter tidak memiliki hasil.
- Program, berita, atau penggalang tidak ditemukan.
- Form invalid dan pesan validasi.
- Kalkulator dengan input kosong, input invalid, memenuhi nisab, dan belum memenuhi nisab.
- Belum ada berita, pencairan, atau donatur.
- Gambar gagal dimuat.
- Status transaksi demo menunggu dan skenario berhasil terpisah.
- Aksi yang tidak tersedia atau belum diimplementasikan.

## 22. Responsivitas dan Performa
- Container desktop utama maksimal 1320 px.
- Nilai 430 px adalah acuan desain konten mobile, bukan fixed width.
- Section yang sudah disepakati full-width di mobile: Unggulan, Yang Baru di OpenDonasi, Dukungan & Doa, Footer, dan banner sesuai wireframe.
- Section full-width tetap memiliki padding konten yang nyaman.
- Hindari horizontal overflow, card yang saling menimpa, dan CTA yang menutupi konten.
- Carousel harus tetap dapat digunakan dengan swipe/drag dan kontrol yang sesuai.
- Gunakan animasi ringan saja dan hormati preferensi reduced motion jika memungkinkan.

## 23. Routing yang Disarankan

Gunakan React Router dengan route sederhana dan nama yang jelas. Nama route dapat disesuaikan dengan struktur project, tetapi tujuan halaman tidak boleh berubah.

- `/` — Beranda
- `/program` — daftar program
- `/program/:programId` — Detail Program
- `/penggalang/:organizerId` — Profil Penggalang
- `/program/:programId/berita` — Berita Terbaru
- `/berita/:newsId` — Detail Berita
- `/program/:programId/pencairan` — Pencairan Dana
- `/program/:programId/donatur` — Daftar Donatur
- `/search?q=...` — Hasil Pencarian
- `/zakat` — Landing Zakat
- `/zakat/kalkulator` — Kalkulator Zakat
- `/infaq` — Landing Infaq
- `/sedekah` — Landing Sedekah
- `/wakaf` — Landing Wakaf
- `/donasi/:programId` — Form Donasi
- `/konfirmasi/:referenceId` — Konfirmasi Donasi demo
- `/akun` — Akun/Donasi Saya demo

Routing dapat memakai query parameter untuk kata pencarian, kategori, filter, atau urutan jika membantu mempertahankan konteks. Jangan menambah kompleksitas routing yang tidak diperlukan.

## 24. Prioritas Implementasi

Implementasikan bertahap agar mudah diuji:

1. Audit project React, dependensi, dan aset yang tersedia.
2. Buat token visual dan layout bersama sesuai `DESIGN_SYSTEM.md`.
3. Buat routing dan layout navigasi desktop/mobile.
4. Buat sumber data dummy terpusat dan komponen Card Biasa/Card Horizontal.
5. Implementasikan Beranda dan carousel.
6. Implementasikan daftar Program, kategori/filter/urutkan, dan Pencarian.
7. Implementasikan Detail Program beserta halaman turunan.
8. Implementasikan landing layanan dan Kalkulator Zakat.
9. Implementasikan Form Donasi dan Konfirmasi demo.
10. Implementasikan Akun/Donasi Saya demo.
11. Uji responsivitas, seluruh tombol, state kosong, konsistensi data, lint/build yang tersedia.

Jangan mengimplementasikan semua halaman sebagai satu komponen besar. Gunakan komponen reusable dan struktur feature-based yang ringan sesuai `GEMINI.md`.

## 25. Kriteria Selesai Prototype

Prototype dapat dianggap siap diuji jika:
- Semua route utama dapat dibuka dan kembali dengan benar.
- Card program yang sama menampilkan data konsisten di seluruh halaman.
- Navbar, popover, search, kategori, filter, sort, dan carousel bekerja sesuai rancangan.
- CTA landing layanan dan hasil kalkulator mengarah ke tujuan yang benar.
- Form donasi memperbarui nominal dan total serta meneruskan data ke halaman konfirmasi.
- Status transaksi jelas merupakan demo dan tidak mengubah total dana.
- Detail Program dapat membuka Profil Penggalang, Berita, Pencairan Dana, dan Daftar Donatur.
- Semua tombol terlihat aktif memiliki perilaku yang sesuai.
- Tampilan desktop dan mobile tidak mengalami overflow atau konten tertutup.
- Tidak ada aset atau halaman yang dihapus tanpa alasan dan pemeriksaan.
- Build dan pemeriksaan yang tersedia telah dijalankan; hasilnya dilaporkan secara jujur.

## 26. Penanganan Ambiguitas
- Keputusan terbaru yang secara eksplisit disetujui pengguna menjadi acuan.
- Jangan menanyakan ulang keputusan yang sudah jelas.
- Jika ada detail kecil yang belum ditentukan, pilih solusi sederhana yang konsisten dengan dokumen dan mudah direvisi.
- Jika ketidakpastian dapat mengubah alur utama, desain, data, privasi, atau scope, berhenti dan minta klarifikasi sebelum mengimplementasikan.
- Jangan menganggap rekomendasi baru sebagai keputusan final tanpa persetujuan.
