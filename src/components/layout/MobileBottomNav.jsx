// Komponen navigasi bawah tetap untuk perangkat mobile (OpenDonasi).
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClickOutside } from '../../hooks/useClickOutside';

export function MobileBottomNav() {
  const [isLayananOpen, setIsLayananOpen] = useState(false);
  const location = useLocation();

  const layananSheetRef = useClickOutside(() => {
    if (isLayananOpen) setIsLayananOpen(false);
  }, isLayananOpen);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isLayananActive =
    ['/zakat', '/infaq', '/sedekah', '/wakaf'].some((p) => location.pathname.startsWith(p));

  const closeLayanan = () => setIsLayananOpen(false);

  // Sesuai OPENDONASI_SPEC & Tahap 4: Bottom nav disembunyikan pada Detail Program, Form Donasi, dan Hasil Simulasi
  const shouldHideBottomNav =
    (location.pathname.startsWith('/program/') && location.pathname !== '/program') ||
    (location.pathname.startsWith('/zakat/') && location.pathname !== '/zakat') ||
    location.pathname.startsWith('/donasi/') ||
    location.pathname === '/hasil-donasi';

  if (shouldHideBottomNav) return null;

  return (
    <>
      {/* Overlay Menu Layanan Mobile */}
      {isLayananOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end md:hidden animate-in fade-in duration-200">
          <div
            ref={layananSheetRef}
            className="bg-white rounded-t-2xl p-6 border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
              <h3 className="font-bold text-text-primary text-base">Pilih Akses Layanan</h3>
              <button
                type="button"
                onClick={closeLayanan}
                className="p-1 text-text-secondary hover:text-text-primary rounded-full"
                aria-label="Tutup menu layanan"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/zakat"
                onClick={closeLayanan}
                className="flex flex-col p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-soft transition-colors"
              >
                <strong className="text-sm text-text-primary">Zakat</strong>
                <span className="text-xs text-text-secondary">Kalkulator & program zakat</span>
              </Link>
              <Link
                to="/infaq"
                onClick={closeLayanan}
                className="flex flex-col p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-soft transition-colors"
              >
                <strong className="text-sm text-text-primary">Infaq</strong>
                <span className="text-xs text-text-secondary">Penyaluran infaq umat</span>
              </Link>
              <Link
                to="/sedekah"
                onClick={closeLayanan}
                className="flex flex-col p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-soft transition-colors"
              >
                <strong className="text-sm text-text-primary">Sedekah</strong>
                <span className="text-xs text-text-secondary">Sedekah rutin & pangan</span>
              </Link>
              <Link
                to="/wakaf"
                onClick={closeLayanan}
                className="flex flex-col p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-soft transition-colors"
              >
                <strong className="text-sm text-text-primary">Wakaf</strong>
                <span className="text-xs text-text-secondary">Wakaf sarana produktif</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Bar Navigasi Tetap Bawah (Mobile Only) */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/98 backdrop-blur-md border-t border-border md:hidden"
      >
        <div className="grid grid-cols-4 h-16 max-w-mobile mx-auto px-2">
          {/* Tab 1: Home */}
          <Link
            to="/"
            onClick={closeLayanan}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/') ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[11px] leading-none">Home</span>
          </Link>

          {/* Tab 2: Program */}
          <Link
            to="/program"
            onClick={closeLayanan}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/program') ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[11px] leading-none">Program</span>
          </Link>

          {/* Tab 3: Layanan (Trigger Sheet) */}
          <button
            type="button"
            onClick={() => setIsLayananOpen(!isLayananOpen)}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isLayananActive || isLayananOpen
                ? 'text-primary font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[11px] leading-none">Layanan</span>
          </button>

          {/* Tab 4: Akun */}
          <Link
            to="/profil"
            onClick={closeLayanan}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/profil') || isActive('/donasi-saya')
                ? 'text-primary font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[11px] leading-none">Akun</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
