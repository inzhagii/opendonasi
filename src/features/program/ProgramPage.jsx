// Halaman katalog daftar program donasi OpenDonasi.

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { Button } from '../../components/ui/Button';
import { CAMPAIGNS } from '../../data/campaigns';
import { filterCampaigns, sortCampaigns } from '../../lib/campaignFilters';
import { ProgramToolbar } from './components/ProgramToolbar';
import { PageBannerCarousel } from '../../components/campaign/PageBannerCarousel';

const INITIAL_PAGE_SIZE = 6;
const PAGE_SIZE_INCREMENT = 6;

export function ProgramPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Kategori & sort langsung bersumber dari searchParams URL
  const selectedCategory = searchParams.get('category') || 'semua';
  const selectedSort = searchParams.get('sort') || 'terbaru';

  const [targetRange, setTargetRange] = useState('all');
  const [daysRange, setDaysRange] = useState('all');
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  // Set document title untuk SEO dan navigasi browser
  useEffect(() => {
    document.title = 'Katalog Program Donasi — OpenDonasi';
    window.scrollTo(0, 0);
  }, []);

  // Handler pergantian kategori dengan sinkronisasi ke URL parameter
  const handleSelectCategory = (catId) => {
    setVisibleCount(INITIAL_PAGE_SIZE);

    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'semua') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams, { replace: true });
  };

  // Handler pengurutan
  const handleSelectSort = (sortId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (sortId === 'terbaru') {
      nextParams.delete('sort');
    } else {
      nextParams.set('sort', sortId);
    }
    setSearchParams(nextParams, { replace: true });
  };

  // Handler reset seluruh filter
  const handleResetFilters = () => {
    setTargetRange('all');
    setDaysRange('all');
    setVisibleCount(INITIAL_PAGE_SIZE);

    const nextParams = new URLSearchParams();
    setSearchParams(nextParams, { replace: true });
  };

  // Memfilter dan mengurutkan kampanye
  const filteredAndSortedCampaigns = useMemo(() => {
    const filtered = filterCampaigns(CAMPAIGNS, {
      category: selectedCategory,
      targetRange,
      daysRange,
    });
    return sortCampaigns(filtered, selectedSort);
  }, [selectedCategory, targetRange, daysRange, selectedSort]);

  const totalCount = filteredAndSortedCampaigns.length;
  const displayedCampaigns = filteredAndSortedCampaigns.slice(0, visibleCount);
  const hasMore = visibleCount < totalCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE_INCREMENT);
  };

  return (
    <div className="w-full py-6 md:py-10">
      <Container>
        {/* Banner Carousel Geser ("cukup ada banner aja") */}
        <div className="mb-6 sm:mb-8">
          <PageBannerCarousel />
        </div>

        {/* Toolbar: Kategori Tabs, Filter Popover, dan Urutkan (Seimbang Desktop) */}
        <div className="mb-6 sm:mb-8">
          <ProgramToolbar
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            selectedSort={selectedSort}
            onSelectSort={handleSelectSort}
            targetRange={targetRange}
            onChangeTargetRange={(val) => {
              setTargetRange(val);
              setVisibleCount(INITIAL_PAGE_SIZE);
            }}
            daysRange={daysRange}
            onChangeDaysRange={(val) => {
              setDaysRange(val);
              setVisibleCount(INITIAL_PAGE_SIZE);
            }}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Grid Program atau Empty State */}
        {displayedCampaigns.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayedCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  variant="responsive"
                  className="h-full"
                />
              ))}
            </div>

            {/* Tombol Load More jika masih ada data yang belum ditampilkan */}
            {hasMore ? (
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleLoadMore}
                  className="px-8 font-semibold"
                >
                  Muat Lebih Banyak Program
                </Button>
              </div>
            ) : totalCount > INITIAL_PAGE_SIZE ? (
              <p className="mt-10 text-center text-xs text-text-secondary">
                Semua program yang sesuai filter telah ditampilkan ({totalCount} program).
              </p>
            ) : null}
          </>
        ) : (
          /* Empty State Ramah Pengguna */
          <div className="text-center py-16 bg-white rounded-2xl border border-border p-8 max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-text-secondary mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-text-primary">
              Tidak Ada Program yang Sesuai
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
              Kombinasi kategori atau filter yang Anda pilih tidak menemukan program aktif saat ini.
              Silakan atur ulang filter untuk melihat program lainnya.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleResetFilters}
              >
                Reset Semua Filter
              </Button>
              <Link to="/">
                <Button variant="outline" size="sm">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ProgramPage;
