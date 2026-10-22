/**
 * Data mock terpusat untuk Banner, Layanan, Doa Dukungan, FAQ, Kontak, dan Info Organisasi
 * Status: Data demonstrasi prototype (bukan data riil)
 */

import banner1 from '../assets/image/banner/banner1.png';
import banner2 from '../assets/image/banner/banner2.png';
import banner3 from '../assets/image/banner/banner3.png';
import banner4 from '../assets/image/banner/banner4.png';

import iconLovely from '../assets/icons/icons_layanan/lovely.svg';
import iconDevices from '../assets/icons/icons_layanan/devices.svg';
import iconCourier from '../assets/icons/icons_layanan/courier-express-.svg';
import iconMessages from '../assets/icons/icons_layanan/messages.svg';
import iconZakat from '../assets/icons/icons_kategori/zakat.svg';

export const BANNERS = [
  {
    id: 'banner-1',
    title: 'Gotong Royong Ringankan Duka Saudara Terdampak',
    subtitle: 'Salurkan bantuan makanan hangat, selimut, dan obat-obatan darurat.',
    image: banner1,
    linkUrl: '/program/tanggap-darurat-korban-bencana',
  },
  {
    id: 'banner-2',
    title: 'Ambulans Gratis Siaga Layani Pasien Dhuafa Pelosok',
    subtitle: 'Bantu biaya operasional dan bahan bakar armada relawan.',
    image: banner2,
    linkUrl: '/program/dukung-operasional-ambulans-gratis',
  },
  {
    id: 'banner-3',
    title: 'Bangun Pesantren Bangun Peradaban Santri Pelosok',
    subtitle: 'Wakaf sarana pembangunan asrama para penghafal Al-Quran.',
    image: banner3,
    linkUrl: '/wakaf',
  },
  {
    id: 'banner-4',
    title: 'Sedekah Air Bersih & Bersuci Pelosok Nusantara',
    subtitle: 'Wujudkan sumur bor dan instalasi air bersih untuk jamaah dan warga.',
    image: banner4,
    linkUrl: '/program/sedekah-renovasi-sarana-ibadah',
  },
];

export const SERVICES = [
  {
    id: 'donasi',
    name: 'Donasi',
    route: '/program',
    icon: iconLovely,
    desc: 'Bantu program kemanusiaan dan pendidikan',
  },
  {
    id: 'zakat',
    name: 'Zakat',
    route: '/zakat',
    icon: iconZakat,
    desc: 'Hitung dan tunaikan zakat maal & penghasilan',
  },
  {
    id: 'infaq',
    name: 'Infaq',
    route: '/infaq',
    icon: iconMessages,
    desc: 'Salurkan infaq kemaslahatan sarana ibadah',
  },
  {
    id: 'sedekah',
    name: 'Sedekah',
    route: '/sedekah',
    icon: iconCourier,
    desc: 'Sedekah pangan dan kesehatan rutin harian',
  },
  {
    id: 'wakaf',
    name: 'Wakaf',
    route: '/wakaf',
    icon: iconDevices,
    desc: 'Amal jariyah sarana belajar berkelanjutan',
  },
];

