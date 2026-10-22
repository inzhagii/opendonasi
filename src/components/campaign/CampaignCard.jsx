import { Link } from 'react-router-dom';
import { formatRupiah } from '../../lib/formatters';
import timeIcon from '../../assets/icons/icons_kategori/time.svg';

/**
 * Komponen CampaignCard Utama
 * - Rasio gambar wajib 16:9 di desktop dan mobile
 * - Tata letak kartu horizontal mobile tepat 50/50 (gambar dan keterangan) tanpa efek hover
 * - Sisa hari dilengkapi ikon time.svg
 * - Saat kursor diarahkan ke card (desktop), bilah indikator memunculkan titik thumb dan tooltip persentase
 */
export function CampaignCard({ campaign, variant = 'vertical', className = '' }) {
  if (!campaign) return null;

  const {
    slug,
    title,
    organizer,
    collectedAmount = 0,
    targetAmount,
    progressPercentage,
    daysLeft,
    image,
    isImagePoster = false,
  } = campaign;

  // Rute target konsisten ke detail program: /program/:slug
  const targetRoute = `/program/${slug}`;

  // Hitung persentase jika tidak disediakan
  const calculatedPercentage =
    typeof progressPercentage === 'number'
      ? progressPercentage
      : targetAmount
      ? Math.min(100, Math.round((collectedAmount / targetAmount) * 100))
      : 0;

  const isResponsive = variant === 'responsive';
  const isHorizontal = variant === 'horizontal';

  return (
    <article
      className={`group bg-white rounded-2xl border border-border overflow-hidden md:transition-colors md:hover:border-slate-300 ${className}`}
    >
      <Link
        to={targetRoute}
        className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isHorizontal
            ? 'grid grid-cols-2 items-center p-2.5 sm:p-3 gap-3'
            : isResponsive
            ? 'grid grid-cols-2 items-center p-2.5 sm:p-3 gap-3 md:flex md:flex-col md:p-0 md:gap-0'
            : 'flex flex-col'
        } h-full`}
      >
        {/* Kontainer Gambar Rasio 16:9 (Tepat 50% pada mobile) */}
        <div
          className={`relative overflow-hidden bg-slate-100 aspect-[16/9] w-full ${
            isHorizontal
              ? 'rounded-xl'
              : isResponsive
              ? 'rounded-xl md:rounded-none md:rounded-t-2xl'
              : 'rounded-t-2xl'
          }`}
        >
          {image ? (
            <img
              src={image}
              alt={title || 'Program Donasi OpenDonasi'}
              loading="lazy"
              className={`w-full h-full ${
                isImagePoster ? 'object-contain bg-slate-900/5' : 'object-cover'
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">
              OpenDonasi
            </div>
          )}
        </div>

        {/* Konten Informasi Kartu (Tepat 50% pada mobile) */}
        <div
          className={`flex flex-col justify-between self-stretch min-w-0 ${
            isHorizontal
              ? 'py-0.5'
              : isResponsive
              ? 'py-0.5 md:p-4'
              : 'p-4'
          }`}
        >
          {/* Bagian Atas: Judul Donasi lalu Nama Yayasan */}
          <div className="min-w-0">
            {/* 1. Judul Donasi */}
            <h3
              title={title}
              className="text-xs sm:text-sm md:text-base font-bold text-slate-900 line-clamp-2 leading-snug md:group-hover:text-primary md:transition-colors"
            >
              {title || 'Program Kebaikan OpenDonasi'}
            </h3>

            {/* 2. Nama Yayasan / Penggalang Dana dengan Badge Terverifikasi */}
            <p className="mt-1 text-[11px] sm:text-xs text-text-secondary flex items-center gap-1 truncate">
              <span className="truncate">{organizer?.name || 'Yayasan Mitra OpenDonasi'}</span>
              <svg
                className="w-3.5 h-3.5 text-primary shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="Terverifikasi"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </p>
          </div>

          {/* Bagian Bawah: Nominal & Sisa Hari (di atas bar) lalu Bilah Progres Bar */}
          <div className="mt-2.5">
            {/* Label: Dana Terkumpul & Sisa Hari */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-text-secondary leading-tight">
              <span>Dana Terkumpul</span>
              <span>Sisa Hari</span>
            </div>

            {/* Nilai: Nominal Terkumpul (Biru) & Sisa Hari dengan Icon time.svg */}
            <div className="mt-0.5 flex items-center justify-between gap-2 leading-tight">
              <span className="text-xs sm:text-sm font-bold text-primary font-sans truncate">
                {formatRupiah(collectedAmount)}
              </span>

              <div className="flex items-center gap-1 shrink-0 text-xs sm:text-sm font-bold text-slate-800">
                <img
                  src={timeIcon}
                  alt=""
                  aria-hidden="true"
                  className="w-3.5 h-3.5 object-contain shrink-0"
                />
                <span>{typeof daysLeft === 'number' ? `${daysLeft} Hari` : '∞'}</span>
              </div>
            </div>

            {/* Bilah Progres Bar dengan Titik Thumb & Tooltip Persentase saat Hover */}
            <div className="relative mt-2 mb-1 md:mb-5">
              {/* Track Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${calculatedPercentage}%` }}
                />
              </div>

              {/* Titik Thumb Bulat (Hanya desktop saat kursor hover) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-2 border-primary rounded-full shadow-xs z-10 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                style={{ left: `${calculatedPercentage}%` }}
              />

              {/* Tooltip Persen (Hanya desktop saat kursor hover, tepat di bawah titik indikator) */}
              <div
                className="absolute top-full pt-1 -translate-x-1/2 z-20 hidden md:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                style={{ left: `${Math.min(92, Math.max(8, calculatedPercentage))}%` }}
              >
                <div className="w-2 h-2 -mb-1 rotate-45 bg-[#EEF4FF] border-t border-l border-primary/20" />
                <div className="bg-[#EEF4FF] border border-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                  {calculatedPercentage}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
