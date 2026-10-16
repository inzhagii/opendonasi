import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PRAYERS } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { formatRupiah } from '../../lib/formatters';

/**
 * PrayerCarousel ("Dukungan & Doa Orang Baik")
 * Spesifikasi OPENDONASI_SPEC:
 * - Satu baris kartu dukungan (desktop dan mobile).
 * - Autoplay lambat, swipe/scroll manual, jeda saat interaksi.
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

  // Autoplay lambat geser carousel
  const scrollStep = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
      // Loop kembali ke awal jika sudah mencapai ujung
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: 240, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused) return;

    autoplayTimerRef.current = setInterval(scrollStep, 5000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPaused, scrollStep]);

  return (
    <section aria-labelledby="prayer-section-title" className={`w-full ${className}`}>
      {/* Header Seksi */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <SectionHeading
          title="Dukungan & Doa Orang Baik"
          subtitle="Untaian doa tulus dari para donatur untuk saudara-saudara kita yang membutuhkan."
        />
      </div>

      {/* Rel Carousel Satu Baris */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsPaused(false), 4000);
        }}
      >
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x scrollbar-none pb-4 pt-1 px-1 -mx-1"
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
                className="shrink-0 snap-start w-[280px] sm:w-[320px] md:w-[340px] bg-white rounded-card border border-border p-4 md:p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
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
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      prayer.hasAmined
                        ? 'bg-primary text-white shadow-sm'
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
