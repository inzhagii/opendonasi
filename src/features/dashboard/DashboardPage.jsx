// Halaman Dashboard User / Donatur OpenDonasi (/dashboard)
// Menampilkan Pusat Kendali Donatur yang Terpadu (In-Dashboard Tab Navigation):
// 1. Layout desktop dibatasi max-width 1366px terpusat (max-w-[1366px] mx-auto) sesuai design system.
// 2. Sidebar desktop & Mobile Drawer dengan LOGO TUNGGAL dan ikon SVG standar profesional (bebas emoji).
// 3. Menghapus bagian 'Jelajahi Program' (sidebar, drawer, header, & button) sesuai permintaan.
// 4. Fitur disesuaikan khusus untuk kebutuhan USER (Donatur):
//    - Tab 'overview': 4 Metrik Donatur seragam, 3 Aksi Cepat Donatur seragam, Riwayat Terkini & Kabar Penyaluran.
//    - Tab 'riwayat': Riwayat donasi user lengkap (filter status, pencarian ID/program, modal kuitansi digital).
//    - Tab 'kalkulator': Kalkulator Zakat user (Nisab 85 gr emas BAZNAS 2026, profesi & tabungan, input berformat Rp).
//    - Tab 'profil': Profil donatur, preferensi mode anonim (Hamba Allah), notifikasi kuitansi email, & utilitas demo.
// 5. Tombol 'Kembali ke Beranda' tersedia di sticky navbar atas, sidebar fokus murni ke fitur dashboard.

import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logoImg from '../../assets/logo/logo.png';
import { useDonation } from '../../hooks/useDonation';
import { formatRupiah, formatDate } from '../../lib/formatters';
import { calculateZakatPenghasilan, calculateZakatTabungan } from '../../lib/zakatCalculator';

// Ikon Khas Zakat (Autentik SVG, Bebas dari Karakter Emoji AI)
function IncomeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" strokeWidth={2.5} />
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

// Helper format input string angka ke format pemisah ribuan
function formatRupiahInput(val) {
  if (val === undefined || val === null || val === '') return '';
  const clean = String(val).replace(/\D/g, '');
  if (!clean) return '';
  return new Intl.NumberFormat('id-ID').format(Number(clean));
}

// Helper parse input string angka menjadi integer murni
function parseRupiahInput(val) {
  if (!val) return 0;
  const clean = String(val).replace(/\D/g, '');
  return parseInt(clean, 10) || 0;
}

