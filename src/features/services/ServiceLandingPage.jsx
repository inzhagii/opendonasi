// Komponen bersama untuk halaman layanan OpenDonasi (/zakat, /infaq, /sedekah, /wakaf).
// Tata letak diselaraskan dengan katalog program: Banner carousel di atas, toolbar seimbang (Kategori, Filter, Urutkan), dan daftar program responsif.

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { PageBannerCarousel } from '../../components/campaign/PageBannerCarousel';
import { ProgramToolbar } from '../program/components/ProgramToolbar';
import { CAMPAIGNS } from '../../data/campaigns';
import { filterCampaigns, sortCampaigns } from '../../lib/campaignFilters';

import banner1 from '../../assets/image/banner/banner1.png';
import banner2 from '../../assets/image/banner/banner2.png';
import banner3 from '../../assets/image/banner/banner3.png';
import banner4 from '../../assets/image/banner/banner4.png';

const SERVICE_BANNERS = {
  wakaf: [
    {
      id: 'banner-wakaf-1',
      image: banner3,
      link: '/wakaf',
      title: 'Sambut Hari Santri - Wakaf Sumur Layak',
    },
    {
      id: 'banner-wakaf-2',
      image: banner4,
      link: '/program/sedekah-renovasi-sarana-ibadah',
      title: 'Sedekah Renovasi Sarana Ibadah',
    },
    {
      id: 'banner-wakaf-3',
      image: banner1,
      link: '/program/tanggap-darurat-korban-bencana',
      title: 'Tanggap Darurat Bencana',
    },
    {
      id: 'banner-wakaf-4',
      image: banner2,
      link: '/program/dukung-operasional-ambulans-gratis',
      title: 'Operasional Ambulans Gratis',
    },
  ],
  infaq: [
    {
      id: 'banner-infaq-1',
      image: banner2,
      link: '/program/dukung-operasional-ambulans-gratis',
      title: 'Operasional Ambulans Gratis',
    },
    {
      id: 'banner-infaq-2',
      image: banner4,
      link: '/program/sedekah-renovasi-sarana-ibadah',
      title: 'Infaq Sarana Air Bersih',
    },
    {
      id: 'banner-infaq-3',
      image: banner1,
      link: '/program/tanggap-darurat-korban-bencana',
      title: 'Tanggap Darurat Bencana',
    },
    {
      id: 'banner-infaq-4',
      image: banner3,
      link: '/wakaf',
      title: 'Wakaf Sarana Santri Pelosok',
    },
  ],
  sedekah: [
    {
      id: 'banner-sedekah-1',
      image: banner4,
      link: '/program/sedekah-renovasi-sarana-ibadah',
      title: 'Sedekah Air Bersih Desa',
    },
    {
      id: 'banner-sedekah-2',
      image: banner1,
      link: '/program/tanggap-darurat-korban-bencana',
      title: 'Tanggap Darurat Bencana',
    },
    {
      id: 'banner-sedekah-3',
      image: banner2,
      link: '/program/dukung-operasional-ambulans-gratis',
      title: 'Operasional Ambulans Gratis',
    },
    {
      id: 'banner-sedekah-4',
      image: banner3,
      link: '/wakaf',
      title: 'Sambut Hari Santri',
    },
  ],
  zakat: [
    {
      id: 'banner-zakat-1',
      image: banner1,
      link: '/program/tanggap-darurat-korban-bencana',
      title: 'Zakat untuk Mustahik dan Tanggap Bencana',
    },
    {
      id: 'banner-zakat-2',
      image: banner3,
      link: '/wakaf',
      title: 'Pemberdayaan Santri Dhuafa',
    },
    {
      id: 'banner-zakat-3',
      image: banner4,
      link: '/program/sedekah-renovasi-sarana-ibadah',
      title: 'Sedekah Air Bersih',
    },
    {
      id: 'banner-zakat-4',
      image: banner2,
      link: '/program/dukung-operasional-ambulans-gratis',
      title: 'Operasional Ambulans Gratis',
    },
  ],
};

