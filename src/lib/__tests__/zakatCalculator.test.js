// Test unit untuk logika dan validasi kalkulator zakat OpenDonasi
import assert from 'node:assert/strict';
import {
  calculateZakatPenghasilan,
  calculateZakatEmas,
  calculateZakatTabungan,
  calculateZakatPerdagangan,
} from '../zakatCalculator.js';

console.log('--- RUNNING ZAKAT CALCULATION TESTS ---');

// 1. Test Zakat Penghasilan
console.log('1. Testing Zakat Penghasilan...');
{
  // Dibawah nisab (5jt < 7.640.144)
  const resBelow = calculateZakatPenghasilan({ monthlyIncome: 5000000, otherIncome: 0 });
  assert.equal(resBelow.isNisabReached, false, 'Gaji 5jt harus belum mencapai nisab');
  assert.equal(resBelow.isObligatory, false);
  assert.equal(resBelow.estimatedZakat, 0, 'Zakat harus 0 jika belum mencapai nisab');

  // Di atas nisab (10jt + 2jt = 12jt > 7.640.144)
  const resAbove = calculateZakatPenghasilan({ monthlyIncome: 10000000, otherIncome: 2000000 });
  assert.equal(resAbove.isNisabReached, true, 'Penghasilan 12jt harus mencapai nisab');
  assert.equal(resAbove.isObligatory, true);
  assert.equal(resAbove.baseAmount, 12000000);
  assert.equal(resAbove.estimatedZakat, 300000, '2.5% dari 12jt adalah 300rb');

  // Input nol / kosong
  const resZero = calculateZakatPenghasilan({ monthlyIncome: 0, otherIncome: 0 });
  assert.equal(resZero.isNisabReached, false);
  assert.equal(resZero.estimatedZakat, 0);

  // Periode tahunan (10jt/bulan -> 120jt/tahun > 91.681.728)
  const resAnnual = calculateZakatPenghasilan({ monthlyIncome: 10000000, otherIncome: 0, period: 'yearly' });
  assert.equal(resAnnual.isNisabReached, true);
  assert.equal(resAnnual.baseAmount, 120000000);
  assert.equal(resAnnual.estimatedZakat, 3000000); // 2.5% * 120jt = 3jt
}

// 2. Test Zakat Emas
console.log('2. Testing Zakat Emas...');
{
  const goldPrice = 1400000;

  // Di bawah 85 gram (50g)
  const resBelow = calculateZakatEmas({ goldWeightGram: 50, goldPricePerGram: goldPrice, hasHaul: true });
  assert.equal(resBelow.isNisabReached, false, '50g emas harus belum capai nisab 85g');
  assert.equal(resBelow.isObligatory, false);
  assert.equal(resBelow.estimatedZakat, 0);

  // Di atas 85 gram (100g) dengan haul terpenuhi
  const resAbove = calculateZakatEmas({ goldWeightGram: 100, goldPricePerGram: goldPrice, hasHaul: true });
  assert.equal(resAbove.isNisabReached, true);
  assert.equal(resAbove.isObligatory, true);
  assert.equal(resAbove.baseAmount, 140000000);
  assert.equal(resAbove.estimatedZakat, 3500000, '2.5% dari 140jt adalah 3.5jt');
  assert.equal(resAbove.estimatedZakatGram, 2.5, '2.5% dari 100 gram emas adalah 2.5 gram');

  // 100 gram tapi belum haul 1 tahun
  const resNoHaul = calculateZakatEmas({ goldWeightGram: 100, goldPricePerGram: goldPrice, hasHaul: false });
  assert.equal(resNoHaul.isNisabReached, true, 'Nisab gram tercapai');
  assert.equal(resNoHaul.isObligatory, false, 'Belum haul 1 tahun, maka belum wajib zakat');
  assert.equal(resNoHaul.estimatedZakat, 0);
}

// 3. Test Zakat Tabungan
console.log('3. Testing Zakat Tabungan...');
{
  const goldPrice = 1400000;
  // Nisab 85 * 1.400.000 = 119.000.000

  // Saldo tabungan 50jt + simpanan lain 20jt = 70jt (< 119jt)
  const resBelow = calculateZakatTabungan({ savingsBalance: 50000000, otherSavings: 20000000, goldPricePerGram: goldPrice, hasHaul: true });
  assert.equal(resBelow.isNisabReached, false);
  assert.equal(resBelow.isObligatory, false);
  assert.equal(resBelow.estimatedZakat, 0);

  // Saldo tabungan 150jt + simpanan lain 50jt = 200jt (> 119jt)
  const resAbove = calculateZakatTabungan({ savingsBalance: 150000000, otherSavings: 50000000, goldPricePerGram: goldPrice, hasHaul: true });
  assert.equal(resAbove.isNisabReached, true);
  assert.equal(resAbove.isObligatory, true);
  assert.equal(resAbove.baseAmount, 200000000);
  assert.equal(resAbove.estimatedZakat, 5000000); // 2.5% * 200jt = 5jt
}

// 4. Test Zakat Perdagangan
console.log('4. Testing Zakat Perdagangan...');
{
  const goldPrice = 1400000;
  // Nisab = 119.000.000

  // Aset lancar 300jt - Utang lancar 100jt = 200jt (> 119jt)
  const resAbove = calculateZakatPerdagangan({
    currentAssets: 300000000,
    shortTermLiabilities: 100000000,
    goldPricePerGram: goldPrice,
    hasHaul: true,
  });
  assert.equal(resAbove.isNisabReached, true);
  assert.equal(resAbove.isObligatory, true);
  assert.equal(resAbove.baseAmount, 200000000);
  assert.equal(resAbove.estimatedZakat, 5000000);

  // Nilai dasar perdagangan negatif (Utang 100jt > Aset lancar 50jt)
  const resNegative = calculateZakatPerdagangan({
    currentAssets: 50000000,
    shortTermLiabilities: 100000000,
    goldPricePerGram: goldPrice,
    hasHaul: true,
  });
  assert.equal(resNegative.baseAmount, 0, 'Aset dasar tidak boleh negatif');
  assert.equal(resNegative.netWorth, -50000000);
  assert.equal(resNegative.isNisabReached, false);
  assert.equal(resNegative.isObligatory, false);
  assert.equal(resNegative.estimatedZakat, 0, 'Zakat tidak boleh negatif');
}

console.log('ALL ZAKAT CALCULATION TESTS PASSED SUCCESSFULLY! ✅');
