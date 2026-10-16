import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CAMPAIGNS } from '../../data/campaigns';
import { CampaignCard } from './CampaignCard';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * FeaturedCampaignCarousel ("Ada Kebaikan yang Menantimu")
 * Spesifikasi OPENDONASI_SPEC:
 * - Carousel kartu program unggulan (isFeatured: true).
 * - Mendukung drag/swipe manual, TANPA autoplay.
 * - Desktop: menampilkan 3 kartu penuh dan sebagian kartu berikutnya (overflow hint).
 * - Tombol panah di sisi carousel sejajar area kartu.
 * - Mobile: kartu dapat digeser secara horizontal (snap).
 */
export function FeaturedCampaignCarousel({ className = '' }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Ambil program unggulan (isFeatured: true)
  const featuredCampaigns = CAMPAIGNS.filter((c) => c.isFeatured);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [featuredCampaigns]);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="featured-section-title" className={`w-full ${className}`}>
      {/* Header Seksi */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <SectionHeading
          title="Ada Kebaikan yang Menantimu"
          subtitle="Bantu program darurat dan kemanusiaan paling mendesak yang membutuhkan uluran tangan Anda."
          action={
            <Link
              to="/program"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Lihat Semua Program
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          }
        />
      </div>

      {/* Rel Carousel dengan Tombol Navigasi Sisi */}
      <div className="relative group/carousel">
        {/* Tombol Panah Kiri (Desktop) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Geser ke program sebelumnya"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-md items-center justify-center text-text-primary hover:text-primary hover:border-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Tombol Panah Kanan (Desktop) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Geser ke program berikutnya"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-md items-center justify-center text-text-primary hover:text-primary hover:border-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Kontainer Scroll Kartu */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x scrollbar-none pb-4 pt-1 px-1 -mx-1"
        >
          {featuredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="shrink-0 snap-start w-[280px] sm:w-[320px] md:w-[calc((100%-36px)/3.2)]"
            >
              <CampaignCard campaign={campaign} variant="vertical" className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
