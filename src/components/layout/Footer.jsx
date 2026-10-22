// Komponen footer navigasi utama dan informasi platform (OpenDonasi).

import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo/logo.png';

import iconFb from '../../assets/icons/icons_footer/facebook.svg';
import iconIg from '../../assets/icons/icons_footer/instagram.svg';
import iconTiktok from '../../assets/icons/icons_footer/tiktok.svg';
import iconX from '../../assets/icons/icons_footer/X.svg';
import iconYt from '../../assets/icons/icons_footer/youtube.svg';
import { Container } from '../ui/Container';

const SOCIAL_MEDIA_LINKS = [
  { id: 'fb', name: 'Facebook', href: 'https://facebook.com', icon: iconFb, label: 'Facebook OpenDonasi' },
  { id: 'ig', name: 'Instagram', href: 'https://instagram.com', icon: iconIg, label: 'Instagram OpenDonasi' },
  { id: 'tiktok', name: 'TikTok', href: 'https://tiktok.com', icon: iconTiktok, label: 'TikTok OpenDonasi' },
  { id: 'x', name: 'X', href: 'https://x.com', icon: iconX, label: 'X (Twitter) OpenDonasi' },
  { id: 'yt', name: 'YouTube', href: 'https://youtube.com', icon: iconYt, label: 'YouTube OpenDonasi' },
];

export function Footer() {
  return (
    <footer className="bg-background-soft border-t border-border mt-auto">
      {/* ===== DESKTOP FOOTER (md:block) ===== */}
      <div className="hidden md:block py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Kolom 1: Profil Brand (5 Kolom Grid) */}
            <div className="md:col-span-5 flex flex-col items-start">
              <Link to="/" className="mb-4 inline-block" aria-label="Beranda OpenDonasi">
                <img src={logoImg} alt="OpenDonasi Logo" className="h-9 w-auto object-contain" />
              </Link>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 max-w-sm">
                OpenDonasi adalah prototype infrastruktur penggalangan dana digital yang menjembatani para donatur dengan yayasan sosial terpercaya di Indonesia.
              </p>
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
                  {SOCIAL_MEDIA_LINKS.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-8 h-8 rounded-full bg-slate-100 hover:bg-primary border border-slate-200/80 hover:border-primary flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={item.label}
                    >
                      <span
                        className="w-3.5 h-3.5 bg-slate-600 group-hover:bg-white transition-colors block pointer-events-none"
                        style={{
                          maskImage: `url("${item.icon}")`,
                          WebkitMaskImage: `url("${item.icon}")`,
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                        }}
                        aria-hidden="true"
                      />
                    </a>
                  ))}
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
      <div className="block md:hidden py-8 pb-24 px-4 text-center">
        <Link to="/" className="inline-block mb-3" aria-label="Beranda OpenDonasi">
          <img src={logoImg} alt="OpenDonasi" className="h-7 w-auto mx-auto object-contain" />
        </Link>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto mb-4">
          Digital Giving Infrastructure — Prototype Website Donasi.
        </p>

        {/* Navigasi Cepat Mobile */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-text-secondary mb-4">
          <Link to="/program" className="hover:text-primary transition-colors">Program</Link>
          <span aria-hidden="true" className="text-slate-300">•</span>
          <Link to="/tentang" className="hover:text-primary transition-colors">Tentang Kami</Link>
          <span aria-hidden="true" className="text-slate-300">•</span>
          <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
          <span aria-hidden="true" className="text-slate-300">•</span>
          <Link to="/kontak" className="hover:text-primary transition-colors">Kontak</Link>
        </div>

        {/* Media Sosial Ringkas Mobile */}
        <div className="flex items-center justify-center gap-2.5 mb-4">
          {SOCIAL_MEDIA_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-7 h-7 rounded-full bg-slate-100 hover:bg-primary border border-slate-200/80 hover:border-primary flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105"
              aria-label={item.label}
            >
              <span
                className="w-3 h-3 bg-slate-600 group-hover:bg-white transition-colors block pointer-events-none"
                style={{
                  maskImage: `url("${item.icon}")`,
                  WebkitMaskImage: `url("${item.icon}")`,
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                }}
                aria-hidden="true"
              />
            </a>
          ))}
        </div>

        <div className="pt-3 border-t border-border text-[11px] text-text-secondary/75">
          <p>© 2026 OpenDonasi. Prototype Frontend.</p>
        </div>
      </div>
    </footer>
  );
}
