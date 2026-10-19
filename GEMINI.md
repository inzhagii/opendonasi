# GEMINI.md

## Tujuan Project
OpenDonasi adalah prototype frontend platform penggalangan dana. Prioritasnya adalah pengalaman pengguna yang jelas, tampilan konsisten, dan alur yang dapat dicoba dengan data dummy.

## Batasan Prototype
- Frontend saja: tidak membuat backend, database, CMS, autentikasi sungguhan, atau integrasi pembayaran nyata.
- Semua program, donatur, berita, akun, dan transaksi menggunakan data dummy yang konsisten.
- Status transaksi hanya simulasi. Jangan menyatakan pembayaran benar-benar terjadi atau menaikkan dana terkumpul karena transaksi demo.
- Jangan menambahkan fitur di luar spesifikasi yang disetujui tanpa alasan yang jelas.

## Sumber Acuan
- Ikuti spesifikasi produk dan alur yang telah disetujui dalam `OPENDONASI_SPEC.md`.
- Ikuti aturan visual dan komponen dalam `DESIGN_SYSTEM.md`.
- Ikuti tahapan kerja dan arsitektur dalam `OPENDONASI_IMPLEMENTATION_PLAN.md`.
- Jika dokumen belum tersedia, jangan mengarang keputusan desain atau produk. Gunakan keputusan yang sudah disepakati dan tandai ketidakpastian yang berdampak besar.
- Jika instruksi bertentangan, utamakan keputusan terbaru yang telah disetujui pengguna. Untuk konflik yang berdampak pada desain, alur utama, atau struktur data, berhenti dan minta klarifikasi.

## Teknologi dan Arsitektur
- Gunakan React + Vite sebagai fondasi project yang sudah ada.
- Tailwind CSS dan React Router direncanakan untuk styling dan routing. Periksa konfigurasi serta versi yang terpasang sebelum menambahkan atau mengubah dependensi.
- Gunakan JavaScript dan pola React standar yang mudah dipahami.
- Pilih arsitektur feature-based yang ringan. Pisahkan halaman, layout, komponen reusable, data dummy, style, dan helper sesuai kebutuhan nyata.
- Jangan menaruh semua halaman atau seluruh logika aplikasi di satu file.
- Gunakan satu komponen bersama untuk UI yang harus konsisten, terutama kartu program.
- Simpan data dummy di lokasi terpusat agar informasi program yang sama konsisten di seluruh halaman.
- Hindari abstraksi berlebihan, duplikasi kode, state management library, dan dependensi tambahan yang tidak diperlukan.

## Aturan Desain dan Aset
- Pertahankan design system OpenDonasi yang disepakati: font Inter, biru utama `#2E7DFA`, latar putih dan netral lembut, serta tampilan bersih dan hangat.
- Jangan mengganti warna utama, font, bentuk komponen, atau pola responsif atas inisiatif sendiri. Rujuk `DESIGN_SYSTEM.md` untuk detail visual.
- Prioritaskan logo, ikon, banner, dan gambar yang sudah tersedia di project.
- Periksa lokasi, ekstensi, dan format aset sebelum menggunakannya. Jangan mengubah atau mengganti aset secara massal tanpa memeriksa dampaknya.
- Jangan mengambil gambar acak dari internet atau membuat aset baru kecuali diminta. Jika aset yang dibutuhkan tidak tersedia, tandai secara internal sebagai unresolved dan gunakan fallback yang aman.
- Gambar program menggunakan rasio 16:9 sesuai desain yang disepakati; jangan meregangkan gambar atau memotong bagian penting. Pertahankan gambar secara utuh bila diperlukan.
- Hero Carousel menampilkan gambar banner secara utuh (`object-contain`) tanpa overlay teks HTML atau gradasi gelap yang menduplikasi teks grafis di dalam banner. Aksesibilitas dipertahankan via alt text atau teks screen reader (`sr-only`).
- Penggunaan `src/assets/icons/icons_kategori/zakat.svg` untuk layanan Zakat adalah pengecualian sementara yang disetujui. Jangan mengganti ikon Infaq atau Wakaf tanpa aset alternatif yang terbukti sesuai.

