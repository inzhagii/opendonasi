// Halaman Daftar Berita Program OpenDonasi (/program/:slug/berita).
// Menampilkan timeline berita kabar terbaru & popover rincian rencana implementasi.

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CAMPAIGNS, getCampaignUpdates } from '../../data/campaigns';
import { formatDate } from '../../lib/formatters';
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
            className="mt-5 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 1. Header Khusus Halaman Berita: Tombol Kembali (<) + Judul Berita ({count}) */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs">
        <div className="max-w-2xl mx-auto px-4 h-14 sm:h-16 flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 -ml-2 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
            aria-label="Kembali ke halaman program"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            Berita ({newsList.length})
          </h1>
        </div>
      </header>

      {/* 2. Daftar Berita (Sesuai Referensi Gambar 4) */}
      <main className="max-w-2xl mx-auto px-4 py-5 sm:py-6 pb-28">
        {newsList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs sm:text-sm">
            Belum ada update kabar atau berita untuk program ini.
          </div>
        ) : (
          <div className="space-y-6">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="pb-5 border-b border-slate-100 last:border-b-0 space-y-1.5"
              >
                {/* Tanggal Publikasi */}
                <span className="text-xs text-slate-400 font-medium block">
                  {formatDate(item.date)}
                </span>

                {/* Judul Berita / Pencairan Dana */}
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h2>

                {/* Subjudul Rencana Pencairan jika ada */}
                {item.subtitle && (
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                    {item.subtitle}
                  </h3>
                )}

                {/* Ringkasan Paragraf Berita */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {item.excerpt || item.content}
                </p>

                {/* Tombol Baca Selengkapnya yang memicu Popover Modal */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedNews(item)}
                    className="text-xs sm:text-sm font-semibold text-primary hover:underline cursor-pointer focus:outline-none"
                  >
                    Baca Selengkapnya
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
