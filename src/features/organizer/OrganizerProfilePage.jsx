// Halaman Profil Penggalang / Yayasan Mitra OpenDonasi (/penggalang/:organizerId).
// Karakteristik desain OpenDonasi: font Inter, biru utama #2E7DFA, latar putih & netral lembut, responsif desktop & mobile.

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { CAMPAIGNS } from '../../data/campaigns';
import { getOrganizer, getOrganizerSlug } from '../../data/organizers';
import iconFb from '../../assets/icons/icons_footer/facebook.svg';
import iconIg from '../../assets/icons/icons_footer/instagram.svg';

export function OrganizerProfilePage() {
  const { organizerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Ambil data yayasan berdasarkan id/slug dari URL
  const organizer = useMemo(() => {
    return getOrganizer(organizerId);
  }, [organizerId]);

  // Set document title untuk SEO
  useEffect(() => {
    if (organizer) {
      document.title = `${organizer.name} — Profil Penggalang OpenDonasi`;
    } else {
      document.title = 'Profil Penggalang — OpenDonasi';
    }
    window.scrollTo(0, 0);
  }, [organizer]);

  // Handler tombol kembali
  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/program');
    }
  };

  // Filter kampanye milik yayasan ini (dicocokkan via slug atau nama)
  const organizerCampaigns = useMemo(() => {
    if (!organizer) return [];
    const targetSlug = getOrganizerSlug(organizer.name);

    return CAMPAIGNS.filter((c) => {
      const cSlug = getOrganizerSlug(c.organizer?.name);
      return cSlug === targetSlug || c.organizer?.name?.toLowerCase() === organizer.name.toLowerCase();
    });
  }, [organizer]);

  // Filter program berdasarkan pencarian internal yayasan
  const filteredCampaigns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return organizerCampaigns;
    return organizerCampaigns.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      return matchTitle || matchDesc;
    });
  }, [organizerCampaigns, searchQuery]);

  // Hitung agregasi dinamis donatur & program jika ada
  const dynamicProgramCount = organizerCampaigns.length > 0 ? organizerCampaigns.length : organizer.stats?.programs || 1;
  const dynamicDonorCount = organizerCampaigns.reduce((acc, curr) => acc + (curr.donorCount || 0), 0) || organizer.stats?.donors || 1915;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 1. Header Khusus Halaman Profil Penggalang: Tombol Kembali + Judul Center Tanpa Katalog */}
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-2xs">
        <Container className="h-14 sm:h-16 relative flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary transition-colors cursor-pointer py-1.5 pr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg z-10"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </button>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
            <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 truncate">
              Profil Penggalang Dana
            </h1>
          </div>

          <div className="w-16 sm:w-20" aria-hidden="true" />
        </Container>
      </header>

      {/* 2. Konten Utama Profil Yayasan */}
      <main className="py-6 sm:py-10">
        <Container>
          <div className="w-full max-w-desktop mx-auto space-y-8">
            {/* Kartu Profil Identitas Yayasan (Layout Responsif 1320px Desktop) */}
            <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Sisi Kiri: Identitas Utama (Logo & Nama Berdampingan), Statistik & Sosial Media */}
                <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                  {/* Baris Logo & Nama/Bergabung/Terverifikasi Berdampingan */}
                  <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 text-center sm:text-left w-full">
                    {/* Avatar Logo Yayasan Berbadge Centang Biru */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-soft border-2 border-primary/20 flex items-center justify-center text-primary font-extrabold text-xl sm:text-2xl shadow-xs">
                        {organizer.name
                          .replace('(Demo)', '')
                          .trim()
                          .split(' ')
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')
                          .toUpperCase() || 'YP'}
                      </div>

                      {/* Badge Terverifikasi OpenDonasi (Centang Biru) */}
                      <div
                        className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center shadow-xs"
                        title="Yayasan Terverifikasi OpenDonasi"
                      >
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Nama Yayasan & Meta Terverifikasi */}
                    <div className="min-w-0 flex-1">
                      <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                        {organizer.name}
                      </h1>
                      <p className="mt-1 text-xs sm:text-sm text-text-secondary flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                        <span>Bergabung sejak {organizer.joinedDate}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-primary flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Terverifikasi
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Statistik Ringkas: Program | Donatur | Fundraiser */}
                  <div className="w-full grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100 py-3.5 my-2">
                    <div className="text-center px-1">
                      <div className="text-xs text-text-secondary font-medium">Program</div>
                      <div className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5">
                        {dynamicProgramCount}
                      </div>
                    </div>

                    <div className="text-center px-1">
                      <div className="text-xs text-text-secondary font-medium">Donatur</div>
                      <div className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5">
                        {dynamicDonorCount.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="text-center px-1">
                      <div className="text-xs text-text-secondary font-medium">Fundraiser</div>
                      <div className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5">
                        {organizer.stats?.fundraisers || 33}
                      </div>
                    </div>
                  </div>

                  {/* Tombol Media Sosial Sesuai Karakteristik OpenDonasi */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                    <a
                      href={organizer.socials?.facebook || 'https://facebook.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
                    >
                      <span
                        className="w-3.5 h-3.5 bg-white block"
                        style={{
                          maskImage: `url("${iconFb}")`,
                          WebkitMaskImage: `url("${iconFb}")`,
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                        }}
                        aria-hidden="true"
                      />
                      <span>Facebook</span>
                    </a>

                    <a
                      href={organizer.socials?.instagram || 'https://instagram.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft hover:bg-blue-100/80 text-primary border border-primary/20 text-xs sm:text-sm font-semibold transition-all active:scale-95"
                    >
                      <span
                        className="w-3.5 h-3.5 bg-primary block"
                        style={{
                          maskImage: `url("${iconIg}")`,
                          WebkitMaskImage: `url("${iconIg}")`,
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                        }}
                        aria-hidden="true"
                      />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

                {/* Sisi Kanan: Tentang, Cabang & Narasi */}
                <div className="lg:col-span-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 space-y-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
                      Tentang Penggalang Dana
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify lg:text-left">
                      {organizer.about}
                    </p>
                  </div>

                  {/* Daftar Cabang / Titik Asrama */}
                  {organizer.branches && organizer.branches.length > 0 && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Wilayah Operasional & Cabang:
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                        {organizer.branches.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Kontak dan Pertanyaan */}
                  <div className="pt-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <span>Informasi dan pertanyaan:</span>
                    <a
                      href={`tel:${organizer.phone}`}
                      className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>{organizer.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Pencarian Khusus Program Yayasan (Karakteristik OpenDonasi: Ikon Biru #2E7DFA) */}
            <div className="w-full">
              <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl h-12 sm:h-13 px-4 shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                {/* Ikon Kaca Pembesar Biru Utama (#2E7DFA) */}
                <svg className="w-5 h-5 text-primary shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari program kebaikan ${organizer.name}...`}
                  className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 font-normal"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full focus:outline-none"
                    aria-label="Bersihkan pencarian"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 3. Section Program Kebaikan */}
            <div className="space-y-4 pt-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Program Kebaikan
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  Program-program kebaikan yang dikelola oleh {organizer.name}
                </p>
              </div>

              {filteredCampaigns.length === 0 ? (
                <div className="bg-white rounded-3xl border border-border p-8 text-center max-w-md mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Program Tidak Ditemukan
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Tidak ada program kebaikan yang cocok dengan kata kunci "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-primary hover:underline pt-1 cursor-pointer"
                  >
                    Tampilkan Semua Program
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredCampaigns.map((camp) => (
                    <CampaignCard
                      key={camp.id}
                      campaign={camp}
                      variant="responsive"
                      className="h-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

export default OrganizerProfilePage;
