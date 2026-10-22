// Halaman detail program donasi OpenDonasi (/program/:slug).

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CAMPAIGNS, CAMPAIGN_UPDATES, CATEGORIES } from '../../data/campaigns';
import { PRAYERS } from '../../data/content';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { formatRupiah, formatNumber, formatDate } from '../../lib/formatters';
import { useDonation } from '../../hooks/useDonation';
import timeIcon from '../../assets/icons/icons_kategori/time.svg';

// Format waktu relatif untuk daftar donatur
function getRelativeTime(timeInput) {
  if (!timeInput) return 'Baru saja';
  if (typeof timeInput === 'string' && (timeInput.includes('lalu') || timeInput === 'Baru saja')) {
    return timeInput;
  }
  try {
    const date = new Date(timeInput);
    if (isNaN(date.getTime())) return String(timeInput);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSec < 60) return `${Math.max(1, diffSec)} detik yang lalu`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} hari yang lalu`;
    return formatDate(timeInput);
  } catch {
    return String(timeInput);
  }
}

// Inisial avatar donatur (contoh: "Hamba Allah" -> "HA")
function getInitials(name) {
  if (!name) return 'HA';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ProgramDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { donations } = useDonation();

  // State ekspansi konten & modal
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isFundDetailExpanded, setIsFundDetailExpanded] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [isAllDonorsModalOpen, setIsAllDonorsModalOpen] = useState(false);
  const [expandedNewsId, setExpandedNewsId] = useState(null);
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

  // Daftar donatur yang terhubung dengan kampanye ini
  const campaignDonors = useMemo(() => {
    // 1. Ambil dari context donasi pengguna (sesi lokal / realtime dari alur donasi)
    const contextDonations = (donations || [])
      .filter((d) => d && (d.campaignSlug === slug || d.campaignId === campaign?.id))
      .map((d) => ({
        id: d.transactionId,
        name: d.isAnonymous ? 'Hamba Allah' : d.donorName || 'Donatur Demo',
        isAnonymous: Boolean(d.isAnonymous),
        amount: d.amount,
        createdAt: d.createdAt || d.date,
        timeAgo: getRelativeTime(d.createdAt || d.date),
      }));

    // 2. Ambil dari data mock percontohan proyek (PRAYERS)
    const mockDonationsFromPrayers = PRAYERS
      .filter((p) => p.campaignSlug === slug)
      .map((p) => ({
        id: p.id,
        name: p.donorName === 'Hamba Allah' ? 'Hamba Allah' : p.donorName,
        isAnonymous: p.donorName === 'Hamba Allah',
        amount: p.amount,
        createdAt: p.createdAt,
        timeAgo: p.createdAt || '1 jam yang lalu',
      }));

    // 3. Data contoh donatur untuk kampanye awal jika belum ada donasi
    const fallbackList = [];
    if (campaign?.id === 'camp-001' && mockDonationsFromPrayers.length === 0) {
      fallbackList.push(
        { id: 'don-01', name: 'Hamba Allah', isAnonymous: true, amount: 10000, timeAgo: '51 detik yang lalu' },
        { id: 'don-02', name: 'Hamba Allah', isAnonymous: true, amount: 5000, timeAgo: '53 detik yang lalu' },
        { id: 'don-03', name: 'Hamba Allah', isAnonymous: true, amount: 2000, timeAgo: '2 menit yang lalu' },
        { id: 'don-04', name: 'Hamba Allah', isAnonymous: true, amount: 10000, timeAgo: '3 menit yang lalu' }
      );
    } else if (campaign?.id === 'camp-001') {
      // Tambahkan variasi contoh baris donatur agar sesuai referensi
      fallbackList.push(
        { id: 'don-01', name: 'Hamba Allah', isAnonymous: true, amount: 10000, timeAgo: '51 detik yang lalu' },
        { id: 'don-02', name: 'Hamba Allah', isAnonymous: true, amount: 5000, timeAgo: '53 detik yang lalu' },
        { id: 'don-03', name: 'Hamba Allah', isAnonymous: true, amount: 2000, timeAgo: '2 menit yang lalu' },
        { id: 'don-04', name: 'Hamba Allah', isAnonymous: true, amount: 10000, timeAgo: '3 menit yang lalu' }
      );
    }

    // Gabungkan: donasi sesi pengguna berada paling atas
    const all = [...contextDonations, ...mockDonationsFromPrayers, ...fallbackList];
    const seen = new Set();
    return all.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [donations, slug, campaign]);

  // Fallback jika program tidak ditemukan
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
    <div className="w-full py-4 sm:py-6 md:py-10 pb-28 lg:pb-12 bg-white">
      <Container>
        {/* Navigasi Breadcrumb Desktop */}
        <nav aria-label="Breadcrumb" className="hidden lg:block mb-6">
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

        {/* Layout Utama: Desktop Dua Kolom, Mobile Satu Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* SISI KIRI (KONTEN UTAMA): Kolom 1 s/d 8 di Desktop */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. BAGIAN A — BANNER & RINGKASAN PROGRAM */}
            <div className="space-y-4">
              {/* Wadah Banner dengan Tombol Aksi Floating (Kembali & Bagikan) */}
              <div className="relative overflow-hidden bg-slate-100 rounded-2xl border border-border aspect-[16/9] w-full shadow-xs group">
                {/* Tombol Floating Kembali (Kiri Atas) */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-white/95 backdrop-blur-xs text-slate-800 hover:text-primary p-2 rounded-full shadow-sm border border-slate-200/80 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                  aria-label="Kembali"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Tombol Floating Bagikan (Kanan Atas Sesuai Screenshot 1) */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white/95 backdrop-blur-xs text-slate-800 hover:text-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  aria-label="Bagikan program"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>{shareFeedback ? 'Tautan Disalin!' : 'Bagikan'}</span>
                </button>

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

              {/* Judul & Deskripsi Singkat Langsung Di Bawah Banner (Sesuai Screenshot 1) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="neutral" size="sm" className="capitalize">
                    {categoryName}
                  </Badge>
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* RINGKASAN DANA KHUSUS MOBILE (Sesuai Screenshot 1) */}
              <div className="block lg:hidden space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <span>Dana tersedia</span>
                      <button
                        type="button"
                        onClick={() => setIsFundDetailExpanded(!isFundDetailExpanded)}
                        title="Informasi dana kampanye"
                        aria-label="Informasi dana kampanye"
                        className="text-slate-400 hover:text-primary transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-xl font-extrabold text-[#E87924] font-sans mt-0.5">
                      {formatRupiah(collectedAmount)}
                    </div>
                  </div>

                  {/* Kontrol Selengkapnya */}
                  <button
                    type="button"
                    onClick={() => setIsFundDetailExpanded(!isFundDetailExpanded)}
                    className="text-xs font-semibold text-slate-600 hover:text-primary transition-colors inline-flex items-center gap-1 cursor-pointer"
                    aria-expanded={isFundDetailExpanded}
                  >
                    <span>{isFundDetailExpanded ? 'Sembunyikan' : 'Selengkapnya'}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isFundDetailExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Progress Bar & Rincian Tambahan saat dibuka */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${calculatedPercentage}%` }}
                    />
                  </div>

                  {isFundDetailExpanded && (
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 grid grid-cols-2 gap-2 text-xs animate-in fade-in duration-150">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Target Donasi</span>
                        <strong className="text-slate-800 font-bold">{formatRupiah(targetAmount)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Sisa Waktu</span>
                        <div className="inline-flex items-center gap-1 font-bold text-slate-800">
                          <img src={timeIcon} alt="" aria-hidden="true" className="w-3.5 h-3.5 object-contain" />
                          <span>{typeof daysLeft === 'number' ? `${daysLeft} Hari` : '∞'}</span>
                        </div>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 block text-[11px]">Donatur Terkumpul</span>
                        <strong className="text-slate-800 font-bold">{formatNumber(donorCount)} Donatur</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tombol Utama Donasi Sekarang (In-Flow Mobile) */}
                <Link to={`/donasi/${campaign.slug}`} className="block w-full pt-1">
                  <Button
                    variant="primary"
                    size="lg"
                    isFullWidth
                    className="font-bold py-3 text-sm shadow-xs"
                  >
                    Donasi Sekarang
                  </Button>
                </Link>

                {/* Baris Rincian Penggunaan Dana */}
                <button
                  type="button"
                  onClick={() => setIsUsageModalOpen(true)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Rincian penggunaan dana</span>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* DIVIDER SECTION */}
            <div className="border-t-8 border-slate-100 -mx-4 sm:-mx-6 my-6" />

            {/* 2. BAGIAN B — INFORMASI MITRA (Sesuai Screenshot 1) */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Informasi Mitra
              </h2>

              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Logo Bulat Mitra Empat Warna */}
                  <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                    <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="18" fill="#F0FDF4" />
                      <path d="M14 16C14 13.7909 15.7909 12 18 12C20.2091 12 22 13.7909 22 16C22 18.2091 20.2091 20 18 20C15.7909 20 14 18.2091 14 16Z" fill="#0EA5E9" />
                      <path d="M22 16C22 13.7909 23.7909 12 26 12C28.2091 12 30 13.7909 30 16C30 18.2091 28.2091 20 26 20C23.7909 20 22 18.2091 22 16Z" fill="#F59E0B" />
                      <path d="M14 24C14 21.7909 15.7909 20 18 20C20.2091 20 22 21.7909 22 24C22 26.2091 20.2091 28 18 28C15.7909 28 14 26.2091 14 24Z" fill="#10B981" />
                      <path d="M22 24C22 21.7909 23.7909 20 26 20C28.2091 20 30 21.7909 30 24C30 26.2091 28.2091 28 26 28C23.7909 28 22 26.2091 22 24Z" fill="#3B82F6" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {organizer?.name || 'Yayasan Mitra OpenDonasi'}
                    </h3>
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-primary border border-blue-100">
                        <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Akun Terverifikasi</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* DIVIDER SECTION */}
            <div className="border-t-8 border-slate-100 -mx-4 sm:-mx-6 my-6" />

            {/* 3. BAGIAN C — TENTANG PROGRAM (Sesuai Screenshot 1) */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tentang Program
              </h2>

              <div className="relative space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  Assalamualaikum Warahmatullahi Wabarakatuh.
                </p>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Bismillahirrahmanirrahim.
                </p>
                <p
                  className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${
                    !isDescExpanded ? 'line-clamp-3' : ''
                  }`}
                >
                  {description} Mari sahabat salurkan bantuan terhebat Anda untuk mendukung program kebaikan ini agar manfaatnya terus berlanjut bagi mereka yang membutuhkan di berbagai pelosok.
                </p>

                {/* Kontrol Selengkapnya / Tampilkan Lebih Sedikit */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                    aria-expanded={isDescExpanded}
                  >
                    <span>{isDescExpanded ? 'Tampilkan Lebih Sedikit' : 'Selengkapnya'}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDescExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* DIVIDER SECTION */}
            <div className="border-t-8 border-slate-100 -mx-4 sm:-mx-6 my-6" />

            {/* 4. BAGIAN D — BERITA TERBARU (Sesuai Screenshot 2: Timeline Vertikal) */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Berita Terbaru
              </h2>

              {updates.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-500">
                  Belum ada berita terbaru untuk program ini.
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {updates.map((upd) => {
                    const isUpdExpanded = expandedNewsId === upd.id;
                    return (
                      <div key={upd.id} className="relative space-y-1.5">
                        {/* Titik Penanda Timeline (Orange Dot Sesuai Screenshot 2) */}
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#E87924] ring-4 ring-white" />

                        {/* Tanggal Publikasi */}
                        <div className="text-xs text-slate-400 font-medium">
                          {formatDate(upd.date)}
                        </div>

                        {/* Nominal Pencairan jika tersedia pada data */}
                        {upd.disbursementAmount && (
                          <div className="text-xs sm:text-sm font-bold text-slate-900">
                            Pencairan Dana {formatRupiah(upd.disbursementAmount)}
                          </div>
                        )}

                        {/* Judul Berita */}
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                          {upd.title}
                        </h3>

                        {/* Isi / Ringkasan Berita */}
                        <p
                          className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${
                            !isUpdExpanded ? 'line-clamp-3' : ''
                          }`}
                        >
                          {upd.content}
                        </p>

                        {/* Tombol Selengkapnya Berita */}
                        {upd.content && upd.content.length > 80 && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedNewsId(isUpdExpanded ? null : upd.id)
                              }
                              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                              aria-expanded={isUpdExpanded}
                            >
                              <span>{isUpdExpanded ? 'Tampilkan Lebih Sedikit' : 'Selengkapnya'}</span>
                              <svg
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isUpdExpanded ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DIVIDER SECTION */}
            <div className="border-t-8 border-slate-100 -mx-4 sm:-mx-6 my-6" />

            {/* 5. BAGIAN E — DONATUR (Pengganti Fundraiser Sesuai Screenshot 2) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Donatur
                </h2>

                {campaignDonors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAllDonorsModalOpen(true)}
                    className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Semua Donatur</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {campaignDonors.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-500 text-center">
                  Belum ada donatur untuk program ini. Jadilah donatur pertama!
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {campaignDonors.slice(0, 5).map((donor, idx) => (
                    <div key={donor.id || idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar Bulat dengan Inisial Sesuai Screenshot 2 */}
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(donor.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {donor.name}
                          </div>
                          <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                            {donor.timeAgo}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                          {formatRupiah(donor.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DIVIDER SECTION */}
            <div className="border-t-8 border-slate-100 -mx-4 sm:-mx-6 my-6" />

            {/* 6. Program Kebaikan Terkait */}
            {relatedCampaigns.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Program Kebaikan Terkait
                  </h2>
                  <Link to="/program" className="text-xs font-semibold text-primary hover:underline">
                    Lihat Semua Katalog →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* SISI KANAN (PANEL DONASI STICKY DESKTOP): Kolom 9 s/d 12 di Desktop */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Dana Terkumpul */}
              <div>
                <span className="text-xs text-text-secondary block mb-1">
                  Dana Terkumpul
                </span>
                <div className="text-2xl xl:text-3xl font-extrabold text-[#E87924] font-sans">
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

                  {/* Tooltip Persen Desktop */}
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
                    <span className="text-text-secondary block text-[11px]">Target Dana</span>
                    <strong className="text-slate-800 font-semibold">{formatRupiah(targetAmount)}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-text-secondary block text-[11px]">Sisa Waktu</span>
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
              <div className="space-y-2.5 pt-1">
                <Link to={`/donasi/${campaign.slug}`} className="block w-full">
                  <Button variant="primary" size="lg" isFullWidth className="font-bold shadow-xs py-3">
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

                {/* Baris Rincian Penggunaan Dana Desktop */}
                <button
                  type="button"
                  onClick={() => setIsUsageModalOpen(true)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Rincian penggunaan dana</span>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Garansi Keamanan & Transparansi Sederhana */}
              <div className="pt-2 text-center border-t border-slate-100">
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

      {/* 6. BAGIAN F — STICKY DONATION BAR KHUSUS MOBILE */}
      <div className="block lg:hidden fixed bottom-0 inset-x-0 bg-white/98 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto">
          <Link to={`/donasi/${campaign.slug}`} className="block w-full">
            <Button variant="primary" size="lg" isFullWidth className="font-bold shadow-xs py-3 text-sm">
              Donasi Sekarang
            </Button>
          </Link>
        </div>
      </div>

      {/* MODAL: RINCIAN PENGGUNAAN DANA */}
      {isUsageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Rincian Penggunaan Dana
              </h3>
              <button
                type="button"
                onClick={() => setIsUsageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm rounded-full"
                aria-label="Tutup rincian dana"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              OpenDonasi berkomitmen menjaga transparansi penyaluran setiap donasi. Alokasi dana untuk program <strong>{title}</strong> dikelola dengan estimasi proporsional:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Penyaluran Bantuan Penerima Manfaat</span>
                  <span className="text-slate-500 text-[11px]">Pengadaan sarana, material, dan bantuan langsung</span>
                </div>
                <strong className="text-primary font-bold text-sm">80%</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Operasional & Logistik Distribusi</span>
                  <span className="text-slate-500 text-[11px]">Bahan bakar, transportasi relawan, dan armada</span>
                </div>
                <strong className="text-slate-700 font-bold text-sm">15%</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Transparansi & Verifikasi Program</span>
                  <span className="text-slate-500 text-[11px]">Dokumentasi, audit internal, dan pelaporan</span>
                </div>
                <strong className="text-slate-700 font-bold text-sm">5%</strong>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                isFullWidth
                onClick={() => setIsUsageModalOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SEMUA DONATUR */}
      {isAllDonorsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Daftar Donatur
                </h3>
                <span className="text-xs text-text-secondary">
                  {campaignDonors.length} donatur tercatat
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAllDonorsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm rounded-full"
                aria-label="Tutup daftar donatur"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 flex-1 pr-1">
              {campaignDonors.map((donor, idx) => (
                <div key={donor.id || idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {getInitials(donor.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {donor.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {donor.timeAgo}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-800 shrink-0">
                    {formatRupiah(donor.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="primary"
                size="md"
                isFullWidth
                onClick={() => setIsAllDonorsModalOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramDetailPage;
