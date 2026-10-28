// Halaman formulir donasi OpenDonasi (/donasi/:slug).
// Alur bertahap (Multi-step):
// 1. Pilih Nominal Donasi
// 2. Pilih Metode Pembayaran
// 3. Isi Formulir Donatur & Konfirmasi Pembayaran

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { CAMPAIGNS } from '../../data/campaigns';
import { Button } from '../../components/ui/Button';
import { formatRupiah, formatNumber } from '../../lib/formatters';
import { useDonation } from '../../hooks/useDonation';

// Preset nominal donasi (Sesuai Referensi Gambar 1)
const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 5000000];
const MIN_AMOUNT = 10000;

// Daftar metode pembayaran (Sesuai Referensi Gambar 2)
const PAYMENT_CATEGORIES = [
  {
    id: 'instant',
    title: 'Pembayaran Instan (Cepat & Mudah)',
    methods: [
      {
        id: 'saku_kebaikan',
        name: 'Saku Kebaikan',
        category: 'instant',
        subtitle: 'Diperlukan login ke akunmu',
        iconType: 'saku',
      },
      {
        id: 'gopay',
        name: 'GoPay',
        category: 'instant',
        iconType: 'gopay',
      },
      {
        id: 'ovo',
        name: 'OVO',
        category: 'instant',
        iconType: 'ovo',
      },
      {
        id: 'dana',
        name: 'Dana',
        category: 'instant',
        iconType: 'dana',
      },
      {
        id: 'shopeepay',
        name: 'ShopeePay',
        category: 'instant',
        iconType: 'shopeepay',
      },
      {
        id: 'qris',
        name: 'QRIS',
        category: 'instant',
        iconType: 'qris',
      },
    ],
  },
  {
    id: 'va',
    title: 'Virtual Account (Transaksi diverifikasi otomatis)',
    methods: [
      {
        id: 'maybank_va',
        name: 'Maybank Syariah Virtual Account',
        category: 'va',
        iconType: 'maybank',
      },
      {
        id: 'mandiri_va',
        name: 'Mandiri Virtual Account',
        category: 'va',
        iconType: 'mandiri',
      },
      {
        id: 'bri_va',
        name: 'BRI Virtual Account',
        category: 'va',
        iconType: 'bri',
      },
      {
        id: 'bni_va',
        name: 'BNI Virtual Account',
        category: 'va',
        iconType: 'bni',
      },
      {
        id: 'cimb_va',
        name: 'CIMB Virtual Account',
        category: 'va',
        iconType: 'cimb',
      },
      {
        id: 'permata_va',
        name: 'Permata Virtual Account',
        category: 'va',
        iconType: 'permata',
      },
      {
        id: 'danamon_va',
        name: 'Danamon Virtual Account',
        category: 'va',
        iconType: 'danamon',
      },
      {
        id: 'bsi_va',
        name: 'BSI Virtual Account',
        category: 'va',
        iconType: 'bsi',
      },
      {
        id: 'bjb_va',
        name: 'BJB Virtual Account',
        category: 'va',
        iconType: 'bjb',
      },
      {
        id: 'bca_va',
        name: 'BCA Virtual Account',
        category: 'va',
        iconType: 'bca',
      },
    ],
  },
];

