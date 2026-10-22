// Logika matematis perhitungan Kalkulator Zakat OpenDonasi.
// Mengimplementasikan 4 prioritas jenis zakat: Penghasilan, Emas, Tabungan, Perdagangan.
// Semua perhitungan numerik bebas dari formatting string sampai hasil akhir siap dirender.

import { ZAKAT_CONFIG } from '../data/zakatConfig.js';

/**
 * 1. Zakat Penghasilan (Profesi)
 * @param {Object} params
 * @param {number} params.monthlyIncome - Gaji / penghasilan pokok bulanan
 * @param {number} params.otherIncome - Penghasilan tambahan bulanan (opsional)
 * @param {'monthly' | 'yearly'} params.period - Periode perhitungan
 */
export function calculateZakatPenghasilan({
  monthlyIncome = 0,
  otherIncome = 0,
  period = 'monthly',
}) {
  const cfg = ZAKAT_CONFIG.penghasilan;
  const numMonthly = Math.max(0, Number(monthlyIncome) || 0);
  const numOther = Math.max(0, Number(otherIncome) || 0);
  const totalMonthly = numMonthly + numOther;

  const isYearly = period === 'yearly';
  const baseAmount = isYearly ? totalMonthly * 12 : totalMonthly;
  const nisabAmount = isYearly ? cfg.nisabTahunan : cfg.nisabBulanan;

  const isNisabReached = baseAmount >= nisabAmount;
  const estimatedZakat = isNisabReached ? Math.round(baseAmount * cfg.rate) : 0;

  return {
    type: 'penghasilan',
    typeName: cfg.title,
    period,
    periodLabel: isYearly ? 'per tahun' : 'per bulan',
    baseAmount,
    nisabAmount,
    rate: cfg.rate,
    ratePercentText: '2,5%',
    isNisabReached,
    isObligatory: isNisabReached,
    estimatedZakat,
    sourceNote: cfg.sourceLabel,
    formulaExplanation: isYearly
      ? 'Zakat = 2,5% × Total Penghasilan Tahunan (jika ≥ Rp91.681.728/tahun)'
      : 'Zakat = 2,5% × Total Penghasilan Bulanan (jika ≥ Rp7.640.144/bulan)',
  };
}

/**
 * 2. Zakat Emas & Logam Mulia
 * @param {Object} params
 * @param {number} params.goldWeightGram - Berat emas dalam gram
 * @param {number} params.goldPricePerGram - Harga emas per gram (acuan rupiah)
 * @param {boolean} params.hasHaul - Apakah sudah tersimpan minimal 1 tahun hijriyah
 */
export function calculateZakatEmas({
  goldWeightGram = 0,
  goldPricePerGram = ZAKAT_CONFIG.gold.defaultPricePerGram,
  hasHaul = true,
}) {
  const cfg = ZAKAT_CONFIG.emas;
  const weight = Math.max(0, Number(goldWeightGram) || 0);
  const price = Math.max(0, Number(goldPricePerGram) || ZAKAT_CONFIG.gold.defaultPricePerGram);

  const baseAmount = Math.round(weight * price);
  const nisabGram = cfg.nisabGram; // 85 gram
  const nisabAmount = Math.round(nisabGram * price);

  const isNisabReached = weight >= nisabGram;
  const isObligatory = isNisabReached && hasHaul;
  const estimatedZakat = isObligatory ? Math.round(baseAmount * cfg.rate) : 0;
  const estimatedZakatGram = isObligatory ? (weight * cfg.rate) : 0;

  return {
    type: 'emas',
    typeName: cfg.title,
    goldWeightGram: weight,
    goldPricePerGram: price,
    baseAmount,
    nisabGram,
    nisabAmount,
    hasHaul,
    rate: cfg.rate,
    ratePercentText: '2,5%',
    isNisabReached,
    isObligatory,
    estimatedZakat,
    estimatedZakatGram: Number(estimatedZakatGram.toFixed(2)),
    sourceNote: cfg.sourceLabel,
    formulaExplanation: `Nisab emas 85 gram (Rp${nisabAmount.toLocaleString('id-ID')}). Zakat = 2,5% × Nilai Emas jika kepemilikan telah mencapai 1 tahun (haul).`,
  };
}