export function ServiceLandingPage({
  serviceId,
  name,
  filterFn,
  pillars = [],
}) {
  const navigate = useNavigate();
  const [selectedSort, setSelectedSort] = useState('terbaru');
  const [targetRange, setTargetRange] = useState('all');
  const [daysRange, setDaysRange] = useState('all');



  // Set document title untuk SEO
  useEffect(() => {
    document.title = `Layanan ${name} — OpenDonasi`;
    window.scrollTo(0, 0);
  }, [name]);

  const handleResetFilters = () => {
    setTargetRange('all');
    setDaysRange('all');
    setSelectedSort('terbaru');
  };

  // Filter kampanye yang sesuai dengan layanan ini, targetRange, daysRange, dan sort
  const filteredAndSortedCampaigns = useMemo(() => {
    const base = CAMPAIGNS.filter(filterFn);
    const filtered = filterCampaigns(base, {
      category: 'semua',
      targetRange,
      daysRange,
    });
    return sortCampaigns(filtered, selectedSort);
  }, [filterFn, targetRange, daysRange, selectedSort]);

  const serviceBanners = SERVICE_BANNERS[serviceId] || SERVICE_BANNERS.zakat;



  return (
    <div className="w-full py-6 md:py-10 space-y-8 sm:space-y-10">
      <Container>
        {/* 1. Banner Carousel Geser ("cukup ada banner aja") */}
        <div className="mb-6 sm:mb-8">
          <PageBannerCarousel banners={serviceBanners} />
        </div>

        {/* 2. Akses Khusus Kalkulator Zakat (Sesuai Desain Siap Bayar Zakat) */}
        {serviceId === 'zakat' && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Siap bayar zakat?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Hitung dan salurkan ke lembaga amil terpercaya
            </p>

            <div className="mt-4 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs w-full flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-primary shadow-2xs">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                    <rect x="4" y="2" width="16" height="20" rx="3" stroke="currentColor" />
                    <line x1="8" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    <circle cx="8" cy="11" r="1" fill="currentColor" />
                    <circle cx="12" cy="11" r="1" fill="currentColor" />
                    <circle cx="16" cy="11" r="1" fill="currentColor" />
                    <circle cx="8" cy="15" r="1" fill="currentColor" />
                    <circle cx="12" cy="15" r="1" fill="currentColor" />
                    <circle cx="16" cy="15" r="1" fill="currentColor" />
                    <circle cx="8" cy="18" r="1" fill="currentColor" />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                    <circle cx="16" cy="18" r="1" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Kalkulator Zakat
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Hitung kewajiban zakat profesi, fitrah dan maal kamu
                  </p>
                </div>
              </div>

              <Link
                to="/zakat/kalkulator"
                className="w-full md:w-auto inline-flex items-center justify-center py-2.5 px-8 rounded-full border-2 border-primary hover:border-primary-dark hover:bg-blue-50 text-primary hover:text-primary-dark font-bold text-sm sm:text-base transition-colors shrink-0"
              >
                Hitung sekarang
              </Link>
            </div>
          </div>
        )}

        {/* 3. Toolbar Seimbang Desktop: Kategori Layanan, Filter, dan Urutkan */}
        <div className="mb-6 sm:mb-8">
          <ProgramToolbar
            serviceName={name}
            selectedCategory="semua"
            onSelectCategory={(catId) => {
              if (catId !== 'semua') {
                navigate(`/program?category=${catId}`);
              }
            }}
            selectedSort={selectedSort}
            onSelectSort={setSelectedSort}
            targetRange={targetRange}
            onChangeTargetRange={setTargetRange}
            daysRange={daysRange}
            onChangeDaysRange={setDaysRange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* 4. Grid Program Layanan atau Empty State */}
        {filteredAndSortedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAndSortedCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                variant="responsive"
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-border p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-text-secondary mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Tidak Ada Program {name} yang Sesuai
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
              Kriteria filter yang Anda pilih tidak menemukan program aktif saat ini.
              Silakan atur ulang filter untuk melihat program lainnya.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button variant="primary" size="sm" onClick={handleResetFilters}>
                Reset Filter
              </Button>
              <Link to="/program">
                <Button variant="outline" size="sm">
                  Lihat Semua Program
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>

      {/* 5. Nilai Tambah & Komitmen Transparansi Layanan */}
      {pillars.length > 0 && (
        <Container>
          <div className="bg-slate-50/80 rounded-3xl border border-border p-6 sm:p-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Komitmen Layanan {name} OpenDonasi
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
