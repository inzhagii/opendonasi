// Halaman Daftar Berita Program OpenDonasi (/program/:slug/berita).
// Menampilkan timeline berita kabar terbaru & popover rincian rencana implementasi.
// Mendukung tata letak desktop max-width 1320px dengan sticky panel ringkasan program & CTA donasi.

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CAMPAIGNS, getCampaignUpdates } from '../../data/campaigns';
import { formatDate, formatRupiah, formatNumber } from '../../lib/formatters';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';

export function ProgramNewsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk modal popover detail berita yang aktif
  const [selectedNews, setSelectedNews] = useState(null);

  // Temukan data kampanye berdasarkan parameter slug
  const campaign = useMemo(() => {
    return CAMPAIGNS.find((c) => c.slug === slug || c.id === slug) || CAMPAIGNS[0];
  }, [slug]);

  // Ambil daftar berita kabar terbaru
  const newsList = useMemo(() => {
    return getCampaignUpdates(campaign?.id);
  }, [campaign]);

  // Set document title untuk SEO & scroll ke atas
  useEffect(() => {
    if (campaign) {
      document.title = `Kabar & Berita: ${campaign.title} — OpenDonasi`;
    } else {
      document.title = 'Berita Program — OpenDonasi';
    }
    window.scrollTo(0, 0);
  }, [campaign]);

  // Listener tombol Escape untuk menutup popover modal berita
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedNews(null);
    };
    if (selectedNews) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNews]);

  // Handler tombol kembali
  const handleBack = () => {
    if (slug) {
      navigate(`/program/${slug}`, {
        replace: true,
        state: { from: location.state?.from },
      });
    } else {
      navigate('/program');
    }
  };

  const getCtaText = (camp) => {
    const sType = (camp?.serviceType || '').toLowerCase();
    const cat = (camp?.category || '').toLowerCase();
    const title = (camp?.title || '').toLowerCase();

    if (sType === 'wakaf' || cat === 'wakaf' || title.includes('wakaf')) return 'Wakaf Sekarang';
    if (sType === 'zakat' || cat === 'zakat' || title.includes('zakat')) return 'Zakat Sekarang';
    if (sType === 'infaq' || cat === 'infaq' || title.includes('infaq')) return 'Infaq Sekarang';
    if (sType === 'sedekah' || cat === 'sedekah' || title.includes('sedekah')) return 'Sedekah Sekarang';
    return 'Donasi Sekarang';
  };

  if (!campaign) {
    return (
      <div className="w-full min-h-screen py-16 flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <h1 className="text-lg font-bold text-slate-900">Program Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 mt-2">
            Informasi berita untuk program ini tidak dapat dimuat.
          </p>
          <button
            type="button"
            onClick={() => navigate('/program')}
            className="mt-5 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold cursor-pointer"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    organizer,
    collectedAmount = 0,
    targetAmount = 0,
    progressPercentage,
    donorCount = 0,
  } = campaign;

  const calculatedPercentage =
    typeof progressPercentage === 'number'
      ? progressPercentage
      : targetAmount
      ? Math.min(100, Math.round((collectedAmount / targetAmount) * 100))
      : 0;

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 1. Header Khusus Halaman Berita: Tombol Kembali + Judul Berita Center (Max Width 1320px) */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs">
        <Container className="h-14 sm:h-16 relative flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary transition-colors cursor-pointer py-1.5 pr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg z-10"
            aria-label="Kembali ke halaman program"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </button>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
            <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 truncate">
              Berita ({newsList.length})
            </h1>
          </div>

          <div className="w-16 sm:w-20" aria-hidden="true" />
        </Container>
      </header>

      {/* 2. Daftar Berita (Layout Desktop Max Width 1320px) */}
      <main className="py-5 sm:py-8 pb-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Kolom Kiri: Daftar Timeline Berita (Kolom 1 s/d 8 di Desktop) */}
            <div className="lg:col-span-8 space-y-6">
              {newsList.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs sm:text-sm">
                  Belum ada update kabar atau berita untuk program ini.
                </div>
              ) : (
                <div className="space-y-6">
                  {newsList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-2 hover:border-primary/40 transition-colors"
                    >
                      {/* Tanggal Publikasi */}
                      <span className="text-xs text-slate-400 font-medium block">
                        {formatDate(item.date)}
                      </span>

                      {/* Judul Berita / Pencairan Dana */}
                      <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h2>

                      {/* Subjudul Rencana Pencairan jika ada */}
                      {item.subtitle && (
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                          {item.subtitle}
                        </h3>
                      )}

                      {/* Ringkasan Paragraf Berita */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {item.excerpt || item.content}
                      </p>

                      {/* Tombol Baca Selengkapnya yang memicu Popover Modal */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedNews(item)}
                          className="text-xs sm:text-sm font-semibold text-primary hover:underline cursor-pointer focus:outline-none inline-flex items-center gap-1"
                        >
                          <span>Baca Selengkapnya</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kolom Kanan: Panel Ringkasan Program Desktop Sticky (Kolom 9 s/d 12) */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-20 self-start">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Mitra Penggalang
                  </span>
                  <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                    <span>{organizer?.name || 'Yayasan Mitra OpenDonasi'}</span>
                    <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-xs text-slate-500 font-medium block">
                    Dana Terkumpul
                  </span>
                  <div className="text-2xl font-extrabold text-primary font-sans">
                    {formatRupiah(collectedAmount)}
                  </div>

                  {/* Progress Bar */}
                  <div className="relative py-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${calculatedPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>Target: <strong>{formatRupiah(targetAmount)}</strong></span>
                    <span><strong>{formatNumber(donorCount)}</strong> Donatur</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to={`/donasi/${campaign.slug}`} className="block w-full">
                    <Button variant="primary" size="lg" isFullWidth className="font-bold shadow-xs py-3 text-sm">
                      {getCtaText(campaign)}
                    </Button>
                  </Link>
                </div>

                <p className="text-[10px] text-text-secondary text-center flex items-center justify-center gap-1 pt-1">
                  <svg className="w-3 h-3 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Penyaluran resmi & amanah OpenDonasi</span>
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </main>

      {/* 3. Popover / Modal Detail Berita Lengkap (Sesuai Referensi Gambar 5) */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[88vh] overflow-y-auto space-y-4 animate-in zoom-in-95 duration-150 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Popover: Tanggal & Tombol Tutup X */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  {formatDate(selectedNews.date)}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-0.5">
                  {selectedNews.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Tutup detail berita"
              >
                ✕
              </button>
            </div>

            {/* Subjudul */}
            {selectedNews.subtitle && (
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                {selectedNews.subtitle}
              </h4>
            )}

            {/* Paragraf Lengkap Berita */}
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
              {selectedNews.content}
            </div>

            {/* Rincian Rencana Implementasi (Numbered List Sesuai Screenshot 5) */}
            {selectedNews.implementationPlan && selectedNews.implementationPlan.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Rincian Rencana Implementasi:
                </span>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700">
                  {selectedNews.implementationPlan.map((plan, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <strong>{plan.label}:</strong> <span>{plan.value}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Tombol Tutup di Bawah Popover */}
            <div className="pt-3 border-t border-slate-100">
              <Button
                variant="primary"
                size="md"
                isFullWidth
                onClick={() => setSelectedNews(null)}
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

export default ProgramNewsPage;
