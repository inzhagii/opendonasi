// Komponen Pembungkus Layout Utama (RootLayout) OpenDonasi.
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';

export function RootLayout({ children }) {
  const location = useLocation();

  // Sembunyikan navbar utama pada Detail Program, Halaman Layanan, Form Donasi, Hasil Donasi, Profil Penggalang, dan Halaman Pencarian
  const isDetailPage = location.pathname.startsWith('/program/') && location.pathname !== '/program';
  const isServicePage = ['/zakat', '/infaq', '/sedekah', '/wakaf'].some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));
  const isDonationFlow = location.pathname.startsWith('/donasi/') || location.pathname === '/hasil-donasi';
  const isOrganizerPage = location.pathname.startsWith('/penggalang/') || location.pathname.startsWith('/yayasan/');
  const isSearchPage = location.pathname === '/search';

  const shouldHideHeader = isDetailPage || isServicePage || isDonationFlow || isOrganizerPage || isSearchPage;

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary font-sans antialiased">
      {/* Header Utama (Disembunyikan pada Detail Program & Halaman Layanan sesuai preferensi PO) */}
      {!shouldHideHeader && <Header />}

      {/* Konten Halaman */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Footer Desktop & Mobile */}
      <Footer />

      {/* Bottom Navigation Tetap Khusus Mobile */}
      <MobileBottomNav />
    </div>
  );
}

export default RootLayout;