// Komponen Icon/Logo Metode Pembayaran Khas Brand (Ukuran 16:9 Persegi Panjang)
function PaymentMethodIcon({ type, className = '' }) {
  const baseBox = `w-[54px] aspect-[16/9] rounded-md shrink-0 flex items-center justify-center shadow-2xs border select-none overflow-hidden ${className}`;

  switch (type) {
    case 'saku':
      return (
        <div className={`${baseBox} bg-amber-500 border-amber-600/20 text-white font-black text-[10px] tracking-wider`}>
          <span>SAKU</span>
        </div>
      );
    case 'gopay':
      return (
        <div className={`${baseBox} bg-[#00AED6] border-[#0095b8]/20 text-white font-bold text-[11px] tracking-tight`}>
          <span>gopay</span>
        </div>
      );
    case 'ovo':
      return (
        <div className={`${baseBox} bg-[#4C2A86] border-[#3e226d]/20 text-white font-black text-[11px] tracking-wider`}>
          <span>OVO</span>
        </div>
      );
    case 'dana':
      return (
        <div className={`${baseBox} bg-[#118EEA] border-[#0e7bcc]/20 text-white font-black text-[11px] tracking-wider`}>
          <span>DANA</span>
        </div>
      );
    case 'shopeepay':
      return (
        <div className={`${baseBox} bg-[#EE4D2D] border-[#d43f21]/20 text-white font-bold text-[9.5px] tracking-tight`}>
          <span>Shopee</span>
        </div>
      );
    case 'qris':
      return (
        <div className={`${baseBox} bg-slate-900 border-slate-950 text-white font-black text-[10.5px] tracking-widest`}>
          <span>QRIS</span>
        </div>
      );
    case 'bca':
      return (
        <div className={`${baseBox} bg-[#005EAA] border-[#004e8d]/20 text-white font-black text-[11px] tracking-wider`}>
          <span>BCA</span>
        </div>
      );
    case 'mandiri':
      return (
        <div className={`${baseBox} bg-[#003D79] border-[#002f5e]/20 text-amber-400 font-extrabold text-[9.5px] tracking-tight`}>
          <span>mandiri</span>
        </div>
      );
    case 'bri':
      return (
        <div className={`${baseBox} bg-[#00529C] border-[#004482]/20 text-white font-black text-[10.5px] tracking-wider`}>
          <span>BRI</span>
        </div>
      );
    case 'bni':
      return (
        <div className={`${baseBox} bg-[#F15A24] border-[#d64a18]/20 text-white font-black text-[10.5px] tracking-wider`}>
          <span>BNI</span>
        </div>
      );
    case 'bsi':
      return (
        <div className={`${baseBox} bg-[#00A39D] border-[#008782]/20 text-white font-black text-[10.5px] tracking-wider`}>
          <span>BSI</span>
        </div>
      );
    case 'cimb':
      return (
        <div className={`${baseBox} bg-[#7E0000] border-[#660000]/20 text-white font-black text-[9.5px] tracking-tight`}>
          <span>CIMB</span>
        </div>
      );
    case 'permata':
      return (
        <div className={`${baseBox} bg-[#008542] border-[#006e37]/20 text-white font-bold text-[9px] tracking-tight`}>
          <span>Permata</span>
        </div>
      );
    case 'danamon':
      return (
        <div className={`${baseBox} bg-[#F37024] border-[#d85e17]/20 text-white font-bold text-[9px] tracking-tight`}>
          <span>Danamon</span>
        </div>
      );
    case 'maybank':
      return (
        <div className={`${baseBox} bg-[#FFCE00] border-amber-400/30 text-slate-900 font-black text-[9px] tracking-tight`}>
          <span>Maybank</span>
        </div>
      );
    case 'bjb':
      return (
        <div className={`${baseBox} bg-[#0B4B88] border-[#093c6d]/20 text-white font-bold text-[10px] tracking-tight`}>
          <span>bjb</span>
        </div>
      );
    default:
      return (
        <div className={`${baseBox} bg-slate-100 border-slate-200 text-slate-700 font-bold text-[10px]`}>
          <span>PAY</span>
        </div>
      );
  }
}

