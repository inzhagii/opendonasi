// Komponen FeaturedCampaignCarousel ("Ada Kebaikan yang Menantimu") OpenDonasi
// Mengimplementasikan 3 main card di tengah, 2 peek card di kiri dan kanan, infinite looping tanpa henti, shadow putih, dan tombol arrow.

import { useRef, useState, useEffect, useCallback } from 'react';

import { CAMPAIGNS } from '../../data/campaigns';
import { CampaignCard } from './CampaignCard';
import { SectionHeading } from '../ui/SectionHeading';

export function FeaturedCampaignCarousel({ className = '' }) {
  // Ambil program unggulan (minimal 5-7 kampanye untuk infinite loop mulus)
  const featuredCampaigns = CAMPAIGNS.filter((c) => c.isFeatured);
  const items = featuredCampaigns.length >= 5 ? featuredCampaigns : CAMPAIGNS.slice(0, 7);
  const totalCount = items.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('idle'); // 'idle' | 'next' | 'prev'
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  const trackRef = useRef(null);
  const dragStartXRef = useRef(null);

  // Responsif cardWidth dan gap
  const [dimensions, setDimensions] = useState({ cardWidth: 340, gap: 24 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ cardWidth: 280, gap: 14 });
      } else if (width < 1024) {
        setDimensions({ cardWidth: 310, gap: 18 });
      } else {
        setDimensions({ cardWidth: 340, gap: 24 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const stepWidth = dimensions.cardWidth + dimensions.gap;

  // Navigasi Next (Geser ke Kiri, kartu bergerak ke Kanan)
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('next');
  }, [isAnimating]);

  // Navigasi Prev (Geser ke Kanan, kartu bergerak ke Kiri)
  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('prev');
  }, [isAnimating]);

  // Reset indeks dan transform setelah animasi selesai
  const finishTransition = useCallback(() => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % totalCount);
    } else if (direction === 'prev') {
      setCurrentIndex((prev) => (prev - 1 + totalCount) % totalCount);
    }
    setDirection('idle');
    setIsAnimating(false);
    setDragDeltaX(0);
  }, [direction, totalCount]);

  // Handler onTransitionEnd pada track
  const handleTransitionEnd = (e) => {
    if (e.target !== trackRef.current) return;
    finishTransition();
  };

  // Fallback safety timeout jika onTransitionEnd terlewat
  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        finishTransition();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, finishTransition]);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    if (isAnimating) return;
    dragStartXRef.current = e.clientX;
    setIsDragging(true);
    setDragDeltaX(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const delta = e.clientX - dragStartXRef.current;
    setDragDeltaX(delta);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX < -40) {
      handleNext();
    } else if (dragDeltaX > 40) {
      handlePrev();
    } else {
      setDragDeltaX(0);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Touch Swipe Handlers (Mobile)
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    dragStartXRef.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragDeltaX(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const delta = e.touches[0].clientX - dragStartXRef.current;
    setDragDeltaX(delta);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX < -40) {
      handleNext();
    } else if (dragDeltaX > 40) {
      handlePrev();
    } else {
      setDragDeltaX(0);
    }
  };

  // Cegah klik kartu jika pengguna sengaja melakukan drag
  const handleClickCapture = (e) => {
    if (Math.abs(dragDeltaX) > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Hitung offset perpindahan transform secara presisi
  let currentTranslate = 0;
  if (isDragging) {
    currentTranslate = dragDeltaX;
  } else if (direction === 'next') {
    currentTranslate = -stepWidth;
  } else if (direction === 'prev') {
    currentTranslate = stepWidth;
  }

  // 7 slot kartu yang selalu berputar tanpa henti:
  // Offset: [-2, -1 (Peek Kiri), 0 (Main 1), 1 (Main 2 Center), 2 (Main 3), 3 (Peek Kanan), 4]
  const offsets = [-2, -1, 0, 1, 2, 3, 4];
  const visibleCards = offsets.map((offset) => {
    const index = (currentIndex + offset + totalCount * 10) % totalCount;
    return {
      campaign: items[index],
      offset,
      key: `${items[index].id}-${offset}`,
    };
  });

  return (
    <section aria-labelledby="featured-section-title" className={`w-full ${className}`}>
      {/* Header Seksi Terpusat */}
      <div className="mb-6">
        <SectionHeading
          title="Ada Kebaikan yang Menantimu"
          subtitle="Bantu program darurat dan kemanusiaan paling mendesak yang membutuhkan uluran tangan Anda."
          align="center"
        />
      </div>

      {/* Viewport Carousel: 3 Main Card Center, 2 Peek Card di Sisi, Shadow Putih & Tombol Arrow */}
      <div
        className="relative w-full h-[435px] overflow-hidden select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClickCapture={handleClickCapture}
      >
        {/* Shadow Gradasi Putih Sisi Kiri (Menutup sebagian Peek Card Kiri) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 sm:w-28 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none"
          aria-hidden="true"
        />

        {/* Shadow Gradasi Putih Sisi Kanan (Menutup sebagian Peek Card Kanan) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-20 sm:w-28 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none"
          aria-hidden="true"
        />

        {/* Tombol Panah Kiri (Arrow Prev) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Geser ke program sebelumnya"
          className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:text-primary transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Tombol Panah Kanan (Arrow Next) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Geser ke program berikutnya"
          className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:text-primary transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Rel Track Kartu: Selalu Terpusat Simetris di Tengah Viewport */}
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className={`flex items-center absolute left-1/2 top-2.5 bottom-2.5 ${
            isAnimating
              ? 'transition-transform duration-[350ms] ease-out'
              : 'transition-none'
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            transform: `translateX(calc(-50% + ${currentTranslate}px))`,
          }}
        >
          {visibleCards.map((item, idx) => (
            <div
              key={item.key}
              className="shrink-0 h-[400px] transition-opacity duration-200"
              style={{
                width: `${dimensions.cardWidth}px`,
                marginRight: idx === visibleCards.length - 1 ? 0 : `${dimensions.gap}px`,
              }}
            >
              <CampaignCard campaign={item.campaign} variant="vertical" className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCampaignCarousel;