export const PRAYERS = [
  {
    id: 'pray-001',
    donorName: 'Ahmad Fauzi',
    campaignTitle: 'Bangun Pesantren Bangun Peradaban Santri Pelosok',
    campaignSlug: 'bantu-sarana-belajar-pesantren',
    amount: 100000,
    message: 'Semoga pembangunan asrama santri berjalan lancar dan menjadi amal jariyah yang mengalir berkah.',
    aminCount: 24,
    createdAt: '15 menit yang lalu',
  },
  {
    id: 'pray-002',
    donorName: 'Hamba Allah',
    campaignTitle: 'Tanggap Darurat dan Dapur Umum Warga Terdampak',
    campaignSlug: 'tanggap-darurat-korban-bencana',
    amount: 50000,
    message: null, // Pesan opsional: tidak mengarang pesan palsu
    aminCount: 12,
    createdAt: '30 menit yang lalu',
  },
  {
    id: 'pray-003',
    donorName: 'Siti Rahmawati',
    campaignTitle: 'Dukungan Operasional dan Logistik Armada Relawan',
    campaignSlug: 'dukung-operasional-ambulans-gratis',
    amount: 250000,
    message: 'Lekas sembuh untuk para korban, semoga relawan selalu dalam perlindungan Allah SWT.',
    aminCount: 45,
    createdAt: '1 jam yang lalu',
  },
  {
    id: 'pray-004',
    donorName: 'Budi Santoso',
    campaignTitle: 'Paket Perlengkapan Belajar & Beasiswa Yatim Dhuafa',
    campaignSlug: 'beasiswa-santri-yatim-dhuafa',
    amount: 150000,
    message: 'Bismillah, semoga sedikit rezeki ini bermanfaat untuk adik-adik santri yatim agar terus bersemangat menggapai cita-cita.',
    aminCount: 38,
    createdAt: '2 jam yang lalu',
  },
  {
    id: 'pray-005',
    donorName: 'Nurul Hidayah',
    campaignTitle: 'Tunaikan Zakat Penghasilan Bantu Pangan Mustahik',
    campaignSlug: 'zakat-penghasilan-bantu-mustahik',
    amount: 500000,
    message: 'Alhamdulillah telah ditunaikan zakat penghasilan bulan ini. Semoga membersihkan harta dan membawa berkah bagi keluarga.',
    aminCount: 56,
    createdAt: '3 jam yang lalu',
  },
  {
    id: 'pray-006',
    donorName: 'Hendra Wijaya',
    campaignTitle: 'Sedekah Gotong Royong Sarana Air Bersih & Bersuci',
    campaignSlug: 'sedekah-renovasi-sarana-ibadah',
    amount: 100000,
    message: 'Semoga instalasi air bersih segera terwujud agar warga dan jamaah masjid tidak lagi kesulitan bersuci saat kemarau.',
    aminCount: 19,
    createdAt: '4 jam yang lalu',
  },
  {
    id: 'pray-007',
    donorName: 'Hamba Allah',
    campaignTitle: 'Bantuan Pangan Pokok & Nutrisi Lansia Pra-Sejahtera',
    campaignSlug: 'paket-pangan-lansia-dhuafa',
    amount: 75000,
    message: 'Doa tulus untuk kakek nenek lansia dhuafa, semoga selalu sehat, diberi kebahagiaan dan kecukupan hidup sehari-hari.',
    aminCount: 62,
    createdAt: '5 jam yang lalu',
  },
  {
    id: 'pray-008',
    donorName: 'Maya Kartika',
    campaignTitle: 'Dukungan Operasional dan Logistik Armada Relawan',
    campaignSlug: 'dukung-operasional-ambulans-gratis',
    amount: 200000,
    message: 'Terima kasih para relawan yang tulus mengabdi. Semoga armada ambulans terus siaga melayani pasien dhuafa di pelosok.',
    aminCount: 31,
    createdAt: '6 jam yang lalu',
  },
  {
    id: 'pray-009',
    donorName: 'Dimas Pratama',
    campaignTitle: 'Layanan Pengobatan Gratis & Vitamin Warga Pelosok',
    campaignSlug: 'layanan-kesehatan-keliling-desa',
    amount: 50000,
    message: 'Semoga donasi ini membawa kesembuhan bagi bapak ibu di pelosok desa yang sulit menjangkau fasilitas kesehatan.',
    aminCount: 27,
    createdAt: '7 jam yang lalu',
  },
  {
    id: 'pray-010',
    donorName: 'Rina Marlina',
    campaignTitle: 'Bangun Pesantren Bangun Peradaban Santri Pelosok',
    campaignSlug: 'bantu-sarana-belajar-pesantren',
    amount: 300000,
    message: 'Wakaf jariyah atas nama almarhum kedua orang tua, semoga pahalanya terus mengalir menjadi penerang kubur mereka. Aamiin.',
    aminCount: 84,
    createdAt: '8 jam yang lalu',
  },
];

