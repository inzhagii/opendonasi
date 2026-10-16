# GEMINI.md --- Panduan Kerja Antigravity untuk OpenDonasi

Dokumen ini berisi aturan kerja untuk AI coding assistant yang membantu
mengembangkan prototype OpenDonasi. Baca dokumen ini sebelum mengubah
kode atau aset project.

## 1. Baca acuan sebelum bekerja

Sebelum mengerjakan task, baca: - `OPENDONASI_SPEC.md` --- tujuan
produk, halaman, wireframe, navigasi, dan interaksi. -
`DESIGN_SYSTEM.md` --- aturan visual, token, tipografi, komponen, aset,
dan responsivitas.

Keduanya adalah acuan utama. Jangan menebak kebutuhan yang sudah
dijelaskan di sana. Jika ada konflik atau informasi yang belum jelas,
berhenti dan tanyakan kepada pengguna sebelum membuat perubahan besar.

## 2. Konteks dan batas project

OpenDonasi saat ini adalah **prototype frontend**, bukan produk backend
siap produksi.

Gunakan project React + Vite yang sudah ada. Jangan membuat project baru
atau mengganti konfigurasi dari nol kecuali project yang ada memang
rusak dan pengguna menyetujui perbaikan tersebut.

Cakupan saat ini: - React + Vite. - Tailwind CSS sesuai konfigurasi yang
sudah ada atau versi stabil yang cocok dengan project. - Routing React
untuk halaman publik. - Data dummy bersama. - Interaksi frontend dan
simulasi lokal.

Jangan menambahkan backend, database, CMS, payment gateway, autentikasi
sungguhan, dashboard admin/page-builder, atau integrasi eksternal yang
membutuhkan kredensial. Jangan mengklaim transaksi simulasi sebagai
pembayaran nyata.

## 3. Cara bekerja

-   Kerjakan tugas sesuai permintaan pengguna saat ini; jangan melompat
    ke implementasi semua halaman jika pengguna hanya meminta audit atau
    setup.
-   Sebelum mengedit, periksa struktur file dan isi file yang berkaitan.
-   Berikan rencana singkat untuk perubahan yang luas atau berisiko.
    Untuk perubahan kecil dan jelas, langsung kerjakan.
-   Utamakan perubahan kecil yang terarah, bukan menulis ulang file atau
    konfigurasi yang tidak berkaitan.
-   Pertahankan pekerjaan yang sudah ada. Jangan menghapus aset, file,
    komponen, atau konfigurasi tanpa memeriksa kegunaannya.
-   Jangan mengubah banyak hal sekaligus jika perubahan tersebut
    menyulitkan penelusuran penyebab masalah.
-   Setelah perubahan, jalankan pemeriksaan yang tersedia, misalnya
    build atau lint, lalu perbaiki error yang disebabkan oleh perubahan
    tersebut.
-   Laporkan secara ringkas file yang diubah, apa yang dilakukan, hasil
    pemeriksaan, dan hal yang belum selesai.
-   Jangan menyatakan berhasil jika pemeriksaan belum dijalankan atau
    hasilnya belum diketahui.
-   Jangan membuat commit, menghapus file, memasang dependensi besar,
    atau melakukan perubahan destruktif tanpa alasan yang jelas; minta
    persetujuan jika dampaknya signifikan.

## 4. Arah visual yang tidak boleh melenceng

-   Font utama: **Inter**.
-   Warna utama brand: **`#2E7DFA`**.
-   Latar utama putih; warna aksen dipakai secukupnya.
-   Konten desktop maksimal 1320 px dan terpusat.
-   Acuan desain mobile maksimal 448 px, tetapi tetap responsif terhadap
    lebar perangkat.
-   Gunakan skala tipografi, spacing, radius, border, dan shadow dari
    `DESIGN_SYSTEM.md`.
-   Gunakan tampilan bersih, hangat, natural, dan terpercaya. Hindari
    gaya generik yang penuh gradient, efek dekoratif, badge, animasi,
    atau kartu tanpa kebutuhan.
-   Jangan menambah section, fitur, konten promosi, atau dekorasi yang
    tidak ada di spesifikasi.
-   Jangan mengganti warna utama atau font tanpa persetujuan pengguna.

### Aturan gambar dan ikon

-   Gunakan aset yang tersedia di project setelah memeriksa file dan
    fungsinya.
-   `icons_kategori` digunakan untuk kategori program.
-   `icons_layanan` digunakan untuk Donasi, Zakat, Infaq, Sedekah, dan
    Wakaf.
-   Jangan menukar fungsi kedua kelompok ikon.
-   Semua gambar kartu program memakai rasio **16:9** pada desktop dan
    mobile.
-   Banner/poster yang mengandung tulisan atau komposisi penting harus
    ditampilkan utuh tanpa crop. Utamakan `object-fit: contain`; jangan
    memakai `cover` untuk poster yang perlu terlihat lengkap.
-   Boleh memperkecil banner. Hindari meregangkan gambar sampai teks
    atau logo terlihat gepeng; atur area tampilan terlebih dahulu.
-   Jangan mengganti aset dengan gambar baru atau placeholder tanpa
    alasan dan tanpa memeriksa aset yang sudah tersedia.
-   Jangan menghapus atau memindahkan file aset yang belum
    teridentifikasi.

## 5. Aturan komponen dan data

-   Gunakan komponen bersama untuk elemen berulang seperti Navbar,
    MobileBottomNav, Button, SectionHeader, CampaignCard, ProgressBar,
    Carousel, Popover, Modal, input, dan state UI.
-   Gunakan satu komponen utama `CampaignCard` di berbagai halaman.
    Variasi hanya dibuat bila kebutuhan layout berbeda, bukan dengan
    menduplikasi komponen.
