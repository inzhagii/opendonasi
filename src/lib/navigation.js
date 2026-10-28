// Helper manajemen navigasi dan riwayat halaman OpenDonasi.
// Mencegah looping / navigasi bolak-balik antara detail program, sub-halaman, dan formulir donasi.

/**
 * Memeriksa apakah sebuah rute merupakan bagian dari alur internal detail program atau donasi.
 * @param {string} pathname
 * @returns {boolean}
 */
export function isInternalProgramFlow(pathname) {
  if (!pathname || typeof pathname !== 'string') return false;
  return (
    (pathname.startsWith('/program/') && pathname !== '/program') ||
    pathname.startsWith('/donasi/') ||
    pathname === '/hasil-donasi'
  );
}

const STORAGE_KEY = 'opendonasi_source_page';

/**
 * Mencatat halaman asal (katalog, beranda, layanan, pencarian, profil penggalang)
 * sebelum pengguna masuk ke alur detail program atau formulir donasi.
 * @param {object} location
 */
export function recordSourcePage(location) {
  if (!location) return;
  const { pathname, search } = location;

  // Hanya simpan jika BUKAN alur internal program / donasi
  if (!isInternalProgramFlow(pathname)) {
    const fullPath = pathname + (search || '');
    try {
      sessionStorage.setItem(STORAGE_KEY, fullPath);
    } catch {
      // Abaikan jika storage dinonaktifkan di browser
    }
  }
}

/**
 * Mengambil halaman asal yang tepat sebelum pengguna masuk ke detail program.
 * Prioritas:
 * 1. location.state.from (jika bukan alur internal)
 * 2. Nilai tersimpan di sessionStorage (halaman asal terakhir)
 * 3. Fallback (default: '/program')
 * @param {object} location
 * @param {string} fallback
 * @returns {string}
 */
export function getSourcePage(location, fallback = '/program') {
  // 1. Cek router state
  const stateFrom = location?.state?.from;
  if (stateFrom && typeof stateFrom === 'string' && !isInternalProgramFlow(stateFrom)) {
    return stateFrom;
  }

  // 2. Cek sessionStorage
  try {
    const savedSource = sessionStorage.getItem(STORAGE_KEY);
    if (savedSource && typeof savedSource === 'string' && !isInternalProgramFlow(savedSource)) {
      return savedSource;
    }
  } catch {
    // Abaikan jika storage bermasalah
  }

  // 3. Fallback aman
  return fallback;
}
