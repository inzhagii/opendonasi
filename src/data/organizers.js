// Data mock terpusat untuk Profil Penggalang / Yayasan Mitra OpenDonasi.
// Sesuai OPENDONASI_SPEC dan DESIGN_SYSTEM.md.

export const ORGANIZERS = [
  {
    id: 'peduli-pesantren',
    name: 'Yayasan Peduli Pesantren (Demo)',
    category: 'Pendidikan & Keagamaan',
    joinedDate: '15 Mar 2021',
    verified: true,
    location: 'Kota Semarang, Jawa Tengah',
    phone: '+62 813-4133-2004',
    email: 'kontak@pedulipesantren.or.id',
    about:
      'Yayasan Peduli Pesantren adalah lembaga pendidikan dan sosial keagamaan yang berpusat di Kota Semarang. Berawal dari membina satu rumah kontrakan untuk program tahfidz di sore hari, dalam beberapa tahun yayasan telah berkembang mandiri melayani ratusan santri yatim dan dhuafa di wilayah Jawa Tengah dan pelosok nusantara.',
    branches: [
      'Cabang Pedurungan: Jl. Kalicari 4 No 15, Kalicari, Kec. Pedurungan, Kota Semarang',
      'Cabang Genuk (Asrama Yatim & Dhuafa): Jl. Ngablak Indah II No.24 A, Genuk, Semarang',
      'Cabang Pamularsih: Pamularsih Semarang Barat',
    ],
    summaryStats: {
      beneficiaries: '540 Santri',
      branchesCount: '5 Titik Asrama',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 12,
      donors: 1915,
      fundraisers: 33,
    },
  },
  {
    id: 'relawan-bersama',
    name: 'Relawan Kemanusiaan Bersama (Demo)',
    category: 'Tanggap Darurat Bencana',
    joinedDate: '10 Jan 2020',
    verified: true,
    location: 'Jakarta Selatan, DKI Jakarta',
    phone: '+62 812-9876-5432',
    email: 'siaga@relawanbersama.id',
    about:
      'Relawan Kemanusiaan Bersama adalah organisasi nirlaba yang bergerak cepat dalam mitigasi, evakuasi, dan distribusi bantuan logistik serta dapur umum bagi warga terdampak bencana alam di Indonesia. Kami menjalin kemitraan erat dengan masyarakat lokal untuk pemulihan pascabencana yang bermartabat.',
    branches: [
      'Posko Pusat Logistik: Cilandak, Jakarta Selatan',
      'Pos Siaga Wilayah 1: Padang, Sumatera Barat',
      'Pos Siaga Wilayah 2: Cianjur, Jawa Barat',
    ],
    summaryStats: {
      beneficiaries: '12.400 Jiwa',
      branchesCount: '3 Posko Siaga',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 18,
      donors: 3420,
      fundraisers: 54,
    },
  },
  {
    id: 'aksi-siaga',
    name: 'Aksi Siaga Masyarakat (Demo)',
    category: 'Layanan Medis & Ambulans',
    joinedDate: '22 Ags 2021',
    verified: true,
    location: 'Kota Bandung, Jawa Barat',
    phone: '+62 821-4455-6677',
    email: 'info@aksisiaga.org',
    about:
      'Aksi Siaga Masyarakat mengoperasikan armada ambulans gratis dan layanan darurat medis 24 jam bagi masyarakat pra-sejahtera dan dhuafa di wilayah Jawa Barat. Didukung oleh tim medis sukarelawan berdedikasi tinggi untuk memberikan pertolongan pertama yang cepat dan tanpa biaya.',
    branches: [
      'Garasi Ambulans Utama: Kec. Coblong, Kota Bandung',
      'Pos Pelayanan Dhuafa: Padalarang, Kab. Bandung Barat',
    ],
    summaryStats: {
      beneficiaries: '3.800 Pasien',
      branchesCount: '4 Unit Armada',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 8,
      donors: 1450,
      fundraisers: 21,
    },
  },
  {
    id: 'sahabat-cerdas',
    name: 'Sahabat Cerdas Nusantara (Demo)',
    category: 'Beasiswa & Pendidikan',
    joinedDate: '05 Mei 2021',
    verified: true,
    location: 'Kota Yogyakarta, D.I. Yogyakarta',
    phone: '+62 813-7788-9900',
    email: 'halo@sahabatcerdas.org',
    about:
      'Sahabat Cerdas Nusantara bertekad memutus rantai kemiskinan melalui akses pendidikan berkualitas, beasiswa perlengkapan sekolah, dan pendampingan karakter bagi anak-anak yatim dan keluarga kurang mampu di pelosok Indonesia.',
    branches: [
      'Kantor Pusat: Sleman, D.I. Yogyakarta',
      'Rumah Belajar 1: Kab. Gunungkidul, D.I. Yogyakarta',
    ],
    summaryStats: {
      beneficiaries: '1.200 Anak Asuh',
      branchesCount: '2 Rumah Belajar',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 9,
      donors: 980,
      fundraisers: 16,
    },
  },
  {
    id: 'lumbung-pangan',
    name: 'Lumbung Pangan Umat (Demo)',
    category: 'Pangan & Pemberdayaan Dhuafa',
    joinedDate: '18 Nov 2020',
    verified: true,
    location: 'Kota Surabaya, Jawa Timur',
    phone: '+62 811-2233-4455',
    email: 'lumbung@panganumat.id',
    about:
      'Lumbung Pangan Umat menyalurkan paket sembako beras bergizi secara berkala untuk para lansia sebatang kara dan keluarga dhuafa pra-sejahtera, serta memberdayakan petani lokal melalui skema pembelian beras langsung dari lumbung desa.',
    branches: [
      'Gudang Penyaluran: Rungkut, Kota Surabaya',
      'Sentra Lumbung Desa: Kab. Jombang, Jawa Timur',
    ],
    summaryStats: {
      beneficiaries: '8.500 Keluarga',
      branchesCount: '3 Sentra Pangan',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 14,
      donors: 2680,
      fundraisers: 42,
    },
  },
  {
    id: 'laz-peduli',
    name: 'Lembaga Amil Zakat Peduli (Demo)',
    category: 'Amil Zakat & Mustahik',
    joinedDate: '01 Feb 2019',
    verified: true,
    location: 'Jakarta Pusat, DKI Jakarta',
    phone: '+62 815-6677-8899',
    email: 'layanan@lazpeduli.or.id',
    about:
      'Lembaga Amil Zakat Peduli mengelola dan mendistribusikan dana zakat maal, zakat fitrah, infaq, dan fidyah secara amanah dan profesional kepada 8 asnaf yang berhak menerima bantuan di seluruh wilayah Indonesia.',
    branches: [
      'Kantor Pusat Layanan Zakat: Menteng, Jakarta Pusat',
      'Unit Layanan Cabang: Kota Medan, Sumatera Utara',
    ],
    summaryStats: {
      beneficiaries: '25.000 Mustahik',
      branchesCount: '4 Kantor Layanan',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 20,
      donors: 5800,
      fundraisers: 68,
    },
  },
  {
    id: 'air-bersih-desa',
    name: 'Panitia Air Bersih Desa (Demo)',
    category: 'Infrastruktur Sarana Ibadah',
    joinedDate: '12 Jul 2022',
    verified: true,
    location: 'Kab. Gunungkidul, D.I. Yogyakarta',
    phone: '+62 812-3344-5566',
    email: 'airbersih@desa.id',
    about:
      'Panitia Air Bersih Desa adalah gerakan gotong royong warga dan relawan untuk mewujudkan sumur bor dalam, instalasi pipa air bersih, dan bak penampungan wudhu bagi masjid serta permukiman warga rawan kekeringan di bukit kapur.',
    branches: [
      'Posko Gotong Royong: Desa Rongkop, Kab. Gunungkidul',
    ],
    summaryStats: {
      beneficiaries: '4.200 Warga',
      branchesCount: '6 Titik Sumur',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 6,
      donors: 740,
      fundraisers: 15,
    },
  },
  {
    id: 'pos-sehat',
    name: 'Pos Sehat Mandiri (Demo)',
    category: 'Kesehatan Dhuafa & Posyandu',
    joinedDate: '28 Sep 2021',
    verified: true,
    location: 'Kab. Bogor, Jawa Barat',
    phone: '+62 819-0011-2233',
    email: 'possehat@mandiri.org',
    about:
      'Pos Sehat Mandiri menyelenggarakan klinik keliling gratis, pemeriksaan tensi gula darah, penyuluhan pencegahan stunting balita, dan penyaluran vitamin serta gizi tambahan bagi ibu hamil dan balita di pelosok desa.',
    branches: [
      'Klinik Pratama Posko: Ciampea, Kab. Bogor',
    ],
    summaryStats: {
      beneficiaries: '2.900 Jiwa',
      branchesCount: '2 Pos Keliling',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 7,
      donors: 890,
      fundraisers: 19,
    },
  },
  {
    id: 'insan-cita',
    name: 'Yayasan Insan Cita Nusantara (Demo)',
    category: 'Pendidikan Wilayah 3T',
    joinedDate: '14 Feb 2020',
    verified: true,
    location: 'Kota Kupang, Nusa Tenggara Timur',
    phone: '+62 822-9900-1122',
    email: 'insancita@nusantara.id',
    about:
      'Yayasan Insan Cita Nusantara mendedikasikan perhatian pada pembangunan asrama layak, penyediaan perpustakaan mini buku bacaan anak, dan pembinaan guru honorer di kawasan 3T (Terdepan, Terluar, Tertinggal) di Indonesia Timur.',
    branches: [
      'Pusat Asrama: Kota Kupang, NTT',
      'Sentra Belajar: Kab. Alor, NTT',
    ],
    summaryStats: {
      beneficiaries: '1.650 Siswa',
      branchesCount: '3 Asrama Belajar',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 11,
      donors: 1320,
      fundraisers: 27,
    },
  },
];

