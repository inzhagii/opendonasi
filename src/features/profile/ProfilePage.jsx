// Halaman profil pengguna demo OpenDonasi (/profil).

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useDonation } from '../../hooks/useDonation';
import { formatRupiah } from '../../lib/formatters';

export function ProfilePage() {
  const { currentUser, donations, clearDonations, resetToInitialDonations } = useDonation();
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Filter transaksi yang valid
  const validDonations = Array.isArray(donations)
    ? donations.filter((d) => d && typeof d === 'object' && d.transactionId)
    : [];

  // Hitung total akumulasi donasi simulasi
  const totalAmount = validDonations.reduce((sum, d) => {
    return sum + (typeof d.amount === 'number' && !isNaN(d.amount) ? d.amount : 0);
  }, 0);

  // Hitung donasi berstatus berhasil
  const successDonationsCount = validDonations.filter(
    (d) => d.status === 'success'
  ).length;

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleClearHistory = () => {
    clearDonations();
    showFeedback('Riwayat donasi simulasi telah dikosongkan (Empty State siap diuji).');
  };

  const handleResetHistory = () => {
    resetToInitialDonations();
    showFeedback('Riwayat donasi simulasi telah di-reset ke data demonstrasi awal.');
  };

  return (
    <div className="w-full py-6 md:py-10">
      <Container>
        {/* Navigasi Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-text-secondary truncate">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text-primary font-medium" aria-current="page">
              Profil Saya
            </li>
          </ol>
        </nav>

        {/* Kontainer Utama Terpusat */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Feedback Notifikasi Aksi */}
          {feedbackMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{feedbackMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackMsg(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* 1. Header & Identitas Pengguna Demo */}
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5 sm:gap-4">
                {/* Avatar Dummy Bulat */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 border-2 border-primary/20 text-primary flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                      {currentUser?.name || 'Donatur Demo'}
                    </h1>
                    <Badge variant="primary" size="sm">
                      Profil Demo
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                    {currentUser?.email || 'donatur.demo@opendonasi.id.demo'}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Penyimpanan Lokal Browser
                </span>
              </div>
            </div>

            {/* Keterangan Eksplisit Akun Demo */}
            <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Akun Demonstrasi Prototype</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Profil ini merupakan bagian dari pengujian frontend OpenDonasi. Tidak diperlukan kata sandi atau autentikasi sungguhan. Seluruh data transaksi tersimpan secara lokal pada sesi browser Anda.
              </p>
            </div>
          </div>

          {/* 2. Ringkasan Aktivitas Donasi Simulasi */}
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Ringkasan Aktivitas Donasi
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                Simulasi Lokal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Metrik 1: Total Transaksi */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <span className="text-xs text-text-secondary block mb-1">
                  Total Transaksi
                </span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">
                  {validDonations.length}
                  <span className="text-xs font-normal text-text-secondary ml-1">transaksi</span>
                </div>
                <span className="text-[10px] text-text-secondary mt-1 block">
                  {successDonationsCount} berhasil (simulasi)
                </span>
              </div>

              {/* Metrik 2: Total Donasi Tersalurkan */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 sm:col-span-2">
                <span className="text-xs text-text-secondary block mb-1">
                  Total Donasi Simulasi
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-primary">
                  {formatRupiah(totalAmount)}
                </div>
                <span className="text-[10px] text-text-secondary mt-1 block">
                  *Akumulasi nilai simulasi demonstrasi (bukan penarikan dana nyata)
                </span>
              </div>
            </div>
          </div>

          {/* 3. Akses Utama ke Donasi Saya (/donasi-saya) */}
          <Link
            to="/donasi-saya"
            className="block group bg-white rounded-2xl border border-border hover:border-primary/50 p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      Donasi Saya
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-soft text-primary">
                      {validDonations.length} Transaksi
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                    Lihat daftar riwayat lengkap transaksi simulasi, rincian doa, dan status.
                  </p>
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* 4. Menu Navigasi Akun Prototype (Sesuai OPENDONASI_IMPLEMENTATION_PLAN) */}
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              Pusat Informasi & Bantuan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Link
                to="/faq"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-slate-50 transition-colors text-xs sm:text-sm text-slate-700 font-medium"
              >
                <span>FAQ & Bantuan</span>
                <span className="text-slate-400 text-xs">→</span>
              </Link>
              <Link
                to="/kontak"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-slate-50 transition-colors text-xs sm:text-sm text-slate-700 font-medium"
              >
                <span>Kontak Layanan</span>
                <span className="text-slate-400 text-xs">→</span>
              </Link>
              <Link
                to="/tentang"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-slate-50 transition-colors text-xs sm:text-sm text-slate-700 font-medium"
              >
                <span>Tentang OpenDonasi</span>
                <span className="text-slate-400 text-xs">→</span>
              </Link>
            </div>
          </div>

          {/* 5. Utilitas Pengujian Demo (Reset & Empty State Trigger) */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Utilitas Pengujian Prototype
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Tahap 5 QA</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gunakan opsi berikut untuk menguji variasi state pada halaman profil dan riwayat donasi.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleClearHistory}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-xs font-medium text-slate-700 transition-colors"
              >
                Kosongkan Riwayat (Uji Empty State)
              </button>
              <button
                type="button"
                onClick={handleResetHistory}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
              >
                Reset ke Data Awal Demo
              </button>
              <Link to="/program">
                <Button variant="outline" size="sm">
                  Jelajahi Program Kebaikan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ProfilePage;
