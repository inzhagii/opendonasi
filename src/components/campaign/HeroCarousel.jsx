// Komponen carousel hero beranda OpenDonasi dengan max-width 1320px, drag kursor/swipe, autoplay 5 detik, dan dot navigasi.
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BANNERS } from '../../data/content';

/**
 * Hero Carousel untuk Beranda
 * Sesuai spesifikasi & instruksi PO:
 * - Ukuran kontainer max width 1320px (max-w-desktop), sudut membulat rapi (rounded-2xl/3xl).
 * - Gambar tampil penuh (full edge-to-edge) dengan rasio proporsional ~16:9.
 * - Dapat digeser ke kanan dan kiri dengan kursor mouse (drag) atau sentuhan jari (swipe).
 * - Tanpa tombol panah (arrow), tetap pertahankan indikator titik (dots) navigasi.
 * - Bergeser otomatis (autoplay) setiap 5 detik.
 */
export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const bannerCount = BANNERS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerCount);
  }, [bannerCount]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + bannerCount) % bannerCount);
  }, [bannerCount]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    handleManualInteraction();
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
    if (prefersReducedMotion || isPaused || isDragging) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isDragging, nextSlide]);

  // Bersihkan timer saat unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handler Touch Gestures (Mobile)
  const handleTouchStart = (e) => {
    setDragStartX(e.touches[0].clientX);
    setDragDeltaX(0);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (dragStartX === null) return;
    const currentX = e.touches[0].clientX;
    setDragDeltaX(currentX - dragStartX);
  };

  const handleTouchEnd = () => {
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
  };

  // Handler Mouse Drag Gestures (Desktop)
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragStartX(e.clientX);
    setDragDeltaX(0);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || dragStartX === null) return;
    setDragDeltaX(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (isDragging && dragStartX !== null) {
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
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  return (
    <section
      aria-label="Carousel Banner Hero"
      aria-roledescription="carousel"
      className="relative w-full max-w-desktop mx-auto select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handleMouseLeave();
      }}
    >
      {/* Bingkai Carousel Max Width 1320px dengan Sudut Membulat Rapi & Tampilan Banner Penuh */}
      <div
        className="relative w-full aspect-[16/9] sm:aspect-[1.8/1] overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/80 bg-white shadow-xs cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Slides Track dengan Drag Translation Real-time */}
        <div
          className={`flex h-full w-full ${
            isDragging ? 'transition-none' : 'transition-transform duration-500 ease-out'
          }`}
          style={{
            transform: isDragging
              ? `translateX(calc(-${currentIndex * 100}% + ${dragDeltaX}px))`
              : `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} dari ${bannerCount}: ${banner.title}`}
              className="relative w-full h-full shrink-0 flex items-center justify-center overflow-hidden bg-slate-50"
            >
              <Link
                to={banner.linkUrl}
                className="w-full h-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                tabIndex={currentIndex === index ? 0 : -1}
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
                  className="w-full h-full object-cover pointer-events-none"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                <span className="sr-only">
                  {banner.title} {banner.subtitle ? `— ${banner.subtitle}` : ''}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Titik Indikator Dots di Bawah Banner (Tanpa Tombol Arrow) */}
      <div
        className="mt-4 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Pilih Slide Banner"
      >
        {BANNERS.map((banner, index) => {
          const isActive = currentIndex === index;
          return (
            <button
              key={banner.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Lihat banner ${index + 1}: ${banner.title}`}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
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
