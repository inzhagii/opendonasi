// Halaman hasil simulasi transaksi OpenDonasi (/hasil-donasi).

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah, formatDate } from '../../lib/formatters';

export function DonationResultPage() {
  const [dataState] = useState(() => {
    if (typeof window === 'undefined') {
      return { transaction: null, isCorrupted: false };
    }
    try {
      const raw = sessionStorage.getItem('opendonasi_latest_transaction');
      if (raw) {
        const parsed = JSON.parse(raw);
        // Validasi field esensial transaksi simulasi
        if (
          parsed &&
          typeof parsed === 'object' &&
          parsed.transactionId &&
          typeof parsed.amount === 'number'
        ) {
          return { transaction: parsed, isCorrupted: false };
        }
        return { transaction: null, isCorrupted: true };
      }
    } catch {
      return { transaction: null, isCorrupted: true };
    }
    return { transaction: null, isCorrupted: false };
  });

  const { transaction, isCorrupted } = dataState;
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    document.title = 'Hasil Simulasi Donasi — OpenDonasi';
    window.scrollTo(0, 0);
  }, []);

  // Format tanggal & waktu lokal yang aman
  const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return formatDate(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return formatDate(isoString);
    }
  };

  // Salin ID transaksi demo
  const handleCopyId = () => {
    if (!transaction?.transactionId) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(transaction.transactionId).then(() => {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      });
    }
  };

  // State C: Data transaksi rusak atau parsing gagal
  if (isCorrupted) {
    return (
      <div className="w-full py-12 md:py-20">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Data Transaksi Tidak Valid</h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
              Format data simulasi transaksi yang tersimpan tidak lengkap atau mengalami kerusakan saat dibaca.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/program" className="w-full sm:w-auto">
                <Button variant="primary" size="md" isFullWidth>
                  Lihat Program Lain
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

  // State B: Data transaksi tidak tersedia (akses langsung tanpa transaksi)
  if (!transaction) {
    return (
      <div className="w-full py-12 md:py-20">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Belum Ada Transaksi Simulasi</h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
              Halaman ini menampilkan ringkasan simulasi transaksi yang baru saja diselesaikan. Silakan pilih salah satu program donasi untuk mencoba alur transaksi demo.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
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
        </Container>
      </div>
    );
  }

  // State A: Data transaksi simulasi tersedia
  return (
    <div className="w-full py-6 md:py-12 bg-background min-h-screen">
      <Container>
        <div className="w-full max-w-3xl mx-auto">
          {/* Card Tunggal Bukti Transaksi Simulasi Berhasil (Maksimal 1320px Container) */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
            {/* Indikator Status Simulasi Sukses (Center) */}
            <div className="flex flex-col items-center text-center gap-3 pb-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="flex flex-col items-center text-center">
                <Badge variant="success" size="sm" className="mb-2 font-medium">
                  {transaction.statusLabel || 'Simulasi Berhasil (Demo)'}
                </Badge>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Simulasi Donasi Berhasil
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-md mx-auto">
                  Terima kasih atas partisipasi Anda dalam menguji coba alur donasi OpenDonasi.
                </p>
              </div>
            </div>

            {/* Banner Penjelasan Eksplisit Non-Pembayaran Nyata */}
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3.5 text-xs text-slate-700 text-left space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Catatan Simulasi Prototipe</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Ini adalah simulasi antarmuka frontend. Tidak ada pemotongan saldo rekening atau e-wallet nyata, dan dana kampanye tidak dinaikkan secara riil.
              </p>
            </div>

            {/* Detail Rincian Record Simulasi */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm text-left overflow-hidden bg-white">
              {/* ID Transaksi Demo */}
              <div className="p-3.5 bg-slate-50/80 flex items-center justify-between">
                <span className="text-text-secondary">ID Transaksi Demo</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                  <span>{transaction.transactionId}</span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 text-slate-400 hover:text-primary rounded transition-colors cursor-pointer"
                    title="Salin ID Transaksi"
                    aria-label="Salin ID Transaksi"
                  >
                    {copiedId ? (
                      <span className="text-[10px] font-sans text-emerald-600 font-semibold">Tersalin!</span>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Waktu Transaksi */}
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-text-secondary">Waktu Simulasi</span>
                <span className="text-slate-800 font-medium">
                  {formatDateTime(transaction.createdAt || transaction.date)}
                </span>
              </div>

              {/* Program Donasi */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <span className="text-text-secondary shrink-0">Program Donasi</span>
                <strong className="text-slate-900 text-right truncate">
                  {transaction.campaignTitle}
                </strong>
              </div>

              {/* Nominal Donasi */}
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-text-secondary">Nominal Donasi</span>
                <strong className="text-base font-bold text-primary">
                  {formatRupiah(transaction.amount)}
                </strong>
              </div>

              {/* Metode Pembayaran */}
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-text-secondary">Metode Pembayaran</span>
                <span className="text-slate-800 font-medium">
                  {transaction.paymentMethod || 'QRIS (Simulasi)'}
                </span>
              </div>

              {/* Identitas Donatur */}
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-text-secondary">Identitas Donatur</span>
                <span className="text-slate-800 font-medium">
                  {transaction.isAnonymous ? 'Hamba Allah (Anonim)' : transaction.donorName}
                </span>
              </div>

              {/* Email Donatur */}
              {transaction.donorEmail && (
                <div className="p-3.5 flex items-center justify-between">
                  <span className="text-text-secondary">Alamat Email</span>
                  <span className="text-slate-700">{transaction.donorEmail}</span>
                </div>
              )}

              {/* Doa / Pesan Kebaikan */}
              {transaction.doa && (
                <div className="p-3.5 space-y-1">
                  <span className="text-text-secondary block">Doa / Pesan Kebaikan:</span>
                  <p className="italic text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                    "{transaction.doa}"
                  </p>
                </div>
              )}

              {/* Status Transaksi */}
              <div className="p-3.5 bg-slate-50/80 flex items-center justify-between">
                <span className="text-text-secondary">Status Sistem</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                  <span>Tercatat di Simulasi Demo</span>
                </span>
              </div>
            </div>

            {/* Tindakan Lanjutan */}
            <div className="pt-2 space-y-3">
              {transaction.campaignSlug && (
                <Link to={`/program/${transaction.campaignSlug}`} className="block w-full">
                  <Button variant="primary" size="lg" isFullWidth className="font-bold shadow-xs py-3 text-xs sm:text-sm">
                    Kembali ke Halaman Program
                  </Button>
                </Link>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Link to="/program" className="w-full">
                  <Button variant="outline" size="md" isFullWidth className="text-xs">
                    Jelajahi Program Lain
                  </Button>
                </Link>
                <Link to="/donasi-saya" className="w-full">
                  <Button variant="outline" size="md" isFullWidth className="text-xs">
                    Lihat Riwayat Donasi
                  </Button>
                </Link>
              </div>

              <div className="pt-2 text-center">
                <Link to="/" className="text-xs text-text-secondary hover:text-primary transition-colors font-medium">
                  ← Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default DonationResultPage;
