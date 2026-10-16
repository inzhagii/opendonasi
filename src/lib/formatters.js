/**
 * Utilitas pemformat angka, mata uang Rupiah, dan tanggal Indonesia
 */

export function formatRupiah(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Rp0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, '');
}

export function formatNumber(number) {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }
  return new Intl.NumberFormat('id-ID').format(number);
}

export function formatDate(dateInput) {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(dateInput);
  }
}
