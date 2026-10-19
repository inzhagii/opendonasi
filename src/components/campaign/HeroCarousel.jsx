// Komponen carousel hero beranda OpenDonasi dengan swipe responsif dan banner utuh.
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BANNERS } from '../../data/content';

/**
 * Hero Carousel untuk Beranda
 * Spesifikasi OPENDONASI_SPEC:
 * - Kontainer 1320px, sudut membulat, rasio 16:9.
 * - Swipe/drag manual tanpa tombol panah.
 * - Autoplay ~6 detik, jeda setelah interaksi manual, hormati reduced motion.
 * - Titik indikator di bawah banner.
 * - Gambar utuh tanpa terpotong (object-contain).
 */
export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const carouselRef = useRef(null);

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

  // Jeda sementara setelah interaksi manual (~10 detik)
  const handleManualInteraction = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 10000);
  }, []);

  // Autoplay ~6 detik
  useEffect(() => {
    // Periksa preferensi reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused || isDragging) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isDragging, nextSlide]);

  // Bersihkan timeout saat unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handler Touch Gestures
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

  // Handler Mouse Drag Gestures
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
      {/* Bingkai Carousel 16:9 dengan Sudut Membulat */}
      <div
        ref={carouselRef}
        className="relative w-full aspect-[16/9] overflow-hidden rounded-xl md:rounded-2xl border border-border/80 bg-neutral-900 shadow-sm cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Slides Track */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} dari ${bannerCount}: ${banner.title}`}
              className="relative w-full h-full shrink-0 bg-neutral-950 flex items-center justify-center overflow-hidden"
            >
              <Link
                to={banner.linkUrl}
                className="w-full h-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                tabIndex={currentIndex === index ? 0 : -1}
                onClick={(e) => {
                  // Cegah navigasi jika terjadi tarikan drag yang disengaja
                  if (Math.abs(dragDeltaX) > 10) {
                    e.preventDefault();
                  }
                }}
              >
                {/* Gambar Utuh Tanpa Crop (object-contain) */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-contain pointer-events-none"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Teks tersembunyi khusus screen reader demi aksesibilitas */}
                <span className="sr-only">
                  {banner.title} {banner.subtitle ? `— ${banner.subtitle}` : ''}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Titik Indikator di Bawah Banner (Tanpa Tombol Panah sesuai Spec) */}
      <div
        className="mt-3 sm:mt-4 flex items-center justify-center gap-2"
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
                  : 'w-2 h-2 bg-border hover:bg-text-secondary/40'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