export const FAQS = [
  {
    id: 'faq-1',
    category: 'umum',
    question: 'Apa itu OpenDonasi?',
    answer:
      'OpenDonasi adalah prototype antarmuka platform penggalangan dana digital yang dirancang untuk memudahkan masyarakat menemukan program kebaikan, mempelajari transparansi penyaluran, serta mencoba simulasi donasi secara digital.',
  },
  {
    id: 'faq-2',
    category: 'program',
    question: 'Bagaimana cara mencari dan memilih program donasi?',
    answer:
      'Anda dapat membuka katalog program pada menu "Program" atau menggunakan kolom pencarian di bilah navigasi atas. Program juga dapat difilter berdasarkan kategori kemanusiaan, pendidikan, dan bencana, serta layanan Zakat, Infaq, Sedekah, dan Wakaf.',
  },
  {
    id: 'faq-3',
    category: 'donasi',
    question: 'Bagaimana cara mencoba simulasi donasi?',
    answer:
      'Buka halaman detail program donasi yang ingin Anda dukung, lalu tekan tombol "Donasi Sekarang". Anda akan diarahkan ke formulir donasi untuk memilih nominal preset atau manual, mengisi data donatur, meninjau ringkasan, dan mengonfirmasi simulasi transaksi demo.',
  },
  {
    id: 'faq-4',
    category: 'donasi',
    question: 'Apakah pembayaran donasi di sini menggunakan uang asli?',
    answer:
      'Tidak. OpenDonasi adalah aplikasi prototype frontend. Seluruh transaksi, nominal, dan nomor referensi (OD-XXXXXX) yang dihasilkan bersifat simulasi demonstrasi. Tidak ada pemotongan saldo rekening bank, dompet digital (e-wallet), atau kartu kredit.',
  },
  {
    id: 'faq-5',
    category: 'donasi',
    question: 'Apa arti status "Berhasil (Simulasi)" dan "Menunggu Pembayaran"?',
    answer:
      'Status "Berhasil (Simulasi)" menandakan bahwa Anda telah berhasil menyelesaikan alur pengujian formulir donasi demonstrasi. Sedangkan status "Menunggu Pembayaran (Simulasi)" adalah data contoh awal untuk menguji variasi status pada antarmuka prototype.',
  },
  {
    id: 'faq-6',
    category: 'riwayat',
    question: 'Di mana saya dapat melihat riwayat donasi saya?',
    answer:
      'Riwayat donasi dapat diakses melalui menu "Donasi Saya" (/donasi-saya) yang dapat dibuka dari halaman Profil/Akun (/profil) atau tautan langsung di halaman bukti hasil simulasi transaksi.',
  },
  {
    id: 'faq-7',
    category: 'privasi',
    question: 'Bagaimana cara kerja opsi donasi anonim (Hamba Allah)?',
    answer:
      'Pada formulir donasi, Anda dapat mencentang opsi "Sembunyikan nama saya". Jika opsi ini aktif, identitas donatur akan ditampilkan sebagai "Hamba Allah (Anonim)" pada kartu hasil donasi dan daftar riwayat, sehingga nama asli tidak ditampilkan ke publik.',
  },
  {
    id: 'faq-8',
    category: 'akun',
    question: 'Apakah profil demo merupakan akun pengguna sungguhan?',
    answer:
      'Bukan. Profil pada menu "Akun" adalah profil demonstrasi prototype. Tidak diperlukan pendaftaran akun, kata sandi, maupun verifikasi identitas resmi. Seluruh data akun bersumber dari sesi lokal pada peramban Anda.',
  },
  {
    id: 'faq-9',
    category: 'teknis',
    question: 'Di mana data transaksi demo disimpan dan berapa lama bertahannya?',
    answer:
      'Data transaksi demo disimpan secara lokal pada penyimpanan sesi peramban Anda (sessionStorage). Data ini bertahan selama tab atau sesi peramban aktif dan dapat dikosongkan kapan saja melalui utilitas pengujian di halaman Profil.',
  },
  {
    id: 'faq-10',
    category: 'bantuan',
    question: 'Apa yang harus dilakukan jika halaman atau data demo tidak tampil dengan benar?',
    answer:
      'Silakan muat ulang (refresh) halaman peramban Anda. Jika riwayat kosong atau ingin mengembalikan data demonstrasi awal, gunakan tombol "Reset ke Data Awal Demo" yang tersedia di bagian bawah halaman Profil Saya.',
  },
];

// Data kontak placeholder bertanda demo eksplisit
export const CONTACT_INFO = {
  isDemoData: true,
  email: 'bantuan@opendonasi.id.demo',
  whatsappNumber: '+62 812-0000-0000 (Placeholder Demo)',
  whatsappUrl: 'https://wa.me/6281200000000',
  operationalHours: 'Senin – Jumat, 09:00 – 17:00 WIB (Simulasi Layanan)',
  note: 'Kontak di atas merupakan placeholder demo untuk pengujian prototype.',
};

// Data profil platform dan statistik berlabel demo
export const ORGANIZATION = {
  name: 'OpenDonasi',
  tagline: 'Digital Giving Infrastructure',
  description: 'Infrastruktur penggalangan dana digital yang menjembatani para dermawan dengan lembaga sosial terpercaya.',
  impactStats: [
    { label: 'Program Didukung', value: '150+', isDemoNote: true },
    { label: 'Donatur Terhubung', value: '10.000+', isDemoNote: true },
    { label: 'Penyaluran Kebaikan', value: 'Rp2.5 M+', isDemoNote: true },
  ],
};
