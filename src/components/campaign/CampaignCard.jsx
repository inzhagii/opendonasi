import { Link } from 'react-router-dom';
import { formatRupiah, formatNumber } from '../../lib/formatters';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';

/**
 * Komponen CampaignCard Utama
 * - Rasio gambar wajib 16:9 di desktop dan mobile
 * - Poster bertulisan (isImagePoster: true) wajib object-fit: contain utuh
 * - Nominal dana dan progress bar selalu terlihat (tidak disembunyikan di hover)
 * - Menangani teks panjang dan data opsional secara aman
 */
export function CampaignCard({ campaign, variant = 'vertical', className = '' }) {
  if (!campaign) return null;

  const {
    slug,
    title,
    category,
    serviceType,
    organizer,
    collectedAmount = 0,
    targetAmount,
    progressPercentage,
    donorCount,
    daysLeft,
    image,
    isImagePoster = false,
  } = campaign;

  // Tentukan rute target: zakat mengarah ke /zakat/:slug, lainnya ke /program/:slug
  const targetRoute = serviceType === 'zakat' ? `/zakat/${slug}` : `/program/${slug}`;

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
      className={`group bg-white rounded-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <Link
        to={targetRoute}
        className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex ${
          isHorizontal
            ? 'flex-row'
            : isResponsive
            ? 'flex-row md:flex-col'
            : 'flex-col'
        } h-full`}
      >
        {/* Kontainer Gambar Rasio 16:9 Mutlak */}
        <div
          className={`relative overflow-hidden bg-background-soft shrink-0 aspect-[16/9] ${
            isHorizontal
              ? 'w-2/5 max-w-[160px] self-center m-2.5 rounded-lg'
              : isResponsive
              ? 'w-2/5 sm:w-[150px] md:w-full self-center md:self-auto m-2.5 md:m-0 rounded-lg md:rounded-none'
              : 'w-full'
          }`}
        >
          {image ? (
            <img
              src={image}
              alt={title || 'Program Donasi OpenDonasi'}
              loading="lazy"
              className={`w-full h-full transition-transform duration-300 group-hover:scale-[1.02] ${
                isImagePoster ? 'object-contain bg-slate-900/5' : 'object-cover'
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">
              OpenDonasi
            </div>
          )}

          {category && (
            <div className={`absolute top-2 left-2 ${isResponsive ? 'hidden sm:block md:block' : ''}`}>
              <Badge variant="primary" size="sm" className="bg-white/95 backdrop-blur-sm shadow-sm capitalize text-[10px] md:text-xs py-0.5 px-2">
                {category}
              </Badge>
            </div>
          )}
        </div>

        {/* Konten Kartu */}
        <div
          className={`flex flex-col flex-1 min-w-0 justify-between ${
            isHorizontal
              ? 'p-3'
              : isResponsive
              ? 'p-2.5 sm:p-3 md:p-5'
              : 'p-4 md:p-5'
          }`}
        >
          <div>
            {/* Kategori untuk mobile responsive jika disembunyikan di atas gambar */}
            {category && isResponsive && (
              <span className="inline-block sm:hidden text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">
                {category}
              </span>
            )}

            {/* Judul Program dengan Line Clamp 2 */}
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {title || 'Program Kebaikan OpenDonasi'}
            </h3>

            {/* Nama Penggalang Dana / Organisasi */}
            <p className="mt-0.5 md:mt-1 text-[11px] md:text-xs text-text-secondary truncate">
              {organizer?.name || 'Yayasan Mitra OpenDonasi'}
            </p>
          </div>

          <div>
            {/* Bilah Progres (Selalu Terlihat) */}
            <div className="mt-2 md:mt-3.5">
              <ProgressBar value={calculatedPercentage} size="sm" />
            </div>

            {/* Ringkasan Nominal & Sisa Waktu (Selalu Terlihat) */}
            <div className="mt-2 md:mt-3 pt-2 md:pt-2.5 border-t border-border/60 flex items-end justify-between text-[11px] md:text-xs">
              <div>
                <span className="block text-[10px] md:text-[11px] text-text-secondary">Terkumpul</span>
                <strong className="text-xs md:text-sm font-bold text-primary font-sans">
                  {formatRupiah(collectedAmount)}
                </strong>
              </div>

              <div className="text-right">
                {typeof daysLeft === 'number' ? (
                  <>
                    <span className="block text-[10px] md:text-[11px] text-text-secondary">Sisa Waktu</span>
                    <strong className="font-semibold text-text-primary text-[11px] md:text-xs">
                      {daysLeft > 0 ? `${daysLeft} hari` : 'Berakhir'}
                    </strong>
                  </>
                ) : targetAmount ? (
                  <>
                    <span className="block text-[10px] md:text-[11px] text-text-secondary">Target</span>
                    <span className="font-medium text-text-secondary text-[11px] md:text-xs">
                      {formatRupiah(targetAmount)}
                    </span>
                  </>
                ) : donorCount ? (
                  <>
                    <span className="block text-[10px] md:text-[11px] text-text-secondary">Donatur</span>
                    <strong className="font-semibold text-text-primary text-[11px] md:text-xs">
                      {formatNumber(donorCount)}
                    </strong>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