// Komponen Ringkas Banner & Judul Program di Bagian Atas Setiap Tahap
// (Tanpa keterangan 'lihat detail lengkap program nya' sesuai instruksi user)
function ProgramHeaderBanner({ campaign }) {
  if (!campaign) return null;
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-5">
      <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200/60 aspect-[16/9]">
        {campaign.image ? (
          <img
            src={campaign.image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">
            OD
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
          Program Kebaikan
        </span>
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
          {campaign.title}
        </h2>
      </div>
    </div>
  );
}

export function DonationFormPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addDonation, currentUser } = useDonation();

  // Cari data kampanye berdasarkan parameter slug
  const campaign = useMemo(() => {
    return CAMPAIGNS.find((c) => c.slug === slug || c.id === slug) || CAMPAIGNS[0];
  }, [slug]);

  // Handler kembali ke detail program tanpa membuat duplikasi riwayat browser
  const handleBackToProgram = () => {
    navigate(`/program/${campaign.slug}`, {
      replace: true,
      state: { from: location.state?.from },
    });
  };

  // Alur langkah: 'amount' (Tahap 1) | 'payment' (Tahap 2) | 'form' (Tahap 3)
  const [step, setStep] = useState('amount');

  // Baca nominal awal jika ada dari query params (misal dari kalkulator zakat)
  const initialAmount = useMemo(() => {
    const qAmount = searchParams.get('amount');
    if (qAmount) {
      const cleanNum = parseInt(qAmount.replace(/\D/g, ''), 10);
      if (cleanNum && cleanNum >= 1000) {
        return cleanNum;
      }
    }
    return 50000;
  }, [searchParams]);

  // State Formulir
  const [selectedPreset, setSelectedPreset] = useState(() => {
    return PRESET_AMOUNTS.includes(initialAmount) ? initialAmount : 50000;
  });
  const [nominalInput, setNominalInput] = useState(String(initialAmount));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(() => {
    // Default terpilih: QRIS (paling populer & instan)
    return PAYMENT_CATEGORIES[0].methods[5];
  });

  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorPrayer, setDonorPrayer] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set document title untuk SEO
  useEffect(() => {
    if (campaign) {
      document.title = `Donasi: ${campaign.title} — OpenDonasi`;
    } else {
      document.title = 'Formulir Donasi — OpenDonasi';
    }
    window.scrollTo(0, 0);
  }, [campaign, step]);

  // Handler pemilihan nominal preset
  const handleSelectPreset = (amount) => {
    setSelectedPreset(amount);
    setNominalInput(String(amount));
    if (errors.nominal) {
      setErrors((prev) => ({ ...prev, nominal: null }));
    }
  };

  // Handler input nominal manual
  const handleNominalChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setNominalInput(rawVal);

    const numVal = parseInt(rawVal, 10);
    if (PRESET_AMOUNTS.includes(numVal)) {
      setSelectedPreset(numVal);
    } else {
      setSelectedPreset(null);
    }

    if (errors.nominal) {
      setErrors((prev) => ({ ...prev, nominal: null }));
    }
  };

  // Validasi nominal pada Step 1
  const handleProceedToPayment = () => {
    const amount = parseInt(nominalInput, 10);
    if (!nominalInput || isNaN(amount) || amount < MIN_AMOUNT) {
      setErrors({ nominal: `Nominal donasi minimal ${formatRupiah(MIN_AMOUNT)}` });
      return;
    }
    setErrors({});
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler pemilihan metode pembayaran pada Step 2 -> langsung menuju Step 3
  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validasi data donatur pada Step 3 & Submit Simulasi Donasi
  const handleSubmitDonation = (e) => {
    e.preventDefault();
    if (isSubmitting || !campaign) return;

    const errs = {};
    const amount = parseInt(nominalInput, 10);

    if (!nominalInput || isNaN(amount) || amount < MIN_AMOUNT) {
      errs.nominal = `Nominal donasi minimal ${formatRupiah(MIN_AMOUNT)}`;
    }

    if (!donorName.trim()) {
      errs.name = 'Nama lengkap wajib diisi';
    }

    if (!donorPhone.trim()) {
      errs.phone = 'Nomor telepon wajib diisi';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);

    const transaction = {
      transactionId: `OD-${Math.floor(100000 + Math.random() * 900000)}`,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      campaignSlug: campaign.slug,
      campaignImage: campaign.image,
      serviceType: campaign.serviceType || 'donasi',
      amount,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      status: 'success',
      statusLabel: 'Simulasi Berhasil (Demo)',
      isAnonymous,
      donorName: isAnonymous ? 'Hamba Allah' : donorName.trim(),
      actualName: donorName.trim(),
      donorPhone: donorPhone.trim(),
      donorEmail: donorEmail.trim(),
      doa: donorPrayer.trim(),
      paymentMethod: selectedPaymentMethod?.name || 'QRIS',
      paymentCategory: selectedPaymentMethod?.category || 'instant',
    };

    try {
      addDonation(transaction);
      sessionStorage.setItem('opendonasi_latest_transaction', JSON.stringify(transaction));
    } catch {
      // Fallback aman jika storage lokal terkendala
    }

    // Arahkan ke halaman hasil simulasi transaksi
    navigate('/hasil-donasi', { replace: true });
  };

  if (!campaign) {
    return (
      <div className="w-full min-h-screen py-16 flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <h1 className="text-lg font-bold text-slate-900">Program Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 mt-2">
            Program yang ingin Anda dukung tidak tersedia atau tautan telah berpindah.
          </p>
          <button
            type="button"
            onClick={() => navigate('/program')}
            className="mt-5 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold"
          >
            Lihat Program Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-4 sm:py-8">
      <div className="max-w-xl mx-auto px-4">
        {/* ============================================================== */}
        {/* TAHAP 1: PILIH NOMINAL DONASI (Sesuai Referensi Gambar 1)      */}
        {/* ============================================================== */}
        {step === 'amount' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Navigasi Atas: Kembali ke Penggalangan */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={handleBackToProgram}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Kembali ke penggalangan</span>
              </button>
            </div>

            {/* Banner & Judul Program Ringkas */}
            <ProgramHeaderBanner campaign={campaign} />

            {/* Judul Seksi */}
            <h1 className="text-sm sm:text-base font-bold text-slate-900">
              Pilih Nominal Donasi
            </h1>

            {/* List Pilihan Nominal Donasi (Sesuai Gambar 1: Vertikal Stack) */}
            <div className="space-y-2.5">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = selectedPreset === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectPreset(amt)}
                    className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200/90 hover:border-primary/60 hover:bg-slate-50/70'
                    }`}
                  >
                    <span className="font-bold text-xs sm:text-sm tracking-tight">
                      {formatRupiah(amt)}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-white translate-x-0.5' : 'text-slate-400'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* Atau Masukkan Nominal Manual */}
            <div className="pt-2 space-y-1.5">
              <label htmlFor="custom-nominal" className="text-xs sm:text-sm text-slate-600 block">
                Atau masukkan <strong className="text-slate-800 font-semibold">nominal terbaik</strong> Anda
              </label>

              <div
                className={`flex items-center justify-between bg-white rounded-xl border px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all ${
                  errors.nominal ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                }`}
              >
                <span className="font-bold text-slate-900 text-sm sm:text-base mr-2">
                  Rp
                </span>
                <input
                  id="custom-nominal"
                  type="text"
                  inputMode="numeric"
                  value={nominalInput ? formatNumber(parseInt(nominalInput, 10) || 0) : ''}
                  onChange={handleNominalChange}
                  placeholder="0"
                  className="w-full text-right font-bold text-slate-900 text-sm sm:text-base bg-transparent outline-none placeholder:text-slate-300"
                />
              </div>

              {errors.nominal && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.nominal}
                </p>
              )}
            </div>

            {/* Tombol Lanjutkan Pembayaran */}
            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                isFullWidth
                onClick={handleProceedToPayment}
                className="font-bold shadow-xs py-3 text-xs sm:text-sm"
              >
                Lanjutkan Pembayaran
              </Button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAHAP 2: PILIH METODE PEMBAYARAN (Sesuai Referensi Gambar 2)   */}
        {/* ============================================================== */}
        {step === 'payment' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Navigasi Atas: Tombol Back (<) & Judul */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setStep('amount')}
                className="p-1 -ml-1 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Kembali ke pilih nominal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-sm sm:text-base font-bold text-slate-900">
                Pilih metode pembayaran
              </h1>
            </div>

            {/* Banner & Judul Program Ringkas */}
            <ProgramHeaderBanner campaign={campaign} />

            {/* Daftar Kategori & Metode Pembayaran */}
            <div className="space-y-6">
              {PAYMENT_CATEGORIES.map((category) => (
                <div key={category.id} className="space-y-2.5">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                    {category.title}
                  </h2>

                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    {category.methods.map((method) => {
                      const isSelected = selectedPaymentMethod?.id === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => handleSelectPaymentMethod(method)}
                          className={`w-full p-3.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer hover:bg-slate-50/80 ${
                            isSelected ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <PaymentMethodIcon type={method.iconType} />
                            <div className="min-w-0">
                              <span className="text-xs sm:text-sm font-semibold text-slate-800 block truncate">
                                {method.name}
                              </span>
                              {method.subtitle && (
                                <span className="text-[10px] sm:text-[11px] text-amber-600 block mt-0.5">
                                  {method.subtitle}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 text-slate-400">
                            {isSelected ? (
                              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAHAP 3: ISI FORMULIR DONATUR (Sesuai Referensi Gambar 3)       */}
        {/* ============================================================== */}
        {step === 'form' && (
          <form
            onSubmit={handleSubmitDonation}
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
          >
            {/* Navigasi Atas: Tombol Back (<) & Judul Program */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="p-1 -ml-1 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Kembali ke pilih metode pembayaran"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {campaign.title}
              </h1>
            </div>

            {/* Banner & Judul Program Ringkas */}
            <ProgramHeaderBanner campaign={campaign} />

            {/* Ringkasan Nominal & Metode Pembayaran Terpilih */}
            <div className="space-y-3.5">
              {/* Nominal Terpilih */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Nominal Donasi</span>
                  <button
                    type="button"
                    onClick={() => setStep('amount')}
                    className="text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Ubah
                  </button>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Rp</span>
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                    {formatNumber(parseInt(nominalInput, 10) || 0)}
                  </span>
                </div>
              </div>

              {/* Metode Pembayaran Terpilih */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Pilih metode pembayaran</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <PaymentMethodIcon type={selectedPaymentMethod?.iconType} />
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {selectedPaymentMethod?.name || 'QRIS'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer shrink-0"
                  >
                    Pilih
                  </button>
                </div>
              </div>

              {/* Catatan Transparansi Alokasi Layanan */}
              <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">
                Sebagian kecil dari donasi Anda (maks. 5%) dialokasikan sebagai Dana Operasional & Keberlanjutan Layanan untuk mendukung operasional layanan dan keberlanjutan program kebaikan.{' '}
                <span className="text-primary hover:underline cursor-pointer font-medium">
                  Baca Selengkapnya
                </span>
              </p>
            </div>

            {/* DIVIDER SECTION */}
            <div className="border-t border-slate-100 -mx-5 sm:-mx-6 my-4" />

            {/* Informasi Donatur */}
            <div className="space-y-3.5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Informasi donatur
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Silahkan lengkapi data berikut
                </p>
              </div>

              {/* Input Nama Lengkap */}
              <div className="space-y-1">
                <label htmlFor="donor-name" className="text-xs text-slate-700 font-medium block">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="donor-name"
                  type="text"
                  value={donorName}
                  onChange={(e) => {
                    setDonorName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  placeholder="Nama Lengkap"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    errors.name
                      ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Input Nomor Telepon */}
              <div className="space-y-1">
                <label htmlFor="donor-phone" className="text-xs text-slate-700 font-medium block">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  id="donor-phone"
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => {
                    setDonorPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                  }}
                  placeholder="Nomor Telepon (WhatsApp)"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    errors.phone
                      ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Input Email (Opsional) */}
              <div className="space-y-1">
                <label htmlFor="donor-email" className="text-xs text-slate-700 font-medium block">
                  Alamat Email <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  id="donor-email"
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Alamat Email"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm outline-none transition-all"
                />
              </div>

              {/* Textarea Doa & Pesan */}
              <div className="space-y-1">
                <label htmlFor="donor-prayer" className="text-xs text-slate-700 font-medium block">
                  Tulis pesan dan do'a
                </label>
                <textarea
                  id="donor-prayer"
                  rows={3}
                  value={donorPrayer}
                  onChange={(e) => setDonorPrayer(e.target.value)}
                  placeholder="Tulis pesan dan do'a untuk pribadi atau penerima manfaat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm outline-none transition-all resize-none"
                />
              </div>

              {/* Toggle Sembunyikan Nama (Hamba Allah) */}
              <div className="pt-2 flex items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAnonymous}
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isAnonymous ? 'bg-primary' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isAnonymous ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div onClick={() => setIsAnonymous(!isAnonymous)}>
                  <span className="text-xs font-semibold text-slate-800 block">
                    Sembunyikan nama saya
                  </span>
                  <span className="text-[11px] text-slate-400 italic block">
                    (Hamba Allah)
                  </span>
                </div>
              </div>
            </div>

            {/* Tombol Lanjutkan Pembayaran */}
            <div className="pt-4 space-y-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isFullWidth
                disabled={isSubmitting}
                className="font-bold shadow-xs py-3 text-xs sm:text-sm"
              >
                {isSubmitting ? 'Memproses Simulasi...' : 'Lanjutkan Pembayaran'}
              </Button>

              <p className="text-[10px] text-slate-400 text-center">
                Simulasi Donasi Demo OpenDonasi — Tidak ada transaksi pembayaran uang nyata
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DonationFormPage;
