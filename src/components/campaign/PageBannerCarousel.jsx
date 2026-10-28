// Komponen banner carousel untuk header halaman katalog program dan layanan OpenDonasi (/program, /zakat, /infaq, /sedekah, /wakaf).
// Menampilkan 1 main banner di tengah dan 2 peek banner di sisi kiri & kanan.
// Dilengkapi auto-slide 5 detik, kontrol panah, drag/swipe dengan kursor, dan indikator dots.
// Didesain bersih ("cukup ada banner aja") tanpa judul teks pengantar di atasnya.

import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import banner1 from '../../assets/image/banner/banner1.png';
import banner2 from '../../assets/image/banner/banner2.png';
import banner3 from '../../assets/image/banner/banner3.png';
import banner4 from '../../assets/image/banner/banner4.png';

const DEFAULT_BANNERS = [
  {
    id: 'banner-santri',
    image: banner3,
    link: '/wakaf',
    title: 'Sambut Hari Santri - Wakaf Sumur Layak',
  },
  {
    id: 'banner-bencana',
    image: banner1,
    link: '/program/tanggap-darurat-korban-bencana',
    title: 'Tanggap Darurat Bencana',
  },
  {
    id: 'banner-ambulans',
    image: banner2,
    link: '/program/dukung-operasional-ambulans-gratis',
    title: 'Operasional Ambulans Gratis',
  },
  {
    id: 'banner-sedekah',
    image: banner4,
    link: '/program/sedekah-renovasi-sarana-ibadah',
    title: 'Sedekah Air Bersih',
  },
];

export function PageBannerCarousel({ banners = DEFAULT_BANNERS, className = '' }) {
  const location = useLocation();
  const items = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;
  const totalCount = items.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('idle'); // 'idle' | 'next' | 'prev'
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const dragStartXRef = useRef(null);

  // Responsif bannerWidth, bannerHeight, dan gap
  const [dimensions, setDimensions] = useState({
    bannerWidth: 840,
    bannerHeight: 400,
    gap: 20,
  });

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.offsetWidth;
    let bannerW;
    let gap;
    let height;

    if (containerW < 480) {
      gap = 12;
      bannerW = Math.round(containerW * 0.82);
      height = Math.round(bannerW * (9 / 16));
    } else if (containerW < 768) {
      gap = 16;
      bannerW = Math.round(containerW * 0.78);
      height = Math.round(bannerW * (9 / 16));
    } else if (containerW < 1024) {
      gap = 20;
      bannerW = Math.round(containerW * 0.74);
      height = Math.round(bannerW * (9 / 18));
    } else {
      gap = 24;
      bannerW = Math.min(880, Math.round(containerW * 0.70));
      height = Math.round(bannerW * (9 / 18));
    }

    setDimensions({ bannerWidth: bannerW, bannerHeight: height, gap });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const stepWidth = dimensions.bannerWidth + dimensions.gap;

  // Navigasi Next (Geser ke Kiri, banner bergerak ke Kanan)
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('next');
  }, [isAnimating]);

  // Navigasi Prev (Geser ke Kanan, banner bergerak ke Kiri)
  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('prev');
  }, [isAnimating]);

  // Selesaikan transisi perputaran infinite
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

  const handleTransitionEnd = (e) => {
    if (e.target !== trackRef.current) return;
    finishTransition();
  };

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(finishTransition, 420);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, finishTransition]);

  // Auto-slide geser otomatis selama 5 detik sekali ke arah kanan
  useEffect(() => {
    if (isPaused || isDragging || isAnimating) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isDragging, isAnimating, handleNext]);

  // Mouse Drag Gestures
  const handleMouseDown = (e) => {
    if (isAnimating || e.button !== 0) return;
    dragStartXRef.current = e.clientX;
    setIsDragging(true);
    setIsPaused(true);
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
    setIsPaused(false);
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
    setIsPaused(false);
  };

  // Touch Swipe Gestures (Mobile)
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    dragStartXRef.current = e.touches[0].clientX;
    setIsDragging(true);
    setIsPaused(true);
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
    setTimeout(() => setIsPaused(false), 2000);
    if (dragDeltaX < -40) {
      handleNext();
    } else if (dragDeltaX > 40) {
      handlePrev();
    } else {
      setDragDeltaX(0);
    }
  };

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

  // 7 slot banner yang berputar secara infinite:
  // Offset: [-3, -2, -1 (Peek Kiri), 0 (Main Center), 1 (Peek Kanan), 2, 3]
  const offsets = [-3, -2, -1, 0, 1, 2, 3];
  const visibleBanners = offsets.map((offset) => {
    const index = (currentIndex + offset + totalCount * 10) % totalCount;
    return {
      poster: items[index],
      offset,
      key: `${items[index].id}-${offset}`,
    };
  });

  return (
    <div className={`w-full ${className}`}>
      {/* Viewport Carousel: 1 Main Banner di Tengah, 2 Peek Banner di Kiri & Kanan */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none"
        style={{ minHeight: `${dimensions.bannerHeight}px` }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClickCapture={handleClickCapture}
      >
        {/* Rel Track Banner: Selalu Terpusat Simetris di Tengah Viewport */}
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className={`flex items-center absolute left-1/2 top-0 bottom-0 ${
            isAnimating
              ? 'transition-transform duration-[400ms] ease-out'
              : 'transition-none'
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            transform: `translateX(calc(-50% + ${currentTranslate}px))`,
          }}
        >
          {visibleBanners.map((item, idx) => {
            const isCenter = item.offset === 0;
            const isPeekLeft = item.offset === -1;
            const isPeekRight = item.offset === 1;

            return (
              <div
                key={item.key}
                onClick={() => {
                  if (Math.abs(dragDeltaX) > 8) return;
                  if (isPeekLeft) handlePrev();
                  else if (isPeekRight) handleNext();
                }}
                className={`shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white transition-all duration-300 ${
                  isCenter
                    ? 'shadow-md opacity-100 z-10 scale-100 ring-1 ring-slate-900/5'
                    : 'opacity-85 hover:opacity-100 cursor-pointer shadow-xs scale-[0.98]'
                }`}
                style={{
                  width: `${dimensions.bannerWidth}px`,
                  height: `${dimensions.bannerHeight}px`,
                  marginRight: idx === visibleBanners.length - 1 ? 0 : `${dimensions.gap}px`,
                }}
              >
                {isCenter ? (
                  <Link
                    to={item.poster.link}
                    state={{ from: location.pathname + location.search }}
                    className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl sm:rounded-3xl overflow-hidden"
                  >
                    <img
                      src={item.poster.image}
                      alt={item.poster.title}
                      className="w-full h-full object-cover pointer-events-none"
                      loading="eager"
                    />
                  </Link>
                ) : (
                  <div className="w-full h-full block overflow-hidden rounded-2xl sm:rounded-3xl">
                    <img
                      src={item.poster.image}
                      alt={item.poster.title}
                      className="w-full h-full object-cover pointer-events-none"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indikator */}
      <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
        {items.map((poster, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={poster.id}
              type="button"
              onClick={() => {
                if (isAnimating || isActive) return;
                if (idx === (currentIndex + 1) % totalCount) handleNext();
                else if (idx === (currentIndex - 1 + totalCount) % totalCount) handlePrev();
                else {
                  setCurrentIndex(idx);
                }
              }}
              aria-label={`Pindah ke banner ${idx + 1}`}
              className={`transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                isActive
                  ? 'w-6 sm:w-8 h-2 bg-primary'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PageBannerCarousel;
