import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { recordSourcePage } from '../../lib/navigation';

export function RootLayout({ children }) {
  const location = useLocation();

  // Rekam halaman asal yang dikunjungi sebelum masuk alur detail program
  useEffect(() => {
    recordSourcePage(location);
  }, [location]);

  // Sembunyikan navbar utama & footer pada Detail Program, Form Donasi, Hasil Donasi, Profil Penggalang, Halaman Pencarian, dan Halaman Auth (Login / Sign In)
  const isDetailPage = location.pathname.startsWith('/program/') && location.pathname !== '/program';
  const isDonationFlow = location.pathname.startsWith('/donasi/') || location.pathname === '/hasil-donasi';
  const isOrganizerPage = location.pathname.startsWith('/penggalang/') || location.pathname.startsWith('/yayasan/');
  const isSearchPage = location.pathname === '/search';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signin' || location.pathname === '/daftar';
  const isZakatCalculator = location.pathname === '/zakat/kalkulator';

  const shouldHideHeader = isDetailPage || isDonationFlow || isOrganizerPage || isSearchPage || isAuthPage || isZakatCalculator;
  // Hapus footer pada detail program, formulir donasi, dan halaman auth (login/signin berdiri sendiri)
  const shouldHideFooter = isDetailPage || isDonationFlow || isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary font-sans antialiased">
      {/* Header Utama (Ditampilkan pada Beranda, Program, dan Layanan Zakat/Infaq/Sedekah/Wakaf) */}
      {!shouldHideHeader && <Header />}

      {/* Konten Halaman */}
      <main className={`flex-1 ${isAuthPage ? '' : 'pb-20 md:pb-0'}`}>
        {children}
      </main>

      {/* Footer Desktop & Mobile */}
      {!shouldHideFooter && <Footer />}

      {/* Bottom Navigation Tetap Khusus Mobile */}
      <MobileBottomNav />
    </div>
  );
}

export default RootLayout;
