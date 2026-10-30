// Halaman fitur Kalkulator Zakat OpenDonasi (/zakat/kalkulator).
// Menyediakan simulasi perhitungan zakat untuk 4 kategori: Penghasilan, Emas, Tabungan, Perdagangan.
// Berpedoman pada acuan BAZNAS SK No. 1 Tahun 2026 (Nisab 85 gram emas).

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { formatRupiah } from '../../lib/formatters';
import { ZAKAT_CONFIG } from '../../data/zakatConfig';
import {
  calculateZakatPenghasilan,
  calculateZakatEmas,
  calculateZakatTabungan,
  calculateZakatPerdagangan,
} from '../../lib/zakatCalculator';

// Helper format input string angka ke format pemisah ribuan
function formatRupiahInput(val) {
  if (!val) return '';
  const clean = val.replace(/\D/g, '');
  if (!clean) return '';
  return new Intl.NumberFormat('id-ID').format(clean);
}

// Helper parse input string angka menjadi integer murni
function parseRupiahInput(val) {
  if (!val) return 0;
  const clean = val.replace(/\D/g, '');
  return parseInt(clean, 10) || 0;
}

// Ikon Kategori Zakat Khas OpenDonasi (Bebas dari emoji dan style AI generik)
function IncomeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" strokeWidth={2.5} />
    </svg>
  );
}

function GoldIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 17.5h17l-2.5-7h-12l-2.5 7z" />
      <path d="M6.5 10.5l2-5h7l2 5" />
      <line x1="8.5" y1="17.5" x2="10" y2="10.5" />
      <line x1="15.5" y1="17.5" x2="14" y2="10.5" />
    </svg>
  );
}

function SavingsIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M4 10h16" />
      <path d="M6 10v8" />
      <path d="M10 10v8" />
      <path d="M14 10v8" />
      <path d="M18 10v8" />
      <path d="M12 3L2 8h20L12 3z" />
    </svg>
  );
}

function TradeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 2 0" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      <path d="M10 21v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
    </svg>
  );
}

const ZAKAT_TABS = [
  {
    id: 'penghasilan',
    name: 'Zakat Penghasilan',
    subtitle: 'Gaji & Profesi Rutin',
    icon: IncomeIcon,
    nisabBrief: 'Rp7.640.144 / bln',
  },
  {
    id: 'emas',
    name: 'Zakat Emas',
    subtitle: 'Logam Mulia (85g)',
    icon: GoldIcon,
    nisabBrief: '85 gram emas',
  },
  {
    id: 'tabungan',
    name: 'Zakat Tabungan',
    subtitle: 'Uang & Kas Simpanan',
    icon: SavingsIcon,
    nisabBrief: 'Setara 85g emas',
  },
  {
    id: 'perdagangan',
    name: 'Zakat Perdagangan',
    subtitle: 'Aset Bersih Usaha',
    icon: TradeIcon,
    nisabBrief: 'Setara 85g emas',
  },
];

