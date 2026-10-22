// Komponen Quick Action / Akses Cepat Layanan OpenDonasi pada Beranda.
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../../data/content';

/**
 * Akses Cepat Layanan (QuickServiceBar / Quick Action)
 * Sesuai referensi visual dan instruksi:
 * - Judul: "Mau berbuat baik apa hari ini"
 * - 5 Item: Donasi, Zakat, Infaq, Sedekah, Wakaf.
 * - Wadah berbentuk lingkaran (circle / rounded-full).
 * - Default: Wadah biru (#2E7DFA) dengan icon putih.
 * - Hover: Wadah putih kebiruan (#EEF4FF), border/stroke warna biru (#2E7DFA), icon warna biru (#2E7DFA), dan animasi micro-scale.
 * - Carousel horizontal yang dapat digeser memakai kursor mouse (drag-to-scroll) atau swipe touch, tanpa indikator dots/arrow.
 */
export function QuickServiceBar({ className = '' }) {
  const containerRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [isDragged, setIsDragged] = useState(false);

  // Mouse Drag-to-Scroll Handlers
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsMouseDown(true);
    setIsDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollStart(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setIsDragged(true);
    }
    containerRef.current.scrollLeft = scrollStart - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleClickCapture = (e) => {
    // Cegah navigasi jika interaksi adalah tarikan kursor/drag
    if (isDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section aria-labelledby="quick-service-title" className={`w-full ${className}`}>
      {/* Judul Akses Cepat */}
      <h2
        id="quick-service-title"
        className="text-xl sm:text-2xl md:text-[26px] font-bold text-slate-900 text-center tracking-tight mb-8"
      >
        Mau berbuat baik apa hari ini
      </h2>

      {/* Kontainer Carousel Horizontal: Draggable dengan kursor, tanpa indikator dots/arrows */}
      <div className="w-full relative">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center gap-6 sm:gap-10 md:gap-14 lg:gap-16 overflow-x-auto scrollbar-none py-3 px-4 sm:px-6 md:justify-center select-none ${
            isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              to={service.route}
              onClickCapture={handleClickCapture}
              className="group flex flex-col items-center shrink-0 w-20 sm:w-24 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-transform"
            >
              {/* Wadah Lingkaran: Default Biru & Icon Putih; Hover Putih Kebiruan & Stroke Biru & Icon Biru + Animasi */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary border-2 border-transparent flex items-center justify-center p-3.5 sm:p-4 shadow-sm group-hover:bg-[#EEF4FF] group-hover:border-primary group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ease-out">
                {/* Icon Mask: Otomatis Putih di Default & Biru saat Hover */}
                <div
                  className="w-7 h-7 sm:w-9 sm:h-9 bg-white group-hover:bg-primary transition-colors duration-200 pointer-events-none"
                  style={{
                    maskImage: `url(${service.icon})`,
                    WebkitMaskImage: `url(${service.icon})`,
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Label Nama Layanan */}
              <span className="mt-3 text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QuickServiceBar;
