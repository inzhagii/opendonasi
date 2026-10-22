// Konfigurasi acuan dasar, nisab, dan sumber resmi Kalkulator Zakat OpenDonasi.
// Semua nilai nisab dan acuan disimpan terpusat di file ini (tidak di-hardcode di UI).

export const ZAKAT_CONFIG = {
  // Sumber dan Periode Resmi
  meta: {
    source: 'Badan Amil Zakat Nasional (BAZNAS) RI',
    regulation: 'SK Ketua BAZNAS No. 1 Tahun 2026 tentang Nisab Zakat Pendapatan dan Ketentuan Zakat',
    effectiveYear: '2026',
    notes: 'Perhitungan ini adalah simulasi edukasi dan estimasi digital. Untuk kondisi harta atau waris yang spesifik, disarankan berkonsultasi dengan amil zakat terdaftar.',
  },

  // Acuan Harga Emas (Dapat disesuaikan secara manual oleh pengguna pada kalkulator)
  gold: {
    defaultPricePerGram: 1400000, // Rp 1.400.000 / gram (estimasi acuan pasar)
    nisabGram: 85, // Nisab emas standar 85 gram
    rate: 0.025, // 2.5%
    haulYears: 1, // 1 tahun hijriyah
    sourceLabel: 'Acuan standar nisab emas 85 gram murni',
  },

  // 1. Zakat Penghasilan / Profesi
  penghasilan: {
    title: 'Zakat Penghasilan (Profesi)',
    description: 'Zakat yang dikeluarkan dari penghasilan rutin bulanan atau tahunan dari profesi/pekerjaan.',
    rate: 0.025, // 2.5%
    nisabTahunan: 91681728, // Rp 91.681.728 per tahun (SK BAZNAS 2026 setara 85g emas)
    nisabBulanan: 7640144, // Rp 7.640.144 per bulan (1/12 dari nisab tahunan)
    sourceLabel: 'SK BAZNAS No. 1 Tahun 2026 (Nisab Rp7.640.144/bulan atau Rp91.681.728/tahun)',
  },

  // 2. Zakat Emas
  emas: {
    title: 'Zakat Emas & Logam Mulia',
    description: 'Zakat untuk simpanan emas batangan atau perhiasan yang telah memenuhi nisab dan haul.',
    nisabGram: 85,
    rate: 0.025,
    haulRequired: true,
    sourceLabel: 'Nisab 85 gram emas murni dengan haul minimal 1 tahun hijriyah (kadar 2,5%)',
  },

  // 3. Zakat Tabungan & Harta Simpanan
  tabungan: {
    title: 'Zakat Tabungan & Simpanan',
    description: 'Zakat dari uang kas, saldo rekening tabungan, deposito, dan simpanan likuid yang telah mengendap.',
    nisabEmasGram: 85,
    rate: 0.025,
    haulRequired: true,
    sourceLabel: 'Setara nisab 85 gram emas (Rp91.681.728/tahun acuan BAZNAS) dengan kepemilikan 1 tahun',
  },

  // 4. Zakat Perdagangan / Perniagaan
  perdagangan: {
    title: 'Zakat Perdagangan (Perniagaan)',
    description: 'Zakat dari kegiatan usaha perniagaan, dihitung dari aset lancar dikurangi kewajiban jangka pendek.',
    nisabEmasGram: 85,
    rate: 0.025,
    haulRequired: true,
    sourceLabel: 'Dasar zakat = (Aset Lancar − Kewajiban Jangka Pendek) dengan nisab setara 85g emas (kadar 2,5%)',
  },
};

export default ZAKAT_CONFIG;
