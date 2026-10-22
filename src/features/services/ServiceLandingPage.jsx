// Komponen bersama untuk halaman layanan OpenDonasi (/zakat, /infaq, /sedekah, /wakaf).

import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { CAMPAIGNS } from '../../data/campaigns';

export function ServiceLandingPage({
  name,
  title,
  subtitle,
  icon,
  accentColor,
  filterFn,
  ctaText,
  catalogCategory,
  pillars = [],
}) {
  const programsRef = useRef(null);

  // Set document title untuk SEO
  useEffect(() => {
    document.title = `${name} — OpenDonasi`;
    window.scrollTo(0, 0);
  }, [name]);

  // Filter kampanye yang sesuai dengan layanan ini
  const serviceCampaigns = useMemo(() => {
    return CAMPAIGNS.filter(filterFn);
  }, [filterFn]);

  // Handler scroll ke daftar program
  const scrollToPrograms = () => {
    programsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const catalogLink = catalogCategory
    ? `/program?category=${catalogCategory}`
    : '/program';

  return (
    <div className="w-full py-6 md:py-10 space-y-10 sm:space-y-12">
      <Container>
        {/* Breadcrumb Sederhana */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-text-secondary">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-text-secondary">Layanan</span>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text-primary font-medium" aria-current="page">
              {name}
            </li>
          </ol>
        </nav>

        {/* HERO SECTION LAYANAN */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            {/* Ikon Layanan & Badge Akurasi */}
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center p-3 shadow-2xs border"
                style={{
                  backgroundColor: `${accentColor}12`,
                  borderColor: `${accentColor}30`,
                }}
              >
                <img
                  src={icon}
                  alt=""
                  aria-hidden="true"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  Layanan {name}
                </span>
                <span className="block text-xs text-text-secondary mt-0.5">
                  Platform Terverifikasi OpenDonasi
                </span>
              </div>
            </div>

            {/* Judul & Narasi Pengantar Faktual */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {subtitle}
            </p>

            {/* CTA Utama Hero */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={scrollToPrograms}
                className="font-semibold shadow-xs"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText || `Salurkan ${name} Sekarang`}
              </Button>

              <Link to={catalogLink}>
                <Button variant="outline" size="md">
                  Lihat Semua Katalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* DAFTAR PROGRAM UNTUK LAYANAN INI */}
      <Container>
        <div ref={programsRef} className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-border">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Program {name} Pilihan
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Salurkan dana {name.toLowerCase()} Anda kepada program kemaslahatan yang siap menerima amanah.
              </p>
            </div>
            <Link
              to={catalogLink}
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              Katalog Lengkap →
            </Link>
          </div>

          {serviceCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {serviceCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  variant="responsive"
                  className="h-full"
                />
              ))}
            </div>
          ) : (
            /* Empty State jika belum ada program untuk kategori layanan ini */
            <div className="text-center py-16 bg-white rounded-2xl border border-border p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-text-secondary mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Belum Ada Program {name} Aktif
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                Saat ini program {name.toLowerCase()} sedang dalam kurasi. Anda dapat melihat program kebaikan lainnya di katalog utama.
              </p>
              <div className="mt-5">
                <Link to="/program">
                  <Button variant="outline" size="sm">
                    Lihat Semua Program
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* INFORMASI NILAI TAMBAH / TRANSPARANSI LAYANAN */}
      {pillars.length > 0 && (
        <Container>
          <div className="bg-slate-50/80 rounded-2xl border border-border p-6 sm:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Komitmen Layanan OpenDonasi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900">{pillar.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}

export default ServiceLandingPage;
