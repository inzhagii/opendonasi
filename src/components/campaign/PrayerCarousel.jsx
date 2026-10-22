import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PRAYERS } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { formatRupiah } from '../../lib/formatters';

/**
 * PrayerCarousel ("Dukungan & Doa Orang Baik")
 * Spesifikasi OPENDONASI_SPEC:
 * - Satu baris kartu dukungan (desktop dan mobile).
 * - Autoplay lambat, swipe/scroll manual dengan kursor (drag to scroll) atau touch.
 * - Dilengkapi tombol navigasi panah di desktop untuk geser manual.
 * - Tombol Aamiin bekerja seperti like: klik 1x menambah (+1), klik lagi membatalkan (-1).
 * - Hanya disimpan di state lokal prototype.
 * - Pesan donatur hanya ditampilkan bila ada (tidak mengarang pesan palsu bila null).
 */
export function PrayerCarousel({ className = '' }) {
  const [prayers, setPrayers] = useState(() =>
    PRAYERS.map((p) => ({
      ...p,
      hasAmined: false,
      currentAminCount: p.aminCount || 0,
    }))
  );

  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayTimerRef = useRef(null);

  // State & Ref untuk Geser Manual dengan Kursor (Drag to Scroll)
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [isDragged, setIsDragged] = useState(false);

  // Toggle interaksi lokal Aamiin
  const handleToggleAmin = (prayerId) => {
    setPrayers((prev) =>
      prev.map((item) => {
        if (item.id === prayerId) {
          const newHasAmined = !item.hasAmined;
          return {
            ...item,
            hasAmined: newHasAmined,
            currentAminCount: newHasAmined
              ? item.currentAminCount + 1
              : Math.max(0, item.currentAminCount - 1),
          };
        }
        return item;
      })
    );
  };

  // Navigasi Panah Manual (Geser Kiri & Kanan)
  const handleScrollLeft = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: 320, behavior: 'smooth' });
  };

  // Autoplay lambat geser carousel secara berkala
  const scrollStep = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || isMouseDown || isPaused) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= maxScroll - 24) {
      // Loop kembali ke awal jika sudah mencapai ujung
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: 340, behavior: 'smooth' });
    }
  }, [isMouseDown, isPaused]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isMouseDown) return;

    autoplayTimerRef.current = setInterval(scrollStep, 4500);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isMouseDown, scrollStep]);

  // Handler Geser Manual dengan Mouse Kursor (Drag-to-Scroll)
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !scrollContainerRef.current) return;
    setIsMouseDown(true);
    setIsPaused(true);
    isDraggingRef.current = false;
    setIsDragged(false);
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.35; // Pengali sensitivitas geser kursor
    if (Math.abs(walk) > 5) {
      isDraggingRef.current = true;
      setIsDragged(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => {
      isDraggingRef.current = false;
      setIsDragged(false);
      setIsPaused(false);
    }, 60);
  };

  const handleMouseLeave = () => {
    if (isMouseDown) {
      setIsMouseDown(false);
      isDraggingRef.current = false;
      setIsDragged(false);
    }
    setIsPaused(false);
  };

  // Cegah trigger klik link atau tombol aamiin saat sengaja menggeser kursor
  const handleClickCapture = (e) => {
    if (isDraggingRef.current || isDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section aria-labelledby="prayer-section-title" className={`w-full ${className}`}>
      {/* Header Seksi Terpusat */}
      <div className="mb-6">
        <SectionHeading
          title="Dukungan & Doa Orang Baik"
          subtitle="Untaian doa tulus dari para donatur untuk saudara-saudara kita yang membutuhkan."
          align="center"
        />
      </div>

      {/* Rel Carousel Satu Baris dengan Dukungan Geser Manual Kursor & Navigasi Panah Sisi */}
      <div
        className="relative group/carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Tombol Arrow Kiri (Prev) */}
        <button
          type="button"
          onClick={handleScrollLeft}
          aria-label="Geser doa ke kiri"
          className="hidden sm:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white border border-slate-200/90 hover:border-primary hover:text-primary text-slate-700 shadow-md items-center justify-center transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Tombol Arrow Kanan (Next) */}
        <button
          type="button"
          onClick={handleScrollRight}
          aria-label="Geser doa ke kanan"
          className="hidden sm:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white border border-slate-200/90 hover:border-primary hover:text-primary text-slate-700 shadow-md items-center justify-center transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClickCapture={handleClickCapture}
          className={`flex gap-4 sm:gap-6 overflow-x-auto snap-x scrollbar-none pb-4 pt-1 px-1 -mx-1 select-none ${
            isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {prayers.map((prayer) => {
            const initials = prayer.donorName
              ? prayer.donorName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'HA';

            return (
              <div
                key={prayer.id}
                className="shrink-0 snap-start w-[280px] sm:w-[320px] md:w-[340px] bg-white rounded-card border border-border p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Header Donatur: Avatar Bulat + Nama + Waktu */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs sm:text-sm font-semibold text-text-primary truncate block">
                          {prayer.donorName || 'Hamba Allah'}
                        </strong>
                      </div>
                      <span className="text-[11px] text-text-secondary block">
                        {prayer.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Nominal Donasi (Jika Ada) */}
                  {prayer.amount && (
                    <div className="mt-2 text-xs font-semibold text-primary">
                      Berdonasi {formatRupiah(prayer.amount)}
                    </div>
                  )}

                  {/* Program yang Didukung */}
                  <div className="mt-2 text-xs text-text-secondary">
                    Untuk:{' '}
                    <Link
                      to={`/program/${prayer.campaignSlug}`}
                      className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-1 inline"
                    >
                      {prayer.campaignTitle}
                    </Link>
                  </div>

                  {/* Pesan Donatur (HANYA TAMPIL JIKA ADA) */}
                  {prayer.message ? (
                    <blockquote className="mt-3 text-xs sm:text-sm text-text-secondary italic bg-slate-50 border-l-2 border-primary/40 p-2.5 rounded-r-lg leading-relaxed">
                      "{prayer.message}"
                    </blockquote>
                  ) : null}
                </div>

                {/* Tombol Aamiin Lokal */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-text-secondary">
                    {prayer.currentAminCount} orang mengaminkan
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleAmin(prayer.id)}
                    aria-label={`Aminkan doa ini. Saat ini ${prayer.currentAminCount} aamiin.`}
                    aria-pressed={prayer.hasAmined}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer active:scale-95 ${
                      prayer.hasAmined
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-primary-soft text-primary hover:bg-primary/10 border border-primary/20'
                    }`}
                  >
                    {/* Ikon Telapak Tangan / Doa */}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${
                        prayer.hasAmined ? 'scale-110 text-white' : 'text-primary'
                      }`}
                      fill={prayer.hasAmined ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{prayer.hasAmined ? 'Diaminkan' : 'Aamiin'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PrayerCarousel;
