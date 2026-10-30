// Komponen Header/Navbar OpenDonasi dengan tata letak modern, tanpa border pembatas ke hero, expandable search, dan popover menu tanpa arrow.
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo/logo.png';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useDonation } from '../../hooks/useDonation';
import { Container } from '../ui/Container';

const SEARCH_SUGGESTIONS = [
  'Santri...',
  'Bantu Bangun Masjid...',
  'Sedekah Subuh Dhuafa...',
  'Operasi Balita Sakit...',
  'Ambulans Gratis Pelosok...',
  'Zakat Penghasilan...',
  'Wakaf Sumur Air Bersih...',
  'Tanggap Darurat Bencana...',
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullSearch, setIsFullSearch] = useState(false);
  const [openPopover, setOpenPopover] = useState(null); // 'layanan' | 'bantuan' | null
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const fullSearchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser } = useDonation();

  const layananRef = useClickOutside(() => {
    if (openPopover === 'layanan') setOpenPopover(null);
  }, openPopover === 'layanan');

  const bantuanRef = useClickOutside(() => {
    if (openPopover === 'bantuan') setOpenPopover(null);
  }, openPopover === 'bantuan');

  // Interval animasi pergantian teks saran pencarian (ticker)
  useEffect(() => {
    const timer = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Auto focus input ketika full search aktif
  useEffect(() => {
    if (isFullSearch && fullSearchInputRef.current) {
      fullSearchInputRef.current.focus();
    }
  }, [isFullSearch]);

  // Tutup full search & popover saat berpindah rute
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsFullSearch(false);
    setOpenPopover(null);
  }

  // Handle submit pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim() || SEARCH_SUGGESTIONS[suggestionIndex].replace(/\.+$/, '');
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setIsFullSearch(false);
    }
  };

  // Tutup pencarian dengan tombol Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsFullSearch(false);
    }
  };

  const closePopovers = () => setOpenPopover(null);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white transition-all duration-200">
      {/* ========================================================================= */}
      {/* 1. KONDISI FULL SEARCH MODE (MENGGANTIKAN SELURUH NAVBAR SECARA PENUH)   */}
      {/* ========================================================================= */}
      {isFullSearch ? (
        <div className="w-full bg-white animate-in fade-in duration-150">
          <Container className="h-20 flex items-center justify-between gap-3 sm:gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
              {/* Ikon Pencarian */}
              <div className="shrink-0 text-primary pl-1 sm:pl-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Input Full Width */}
              <input
                ref={fullSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cari program kebaikan, zakat, bencana, yayasan..."
                className="w-full text-sm sm:text-base text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none py-2 font-normal"
                aria-label="Pencarian program donasi penuh"
              />

              {/* Tombol Aksi Cari */}
              <button
                type="submit"
                className="shrink-0 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-full shadow-xs transition-all active:scale-95"
              >
                Cari
              </button>
            </form>

            {/* Tombol Tutup / Close Full Search */}
            <button
              type="button"
              onClick={() => setIsFullSearch(false)}
              className="shrink-0 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Tutup pencarian"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Container>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. KONDISI NAVBAR NORMAL (SESUAI GAMBAR REFERENSI PO TERBARU)             */
        /* ========================================================================= */
        <>
          {/* ===== HEADER DESKTOP (md:block) ===== */}
          <div className="hidden md:block">
            <Container className="h-20 lg:h-22 flex items-center justify-between gap-6 lg:gap-8">
              {/* Sisi Kiri: Logo Brand OpenDonasi */}
              <div className="flex items-center shrink-0">
                <Link
                  to="/"
                  onClick={closePopovers}
                  className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-transform hover:opacity-95"
                  aria-label="Kembali ke Beranda OpenDonasi"
                >
                  <img src={logoImg} alt="OpenDonasi Logo" className="h-9 lg:h-10 w-auto object-contain" />
                </Link>
              </div>

              {/* Sisi Tengah: Menu Navigasi (Program, Layanan, Tentang Kami, Bantuan - TANPA ARROW) */}
              <nav className="flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-800" aria-label="Navigasi Utama">
                {/* Menu Program */}
                <Link
                  to="/program"
                  onClick={closePopovers}
                  className={`transition-colors ${
                    isActive('/program')
                      ? 'text-primary'
                      : 'text-slate-800 hover:text-primary'
                  }`}
                >
                  Program
                </Link>

                {/* Menu Layanan (Tanpa Arrow, Popover saat diklik) */}
                <div className="relative" ref={layananRef}>
                  <button
                    type="button"
                    onClick={() => setOpenPopover(openPopover === 'layanan' ? null : 'layanan')}
                    aria-expanded={openPopover === 'layanan'}
                    aria-haspopup="true"
                    className={`transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded ${
                      openPopover === 'layanan' || ['/zakat', '/infaq', '/sedekah', '/wakaf'].includes(location.pathname)
                        ? 'text-primary'
                        : 'text-slate-800 hover:text-primary'
                    }`}
                  >
                    Layanan
                  </button>

                  {openPopover === 'layanan' && (
                    <div
                      role="menu"
                      className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Kategori Layanan
                      </div>
                      
                      <Link
                        to="/zakat"
                        role="menuitem"
                        onClick={closePopovers}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-primary transition-colors flex items-center gap-1.5">
                            Zakat
                            <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded">Kalkulator</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-snug mt-0.5">Tunaikan zakat maal & penghasilan tepat sasaran</p>
                        </div>
                      </Link>

                      <Link
                        to="/infaq"
                        role="menuitem"
                        onClick={closePopovers}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-primary transition-colors">Infaq</div>
                          <p className="text-xs text-slate-500 leading-snug mt-0.5">Penyaluran dana kebajikan kemaslahatan umat</p>
                        </div>
                      </Link>

                      <Link
                        to="/sedekah"
                        role="menuitem"
                        onClick={closePopovers}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-primary transition-colors">Sedekah</div>
                          <p className="text-xs text-slate-500 leading-snug mt-0.5">Bantuan paket pangan & santunan santri yatim</p>
                        </div>
                      </Link>

                      <Link
                        to="/wakaf"
                        role="menuitem"
                        onClick={closePopovers}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-primary transition-colors">Wakaf</div>
                          <p className="text-xs text-slate-500 leading-snug mt-0.5">Pembangunan asrama, sumur & sarana ibadah</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Menu Tentang Kami */}
                <Link
                  to="/tentang"
                  onClick={closePopovers}
                  className={`transition-colors ${
                    isActive('/tentang')
                      ? 'text-primary'
                      : 'text-slate-800 hover:text-primary'
                  }`}
                >
                  Tentang Kami
                </Link>

                {/* Menu Bantuan (Tanpa Arrow, Popover saat diklik) */}
                <div className="relative" ref={bantuanRef}>
                  <button
                    type="button"
                    onClick={() => setOpenPopover(openPopover === 'bantuan' ? null : 'bantuan')}
                    aria-expanded={openPopover === 'bantuan'}
                    aria-haspopup="true"
                    className={`transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded ${
                      openPopover === 'bantuan' || ['/faq', '/kontak'].includes(location.pathname)
                        ? 'text-primary'
                        : 'text-slate-800 hover:text-primary'
                    }`}
                  >
                    Bantuan
                  </button>

                  {openPopover === 'bantuan' && (
                    <div
                      role="menu"
                      className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl border border-slate-100 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <Link
                        to="/faq"
                        role="menuitem"
                        onClick={closePopovers}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-primary transition-colors">FAQ Donatur</div>
                          <p className="text-xs text-slate-500 leading-snug mt-0.5">Pertanyaan seputar metode & transparansi donasi</p>
                        </div>
                      </Link>

                      <Link
                        to="/kontak"
                        role="menuitem"
                        onClick={closePopovers}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-primary transition-colors">Kontak Bantuan</div>
                          <p className="text-xs text-slate-500 leading-snug mt-0.5">Layanan bantuan donatur via WhatsApp & Email</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>

              {/* Sisi Kanan: Search Input Pill Bergaris Biru & Tombol Sign In / Login */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Search Bar Pill (Border Biru dengan Ticker Saran Pencarian Bergerak) */}
                <div
                  onClick={() => navigate('/search')}
                  className="cursor-pointer relative h-10 w-52 lg:w-60 flex items-center bg-white hover:bg-slate-50/50 border border-primary/70 hover:border-primary rounded-full px-3.5 transition-all text-sm text-slate-400 group shadow-2xs"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate('/search');
                    }
                  }}
                  aria-label="Buka halaman pencarian"
                >
                  <svg className="w-4 h-4 text-primary mr-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery ? (
                    <span className="truncate text-slate-700">{searchQuery}</span>
                  ) : (
                    <div className="h-5 overflow-hidden flex-1 relative">
                      <div
                        className="transition-transform duration-500 ease-in-out flex flex-col"
                        style={{ transform: `translateY(-${suggestionIndex * 20}px)` }}
                      >
                        {SEARCH_SUGGESTIONS.map((item, idx) => (
                          <span key={idx} className="h-5 flex items-center text-xs text-slate-400 select-none truncate">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigasi Auth: Sign In & Login jika belum login, Profil jika sudah login */}
                {isLoggedIn ? (
                  <Link
                    to="/profil"
                    onClick={closePopovers}
                    className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full border border-slate-200 hover:border-primary/60 bg-white hover:bg-slate-50 transition-all text-sm font-semibold text-slate-800 shadow-2xs group cursor-pointer"
                    aria-label="Buka profil akun"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                      {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <span className="truncate max-w-[120px] text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">
                      {currentUser?.name || 'Donatur Demo'}
                    </span>
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <>
                    {/* Tombol Sign In (Pill Lembut Biru Muda & Teks Biru) */}
                    <Link to="/signin" onClick={closePopovers}>
                      <button
                        type="button"
                        className="h-10 px-5 text-sm font-semibold text-primary bg-[#E8F1FD] hover:bg-[#d8e8fc] rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 inline-flex items-center justify-center cursor-pointer"
                      >
                        Sign In
                      </button>
                    </Link>

                    {/* Tombol Login (Pill Biru Solid & Teks Putih) */}
                    <Link to="/login" onClick={closePopovers}>
                      <button
                        type="button"
                        className="h-10 px-6 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 inline-flex items-center justify-center cursor-pointer"
                      >
                        Login
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </Container>
          </div>

          {/* ===== HEADER MOBILE FULL WIDTH SEARCH (md:hidden) ===== */}
          {/* Sesuai referensi visual: Logo di sebelah kiri dibatasi rapi, search bar mengambil sisa lebar penuh (full width) dengan saran bergerak */}
          <div className="block md:hidden px-3.5 py-2.5 bg-white border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5 sm:gap-3 w-full">
              {/* Logo Mobile (Dengan perbatasan yang jelas ke search bar) */}
              <Link
                to="/"
                onClick={closePopovers}
                className="shrink-0 flex items-center pr-1.5 focus:outline-none"
                aria-label="Kembali ke Beranda OpenDonasi"
              >
                <img src={logoImg} alt="OpenDonasi" className="h-7 w-auto object-contain" />
              </Link>

              {/* Garis / Perbatasan Halus antara Logo & Search Bar */}
              <div className="h-6 w-px bg-slate-200 shrink-0" aria-hidden="true" />

              {/* Search Bar Full Width Mobile (Klik langsung membuka halaman search) */}
              <div
                onClick={() => navigate('/search')}
                role="button"
                tabIndex={0}
                className="flex-1 min-w-0 relative flex items-center bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl h-10 px-3 transition-all duration-200 shadow-2xs cursor-pointer active:scale-[0.99]"
                aria-label="Buka halaman pencarian"
              >
                {/* Ikon Kaca Pembesar (Warna biru utama #2E7DFA sesuai DESIGN_SYSTEM.md) */}
                <div className="shrink-0 text-primary mr-2">
                  <svg className="w-4 h-4 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Ticker Saran Pencarian Bergerak */}
                <div className="relative flex-1 h-full flex items-center overflow-hidden">
                  <div className="h-5 overflow-hidden w-full relative">
                    <div
                      className="transition-transform duration-500 ease-in-out flex flex-col"
                      style={{ transform: `translateY(-${suggestionIndex * 20}px)` }}
                    >
                      {SEARCH_SUGGESTIONS.map((item, idx) => (
                        <span
                          key={idx}
                          className="h-5 flex items-center text-xs sm:text-sm text-slate-400 select-none truncate"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
