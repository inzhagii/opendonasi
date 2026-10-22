// Halaman hasil pencarian program donasi OpenDonasi (/search).

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { Button } from '../../components/ui/Button';
import { CAMPAIGNS, CATEGORIES } from '../../data/campaigns';
import { filterCampaigns, sortCampaigns, SORT_OPTIONS } from '../../lib/campaignFilters';

const POPULAR_SEARCH_TAGS = [
  'Bencana',
  'Pesantren',
  'Sembako Lansia',
  'Ambulans',
  'Air Bersih',
  'Zakat',
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'semua';
  const selectedSort = searchParams.get('sort') || 'terbaru';

  // State input pencarian lokal yang disinkronkan saat queryParam URL berganti
  const [inputVal, setInputVal] = useState(queryParam);
  const [prevQuery, setPrevQuery] = useState(queryParam);

  if (prevQuery !== queryParam) {
    setPrevQuery(queryParam);
    setInputVal(queryParam);
  }

  // Set document title untuk SEO
  useEffect(() => {
    if (queryParam) {
      document.title = `Pencarian "${queryParam}" — OpenDonasi`;
    } else {
      document.title = 'Pencarian Program Donasi — OpenDonasi';
    }
    window.scrollTo(0, 0);
  }, [queryParam]);

  // Handler submit form pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextQ = inputVal.trim();
    const nextParams = new URLSearchParams();
    if (nextQ) {
      nextParams.set('q', nextQ);
    }
    if (selectedCategory !== 'semua') {
      nextParams.set('category', selectedCategory);
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
  };

  // Handler ganti kategori dalam pencarian
  const handleCategoryChange = (catId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'semua') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams, { replace: true });
  };

  // Handler ganti pengurutan dalam pencarian
  const handleSortChange = (sortId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (sortId === 'terbaru') {
      nextParams.delete('sort');
    } else {
      nextParams.set('sort', sortId);
    }
    setSearchParams(nextParams, { replace: true });
  };

  // Filter & Urutkan data berdasarkan query
  const searchResults = useMemo(() => {
    if (!queryParam.trim()) {
      return [];
    }
    const filtered = filterCampaigns(CAMPAIGNS, {
      searchQuery: queryParam,
      category: selectedCategory,
    });
    return sortCampaigns(filtered, selectedSort);
  }, [queryParam, selectedCategory, selectedSort]);

  // Program unggulan sebagai rekomendasi saat query kosong
  const recommendedCampaigns = useMemo(() => {
    return CAMPAIGNS.filter((c) => c.isFeatured).slice(0, 3);
  }, []);

  const hasQuery = queryParam.trim().length > 0;
  const hasResults = searchResults.length > 0;

  return (
    <div className="w-full py-6 md:py-10">
      <Container>
        {/* Breadcrumb Sederhana */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-xs text-text-secondary">
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
            <li className="text-text-primary font-medium" aria-current="page">
              Pencarian
            </li>
          </ol>
        </nav>

        {/* Input Pencarian Utama */}
        <div className="mb-8 max-w-3xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Cari program donasi, nama yayasan, atau bencana..."
                aria-label="Kata kunci pencarian"
                className="w-full pl-11 pr-10 py-3 text-sm sm:text-base rounded-2xl border border-slate-200 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400 font-normal"
              />
              {/* Ikon Pencarian */}
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* Tombol Hapus Input jika ada teks */}
              {inputVal && (
                <button
                  type="button"
                  onClick={() => setInputVal('')}
                  aria-label="Bersihkan input pencarian"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <Button type="submit" variant="primary" size="md" className="shrink-0 px-5 sm:px-6">
              Cari
            </Button>
          </form>

          {/* Saran Kata Kunci Populer */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
            <span>Saran pencarian:</span>
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary transition-colors text-slate-700 font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* KONTEN BERDASARKAN STATE */}
        {!hasQuery ? (
          /* STATE 1: Kata Kunci Kosong */
          <div className="space-y-8">
            <div className="p-8 sm:p-12 text-center bg-white rounded-2xl border border-border">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-primary flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-text-primary">Temukan Program Kebaikan</h2>
              <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                Ketik nama program, kebutuhan bantuan, atau organisasi penggalang dana untuk menemukan kampanye yang ingin Anda bantu.
              </p>
            </div>

            {/* Rekomendasi Program Unggulan */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-text-primary">
                  Program Unggulan yang Dapat Anda Bantu
                </h3>
                <Link to="/program" className="text-xs font-semibold text-primary hover:underline">
                  Lihat Semua Katalog →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recommendedCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    variant="responsive"
                    className="h-full"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : hasResults ? (
          /* STATE 2: Hasil Ditemukan */
          <div className="space-y-6">
            {/* Header Hasil & Filter Tambahan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                  Hasil pencarian untuk <span className="text-primary">"{queryParam}"</span>
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Menemukan <strong>{searchResults.length}</strong> program yang cocok
                </p>
              </div>

              {/* Kontrol Pengurutan Hasil */}
              <div className="flex items-center gap-2 shrink-0">
                <label htmlFor="search-sort" className="text-xs text-text-secondary">
                  Urutkan:
                </label>
                <select
                  id="search-sort"
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-xs font-medium bg-white border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Kategori Ringkas (Pills) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`snap-start shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      isSelected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-border hover:border-primary/40'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Grid Hasil Pencarian */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          /* STATE 3: Hasil Kosong */
          <div className="text-center py-16 bg-white rounded-2xl border border-border p-8 max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-text-primary">
              Tidak Ada Hasil untuk "{queryParam}"
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
              Kami tidak menemukan program yang cocok dengan kata kunci tersebut.
              Periksa ejaan Anda atau coba istilah umum seperti <em>bencana</em>, <em>santri</em>, atau <em>sembako</em>.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleClearQuery}
              >
                Hapus Kata Kunci
              </Button>
              <Link to="/program">
                <Button variant="outline" size="sm">
                  Lihat Semua Program
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default SearchPage;