/**
 * 3. Zakat Tabungan & Harta Simpanan
 * @param {Object} params
 * @param {number} params.savingsBalance - Saldo uang/rekening tabungan
 * @param {number} params.otherSavings - Simpanan lain / deposito / dividen
 * @param {number} params.goldPricePerGram - Harga emas acuan
 * @param {boolean} params.hasHaul - Apakah mengendap 1 tahun
 */
export function calculateZakatTabungan({
  savingsBalance = 0,
  otherSavings = 0,
  goldPricePerGram = ZAKAT_CONFIG.gold.defaultPricePerGram,
  hasHaul = true,
}) {
  const cfg = ZAKAT_CONFIG.tabungan;
  const bal = Math.max(0, Number(savingsBalance) || 0);
  const other = Math.max(0, Number(otherIncomeSafe(otherSavings)));
  const price = Math.max(0, Number(goldPricePerGram) || ZAKAT_CONFIG.gold.defaultPricePerGram);

  const baseAmount = bal + other;
  // Nisab tabungan mengacu pada 85 gram emas atau acuan tahunan BAZNAS Rp91.681.728
  const nisabAmount = Math.round(cfg.nisabEmasGram * price);

  const isNisabReached = baseAmount >= nisabAmount;
  const isObligatory = isNisabReached && hasHaul;
  const estimatedZakat = isObligatory ? Math.round(baseAmount * cfg.rate) : 0;

  return {
    type: 'tabungan',
    typeName: cfg.title,
    baseAmount,
    nisabAmount,
    hasHaul,
    rate: cfg.rate,
    ratePercentText: '2,5%',
    isNisabReached,
    isObligatory,
    estimatedZakat,
    sourceNote: cfg.sourceLabel,
    formulaExplanation: `Zakat Tabungan dihitung dari total saldo mengendap. Nisab setara 85g emas (Rp${nisabAmount.toLocaleString('id-ID')}) dengan haul 1 tahun. Kadar zakat 2,5%.`,
  };
}

/**
 * 4. Zakat Perdagangan (Perniagaan)
 * Dasar zakat = Aset Lancar Usaha − Kewajiban Jangka Pendek
 * @param {Object} params
 * @param {number} params.currentAssets - Aset lancar (kas + stok + piutang lancar)
 * @param {number} params.shortTermLiabilities - Utang jangka pendek jatuh tempo
 * @param {number} params.goldPricePerGram - Harga emas acuan
 * @param {boolean} params.hasHaul - Apakah usaha telah berjalan 1 tahun
 */
export function calculateZakatPerdagangan({
  currentAssets = 0,
  shortTermLiabilities = 0,
  goldPricePerGram = ZAKAT_CONFIG.gold.defaultPricePerGram,
  hasHaul = true,
}) {
  const cfg = ZAKAT_CONFIG.perdagangan;
  const assets = Math.max(0, Number(currentAssets) || 0);
  const liabilities = Math.max(0, Number(shortTermLiabilities) || 0);
  const price = Math.max(0, Number(goldPricePerGram) || ZAKAT_CONFIG.gold.defaultPricePerGram);

  // Nilai dasar zakat (tidak boleh bernilai negatif)
  const netWorth = assets - liabilities;
  const baseAmount = Math.max(0, netWorth);
  const nisabAmount = Math.round(cfg.nisabEmasGram * price);

  const isNisabReached = baseAmount >= nisabAmount;
  const isObligatory = isNisabReached && hasHaul && netWorth > 0;
  const estimatedZakat = isObligatory ? Math.round(baseAmount * cfg.rate) : 0;

  return {
    type: 'perdagangan',
    typeName: cfg.title,
    currentAssets: assets,
    shortTermLiabilities: liabilities,
    netWorth,
    baseAmount,
    nisabAmount,
    hasHaul,
    rate: cfg.rate,
    ratePercentText: '2,5%',
    isNisabReached,
    isObligatory,
    estimatedZakat,
    sourceNote: cfg.sourceLabel,
    formulaExplanation: 'Nilai Dasar = Aset Lancar Usaha − Kewajiban Jangka Pendek. Jika Nilai Dasar ≥ Nisab 85g emas dan telah haul 1 tahun, kadar zakat adalah 2,5%.',
  };
}

function otherIncomeSafe(val) {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}
