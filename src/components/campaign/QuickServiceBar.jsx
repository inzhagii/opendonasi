import { Link } from 'react-router-dom';
import { SERVICES } from '../../data/content';

/**
 * Akses Cepat Layanan (QuickServiceBar)
 * Spesifikasi OPENDONASI_SPEC:
 * - Judul: "Mau berbuat baik apa hari ini?"
 * - 5 Pilihan: Donasi, Zakat, Infaq, Sedekah, Wakaf.
 * - Tampilkan ikon dan label saja; tidak perlu kartu mini atau teks penjelas.
 * - Desktop: susunan horizontal seimbang.
 * - Mobile: carousel horizontal dengan sekitar tiga item terlihat di awal.
 */
export function QuickServiceBar({ className = '' }) {
  return (
    <section aria-labelledby="quick-service-title" className={`w-full ${className}`}>
      {/* Judul Akses Cepat */}
      <h2
        id="quick-service-title"
        className="text-lg md:text-xl font-bold text-text-primary text-center mb-6"
      >
        Mau berbuat baik apa hari ini?
      </h2>

      {/* Kontainer Layanan: Desktop grid/flex seimbang, Mobile scroll horizontal snap */}
      <div className="w-full">
        <div className="flex md:justify-center items-center gap-4 sm:gap-8 md:gap-12 overflow-x-auto snap-x scrollbar-none pb-2 px-2 md:px-0">
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              to={service.route}
              className="group flex flex-col items-center shrink-0 snap-start w-[76px] sm:w-[90px] md:w-[100px] text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 transition-transform hover:-translate-y-1"
            >
              {/* Lingkaran Ikon Layanan Bersih */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-soft/80 border border-primary/20 flex items-center justify-center p-3 group-hover:bg-primary/10 group-hover:border-primary/40 transition-colors shadow-sm">
                <img
                  src={service.icon}
                  alt=""
                  aria-hidden="true"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                />
              </div>

              {/* Label Nama Layanan Saja */}
              <span className="mt-2 text-xs sm:text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
