import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';

/**
 * Komponen Pembungkus Layout Utama (RootLayout)
 * - Header tetap di atas
 * - Konten utama di tengah dengan padding bawah responsif untuk mobile bottom nav
 * - Footer di bawah
 * - Mobile bottom nav tetap di bawah pada layar mobile (md:hidden)
 */
export function RootLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary font-sans antialiased">
      {/* Header Terpadu Desktop & Mobile */}
      <Header />

      {/* Konten Halaman dengan Padding Bawah Khusus Mobile agar Tidak Tertutup Bottom Nav */}
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
