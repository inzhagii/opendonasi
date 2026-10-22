// Halaman detail program donasi OpenDonasi (/program/:slug).

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CAMPAIGNS, CAMPAIGN_UPDATES, CATEGORIES } from '../../data/campaigns';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { formatRupiah, formatNumber, formatDate } from '../../lib/formatters';
import timeIcon from '../../assets/icons/icons_kategori/time.svg';

export function ProgramDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Cari data kampanye berdasarkan parameter slug
  const campaign = useMemo(() => {
    return CAMPAIGNS.find((c) => c.slug === slug);
  }, [slug]);

  // Set document title untuk SEO dan navigasi browser
  useEffect(() => {
    if (campaign) {
      document.title = `${campaign.title} — OpenDonasi`;
    } else {
      document.title = 'Program Tidak Ditemukan — OpenDonasi';
    }
    window.scrollTo(0, 0);
  }, [campaign]);

  // Handler tombol kembali
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/program');
    }
  };

  // Handler fitur bagikan (Share)
  const handleShare = async () => {
    if (!campaign) return;

    const shareData = {
      title: campaign.title,
      text: campaign.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2500);
      });
    }
  };

  // Jika program tidak ditemukan
  if (!campaign) {
    return (
      <div className="w-full py-12 md:py-20">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-border p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-text-secondary mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-text-primary">Program Tidak Ditemukan</h1>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Program donasi yang Anda tuju tidak tersedia atau tautan telah berpindah.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/program" className="w-full sm:w-auto">
                <Button variant="primary" size="md" isFullWidth>
                  Lihat Semua Program
                </Button>
              </Link>
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="outline" size="md" isFullWidth>
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const {
    title,
    category,
    organizer,
    collectedAmount = 0,
    targetAmount = 0,
    progressPercentage,
    daysLeft,
    donorCount = 0,
    image,
    isImagePoster = false,
    description,
    id: campaignId,
  } = campaign;

  // Hitung persentase progress
  const calculatedPercentage =
    typeof progressPercentage === 'number'
      ? progressPercentage
      : targetAmount
      ? Math.min(100, Math.round((collectedAmount / targetAmount) * 100))
      : 0;

  // Nama kategori
  const categoryName =
    CATEGORIES.find((c) => c.id === category)?.name || category || 'Program Kebaikan';

  // Kabar terbaru program
  const updates = CAMPAIGN_UPDATES.filter((u) => u.campaignId === campaignId);

  // Program terkait (3 program lain dari kategori yang sama atau populer)
  const relatedCampaigns = CAMPAIGNS.filter((c) => c.id !== campaignId)
    .sort((a, b) => (b.category === category ? 1 : 0) - (a.category === category ? 1 : 0))
    .slice(0, 3);

  return (
    <div className="w-full py-6 md:py-10 pb-28 lg:pb-10">
      <Container>
        {/* Navigasi Atas: Tombol Kembali & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex items-center gap-1.5 text-xs text-text-secondary truncate">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/program" className="hover:text-primary transition-colors">
                  Program
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-text-primary font-medium truncate" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>

          <button
            type="button"
            onClick={handleBack}
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg border border-border hover:bg-slate-50"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </button>
        </div>

        {/* Layout Dua Kolom Desktop (2/3 Konten Utama, 1/3 Panel Donasi) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* SISI KIRI (KONTEN UTAMA): Kolom 1 s/d 8 di Desktop */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Wadah Gambar Utama (Rasio Wajib 16:9) */}
            <div className="relative overflow-hidden bg-slate-100 rounded-2xl border border-border aspect-[16/9] w-full shadow-xs">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className={`w-full h-full ${
                    isImagePoster ? 'object-contain bg-slate-900/5' : 'object-cover'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary text-sm">
                  OpenDonasi
                </div>
              )}
            </div>

            {/* 2. Informasi Judul, Kategori, dan Penggalang */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Badge variant="neutral" size="sm" className="capitalize">
                  {categoryName}
                </Badge>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-snug tracking-tight">
                {title}
              </h1>

              {/* Identitas Penggalang / Yayasan */}
              <div className="mt-3.5 flex items-center gap-2.5 text-xs sm:text-sm text-text-secondary pb-4 border-b border-border">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {organizer?.name ? organizer.name.charAt(0) : 'O'}
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-medium text-slate-800 truncate">
                    {organizer?.name || 'Yayasan Mitra OpenDonasi'}
                  </span>
                  <svg
                    className="w-4 h-4 text-primary shrink-0"
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
            </div>

            {/* RINGKASAN DANA KHUSUS MOBILE (Muncul sebelum deskripsi panjang pada layar < md) */}
            <div className="block lg:hidden bg-slate-50/80 rounded-2xl border border-border p-4 sm:p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                  <span>Dana Terkumpul</span>
                  <span>Sisa Waktu</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl font-bold text-primary">
                    {formatRupiah(collectedAmount)}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0">
                    <img src={timeIcon} alt="" aria-hidden="true" className="w-3.5 h-3.5 object-contain" />
                    <span>{typeof daysLeft === 'number' ? `${daysLeft} Hari` : '∞'}</span>
                  </div>
                </div>

                {/* Progress Bar Mobile */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2.5">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${calculatedPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-secondary mt-1.5">
                  <span>Target: {formatRupiah(targetAmount)}</span>
                  <span>{formatNumber(donorCount)} Donatur</span>
                </div>
              </div>

              {/* Tombol Donasi & Bagikan Mobile */}
              <div className="space-y-2 pt-1">
                <Link to={`/donasi/${campaign.slug}`} className="block w-full">
                  <Button variant="primary" size="lg" isFullWidth className="font-bold">
                    Donasi Sekarang
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  isFullWidth
                  onClick={handleShare}
                  className="relative"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>{shareFeedback ? 'Tautan Berhasil Disalin!' : 'Bagikan Program'}</span>
                </Button>
              </div>
            </div>

            {/* 3. Deskripsi Program (Tentang Program) */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tentang Program
              </h2>
              <div className="relative">
                <p
                  className={`text-sm sm:text-base text-slate-700 leading-relaxed ${
                    !isDescExpanded ? 'line-clamp-4' : ''
                  }`}
                >
                  {description}
                </p>

                {description && description.length > 150 && (
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded((prev) => !prev)}
                    className="mt-2 text-xs sm:text-sm font-semibold text-primary hover:underline focus:outline-none"
                  >
                    {isDescExpanded ? 'Tampilkan Lebih Sedikit' : 'Lihat Selengkapnya'}
                  </button>
                )}
              </div>
            </div>

            {/* 4. Kabar Terbaru / Pembaruan Program (Jika didukung data) */}
            {updates.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Kabar Terbaru ({updates.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {updates.map((upd) => (
                    <div
                      key={upd.id}
                      className="bg-white rounded-xl border border-border p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span className="font-semibold text-slate-900">{upd.title}</span>
                        <span>{formatDate(upd.date)}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {upd.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Transparansi & Data Program */}
            <div className="bg-slate-50 rounded-2xl border border-border p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
              <h3 className="font-bold text-slate-900">Transparansi Penyaluran</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-text-secondary">
                <div>
                  <span className="block text-[11px] text-slate-500">Target Donasi</span>
                  <strong className="text-slate-800">{formatRupiah(targetAmount)}</strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500">Terkumpul</span>
                  <strong className="text-primary">{formatRupiah(collectedAmount)}</strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500">Status Program</span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                    Aktif Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Program Kebaikan Terkait */}
            {relatedCampaigns.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Program Kebaikan Terkait
                  </h2>
                  <Link to="/program" className="text-xs font-semibold text-primary hover:underline">
                    Lihat Semua Katalog →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedCampaigns.map((rel) => (
                    <CampaignCard
                      key={rel.id}
                      campaign={rel}
                      variant="responsive"
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SISI KANAN (PANEL DONASI DESKTOP): Kolom 9 s/d 12 di Desktop */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Dana Terkumpul */}
              <div>
                <span className="text-xs text-text-secondary block mb-1">
                  Dana Terkumpul
                </span>
                <div className="text-2xl xl:text-3xl font-extrabold text-primary font-sans">
                  {formatRupiah(collectedAmount)}
                </div>

                {/* Progress Bar dengan Tooltip Persentase saat Hover */}
                <div className="relative mt-3 mb-4 group">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${calculatedPercentage}%` }}
                    />
                  </div>

                  {/* Titik Thumb Bulat saat hover desktop */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full shadow-xs z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `${calculatedPercentage}%` }}
                  />

                  {/* Tooltip Persen */}
                  <div
                    className="absolute top-full pt-1 -translate-x-1/2 z-20 hidden md:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `${Math.min(92, Math.max(8, calculatedPercentage))}%` }}
                  >
                    <div className="w-2 h-2 -mb-1 rotate-45 bg-[#EEF4FF] border-t border-l border-primary/20" />
                    <div className="bg-[#EEF4FF] border border-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                      {calculatedPercentage}%
                    </div>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-text-secondary block">Target Dana</span>
                    <strong className="text-slate-800 font-semibold">{formatRupiah(targetAmount)}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-text-secondary block">Sisa Waktu</span>
                    <div className="inline-flex items-center gap-1 font-bold text-slate-800">
                      <img src={timeIcon} alt="" aria-hidden="true" className="w-3.5 h-3.5 object-contain" />
                      <span>{typeof daysLeft === 'number' ? `${daysLeft} Hari` : '∞'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-text-secondary">
                  <span>Dukungan Terkumpul</span>
                  <strong className="text-slate-800 font-semibold">{formatNumber(donorCount)} Donatur</strong>
                </div>
              </div>

              {/* Tombol Aksi Desktop */}
              <div className="space-y-3 pt-2">
                <Link to={`/donasi/${campaign.slug}`} className="block w-full">
                  <Button variant="primary" size="lg" isFullWidth className="font-bold shadow-xs">
                    Donasi Sekarang
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="md"
                  isFullWidth
                  onClick={handleShare}
                  className="font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>{shareFeedback ? 'Tautan Berhasil Disalin!' : 'Bagikan Program'}</span>
                </Button>
              </div>

              {/* Garansi Keamanan & Transparansi Sederhana */}
              <div className="pt-2 text-center">
                <p className="text-[11px] text-text-secondary flex items-center justify-center gap-1">
                  <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Penyaluran resmi & terverifikasi OpenDonasi</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Action Bar Donasi Tetap Khusus Mobile (Menggantikan Bottom Nav Umum Sesuai OPENDONASI_SPEC) */}
      <div className="block lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto">
          <Link to={`/donasi/${campaign.slug}`} className="block w-full">
            <Button variant="primary" size="lg" isFullWidth className="font-bold shadow-xs">
              Donasi Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProgramDetailPage;