// Data mock aktivitas penyaluran transparansi program yang didukung donatur
const DONOR_IMPACT_ACTIVITIES = [
  {
    id: 'act-1',
    timestamp: '30.10.2026 • 11:30',
    title: 'Penyaluran Sembako Tanggap Darurat NTT',
    description: '150 Paket sembako dan obat-obatan telah sampai di posko pengungsian warga terdampak.',
    category: 'penyaluran',
    iconBg: 'bg-blue-50 text-primary border-blue-200',
  },
  {
    id: 'act-2',
    timestamp: '29.10.2026 • 16:45',
    title: 'Kuitansi Resmi Diterbitkan',
    description: 'Kuitansi resmi transparansi donasi ID OD-884920 telah siap diunduh oleh Anda.',
    category: 'dokumen',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    id: 'act-3',
    timestamp: '28.10.2026 • 09:15',
    title: 'Progres Pembangunan Pesantren Santri',
    description: 'Pengecoran atap asrama santri pelosok mencapai progres 75%.',
    category: 'progres',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    id: 'act-4',
    timestamp: '26.10.2026 • 14:20',
    title: 'Laporan Penyaluran Dana Tindakan Medis',
    description: 'Bantuan biaya tindakan medis dhuafa telah disalurkan kepada pihak rumah sakit mitra.',
    category: 'penyaluran',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    donations,
    currentUser,
    logout,
    clearDonations,
    resetToInitialDonations,
  } = useDonation();

  // Tab aktif di dalam user dashboard: 'overview' | 'riwayat' | 'kalkulator' | 'profil'
  const activeTab = searchParams.get('tab') || 'overview';

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Carousel ref dan state slide aktif untuk ringkasan kebaikan mobile
  const statsCarouselRef = useRef(null);
  const [activeStatsSlide, setActiveStatsSlide] = useState(0);

  const handleStatsScroll = () => {
    if (statsCarouselRef.current) {
      const { scrollLeft } = statsCarouselRef.current;
      const card = statsCarouselRef.current.firstElementChild;
      const cardWidth = card ? card.clientWidth + 12 : 252;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveStatsSlide(Math.min(Math.max(index, 0), 3));
    }
  };

  // State untuk Tab Riwayat Donasi
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all'); // 'all' | 'success' | 'pending'
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historySortBy, setHistorySortBy] = useState('newest'); // 'newest' | 'highest' | 'lowest'

  // State untuk Tab Kalkulator Zakat (Dengan format ribuan rapi)
  const [zakatCategory, setZakatCategory] = useState('penghasilan'); // 'penghasilan' | 'tabungan'
  const [salaryInput, setSalaryInput] = useState('10000000');
  const [bonusInput, setBonusInput] = useState('1500000');
  const [expenseInput, setExpenseInput] = useState('2000000');
  const [savingsInput, setSavingsInput] = useState('100000000');
  const [hasHaul, setHasHaul] = useState(true);

  // State untuk Preferensi Profil Donatur
  const [isAnonymousDefault, setIsAnonymousDefault] = useState(false);
  const [isEmailReceiptEnabled, setIsEmailReceiptEnabled] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard Donatur — OpenDonasi';
    window.scrollTo(0, 0);
  }, []);

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNotification = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Hitung metrik ringkasan donatur
  const stats = useMemo(() => {
    const list = Array.isArray(donations) ? donations : [];
    const successList = list.filter((d) => d.status === 'success');
    const pendingList = list.filter((d) => d.status === 'pending');

    const totalSuccessAmount = successList.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const uniquePrograms = new Set(list.map((d) => d.campaignId || d.campaignSlug)).size;

    return {
      totalAmount: totalSuccessAmount || 1400346,
      successCount: successList.length || 11,
      pendingCount: pendingList.length || 1,
      programsCount: uniquePrograms || 5,
      prayersCount: 12,
    };
  }, [donations]);

  // Transaksi terbaru untuk overview donatur (maksimal 3 item)
  const recentDonations = useMemo(() => {
    if (!Array.isArray(donations) || donations.length === 0) {
      return [
        {
          transactionId: 'OD-232028',
          campaignTitle: 'Tanggap Darurat dan Dapur Umum Warga Terdampak',
          campaignSlug: 'tanggap-darurat-korban-bencana',
          amount: 50346,
          date: '2026-10-30',
          status: 'success',
          paymentMethod: 'Mandiri Virtual Account',
          donorName: 'Donatur Demo',
        },
        {
          transactionId: 'OD-576856',
          campaignTitle: 'Paket Perlengkapan Belajar & Beasiswa Yatim Dhuafa',
          campaignSlug: 'bantu-sarana-belajar-pesantren',
          amount: 250000,
          date: '2026-10-30',
          status: 'success',
          paymentMethod: 'OVO',
          donorName: 'demo',
        },
        {
          transactionId: 'OD-910060',
          campaignTitle: 'Bangun Pesantren Bangun Peradaban Santri Pelosok',
          campaignSlug: 'bantu-sarana-belajar-pesantren',
          amount: 100000,
          date: '2026-10-29',
          status: 'success',
          paymentMethod: 'BCA Virtual Account',
          donorName: 'Hamba Allah',
        },
      ];
    }
    return donations.slice(0, 3);
  }, [donations]);

  // Filter transaksi untuk Tab Riwayat Donasi
  const filteredDonations = useMemo(() => {
    const list = Array.isArray(donations) && donations.length > 0 ? donations : recentDonations;
    let result = [...list];

    if (historyStatusFilter !== 'all') {
      result = result.filter((d) => d.status === historyStatusFilter);
    }

    if (historySearchQuery.trim()) {
      const q = historySearchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          (d.campaignTitle || '').toLowerCase().includes(q) ||
          (d.transactionId || '').toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const timeA = new Date(a.date || a.createdAt || 0).getTime();
      const timeB = new Date(b.date || b.createdAt || 0).getTime();
      const amtA = Number(a.amount) || 0;
      const amtB = Number(b.amount) || 0;

      if (historySortBy === 'highest') return amtB - amtA;
      if (historySortBy === 'lowest') return amtA - amtB;
      return timeB - timeA;
    });

    return result;
  }, [donations, recentDonations, historyStatusFilter, historySearchQuery, historySortBy]);

  // Kalkulasi zakat dinamis sesuai acuan SK BAZNAS
  const zakatCalculationResult = useMemo(() => {
    if (zakatCategory === 'penghasilan') {
      const numSalary = parseRupiahInput(salaryInput);
      const numBonus = parseRupiahInput(bonusInput);
      const numExpense = parseRupiahInput(expenseInput);
      const netMonthly = Math.max(0, numSalary + numBonus - numExpense);

      return calculateZakatPenghasilan({
        monthlyIncome: netMonthly,
        otherIncome: 0,
        period: 'monthly',
      });
    } else {
      const numSavings = parseRupiahInput(savingsInput);
      return calculateZakatTabungan({
        savingsBalance: numSavings,
        otherSavings: 0,
        hasHaul,
      });
    }
  }, [zakatCategory, salaryInput, bonusInput, expenseInput, savingsInput, hasHaul]);

  const handleCopy = (text) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleLogout = () => {
    if (window.confirm('Keluar dari akun demo OpenDonasi?')) {
      if (typeof logout === 'function') logout();
      navigate('/');
    }
  };

  return (
    // Outer Frame: Mengikuti max-width 1366px persis sesuai layout tampilan aplikasi OpenDonasi
    <div className="min-h-screen bg-slate-100/50 flex justify-center antialiased text-slate-900 font-sans">
      <div className="w-full max-w-[1366px] bg-slate-50 min-h-screen flex flex-col lg:flex-row border-x border-slate-200/80 shadow-2xs">
        {/* ============================================================== */}
        {/* 1. SIDEBAR DESKTOP (COLLAPSIBLE / SHOW & HIDE)                  */}
        {/* ============================================================== */}
        <aside
          className={`hidden lg:flex flex-col shrink-0 sticky top-0 h-screen select-none z-30 bg-white border-r border-slate-200/90 transition-all duration-300 ease-in-out ${
            isDesktopSidebarOpen
              ? 'w-64 opacity-100'
              : 'w-0 border-r-0 overflow-hidden opacity-0 pointer-events-none'
          }`}
        >
          {/* Brand Header: HANYA 1 LOGO TANPA DUPLIKASI TEKS */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between min-w-[256px]">
            <Link
              to="/"
              className="flex items-center focus:outline-none hover:opacity-95 transition-opacity"
              aria-label="Kembali ke Beranda OpenDonasi"
            >
              <img src={logoImg} alt="OpenDonasi" className="h-8 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-blue-50 text-primary border border-blue-200 font-bold px-2 py-0.5 rounded-full">
                Demo
              </span>
              <button
                type="button"
                onClick={() => setIsDesktopSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Tutup Sidebar"
                aria-label="Tutup Sidebar"
              >
                {/* Icon 3 Arrow ke arah kiri (Tutup) */}
                <svg className="w-4 h-4 text-slate-500 hover:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 19l-6-7 6-7m-5 14l-6-7 6-7m-5 14l-6-7 6-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Navigasi Utama Donatur (Tanpa 'Jelajahi Program') */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto no-scrollbar min-w-[256px]">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              Menu Donatur
            </div>

            {/* Tab 1: Dashboard (Overview) */}
            <button
              type="button"
              onClick={() => setTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer text-left ${
                activeTab === 'overview'
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </button>

            {/* Tab 2: Riwayat Donasi (In-Dashboard) */}
            <button
              type="button"
              onClick={() => setTab('riwayat')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer text-left ${
                activeTab === 'riwayat'
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div className="flex items-center justify-between flex-1">
                <span>Riwayat Donasi</span>
                {stats.pendingCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </div>
            </button>

            {/* Tab 3: Kalkulator Zakat (In-Dashboard) */}
            <button
              type="button"
              onClick={() => setTab('kalkulator')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer text-left ${
                activeTab === 'kalkulator'
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Kalkulator Zakat</span>
            </button>

            <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              Akun & Pengaturan
            </div>

            {/* Tab 4: Profil Donatur (In-Dashboard) */}
            <button
              type="button"
              onClick={() => setTab('profil')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer text-left ${
                activeTab === 'profil'
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profil Donatur</span>
            </button>

          </nav>

          {/* Tombol Keluar (Bagian Bawah Sidebar) */}
          <div className="p-4 border-t border-slate-100 min-w-[256px]">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 text-slate-600 hover:text-red-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar Akun</span>
            </button>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* 2. MOBILE DRAWER (RESPONSIF SHOW / HIDE)                        */}
        {/* ============================================================== */}
        {isMobileDrawerOpen && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop Gelap */}
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
              onClick={() => setIsMobileDrawerOpen(false)}
            />

            {/* Konten Sidebar Mobile (Slide-in) */}
            <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              {/* Header Drawer: 1 LOGO TANPA DUPLIKASI TEKS */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <Link
                  to="/"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center focus:outline-none"
                  aria-label="Kembali ke Beranda OpenDonasi"
                >
                  <img src={logoImg} alt="OpenDonasi" className="h-7 w-auto object-contain" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Tutup menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Drawer Berikon SVG Standar (Tanpa Emoji & Tanpa Jelajahi Program) */}
              <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setTab('overview')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-left cursor-pointer transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTab('riwayat')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-left cursor-pointer transition-colors ${
                    activeTab === 'riwayat'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div className="flex items-center justify-between flex-1">
                    <span>Riwayat Donasi</span>
                    {stats.pendingCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTab('kalkulator')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-left cursor-pointer transition-colors ${
                    activeTab === 'kalkulator'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Kalkulator Zakat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTab('profil')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-left cursor-pointer transition-colors ${
                    activeTab === 'profil'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profil Donatur</span>
                </button>

              </nav>

              {/* Tombol Keluar Akun Drawer */}
              <div className="p-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 text-slate-600 hover:text-red-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. AREA KONTEN UTAMA (MAIN CANVAS)                             */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header Bar */}
          <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
            {/* Bagian Kiri Header: Toggle Sidebar (Desktop) / Menu Drawer & Navigasi Cepat (Mobile) */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden p-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
                aria-label="Buka Menu Navigasi"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Tombol Buka Sidebar Desktop (HANYA MUNCUL KETIKA SIDEBAR TERTUTUP, ICON 3 ARROW KE KANAN) */}
              {!isDesktopSidebarOpen && (
                <button
                  type="button"
                  onClick={() => setIsDesktopSidebarOpen(true)}
                  className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 hover:border-primary/50 bg-slate-50 hover:bg-primary/5 text-slate-700 hover:text-primary text-xs font-semibold transition-all cursor-pointer shadow-2xs group shrink-0"
                  title="Buka Sidebar"
                  aria-label="Buka Sidebar"
                >
                  {/* Icon 3 Arrow ke arah kanan (Buka) */}
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 5l6 7-6 7m5-14l6 7-6 7m5-14l6 7-6 7" />
                  </svg>
                  <span>Buka Sidebar</span>
                </button>
              )}

              {/* Tombol Back Cepat di Mobile jika berada di Sub-Tab */}
              {activeTab !== 'overview' && (
                <button
                  type="button"
                  onClick={() => setTab('overview')}
                  className="lg:hidden p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Kembali ke Dashboard Utama"
                  aria-label="Kembali ke Ringkasan"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Bagian Kanan Header: Tombol Kembali ke Beranda (Menggantikan Badge Profil Sesuai Permintaan) */}
            <div className="ml-auto flex items-center gap-2.5 sm:gap-3 shrink-0">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl border border-slate-200/90 hover:border-primary/50 bg-slate-50 hover:bg-primary/5 text-slate-700 hover:text-primary text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs group"
                aria-label="Kembali ke Beranda"
              >
                <svg className="w-4 h-4 text-slate-500 group-hover:text-primary group-hover:-translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </header>

          {/* Notifikasi Toast Singkat */}
          {feedbackMsg && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 text-center font-medium animate-in fade-in">
              {feedbackMsg}
            </div>
          )}

          {/* Konten Canvas Utama: Full Width di dalam frame 1366px */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full">
            {/* ========================================================================= */}
            {/* TAB 1: OVERVIEW (RINGKASAN DONATUR)                                       */}
            {/* ========================================================================= */}
            {activeTab === 'overview' && (
              <>
                {/* SECTION GREETING & TOMBOL DONASI BARU */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3 sm:block">
                      <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                        Halo, {currentUser?.name || 'Donatur Demo'}
                      </h1>

                      {/* Tombol Donasi Baru di Mobile (Berdampingan langsung dengan judul) */}
                      <Link
                        to="/program"
                        className="sm:hidden px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Donasi Baru</span>
                      </Link>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-0.5">
                      Selamat datang di dashboard kebaikan Anda. Pantau transaksi, kuitansi resmi, dan dampak penyaluran.
                    </p>
                  </div>

                  {/* Tombol Donasi Baru di Desktop */}
                  <div className="hidden sm:flex items-center gap-2.5 shrink-0">
                    <Link
                      to="/program"
                      className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Donasi Baru</span>
                    </Link>
                  </div>
                </div>

                {/* 4 KARTU METRIK: CAROUSEL PADA MOBILE, GRID PADA TABLET & DESKTOP */}
                <div className="space-y-2.5">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Ringkasan Kebaikan Anda
                  </span>

                  <div
                    ref={statsCarouselRef}
                    onScroll={handleStatsScroll}
                    className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
                  >
                    {/* Card 1: Total Donasi (Aksen Biru) */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between shrink-0 w-[240px] sm:w-auto snap-start h-full min-h-[140px] sm:min-h-[148px]">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Total Donasi
                        </span>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-primary border border-blue-100 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-2.5 sm:mt-3">
                        <span className="text-xl sm:text-2xl font-black text-primary font-mono block tracking-tight">
                          {formatRupiah(stats.totalAmount)}
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-400 mt-1 block truncate">
                          {stats.successCount} transaksi terverifikasi
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Menunggu Pembayaran (Aksen Kuning/Amber) */}
                    <button
                      type="button"
                      onClick={() => {
                        setHistoryStatusFilter('pending');
                        setTab('riwayat');
                      }}
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-amber-300 transition-colors flex flex-col justify-between shrink-0 w-[240px] sm:w-auto snap-start h-full min-h-[140px] sm:min-h-[148px] text-left cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Menunggu Pembayaran
                        </span>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-2.5 sm:mt-3">
                        <span className="text-xl sm:text-2xl font-black text-amber-700 block tracking-tight">
                          {stats.pendingCount}
                        </span>
                        <span className="text-[11px] sm:text-xs text-amber-600/90 mt-1 block truncate font-medium">
                          Selesaikan instruksi pembayaran →
                        </span>
                      </div>
                    </button>

                    {/* Card 3: Program Didukung (Aksen Hijau / Emerald) */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between shrink-0 w-[240px] sm:w-auto snap-start h-full min-h-[140px] sm:min-h-[148px]">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Program Didukung
                        </span>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-2.5 sm:mt-3">
                        <span className="text-xl sm:text-2xl font-black text-emerald-600 block tracking-tight">
                          {stats.programsCount}
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-400 mt-1 block truncate">
                          Program kebaikan telah dibantu
                        </span>
                      </div>
                    </div>

                    {/* Card 4: Doa Tersalurkan (Aksen Slate Netral) */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between shrink-0 w-[240px] sm:w-auto snap-start h-full min-h-[140px] sm:min-h-[148px]">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Doa Tersalurkan
                        </span>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-2.5 sm:mt-3">
                        <span className="text-xl sm:text-2xl font-black text-slate-800 block tracking-tight">
                          {stats.prayersCount}
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-400 mt-1 block truncate">
                          Pesan kebaikan untuk penerima manfaat
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Indikator Dots Carousel (Khusus Mobile) */}
                  <div className="flex sm:hidden items-center justify-center gap-1.5 pt-1">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (statsCarouselRef.current) {
                            const card = statsCarouselRef.current.firstElementChild;
                            const cardWidth = card ? card.clientWidth + 12 : 252;
                            statsCarouselRef.current.scrollTo({
                              left: idx * cardWidth,
                              behavior: 'smooth',
                            });
                            setActiveStatsSlide(idx);
                          }
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          activeStatsSlide === idx ? 'w-5 bg-primary' : 'w-1.5 bg-slate-200'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>


                {/* 2 KOLOM (RIWAYAT TERKINI & KABAR PENYALURAN) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
                  {/* KOLOM KIRI (7/12): RIWAYAT DONASI TERKINI */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">
                          Riwayat Donasi Terkini
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Donasi yang baru saja Anda salurkan
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTab('riwayat')}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Lihat Semua</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* List Transaksi Ringkas */}
                    <div className="space-y-3">
                      {recentDonations.map((item, idx) => {
                        const isSuccess = item.status === 'success';
                        return (
                          <div
                            key={item.transactionId || idx}
                            className="p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  {item.donorName ? item.donorName.charAt(0).toUpperCase() : 'D'}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-slate-900 block truncate">
                                    {item.donorName || 'Donatur Demo'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono block">
                                    {item.transactionId || 'OD-DEMO'}
                                  </span>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isSuccess
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {isSuccess ? '✓ Berhasil' : '⏳ Menunggu'}
                              </span>
                            </div>

                            <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                              {item.campaignTitle || 'Program Kebaikan OpenDonasi'}
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-slate-400 text-[11px]">
                                {formatDate(item.date || new Date().toISOString().split('T')[0])} • {item.paymentMethod || 'Metode Pembayaran'}
                              </span>
                              <div className="flex items-center gap-2">
                                <strong className="font-extrabold text-slate-900 font-mono">
                                  {formatRupiah(item.amount || 50000)}
                                </strong>
                                {isSuccess && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedInvoice(item)}
                                    className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                                    title="Lihat kuitansi"
                                  >
                                    [Kuitansi]
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* KOLOM KANAN (5/12): KABAR PENYALURAN PROGRAM SAYA */}
                  <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">
                          Penyaluran Program Saya
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Laporan transparansi bantuan yang Anda dukung
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => showNotification('Seluruh update penyaluran program telah dimuat.')}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Update Terbaru
                      </button>
                    </div>

                    {/* Linimasa Aktivitas Donatur */}
                    <div className="space-y-3.5">
                      {DONOR_IMPACT_ACTIVITIES.map((act) => (
                        <div key={act.id} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${act.iconBg}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold text-slate-400 block font-mono">
                              {act.timestamp}
                            </span>
                            <h3 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                              {act.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {act.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: RIWAYAT DONASI LENGKAP USER (DI DALAM DASHBOARD)                   */}
            {/* ========================================================================= */}
            {activeTab === 'riwayat' && (
              <div className="space-y-6">
                {/* Header Tab Riwayat */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Riwayat Donasi Saya
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Pantau seluruh riwayat transaksi simulasi, status verifikasi, dan kuitansi donasi Anda.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showNotification('Fitur unduh rekap tahunan siap dikembangkan pada fase berikutnya.')}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download Rekap</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTab('overview')}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      ← Kembali ke Ringkasan
                    </button>
                  </div>
                </div>

                {/* Toolbar Pencarian & Filter */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Status Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      <button
                        type="button"
                        onClick={() => setHistoryStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          historyStatusFilter === 'all'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        Semua Transaksi
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryStatusFilter('success')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          historyStatusFilter === 'success'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        ✓ Berhasil ({stats.successCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryStatusFilter('pending')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          historyStatusFilter === 'pending'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        ⏳ Menunggu ({stats.pendingCount})
                      </button>
                    </div>

                    {/* Urutan Sort */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400">Urutkan:</span>
                      <select
                        value={historySortBy}
                        onChange={(e) => setHistorySortBy(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="newest">Terbaru</option>
                        <option value="highest">Nominal Tertinggi</option>
                        <option value="lowest">Nominal Terendah</option>
                      </select>
                    </div>
                  </div>

                  {/* Input Pencarian */}
                  <div className="relative">
                    <input
                      type="text"
                      value={historySearchQuery}
                      onChange={(e) => setHistorySearchQuery(e.target.value)}
                      placeholder="Cari berdasarkan nama program atau nomor transaksi (OD-...)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {historySearchQuery && (
                      <button
                        type="button"
                        onClick={() => setHistorySearchQuery('')}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Daftar Kartu Donasi */}
                <div className="space-y-3">
                  {filteredDonations.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Tidak ada transaksi ditemukan</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Belum ada donasi yang sesuai dengan filter pencarian ini.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setHistoryStatusFilter('all');
                          setHistorySearchQuery('');
                        }}
                        className="px-4 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    filteredDonations.map((item, idx) => {
                      const isSuccess = item.status === 'success';
                      return (
                        <div
                          key={item.transactionId || idx}
                          className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                {item.transactionId || 'OD-DEMO'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(item.transactionId)}
                                className="text-[10px] text-primary hover:underline cursor-pointer"
                                title="Salin ID Transaksi"
                              >
                                {copiedId === item.transactionId ? '✓ Tersalin' : 'Salin'}
                              </button>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-400">
                                {formatDate(item.date || new Date().toISOString().split('T')[0])}
                              </span>
                            </div>

                            <span
                              className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                                isSuccess
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {isSuccess ? '✓ Donasi Berhasil' : '⏳ Menunggu Pembayaran'}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1 min-w-0">
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                {item.campaignTitle || 'Program Kebaikan OpenDonasi'}
                              </h3>
                              <p className="text-xs text-slate-500">
                                Metode Pembayaran: <span className="font-semibold text-slate-700">{item.paymentMethod || 'Metode Otomatis'}</span>
                              </p>
                              {item.donorPrayer && (
                                <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                                  "{item.donorPrayer}"
                                </p>
                              )}
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                              <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                                {formatRupiah(item.amount || 50000)}
                              </span>

                              {isSuccess ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedInvoice(item)}
                                  className="px-3 py-1.5 rounded-xl border border-primary text-primary hover:bg-primary-soft text-xs font-bold transition-all cursor-pointer"
                                >
                                  📄 Kuitansi Resmi
                                </button>
                              ) : (
                                <Link
                                  to="/instruksi-pembayaran"
                                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-2xs"
                                >
                                  Bayar Sekarang →
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: KALKULATOR ZAKAT USER (REDESIGN BERSIH BAZNAS)                     */}
            {/* ========================================================================= */}
            {activeTab === 'kalkulator' && (
              <div className="space-y-6">
                {/* Header Tab Kalkulator */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Kalkulator Zakat Digital
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
                      Hitung kewajiban zakat profesi dan harta simpanan Anda secara tepat berpedoman pada Keputusan Ketua BAZNAS RI No. 1 Tahun 2026.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTab('overview')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    ← Kembali ke Ringkasan
                  </button>
                </div>

                {/* Rujukan Standar BAZNAS */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block font-semibold mb-0.5">Nisab Acuan BAZNAS 2026</strong>
                    Ketentuan nisab setara 85 gram emas (Rp 1.450.000/gram) = <span className="font-bold text-slate-900">Rp 7.640.144 / bulan</span> (atau Rp 91.681.728 / tahun). Kadar zakat yang wajib dikeluarkan adalah sebesar 2,5%.
                  </div>
                </div>

                {/* Pilihan Kategori Zakat dengan Ikon SVG Autentik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Opsi 1: Zakat Penghasilan */}
                  <button
                    type="button"
                    onClick={() => setZakatCategory('penghasilan')}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      zakatCategory === 'penghasilan'
                        ? 'border-primary bg-primary/5 shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          zakatCategory === 'penghasilan'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <IncomeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">Zakat Penghasilan</h3>
                          {zakatCategory === 'penghasilan' && (
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Gaji bulanan, tunjangan & profesi rutin
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Opsi 2: Zakat Tabungan */}
                  <button
                    type="button"
                    onClick={() => setZakatCategory('tabungan')}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      zakatCategory === 'tabungan'
                        ? 'border-primary bg-primary/5 shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          zakatCategory === 'tabungan'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <SavingsIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">Zakat Tabungan & Simpanan</h3>
                          {zakatCategory === 'tabungan' && (
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Uang kas, tabungan & deposito mengendap 1 tahun
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Grid Form Input & Panel Hasil Real-time */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Form Input Rapi dengan Prefix Rp (7/12) */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">
                        {zakatCategory === 'penghasilan' ? 'Komponen Penghasilan Bulanan' : 'Komponen Kas & Tabungan'}
                      </h2>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Mata Uang IDR (Rp)
                      </span>
                    </div>

                    {zakatCategory === 'penghasilan' ? (
                      <div className="space-y-4">
                        {/* Input 1: Gaji Pokok */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Penghasilan Pokok per Bulan
                          </label>
                          <div className="relative flex rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-white overflow-hidden transition-all">
                            <span className="inline-flex items-center px-3.5 bg-slate-50 text-slate-500 font-bold text-xs border-r border-slate-200 select-none">
                              Rp
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatRupiahInput(salaryInput)}
                              onChange={(e) => setSalaryInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none"
                              placeholder="0"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Gaji atau honorarium bersih tetap setiap bulan
                          </span>
                        </div>

                        {/* Input 2: Pendapatan Lain */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Pendapatan Tambahan / Bonus
                          </label>
                          <div className="relative flex rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-white overflow-hidden transition-all">
                            <span className="inline-flex items-center px-3.5 bg-slate-50 text-slate-500 font-bold text-xs border-r border-slate-200 select-none">
                              Rp
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatRupiahInput(bonusInput)}
                              onChange={(e) => setBonusInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none"
                              placeholder="0"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Tunjangan, insentif kerja, atau hasil usaha sampingan
                          </span>
                        </div>

                        {/* Input 3: Pengeluaran Pokok / Hutang */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Kebutuhan Pokok / Cicilan Hutang Bulanan
                          </label>
                          <div className="relative flex rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-white overflow-hidden transition-all">
                            <span className="inline-flex items-center px-3.5 bg-slate-50 text-slate-500 font-bold text-xs border-r border-slate-200 select-none">
                              Rp
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatRupiahInput(expenseInput)}
                              onChange={(e) => setExpenseInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none"
                              placeholder="0"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Pengeluaran sandang, pangan, papan, dan hutang jatuh tempo bulan berjalan
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Input Tabungan */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Total Saldo Tabungan & Kas Simpanan
                          </label>
                          <div className="relative flex rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-white overflow-hidden transition-all">
                            <span className="inline-flex items-center px-3.5 bg-slate-50 text-slate-500 font-bold text-xs border-r border-slate-200 select-none">
                              Rp
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatRupiahInput(savingsInput)}
                              onChange={(e) => setSavingsInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none"
                              placeholder="0"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Total saldo rekening tabungan, giro, atau kas bebas riba
                          </span>
                        </div>

                        {/* Haul Checkbox */}
                        <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={hasHaul}
                            onChange={(e) => setHasHaul(e.target.checked)}
                            className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                          <div className="text-xs leading-relaxed text-slate-700">
                            <strong className="text-slate-900 block font-semibold">Telah mencapai haul 1 tahun hijriyah</strong>
                            Harta tabungan telah mengendap dan tidak berkurang di bawah batas nisab selama satu tahun penuh.
                          </div>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Panel Ringkasan Perhitungan Zakat (5/12) */}
                  <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900">Ringkasan Kewajiban Zakat</h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-primary border border-blue-200">
                        Tarif 2,5%
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Ambang Batas Nisab:</span>
                        <strong className="text-slate-800 font-mono">
                          {formatRupiah(zakatCalculationResult.nisabAmount)}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          {zakatCategory === 'penghasilan' ? 'Penghasilan Bersih:' : 'Harta Kena Zakat:'}
                        </span>
                        <strong className="text-slate-800 font-mono">
                          {formatRupiah(zakatCalculationResult.baseAmount)}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Status Syariat:</span>
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] border ${
                            zakatCalculationResult.isObligatory
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {zakatCalculationResult.isObligatory ? '✓ Wajib Zakat' : 'Belum Wajib Zakat'}
                        </span>
                      </div>

                      {/* Kotak Nominal Zakat */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Estimasi Zakat yang Ditunaikan
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-primary font-mono tracking-tight">
                          {formatRupiah(zakatCalculationResult.estimatedZakat)}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {zakatCalculationResult.periodLabel}
                        </span>
                      </div>

                      {/* Tombol Aksi */}
                      <Link
                        to="/zakat"
                        className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2"
                      >
                        <span>Tunaikan Zakat Sekarang</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: PROFIL DONATUR (PENGATURAN USER & PRIVASI)                         */}
            {/* ========================================================================= */}
            {activeTab === 'profil' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Profil & Pengaturan Donatur
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Kelola data identitas donatur demo, preferensi privasi, dan kendali pengujian data simulasi.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTab('overview')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    ← Kembali ke Ringkasan
                  </button>
                </div>

                {/* Kartu Profil Utama */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/25 text-primary flex items-center justify-center font-bold text-2xl shrink-0">
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'D'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                            {currentUser?.name || 'Donatur Demo'}
                          </h2>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Donatur Terverifikasi
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {currentUser?.email || 'donatur.demo@opendonasi.id'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Keluar Akun
                    </button>
                  </div>

                  {/* Preferensi Donatur */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Preferensi Privasi & Donasi
                    </h3>

                    <div className="space-y-2.5">
                      <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            Mode Donasi Anonim (Hamba Allah)
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Sembunyikan nama asli Anda dari daftar donatur publik secara otomatis saat checkout donasi.
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isAnonymousDefault}
                          onChange={(e) => {
                            setIsAnonymousDefault(e.target.checked);
                            showNotification(`Preferensi mode anonim ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}.`);
                          }}
                          className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            Kirim Kuitansi & Laporan via Email
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Terima bukti sah kuitansi donasi dan laporan penyaluran langsung ke kotak masuk email.
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isEmailReceiptEnabled}
                          onChange={(e) => {
                            setIsEmailReceiptEnabled(e.target.checked);
                            showNotification(`Notifikasi email kuitansi ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}.`);
                          }}
                          className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Utilitas Demo: Reset & Kosongkan */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Alat Pengujian Prototype Frontend:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          resetToInitialDonations();
                          showNotification('Data riwayat simulasi di-reset ke data bawaan.');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        Reset Data Demo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          clearDonations();
                          showNotification('Riwayat donasi dikosongkan (Empty State siap diuji).');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-xs font-semibold text-rose-600 cursor-pointer"
                      >
                        Kosongkan Riwayat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* ============================================================== */}
        {/* 4. MODAL KUITANSI RESMI DIGITAL (INVOICE PREVIEW)              */}
        {/* ============================================================== */}
        {selectedInvoice && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setSelectedInvoice(null)}
            />

            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 space-y-5 animate-in zoom-in-95 duration-200">
              {/* Header Modal */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <img src={logoImg} alt="OpenDonasi" className="h-6 w-auto object-contain" />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  aria-label="Tutup kuitansi"
                >
                  ✕
                </button>
              </div>

              {/* Konten Kuitansi */}
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                    Bukti Penerimaan Donasi Resmi
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    {formatRupiah(selectedInvoice.amount || 50000)}
                  </h3>
                  <span className="inline-block text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    TERVERIFIKASI • {selectedInvoice.transactionId || 'OD-DEMO'}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Donatur</span>
                    <span className="font-bold text-slate-800">{selectedInvoice.donorName || 'Donatur Demo'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Program Penyaluran</span>
                    <span className="font-bold text-slate-800 text-right line-clamp-1 max-w-[200px]">
                      {selectedInvoice.campaignTitle || 'Program Kebaikan OpenDonasi'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Metode Pembayaran</span>
                    <span className="font-bold text-slate-800">{selectedInvoice.paymentMethod || 'Metode Otomatis'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Waktu Verifikasi</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {formatDate(selectedInvoice.date || new Date().toISOString().split('T')[0])}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  Terima kasih atas kebaikan Anda. Dana simulasi ini telah dialokasikan sesuai akad dan kuitansi ini sah diterbitkan secara digital.
                </p>
              </div>

              {/* Aksi Modal */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    showNotification('Kuitansi berhasil diunduh dalam format PDF (simulasi).');
                    setSelectedInvoice(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs transition-all shadow-xs text-center cursor-pointer"
                >
                  Unduh Kuitansi PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
