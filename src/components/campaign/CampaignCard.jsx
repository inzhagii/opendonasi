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
export function CampaignCard({ campaign, className = '' }) {
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

  return (
    <article
      className={`group flex flex-col bg-white rounded-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <Link to={targetRoute} className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
        {/* Kontainer Gambar Rasio 16:9 Mutlak */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-background-soft">
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
            <div className="absolute top-2.5 left-2.5">
              <Badge variant="primary" size="sm" className="bg-white/95 backdrop-blur-sm shadow-sm capitalize">
                {category}
              </Badge>
            </div>
          )}
        </div>

        {/* Konten Kartu */}
        <div className="flex flex-col flex-1 p-4 md:p-5">
          {/* Judul Program dengan Line Clamp 2 */}
          <h3 className="text-sm md:text-base font-semibold text-text-primary line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5rem]">
            {title || 'Program Kebaikan OpenDonasi'}
          </h3>

          {/* Nama Penggalang Dana / Organisasi */}
          <p className="mt-1 text-xs text-text-secondary truncate">
            {organizer?.name || 'Yayasan Mitra OpenDonasi'}
          </p>

          {/* Bilah Progres (Selalu Terlihat) */}
          <div className="mt-3.5">
            <ProgressBar value={calculatedPercentage} size="sm" />
          </div>

          {/* Ringkasan Nominal & Sisa Waktu (Selalu Terlihat) */}
          <div className="mt-3 pt-2.5 border-t border-border/60 flex items-end justify-between text-xs">
            <div>
              <span className="block text-[11px] text-text-secondary">Terkumpul</span>
              <strong className="text-sm font-bold text-primary font-sans">
                {formatRupiah(collectedAmount)}
              </strong>
            </div>

            <div className="text-right">
              {typeof daysLeft === 'number' ? (
                <>
                  <span className="block text-[11px] text-text-secondary">Sisa Waktu</span>
                  <strong className="font-semibold text-text-primary">
                    {daysLeft > 0 ? `${daysLeft} hari` : 'Berakhir'}
                  </strong>
                </>
              ) : targetAmount ? (
                <>
                  <span className="block text-[11px] text-text-secondary">Target</span>
                  <span className="font-medium text-text-secondary">
                    {formatRupiah(targetAmount)}
                  </span>
                </>
              ) : donorCount ? (
                <>
                  <span className="block text-[11px] text-text-secondary">Donatur</span>
                  <strong className="font-semibold text-text-primary">
                    {formatNumber(donorCount)}
                  </strong>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
