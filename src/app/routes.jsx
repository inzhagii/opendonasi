import { Routes, Route, Link, useParams, useSearchParams } from 'react-router-dom';

function RoutePlaceholder({ title, description, pathInfo }) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const paramSlug = params.slug;
  const queryQ = searchParams.get('q');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-desktop mx-auto">
      <div className="w-16 h-16 bg-primary-soft text-primary rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">{title}</h1>
      <p className="text-text-secondary max-w-md mb-4">{description}</p>
      
      {(paramSlug || queryQ) && (
        <div className="bg-background-soft border border-border rounded-button px-4 py-2 text-sm text-text-secondary mb-6 font-mono">
          {paramSlug && <span>Param slug: <strong className="text-text-primary">{paramSlug}</strong></span>}
          {queryQ && <span>Query search: <strong className="text-text-primary">"{queryQ}"</strong></span>}
        </div>
      )}

      <div className="text-xs text-text-secondary bg-primary-soft/50 border border-primary/20 px-3 py-1.5 rounded-full mb-6">
        Status: Fondasi Routing Tahap 3 Aktif ({pathInfo})
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-xl text-xs text-primary">
        <Link to="/" className="hover:underline px-2 py-1 bg-white border border-border rounded">Beranda</Link>
        <Link to="/program" className="hover:underline px-2 py-1 bg-white border border-border rounded">Daftar Program</Link>
        <Link to="/zakat" className="hover:underline px-2 py-1 bg-white border border-border rounded">Landing Zakat</Link>
        <Link to="/infaq" className="hover:underline px-2 py-1 bg-white border border-border rounded">Landing Infaq</Link>
        <Link to="/sedekah" className="hover:underline px-2 py-1 bg-white border border-border rounded">Landing Sedekah</Link>
        <Link to="/wakaf" className="hover:underline px-2 py-1 bg-white border border-border rounded">Landing Wakaf</Link>
        <Link to="/tentang" className="hover:underline px-2 py-1 bg-white border border-border rounded">Tentang Kami</Link>
        <Link to="/faq" className="hover:underline px-2 py-1 bg-white border border-border rounded">FAQ</Link>
        <Link to="/kontak" className="hover:underline px-2 py-1 bg-white border border-border rounded">Kontak</Link>
        <Link to="/profil" className="hover:underline px-2 py-1 bg-white border border-border rounded">Profil/Akun</Link>
        <Link to="/donasi-saya" className="hover:underline px-2 py-1 bg-white border border-border rounded">Donasi Saya</Link>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* 01. Beranda */}
      <Route
        path="/"
        element={
          <RoutePlaceholder
            title="01. Beranda OpenDonasi"
            description="Halaman beranda utama dengan hero carousel, akses cepat layanan, dan program unggulan."
            pathInfo="/"
          />
        }
      />

      {/* 02. Daftar Program */}
      <Route
        path="/program"
        element={
          <RoutePlaceholder
            title="02. Daftar Program"
            description="Katalog penelusuran, filter kategori, dan pengurutan program donasi."
            pathInfo="/program"
          />
        }
      />

      {/* 03. Detail Program Donasi Umum */}
      <Route
        path="/program/:slug"
        element={
          <RoutePlaceholder
            title="03. Detail Program Donasi"
            description="Informasi narasi program, dana terkumpul, dan tombol donasi sekarang."
            pathInfo="/program/:slug"
          />
        }
      />

      {/* 04. Landing Zakat */}
      <Route
        path="/zakat"
        element={
          <RoutePlaceholder
            title="04. Landing Zakat"
            description="Edukasi zakat, kalkulator zakat simulasi, dan daftar program zakat."
            pathInfo="/zakat"
          />
        }
      />

      {/* 05. Detail Zakat */}
      <Route
        path="/zakat/:slug"
        element={
          <RoutePlaceholder
            title="05. Detail Zakat"
            description="Detail program zakat khusus dengan tombol Zakat Sekarang dan mini kalkulator."
            pathInfo="/zakat/:slug"
          />
        }
      />

      {/* 06. Landing Infaq */}
      <Route
        path="/infaq"
        element={
          <RoutePlaceholder
            title="06. Landing Infaq"
            description="Pengantar layanan infaq dan program kemaslahatan terkait."
            pathInfo="/infaq"
          />
        }
      />

      {/* 07. Landing Sedekah */}
      <Route
        path="/sedekah"
        element={
          <RoutePlaceholder
            title="07. Landing Sedekah"
            description="Pengantar layanan sedekah harian dan program sosial terkait."
            pathInfo="/sedekah"
          />
        }
      />

      {/* 08. Landing Wakaf */}
      <Route
        path="/wakaf"
        element={
          <RoutePlaceholder
            title="08. Landing Wakaf"
            description="Pengantar layanan wakaf produktif dan poster program wakaf utuh."
            pathInfo="/wakaf"
          />
        }
      />

      {/* 09. Form Donasi */}
      <Route
        path="/donasi/:slug"
        element={
          <RoutePlaceholder
            title="09. Form Donasi"
            description="Formulir pemilihan nominal preset/manual, identitas donatur, dan doa dukungan."
            pathInfo="/donasi/:slug"
          />
        }
      />

      {/* 10. Hasil Simulasi Donasi */}
      <Route
        path="/hasil-donasi"
        element={
          <RoutePlaceholder
            title="10. Hasil Simulasi Donasi"
            description="Bukti transaksi simulasi dengan nomor referensi OD-XXXXXX dan status transaksi."
            pathInfo="/hasil-donasi"
          />
        }
      />

      {/* 11. Tentang Kami */}
      <Route
        path="/tentang"
        element={
          <RoutePlaceholder
            title="11. Tentang Kami"
            description="Informasi profil OpenDonasi sebagai digital giving infrastructure."
            pathInfo="/tentang"
          />
        }
      />

      {/* 12. FAQ */}
      <Route
        path="/faq"
        element={
          <RoutePlaceholder
            title="12. FAQ (Pusat Bantuan)"
            description="Tanya-jawab seputar platform OpenDonasi dengan pencarian dan accordion."
            pathInfo="/faq"
          />
        }
      />

      {/* 13. Kontak */}
      <Route
        path="/kontak"
        element={
          <RoutePlaceholder
            title="13. Kontak Bantuan"
            description="Saluran bantuan demo via WhatsApp dan email placeholder."
            pathInfo="/kontak"
          />
        }
      />

      {/* 14. Donasi Saya */}
      <Route
        path="/donasi-saya"
        element={
          <RoutePlaceholder
            title="14. Donasi Saya"
            description="Riwayat donasi donatur demo berbasis sesi lokal."
            pathInfo="/donasi-saya"
          />
        }
      />

      {/* 15. Profil/Akun */}
      <Route
        path="/profil"
        element={
          <RoutePlaceholder
            title="15. Profil / Akun"
            description="Hub akun demo dan pintu akses eksklusif ke Donasi Saya."
            pathInfo="/profil"
          />
        }
      />

      {/* 16. Hasil Pencarian */}
      <Route
        path="/search"
        element={
          <RoutePlaceholder
            title="16. Hasil Pencarian"
            description="Hasil penelusuran program berdasarkan kata kunci pencarian global."
            pathInfo="/search"
          />
        }
      />

      {/* Fallback 404 Route */}
      <Route
        path="*"
        element={
          <RoutePlaceholder
            title="404 — Halaman Tidak Ditemukan"
            description="Halaman yang Anda tuju tidak tersedia atau tautan telah berpindah."
            pathInfo="404 Fallback"
          />
        }
      />
    </Routes>
  );
}
