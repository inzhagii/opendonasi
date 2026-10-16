/**
 * Data mock terpusat untuk Banner, Layanan, Doa Dukungan, FAQ, Kontak, dan Info Organisasi
 * Status: Data demonstrasi prototype (bukan data riil)
 */

import img1 from '../assets/image/gambar1.png';
import img2 from '../assets/image/gambar2.png';
import img3 from '../assets/image/gambar3.png';

import iconLovely from '../assets/icons/icons_layanan/lovely.svg';
import iconZakat from '../assets/icons/icons_kategori/zakat.png';
import iconDevices from '../assets/icons/icons_layanan/devices.svg';
import iconCourier from '../assets/icons/icons_layanan/courier-express-.svg';
import iconMessages from '../assets/icons/icons_layanan/messages.svg';

export const BANNERS = [
  {
    id: 'banner-1',
    title: 'Gotong Royong Ringankan Duka Saudara Terdampak',
    subtitle: 'Salurkan bantuan makanan hangat, selimut, dan obat-obatan darurat.',
    image: img1,
    linkUrl: '/program/tanggap-darurat-korban-bencana',
  },
  {
    id: 'banner-2',
    title: 'Ambulans Gratis Siaga Layani Pasien Dhuafa Pelosok',
    subtitle: 'Bantu biaya operasional dan bahan bakar armada relawan.',
    image: img2,
    linkUrl: '/program/dukung-operasional-ambulans-gratis',
  },
  {
    id: 'banner-3',
    title: 'Bangun Pesantren Bangun Peradaban',
    subtitle: 'Wakaf pembangunan fasilitas asrama para penghafal Al-Quran.',
    image: img3,
    linkUrl: '/wakaf',
  },
];

// Usulan sementara pemetaan 5 layanan (menunggu review visual pengguna)
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
    icon: iconDevices,
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
    icon: iconMessages,
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
];

export const FAQS = [
  {
    id: 'faq-1',
    category: 'umum',
    question: 'Apa itu OpenDonasi?',
    answer: 'OpenDonasi adalah prototype infrastruktur penggalangan dana digital yang dirancang untuk membantu yayasan dan lembaga sosial mengelola program donasi secara transparan.',
  },
  {
    id: 'faq-2',
    category: 'donasi',
    question: 'Apakah pembayaran pada website ini memproses uang sungguhan?',
    answer: 'Tidak. OpenDonasi saat ini berstatus prototype frontend demonstrasi. Seluruh transaksi dan nomor referensi yang dihasilkan bersifat simulasi lokal tanpa memproses uang nyata.',
  },
  {
    id: 'faq-3',
    category: 'donasi',
    question: 'Bagaimana cara melihat riwayat donasi saya?',
    answer: 'Riwayat donasi simulasi dapat diakses secara eksklusif melalui menu Donasi Saya di halaman Profil/Akun.',
  },
  {
    id: 'faq-4',
    category: 'zakat',
    question: 'Bagaimana cara kerja kalkulator zakat?',
    answer: 'Kalkulator zakat menghitung 2.5% estimasi zakat penghasilan atau zakat maal dari nilai aset yang dimasukkan, sebagai simulasi perhitungan awal.',
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
