// Utilitas murni untuk penyaringan (filter), penelusuran (search), dan pengurutan (sort) data kampanye OpenDonasi.

export const SORT_OPTIONS = [
  { id: 'terbaru', label: 'Terbaru' },
  { id: 'terbanyak', label: 'Dana Terkumpul Terbanyak' },
  { id: 'target', label: 'Mendekati Target' },
  { id: 'mendesak', label: 'Sisa Waktu Terdesak' },
];

export const TARGET_RANGE_OPTIONS = [
  { id: 'all', label: 'Semua Target Dana' },
  { id: 'under-50m', label: 'Di bawah Rp50 Juta' },
  { id: '50m-100m', label: 'Rp50 Juta – Rp100 Juta' },
  { id: 'over-100m', label: 'Di atas Rp100 Juta' },
];

export const DAYS_RANGE_OPTIONS = [
  { id: 'all', label: 'Semua Sisa Waktu' },
  { id: 'urgent', label: 'Segera Berakhir (≤ 10 Hari)' },
  { id: 'normal', label: 'Lebih dari 10 Hari' },
];

/**
 * Memfilter daftar kampanye berdasarkan kategori, target dana, sisa hari, dan kata kunci pencarian.
 */
export function filterCampaigns(campaigns, {
  category = 'semua',
  targetRange = 'all',
  daysRange = 'all',
  searchQuery = '',
} = {}) {
  if (!Array.isArray(campaigns)) return [];

  const queryTrimmed = searchQuery.trim().toLowerCase();

  return campaigns.filter((campaign) => {
    // 1. Filter Kategori
    if (category && category !== 'semua' && campaign.category !== category) {
      return false;
    }

    // 2. Filter Rentang Target Dana
    if (targetRange === 'under-50m' && campaign.targetAmount >= 50000000) {
      return false;
    }
    if (
      targetRange === '50m-100m' &&
      (campaign.targetAmount < 50000000 || campaign.targetAmount > 100000000)
    ) {
      return false;
    }
    if (targetRange === 'over-100m' && campaign.targetAmount <= 100000000) {
      return false;
    }

    // 3. Filter Sisa Hari
    if (typeof campaign.daysLeft === 'number') {
      if (daysRange === 'urgent' && campaign.daysLeft > 10) {
        return false;
      }
      if (daysRange === 'normal' && campaign.daysLeft <= 10) {
        return false;
      }
    }

    // 4. Pencarian Kata Kunci (Judul, Deskripsi, Kategori, Nama Penggalang)
    if (queryTrimmed) {
      const titleMatch = campaign.title?.toLowerCase().includes(queryTrimmed);
      const descMatch = campaign.description?.toLowerCase().includes(queryTrimmed);
      const categoryMatch = campaign.category?.toLowerCase().includes(queryTrimmed);
      const organizerMatch = campaign.organizer?.name?.toLowerCase().includes(queryTrimmed);

      if (!titleMatch && !descMatch && !categoryMatch && !organizerMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Mengurutkan daftar kampanye berdasarkan opsi pengurutan yang dipilih.
 */
export function sortCampaigns(campaigns, sortBy = 'terbaru') {
  if (!Array.isArray(campaigns)) return [];

  const list = [...campaigns];

  switch (sortBy) {
    case 'terbanyak':
      return list.sort((a, b) => (b.collectedAmount || 0) - (a.collectedAmount || 0));

    case 'target':
      return list.sort((a, b) => {
        const pctA = typeof a.progressPercentage === 'number'
          ? a.progressPercentage
          : a.targetAmount ? (a.collectedAmount / a.targetAmount) * 100 : 0;
        const pctB = typeof b.progressPercentage === 'number'
          ? b.progressPercentage
          : b.targetAmount ? (b.collectedAmount / b.targetAmount) * 100 : 0;
        return pctB - pctA;
      });

    case 'mendesak':
      return list.sort((a, b) => {
        const daysA = typeof a.daysLeft === 'number' ? a.daysLeft : 9999;
        const daysB = typeof b.daysLeft === 'number' ? b.daysLeft : 9999;
        return daysA - daysB;
      });

    case 'terbaru':
    default:
      // Urutan default sesuai index katalog mock data
      return list;
  }
}