## Aturan UX OpenDonasi
- Halaman umum mengikuti rancangan navbar desktop dan bottom navigation mobile yang telah disepakati.
- Detail Program menggunakan layout khusus: tanpa navbar utama; tombol kembali dan bagikan berada di area banner, dan pada mobile tersedia CTA tetap di bawah.
- Halaman khusus seperti Kalkulator Zakat, formulir donasi, daftar berita, dan detail berita menggunakan header yang sesuai dengan rancangan masing-masing.
- Landing Zakat menyediakan akses ke Kalkulator Zakat melalui tombol yang disepakati; hasil perhitungan dapat diteruskan sebagai nominal awal ke formulir donasi dan tetap bisa diedit pengguna.
- Kartu program harus konsisten pada Beranda, daftar Program, Pencarian, Profil Penggalang, dan rekomendasi program. Nominal terkumpul dan progress bar selalu terlihat; persentase numerik hanya muncul melalui tooltip hover desktop dan tidak diwajibkan terus-menerus di mobile.
- Pencarian, kategori, filter, dan pengurutan harus mengikuti spesifikasi yang disetujui. Filter program tidak menggantikan pilihan kategori.
- Berikan state yang layak untuk kondisi kosong, tidak ditemukan, input tidak valid, gambar gagal dimuat, dan halaman atau transaksi demo yang tidak ditemukan. Rute 404 produk harus ramah pengguna dengan CTA kembali ke Beranda.
- Jangan membuat tombol atau tautan yang tampak aktif tetapi tidak memiliki perilaku. Jika fitur belum tersedia, jelaskan atau gunakan placeholder yang jelas.
- Jaga responsivitas: hindari horizontal overflow, gambar terdistorsi, teks terpotong tanpa alasan, dan CTA yang tertutup navigasi tetap.
- Jaga desain tetap natural dan sederhana. Hindari gradient, glow, animasi, dekorasi, dan efek yang tidak dibutuhkan oleh desain yang disetujui.

## Standar Kode
- Sebelum mengubah kode, periksa file dan dependensi yang relevan.
- Kerjakan hanya lingkup tugas yang diberikan. Jangan merombak file yang tidak berkaitan.
- Ikuti konvensi penamaan dan format yang sudah dipakai project jika konsisten; jika belum, gunakan penamaan yang jelas dan konsisten.
- Beri komentar singkat di bagian atas file utama untuk menjelaskan fungsi file, misalnya `// Halaman beranda OpenDonasi.` Jangan menambahkan komentar panjang yang hanya mengulang kode.
- Utamakan komponen kecil yang memiliki tanggung jawab jelas, tetapi jangan memecah setiap elemen sederhana menjadi komponen terpisah tanpa manfaat.
- Hindari nilai desain yang tersebar. Gunakan token atau variabel bersama sesuai `DESIGN_SYSTEM.md`.
- Jangan menambahkan paket baru tanpa kebutuhan nyata. Jelaskan alasan dan periksa kompatibilitasnya terlebih dahulu.
- Jangan menulis seluruh halaman di `App.jsx`; gunakan file route dan halaman sesuai arsitektur yang disetujui.

## Workflow Implementasi
1. Baca instruksi project dan dokumen acuan yang tersedia sebelum mulai.
2. Periksa kondisi kode saat ini; jangan berasumsi struktur atau dependensi sudah sesuai rencana.
3. Implementasikan hanya fase dan fitur yang diminta.
4. Pertahankan keputusan wireframe dan perilaku yang telah disetujui. Jika ada kendala teknis, jelaskan dampak dan ajukan alternatif sebelum mengubah keputusan utama.
5. Setelah perubahan, jalankan pemeriksaan yang tersedia, seperti lint dan build, serta periksa interaksi yang relevan.
6. Laporkan secara singkat file yang berubah, perilaku yang selesai, pemeriksaan yang dijalankan, hasilnya, dan masalah yang masih tersisa.
7. Jangan mengklaim build atau fitur berhasil jika belum benar-benar diperiksa.

## Prioritas dan Batas Perubahan
- Pengguna menentukan kebutuhan, prioritas, dan persetujuan desain; Antigravity mengimplementasikan arahan yang disetujui.
- Jangan membuat atau mengubah wireframe, design system, alur, maupun fitur di luar cakupan tugas tanpa persetujuan.
- Jika kebutuhan kecil sudah jelas dari spesifikasi, lanjutkan tanpa bertanya berulang kali.
- Jika ada ambiguitas yang dapat mengubah desain, navigasi, data, atau alur utama, jelaskan pertanyaannya secara singkat sebelum mengimplementasikan.
- Jangan menghapus aset atau file yang ada tanpa memeriksa kegunaan dan meminta persetujuan jika penghapusan berisiko.
