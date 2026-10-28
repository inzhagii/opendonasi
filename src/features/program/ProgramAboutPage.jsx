// Halaman Tentang Program OpenDonasi (/program/:slug/tentang).
// Menampilkan cerita mendalam, latar belakang, dan dokumentasi foto program.

import { useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CAMPAIGNS, getCampaignStory } from '../../data/campaigns';

export function ProgramAboutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Temukan data kampanye berdasarkan parameter slug
  const campaign = useMemo(() => {
    return CAMPAIGNS.find((c) => c.slug === slug || c.id === slug) || CAMPAIGNS[0];
  }, [slug]);

  // Ambil narasi cerita lengkap dan dokumentasi
  const story = useMemo(() => {
    return getCampaignStory(campaign);
  }, [campaign]);



  // Set document title untuk SEO & scroll ke atas
  useEffect(() => {
    if (campaign) {
      document.title = `Tentang Program: ${campaign.title} — OpenDonasi`;
    } else {
      document.title = 'Tentang Program — OpenDonasi';
    }
    window.scrollTo(0, 0);
  }, [campaign]);

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
            Cerita tentang program donasi ini tidak dapat dimuat.
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
      {/* 1. Header Khusus Halaman Tentang Program: Tombol Kembali (<) + Judul */}
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
            Tentang Program
          </h1>
        </div>
      </header>

      {/* 2. Konten Artikel Cerita Lengkap Program */}
      <main className="max-w-2xl mx-auto px-4 py-5 sm:py-7 pb-28">
        <article className="space-y-5">
          {/* Judul Lengkap Program */}
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
            {campaign.title}
          </h2>

          {/* Banner Gambar Program */}
          <div className="relative overflow-hidden bg-slate-100 rounded-2xl border border-slate-200 aspect-[16/9] w-full shadow-xs">
            {campaign.image ? (
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-secondary text-sm">
                OpenDonasi
              </div>
            )}
          </div>

          {/* Salam Pembuka Islami */}
          {story?.arabicGreeting && (
            <div className="pt-2 text-right sm:text-left">
              <p className="text-base sm:text-lg font-bold text-slate-800 tracking-wide font-serif">
                {story.arabicGreeting}
              </p>
              {story.bismillah && (
                <p className="text-xs sm:text-sm text-slate-600 font-medium italic mt-1">
                  {story.bismillah}
                </p>
              )}
            </div>
          )}

          {/* Paragraf Narasi Cerita */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed sm:leading-loose">
            {story?.paragraphs?.map((p, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>

          {/* Foto Dokumentasi Lapangan (2-Column Grid Sesuai Referensi Gambar 3) */}
          {story?.documentationImages && story.documentationImages.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 block">
                Dokumentasi Lapangan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {story.documentationImages.map((docImg, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-[4/3] shadow-2xs"
                  >
                    <img
                      src={docImg}
                      alt={`Dokumentasi lapangan ${campaign.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Penutup & Ajakan Kebaikan */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs sm:text-sm text-slate-700">
            <span className="font-bold text-slate-900 block">
              Salurkan Kepedulian Terbaik Anda
            </span>
            <p className="leading-relaxed text-slate-600">
              Setiap rupiah yang Anda titipkan adalah wujud kepedulian nyata yang meringankan beban sesama dan menjadi bekal amal jariyah. Mari tunaikan dukungan terbaik Anda sekarang.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}

export default ProgramAboutPage;
