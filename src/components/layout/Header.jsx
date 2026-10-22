// Komponen Header/Navbar OpenDonasi dengan tata letak modern, full search bar expandable, dan responsif.
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo/logo.png';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Container } from '../ui/Container';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullSearch, setIsFullSearch] = useState(false);
  const [openPopover, setOpenPopover] = useState(null); // 'layanan' | 'bantuan' | null
  const fullSearchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const layananRef = useClickOutside(() => {
    if (openPopover === 'layanan') setOpenPopover(null);
  }, openPopover === 'layanan');

  const bantuanRef = useClickOutside(() => {
    if (openPopover === 'bantuan') setOpenPopover(null);
  }, openPopover === 'bantuan');

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
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all duration-200">
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
                className="w-full text-sm sm:text-base text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none py-2"
                aria-label="Pencarian program donasi penuh"
              />

              {/* Tombol Aksi Cari */}
              <button
                type="submit"
                className="shrink-0 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-full shadow-xs transition-all active:scale-95"
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
        /* 2. KONDISI NAVBAR NORMAL (SESUAI GAMBAR REFERENSI PO)                     */
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

              {/* Sisi Tengah: Menu Navigasi (Program, Layanan, Tentang Kami, Bantuan) */}
              <nav className="flex items-center gap-1 lg:gap-2 text-sm font-medium" aria-label="Navigasi Utama">
                {/* Menu Program */}
                <Link
                  to="/program"
                  onClick={closePopovers}
                  className={`px-3 py-1.5 rounded-lg text-[14px] transition-all duration-150 ${
                    isActive('/program')
                      ? 'text-primary font-semibold'
                      : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  Program
                </Link>

                {/* Menu Layanan (Popover Interaktif) */}
                <div className="relative" ref={layananRef}>
                  <button
                    type="button"
                    onClick={() => setOpenPopover(openPopover === 'layanan' ? null : 'layanan')}
                    aria-expanded={openPopover === 'layanan'}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      openPopover === 'layanan' || ['/zakat', '/infaq', '/sedekah', '/wakaf'].includes(location.pathname)
                        ? 'text-primary font-semibold'
                        : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                    }`}
                  >
                    <span>Layanan</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openPopover === 'layanan' ? 'rotate-180 text-primary' : 'text-slate-400'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openPopover === 'layanan' && (
                    <div
                      role="menu"
                      className="absolute left-0 mt-2.5 w-80 bg-white rounded-2xl border border-slate-100 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
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
                  className={`px-3 py-1.5 rounded-lg text-[14px] transition-all duration-150 ${
                    isActive('/tentang')
                      ? 'text-primary font-semibold'
                      : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  Tentang Kami
                </Link>

                {/* Menu Bantuan (Popover) */}
                <div className="relative" ref={bantuanRef}>
                  <button
                    type="button"
                    onClick={() => setOpenPopover(openPopover === 'bantuan' ? null : 'bantuan')}
                    aria-expanded={openPopover === 'bantuan'}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      openPopover === 'bantuan' || ['/faq', '/kontak'].includes(location.pathname)
                        ? 'text-primary font-semibold'
                        : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                    }`}
                  >
                    <span>Bantuan</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openPopover === 'bantuan' ? 'rotate-180 text-primary' : 'text-slate-400'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openPopover === 'bantuan' && (
                    <div
                      role="menu"
                      className="absolute left-0 mt-2.5 w-72 bg-white rounded-2xl border border-slate-100 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
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

              {/* Sisi Kanan: Search Input Pill & Tombol Sign In / Login */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Search Bar Pill (Klik untuk membuka Full Search Mode) */}
                <div
                  onClick={() => setIsFullSearch(true)}
                  className="cursor-pointer relative w-44 lg:w-52 flex items-center bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/90 rounded-full px-3 py-1.5 transition-all text-xs text-slate-400 group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsFullSearch(true);
                    }
                  }}
                  aria-label="Buka pencarian penuh"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="truncate">{searchQuery ? searchQuery : 'Search...'}</span>
                </div>

                {/* Tombol Sign In (Rounded-Full Pill, Soft Blue Background & Border, Blue Text) */}
                <Link to="/profil" onClick={closePopovers}>
                  <button
                    type="button"
                    className="px-4 py-1.5 text-xs font-semibold text-primary bg-[#EBF3FE] hover:bg-primary/15 border border-primary/20 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
                  >
                    Sign In
                  </button>
                </Link>

                {/* Tombol Login (Rounded-Full Pill, Solid Primary Blue Background, White Text) */}
                <Link to="/profil" onClick={closePopovers}>
                  <button
                    type="button"
                    className="px-4.5 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-full shadow-2xs hover:shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
                  >
                    Login
                  </button>
                </Link>
              </div>
            </Container>
          </div>

          {/* ===== HEADER MOBILE RINGKAS (md:hidden) ===== */}
          <div className="block md:hidden px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Logo Mobile */}
              <Link to="/" onClick={closePopovers} className="shrink-0 flex items-center" aria-label="Kembali ke Beranda OpenDonasi">
                <img src={logoImg} alt="OpenDonasi" className="h-7 w-auto object-contain" />
              </Link>

              {/* Tombol Search Mobile (Pill Shape: Klik untuk Buka Full Search Navbar) */}
              <button
                type="button"
                onClick={() => setIsFullSearch(true)}
                className="flex-1 max-w-[200px] flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-full px-3 py-1.5 text-xs text-slate-400 active:bg-slate-100 transition-colors"
                aria-label="Buka pencarian"
              >
                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="truncate">Search...</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
