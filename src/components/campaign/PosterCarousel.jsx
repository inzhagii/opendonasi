import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CAMPAIGNS } from '../../data/campaigns';
import { SectionHeading } from '../ui/SectionHeading';
import banner1 from '../../assets/image/banner/banner1.png';
import banner2 from '../../assets/image/banner/banner2.png';
import banner3 from '../../assets/image/banner/banner3.png';
import banner4 from '../../assets/image/banner/banner4.png';

/**
 * PosterCarousel ("Yang Baru di OpenDonasi")
 * Spesifikasi OPENDONASI_SPEC:
 * - Carousel poster/banner rasio 16:9.
 * - Swipe/drag manual.
 * - Poster wajib tampil utuh tanpa crop (object-contain).
 */
export function PosterCarousel({ className = '' }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Item yang menggunakan komposisi poster/banner dari image/banner
  const posterItems = [
    {
      id: 'poster-1',
      campaign: CAMPAIGNS.find((c) => c.slug === 'tanggap-darurat-korban-bencana') || CAMPAIGNS[1],
      image: banner1,
      tag: 'Tanggap Darurat',
      caption: 'Gotong Royong Ringankan Duka Saudara Terdampak Bencana',
    },
    {
      id: 'poster-2',
      campaign: CAMPAIGNS.find((c) => c.slug === 'dukung-operasional-ambulans-gratis') || CAMPAIGNS[2],
      image: banner2,
      tag: 'Layanan Medis',
      caption: 'Ambulans Gratis Siaga Layani Pasien Dhuafa Pelosok',
    },
    {
      id: 'poster-3',
      campaign: CAMPAIGNS.find((c) => c.slug === 'bantu-sarana-belajar-pesantren') || CAMPAIGNS[0],
      image: banner3,
      tag: 'Wakaf Produktif',
      caption: 'Bangun Pesantren Bangun Peradaban Santri Pelosok',
    },
    {
      id: 'poster-4',
      campaign: CAMPAIGNS.find((c) => c.slug === 'sedekah-renovasi-sarana-ibadah') || CAMPAIGNS[6],
      image: banner4,
      tag: 'Sedekah Air Bersih',
      caption: 'Sedekah Gotong Royong Sarana Air Bersih & Bersuci',
    },
  ];

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
  }, []);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="poster-section-title" className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <SectionHeading
          title="Yang Baru di OpenDonasi"
          subtitle="Kabar inisiatif terbaru, program kemaslahatan, dan poster transparansi penyaluran."
        />
      </div>

      <div className="relative group/poster">
        {/* Tombol Navigasi Sisi Desktop */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Geser poster ke kiri"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-md items-center justify-center text-text-primary hover:text-primary hover:border-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Geser poster ke kanan"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-md items-center justify-center text-text-primary hover:text-primary hover:border-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Rel Poster Carousel */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x scrollbar-none pb-4 pt-1 px-1 -mx-1"
        >
          {posterItems.map((item) => (
            <div
              key={item.id}
              className="shrink-0 snap-start w-[280px] sm:w-[340px] md:w-[420px]"
            >
              <Link
                to={`/program/${item.campaign.slug}`}
                className="group block bg-white rounded-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Gambar Poster 16:9 Utuh Tanpa Crop */}
                <div className="relative w-full aspect-[16/9] bg-neutral-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.image || item.campaign.image}
                    alt={item.caption}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-primary backdrop-blur-sm shadow-sm">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                    {item.campaign.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
