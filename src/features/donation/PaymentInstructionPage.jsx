// Halaman Instruksi Pembayaran Donasi (/instruksi-pembayaran)
// Mengikuti referensi Amalsholeh:
// 1. Pembayaran Instan (QRIS / E-Wallet): QR Code besar, tombol buka aplikasi, timer 15 menit.
// 2. Virtual Account / Bank Transfer: Nomor rekening/VA, nominal dengan 3 digit kode unik (highlight kuning), peringatan 3 digit, timer 24 jam.
// 3. Status transaksi pending, invoice, tombol "Cek status pembayaran" (mengarahkan ke hasil simulasi sukses), opsi batalkan donasi, dan bantuan WhatsApp.

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { formatRupiah } from '../../lib/formatters';
import { useDonation } from '../../hooks/useDonation';

// Fallback transaksi demo untuk Virtual Account (Sesuai Referensi Gambar 2)
const MOCK_VA_TRANSACTION = {
  transactionId: 'OD-2610309769012',
  invoiceNumber: 'INV-2610309769012',
  campaignId: 'tanggap-darurat-korban-bencana',
  campaignTitle: 'Tanggap Darurat Korban Bencana Banjir dan Longsor',
  campaignSlug: 'tanggap-darurat-korban-bencana',
  serviceType: 'donasi',
  amount: 50000,
  uniqueCode: 995,
  totalAmount: 50995,
  date: new Date().toISOString().split('T')[0],
  status: 'pending',
  statusLabel: 'Pembayaran belum diterima',
  donorName: 'Donatur Baik',
  donorPhone: '081234567890',
  paymentMethod: 'BCA Virtual Account',
  paymentCategory: 'va',
  paymentId: 'bca_va',
  vaNumber: '0083879294',
};

// Fallback transaksi demo untuk Pembayaran Instan (Sesuai Referensi Gambar 1)
const MOCK_INSTANT_TRANSACTION = {
  transactionId: 'OD-2610309769001',
  invoiceNumber: 'INV-2610309769001',
  campaignId: 'tanggap-darurat-korban-bencana',
  campaignTitle: 'Tanggap Darurat Korban Bencana Banjir dan Longsor',
  campaignSlug: 'tanggap-darurat-korban-bencana',
  serviceType: 'donasi',
  amount: 50000,
  uniqueCode: 0,
  totalAmount: 50000,
  date: new Date().toISOString().split('T')[0],
  status: 'pending',
  statusLabel: 'Pembayaran belum diterima',
  donorName: 'Donatur Baik',
  donorPhone: '081234567890',
  paymentMethod: 'GoPay / QRIS',
  paymentCategory: 'instant',
  paymentId: 'gopay',
  vaNumber: '',
};

// Helper Logo Bank untuk Instruksi Virtual Account
function BankBadge({ iconType }) {
  const baseBox = 'w-12 h-7 md:w-14 md:h-8 rounded-md shrink-0 flex items-center justify-center font-bold text-[10px] md:text-xs shadow-2xs border select-none';
  switch (iconType) {
    case 'bca':
      return <div className={`${baseBox} bg-[#005EAA] border-[#004e8d]/20 text-white`}>BCA</div>;
    case 'mandiri':
      return <div className={`${baseBox} bg-[#003D79] border-[#002f5e]/20 text-amber-400 font-extrabold text-[9px] md:text-[10px]`}>mandiri</div>;
    case 'bri':
      return <div className={`${baseBox} bg-[#00529C] border-[#004482]/20 text-white`}>BRI</div>;
    case 'bni':
      return <div className={`${baseBox} bg-[#F15A24] border-[#d64a18]/20 text-white`}>BNI</div>;
    case 'bsi':
      return <div className={`${baseBox} bg-[#00A39D] border-[#008782]/20 text-white`}>BSI</div>;
    case 'maybank':
      return <div className={`${baseBox} bg-[#FFCE00] border-amber-400/30 text-slate-900 font-black text-[9px] md:text-[10px]`}>Maybank</div>;
    case 'permata':
      return <div className={`${baseBox} bg-[#008542] border-[#006e37]/20 text-white text-[9px] md:text-[10px]`}>Permata</div>;
    case 'cimb':
      return <div className={`${baseBox} bg-[#7E0000] border-[#660000]/20 text-white text-[9px] md:text-[10px]`}>CIMB</div>;
    case 'danamon':
      return <div className={`${baseBox} bg-[#F37024] border-[#d85e17]/20 text-white text-[9px] md:text-[10px]`}>Danamon</div>;
    case 'bjb':
      return <div className={`${baseBox} bg-[#0B4B88] border-[#093c6d]/20 text-white text-[9px] md:text-[10px]`}>bjb</div>;
    default:
      return <div className={`${baseBox} bg-slate-800 text-white`}>BANK</div>;
  }
}

