// Halaman kontak dan panduan bantuan OpenDonasi (/kontak).

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function ContactPage() {
  useEffect(() => {
    document.title = 'Kontak Bantuan — OpenDonasi';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full py-6 md:py-12">
      <Container>
        {/* Kontainer Utama Terpusat */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Utama */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                Panduan Bantuan
              </Badge>
              <span className="text-xs text-text-secondary font-medium">
                Pusat Informasi Pengguna
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Kontak & Panduan Bantuan
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Informasi panduan eksplorasi prototype, pemecahan kendala teknis mandiri, dan penjelasan status layanan OpenDonasi.
            </p>
          </div>

          {/* Seksi 1: Status Layanan & Dukungan (Penjelasan Jujur Sesuai Spec) */}
          <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-6 sm:p-7 text-slate-700 space-y-3">
            <div className="flex items-center gap-2 font-bold text-primary text-sm sm:text-base">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Status Dukungan Prototype</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              OpenDonasi saat ini beroperasi sebagai <strong>prototype antarmuka frontend</strong> untuk pengujian alur donasi digital. Oleh karena itu, platform ini belum menyediakan layanan pelanggan (customer support) operasional 24 jam secara riil, formulir pengiriman tiket, maupun saluran obrolan langsung (live chat).
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Seluruh kendala dan pertanyaan umum telah dirangkum dalam panduan mandiri di bawah ini agar Anda dapat menuntaskan pengujian alur demo dengan mudah.
            </p>
          </div>

          {/* Seksi 2: Bantuan Mandiri Terstruktur (Self-Service Help) */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Pusat Bantuan Mandiri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Kartu 1: FAQ */}
              <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Tanya Jawab (FAQ)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Temukan 10 jawaban lengkap seputar cara kerja simulasi, donasi anonim, dan transparansi data.
                  </p>
                </div>
                <Link to="/faq" className="pt-2 block">
                  <Button variant="outline" size="sm" isFullWidth>
                    Buka Halaman FAQ →
                  </Button>
                </Link>
              </div>

              {/* Kartu 2: Katalog Program */}
              <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Katalog Program
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Lihat seluruh daftar program kebaikan kemanusiaan, pendidikan, dan tanggap bencana.
                  </p>
                </div>
                <Link to="/program" className="pt-2 block">
                  <Button variant="outline" size="sm" isFullWidth>
                    Jelajahi Program →
                  </Button>
                </Link>
              </div>

              {/* Kartu 3: Riwayat Donasi */}
              <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Riwayat Donasi Saya
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Tinjau transaksi simulasi lokal yang pernah Anda selesaikan pada perangkat ini.
                  </p>
                </div>
                <Link to="/donasi-saya" className="pt-2 block">
                  <Button variant="outline" size="sm" isFullWidth>
                    Lihat Donasi Saya →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Seksi 3: Panduan Kendala Umum (Troubleshooting Guide) */}
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Panduan Kendala Umum
            </h2>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {/* Kendala 1 */}
              <div className="py-3.5 space-y-1">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary font-bold">1.</span>
                  Halaman atau tautan program tidak ditemukan (404)
                </h3>
                <p className="text-slate-600 leading-relaxed pl-5">
                  Jika tautan tidak dapat dibuka atau mengarah ke halaman 404, kembali ke <Link to="/" className="text-primary hover:underline font-semibold">Beranda</Link> atau buka halaman <Link to="/program" className="text-primary hover:underline font-semibold">Katalog Program</Link> untuk memilih program yang terdaftar dalam dataset resmi.
                </p>
              </div>

              {/* Kendala 2 */}
              <div className="py-3.5 space-y-1">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary font-bold">2.</span>
                  Data riwayat donasi kosong atau hilang setelah menutup peramban
                </h3>
                <p className="text-slate-600 leading-relaxed pl-5">
                  Riwayat donasi disimpan pada <em>sessionStorage</em> peramban Anda. Jika Anda menutup tab peramban atau menggunakan mode penyamaran (Incognito), data transaksi baru dapat ter-reset. Anda dapat memulihkan dataset contoh awal kapan saja melalui tombol "Reset ke Data Awal Demo" pada halaman <Link to="/profil" className="text-primary hover:underline font-semibold">Profil Saya</Link>.
                </p>
              </div>

              {/* Kendala 3 */}
              <div className="py-3.5 space-y-1">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary font-bold">3.</span>
                  Transaksi simulasi belum muncul pada riwayat donasi
                </h3>
                <p className="text-slate-600 leading-relaxed pl-5">
                  Pastikan Anda telah menyelesaikan alur donasi hingga menekan tombol "Konfirmasi Simulasi Donasi" pada langkah peninjauan. Transaksi simulasi hanya diterbitkan dan dicatat ketika konfirmasi telah disetujui.
                </p>
              </div>

              {/* Kendala 4 */}
              <div className="py-3.5 space-y-1">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary font-bold">4.</span>
                  Tampilan antarmuka tidak merespons atau memerlukan pemulihan
                </h3>
                <p className="text-slate-600 leading-relaxed pl-5">
                  Silakan muat ulang (refresh) halaman peramban Anda. Aplikasi dibangun dengan state yang aman sehingga proses refresh tidak akan merusak alur navigasi atau menghapus sesi kerja Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi 4: Informasi Pengembangan & CTA */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 sm:p-8 text-center space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Infrastruktur Kebaikan Digital Terbuka
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              OpenDonasi dikembangkan sebagai purwarupa (prototype) antarmuka yang mengutamakan keterbukaan, kemudahan akses, dan pengalaman berdonasi yang ramah pengguna.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/tentang" className="w-full sm:w-auto">
                <Button variant="primary" size="md" isFullWidth className="font-bold">
                  Pelajari Lebih Lanjut Tentang Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ContactPage;
