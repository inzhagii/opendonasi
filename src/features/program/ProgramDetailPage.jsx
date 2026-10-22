// Halaman detail program donasi OpenDonasi (/program/:slug).

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { CAMPAIGNS, CAMPAIGN_UPDATES } from '../../data/campaigns';
import { getOrganizerSlug } from '../../data/organizers';
import { getMergedDonors } from '../../data/campaignDonors';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { formatRupiah, formatNumber, formatDate } from '../../lib/formatters';
import { useDonation } from '../../hooks/useDonation';
import timeIcon from '../../assets/icons/icons_kategori/time.svg';



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
  const location = useLocation();
  const { donations } = useDonation();

  // State ekspansi konten & modal
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isFundDetailExpanded, setIsFundDetailExpanded] = useState(false);
  const [isDesktopDetailExpanded, setIsDesktopDetailExpanded] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [isAllDonorsModalOpen, setIsAllDonorsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [expandedNewsId, setExpandedNewsId] = useState(null);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Helper label tombol donasi/zakat/infaq/sedekah/wakaf
  const getCtaButtonText = (camp) => {
    const type = (camp?.serviceType || camp?.category || '').toLowerCase();
    if (type === 'zakat') return 'Zakat Sekarang';
    if (type === 'infaq') return 'Infaq Sekarang';
    if (type === 'sedekah') return 'Sedekah Sekarang';
    if (type === 'wakaf') return 'Wakaf Sekarang';
    return 'Donasi Sekarang';
  };

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

  // Handler fitur bagikan (Membuka Share Modal)
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2500);
      });
    }
  };

  // Daftar donatur yang terhubung dengan kampanye ini (mock 10+ data lengkap)
  const campaignDonors = useMemo(() => {
    return getMergedDonors(slug, donations);
  }, [slug, donations]);

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



  // Kabar terbaru program
  const updates = CAMPAIGN_UPDATES.filter((u) => u.campaignId === campaignId);

  // Program terkait (3 program lain dari kategori yang sama atau populer)
  const relatedCampaigns = CAMPAIGNS.filter((c) => c.id !== campaignId)
    .sort((a, b) => (b.category === category ? 1 : 0) - (a.category === category ? 1 : 0))
    .slice(0, 3);

  return (
    <div className="w-full py-4 sm:py-6 md:py-10 pb-28 lg:pb-12 bg-white">
      <Container>
        {/* Tombol Kembali Bersih */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </button>
        </div>

        {/* Layout Utama: Desktop Dua Kolom, Mobile Satu Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* SISI KIRI (KONTEN UTAMA): Kolom 1 s/d 8 di Desktop */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. BAGIAN A — BANNER & RINGKASAN PROGRAM */}
            <div className="space-y-4">
              {/* Wadah Banner Bersih Tanpa Tombol Floating */}
              <div className="relative overflow-hidden bg-slate-100 rounded-2xl border border-border aspect-[16/9] w-full shadow-xs">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-secondary text-sm">
                    OpenDonasi
                  </div>
                )}
              </div>

              {/* Judul & Deskripsi Khusus Mobile (Pada Desktop, Judul tampil di Card Kanan) */}
              <div className="block lg:hidden space-y-2 pt-1">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug tracking-tight">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* RINGKASAN DANA KHUSUS MOBILE */}
              <div className="block lg:hidden space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <span>Dana terkumpul</span>
                    </div>
                    {/* Nominal Biru di Mobile */}
                    <div className="text-xl font-extrabold text-primary font-sans mt-0.5">
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
                    <span>{isFundDetailExpanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}</span>
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

                {/* Progress Bar dengan Dot Indikator & Persentase */}
                <div className="space-y-2">
                  <div className="relative py-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${calculatedPercentage}%` }}
                      />
                    </div>
                    {/* Titik Dot Indikator */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full shadow-xs z-10 pointer-events-none"
                      style={{ left: `${Math.min(98, Math.max(2, calculatedPercentage))}%` }}
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
                      <Link
                        to={location.pathname.startsWith('/zakat') ? `/zakat/${slug}/donatur` : `/program/${slug}/donatur`}
                        className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between group hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <div>
                          <span className="text-slate-500 block text-[11px]">Donatur Terkumpul</span>
                          <strong className="text-slate-800 font-bold group-hover:text-primary transition-colors">{formatNumber(donorCount)} Donatur</strong>
                        </div>
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
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

              <Link
                to={`/penggalang/${getOrganizerSlug(organizer?.name)}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-primary/50 hover:shadow-xs transition-all group cursor-pointer block"
                title={`Kunjungi profil lengkap ${organizer?.name || 'yayasan mitra'}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Logo Bulat Mitra Empat Warna */}
                  <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-primary/30 transition-colors">
                    <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="18" fill="#F0FDF4" />
                      <path d="M14 16C14 13.7909 15.7909 12 18 12C20.2091 12 22 13.7909 22 16C22 18.2091 20.2091 20 18 20C15.7909 20 14 18.2091 14 16Z" fill="#0EA5E9" />
                      <path d="M22 16C22 13.7909 23.7909 12 26 12C28.2091 12 30 13.7909 30 16C30 18.2091 28.2091 20 26 20C23.7909 20 22 18.2091 22 16Z" fill="#F59E0B" />
                      <path d="M14 24C14 21.7909 15.7909 20 18 20C20.2091 20 22 21.7909 22 24C22 26.2091 20.2091 28 18 28C15.7909 28 14 26.2091 14 24Z" fill="#10B981" />
                      <path d="M22 24C22 21.7909 23.7909 20 26 20C28.2091 20 30 21.7909 30 24C30 26.2091 28.2091 28 26 28C23.7909 28 22 26.2091 22 24Z" fill="#3B82F6" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>{organizer?.name || 'Yayasan Mitra OpenDonasi'}</span>
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

                <div className="text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
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

            {/* 5. BAGIAN E — DONATUR (Menghubungkan ke Halaman Donatur Lengkap) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Link
                  to={location.pathname.startsWith('/zakat') ? `/zakat/${slug}/donatur` : `/program/${slug}/donatur`}
                  className="group inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                    Donatur
                  </h2>
                  <span className="text-xs text-slate-400 font-normal">
                    ({formatNumber(donorCount || campaignDonors.length)})
                  </span>
                </Link>

                <Link
                  to={location.pathname.startsWith('/zakat') ? `/zakat/${slug}/donatur` : `/program/${slug}/donatur`}
                  className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Semua Donatur</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {campaignDonors.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-500 text-center">
                  Belum ada donatur untuk program ini. Jadilah donatur pertama!
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="divide-y divide-slate-100">
                    {campaignDonors.slice(0, 10).map((donor, idx) => {
                      const donorName = donor.donorName || donor.name || 'Hamba Allah';
                      return (
                        <Link
                          key={donor.id || idx}
                          to={location.pathname.startsWith('/zakat') ? `/zakat/${slug}/donatur` : `/program/${slug}/donatur`}
                          className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors group cursor-pointer"
                          title="Buka daftar lengkap donatur"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar Bulat dengan Inisial */}
                            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-primary-soft group-hover:text-primary transition-colors">
                              {getInitials(donorName)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                                {donorName}
                              </div>
                              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                                {donor.timeAgo || 'Baru saja'}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-semibold text-slate-800">
                              {formatRupiah(donor.amount)}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    to={location.pathname.startsWith('/zakat') ? `/zakat/${slug}/donatur` : `/program/${slug}/donatur`}
                    className="block w-full py-2.5 text-center text-xs sm:text-sm font-semibold text-primary bg-primary-soft hover:bg-primary/10 rounded-xl transition-colors cursor-pointer"
                  >
                    Lihat Semua Donatur ({formatNumber(donorCount || campaignDonors.length)})
                  </Link>
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

          {/* SISI KANAN (PANEL DONASI STICKY DESKTOP): Kolom 9 s/d 12 di Desktop Mengikuti Scroll */}
          <div className="hidden lg:block lg:col-span-4 sticky top-20 self-start">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* 1. Judul Program Desktop (Fokus Utama, Proporsional, Tanpa Subjudul) */}
              <h1 className="text-lg xl:text-xl font-extrabold text-slate-900 leading-snug tracking-tight">
                {title}
              </h1>

              {/* 2. Dana Terkumpul & Nominal Biru */}
              <div className="pt-1">
                <span className="text-xs text-text-secondary block mb-1">
                  Dana Terkumpul
                </span>
                <div className="text-2xl xl:text-3xl font-extrabold text-primary font-sans">
                  {formatRupiah(collectedAmount)}
                </div>

                {/* 3. Indikator Progress Bar dengan Dot & Tooltip Persentase saat Hover */}
                <div className="relative mt-3 mb-4 group">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${calculatedPercentage}%` }}
                    />
                  </div>

                  {/* Titik Thumb Bulat Dot (Selalu terlihat di ujung progres) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full shadow-xs z-10 pointer-events-none"
                    style={{ left: `${Math.min(98, Math.max(2, calculatedPercentage))}%` }}
                  />

                  {/* Tooltip Persen Desktop */}
                  <div
                    className="absolute top-full pt-1.5 -translate-x-1/2 z-20 hidden md:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `${Math.min(92, Math.max(8, calculatedPercentage))}%` }}
                  >
                    <div className="w-2 h-2 -mb-1 rotate-45 bg-[#EEF4FF] border-t border-l border-primary/20" />
                    <div className="bg-[#EEF4FF] border border-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                      {calculatedPercentage}%
                    </div>
                  </div>
                </div>

                {/* 4. Keterangan "Lihat Selengkapnya" Toggle untuk Target, Sisa Hari, dan Total Donatur */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsDesktopDetailExpanded(!isDesktopDetailExpanded)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-primary transition-colors cursor-pointer py-1"
                    aria-expanded={isDesktopDetailExpanded}
                  >
                    <span>{isDesktopDetailExpanded ? 'Sembunyikan Rincian' : 'Lihat Selengkapnya'}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDesktopDetailExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDesktopDetailExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                      <div className="grid grid-cols-2 gap-3 text-xs">
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

                      <Link
                        to={location.pathname.startsWith('/zakat') ? `/zakat/${slug}/donatur` : `/program/${slug}/donatur`}
                        className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-text-secondary hover:text-primary group transition-colors cursor-pointer"
                      >
                        <span className="group-hover:text-primary transition-colors">Dukungan Terkumpul</span>
                        <strong className="text-slate-800 font-semibold group-hover:text-primary transition-colors flex items-center gap-1">
                          <span>{formatNumber(donorCount)} Donatur</span>
                          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </strong>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Tombol Aksi Desktop */}
              <div className="space-y-2.5 pt-1">
                <Link to={`/donasi/${campaign.slug}`} className="block w-full">
                  <Button variant="primary" size="lg" isFullWidth className="font-bold shadow-xs py-3">
                    {getCtaButtonText(campaign)}
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Bagikan Program</span>
                </button>

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
                  <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          {/* Tombol Bagikan Kecil di Mobile */}
          <button
            type="button"
            onClick={handleShare}
            className="w-12 h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-colors active:scale-95"
            aria-label="Bagikan Program"
            title="Bagikan Program"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>

          {/* Tombol Donasi / Zakat / Infaq / Sedekah / Wakaf Sekarang Lebar */}
          <Link to={`/donasi/${campaign.slug}`} className="flex-1">
            <Button variant="primary" size="lg" isFullWidth className="font-bold shadow-xs py-3 text-sm">
              {getCtaButtonText(campaign)}
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
                <Link
                  key={donor.id || idx}
                  to={`/penggalang/${getOrganizerSlug(organizer?.name)}`}
                  onClick={() => setIsAllDonorsModalOpen(false)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 -mx-1 px-2 rounded-xl transition-colors group cursor-pointer block"
                  title={`Lihat profil yayasan penggalang program ini`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-primary-soft group-hover:text-primary transition-colors">
                      {getInitials(donor.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
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
                </Link>
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
      {/* MODAL BAGIKAN PROGRAM (WHATSAPP, TELEGRAM, DLL) */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Bagikan Program Kebaikan</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sebarkan peluang kebaikan ini ke keluarga, kerabat, dan teman-teman agar manfaatnya semakin luas:
            </p>

            {/* Pilihan Kanal Berbagi */}
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => {
                  const shareMsg = `${title}\n\nMari berpartisipasi dalam program kebaikan ini melalui OpenDonasi:\n${window.location.href}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`, '_blank');
                }}
                className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 flex items-center gap-2.5 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
                  </svg>
                </div>
                <span>WhatsApp</span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={() => {
                  const shareMsg = `${title}\n\nMari berpartisipasi melalui OpenDonasi:`;
                  window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareMsg)}`, '_blank');
                }}
                className="p-3.5 rounded-2xl border border-sky-200 bg-sky-50/50 hover:bg-sky-50 text-sky-800 flex items-center gap-2.5 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                  </svg>
                </div>
                <span>Telegram</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
                className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-800 flex items-center gap-2.5 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span>Facebook</span>
              </button>

              {/* Salin Tautan Langsung */}
              <button
                type="button"
                onClick={copyToClipboard}
                className={`p-3.5 rounded-2xl border text-slate-800 flex items-center gap-2.5 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs hover:scale-[1.02] ${
                  shareFeedback ? 'border-emerald-500 bg-emerald-50/70 text-emerald-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${shareFeedback ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                  {shareFeedback ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <span>{shareFeedback ? 'Tersalin!' : 'Salin Tautan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramDetailPage;
