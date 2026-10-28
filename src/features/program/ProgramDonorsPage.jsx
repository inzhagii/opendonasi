// Halaman daftar semua donatur program OpenDonasi (/program/:slug/donatur).
// Menampilkan tab pemilahan 'Terbaru', 'Dengan do\'a', dan 'Terbesar' sesuai referensi visual.

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CAMPAIGNS } from '../../data/campaigns';
import { useDonation } from '../../hooks/useDonation';
import { getMergedDonors } from '../../data/campaignDonors';
import { formatRupiah, formatNumber } from '../../lib/formatters';

// Inisial avatar donatur (contoh: "Hamba Allah" -> "HA")
function getInitials(name) {
  if (!name) return 'DO';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ProgramDonorsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { donations } = useDonation();

  // Temukan kampanye berdasarkan slug atau id (dengan fallback aman agar tidak 404)
  const campaign = useMemo(() => {
    return CAMPAIGNS.find((c) => c.slug === slug || c.id === slug) || CAMPAIGNS[0];
  }, [slug]);

  // Ambil data donatur gabungan (sesi pengguna + data percontohan)
  const rawDonors = useMemo(() => {
    return getMergedDonors(slug, donations);
  }, [slug, donations]);

  // State tab filter aktif: 'terbaru' | 'dengan_doa' | 'terbesar'
  const [activeTab, setActiveTab] = useState('terbaru');

  // State interaktif untuk jumlah & status Aamiin pada masing-masing doa
  const [aminState, setAminState] = useState({});

  // Set document title untuk SEO & scroll ke atas
  useEffect(() => {
    if (campaign) {
      document.title = `Donatur ${campaign.title} — OpenDonasi`;
    } else {
      document.title = 'Daftar Donatur Program — OpenDonasi';
    }
    window.scrollTo(0, 0);
  }, [campaign]);

  // Handler interaktif Aamiin doa
  const handleToggleAmin = (donorId, baseCount) => {
    setAminState((prev) => {
      const current = prev[donorId] || { hasAmined: false, count: baseCount || 0 };
      if (current.hasAmined) {
        return {
          ...prev,
          [donorId]: {
            hasAmined: false,
            count: Math.max(0, current.count - 1),
          },
        };
      }
      return {
        ...prev,
        [donorId]: {
          hasAmined: true,
          count: current.count + 1,
        },
      };
    });
  };

  // Handler kembali ke halaman detail program
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

  // Filter & Urutkan daftar donatur sesuai spesifikasi user:
  // 1. Terbaru: Semua donasi terbaru (baik ada doa maupun tidak disatukan)
  // 2. Dengan do'a: Hanya donasi yang memiliki doa
  // 3. Terbesar: Donasi dengan nominal terbesar (descending)
  const filteredDonors = useMemo(() => {
    let list = [...rawDonors];

    if (activeTab === 'dengan_doa') {
      list = list.filter((item) => Boolean(item.doa && item.doa.trim()));
      // Urutkan berdasarkan waktu terbaru
      return list.sort((a, b) => b.timestamp - a.timestamp);
    }

    if (activeTab === 'terbesar') {
      // Urutkan dari nominal terbesar ke terkecil
      return list.sort((a, b) => b.amount - a.amount);
    }

    // Default 'terbaru': semua donasi disatukan dan diurutkan terbaru
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [rawDonors, activeTab]);

  // Total donatur yang ditampilkan di header
  const totalDonorsCount = campaign?.donorCount || rawDonors.length;

  if (!campaign) {
    return (
      <div className="w-full min-h-screen py-16 flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <h1 className="text-lg font-bold text-slate-900">Program Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 mt-2">
            Informasi donatur untuk program ini tidak dapat dimuat.
          </p>
          <button
            type="button"
            onClick={() => navigate('/program')}
            className="mt-5 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold"
          >
            Kembali ke Katalog Program
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 1. Header Khusus Halaman Donatur: Tombol Kembali (<) + Judul Donatur ({count}) */}
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
            Donatur ({formatNumber(totalDonorsCount)})
          </h1>
        </div>
      </header>

      {/* 2. Konten Utama Donatur */}
      <main className="max-w-2xl mx-auto px-4 py-4 sm:py-6 pb-24">
        {/* 3 Tab Filter Pill: Terbaru | Dengan do'a | Terbesar */}
        <div className="flex items-center gap-2 sm:gap-2.5 pb-4 border-b border-slate-100">
          {/* Tab 1: Terbaru */}
          <button
            type="button"
            onClick={() => setActiveTab('terbaru')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'terbaru'
                ? 'bg-primary text-white border border-primary shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:border-primary hover:text-primary'
            }`}
          >
            Terbaru
          </button>

          {/* Tab 2: Dengan do'a */}
          <button
            type="button"
            onClick={() => setActiveTab('dengan_doa')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'dengan_doa'
                ? 'bg-primary text-white border border-primary shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:border-primary hover:text-primary'
            }`}
          >
            Dengan do'a
          </button>

          {/* Tab 3: Terbesar */}
          <button
            type="button"
            onClick={() => setActiveTab('terbesar')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'terbesar'
                ? 'bg-primary text-white border border-primary shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:border-primary hover:text-primary'
            }`}
          >
            Terbesar
          </button>
        </div>

        {/* Daftar Donatur */}
        {filteredDonors.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs sm:text-sm">
            Belum ada donatur pada filter ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDonors.map((donor) => {
              const currentAmin = aminState[donor.id] || {
                hasAmined: false,
                count: donor.aminCount || 0,
              };

              return (
                <div key={donor.id} className="py-4 sm:py-4.5">
                  {/* Baris Donatur: Avatar + Nama + Waktu di kiri, Nominal di kanan */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar Bulat dengan Inisial */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(donor.donorName)}
                      </div>

                      <div className="min-w-0">
                        {/* Nama Donatur & Badge Pendukung jika ada */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {donor.donorName}
                          </span>
                          {donor.hasBadge && (
                            <span
                              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white shadow-2xs"
                              title="Donatur Terverifikasi / Pendukung Setia"
                              aria-label="Donatur Terverifikasi"
                            >
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </span>
                          )}
                        </div>

                        {/* Waktu Donasi */}
                        <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                          {donor.timeAgo}
                        </div>
                      </div>
                    </div>

                    {/* Nominal Donasi di Sisi Kanan */}
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 shrink-0 text-right">
                      {formatRupiah(donor.amount)}
                    </div>
                  </div>

                  {/* Kotak Doa (Jika donasi memiliki doa/pesan) */}
                  {donor.doa && (
                    <div className="mt-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 text-slate-700 shadow-2xs">
                      {/* Teks Doa */}
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600 whitespace-pre-line font-normal">
                        {donor.doa}
                      </p>

                      {/* Baris Bawah Doa: Ajakan & Tombol Aamiin Interaktif */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                          Yuk aminkan doa saudara kita
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleAmin(donor.id, donor.aminCount)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                            currentAmin.hasAmined
                              ? 'bg-rose-50 text-rose-600 border-rose-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100'
                          }`}
                          aria-label={`Aminkan doa ${donor.donorName}`}
                        >
                          {currentAmin.hasAmined ? (
                            <svg className="w-3.5 h-3.5 fill-rose-500 text-rose-500" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                          <span>
                            {currentAmin.count > 0 ? `${currentAmin.count} Aamiin` : 'Aamiin'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProgramDonorsPage;
