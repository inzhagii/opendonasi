// Halaman formulir donasi OpenDonasi (/donasi/:slug).

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CAMPAIGNS } from '../../data/campaigns';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../lib/formatters';
import { useDonation } from '../../hooks/useDonation';
import { getOrganizerSlug } from '../../data/organizers';

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000];
const MIN_AMOUNT = 10000;

export function DonationFormPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addDonation, currentUser } = useDonation();

  // Cari data kampanye berdasarkan slug
  const campaign = useMemo(() => {
    return CAMPAIGNS.find((c) => c.slug === slug);
  }, [slug]);

  // Alur langkah: 'form' (pengisian) | 'confirm' (pratinjau ringkasan)
  const [step, setStep] = useState('form');

  // Baca nominal awal dari query parameter (misal dari kalkulator zakat)
  const initialAmount = useMemo(() => {
    const qAmount = searchParams.get('amount');
    if (qAmount) {
      const cleanNum = parseInt(qAmount.replace(/\D/g, ''), 10);
      if (cleanNum && cleanNum >= 1000) {
        return String(cleanNum);
      }
    }
    return '50000';
  }, [searchParams]);

  // State formulir
  const [selectedPreset, setSelectedPreset] = useState(() => {
    const num = parseInt(initialAmount, 10);
    return PRESET_AMOUNTS.includes(num) ? num : null;
  });
  const [nominalInput, setNominalInput] = useState(initialAmount);
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorPrayer, setDonorPrayer] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set document title untuk SEO
  useEffect(() => {
    if (campaign) {
      document.title = `Donasi untuk ${campaign.title} — OpenDonasi`;
    } else {
      document.title = 'Program Donasi Tidak Ditemukan — OpenDonasi';
    }
    window.scrollTo(0, 0);
  }, [campaign]);

  // Handler pemilihan nominal preset
  const handleSelectPreset = (amount) => {
    setSelectedPreset(amount);
    setNominalInput(String(amount));
    if (errors.nominal) {
      setErrors((prev) => ({ ...prev, nominal: null }));
    }
  };

  // Handler input nominal manual
  const handleNominalChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setNominalInput(rawVal);

    const numVal = parseInt(rawVal, 10);
    if (PRESET_AMOUNTS.includes(numVal)) {
      setSelectedPreset(numVal);
    } else {
      setSelectedPreset(null);
    }

    if (errors.nominal) {
      setErrors((prev) => ({ ...prev, nominal: null }));
    }
  };

  // Validasi formulir donasi
  const validateForm = () => {
    const errs = {};
    const amount = parseInt(nominalInput, 10);

    if (!nominalInput || isNaN(amount)) {
      errs.nominal = 'Nominal donasi wajib diisi';
    } else if (amount < MIN_AMOUNT) {
      errs.nominal = `Nominal donasi minimal ${formatRupiah(MIN_AMOUNT)}`;
    }

    if (!donorName.trim()) {
      errs.name = 'Nama donatur wajib diisi';
    } else if (donorName.trim().length < 2) {
      errs.name = 'Nama donatur minimal 2 karakter';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!donorEmail.trim()) {
      errs.email = 'Alamat email wajib diisi';
    } else if (!emailPattern.test(donorEmail.trim())) {
      errs.email = 'Format alamat email tidak valid';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handler lanjut ke ringkasan konfirmasi
  const handleProceedToConfirm = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('confirm');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handler kembali mengubah formulir
  const handleBackToForm = () => {
    setStep('form');
  };

  // Handler konfirmasi simulasi transaksi
  const handleConfirmSimulation = () => {
    if (isSubmitting || !campaign) return;

    setIsSubmitting(true);
    const amount = parseInt(nominalInput, 10);

    const transaction = {
      transactionId: `OD-${Math.floor(100000 + Math.random() * 900000)}`,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      campaignSlug: campaign.slug,
      campaignImage: campaign.image,
      serviceType: campaign.serviceType || 'donasi',
      amount,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      status: 'success',
      statusLabel: 'Simulasi Berhasil (Demo)',
      isAnonymous,
      donorName: isAnonymous ? 'Hamba Allah' : donorName.trim(),
      actualName: donorName.trim(),
      donorEmail: donorEmail.trim(),
      doa: donorPrayer.trim(),
      paymentMethod: 'Simulasi Frontend',
    };

    try {
      // Simpan di konteks donasi lokal dan sessionStorage transaksi terbaru
      addDonation(transaction);
      sessionStorage.setItem('opendonasi_latest_transaction', JSON.stringify(transaction));
    } catch {
      // Fallback aman jika storage gagal
    }

    // Arahkan ke halaman hasil donasi
    navigate('/hasil-donasi', { replace: true });
  };

  // Fallback jika kampanye tidak ditemukan
  if (!campaign) {
    return (
      <div className="w-full py-12 md:py-20">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-border p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-text-secondary mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-text-primary">Program Tidak Ditemukan</h1>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Program donasi yang ingin Anda dukung tidak tersedia atau tautan tidak valid.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/program" className="w-full sm:w-auto">
                <Button variant="primary" size="md" isFullWidth>
                  Lihat Semua Program
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

  const currentAmount = parseInt(nominalInput, 10) || 0;

  return (
    <div className="w-full py-6 md:py-10">
      <Container>
        {/* Tombol Kembali Sederhana */}
        <div className="mb-6">
          <Link
            to={`/program/${campaign.slug}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-primary transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Detail Program</span>
          </Link>
        </div>

        {/* Layout Utama: Desktop Dua Kolom, Mobile Satu Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* KOLOM KIRI: Informasi Ringkas Kampanye */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-xs space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block">
                Program yang Didukung
              </span>

              {/* Thumbnail Kampanye 16:9 */}
              <div className="relative overflow-hidden bg-slate-100 rounded-xl aspect-[16/9] w-full border border-slate-100">
                {campaign.image ? (
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className={`w-full h-full ${
                      campaign.isImagePoster ? 'object-contain bg-slate-900/5' : 'object-cover'
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">
                    OpenDonasi
                  </div>
                )}
              </div>

              {/* Judul & Penggalang */}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {campaign.title}
                </h2>
                <p className="mt-1.5 text-xs text-text-secondary flex items-center gap-1.5">
                  <Link
                    to={`/penggalang/${getOrganizerSlug(campaign.organizer?.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline transition-colors font-medium inline-flex items-center gap-1"
                    title={`Lihat profil ${campaign.organizer?.name || 'yayasan mitra'} (tab baru)`}
                  >
                    <span>{campaign.organizer?.name || 'Yayasan Mitra OpenDonasi'}</span>
                    <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </p>
              </div>

              {/* Deskripsi Singkat */}
              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {campaign.description}
              </p>

              {/* Link Kembali ke Detail */}
              <div className="pt-2">
                <Link
                  to={`/program/${campaign.slug}`}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Lihat Detail Lengkap Program</span>
                </Link>
              </div>
            </div>

            {/* Banner Penjelasan Simulasi Demo */}
            <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Simulasi Donasi Demo</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Alur ini merupakan pengujian frontend prototipe. Tidak ada pembayaran uang nyata atau integrasi gateway pembayaran.
              </p>
            </div>
          </div>

          {/* KOLOM KANAN: Formulir Donasi / Konfirmasi */}
          <div className="lg:col-span-7">
            {step === 'form' ? (
              /* LANGKAH 1: Pengisian Formulir */
              <form onSubmit={handleProceedToConfirm} className="bg-white rounded-2xl border border-border p-5 sm:p-7 shadow-xs space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Formulir Donasi
                  </h1>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1">
                    Tentukan nominal donasi dan lengkapi data donatur Anda.
                  </p>
                </div>

                {/* 1. Pilihan Nominal Preset */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pilih Nominal Donasi
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PRESET_AMOUNTS.map((amt) => {
                      const isSelected = selectedPreset === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleSelectPreset(amt)}
                          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'bg-white text-slate-700 border-border hover:border-primary/40 hover:bg-slate-50'
                          }`}
                        >
                          {formatRupiah(amt)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Input Nominal Sendiri */}
                <div className="space-y-1.5">
                  <label htmlFor="nominal-manual" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Atau Masukkan Nominal Lain (Rp)
                  </label>
                  <div className="relative rounded-xl">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-sm text-slate-500 pointer-events-none">
                      Rp
                    </span>
                    <input
                      id="nominal-manual"
                      type="text"
                      inputMode="numeric"
                      value={nominalInput ? parseInt(nominalInput, 10).toLocaleString('id-ID') : ''}
                      onChange={handleNominalChange}
                      placeholder="Contoh: 50.000"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm sm:text-base font-bold text-slate-900 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.nominal ? 'border-error focus:ring-error' : 'border-border'
                      }`}
                    />
                  </div>
                  {errors.nominal ? (
                    <p className="text-xs text-error mt-1">{errors.nominal}</p>
                  ) : (
                    <p className="text-[11px] text-text-secondary mt-1">
                      Minimal donasi {formatRupiah(MIN_AMOUNT)} (simulasi)
                    </p>
                  )}
                </div>

                {/* 3. Data Donatur */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Informasi Donatur
                  </span>

                  {/* Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label htmlFor="donor-name" className="block text-xs font-medium text-slate-700">
                      Nama Lengkap <span className="text-error">*</span>
                    </label>
                    <input
                      id="donor-name"
                      type="text"
                      value={donorName}
                      onChange={(e) => {
                        setDonorName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                      }}
                      placeholder="Masukkan nama Anda..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.name ? 'border-error focus:ring-error' : 'border-border'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                  </div>

                  {/* Opsi Donasi Anonim */}
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-primary focus:ring-primary rounded border-slate-300"
                    />
                    <span>Sembunyikan nama saya (Tampilkan sebagai <strong>Hamba Allah</strong>)</span>
                  </label>

                  {/* Email Donatur */}
                  <div className="space-y-1.5">
                    <label htmlFor="donor-email" className="block text-xs font-medium text-slate-700">
                      Alamat Email <span className="text-error">*</span>
                    </label>
                    <input
                      id="donor-email"
                      type="email"
                      value={donorEmail}
                      onChange={(e) => {
                        setDonorEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                      }}
                      placeholder="nama@email.com"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.email ? 'border-error focus:ring-error' : 'border-border'
                      }`}
                    />
                    {errors.email ? (
                      <p className="text-xs text-error mt-1">{errors.email}</p>
                    ) : (
                      <p className="text-[11px] text-text-secondary mt-1">
                        Kabar penyaluran simulasi akan diasosiasikan dengan email ini.
                      </p>
                    )}
                  </div>

                  {/* Doa / Pesan Dukungan */}
                  <div className="space-y-1.5">
                    <label htmlFor="donor-prayer" className="block text-xs font-medium text-slate-700">
                      Doa atau Pesan Dukungan <span className="text-text-secondary">(Opsional)</span>
                    </label>
                    <textarea
                      id="donor-prayer"
                      rows={3}
                      value={donorPrayer}
                      onChange={(e) => setDonorPrayer(e.target.value)}
                      maxLength={250}
                      placeholder="Tuliskan doa atau pesan kebaikan untuk penerima manfaat..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-400"
                    />
                    <div className="text-right text-[10px] text-text-secondary">
                      {donorPrayer.length}/250 karakter
                    </div>
                  </div>
                </div>

                {/* 4. Ringkasan Donasi */}
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Nominal Donasi</span>
                    <strong className="text-slate-800">{formatRupiah(currentAmount)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Biaya Layanan Platform</span>
                    <span className="text-emerald-700 font-semibold">Rp0 (Demo)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm sm:text-base font-bold text-slate-900">
                    <span>Total Donasi</span>
                    <span className="text-primary">{formatRupiah(currentAmount)}</span>
                  </div>
                </div>

                {/* Tombol Lanjutkan */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isFullWidth
                  className="font-bold shadow-xs"
                >
                  Lanjutkan ke Konfirmasi
                </Button>
              </form>
            ) : (
              /* LANGKAH 2: Ringkasan & Konfirmasi */
              <div className="bg-white rounded-2xl border border-border p-5 sm:p-7 shadow-xs space-y-6">
                <div>
                  <Badge variant="primary" size="sm" className="mb-2">
                    Langkah Konfirmasi
                  </Badge>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Tinjau Ringkasan Donasi
                  </h1>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1">
                    Pastikan rincian donasi simulasi Anda telah sesuai sebelum mengonfirmasi.
                  </p>
                </div>

                {/* Rincian Transaksi */}
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
                  <div className="p-3.5 bg-slate-50/80 flex items-center justify-between">
                    <span className="text-text-secondary">Program Donasi</span>
                    <strong className="text-slate-900 max-w-xs text-right truncate">
                      {campaign.title}
                    </strong>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-text-secondary">Nominal Donasi</span>
                    <strong className="text-base text-primary font-bold">
                      {formatRupiah(currentAmount)}
                    </strong>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-text-secondary">Nama Donatur</span>
                    <strong className="text-slate-900">
                      {isAnonymous ? 'Hamba Allah (Anonim)' : donorName}
                    </strong>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-text-secondary">Email</span>
                    <span className="text-slate-800">{donorEmail}</span>
                  </div>
                  {donorPrayer && (
                    <div className="p-3.5 space-y-1">
                      <span className="text-text-secondary block">Doa / Pesan Kebaikan:</span>
                      <p className="italic text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        "{donorPrayer}"
                      </p>
                    </div>
                  )}
                  <div className="p-3.5 bg-slate-50/80 flex items-center justify-between">
                    <span className="text-text-secondary">Metode Pembayaran</span>
                    <span className="font-semibold text-slate-700">Simulasi Tanpa Bayar (Demo)</span>
                  </div>
                </div>

                {/* Alert Penjelasan Simulasi */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Konfirmasi Transaksi Demo</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Menekan tombol konfirmasi akan menerbitkan satu record simulasi donasi untuk menguji tampilan bukti transaksi dan riwayat donatur demo.
                  </p>
                </div>

                {/* Tombol Aksi Konfirmasi & Kembali */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleBackToForm}
                    disabled={isSubmitting}
                    className="sm:w-1/3"
                  >
                    Ubah Data
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleConfirmSimulation}
                    disabled={isSubmitting}
                    className="sm:w-2/3 font-bold shadow-xs"
                  >
                    {isSubmitting ? 'Memproses Simulasi...' : 'Konfirmasi Simulasi Donasi'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default DonationFormPage;
