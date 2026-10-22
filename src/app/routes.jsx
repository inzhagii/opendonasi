// Konfigurasi routing aplikasi OpenDonasi.
import { useState } from 'react';
import { Routes, Route, Link, useParams, useSearchParams } from 'react-router-dom';
import { CAMPAIGNS } from '../data/campaigns';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { CampaignCard } from '../components/campaign/CampaignCard';
import { HomePage } from '../features/home/HomePage';
import { ProgramPage } from '../features/program/ProgramPage';
import { ProgramDetailPage } from '../features/program/ProgramDetailPage';
import { SearchPage } from '../features/search/SearchPage';
import { ZakatPage } from '../features/services/ZakatPage';
import { InfaqPage } from '../features/services/InfaqPage';
import { SedekahPage } from '../features/services/SedekahPage';
import { WakafPage } from '../features/services/WakafPage';

function RoutePlaceholder({ title, description, pathInfo, routeKind = 'general' }) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const paramSlug = params.slug;
  const queryQ = searchParams.get('q');
  const [testInput, setTestInput] = useState('');

  // Validasi parameter slug terhadap dataset program terpusat
  const matchedCampaign = paramSlug ? CAMPAIGNS.find((c) => c.slug === paramSlug) : null;
  const isSlugNotFound = paramSlug && !matchedCampaign;

  // Program contoh untuk menguji CampaignCard
  const sampleCampaign = matchedCampaign || CAMPAIGNS[0];

  // Validasi query pencarian terhadap dataset
  const searchResultsCount = queryQ
    ? CAMPAIGNS.filter((c) => c.title.toLowerCase().includes(queryQ.toLowerCase())).length
    : 0;

  return (
    <Container className="py-8 md:py-12">
      {/* Judul Seksi Standar */}
      <SectionHeading
        title={title}
        subtitle={description}
        action={
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="md">
              Fondasi Tahap 4
            </Badge>
            {routeKind !== 'general' && (
              <Badge variant="neutral" size="sm" className="uppercase font-mono">
                {routeKind}
              </Badge>
            )}
          </div>
        }
      />

      {/* Informasi Parameter Rute / Query */}
      {(paramSlug || queryQ) && (
        <div className="bg-background-soft border border-border rounded-card p-4 text-sm text-text-secondary mb-8">
          <div className="font-mono text-xs text-text-secondary mb-1">
            Path Info: <strong className="text-text-primary">{pathInfo}</strong>
          </div>
          {paramSlug && (
            <div className="mt-2 text-xs">
              Param Slug: <strong className="text-text-primary font-mono">{paramSlug}</strong>
              {matchedCampaign ? (
                <span className="ml-2 text-success font-medium">✓ Program terverifikasi di mock data</span>
              ) : isSlugNotFound ? (
                <span className="ml-2 text-error font-medium">✕ 404: Slug tidak terdaftar</span>
              ) : null}
            </div>
          )}
          {queryQ && (
            <div className="mt-2 text-xs">
              Query Pencarian: <strong className="text-text-primary">"{queryQ}"</strong> ({searchResultsCount} program cocok)
            </div>
          )}
        </div>
      )}

      {/* Jika di rute /program: Tampilkan Grid Seluruh Program Donasi */}
      {pathInfo === '/program' ? (
        <div className="my-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary">
                Katalog Lengkap Program Kebaikan ({CAMPAIGNS.length} Program)
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Pilih dan salurkan donasi Anda untuk program kemanusiaan, bencana, pendidikan, dan wakaf.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMPAIGNS.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </div>
      ) : (
        /* Showcase Pengujian Komponen Reusable Tahap 4 */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 pt-4 border-t border-border/80">
          {/* Kolom Kiri: Verifikasi CampaignCard Props-Driven */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Verifikasi CampaignCard (16:9)
              </span>
              <Badge variant="neutral" size="sm">
                Prop-Driven
              </Badge>
            </div>
            <div className="w-full max-w-sm mx-auto lg:mx-0">
              <CampaignCard campaign={sampleCampaign} />
            </div>
            <p className="text-[11px] text-text-secondary mt-2">
              *Rasio gambar 16:9 stabil, nominal dan progres selalu terlihat tanpa hover.
            </p>
          </div>

          {/* Kolom Kanan: Verifikasi Komponen UI Dasar (Button, Badge, Input) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Uji Variasi Button */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2.5">
                Verifikasi Variasi Button
              </span>
              <div className="flex flex-wrap gap-2.5 items-center">
                <Button variant="primary" size="sm">Primary Sm</Button>
                <Button variant="primary" size="md">Primary Md</Button>
                <Button variant="secondary" size="md">Secondary</Button>
                <Button variant="outline" size="md">Outline</Button>
                <Button variant="primary" size="md" disabled>Disabled</Button>
              </div>
            </div>

            {/* Uji Variasi Badge */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2.5">
                Verifikasi Variasi Badge Semantik
              </span>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Berhasil</Badge>
                <Badge variant="warning">Menunggu</Badge>
                <Badge variant="error">Dibatalkan</Badge>
                <Badge variant="neutral">Kategori</Badge>
              </div>
            </div>

            {/* Uji Komponen Input Aksesibel */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2.5">
                Verifikasi Komponen Input
              </span>
              <div className="max-w-md">
                <Input
                  label="Uji Input Interaktif"
                  placeholder="Ketik untuk menguji state fokus dan binding..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  helperText="Input aksesibel dengan border #E5E7EB dan ring fokus brand #2E7DFA"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigasi Cepat Pengujian Antar Rute */}
      <div className="mt-8 pt-6 border-t border-border">
        <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
          Tautan Uji 16 Rute Fondasi:
        </span>
        <div className="flex flex-wrap gap-2 text-xs text-primary">
          <Link to="/" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">01. Beranda</Link>
          <Link to="/program" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">02. Daftar Program</Link>
          <Link to="/program/tanggap-darurat-korban-bencana" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">03. Detail Program</Link>
          <Link to="/zakat" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">04. Landing Zakat</Link>
          <Link to="/zakat/zakat-penghasilan-bantu-mustahik" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">05. Detail Zakat</Link>
          <Link to="/infaq" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">06. Landing Infaq</Link>
          <Link to="/sedekah" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">07. Landing Sedekah</Link>
          <Link to="/wakaf" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">08. Landing Wakaf</Link>
          <Link to="/donasi/bantu-sarana-belajar-pesantren" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">09. Form Donasi</Link>
          <Link to="/hasil-donasi" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">10. Hasil Simulasi</Link>
          <Link to="/tentang" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">11. Tentang Kami</Link>
          <Link to="/faq" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">12. FAQ</Link>
          <Link to="/kontak" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">13. Kontak</Link>
          <Link to="/donasi-saya" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">14. Donasi Saya</Link>
          <Link to="/profil" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">15. Profil/Akun</Link>
          <Link to="/search?q=pangan" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded">16. Hasil Pencarian</Link>
          <Link to="/route-ngawur-404" className="hover:underline px-2.5 py-1 bg-background-soft border border-border rounded text-error">Test 404</Link>
        </div>
      </div>
    </Container>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/program" element={<ProgramPage />} />
      <Route path="/program/:slug" element={<ProgramDetailPage />} />
      <Route path="/zakat" element={<ZakatPage />} />
      <Route path="/zakat/:slug" element={<ProgramDetailPage />} />
      <Route path="/infaq" element={<InfaqPage />} />
      <Route path="/sedekah" element={<SedekahPage />} />
      <Route path="/wakaf" element={<WakafPage />} />
      <Route path="/donasi/:slug" element={<RoutePlaceholder title="09. Form Donasi" description="Formulir pemilihan nominal preset/manual, identitas donatur, dan doa dukungan." pathInfo="/donasi/:slug" routeKind="donation" />} />
      <Route path="/hasil-donasi" element={<RoutePlaceholder title="10. Hasil Simulasi Donasi" description="Bukti transaksi simulasi dengan nomor referensi OD-XXXXXX dan status transaksi." pathInfo="/hasil-donasi" />} />
      <Route path="/tentang" element={<RoutePlaceholder title="11. Tentang Kami" description="Informasi profil OpenDonasi sebagai digital giving infrastructure." pathInfo="/tentang" />} />
      <Route path="/faq" element={<RoutePlaceholder title="12. FAQ (Pusat Bantuan)" description="Tanya-jawab seputar platform OpenDonasi dengan pencarian dan accordion." pathInfo="/faq" />} />
      <Route path="/kontak" element={<RoutePlaceholder title="13. Kontak Bantuan" description="Saluran bantuan demo via WhatsApp dan email placeholder." pathInfo="/kontak" />} />
      <Route path="/donasi-saya" element={<RoutePlaceholder title="14. Donasi Saya" description="Riwayat donasi donatur demo berbasis sesi lokal." pathInfo="/donasi-saya" />} />
      <Route path="/profil" element={<RoutePlaceholder title="15. Profil / Akun" description="Hub akun demo dan pintu akses eksklusif ke Donasi Saya." pathInfo="/profil" />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="*" element={<RoutePlaceholder title="404 — Halaman Tidak Ditemukan" description="Halaman yang Anda tuju tidak tersedia atau tautan telah berpindah." pathInfo="404 Fallback" />} />
    </Routes>
  );
}
