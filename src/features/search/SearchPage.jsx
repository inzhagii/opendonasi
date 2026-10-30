// Halaman pencarian program donasi OpenDonasi (/search).
// Tampilan khusus pencarian: Header mandiri dengan tombol kembali (<), kolom input pencarian,
// tag kata kunci biru khas OpenDonasi, dan daftar pencarian populer sesuai referensi visual.
// Bebas dari navbar utama saat berada di halaman ini.

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { Button } from '../../components/ui/Button';
import { CAMPAIGNS } from '../../data/campaigns';
import { filterCampaigns } from '../../lib/campaignFilters';
import { isInternalProgramFlow } from '../../lib/navigation';

import { Container } from '../../components/ui/Container';

const POPULAR_SEARCH_TAGS = [
  'Beramal Quran',
  'Santri',
  'Sedekah Air',
  'Berbagi Makanan',
  'Tanggap Bencana',
  'Ambulans',
  'Zakat',
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  const queryParam = searchParams.get('q') || '';
  // State input pencarian lokal
  const [inputVal, setInputVal] = useState(queryParam);
  const [prevQuery, setPrevQuery] = useState(queryParam);

  if (prevQuery !== queryParam) {
    setPrevQuery(queryParam);
    setInputVal(queryParam);
  }

  // Set document title untuk SEO & auto focus pada input
  useEffect(() => {
    if (queryParam) {
      document.title = `Pencarian "${queryParam}" — OpenDonasi`;
    } else {
      document.title = 'Pencarian Program Donasi — OpenDonasi';
    }
    window.scrollTo(0, 0);
    searchInputRef.current?.focus();
  }, [queryParam]);

  // Handler tombol kembali
  const handleBack = () => {
    if (location.state?.from && !isInternalProgramFlow(location.state.from)) {
      navigate(location.state.from);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/program');
    }
  };

  // Handler submit form pencarian
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const nextQ = inputVal.trim();
    const nextParams = new URLSearchParams();
    if (nextQ) {
      nextParams.set('q', nextQ);
    }
    setSearchParams(nextParams);
  };

  // Handler klik tag saran / populer
  const handleTagClick = (tag) => {
    setInputVal(tag);
    const nextParams = new URLSearchParams();
    nextParams.set('q', tag);
    setSearchParams(nextParams);
  };

  // Handler bersihkan pencarian
  const handleClearQuery = () => {
    setInputVal('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    setSearchParams(nextParams);
    searchInputRef.current?.focus();
  };

  // Filter hasil pencarian berdasarkan kata kunci aktif
  const activeQuery = queryParam.trim() || inputVal.trim();
  const searchResults = useMemo(() => {
    if (!activeQuery) {
      return [];
    }
    return filterCampaigns(CAMPAIGNS, {
      searchQuery: activeQuery,
    });
  }, [activeQuery]);

  // Program populer untuk ditampilkan saat belum ada pencarian
  const popularCampaigns = useMemo(() => {
    return CAMPAIGNS.slice(0, 5);
  }, []);

  const hasQuery = Boolean(activeQuery);
  const hasResults = searchResults.length > 0;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 1. Header Khusus Pencarian (Max Width Desktop 1320px) dengan Tombol Kembali (< Arrow) */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs">
        <Container className="h-14 sm:h-16 flex items-center gap-2 sm:gap-3">
          {/* Tombol Kembali */}
          <button
            type="button"
            onClick={handleBack}
            className="p-2 -ml-2 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
            aria-label="Kembali"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Form Input Pencarian Full Width */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center relative min-w-0">
            <input
              ref={searchInputRef}
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (!e.target.value.trim()) {
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.delete('q');
                  setSearchParams(nextParams, { replace: true });
                }
              }}
              placeholder="Cari Program Kebaikan..."
              className="w-full text-sm sm:text-base text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none py-2 pr-8 font-normal"
              aria-label="Kata kunci pencarian"
            />

            {/* Tombol Hapus Input jika ada teks */}
            {inputVal && (
              <button
                type="button"
                onClick={handleClearQuery}
                className="absolute right-0 p-1.5 text-slate-400 hover:text-slate-600 rounded-full focus:outline-none cursor-pointer"
                aria-label="Hapus kata kunci"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
        </Container>
      </header>

      {/* 2. Konten Utama Pencarian (Max Width Desktop 1320px) */}
      <main className="py-5 sm:py-8 pb-20">
        <Container>
        {!hasQuery ? (
          /* KONDISI A: Belum Ada Kata Kunci (Sesuai Screenshot Referensi) */
          <div className="space-y-6 sm:space-y-7">
            {/* Teks Petunjuk Pencarian */}
            <p className="text-center text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Masukkan kata kunci program atau lembaga yang ingin anda cari
            </p>

            {/* Tag / Kategori Rekomendasi (Karakteristik Biru OpenDonasi #2E7DFA) */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Garis Pemisah Halus */}
            <div className="border-t border-slate-100 my-4" />

            {/* Seksi Pencarian Populer Sesuai Gambar Referensi */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Pencarian populer
              </h2>

              <div className="divide-y divide-slate-100">
                {popularCampaigns.map((camp) => (
                  <Link
                    key={camp.id}
                    to={`/program/${camp.slug}`}
                    state={{ from: location.pathname + location.search }}
                    className="flex items-center gap-3.5 py-3 sm:py-3.5 px-2 -mx-2 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    {/* Thumbnail Poster Program */}
                    <div className="w-24 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-2xs">
                      <img
                        src={camp.image}
                        alt={camp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                        loading="lazy"
                      />
                    </div>

                    {/* Judul & Nama Yayasan */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {camp.title}
                      </h3>
                      <div className="mt-1 text-[11px] sm:text-xs text-text-secondary flex items-center gap-1 truncate">
                        <span className="truncate">{camp.organizer?.name || 'Yayasan Mitra OpenDonasi'}</span>
                        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : hasResults ? (
          /* KONDISI B: Hasil Ditemukan */
          <div className="space-y-6">
            {/* Header Hasil */}
            <div className="pb-2 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Hasil pencarian untuk <span className="text-primary">"{activeQuery}"</span>
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Ditemukan {searchResults.length} program
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearQuery}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Reset
              </button>
            </div>



            {/* Grid Hasil Pencarian (Desktop 4 Kolom di 1320px) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {searchResults.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  variant="responsive"
                  className="h-full"
                />
              ))}
            </div>
          </div>
        ) : (
          /* KONDISI C: Hasil Tidak Ditemukan */
          <div className="text-center py-12 bg-white rounded-3xl border border-border p-6 sm:p-8 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Tidak Ada Hasil untuk "{activeQuery}"
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Coba gunakan kata kunci umum lainnya seperti <em>santri</em>, <em>bencana</em>, atau <em>sedekah</em>.
            </p>

            <div className="pt-3 flex items-center justify-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleClearQuery}
              >
                Hapus Kata Kunci
              </Button>
              <Link to="/program">
                <Button variant="outline" size="sm">
                  Katalog Program
                </Button>
              </Link>
            </div>
          </div>
        )}
        </Container>
      </main>
    </div>
  );
}

export default SearchPage;
