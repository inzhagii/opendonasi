// Halaman riwayat donasi pengguna demo OpenDonasi (/donasi-saya).

import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useDonation } from '../../hooks/useDonation';
import { formatRupiah, formatDate } from '../../lib/formatters';
import { CAMPAIGNS } from '../../data/campaigns';

export function DonationHistoryPage() {
  const { donations } = useDonation();
  const navigate = useNavigate();

  // State Filter & Sorting (Sesuai SPEC: Tidak menggunakan tab ringkasan)
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'success' | 'pending'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'highest' | 'lowest'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    document.title = 'Riwayat Donasi Saya — OpenDonasi';
    window.scrollTo(0, 0);
  }, []);

  // Filter transaksi yang memiliki format valid
  const allValidDonations = useMemo(() => {
    if (!Array.isArray(donations)) return [];
    return donations.filter(
      (item) => item && typeof item === 'object' && item.transactionId
    );
  }, [donations]);

  // Statistik keseluruhan (tidak dipengaruhi filter lokal sesuai spesifikasi)
  const totalAmountAll = useMemo(() => {
    return allValidDonations.reduce((sum, d) => {
      const amt = typeof d.amount === 'number' && !isNaN(d.amount) ? d.amount : 0;
      return sum + amt;
    }, 0);
  }, [allValidDonations]);

  // Filter dan Pengurutan Transaksi
  const filteredDonations = useMemo(() => {
    let result = [...allValidDonations];

    // 1. Filter Status
    if (statusFilter !== 'all') {
      result = result.filter((d) => d.status === statusFilter);
    }

    // 2. Filter Pencarian Judul
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      result = result.filter((d) => {
        const title = (d.campaignTitle || '').toLowerCase();
        const id = (d.transactionId || '').toLowerCase();
        return title.includes(q) || id.includes(q);
      });
    }

    // 3. Pengurutan
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime() || 0;
      const timeB = new Date(b.createdAt || b.date || 0).getTime() || 0;
      const amtA = typeof a.amount === 'number' ? a.amount : 0;
      const amtB = typeof b.amount === 'number' ? b.amount : 0;

      if (sortBy === 'newest') return timeB - timeA;
      if (sortBy === 'oldest') return timeA - timeB;
      if (sortBy === 'highest') return amtB - amtA;
      if (sortBy === 'lowest') return amtA - amtB;
      return 0;
    });

    return result;
  }, [allValidDonations, statusFilter, searchKeyword, sortBy]);

  // Salin ID Transaksi
  const handleCopyId = (id) => {
    if (!id || !navigator.clipboard) return;
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Toggle ekspansi rincian item
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Format tanggal & waktu aman
  const formatDateTime = (dateVal) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return formatDate(dateVal);
    }
  };

  // Pemetaan label status transaksi demo
  const getStatusBadge = (status, statusLabel) => {
    if (status === 'success') {
      return (
        <Badge variant="success" size="sm" className="font-semibold">
          {statusLabel || 'Berhasil (Simulasi)'}
        </Badge>
      );
    }
    if (status === 'pending') {
      return (
        <Badge variant="warning" size="sm" className="font-semibold">
          Menunggu Pembayaran (Simulasi)
        </Badge>
      );
    }
    return (
      <Badge variant="neutral" size="sm" className="font-semibold">
        {statusLabel || 'Simulasi Demo'}
      </Badge>
    );
  };

  // Verifikasi apakah slug kampanye terdaftar di dataset
  const checkCampaignExists = (slug) => {
    if (!slug) return false;
    return CAMPAIGNS.some((c) => c.slug === slug);
  };

  return (
    <div className="w-full py-6 md:py-10">
      <Container>
        {/* Navigasi Atas & Tombol Kembali ke Profil */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-text-secondary truncate">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/profil" className="hover:text-primary transition-colors">
                  Profil Saya
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-text-primary font-medium" aria-current="page">
                Riwayat Donasi
              </li>
            </ol>
          </nav>

          <button
            type="button"
            onClick={() => navigate('/profil')}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary px-3 py-1.5 rounded-lg border border-border hover:bg-slate-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali ke Profil</span>
          </button>
        </div>

        {/* Kontainer Utama Terpusat */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Judul Halaman */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Riwayat Donasi Saya
              </h1>
              <Badge variant="primary" size="sm">
                Simulasi Lokal
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Daftar seluruh transaksi simulasi donasi yang tersimpan secara lokal pada sesi browser ini.
            </p>
          </div>

          {/* KONDISI A: Seluruh Riwayat Kosong (Empty State Global) */}
          {allValidDonations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-8 sm:p-12 text-center shadow-xs space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Belum Ada Riwayat Donasi
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                Anda belum melakukan simulasi donasi. Transaksi demo yang Anda selesaikan melalui formulir donasi akan otomatis tercatat dan dapat dipantau di sini.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/program" className="w-full sm:w-auto">
                  <Button variant="primary" size="md" isFullWidth>
                    Pilih Program Donasi
                  </Button>
                </Link>
                <Link to="/" className="w-full sm:w-auto">
                  <Button variant="outline" size="md" isFullWidth>
                    Kembali ke Beranda
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Ringkasan Statistik Riwayat */}
              <div className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-[11px] text-text-secondary block">Total Donasi Tercatat</span>
                    <strong className="text-base sm:text-lg font-bold text-slate-900">
                      {allValidDonations.length} Transaksi
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-secondary block">Akumulasi Nilai Simulasi</span>
                    <strong className="text-base sm:text-lg font-extrabold text-primary">
                      {formatRupiah(totalAmountAll)}
                    </strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-4">
                    <span className="text-[10px] text-text-secondary block leading-snug">
                      *Statistik mencakup seluruh transaksi simulasi lokal pada perangkat ini.
                    </span>
                  </div>
                </div>
              </div>

              {/* Bar Kontrol Filter dan Pencarian (Sesuai OPENDONASI_SPEC) */}
              <div className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  {/* Input Filter Pencarian Judul/ID */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Cari nama program atau ID transaksi..."
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Dropdown Filter Status & Urutan */}
                  <div className="flex items-center gap-2">
                    {/* Filter Status */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      aria-label="Filter status transaksi"
                      className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-border bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="all">Semua Status</option>
                      <option value="success">Berhasil (Simulasi)</option>
                      <option value="pending">Menunggu Pembayaran</option>
                    </select>

                    {/* Filter Urutan */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      aria-label="Urutan riwayat"
                      className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-border bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="newest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                      <option value="highest">Nominal Terbesar</option>
                      <option value="lowest">Nominal Terkecil</option>
                    </select>
                  </div>
                </div>

                {/* Indikator Filter Aktif */}
                {(statusFilter !== 'all' || searchKeyword.trim()) && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-text-secondary">
                      Menampilkan {filteredDonations.length} dari {allValidDonations.length} transaksi
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusFilter('all');
                        setSearchKeyword('');
                      }}
                      className="text-primary hover:underline font-semibold"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>

              {/* KONDISI B: Filter Menghasilkan 0 Item */}
              {filteredDonations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border p-8 text-center shadow-xs space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tidak Ada Transaksi yang Cocok
                  </h3>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto">
                    Tidak ditemukan riwayat donasi simulasi yang memenuhi kriteria pencarian atau status yang dipilih.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusFilter('all');
                      setSearchKeyword('');
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              ) : (
                /* Daftar Transaksi Donasi */
                <div className="space-y-3">
                  {filteredDonations.map((item) => {
                    const isExpanded = expandedId === item.transactionId;
                    const hasValidSlug = checkCampaignExists(item.campaignSlug);

                    return (
                      <div
                        key={item.transactionId}
                        className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-xs transition-all space-y-3"
                      >
                        {/* Header Item: ID, Tanggal, & Status */}
                        <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              {item.transactionId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyId(item.transactionId)}
                              className="text-slate-400 hover:text-primary transition-colors"
                              title="Salin ID Transaksi"
                              aria-label={`Salin ID ${item.transactionId}`}
                            >
                              {copiedId === item.transactionId ? (
                                <span className="text-[10px] text-emerald-600 font-bold">Tersalin!</span>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                            </button>
                            <span className="text-text-secondary">•</span>
                            <span className="text-text-secondary">
                              {formatDateTime(item.createdAt || item.date)}
                            </span>
                          </div>

                          <div>
                            {getStatusBadge(item.status, item.statusLabel)}
                          </div>
                        </div>

                        {/* Konten Utama Item: Judul Program & Nominal */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                          <div className="min-w-0 flex-1">
                            {hasValidSlug ? (
                              <Link
                                to={`/program/${item.campaignSlug}`}
                                className="font-bold text-slate-900 hover:text-primary transition-colors text-sm sm:text-base leading-snug line-clamp-2"
                              >
                                {item.campaignTitle || 'Program Kebaikan OpenDonasi'}
                              </Link>
                            ) : (
                              <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                                {item.campaignTitle || 'Program Kebaikan OpenDonasi'}
                              </span>
                            )}

                            {/* Identitas Donatur dengan Kebijakan Privasi Ketat */}
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-text-secondary">
                              <span>Donatur:</span>
                              <strong className="text-slate-800 font-semibold">
                                {item.isAnonymous
                                  ? 'Hamba Allah (Anonim)'
                                  : item.donorName || 'Donatur Demo'}
                              </strong>
                            </div>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[10px] text-text-secondary block">Nominal Donasi</span>
                            <strong className="text-base sm:text-lg font-extrabold text-primary">
                              {formatRupiah(item.amount)}
                            </strong>
                          </div>
                        </div>

                        {/* Tombol Toggle Rincian Lengkap */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => toggleExpand(item.transactionId)}
                            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 focus:outline-none"
                            aria-expanded={isExpanded}
                          >
                            <span>{isExpanded ? 'Sembunyikan Rincian' : 'Lihat Rincian'}</span>
                            <svg
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {hasValidSlug && (
                            <Link
                              to={`/program/${item.campaignSlug}`}
                              className="text-xs text-text-secondary hover:text-primary transition-colors"
                            >
                              Buka Program →
                            </Link>
                          )}
                        </div>

                        {/* Rincian Transaksi Yang Dapat Di-expand */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 rounded-xl p-3.5 space-y-2.5 text-xs animate-in fade-in duration-150">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                              <div>
                                <span className="text-text-secondary block">Metode Pembayaran</span>
                                <span className="font-semibold text-slate-900">
                                  {item.paymentMethod || 'Simulasi Frontend'}
                                </span>
                              </div>
                              <div>
                                <span className="text-text-secondary block">Waktu Lengkap</span>
                                <span className="font-semibold text-slate-900">
                                  {formatDateTime(item.createdAt || item.date)}
                                </span>
                              </div>
                              {item.donorEmail && (
                                <div>
                                  <span className="text-text-secondary block">Email Terdaftar</span>
                                  <span className="font-semibold text-slate-900">{item.donorEmail}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-text-secondary block">Status Transaksi</span>
                                <span className="font-semibold text-slate-900">
                                  {item.status === 'success'
                                    ? 'Tercatat di Simulasi Demo'
                                    : 'Menunggu Konfirmasi Demo'}
                                </span>
                              </div>
                            </div>

                            {/* Doa / Pesan Kebaikan jika ada */}
                            {item.doa && (
                              <div className="pt-2 border-t border-slate-200/80">
                                <span className="text-text-secondary block mb-1">
                                  Doa / Pesan Dukungan:
                                </span>
                                <p className="italic text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 text-xs leading-relaxed">
                                  "{item.doa}"
                                </p>
                              </div>
                            )}

                            <p className="text-[10px] text-text-secondary pt-1 leading-snug">
                              *Catatan: Transaksi ini adalah bagian dari simulasi frontend dan tidak melibatkan transaksi perbankan riil.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export default DonationHistoryPage;
