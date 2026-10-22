// Komponen Pembungkus Layout Utama (RootLayout) OpenDonasi.
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';

export function RootLayout({ children }) {
  const location = useLocation();

  // Sembunyikan navbar utama pada Detail Program, Form Donasi, Hasil Donasi, Profil Penggalang, dan Halaman Pencarian
  // Catatan: Halaman Layanan (/zakat, /infaq, /sedekah, /wakaf) TETAP menampilkan navbar utama pada desktop & mobile sesuai arahan PO
  const isDetailPage = location.pathname.startsWith('/program/') && location.pathname !== '/program';
  const isDonationFlow = location.pathname.startsWith('/donasi/') || location.pathname === '/hasil-donasi';
  const isOrganizerPage = location.pathname.startsWith('/penggalang/') || location.pathname.startsWith('/yayasan/');
  const isSearchPage = location.pathname === '/search';

  const shouldHideHeader = isDetailPage || isDonationFlow || isOrganizerPage || isSearchPage;

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary font-sans antialiased">
      {/* Header Utama (Ditampilkan pada Beranda, Program, dan Layanan Zakat/Infaq/Sedekah/Wakaf) */}
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
