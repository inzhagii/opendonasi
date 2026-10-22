// Halaman informasi Tentang OpenDonasi (/tentang).

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function AboutPage() {
  useEffect(() => {
    document.title = 'Tentang OpenDonasi — Digital Giving Infrastructure';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full py-6 md:py-12">
      <Container>
        {/* Kontainer Utama Terpusat (Maksimal 1320px di Desktop) */}
        <div className="max-w-desktop mx-auto w-full space-y-8">
          {/* Header Utama Halaman */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" size="sm">
                Prototype Platform
              </Badge>
              <span className="text-xs text-text-secondary font-medium">
                Digital Giving Infrastructure
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Tentang OpenDonasi
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              OpenDonasi adalah prototype antarmuka platform penggalangan dana digital yang dirancang untuk memudahkan masyarakat menemukan program kebaikan, mempelajari transparansi penyaluran, serta mencoba simulasi donasi secara aman dan transparan.
            </p>
          </div>

          {/* Seksi 1: Apa itu OpenDonasi? */}
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Apa itu OpenDonasi?
            </h2>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                OpenDonasi hadir sebagai konsep infrastruktur filantropi digital terpadu di Indonesia. Platform ini memfasilitasi akses terpusat bagi donatur untuk mendukung berbagai inisiatif sosial, mencakup bantuan tanggap darurat bencana, pembangunan sarana pendidikan dan pesantren, operasional ambulans gratis, serta layanan ibadah sosial seperti Zakat, Infaq, Sedekah, dan Wakaf.
              </p>
              <p>
                Melalui antarmuka yang bersih, modern, dan mudah dipahami, OpenDonasi mengedepankan kemudahan penelusuran program serta kejelasan informasi tujuan donasi agar setiap bentuk kepedulian dapat tersampaikan dengan tepat sasaran.
              </p>
            </div>
          </div>

          {/* Seksi 2: Alur dan Cara Kerja Prototype */}
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Cara Kerja dan Alur Eksplorasi Prototype
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Anda dapat menguji dan merasakan seluruh alur pengalaman pengguna donasi digital dalam 4 langkah terstruktur:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Langkah 1 */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Jelajahi & Pilih Program
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  Temukan program kemanusiaan melalui katalog lengkap, bilah pencarian kata kunci, atau landing page layanan tematik (Zakat, Infaq, Sedekah, Wakaf).
                </p>
              </div>

              {/* Langkah 2 */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Pelajari Transparansi Penyaluran
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  Tinjau deskripsi urgensi, target donasi, batas waktu penggalangan, serta informasi yayasan atau lembaga penyelenggara yang terverifikasi.
                </p>
              </div>

              {/* Langkah 3 */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Coba Formulir Simulasi Donasi
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  Pilih nominal preset cepat atau masukkan angka manual, lengkapi identitas, tuliskan doa kebaikan, dan aktifkan opsi privasi anonim <em>Hamba Allah</em>.
                </p>
              </div>

              {/* Langkah 4 */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Pantau Hasil & Riwayat Simulasi
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  Periksa nomor referensi transaksi simulasi (OD-XXXXXX), tinjau bukti hasil transaksi demo, serta pantau riwayat lengkap di halaman Donasi Saya.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi 3: Status Prototype & Batasan Transaksi */}
          <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-6 sm:p-7 text-slate-700 space-y-3">
            <div className="flex items-center gap-2 font-bold text-primary text-sm sm:text-base">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Catatan Penting: Status Prototype Demonstrasi</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed list-disc list-inside">
              <li>
                <strong>Bukan Pembayaran Nyata:</strong> Seluruh transaksi yang dilakukan pada situs ini adalah simulasi antarmuka frontend. Tidak ada penarikan dana dari rekening bank, dompet digital, atau kartu pembayaran Anda.
              </li>
              <li>
                <strong>Penyimpanan Lokal:</strong> Profil akun demo dan riwayat donasi disimpan secara lokal pada sesi peramban Anda (<em>sessionStorage</em>) untuk kebutuhan demonstrasi alur tanpa menghubungkan database server riil.
              </li>
              <li>
                <strong>Data Program & Ilustrasi:</strong> Program kebaikan, nama penggalang, dan dokumentasi visual yang ditampilkan merupakan data percontohan (<em>dummy mock</em>) untuk menguji responsivitas dan kenyamanan antarmuka pengguna.
              </li>
            </ul>
          </div>

          {/* Seksi 4: Ajakan Bertindak (CTA) */}
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 text-center shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Siap Menjelajahi Program Kebaikan?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Telusuri beragam inisiatif sosial dan coba alur simulasi donasi untuk merasakan pengalaman berdonasi digital di OpenDonasi.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/program" className="w-full sm:w-auto">
                <Button variant="primary" size="md" isFullWidth className="font-bold">
                  Jelajahi Semua Program
                </Button>
              </Link>
              <Link to="/faq" className="w-full sm:w-auto">
                <Button variant="outline" size="md" isFullWidth>
                  Baca FAQ & Tanya Jawab
                </Button>
              </Link>
              <Link to="/kontak" className="w-full sm:w-auto">
                <Button variant="outline" size="md" isFullWidth>
                  Panduan Bantuan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default AboutPage;
