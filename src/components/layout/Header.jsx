import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo/logo.png';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      {/* ===== HEADER DESKTOP (md:flex) ===== */}
      <div className="hidden md:block">
        <Container className="h-18 flex items-center justify-between gap-6">
          {/* Logo Brand */}
          <Link
            to="/"
            onClick={closePopovers}
            className="shrink-0 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label="Kembali ke Beranda OpenDonasi"
          >
            <img src={logoImg} alt="OpenDonasi Logo" className="h-9 w-auto object-contain" />
          </Link>

          {/* Navigasi Menu Desktop */}
          <nav className="flex items-center gap-1 lg:gap-2 text-sm font-medium text-text-primary">
            {/* Menu Program */}
            <Link
              to="/program"
              onClick={closePopovers}
              className={`px-3 py-2 rounded-button transition-colors hover:text-primary ${
                isActive('/program') ? 'text-primary bg-primary-soft' : ''
              }`}
            >
              Program
            </Link>

            {/* Menu Layanan (Popover) */}
            <div className="relative" ref={layananRef}>
              <button
                type="button"
                onClick={() => setOpenPopover(openPopover === 'layanan' ? null : 'layanan')}
                aria-expanded={openPopover === 'layanan'}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-button transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  openPopover === 'layanan' ? 'text-primary bg-primary-soft' : ''
                }`}
              >
                <span>Layanan</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openPopover === 'layanan' ? 'rotate-180 text-primary' : 'text-text-secondary'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openPopover === 'layanan' && (
                <div
                  role="menu"
                  className="absolute left-0 mt-2 w-56 bg-white rounded-card border border-border shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <Link
                    to="/zakat"
                    role="menuitem"
                    onClick={closePopovers}
                    className="flex flex-col px-3 py-2 rounded hover:bg-background-soft transition-colors text-left"
                  >
                    <span className="font-semibold text-text-primary text-sm">Zakat</span>
                    <span className="text-xs text-text-secondary">Kalkulator dan program zakat</span>
                  </Link>
                  <Link
                    to="/infaq"
                    role="menuitem"
                    onClick={closePopovers}
                    className="flex flex-col px-3 py-2 rounded hover:bg-background-soft transition-colors text-left"
                  >
                    <span className="font-semibold text-text-primary text-sm">Infaq</span>
                    <span className="text-xs text-text-secondary">Penyaluran infaq kemaslahatan</span>
                  </Link>
                  <Link
                    to="/sedekah"
                    role="menuitem"
                    onClick={closePopovers}
                    className="flex flex-col px-3 py-2 rounded hover:bg-background-soft transition-colors text-left"
                  >
                    <span className="font-semibold text-text-primary text-sm">Sedekah</span>
                    <span className="text-xs text-text-secondary">Sedekah rutin harian & pangan</span>
                  </Link>
                  <Link
                    to="/wakaf"
                    role="menuitem"
                    onClick={closePopovers}
                    className="flex flex-col px-3 py-2 rounded hover:bg-background-soft transition-colors text-left"
                  >
                    <span className="font-semibold text-text-primary text-sm">Wakaf</span>
                    <span className="text-xs text-text-secondary">Wakaf sarana produktif abadi</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Menu Tentang Kami */}
            <Link
              to="/tentang"
              onClick={closePopovers}
              className={`px-3 py-2 rounded-button transition-colors hover:text-primary ${
                isActive('/tentang') ? 'text-primary bg-primary-soft' : ''
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-button transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  openPopover === 'bantuan' ? 'text-primary bg-primary-soft' : ''
                }`}
              >
                <span>Bantuan</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openPopover === 'bantuan' ? 'rotate-180 text-primary' : 'text-text-secondary'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openPopover === 'bantuan' && (
                <div
                  role="menu"
                  className="absolute left-0 mt-2 w-52 bg-white rounded-card border border-border shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <Link
                    to="/faq"
                    role="menuitem"
                    onClick={closePopovers}
                    className="flex flex-col px-3 py-2 rounded hover:bg-background-soft transition-colors text-left"
                  >
                    <span className="font-semibold text-text-primary text-sm">FAQ</span>
                    <span className="text-xs text-text-secondary">Pertanyaan sering diajukan</span>
                  </Link>
                  <Link
                    to="/kontak"
                    role="menuitem"
                    onClick={closePopovers}
                    className="flex flex-col px-3 py-2 rounded hover:bg-background-soft transition-colors text-left"
                  >
                    <span className="font-semibold text-text-primary text-sm">Kontak Bantuan</span>
                    <span className="text-xs text-text-secondary">Hubungi kami via WhatsApp/Email</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Kolom Pencarian & Tombol Akun */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative w-48 lg:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari program kebaikan..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-border bg-background-soft focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-secondary/60"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <Link to="/profil" onClick={closePopovers}>
              <Button variant="outline" size="sm" className="font-semibold">
                Masuk / Akun
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* ===== HEADER MOBILE RINGKAS (md:hidden) ===== */}
      <div className="block md:hidden px-4 py-2.5">
        <div className="flex items-center justify-between gap-3 mb-2">
          {/* Logo Mobile */}
          <Link to="/" onClick={closePopovers} className="flex items-center" aria-label="Beranda OpenDonasi">
            <img src={logoImg} alt="OpenDonasi" className="h-7 w-auto object-contain" />
          </Link>

          {/* Akses Cepat Profil Mobile */}
          <Link
            to="/profil"
            className="p-1.5 text-text-secondary hover:text-primary rounded-full hover:bg-background-soft"
            aria-label="Akun Donatur Demo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>

        {/* Kolom Pencarian Mobile Lebar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari program donasi..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-border bg-background-soft focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-secondary/60"
          />
          <button
            type="submit"
            aria-label="Cari"
            className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}
