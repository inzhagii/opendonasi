import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo/logo.png';
import awardsBadgeImg from '../../assets/icons/icons_footer/Vector.png';

import iconFb from '../../assets/icons/icons_footer/facebook.svg';
import iconIg from '../../assets/icons/icons_footer/instagram.svg';
import iconTiktok from '../../assets/icons/icons_footer/tiktok.svg';
import iconX from '../../assets/icons/icons_footer/X.svg';
import iconYt from '../../assets/icons/icons_footer/youtube.svg';
import { Container } from '../ui/Container';

export function Footer() {
  return (
    <footer className="bg-background-soft border-t border-border mt-auto">
      {/* ===== DESKTOP FOOTER (md:block) ===== */}
      <div className="hidden md:block py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Kolom 1: Profil Brand & Badges (5 Kolom Grid) */}
            <div className="md:col-span-5 flex flex-col items-start">
              <Link to="/" className="mb-4 inline-block" aria-label="Beranda OpenDonasi">
                <img src={logoImg} alt="OpenDonasi Logo" className="h-9 w-auto object-contain" />
              </Link>
              <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-sm">
                OpenDonasi adalah prototype infrastruktur penggalangan dana digital yang menjembatani para donatur dengan yayasan sosial terpercaya di Indonesia.
              </p>

              {/* Penghargaan & Akreditasi */}
              <div className="w-full max-w-md pt-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary/80 mb-2">
                  Penghargaan & Akreditasi Mitra
                </span>
                <img
                  src={awardsBadgeImg}
                  alt="Daftar Penghargaan OpenDonasi Mitra"
                  className="h-10 w-auto object-contain opacity-90"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Kolom 2: Program & Layanan (3 Kolom Grid) */}
            <div className="md:col-span-3">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                Program & Layanan
              </h4>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                <li>
                  <Link to="/program" className="hover:text-primary transition-colors">
                    Semua Program Donasi
                  </Link>
                </li>
                <li>
                  <Link to="/zakat" className="hover:text-primary transition-colors">
                    Layanan Zakat & Kalkulator
                  </Link>
                </li>
                <li>
                  <Link to="/infaq" className="hover:text-primary transition-colors">
                    Infaq Kemaslahatan Umat
                  </Link>
                </li>
                <li>
                  <Link to="/sedekah" className="hover:text-primary transition-colors">
                    Sedekah Pangan & Rutin
                  </Link>
                </li>
                <li>
                  <Link to="/wakaf" className="hover:text-primary transition-colors">
                    Wakaf Sarana Produktif
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Bantuan & Info (2 Kolom Grid) */}
            {/* Catatan Kritis: Donasi Saya TIDAK ditempatkan di sini, akses hanya via Profil/Akun */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                Bantuan & Info
              </h4>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                <li>
                  <Link to="/tentang" className="hover:text-primary transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-primary transition-colors">
                    FAQ (Tanya Jawab)
                  </Link>
                </li>
                <li>
                  <Link to="/kontak" className="hover:text-primary transition-colors">
                    Kontak Bantuan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Media Sosial (2 Kolom Grid) */}
            <div className="md:col-span-2 flex flex-col items-start">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                Ikuti Kami
              </h4>
              <div className="flex flex-wrap gap-2.5 mb-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
                  aria-label="Facebook OpenDonasi"
                >
                  <img src={iconFb} alt="" className="w-4 h-4 opacity-75" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
                  aria-label="Instagram OpenDonasi"
                >
                  <img src={iconIg} alt="" className="w-4 h-4 opacity-75" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
                  aria-label="TikTok OpenDonasi"
                >
                  <img src={iconTiktok} alt="" className="w-4 h-4 opacity-75" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
                  aria-label="X Twitter OpenDonasi"
                >
                  <img src={iconX} alt="" className="w-4 h-4 opacity-75" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
                  aria-label="YouTube OpenDonasi"
                >
                  <img src={iconYt} alt="" className="w-4 h-4 opacity-75" />
                </a>
              </div>

              <div className="text-xs text-text-secondary/80">
                <p className="font-semibold text-text-primary">Prototype Frontend</p>
                <p>Simulasi transaksi donasi lokal.</p>
              </div>
            </div>
          </div>

          {/* Copyright Bar Desktop */}
          <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-text-secondary gap-3">
            <p>© 2026 OpenDonasi. Seluruh hak cipta dilindungi.</p>
            <p>Dibuat untuk demonstrasi prototype platform kebaikan digital.</p>
          </div>
        </Container>
      </div>

      {/* ===== MOBILE FOOTER RINGKAS (md:hidden) ===== */}
      <div className="block md:hidden py-8 px-4 text-center">
        <Link to="/" className="inline-block mb-3" aria-label="Beranda OpenDonasi">
          <img src={logoImg} alt="OpenDonasi" className="h-7 w-auto mx-auto object-contain" />
        </Link>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto mb-4">
          Digital Giving Infrastructure — Prototype Website Donasi.
        </p>

        {/* Media Sosial Ringkas Mobile */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <img src={iconFb} alt="" className="w-4 h-4 opacity-70" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <img src={iconIg} alt="" className="w-4 h-4 opacity-70" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <img src={iconTiktok} alt="" className="w-4 h-4 opacity-70" />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
            <img src={iconX} alt="" className="w-4 h-4 opacity-70" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <img src={iconYt} alt="" className="w-4 h-4 opacity-70" />
          </a>
        </div>

        <div className="pt-3 border-t border-border text-[11px] text-text-secondary/75">
          <p>© 2026 OpenDonasi. Prototype Frontend.</p>
        </div>
      </div>
    </footer>
  );
}
