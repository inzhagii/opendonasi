// Komponen Kartu Program OpenDonasi (Card Biasa Desktop & Card Horizontal Mobile)
// Sesuai panduan visual referensi Gambar 1 (Card Biasa) & Gambar 2 (Card Horizontal).

import { Link } from 'react-router-dom';
import { formatRupiah } from '../../lib/formatters';
import timeIcon from '../../assets/icons/icons_kategori/time.svg';

/**
 * 1. Card Biasa (Desktop / Vertical):
 *    - Ukuran proporsional ~350px x 400px.
 *    - Wadah gambar: ~350px x 200px (rounded-t-2xl).
 *    - Wadah keterangan: ~350px x 200px dengan padding top 16px (pt-4), samping 24px (px-6), dan bottom 48px (pb-12).
 *    - Urutan: Organizer + Verified -> Judul Program -> Label Dana & Sisa Hari -> Nilai Nominal (Biru) & Sisa Hari (Biru) -> Progress Bar + Titik Dot Selalu Terlihat + Tooltip Persentase saat Hover.
 */
function VerticalCard({ campaign, targetRoute, calculatedPercentage }) {
  const {
    title,
    organizer,
    collectedAmount = 0,
    daysLeft,
    image,
    isImagePoster = false,
  } = campaign;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-slate-300 transition-colors w-full h-full flex flex-col">
      <Link
        to={targetRoute}
        className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {/* Wadah Banner: ~350px x 200px */}
        <div className="relative w-full h-[200px] overflow-hidden bg-slate-100 shrink-0">
          {image ? (
            <img
              src={image}
              alt={title || 'Program Donasi'}
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

        {/* Wadah Keterangan: ~200px, pt-4 (16px), px-6 (24px), pb-12 (48px) */}
        <div className="h-[200px] pt-4 px-6 pb-12 flex flex-col justify-between flex-1">
          {/* Bagian Atas: Organizer + Verified Badge, lalu Judul Program */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary truncate">
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
            </div>

            <h3
              title={title}
              className="mt-1.5 text-[15px] sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors"
            >
              {title || 'Program Kebaikan OpenDonasi'}
            </h3>
          </div>

          {/* Bagian Bawah: Label -> Nominal (Biru) & Sisa Hari (Biru) -> Progress Bar dengan Dot */}
          <div className="mt-2">
            {/* Label Row */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Dana terkumpul</span>
              <span>Sisa hari</span>
            </div>

            {/* Value Row (Nominal Biru & Sisa Hari Biru dengan Ikon Jam) */}
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <span className="text-base font-bold text-primary font-sans truncate">
                {formatRupiah(collectedAmount)}
              </span>

              <div className="flex items-center gap-1 text-sm font-semibold text-primary shrink-0">
                <img
                  src={timeIcon}
                  alt=""
                  aria-hidden="true"
                  className="w-3.5 h-3.5 object-contain"
                />
                <span>{typeof daysLeft === 'number' ? `${daysLeft} hari` : '∞'}</span>
              </div>
            </div>

            {/* Bilah Progres Bar dengan Titik Dot & Tooltip Persentase saat Hover */}
            <div className="relative mt-2.5">
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${calculatedPercentage}%` }}
                />
              </div>

              {/* Titik Dot Indikator (Selalu terlihat di ujung progres bar) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full shadow-xs z-10 pointer-events-none"
                style={{ left: `${Math.min(98, Math.max(2, calculatedPercentage))}%` }}
              />

              {/* Tooltip Persen saat Hover */}
              <div
                className="absolute bottom-full mb-1.5 -translate-x-1/2 z-20 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                style={{ left: `${Math.min(92, Math.max(8, calculatedPercentage))}%` }}
              >
                <div className="bg-[#EEF4FF] border border-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                  {calculatedPercentage}%
                </div>
                <div className="w-1.5 h-1.5 -mt-0.5 rotate-45 bg-[#EEF4FF] border-b border-r border-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * 2. Card Horizontal (Mobile):
 *    - Tata letak 50/50: 50% kiri wadah gambar (rounded-xl), 50% kanan keterangan.
 *    - Urutan: Judul Program (Besar & Tebal) -> Organizer + Verified -> Progress Bar + Titik Dot -> Nilai Nominal (Besar Biru) & Sisa Hari (Biru) -> Label Dana Terkumpul & Sisa Hari di bawahnya.
 */
function HorizontalCard({ campaign, targetRoute, calculatedPercentage }) {
  const {
    title,
    organizer,
    collectedAmount = 0,
    daysLeft,
    image,
    isImagePoster = false,
  } = campaign;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 shadow-xs hover:border-slate-300 transition-colors w-full">
      <Link
        to={targetRoute}
        className="grid grid-cols-2 items-center gap-3 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary h-full"
      >
        {/* 50% Kiri: Wadah Gambar Banner (Rasio 16:9, rounded-xl) */}
        <div className="relative overflow-hidden bg-slate-100 aspect-[16/9] w-full rounded-xl shrink-0">
          {image ? (
            <img
              src={image}
              alt={title || 'Program Donasi'}
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

        {/* 50% Kanan: Keterangan (Judul -> Organizer -> Progress Bar -> Angka Nominal & Sisa Hari -> Label di bawah) */}
        <div className="flex flex-col justify-between self-stretch min-w-0 py-0.5">
          {/* 1. Judul Program (Besar & Tebal) */}
          <div className="min-w-0">
            <h3
              title={title}
              className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors"
            >
              {title || 'Program Kebaikan OpenDonasi'}
            </h3>

            {/* 2. Nama Penggalang / Yayasan dengan Badge Terverifikasi */}
            <div className="mt-1 text-[11px] sm:text-xs text-text-secondary flex items-center gap-1 truncate">
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
            </div>
          </div>

          {/* 3. Bilah Progres Bar dengan Titik Dot di Tengah */}
          <div className="mt-2 sm:mt-2.5 mb-1.5 sm:mb-2">
            <div className="relative">
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${calculatedPercentage}%` }}
                />
              </div>

              {/* Titik Dot Indikator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-2 border-primary rounded-full shadow-xs z-10 pointer-events-none"
                style={{ left: `${Math.min(98, Math.max(2, calculatedPercentage))}%` }}
              />

              {/* Tooltip Persen saat Hover */}
              <div
                className="absolute bottom-full mb-1 -translate-x-1/2 z-20 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                style={{ left: `${Math.min(90, Math.max(10, calculatedPercentage))}%` }}
              >
                <div className="bg-[#EEF4FF] border border-primary/20 text-primary text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap">
                  {calculatedPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* 4. Nilai Nominal Dana Terkumpul (Besar) & Sisa Hari Berdampingan */}
          <div>
            <div className="flex items-center justify-between gap-1.5 leading-tight">
              {/* Angka Dana Terkumpul (Besar & Tebal) */}
              <span className="text-xs sm:text-sm font-bold text-primary font-sans truncate">
                {formatRupiah(collectedAmount)}
              </span>

              {/* Sisa Hari dengan Icon Jam (Biru) */}
              <div className="flex items-center gap-1 shrink-0 text-[11px] sm:text-xs font-bold text-primary">
                <img
                  src={timeIcon}
                  alt=""
                  aria-hidden="true"
                  className="w-3.5 h-3.5 object-contain shrink-0"
                />
                <span>{typeof daysLeft === 'number' ? `${daysLeft} hari` : '∞'}</span>
              </div>
            </div>

            {/* Label Dana Terkumpul & Sisa Hari di Bawah Nilai */}
            <div className="mt-0.5 flex items-center justify-between text-[10px] text-slate-400 leading-tight">
              <span>Dana terkumpul</span>
              <span>Sisa hari</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * Komponen CampaignCard Utama OpenDonasi
 * Mendukung variant:
 * - 'vertical': Card Biasa (Desktop)
 * - 'horizontal': Card Horizontal (Mobile)
 * - 'responsive': Card Horizontal pada mobile, Card Biasa pada desktop
 */
export function CampaignCard({ campaign, variant = 'vertical', className = '' }) {
  if (!campaign) return null;

  const { slug, collectedAmount = 0, targetAmount, progressPercentage } = campaign;
  const targetRoute = `/program/${slug}`;

  // Hitung persentase ketercapaian target
  const calculatedPercentage =
    typeof progressPercentage === 'number'
      ? progressPercentage
      : targetAmount
      ? Math.min(100, Math.round((collectedAmount / targetAmount) * 100))
      : 0;

  const isResponsive = variant === 'responsive';
  const isHorizontal = variant === 'horizontal';

  // Return sesuai variant yang diminta
  if (isHorizontal) {
    return (
      <div className={className}>
        <HorizontalCard
          campaign={campaign}
          targetRoute={targetRoute}
          calculatedPercentage={calculatedPercentage}
        />
      </div>
    );
  }

  if (isResponsive) {
    return (
      <div className={className}>
        {/* Mobile: Tampilkan Horizontal Card (Gambar 2) */}
        <div className="block md:hidden">
          <HorizontalCard
            campaign={campaign}
            targetRoute={targetRoute}
            calculatedPercentage={calculatedPercentage}
          />
        </div>
        {/* Desktop: Tampilkan Card Biasa (Gambar 1) */}
        <div className="hidden md:block h-full">
          <VerticalCard
            campaign={campaign}
            targetRoute={targetRoute}
            calculatedPercentage={calculatedPercentage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <VerticalCard
        campaign={campaign}
        targetRoute={targetRoute}
        calculatedPercentage={calculatedPercentage}
      />
    </div>
  );
}

export default CampaignCard;