// Komponen Otentik QR Code Mockup (SVG Vektor Presisi Tinggi)
function AuthenticQRCode() {
  return (
    <div className="relative p-3 sm:p-4 md:p-5 bg-white rounded-2xl md:rounded-3xl border-2 border-slate-900 shadow-sm inline-block">
      <svg className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72" viewBox="0 0 200 200" fill="none">
        {/* Background Putih */}
        <rect width="200" height="200" fill="white" />

        {/* 3 Kotak Posisi Sudut QR (Finder Patterns) */}
        {/* Top-Left */}
        <rect x="14" y="14" width="46" height="46" rx="6" fill="#0f172a" />
        <rect x="22" y="22" width="30" height="30" rx="3" fill="white" />
        <rect x="28" y="28" width="18" height="18" rx="2" fill="#0f172a" />

        {/* Top-Right */}
        <rect x="140" y="14" width="46" height="46" rx="6" fill="#0f172a" />
        <rect x="148" y="22" width="30" height="30" rx="3" fill="white" />
        <rect x="154" y="28" width="18" height="18" rx="2" fill="#0f172a" />

        {/* Bottom-Left */}
        <rect x="14" y="140" width="46" height="46" rx="6" fill="#0f172a" />
        <rect x="22" y="148" width="30" height="30" rx="3" fill="white" />
        <rect x="28" y="154" width="18" height="18" rx="2" fill="#0f172a" />

        {/* Timing Pattern Lines */}
        <g fill="#0f172a">
          <rect x="68" y="26" width="6" height="6" />
          <rect x="80" y="26" width="6" height="6" />
          <rect x="92" y="26" width="6" height="6" />
          <rect x="104" y="26" width="6" height="6" />
          <rect x="116" y="26" width="6" height="6" />
          <rect x="128" y="26" width="6" height="6" />

          <rect x="26" y="68" width="6" height="6" />
          <rect x="26" y="80" width="6" height="6" />
          <rect x="26" y="92" width="6" height="6" />
          <rect x="26" y="104" width="6" height="6" />
          <rect x="26" y="116" width="6" height="6" />
          <rect x="26" y="128" width="6" height="6" />
        </g>

        {/* Grid Data Matriks QR Code */}
        <g fill="#0f172a">
          <rect x="68" y="44" width="8" height="8" />
          <rect x="84" y="44" width="8" height="8" />
          <rect x="100" y="44" width="8" height="8" />
          <rect x="116" y="44" width="8" height="8" />

          <rect x="68" y="60" width="8" height="8" />
          <rect x="84" y="60" width="16" height="8" />
          <rect x="108" y="60" width="8" height="8" />
          <rect x="124" y="60" width="12" height="8" />

          <rect x="44" y="68" width="8" height="8" />
          <rect x="60" y="76" width="8" height="8" />
          <rect x="76" y="76" width="8" height="8" />
          <rect x="92" y="76" width="16" height="8" />
          <rect x="116" y="76" width="8" height="8" />
          <rect x="132" y="76" width="8" height="8" />
          <rect x="148" y="76" width="16" height="8" />
          <rect x="172" y="76" width="8" height="8" />

          <rect x="44" y="92" width="16" height="8" />
          <rect x="68" y="92" width="8" height="8" />
          <rect x="84" y="92" width="8" height="8" />
          <rect x="100" y="92" width="16" height="8" />
          <rect x="124" y="92" width="8" height="8" />
          <rect x="140" y="92" width="8" height="8" />
          <rect x="156" y="92" width="16" height="8" />
          <rect x="180" y="92" width="6" height="8" />

          <rect x="44" y="108" width="8" height="8" />
          <rect x="60" y="108" width="8" height="8" />
          <rect x="76" y="108" width="16" height="8" />
          <rect x="100" y="108" width="8" height="8" />
          <rect x="116" y="108" width="16" height="8" />
          <rect x="140" y="108" width="8" height="8" />
          <rect x="156" y="108" width="8" height="8" />
          <rect x="172" y="108" width="14" height="8" />

          <rect x="44" y="124" width="8" height="8" />
          <rect x="68" y="124" width="8" height="8" />
          <rect x="84" y="124" width="8" height="8" />
          <rect x="100" y="124" width="8" height="8" />
          <rect x="116" y="124" width="16" height="8" />
          <rect x="140" y="124" width="16" height="8" />
          <rect x="164" y="124" width="8" height="8" />
          <rect x="180" y="124" width="6" height="8" />

          <rect x="68" y="140" width="8" height="8" />
          <rect x="84" y="140" width="16" height="8" />
          <rect x="108" y="140" width="8" height="8" />
          <rect x="124" y="140" width="8" height="8" />
          <rect x="140" y="140" width="8" height="8" />
          <rect x="156" y="140" width="16" height="8" />
          <rect x="180" y="140" width="6" height="8" />

          <rect x="68" y="156" width="16" height="8" />
          <rect x="92" y="156" width="8" height="8" />
          <rect x="108" y="156" width="16" height="8" />
          <rect x="132" y="156" width="8" height="8" />
          <rect x="148" y="156" width="16" height="8" />
          <rect x="172" y="156" width="8" height="8" />

          <rect x="68" y="172" width="8" height="8" />
          <rect x="84" y="172" width="8" height="8" />
          <rect x="100" y="172" width="16" height="8" />
          <rect x="124" y="172" width="16" height="8" />
          <rect x="148" y="172" width="8" height="8" />
          <rect x="164" y="172" width="16" height="8" />
        </g>

        {/* Logo QRIS Tengah Minimalis */}
        <circle cx="100" cy="100" r="16" fill="white" />
        <circle cx="100" cy="100" r="13" fill="#0f172a" />
        <path d="M96 95h8v10h-8z" fill="white" />
        <path d="M98 97h4v6h-4z" fill="#0f172a" />
      </svg>
    </div>
  );
}