-   Nominal dana terkumpul dan progress program harus selalu terlihat;
    jangan menyembunyikannya di hover.
-   Progress, nominal, target, dan persentase harus konsisten. Jangan
    mengarang angka atau klaim nyata.
-   Gunakan satu sumber data dummy untuk program, kategori, donatur,
    FAQ, dan riwayat donasi.
-   Gunakan ID atau slug stabil untuk menghubungkan kartu dan detail
    program.
-   Data dummy harus jelas sebagai data prototype jika berpotensi
    dianggap sebagai data nyata.
-   Pesan dukungan donatur bersifat opsional. Jangan membuat pesan palsu
    pada setiap kartu.
-   Status transaksi harus dibedakan dari status program. "Menunggu
    Pembayaran" tidak boleh disebut berhasil.
-   Simulasi donasi harus menyatakan dengan jelas bahwa pembayaran tidak
    sungguhan.

## 6. Routing dan interaksi

Semua halaman publik yang ditetapkan di `OPENDONASI_SPEC.md` harus
menggunakan routing React saat halaman-halaman tersebut
diimplementasikan.

Pastikan kontrol memiliki perilaku nyata: - Logo menuju Beranda. - Kartu
program membuka detail program yang sesuai. - Search membawa kata kunci
ke hasil pencarian. - Filter, urutkan, kategori, dan popover memperbarui
atau menampilkan pilihan yang sesuai. - Accordion FAQ dapat dibuka dan
ditutup. - Tombol Aamiin dapat ditekan dan dibatalkan dalam state
lokal. - Tombol Bagikan menggunakan share API bila tersedia atau
menyediakan opsi salin tautan. - Form donasi memvalidasi data dan
memperbarui total nominal. - Alur hasil donasi menampilkan status
simulasi yang tepat. - Donasi Saya hanya berada di area Profil/Akun,
bukan menu Bantuan. - Kontak menggunakan email/WhatsApp yang disediakan
atau placeholder yang jelas; jangan mengarang kontak nyata.

Jangan membuat tombol dekoratif yang tidak berfungsi atau menghubungkan
semua kartu ke satu halaman detail yang sama jika setiap kartu mewakili
program berbeda.

## 7. Responsivitas dan aksesibilitas

-   Ikuti breakpoint standar Tailwind dan evaluasi ukuran transisi.
-   Uji desktop, ukuran transisi, serta mobile sekitar 390--448 px.
-   Jangan menyelesaikan masalah layout dengan mengecilkan semua teks.
-   Cegah horizontal overflow pada halaman.
-   Pastikan popover, modal, header, dan bottom navigation tidak
    menutupi konten penting.
-   Beri ruang bawah untuk konten yang berada di atas bottom navigation
    tetap.
-   Kontrol interaktif harus punya label yang jelas dan state fokus yang
    terlihat.
-   Jangan mengandalkan warna saja untuk menyampaikan status.
-   Hormati `prefers-reduced-motion` jika memungkinkan.
-   Carousel harus tetap mudah digunakan secara manual dan tidak
    bergerak terlalu cepat.

## 8. Penanganan ketidakjelasan

Jika task bertentangan dengan `OPENDONASI_SPEC.md`, `DESIGN_SYSTEM.md`,
atau keputusan eksplisit pengguna: 1. Jangan memilih sendiri keputusan
mana yang diubah. 2. Jelaskan konflik secara singkat. 3. Ajukan satu
pertanyaan yang paling menentukan. 4. Tunggu persetujuan sebelum
melakukan perubahan yang mengubah desain atau cakupan.

Jangan mengajukan pertanyaan untuk hal yang sudah dijelaskan dengan
tegas di dokumen. Jangan membuat prompt implementasi, membangun halaman
tambahan, atau melakukan refactor besar jika pengguna hanya meminta
analisis atau perencanaan.

## 9. Urutan kerja project

Ikuti urutan bertahap berikut kecuali pengguna menyetujui perubahan: 1.
Audit project dan aset yang ada. 2. Pastikan dokumen spesifikasi dan
design system tersedia. 3. Siapkan fondasi project: dependensi yang
diperlukan, routing, font, token, dan struktur folder. 4. Bangun
komponen bersama. 5. Bangun Beranda dan uji desktop/mobile. 6. Lanjutkan
halaman lain berdasarkan spesifikasi. 7. Uji navigasi, state, data
dummy, interaksi, dan konsistensi visual.

Jangan membangun semua halaman sekaligus dalam satu perubahan besar.

## 10. Checklist sebelum menyatakan pekerjaan selesai

-   [ ] Perubahan sesuai permintaan dan dokumen acuan.
-   [ ] Tidak ada file atau aset penting yang terhapus tanpa sengaja.
-   [ ] Warna, font, tipografi, spacing, dan komponen tetap konsisten.
-   [ ] Banner/poster tampil utuh tanpa crop.
-   [ ] Gambar kartu program menggunakan rasio 16:9.
-   [ ] Ikon kategori dan ikon layanan menggunakan aset yang benar.
-   [ ] Nominal dan progress selalu terlihat.
-   [ ] Interaksi utama berfungsi.
-   [ ] Desktop, mobile, dan ukuran transisi diperiksa.
-   [ ] Tidak ada horizontal overflow yang tidak diinginkan.
-   [ ] Build atau pemeriksaan yang tersedia telah dijalankan jika
    relevan.
-   [ ] Hasil dan keterbatasan dilaporkan dengan jujur.

**Prinsip utama:** implementasikan OpenDonasi berdasarkan keputusan yang
telah disepakati. Pilih solusi yang sederhana, konsisten, mudah dirawat,
dan terasa natural---bukan menambah kompleksitas atau dekorasi hanya
agar terlihat lebih canggih.