export function ZakatCalculatorPage() {
  const navigate = useNavigate();

  // Tab jenis zakat aktif: 'penghasilan' | 'emas' | 'tabungan' | 'perdagangan'
  const [activeType, setActiveType] = useState('penghasilan');

  // State Form: Zakat Penghasilan
  const [salaryInput, setSalaryInput] = useState('');
  const [otherIncomeInput, setOtherIncomeInput] = useState('');
  const [incomePeriod, setIncomePeriod] = useState('monthly'); // 'monthly' | 'yearly'

  // State Form: Zakat Emas
  const [goldWeightInput, setGoldWeightInput] = useState('');
  const [goldPriceInput, setGoldPriceInput] = useState(
    formatRupiahInput(String(ZAKAT_CONFIG.gold.defaultPricePerGram))
  );
  const [goldHaul, setGoldHaul] = useState(true);

  // State Form: Zakat Tabungan
  const [savingsInput, setSavingsInput] = useState('');
  const [otherSavingsInput, setOtherSavingsInput] = useState('');
  const [savingsGoldPriceInput, setSavingsGoldPriceInput] = useState(
    formatRupiahInput(String(ZAKAT_CONFIG.gold.defaultPricePerGram))
  );
  const [savingsHaul, setSavingsHaul] = useState(true);

  // State Form: Zakat Perdagangan
  const [assetsInput, setAssetsInput] = useState('');
  const [debtsInput, setDebtsInput] = useState('');
  const [tradeGoldPriceInput, setTradeGoldPriceInput] = useState(
    formatRupiahInput(String(ZAKAT_CONFIG.gold.defaultPricePerGram))
  );
  const [tradeHaul, setTradeHaul] = useState(true);

  // Hasil Perhitungan & Status
  const [calculationResult, setCalculationResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // SEO & Scroll to Top
  useEffect(() => {
    document.title = 'Kalkulator Zakat — OpenDonasi';
    window.scrollTo(0, 0);
  }, []);

  // Reset form saat berganti jenis zakat
  const handleTypeChange = (newType) => {
    setActiveType(newType);
    setCalculationResult(null);
    setErrors({});
  };

  // Reset seluruh field form yang sedang aktif
  const handleReset = () => {
    setErrors({});
    setCalculationResult(null);
    if (activeType === 'penghasilan') {
      setSalaryInput('');
      setOtherIncomeInput('');
      setIncomePeriod('monthly');
    } else if (activeType === 'emas') {
      setGoldWeightInput('');
      setGoldPriceInput(formatRupiahInput(String(ZAKAT_CONFIG.gold.defaultPricePerGram)));
      setGoldHaul(true);
    } else if (activeType === 'tabungan') {
      setSavingsInput('');
      setOtherSavingsInput('');
      setSavingsGoldPriceInput(formatRupiahInput(String(ZAKAT_CONFIG.gold.defaultPricePerGram)));
      setSavingsHaul(true);
    } else if (activeType === 'perdagangan') {
      setAssetsInput('');
      setDebtsInput('');
      setTradeGoldPriceInput(formatRupiahInput(String(ZAKAT_CONFIG.gold.defaultPricePerGram)));
      setTradeHaul(true);
    }
  };

  // Handler Submit Perhitungan
  const handleCalculate = (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (activeType === 'penghasilan') {
      const salary = parseRupiahInput(salaryInput);
      if (!salaryInput || salary <= 0) {
        newErrors.salary = 'Penghasilan pokok bulanan wajib diisi (minimal Rp1).';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});

      const res = calculateZakatPenghasilan({
        monthlyIncome: salary,
        otherIncome: parseRupiahInput(otherIncomeInput),
        period: incomePeriod,
      });
      setCalculationResult(res);
    } else if (activeType === 'emas') {
      const weight = parseFloat(goldWeightInput.replace(',', '.'));
      const price = parseRupiahInput(goldPriceInput);

      if (!goldWeightInput || isNaN(weight) || weight <= 0) {
        newErrors.goldWeight = 'Berat emas wajib diisi dengan angka gram yang valid (> 0).';
      }
      if (!price || price <= 0) {
        newErrors.goldPrice = 'Harga emas per gram wajib diisi (> Rp0).';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});

      const res = calculateZakatEmas({
        goldWeightGram: weight,
        goldPricePerGram: price,
        hasHaul: goldHaul,
      });
      setCalculationResult(res);
    } else if (activeType === 'tabungan') {
      const balance = parseRupiahInput(savingsInput);
      const price = parseRupiahInput(savingsGoldPriceInput);

      if (!savingsInput || balance <= 0) {
        newErrors.savings = 'Saldo tabungan wajib diisi (minimal Rp1).';
      }
      if (!price || price <= 0) {
        newErrors.savingsPrice = 'Harga acuan emas wajib diisi (> Rp0).';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});

      const res = calculateZakatTabungan({
        savingsBalance: balance,
        otherSavings: parseRupiahInput(otherSavingsInput),
        goldPricePerGram: price,
        hasHaul: savingsHaul,
      });
      setCalculationResult(res);
    } else if (activeType === 'perdagangan') {
      const assets = parseRupiahInput(assetsInput);
      const debts = parseRupiahInput(debtsInput);
      const price = parseRupiahInput(tradeGoldPriceInput);

      if (!assetsInput || assets <= 0) {
        newErrors.assets = 'Nilai aset lancar usaha wajib diisi (minimal Rp1).';
      }
      if (!price || price <= 0) {
        newErrors.tradePrice = 'Harga acuan emas wajib diisi (> Rp0).';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});

      const res = calculateZakatPerdagangan({
        currentAssets: assets,
        shortTermLiabilities: debts,
        goldPricePerGram: price,
        hasHaul: tradeHaul,
      });
      setCalculationResult(res);
    }
  };

  // Handler Salin Hasil ke Clipboard
  const handleCopyResult = () => {
    if (!calculationResult || !navigator.clipboard) return;
    const text = `Ringkasan Estimasi Zakat (${calculationResult.typeName})\n` +
      `Nilai Dasar: ${formatRupiah(calculationResult.baseAmount)}\n` +
      `Batas Nisab: ${formatRupiah(calculationResult.nisabAmount)}\n` +
      `Status: ${calculationResult.isObligatory ? 'Wajib Zakat' : 'Belum Wajib Zakat'}\n` +
      `Estimasi Zakat: ${calculationResult.isObligatory ? formatRupiah(calculationResult.estimatedZakat) : 'Rp0'}\n` +
      `Acuan: ${ZAKAT_CONFIG.meta.source} (${ZAKAT_CONFIG.meta.effectiveYear})\n` +
      `Dihitung via OpenDonasi: ${window.location.href}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2500);
    });
  };

  // Tombol Kembali
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/zakat');
    }
  };

  return (
    <div className="w-full min-h-screen bg-background pb-20">
      {/* 1. Header Khusus Kalkulator Zakat: Tombol Kembali + Judul Center */}
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-2xs">
        <Container className="h-14 sm:h-16 relative flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary transition-colors cursor-pointer py-1.5 pr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg z-10"
            aria-label="Kembali"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </button>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
            <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 truncate">
              Kalkulator Zakat
            </h1>
          </div>

          <div className="w-20 sm:w-24" aria-hidden="true" />
        </Container>
      </header>

      {/* 2. Konten Utama: Menggunakan Container Max-Width 1320px OpenDonasi */}
      <main className="py-6 sm:py-10">
        <Container>
          <div className="w-full max-w-desktop mx-auto space-y-6 sm:space-y-8">
            {/* Pengantar & Standar Nisab */}
            <div className="pb-5 border-b border-slate-200/80">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold mb-2 border border-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Standar Resmi BAZNAS RI 2026 (Nisab 85g Emas)</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Kalkulator Hitung Zakat
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Hitung taksiran kewajiban zakat Anda secara akurat dan transparan berdasarkan standar nisab dan ketentuan syariat Islam.
              </p>
            </div>

            {/* Pilihan 4 Kategori Jenis Zakat dengan Ikon Vektor Bersih */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pilih Kategori Zakat
                </label>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Pilih untuk menyesuaikan acuan nisab dan formulir perhitungan
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {ZAKAT_TABS.map((tab) => {
                  const isSelected = activeType === tab.id;
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTypeChange(tab.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between group relative ${
                        isSelected
                          ? 'bg-white border-2 border-primary shadow-xs ring-2 ring-primary/10'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-primary text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-primary'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>

                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>

                      <div>
                        <div className={`text-xs sm:text-sm font-bold leading-snug ${isSelected ? 'text-primary' : 'text-slate-900'}`}>
                          {tab.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {tab.subtitle}
                        </div>
                        <div className={`mt-2.5 pt-2 border-t text-[10px] font-semibold ${
                          isSelected ? 'border-primary/15 text-primary' : 'border-slate-100 text-slate-400'
                        }`}>
                          Nisab: {tab.nisabBrief}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid 2 Kolom Layout Responsif (7 Kolom Form : 5 Kolom Hasil) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* SISI KIRI (KOLOM 1..7): Formulir Dinamis */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Formulir {activeType === 'penghasilan' ? 'Zakat Penghasilan' : activeType === 'emas' ? 'Zakat Emas' : activeType === 'tabungan' ? 'Zakat Tabungan' : 'Zakat Perdagangan'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {activeType === 'penghasilan' && 'Dihitung dari penghasilan kotor (bruto) per bulan atau tahun dengan nisab setara 85 gram emas.'}
                    {activeType === 'emas' && 'Dihitung bila memiliki emas murni minimal 85 gram yang telah tersimpan genap 1 tahun (haul).'}
                    {activeType === 'tabungan' && 'Dihitung dari saldo simpanan uang yang telah mengendap selama 1 tahun mencapai nisab 85 gram emas.'}
                    {activeType === 'perdagangan' && 'Dihitung dari selisih aset lancar dikurangi utang jangka pendek perniagaan yang telah berjalan 1 tahun.'}
                  </p>
                </div>

                <form onSubmit={handleCalculate} className="space-y-5">
                  {/* === FORM 1: ZAKAT PENGHASILAN === */}
                  {activeType === 'penghasilan' && (
                    <>
                      {/* Pilihan Periode Bulanan / Tahunan */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Periode Perhitungan
                        </label>
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
                          <button
                            type="button"
                            onClick={() => {
                              setIncomePeriod('monthly');
                              setCalculationResult(null);
                            }}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              incomePeriod === 'monthly'
                                ? 'bg-white text-primary shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Bulanan
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIncomePeriod('yearly');
                              setCalculationResult(null);
                            }}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              incomePeriod === 'yearly'
                                ? 'bg-white text-primary shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Tahunan
                          </button>
                        </div>
                      </div>

                      {/* Input Gaji Pokok Bulanan */}
                      <div>
                        <label htmlFor="salary" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Penghasilan / Gaji Pokok {incomePeriod === 'yearly' ? 'Rata-rata per Bulan' : 'per Bulan'} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Rp
                          </span>
                          <input
                            id="salary"
                            type="text"
                            inputMode="numeric"
                            value={salaryInput}
                            onChange={(e) => {
                              setSalaryInput(formatRupiahInput(e.target.value));
                              if (errors.salary) setErrors((prev) => ({ ...prev, salary: null }));
                            }}
                            placeholder="Contoh: 10.000.000"
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                          />
                        </div>
                        {errors.salary && (
                          <p className="mt-1 text-xs text-rose-500 font-medium">{errors.salary}</p>
                        )}
                      </div>

                      {/* Input Penghasilan Tambahan */}
                      <div>
                        <label htmlFor="otherIncome" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Penghasilan Tambahan / Bonus / Tunjangan Lain per Bulan (Opsional)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Rp
                          </span>
                          <input
                            id="otherIncome"
                            type="text"
                            inputMode="numeric"
                            value={otherIncomeInput}
                            onChange={(e) => setOtherIncomeInput(formatRupiahInput(e.target.value))}
                            placeholder="0"
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Masukkan pendapatan lain seperti honor, dividen usaha, atau bonus rutin.
                        </p>
                      </div>
                    </>
                  )}

                  {/* === FORM 2: ZAKAT EMAS === */}
                  {activeType === 'emas' && (
                    <>
                      {/* Berat Emas dalam Gram */}
                      <div>
                        <label htmlFor="goldWeight" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Jumlah / Berat Emas yang Disimpan (Gram) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="goldWeight"
                            type="number"
                            step="0.1"
                            min="0"
                            value={goldWeightInput}
                            onChange={(e) => {
                              setGoldWeightInput(e.target.value);
                              if (errors.goldWeight) setErrors((prev) => ({ ...prev, goldWeight: null }));
                            }}
                            placeholder="Contoh: 85"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Gram
                          </span>
                        </div>
                        {errors.goldWeight && (
                          <p className="mt-1 text-xs text-rose-500 font-medium">{errors.goldWeight}</p>
                        )}
                        <p className="mt-1 text-[11px] text-slate-400">
                          Batas nisab minimal adalah 85 gram emas murni.
                        </p>
                      </div>

                      {/* Harga Emas per Gram Acuan */}
                      <div>
                        <label htmlFor="goldPrice" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Harga Emas per Gram Saat Ini (Rupiah) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Rp
                          </span>
                          <input
                            id="goldPrice"
                            type="text"
                            inputMode="numeric"
                            value={goldPriceInput}
                            onChange={(e) => {
                              setGoldPriceInput(formatRupiahInput(e.target.value));
                              if (errors.goldPrice) setErrors((prev) => ({ ...prev, goldPrice: null }));
                            }}
                            placeholder="1.400.000"
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900"
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Dapat disesuaikan dengan harga pasar emas batangan saat Anda menghitung.
                        </p>
                      </div>

                      {/* Syarat Haul Emas */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={goldHaul}
                            onChange={(e) => setGoldHaul(e.target.checked)}
                            className="w-4 h-4 mt-0.5 text-primary border-slate-300 rounded focus:ring-primary"
                          />
                          <span className="text-xs text-slate-700 leading-snug">
                            Emas telah dimiliki dan tersimpan selama minimal <strong>1 tahun hijriyah (Haul)</strong> penuh.
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* === FORM 3: ZAKAT TABUNGAN === */}
                  {activeType === 'tabungan' && (
                    <>
                      {/* Saldo Tabungan */}
                      <div>
                        <label htmlFor="savings" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Saldo Rekening Tabungan / Kas Mengendap <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Rp
                          </span>
                          <input
                            id="savings"
                            type="text"
                            inputMode="numeric"
                            value={savingsInput}
                            onChange={(e) => {
                              setSavingsInput(formatRupiahInput(e.target.value));
                              if (errors.savings) setErrors((prev) => ({ ...prev, savings: null }));
                            }}
                            placeholder="Contoh: 100.000.000"
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                          />
                        </div>
                        {errors.savings && (
                          <p className="mt-1 text-xs text-rose-500 font-medium">{errors.savings}</p>
                        )}
                      </div>

                      {/* Simpanan Lain / Deposito */}
                      <div>
                        <label htmlFor="otherSavings" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Deposito / Bagi Hasil / Simpanan Likuid Lainnya (Opsional)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Rp
                          </span>
                          <input
                            id="otherSavings"
                            type="text"
                            inputMode="numeric"
                            value={otherSavingsInput}
                            onChange={(e) => setOtherSavingsInput(formatRupiahInput(e.target.value))}
                            placeholder="0"
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Harga Acuan Emas Tabungan */}
                      <div>
                        <label htmlFor="savingsGoldPrice" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Harga Emas per Gram Acuan Nisab (Rupiah)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Rp
                          </span>
                          <input
                            id="savingsGoldPrice"
                            type="text"
                            inputMode="numeric"
                            value={savingsGoldPriceInput}
                            onChange={(e) => setSavingsGoldPriceInput(formatRupiahInput(e.target.value))}
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Syarat Haul Tabungan */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={savingsHaul}
                            onChange={(e) => setSavingsHaul(e.target.checked)}
                            className="w-4 h-4 mt-0.5 text-primary border-slate-300 rounded focus:ring-primary"
                          />
                          <span className="text-xs text-slate-700 leading-snug">
                            Saldo tabungan telah mengendap selama minimal <strong>1 tahun (Haul)</strong>.
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* === FORM 4: ZAKAT PERDAGANGAN === */}
                  {activeType === 'perdagangan' && (
                    <>
                      {/* Aset Lancar Usaha */}
                      <div>
                        <label htmlFor="assets" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Nilai Aset Lancar Usaha (Kas + Piutang Lancar + Stok Barang) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Rp
                          </span>
                          <input
                            id="assets"
                            type="text"
                            inputMode="numeric"
                            value={assetsInput}
                            onChange={(e) => {
                              setAssetsInput(formatRupiahInput(e.target.value));
                              if (errors.assets) setErrors((prev) => ({ ...prev, assets: null }));
                            }}
                            placeholder="Contoh: 150.000.000"
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                          />
                        </div>
                        {errors.assets && (
                          <p className="mt-1 text-xs text-rose-500 font-medium">{errors.assets}</p>
                        )}
                      </div>

                      {/* Utang Usaha Jangka Pendek */}
                      <div>
                        <label htmlFor="debts" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Kewajiban Jangka Pendek (Utang Usaha Jatuh Tempo) (Opsional)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Rp
                          </span>
                          <input
                            id="debts"
                            type="text"
                            inputMode="numeric"
                            value={debtsInput}
                            onChange={(e) => setDebtsInput(formatRupiahInput(e.target.value))}
                            placeholder="0"
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900"
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Utang jatuh tempo dalam tahun buku berjalan yang mengurangi dasar zakat.
                        </p>
                      </div>

                      {/* Harga Acuan Emas Perdagangan */}
                      <div>
                        <label htmlFor="tradeGoldPrice" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Harga Emas per Gram Acuan Nisab (Rupiah)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            Rp
                          </span>
                          <input
                            id="tradeGoldPrice"
                            type="text"
                            inputMode="numeric"
                            value={tradeGoldPriceInput}
                            onChange={(e) => setTradeGoldPriceInput(formatRupiahInput(e.target.value))}
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Syarat Haul Perdagangan */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={tradeHaul}
                            onChange={(e) => setTradeHaul(e.target.checked)}
                            className="w-4 h-4 mt-0.5 text-primary border-slate-300 rounded focus:ring-primary"
                          />
                          <span className="text-xs text-slate-700 leading-snug">
                            Usaha perniagaan telah berjalan selama minimal <strong>1 tahun (Haul)</strong>.
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* Tombol Aksi: Hitung Zakat & Reset */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Hitung Zakat</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="py-3 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>

              {/* SISI KANAN (KOLOM 8..12): Panel Ringkasan Nisab & Hasil Perhitungan */}
              <div className="lg:col-span-5 space-y-5 sticky top-20 self-start">
                {/* 1. KONDISI SUDAH DIHITUNG: TAMPILKAN HASIL ESTIMASI */}
                {calculationResult ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Hasil Perhitungan
                      </span>
                      {calculationResult.isObligatory ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Wajib Zakat</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                          Belum Wajib Zakat
                        </span>
                      )}
                    </div>

                    {/* Box Estimasi Nominal Utama */}
                    {calculationResult.isObligatory ? (
                      <div className="bg-[#EEF4FF] rounded-2xl p-5 border border-primary/20 text-center space-y-1">
                        <span className="text-xs font-medium text-slate-600 block">
                          Estimasi Zakat yang Wajib Dikeluarkan ({calculationResult.periodLabel || 'per periode'})
                        </span>
                        <strong className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight font-sans block">
                          {formatRupiah(calculationResult.estimatedZakat)}
                        </strong>
                        {calculationResult.estimatedZakatGram ? (
                          <span className="text-xs text-primary font-semibold block">
                            atau setara {calculationResult.estimatedZakatGram} gram emas
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200/80 text-center space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                          </svg>
                        </div>
                        <strong className="text-sm font-bold text-slate-900 block">
                          Belum Mencapai Batas Nisab
                        </strong>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Harta yang dihitung belum mencapai batas nisab ({formatRupiah(calculationResult.nisabAmount)}). Anda belum berkewajiban menunaikan zakat maal, namun sangat dianjurkan menunaikan infaq atau sedekah sukarela.
                        </p>
                      </div>
                    )}

                    {/* Rincian Angka Dasar & Ketentuan */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Nilai Harta Dasar:</span>
                        <span className="font-semibold text-slate-800">
                          {formatRupiah(calculationResult.baseAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Batas Nisab Acuan:</span>
                        <span className="font-semibold text-slate-800">
                          {formatRupiah(calculationResult.nisabAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Kadar Zakat:</span>
                        <span className="font-semibold text-slate-800">2,5%</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-slate-500">Status Syarat Haul:</span>
                        <span className="font-semibold text-primary">
                          {calculationResult.hasHaul !== false ? 'Terpenuhi (1 Tahun)' : 'Belum 1 Tahun'}
                        </span>
                      </div>
                    </div>

                    {/* Tombol Aksi Lanjutan */}
                    <div className="space-y-2.5 pt-2">
                      {calculationResult.isObligatory ? (
                        <Link
                          to={`/donasi/zakat-penghasilan-bantu-mustahik?amount=${calculationResult.estimatedZakat}`}
                          className="block w-full"
                        >
                          <button
                            type="button"
                            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                          >
                            <span>Salurkan Zakat Sekarang</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </Link>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Link to="/infaq" className="block w-full">
                            <button
                              type="button"
                              className="w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer text-center"
                            >
                              Salurkan Infaq
                            </button>
                          </Link>
                          <Link to="/sedekah" className="block w-full">
                            <button
                              type="button"
                              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
                            >
                              Salurkan Sedekah
                            </button>
                          </Link>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCopyResult}
                          className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {copiedFeedback ? '✓ Rincian Disalin' : 'Salin Hasil'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalculationResult(null)}
                          className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Hitung Ulang
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 2. KONDISI BELUM DIHITUNG: PANDUAN DASAR NISAB DENGAN IKON VEKTOR */
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Ketentuan Nisab & Zakat
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Pedoman resmi SK BAZNAS No. 1 Tahun 2026
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                      {/* Box Dinamis Sesuai Kategori yang Sedang Dipilih */}
                      {activeType === 'penghasilan' && (
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80 space-y-1">
                          <strong className="text-primary font-bold block text-xs">
                            Nisab Zakat Penghasilan:
                          </strong>
                          <p className="text-slate-700">
                            Setara 85 gram emas per tahun, yaitu <strong>Rp7.640.144 / bulan</strong> atau <strong>Rp91.681.728 / tahun</strong>.
                          </p>
                        </div>
                      )}

                      {activeType === 'emas' && (
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80 space-y-1">
                          <strong className="text-primary font-bold block text-xs">
                            Nisab Zakat Emas:
                          </strong>
                          <p className="text-slate-700">
                            Mencapai minimal <strong>85 gram emas murni</strong> yang telah dimiliki genap <strong>1 tahun hijriyah (haul)</strong>.
                          </p>
                        </div>
                      )}

                      {activeType === 'tabungan' && (
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80 space-y-1">
                          <strong className="text-primary font-bold block text-xs">
                            Nisab Zakat Tabungan:
                          </strong>
                          <p className="text-slate-700">
                            Saldo simpanan yang mengendap selama <strong>1 tahun (haul)</strong> mencapai nilai setara <strong>85 gram emas</strong> (± Rp119.000.000).
                          </p>
                        </div>
                      )}

                      {activeType === 'perdagangan' && (
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80 space-y-1">
                          <strong className="text-primary font-bold block text-xs">
                            Nisab Zakat Perdagangan:
                          </strong>
                          <p className="text-slate-700">
                            Nilai aset lancar dikurangi kewajiban jangka pendek usaha yang telah berjalan <strong>1 tahun</strong> mencapai nilai setara <strong>85 gram emas</strong>.
                          </p>
                        </div>
                      )}

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <strong className="text-slate-800 font-semibold block text-xs">
                          Kadar Kewajiban:
                        </strong>
                        <p className="text-slate-600">
                          Kadar zakat yang wajib dikeluarkan adalah <strong>2,5% (seperempat puluh)</strong> dari harta yang telah memenuhi nisab dan haul.
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <strong className="text-slate-800 font-semibold block text-xs">
                          Penyaluran Mustahik:
                        </strong>
                        <p className="text-slate-600">
                          Zakat disalurkan secara amanah kepada 8 asnaf penerima yang berhak sesuai syariat Islam.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Edukasi & Batasan Prototype */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 text-xs text-slate-500 leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Simulasi Edukatif OpenDonasi</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Kalkulator ini merupakan simulasi frontend OpenDonasi. Nilai acuan nisab dapat disesuaikan dengan penetapan resmi BAZNAS atau harga pasar emas saat menghitung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

export default ZakatCalculatorPage;
