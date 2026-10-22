// Halaman 404 (Halaman Tidak Ditemukan) OpenDonasi.

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function NotFoundPage() {
  useEffect(() => {
    document.title = '404 — Halaman Tidak Ditemukan — OpenDonasi';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full py-12 md:py-20">
      <Container>
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-border p-8 sm:p-10 shadow-xs space-y-5">
          {/* Ikon 404 */}
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <Badge variant="error" size="sm">
              Error 404
            </Badge>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Halaman yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat tautan yang Anda masukkan kurang tepat.
            </p>
          </div>

          {/* Tombol Aksi Ramah */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" size="md" isFullWidth className="font-bold">
                Kembali ke Beranda
              </Button>
            </Link>
            <Link to="/program" className="w-full sm:w-auto">
              <Button variant="outline" size="md" isFullWidth>
                Lihat Semua Program
              </Button>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-text-secondary">
              Butuh bantuan? Kunjungi halaman{' '}
              <Link to="/faq" className="text-primary hover:underline font-semibold">
                FAQ & Tanya Jawab
              </Link>{' '}
              kami.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default NotFoundPage;