/**
 * Pemetaan nama ke slug organizer
 */
export function getOrganizerSlug(name) {
  if (!name) return 'peduli-pesantren';
  const clean = name.toLowerCase();
  if (clean.includes('pesantren')) return 'peduli-pesantren';
  if (clean.includes('relawan')) return 'relawan-bersama';
  if (clean.includes('aksi siaga')) return 'aksi-siaga';
  if (clean.includes('sahabat cerdas')) return 'sahabat-cerdas';
  if (clean.includes('lumbung pangan')) return 'lumbung-pangan';
  if (clean.includes('zakat') || clean.includes('laz')) return 'laz-peduli';
  if (clean.includes('air bersih')) return 'air-bersih-desa';
  if (clean.includes('pos sehat')) return 'pos-sehat';
  if (clean.includes('insan cita')) return 'insan-cita';
  return clean.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'peduli-pesantren';
}

/**
 * Mencari data organizer berdasarkan id/slug atau nama
 */
export function getOrganizer(idOrName) {
  if (!idOrName) return ORGANIZERS[0];
  const targetSlug = getOrganizerSlug(idOrName);
  const found = ORGANIZERS.find((o) => o.id === idOrName || o.id === targetSlug);
  if (found) return found;

  // Fallback fallback dinamis aman
  return {
    id: targetSlug,
    name: idOrName,
    category: 'Mitra Kebaikan OpenDonasi',
    joinedDate: '15 Mar 2021',
    verified: true,
    location: 'Indonesia',
    phone: '+62 813-4133-2004',
    email: 'mitra@opendonasi.id',
    about: `${idOrName} adalah lembaga mitra kebaikan terpercaya di OpenDonasi yang berkomitmen menyalurkan bantuan secara transparan, amanah, dan tepat sasaran bagi masyarakat yang membutuhkan.`,
    branches: [
      'Pusat Layanan: Wilayah Operasional Mitra Kebaikan',
    ],
    summaryStats: {
      beneficiaries: 'Terverifikasi',
      branchesCount: 'Aktif',
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    stats: {
      programs: 5,
      donors: 850,
      fundraisers: 12,
    },
  };
}
