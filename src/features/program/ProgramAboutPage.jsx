// Halaman Tentang Program OpenDonasi (/program/:slug/tentang).
// Menampilkan cerita mendalam, latar belakang, dan dokumentasi foto program.
// Mendukung tata letak desktop max-width 1320px dengan sticky panel ringkasan program & CTA donasi.

import { useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CAMPAIGNS, getCampaignStory } from '../../data/campaigns';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { formatRupiah, formatNumber } from '../../lib/formatters';

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
            Cerita tentang program donasi ini tidak dapat dimuat.
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
    image,
  } = campaign;

  const calculatedPercentage =
    typeof progressPercentage === 'number'
      ? progressPercentage
      : targetAmount
      ? Math.min(100, Math.round((collectedAmount / targetAmount) * 100))
      : 0;

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 1. Header Khusus Halaman Tentang Program: Tombol Kembali + Judul Center (Max Width 1320px) */}
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
              Tentang Program
            </h1>
          </div>

          <div className="w-16 sm:w-20" aria-hidden="true" />
        </Container>
      </header>

      {/* 2. Konten Artikel Cerita Lengkap Program (Max Width 1320px di Desktop) */}
      <main className="py-5 sm:py-8 pb-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Kolom Kiri: Narasi Cerita Utama (Kolom 1 s/d 8 di Desktop) */}
            <article className="lg:col-span-8 space-y-6">
              {/* Judul Lengkap Program */}
              <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
                {title}
              </h2>

              {/* Banner Gambar Program */}
              <div className="relative overflow-hidden bg-slate-100 rounded-2xl border border-slate-200 aspect-[16/9] w-full shadow-xs">
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

              {/* Salam Pembuka Islami */}
              {story?.arabicGreeting && (
                <div className="pt-2 text-right sm:text-left">
                  <p className="text-base sm:text-xl font-bold text-slate-800 tracking-wide font-serif">
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

              {/* Foto Dokumentasi Lapangan (Grid 2 atau 3 Kolom) */}
              {story?.documentationImages && story.documentationImages.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-sm font-bold text-slate-900 block">
                    Dokumentasi Lapangan:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {story.documentationImages.map((docImg, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-[4/3] shadow-2xs group"
                      >
                        <img
                          src={docImg}
                          alt={`Dokumentasi lapangan ${title} ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Penutup & Ajakan Kebaikan */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-slate-900 block text-sm sm:text-base">
                  Salurkan Kepedulian Terbaik Anda
                </span>
                <p className="leading-relaxed text-slate-600">
                  Setiap rupiah yang Anda titipkan adalah wujud kepedulian nyata yang meringankan beban sesama dan menjadi bekal amal jariyah. Mari tunaikan dukungan terbaik Anda sekarang.
                </p>
              </div>

              {/* Tombol Donasi Mobile Inline */}
              <div className="block lg:hidden pt-2">
                <Link to={`/donasi/${campaign.slug}`} className="block w-full">
                  <Button variant="primary" size="lg" isFullWidth className="font-bold py-3 text-sm shadow-xs">
                    {getCtaText(campaign)}
                  </Button>
                </Link>
              </div>
            </article>

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
    </div>
  );
}

export default ProgramAboutPage;
