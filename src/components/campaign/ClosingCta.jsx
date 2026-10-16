import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

/**
 * ClosingCta (Section CTA Penutup Beranda)
 * Spesifikasi OPENDONASI_SPEC:
 * - Mengajak pengguna mengambil bagian dalam kebaikan.
 * - Desain hangat, terpercaya, dan selaras dengan design system.
 */
export function ClosingCta({ className = '' }) {
  return (
    <section
      aria-labelledby="closing-cta-title"
      className={`w-full bg-gradient-to-br from-primary-soft via-white to-primary-soft/40 rounded-2xl border border-primary/20 p-6 sm:p-8 md:p-12 text-center shadow-sm ${className}`}
    >
      <div className="max-w-2xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          Mulai Kebaikan Sekarang
        </span>
        <h2
          id="closing-cta-title"
          className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary leading-tight"
        >
          Setiap Donasi Kecil Menghadirkan Harapan Besar
        </h2>
        <p className="mt-3 text-sm md:text-base text-text-secondary leading-relaxed">
          Salurkan kepedulian Anda melalui platform demonstrasi OpenDonasi. Bersama-sama, kita ringankan beban saudara-saudara kita yang membutuhkan.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/program" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-sm">
              Donasi Sekarang
            </Button>
          </Link>
          <Link to="/zakat" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white">
              Tunaikan Zakat
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
