// Komponen carousel hero beranda OpenDonasi dengan loop tanpa henti (infinite carousel), drag kursor/swipe sangat mulus, autoplay 5 detik, dan dot navigasi.
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BANNERS } from '../../data/content';

/**
 * Hero Carousel untuk Beranda
 * Sesuai instruksi PO & Spesifikasi:
 * - Geser tanpa henti (true infinite loop): Dari gambar ke-4 bisa digeser terus ke kanan ke gambar ke-1 tanpa berputar balik mundur.
 * - Ukuran kontainer max width 1320px (max-w-desktop), sudut membulat rapi (rounded-2xl/3xl).
 * - Drag mouse desktop & touch swipe mobile sangat mulus tanpa lag atau gangguan native image dragging.
 * - Tanpa tombol panah (arrow), tetap pertahankan indikator titik (dots) navigasi yang tersinkronisasi.
 * - Autoplay setiap 5 detik dengan pause sementara saat di-hover atau di-drag.
 */
export function HeroCarousel() {
  const bannerCount = BANNERS.length;

  // Siapkan array dengan clone di awal dan akhir untuk loop tanpa henti
  const extendedBanners = useMemo(() => {
    if (bannerCount === 0) return [];
    const firstClone = { ...BANNERS[0], _virtualId: 'clone-first' };
    const lastClone = { ...BANNERS[bannerCount - 1], _virtualId: 'clone-last' };
    return [lastClone, ...BANNERS.map((b) => ({ ...b, _virtualId: b.id })), firstClone];
  }, [bannerCount]);

  // Indeks aktif pada extendedBanners (1 adalah banner pertama yang sesungguhnya)
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const trackRef = useRef(null);
  const touchStartYRef = useRef(null);
  const touchAxisRef = useRef(null); // 'horizontal' | 'vertical' | null

  // Navigasi Next Slide (maju ke kanan)
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  // Navigasi Prev Slide (mundur ke kiri)
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  // Navigasi ke slide tertentu dari dots
  const goToSlide = (dotIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(dotIndex + 1);
    handleManualInteraction();
  };

  // Reset seamless tanpa animasi ketika menyentuh clone
  const handleTransitionEnd = (e) => {
    if (e.target !== trackRef.current) return;
    setIsTransitioning(false);

    if (currentIndex === 0) {
      // Sampai di clone-last -> lompat instan ke slide terakhir sesungguhnya (index = bannerCount)
      setCurrentIndex(bannerCount);
    } else if (currentIndex === bannerCount + 1) {
      // Sampai di clone-first -> lompat instan ke slide pertama sesungguhnya (index = 1)
      setCurrentIndex(1);
    }
  };

  // Jeda autoplay sementara setelah interaksi manual (~8 detik)
  const handleManualInteraction = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  }, []);

  // Autoplay setiap 5 detik
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused || isDragging || isTransitioning) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isDragging, isTransitioning, nextSlide]);

  // Bersihkan timer saat unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handler Touch Gestures (Mobile) dengan deteksi sumbu horizontal vs vertikal
  const handleTouchStart = (e) => {
    if (isTransitioning) return;
    setDragStartX(e.touches[0].clientX);
    touchStartYRef.current = e.touches[0].clientY;
    touchAxisRef.current = null;
    setDragDeltaX(0);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (dragStartX === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - dragStartX;
    const deltaY = currentY - touchStartYRef.current;

    // Tentukan sumbu gerak pada beberapa piksel pertama
    if (touchAxisRef.current === null) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        touchAxisRef.current = 'vertical';
      } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        touchAxisRef.current = 'horizontal';
      }
    }

    // Jika geser vertikal (scroll halaman), jangan ganggu pergeseran carousel
    if (touchAxisRef.current === 'vertical') {
      return;
    }

    setDragDeltaX(deltaX);
  };

  const handleTouchEnd = () => {
    if (dragStartX !== null && touchAxisRef.current !== 'vertical') {
      if (dragDeltaX > 50) {
        prevSlide();
        handleManualInteraction();
      } else if (dragDeltaX < -50) {
        nextSlide();
        handleManualInteraction();
      }
    }
    setDragStartX(null);
    setDragDeltaX(0);
    setIsDragging(false);
    touchAxisRef.current = null;
  };

  // Handler Mouse Drag Gestures (Desktop) dengan listener window agar tidak lepas
  const handleMouseDown = (e) => {
    if (isTransitioning || e.button !== 0) return;
    e.preventDefault(); // Mencegah native image drag browser yang menyebabkan lag/bug
    setDragStartX(e.clientX);
    setDragDeltaX(0);
    setIsDragging(true);
    setIsPaused(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e) => {
      if (dragStartX === null) return;
      setDragDeltaX(e.clientX - dragStartX);
    };

    const onMouseUp = () => {
      if (dragStartX !== null) {
        if (dragDeltaX > 50) {
          prevSlide();
          handleManualInteraction();
        } else if (dragDeltaX < -50) {
          nextSlide();
          handleManualInteraction();
        }
      }
      setDragStartX(null);
      setDragDeltaX(0);
      setIsDragging(false);
      handleManualInteraction();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragStartX, dragDeltaX, prevSlide, nextSlide, handleManualInteraction]);

  // Hitung indeks dot yang aktif (0..bannerCount - 1)
  const activeDotIndex =
    currentIndex === 0
      ? bannerCount - 1
      : currentIndex === bannerCount + 1
      ? 0
      : currentIndex - 1;

  return (
    <section
      aria-label="Carousel Banner Hero"
      aria-roledescription="carousel"
      className="relative w-full max-w-desktop mx-auto select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Bingkai Carousel Max Width 1320px dengan Sudut Membulat Rapi & Tampilan Banner Penuh */}
      <div
        className="relative w-full aspect-[16/9] sm:aspect-[1.8/1] overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/80 bg-white shadow-xs cursor-grab active:cursor-grabbing touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Slides Track dengan Seamless Infinite Translation */}
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className={`flex h-full w-full ${
            isDragging
              ? 'transition-none'
              : isTransitioning
              ? 'transition-transform duration-500 ease-out'
              : 'transition-none'
          }`}
          style={{
            transform: isDragging
              ? `translateX(calc(-${currentIndex * 100}% + ${dragDeltaX}px))`
              : `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {extendedBanners.map((banner, index) => (
            <div
              key={`${banner._virtualId}-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide: ${banner.title}`}
              className="relative w-full h-full shrink-0 flex items-center justify-center overflow-hidden bg-slate-50"
            >
              <Link
                to={banner.linkUrl}
                className="w-full h-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                tabIndex={currentIndex === index ? 0 : -1}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onClick={(e) => {
                  // Cegah klik tautan jika pengguna sengaja menggeser banner
                  if (Math.abs(dragDeltaX) > 10) {
                    e.preventDefault();
                  }
                }}
              >
                {/* Banner Penuh Bersih Tanpa Letterbox Hitam */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  loading={index <= 2 ? 'eager' : 'lazy'}
                />

                <span className="sr-only">
                  {banner.title} {banner.subtitle ? `— ${banner.subtitle}` : ''}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Titik Indikator Dots di Bawah Banner */}
      <div
        className="mt-4 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Pilih Slide Banner"
      >
        {BANNERS.map((banner, index) => {
          const isActive = activeDotIndex === index;
          return (
            <button
              key={banner.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Lihat banner ${index + 1}: ${banner.title}`}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                isActive
                  ? 'w-7 h-2 bg-primary'
                  : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}

export default HeroCarousel;
