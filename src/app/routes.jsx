import { Routes, Route, Link, useParams, useSearchParams } from 'react-router-dom';
import { CAMPAIGNS } from '../data/campaigns';

function RoutePlaceholder({ title, description, pathInfo, routeKind }) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const paramSlug = params.slug;
  const queryQ = searchParams.get('q');

  // Validasi parameter slug terhadap dataset program terpusat
  const matchedCampaign = paramSlug ? CAMPAIGNS.find((c) => c.slug === paramSlug) : null;
  const isSlugNotFound = paramSlug && !matchedCampaign;

  // Validasi query pencarian terhadap dataset
  const searchResultsCount = queryQ
    ? CAMPAIGNS.filter((c) => c.title.toLowerCase().includes(queryQ.toLowerCase())).length
    : 0;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-desktop mx-auto">
      <div className="w-16 h-16 bg-primary-soft text-primary rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">{title}</h1>
      <p className="text-text-secondary max-w-md mb-4">{description}</p>
      
      {/* Parameter Slug Display & Validation */}
      {paramSlug && (
        <div className="bg-background-soft border border-border rounded-button p-4 text-sm text-text-secondary mb-4 max-w-md w-full text-left">
          <div className="font-mono text-xs text-text-secondary mb-1">
            Param Slug: <strong className="text-text-primary">{paramSlug}</strong>
          </div>
          {matchedCampaign ? (
            <div className="mt-2 text-xs text-success bg-green-50 border border-green-200 rounded p-2">
              ✓ Program Terverifikasi di Mock: <strong>{matchedCampaign.title}</strong>
              <div className="text-[11px] text-text-secondary mt-1">
                Tipe Layanan: <span className="font-semibold uppercase">{matchedCampaign.serviceType}</span> | 
                Target: {matchedCampaign.targetAmount} | Sisa: {matchedCampaign.daysLeft} hari
              </div>
              {routeKind === 'zakat' && matchedCampaign.serviceType !== 'zakat' && (
                <div className="text-warning text-[11px] mt-1">
                  ⚠️ Catatan: Program ini bertipe "{matchedCampaign.serviceType}" namun dibuka pada rute zakat.
                </div>
              )}
            </div>
          ) : isSlugNotFound ? (
            <div className="mt-2 text-xs text-error bg-red-50 border border-red-200 rounded p-2">
              ✕ 404 Slug: Program dengan slug "{paramSlug}" tidak ditemukan di dataset mock.
            </div>
          ) : null}
        </div>
      )}

      {/* Query Search Display & Validation */}
      {queryQ && (
        <div className="bg-background-soft border border-border rounded-button p-3 text-sm text-text-secondary mb-4 max-w-md w-full">
          Kata Kunci Pencarian: <strong className="text-text-primary">"{queryQ}"</strong>
          <div className="text-xs text-primary mt-1">
            Ditemukan <strong>{searchResultsCount}</strong> program yang cocok di dataset mock.
          </div>
        </div>
      )}

      <div className="text-xs text-text-secondary bg-primary-soft/50 border border-primary/20 px-3 py-1.5 rounded-full mb-6">
        Status: Fondasi Routing Tahap 3 Aktif ({pathInfo})
      </div>

      {/* Tautan Uji Coba Navigasi Antar-Rute */}
      <div className="flex flex-wrap gap-2 justify-center max-w-xl text-xs text-primary">
        <Link to="/" className="hover:underline px-2 py-1 bg-white border border-border rounded">Beranda</Link>
        <Link to="/program" className="hover:underline px-2 py-1 bg-white border border-border rounded">Daftar Program</Link>
        <Link to="/program/tanggap-darurat-korban-bencana" className="hover:underline px-2 py-1 bg-white border border-border rounded">Test Detail Program</Link>
        <Link to="/zakat" className="hover:underline px-2 py-1 bg-white border border-border rounded">Landing Zakat</Link>
        <Link to="/zakat/zakat-penghasilan-bantu-mustahik" className="hover:underline px-2 py-1 bg-white border border-border rounded">Test Detail Zakat</Link>
        <Link to="/infaq" className="hover:underline px-2 py-1 bg-white border border-border rounded">Landing Infaq</Link>
        <Link to="/sedekah" className="hover:underline px-2 py-1 bg-white border border-border rounded">Landing Sedekah</Link>
        <Link to="/wakaf" className="hover:underline px-2 py-1 bg-white border border-border rounded">Landing Wakaf</Link>
        <Link to="/donasi/bantu-sarana-belajar-pesantren" className="hover:underline px-2 py-1 bg-white border border-border rounded">Test Form Donasi</Link>
        <Link to="/hasil-donasi" className="hover:underline px-2 py-1 bg-white border border-border rounded">Hasil Simulasi</Link>
        <Link to="/tentang" className="hover:underline px-2 py-1 bg-white border border-border rounded">Tentang Kami</Link>
        <Link to="/faq" className="hover:underline px-2 py-1 bg-white border border-border rounded">FAQ</Link>
        <Link to="/kontak" className="hover:underline px-2 py-1 bg-white border border-border rounded">Kontak</Link>
        <Link to="/profil" className="hover:underline px-2 py-1 bg-white border border-border rounded">Profil/Akun</Link>
        <Link to="/donasi-saya" className="hover:underline px-2 py-1 bg-white border border-border rounded">Donasi Saya</Link>
        <Link to="/search?q=bencana" className="hover:underline px-2 py-1 bg-white border border-border rounded">Test Search "?q=bencana"</Link>
        <Link to="/route-ngawur-404" className="hover:underline px-2 py-1 bg-white border border-border rounded text-error">Test 404</Link>
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
            routeKind="program"
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
            routeKind="zakat"
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
            routeKind="donation"
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