export function PaymentInstructionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { addDonation } = useDonation();

  // Baca data transaksi dari sessionStorage atau state navigasi, dengan fallback demo otomatis
  const [transaction, setTransaction] = useState(() => {
    if (location.state?.transaction) {
      return location.state.transaction;
    }
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem('opendonasi_latest_transaction');
        if (raw) return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    // Fallback default demo jika diakses langsung
    const requestedType = searchParams.get('type');
    return requestedType === 'instant' ? MOCK_INSTANT_TRANSACTION : MOCK_VA_TRANSACTION;
  });

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Status metode: Instan (QRIS / E-Wallet) vs Virtual Account / Bank Transfer
  const isInstant = useMemo(() => {
    if (!transaction) return false;
    const cat = transaction.paymentCategory || '';
    const id = transaction.paymentId || '';
    return cat === 'instant' || id.includes('qris') || id.includes('gopay') || id.includes('ovo') || id.includes('dana') || id.includes('shopee') || id.includes('saku');
  }, [transaction]);

  // Handler toggle demonstrasi antara Gambar 1 (Instant) dan Gambar 2 (Virtual Account)
  const handleSwitchMode = (mode) => {
    if (mode === 'instant') {
      setTransaction(MOCK_INSTANT_TRANSACTION);
      setSecondsLeft(14 * 60 + 44);
    } else {
      setTransaction(MOCK_VA_TRANSACTION);
      setSecondsLeft(23 * 3600 + 59 * 60 + 50);
    }
  };

  // Hitung kode unik 3 digit untuk VA/Transfer (misal 995)
  const uniqueCode = useMemo(() => {
    if (!transaction) return 995;
    if (typeof transaction.uniqueCode === 'number') return transaction.uniqueCode;
    return isInstant ? 0 : 995;
  }, [transaction, isInstant]);

  // Total nominal yang harus dibayar (pokok + kode unik)
  const totalAmountToPay = useMemo(() => {
    if (!transaction) return 50995;
    const base = transaction.amount || 50000;
    return base + (isInstant ? 0 : uniqueCode);
  }, [transaction, isInstant, uniqueCode]);

  // Nomor rekening / Virtual Account dummy
  const accountNumber = useMemo(() => {
    if (!transaction) return '0083879294';
    if (transaction.vaNumber) return transaction.vaNumber;
    return '0083879294';
  }, [transaction]);

  // Nomor Invoice
  const invoiceNumber = useMemo(() => {
    if (!transaction) return isInstant ? 'INV-2610309769001' : 'INV-2610309769012';
    if (transaction.invoiceNumber) return transaction.invoiceNumber;
    return isInstant ? 'INV-2610309769001' : 'INV-2610309769012';
  }, [transaction, isInstant]);

  // Timer hitung mundur: 15 menit (Instant) atau 24 jam (VA)
  const [secondsLeft, setSecondsLeft] = useState(() => {
    return isInstant ? 14 * 60 + 44 : 23 * 3600 + 59 * 60 + 50;
  });

  useEffect(() => {
    setSecondsLeft(isInstant ? 14 * 60 + 44 : 23 * 3600 + 59 * 60 + 50);
  }, [isInstant]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format timer HH:MM:SS
  const formattedTimer = useMemo(() => {
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }, [secondsLeft]);

  // Salin nomor rekening ke clipboard
  const handleCopyAccount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(accountNumber.replace(/\s+/g, '')).then(() => {
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2000);
      });
    }
  };

  // Salin nominal donasi ke clipboard
  const handleCopyAmount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(String(totalAmountToPay)).then(() => {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2000);
      });
    }
  };

  // Cek Status Pembayaran (Mengarahkan ke Hasil Simulasi Sukses)
  const handleCheckStatus = () => {
    setIsVerifying(true);

    setTimeout(() => {
      const updatedTx = {
        ...(transaction || MOCK_VA_TRANSACTION),
        status: 'success',
        statusLabel: 'Simulasi Berhasil (Demo)',
        verifiedAt: new Date().toISOString(),
        amount: totalAmountToPay,
        invoiceNumber,
      };

      try {
        addDonation(updatedTx);
        sessionStorage.setItem('opendonasi_latest_transaction', JSON.stringify(updatedTx));
      } catch {}

      navigate('/hasil-donasi', { replace: true });
    }, 600);
  };

  // Batalkan Donasi
  const handleCancelDonation = () => {
    if (transaction?.campaignSlug) {
      navigate(`/program/${transaction.campaignSlug}`);
    } else {
      navigate('/program');
    }
  };

  // Pisahkan angka sebelum 3 digit terakhir untuk highlight kuning (Gambar 2)
  const amountStr = String(totalAmountToPay);
  const prefixAmount = amountStr.slice(0, -3);
  const suffixDigits = amountStr.slice(-3);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:py-10 md:py-14 px-4 sm:px-6">
      {/* Container Responsif: Ukuran mobile dibuat ringkas (max-w-md), ukuran desktop dibuat lebih lebar & lega (md:max-w-xl lg:max-w-2xl) */}
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto">
        {/* Quick Mode Toggle untuk Pengujian (Gambar 1 vs Gambar 2) */}
        <div className="mb-4 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-2 text-xs md:text-sm">
          <button
            type="button"
            onClick={() => handleSwitchMode('instant')}
            className={`flex-1 py-2 md:py-2.5 px-3 rounded-xl font-bold transition-all text-center cursor-pointer ${
              isInstant
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            ⚡ Pembayaran Instan (Gambar 1)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('va')}
            className={`flex-1 py-2 md:py-2.5 px-3 rounded-xl font-bold transition-all text-center cursor-pointer ${
              !isInstant
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            🏦 Virtual Account (Gambar 2)
          </button>
        </div>

        {/* CARD UTAMA INSTRUKSI PEMBAYARAN */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 md:p-9 shadow-xs space-y-5 md:space-y-6">
          {/* Navigasi Atas: Tombol Back (<) & Judul */}
          <div className="flex items-center gap-3 pb-3 md:pb-4 border-b border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-1 -ml-1 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Kembali"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900">
              Instruksi pembayaran
            </h1>
          </div>

          {/* Kotak Kuning Batas Waktu Pembayaran (Sesuai Referensi Gambar 1 & 2) */}
          <div className="bg-[#FFFBE6] border border-[#FFE58F] text-[#874D00] rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-3.5 flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium">
            <span className="text-base md:text-lg leading-none">⏰</span>
            <span>Selesaikan pembayaran dalam</span>
            <strong className="font-bold text-[#D4380D] tracking-wide ml-auto">
              {formattedTimer}
            </strong>
          </div>

          {/* ============================================================== */}
          {/* TAMPILAN 1: PEMBAYARAN INSTAN (QRIS / E-WALLET)               */}
          {/* ============================================================== */}
          {isInstant && (
            <div className="space-y-4 md:space-y-5 pt-1">
              {/* QR Code Tengah */}
              <div className="flex justify-center py-2 md:py-3">
                <AuthenticQRCode />
              </div>

              {/* Petunjuk Scan */}
              <p className="text-xs sm:text-sm md:text-base text-slate-500 text-center max-w-xs md:max-w-md mx-auto leading-relaxed">
                Scan QR Code di atas untuk membayar jika aplikasi tidak terbuka otomatis
              </p>

              {/* Tombol Akses E-Wallet / Amalsholeh (Sesuai Referensi Gambar 1) */}
              <div className="pt-1">
                <div className="w-full flex items-center justify-between p-3.5 sm:p-4 md:p-5 rounded-xl md:rounded-2xl border border-[#00AED6] bg-white text-slate-800 text-xs sm:text-sm md:text-base font-medium shadow-2xs hover:bg-sky-50/20 transition-colors">
                  <div className="flex items-center gap-2.5 md:gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-[#00AED6] flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#00AED6]" />
                    </div>
                    <span className="font-extrabold text-[#00AED6] tracking-tight">
                      gopay
                    </span>
                    <span className="font-semibold text-slate-800 ml-1">
                      Amalsholeh.com
                    </span>
                  </div>

                  <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAMPILAN 2: VIRTUAL ACCOUNT / BANK TRANSFER (Sesuai Gambar 2)  */}
          {/* ============================================================== */}
          {!isInstant && (
            <div className="space-y-4 md:space-y-5 pt-1">
              {/* Judul Nama Rekening Yayasan Penerima */}
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-snug">
                Yayasan Bersama Beramal Sholeh – KCP Asia Afrika
              </h2>

              {/* Box 1: Nomor Rekening / Virtual Account */}
              <div className="p-3.5 sm:p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <BankBadge iconType={transaction.paymentId?.split('_')[0] || 'bca'} />
                  <div>
                    <span className="text-[11px] md:text-xs text-slate-400 block font-medium">
                      Nomor Rekening
                    </span>
                    <span className="text-sm sm:text-base md:text-xl font-bold font-mono text-slate-900 tracking-wider">
                      {accountNumber}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-primary/30 text-primary hover:bg-primary/5 text-xs md:text-sm font-semibold transition-colors cursor-pointer shrink-0"
                >
                  {copiedAccount ? 'Tersalin!' : 'Salin'}
                </button>
              </div>

              {/* Box 2: Nominal Pembayaran dengan 3 Digit Kode Unik Terakhir */}
              <div>
                <span className="text-xs md:text-sm text-slate-500 block mb-1.5 font-medium">
                  Dengan nominal sebesar
                </span>
                <div className="p-3.5 sm:p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3">
                  <div className="text-sm sm:text-base md:text-xl font-bold text-slate-900">
                    <span>Rp {prefixAmount ? Number(prefixAmount).toLocaleString('id-ID') : '50'}.</span>
                    <mark className="bg-[#FFF080] text-slate-950 font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded ml-0.5">
                      {suffixDigits}
                    </mark>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-primary/30 text-primary hover:bg-primary/5 text-xs md:text-sm font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    {copiedAmount ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>

                {/* Peringatan 3 Digit Terakhir */}
                <div className="mt-2.5 md:mt-3 bg-[#FFFBE6] border border-[#FFE58F] text-[#874D00] rounded-xl md:rounded-2xl p-2.5 md:p-3.5 flex items-center gap-2 text-xs md:text-sm font-medium">
                  <span className="text-amber-500">⚠️</span>
                  <span>Pastikan nominal sesuai hingga 3 digit terakhir</span>
                </div>
                <p className="text-[11px] md:text-xs text-slate-400 italic mt-1.5 pl-1">
                  * 3 Angka terakhir atau kode unik akan didonasikan
                </p>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* BAGIAN BAWAH: INVOICE, CEK STATUS, DAN BATALKAN (KEDUA TIPE)   */}
          {/* ============================================================== */}
          <div className="pt-3 md:pt-4 border-t border-slate-100 space-y-4 md:space-y-5">
            {/* No. Invoice & Status Pembayaran */}
            <div className="space-y-2 text-xs sm:text-sm md:text-base">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-500">No. Invoice</span>
                <span className="font-mono text-slate-800 font-semibold">
                  {invoiceNumber}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-500">Status pembayaran</span>
                <strong className="text-slate-900 font-bold">
                  Pembayaran belum diterima
                </strong>
              </div>
            </div>

            {/* Tombol Cek Status Pembayaran (Mengarahkan ke Simulasi Berhasil) */}
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={isVerifying}
              className="w-full py-3 md:py-3.5 rounded-xl md:rounded-2xl border border-slate-300 hover:border-primary hover:bg-blue-50/40 text-slate-800 font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{isVerifying ? 'Memverifikasi Pembayaran...' : 'Cek status pembayaran'}</span>
            </button>

            {/* Batalkan Donasi */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={handleCancelDonation}
                className="text-xs md:text-sm font-bold text-[#E53935] hover:underline cursor-pointer"
              >
                Batalkan donasi
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BAGIAN BANTUAN WHATSAPP (Sesuai Referensi Gambar 1 & 2)        */}
          {/* ============================================================== */}
          <div className="pt-4 md:pt-6 border-t-8 border-slate-100 -mx-5 sm:-mx-7 md:-mx-9 px-5 sm:px-7 md:px-9 space-y-2.5 md:space-y-3">
            <span className="text-xs sm:text-sm md:text-base font-bold text-slate-900 block">
              Ada kendala dengan transaksi ini?
            </span>

            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20OpenDonasi,%20saya%20butuh%20bantuan%20terkait%20transaksi%20donasi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3.5 md:gap-4 p-3.5 sm:p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200 hover:border-emerald-500/60 bg-white transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0 text-[#25D366]">
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.961.947 2.796.947 3.179 0 5.765-2.587 5.765-5.766.001-3.181-2.583-5.768-5.765-5.768zm3.393 8.358c-.146.415-.851.787-1.183.834-.332.046-.757.067-1.229-.086-.777-.251-1.776-.889-2.518-1.632-.976-.975-1.554-2.129-1.554-2.825 0-.698.362-1.076.491-1.205.129-.129.283-.162.378-.162.094 0 .188.002.269.006.086.004.202-.033.315.241.118.283.402.979.438 1.05.035.071.059.154.012.247-.047.094-.071.154-.142.236-.071.082-.149.183-.213.246-.071.07-.145.146-.062.288.083.142.368.607.789.982.544.484 1.003.633 1.145.704.142.071.225.059.308-.035.083-.095.355-.414.45-.556.095-.142.189-.118.318-.071.129.047.818.386.959.457.142.071.236.107.271.166.035.059.035.344-.111.759z" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm md:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors block">
                  Hubungi kami lewat WhatsApp
                </span>
                <span className="text-[11px] md:text-xs text-slate-500 block mt-0.5">
                  Lapor kendala melalui chat WhatsApp
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentInstructionPage;
