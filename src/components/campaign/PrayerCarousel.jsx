// Komponen PrayerCarousel ("Dukungan & Doa Orang Baik") OpenDonasi
// Bergerak otomatis ke arah kiri secara tenang dan mulus (continuous CSS marquee GPU-accelerated),
// dapat digeser secara manual (mouse drag & touch swipe), berhenti saat kursor diarahkan ke kartu (hover pause),
// dan kartu dapat diklik untuk membuka modal popover doa lengkap.

import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PRAYERS } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { formatRupiah } from '../../lib/formatters';

const DURATION_SECONDS = 55; // Kecepatan santai dan tenang

export function PrayerCarousel({ className = '' }) {
  const location = useLocation();

  // State doa donatur & status aamiin lokal
  const [prayers, setPrayers] = useState(() =>
    PRAYERS.map((p) => ({
      ...p,
      hasAmined: false,
      currentAminCount: p.aminCount || 0,
    }))
  );

  // State Popover / Modal detail doa
  const [selectedPrayer, setSelectedPrayer] = useState(null);

  const trackRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startTranslateXRef = useRef(0);
  const currentTranslateXRef = useRef(0);

  // Helper untuk membaca translateX saat ini dari computed style
  const getTranslateX = (el) => {
    if (!el) return 0;
    const style = window.getComputedStyle(el);
    const transform = style.transform || style.webkitTransform;
    if (!transform || transform === 'none') return 0;
    if (window.DOMMatrixReadOnly) {
      try {
        return new DOMMatrixReadOnly(transform).m41;
      } catch (e) {
        // fallback
      }
    }
    const match = transform.match(/matrix.*\((.+)\)/);
    if (match) {
      const values = match[1].split(',');
      return parseFloat(values[4]) || 0;
    }
    return 0;
  };

  // Normalisasi posisi X ke dalam rentang [-halfWidth, 0] untuk infinite loop
  const normalizeTranslateX = (x, halfWidth) => {
    if (halfWidth <= 0) return 0;
    let wrapped = x % halfWidth;
    if (wrapped > 0) wrapped -= halfWidth;
    return wrapped;
  };

  // Handler Pointer Down (Mouse Click & Touch Drag)
  const handlePointerDown = (e) => {
    // Hanya respon tombol utama mouse atau touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    // Abaikan jika klik berasal dari tombol Aamiin atau tautan
    if (e.target.closest('button') || e.target.closest('a')) return;

    const track = trackRef.current;
    if (!track) return;

    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.pageX;

    const currentX = getTranslateX(track);
    startTranslateXRef.current = currentX;
    currentTranslateXRef.current = currentX;

    // Bekukan posisi visual saat user mulai menyentuh/menggeser
    track.style.animation = 'none';
    track.style.transform = `translateX(${currentX}px)`;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // safe fallback
    }
  };

  // Handler Pointer Move
  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current || !trackRef.current) return;
    const deltaX = e.pageX - startXRef.current;
    if (Math.abs(deltaX) > 4) {
      isDraggingRef.current = true;
    }

    const track = trackRef.current;
    const halfWidth = track.scrollWidth / 2;
    const rawX = startTranslateXRef.current + deltaX;
    const normalizedX = normalizeTranslateX(rawX, halfWidth);
    currentTranslateXRef.current = normalizedX;
    track.style.transform = `translateX(${normalizedX}px)`;
  };

  // Handler Pointer Up / Cancel
  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (err) {}

    const track = trackRef.current;
    if (!track) return;

    if (isDraggingRef.current) {
      // Lanjutkan animasi otomatis ke kiri dari posisi terakhir digeser
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        const progress = Math.abs(currentTranslateXRef.current) / halfWidth;
        const delaySeconds = -(progress * DURATION_SECONDS);

        track.style.transform = '';
        track.style.animation = 'none';
        void track.offsetWidth; // Force reflow
        track.style.animation = `marqueeLeft ${DURATION_SECONDS}s linear infinite`;
        track.style.animationDelay = `${delaySeconds}s`;
      }

      // Beri sedikit jeda agar klik kartu tidak terbuka saat melepas drag
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 100);
    } else {
      // Hanya klik cepat, kembalikan animasi CSS normal
      track.style.animation = '';
      track.style.transform = '';
      track.style.animationDelay = '';
    }
  };

  // Toggle interaksi lokal Aamiin
  const handleToggleAmin = useCallback((prayerId, e) => {
    if (e) {
      e.stopPropagation();
    }
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

    setSelectedPrayer((current) => {
      if (current && current.id === prayerId) {
        const newHasAmined = !current.hasAmined;
        return {
          ...current,
          hasAmined: newHasAmined,
          currentAminCount: newHasAmined
            ? current.currentAminCount + 1
            : Math.max(0, current.currentAminCount - 1),
        };
      }
      return current;
    });
  }, []);

  // Tutup Popover dengan Tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPrayer(null);
      }
    };
    if (selectedPrayer) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPrayer]);

  // Gandakan array prayers (2 set) untuk continuous seamless marquee
  const duplicatedPrayers = [...prayers, ...prayers];

  return (
    <section aria-labelledby="prayer-section-title" className={`w-full overflow-hidden ${className}`}>
      {/* Header Seksi Terpusat */}
      <div className="mb-6">
        <SectionHeading
          title="Dukungan & Doa Orang Baik"
          subtitle="Untaian doa tulus dari para donatur untuk saudara-saudara kita yang membutuhkan. Geser manual atau arahkan kursor untuk menjeda, klik kartu untuk membaca doa lengkap."
          align="center"
        />
      </div>

      {/* Rel Kontainer Bergerak Otomatis ke Kiri + Bisa Digeser Manual */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Soft edge blur gradient kiri & kanan agar transisi visual sangat mulus */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDragStart={(e) => e.preventDefault()}
          style={{
            animationPlayState: selectedPrayer ? 'paused' : undefined,
          }}
          className="flex w-max gap-4 sm:gap-6 animate-marquee-left select-none py-2 cursor-grab active:cursor-grabbing touch-pan-x"
        >
          {duplicatedPrayers.map((prayer, index) => {
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
                key={`${prayer.id}-${index}`}
                onClick={() => {
                  if (isDraggingRef.current) return;
                  setSelectedPrayer(prayer);
                }}
                className="shrink-0 w-[280px] sm:w-[320px] md:w-[340px] bg-white rounded-card border border-border p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
              >
                <div>
                  {/* Header Donatur: Avatar Bulat + Nama + Waktu */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs sm:text-sm font-semibold text-text-primary truncate block group-hover:text-primary transition-colors">
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
                    <span className="font-medium text-text-primary line-clamp-1 inline">
                      {prayer.campaignTitle}
                    </span>
                  </div>

                  {/* Pesan Donatur (HANYA TAMPIL JIKA ADA) */}
                  {prayer.message ? (
                    <blockquote className="mt-3 text-xs sm:text-sm text-text-secondary italic bg-slate-50 border-l-2 border-primary/40 p-2.5 rounded-r-lg leading-relaxed line-clamp-3">
                      "{prayer.message}"
                    </blockquote>
                  ) : null}
                </div>

                {/* Tombol Aamiin Lokal & Tombol Baca Lengkap */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-text-secondary">
                    {prayer.currentAminCount} aamiin
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleToggleAmin(prayer.id, e)}
                      aria-label={`Aminkan doa ini. Saat ini ${prayer.currentAminCount} aamiin.`}
                      aria-pressed={prayer.hasAmined}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer active:scale-95 ${
                        prayer.hasAmined
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-primary-soft text-primary hover:bg-primary/10 border border-primary/20'
                      }`}
                    >
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
              </div>
            );
          })}
        </div>
      </div>

      {/* POPOVER / MODAL DETAIL DOA DONATUR */}
      {selectedPrayer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="prayer-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedPrayer(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Popover: Avatar + Nama Donatur + Tombol Close */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {selectedPrayer.donorName
                    ? selectedPrayer.donorName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'HA'}
                </div>
                <div>
                  <h3 id="prayer-dialog-title" className="text-sm sm:text-base font-bold text-slate-900">
                    {selectedPrayer.donorName || 'Hamba Allah'}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span>{selectedPrayer.createdAt}</span>
                    {selectedPrayer.amount ? (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-primary">
                          Berdonasi {formatRupiah(selectedPrayer.amount)}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Tombol Tutup X */}
              <button
                type="button"
                onClick={() => setSelectedPrayer(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup detail doa"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Target Program Donasi */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
              <span className="text-slate-500 block text-[11px] font-semibold mb-0.5">
                Mendukung Program Kebaikan:
              </span>
              <Link
                to={`/program/${selectedPrayer.campaignSlug}`}
                state={{ from: location.pathname + location.search }}
                className="font-bold text-primary hover:underline line-clamp-1"
                onClick={() => setSelectedPrayer(null)}
              >
                {selectedPrayer.campaignTitle}
              </Link>
            </div>

            {/* Isi Doa / Pesan Lengkap */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Untaian Doa & Harapan:
              </span>
              <blockquote className="text-sm sm:text-base text-slate-700 italic bg-slate-50 border-l-4 border-primary p-4 rounded-r-2xl leading-relaxed">
                "{selectedPrayer.message || 'Semoga bantuan ini bermanfaat dan membawa berkah bagi sesama. Aamiin ya Rabbal alamin.'}"
              </blockquote>
            </div>

            {/* Footer Popover: Aamiin Count & Action Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                <strong className="text-slate-800">{selectedPrayer.currentAminCount}</strong> orang telah mengaminkan doa ini
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleToggleAmin(selectedPrayer.id, e)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPrayer.hasAmined
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-blue-50 text-primary border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${selectedPrayer.hasAmined ? 'text-white' : 'text-primary'}`}
                    fill={selectedPrayer.hasAmined ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{selectedPrayer.hasAmined ? 'Telah Diaminkan' : 'Aamiin-kan Doa'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPrayer(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PrayerCarousel;
