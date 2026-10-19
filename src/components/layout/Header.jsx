import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo/logo.png';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Container } from '../ui/Container';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openPopover, setOpenPopover] = useState(null); // 'layanan' | 'bantuan' | null
  const navigate = useNavigate();
  const location = useLocation();

  const layananRef = useClickOutside(() => {
    if (openPopover === 'layanan') setOpenPopover(null);
  }, openPopover === 'layanan');

  const bantuanRef = useClickOutside(() => {
    if (openPopover === 'bantuan') setOpenPopover(null);
  }, openPopover === 'bantuan');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const closePopovers = () => setOpenPopover(null);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-colors">
      {/* ===== HEADER DESKTOP (md:block) ===== */}
      <div className="hidden md:block">
        <Container className="h-22 lg:h-24 flex items-center justify-between gap-6 lg:gap-8">
          {/* Sisi Kiri: Logo Brand & Divider */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              onClick={closePopovers}
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-transform hover:opacity-95"
              aria-label="Kembali ke Beranda OpenDonasi"
            >
              <img src={logoImg} alt="OpenDonasi Logo" className="h-9 w-auto object-contain" />
            </Link>
          </div>

          {/* Sisi Tengah: Menu Navigasi Terstruktur */}
          <nav className="flex items-center gap-1.5 lg:gap-2 text-sm font-medium" aria-label="Navigasi Utama">
            {/* Menu Program */}
            <Link
              to="/program"
              onClick={closePopovers}
              className={`relative px-3.5 py-2 rounded-lg text-[14px] transition-all duration-150 ${
                isActive('/program')
                  ? 'text-primary font-semibold bg-primary/8 shadow-2xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              Program
              {isActive('/program') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </Link>

            {/* Menu Layanan (Popover Interaktif) */}
            <div className="relative" ref={layananRef}>
              <button
                type="button"
                onClick={() => setOpenPopover(openPopover === 'layanan' ? null : 'layanan')}
                aria-expanded={openPopover === 'layanan'}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[14px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  openPopover === 'layanan' || ['/zakat', '/infaq', '/sedekah', '/wakaf'].includes(location.pathname)
                    ? 'text-primary font-semibold bg-primary/8 shadow-2xs'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
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
                  strokeWidth={2.5}
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
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">Bantuan paket pangan & santunan rutin harian</p>
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
              className={`relative px-3.5 py-2 rounded-lg text-[14px] transition-all duration-150 ${
                isActive('/tentang')
                  ? 'text-primary font-semibold bg-primary/8 shadow-2xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              Tentang Kami
              {isActive('/tentang') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </Link>

            {/* Menu Bantuan (Popover) */}
            <div className="relative" ref={bantuanRef}>
              <button
                type="button"
                onClick={() => setOpenPopover(openPopover === 'bantuan' ? null : 'bantuan')}
                aria-expanded={openPopover === 'bantuan'}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[14px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  openPopover === 'bantuan' || ['/faq', '/kontak'].includes(location.pathname)
                    ? 'text-primary font-semibold bg-primary/8 shadow-2xs'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
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
                  strokeWidth={2.5}
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

          {/* Sisi Kanan: Pencarian Modern & Tombol Aksi */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* Input Pencarian Berdesain Pill */}
            <form onSubmit={handleSearchSubmit} className="relative w-44 lg:w-56 group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari program donasi..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-slate-200/90 bg-slate-50/80 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary/15 focus:border-primary transition-all placeholder:text-slate-400 font-normal"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 group-hover:text-primary transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Tombol Donasi Cepat */}
            <Link to="/program" onClick={closePopovers} className="hidden xl:inline-block">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-full shadow-xs hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
              >
                Donasi Sekarang
              </button>
            </Link>

            {/* Tombol Akun / Profil */}
            <Link to="/profil" onClick={closePopovers} className="shrink-0">
              <button
                type="button"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-primary/40 bg-white hover:bg-primary/5 text-slate-700 hover:text-primary transition-all text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span>Akun Saya</span>
              </button>
            </Link>
          </div>
        </Container>
      </div>

      {/* ===== HEADER MOBILE RINGKAS (md:hidden) ===== */}
      <div className="block md:hidden px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Logo Mobile */}
          <Link to="/" onClick={closePopovers} className="shrink-0 flex items-center" aria-label="Kembali ke Beranda OpenDonasi">
            <img src={logoImg} alt="OpenDonasi" className="h-7 w-auto object-contain" />
          </Link>

          {/* Kolom Pencarian Mobile Berdampingan dengan Logo */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari program donasi..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Cari"
              className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
