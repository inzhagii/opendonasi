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

      {/* ===== MOBILE FOOTER RAPI & MINIMALIS (md:hidden) ===== */}
      <div className="block md:hidden py-8 pb-24 px-5">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header Brand & Tagline */}
          <div className="flex flex-col items-center text-center">
            <Link to="/" className="inline-block mb-2" aria-label="Beranda OpenDonasi">
              <img src={logoImg} alt="OpenDonasi" className="h-7 w-auto object-contain" />
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
              Platform infrastruktur penggalangan dana digital terpercaya untuk kebaikan bersama.
            </p>
          </div>

          {/* Grid Navigasi Ringkas 2 Kolom */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/80 text-xs">
            <div>
              <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2.5">
                Layanan
              </h5>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/program" className="hover:text-primary transition-colors">Semua Program</Link></li>
                <li><Link to="/zakat" className="hover:text-primary transition-colors">Zakat & Kalkulator</Link></li>
                <li><Link to="/infaq" className="hover:text-primary transition-colors">Infaq Umat</Link></li>
                <li><Link to="/sedekah" className="hover:text-primary transition-colors">Sedekah Rutin</Link></li>
                <li><Link to="/wakaf" className="hover:text-primary transition-colors">Wakaf Produktif</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2.5">
                Bantuan & Info
              </h5>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/tentang" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition-colors">Tanya Jawab (FAQ)</Link></li>
                <li><Link to="/kontak" className="hover:text-primary transition-colors">Kontak Bantuan</Link></li>
              </ul>
            </div>
          </div>

          {/* Media Sosial & Copyright */}
          <div className="pt-4 border-t border-slate-200/80 flex flex-col items-center text-center space-y-3">
            <div className="flex items-center justify-center gap-2.5">
              {SOCIAL_MEDIA_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-8 h-8 rounded-full bg-slate-100 hover:bg-primary border border-slate-200/80 hover:border-primary flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105"
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

            <div className="text-[11px] text-slate-400 space-y-0.5">
              <p>© 2026 OpenDonasi. Seluruh hak cipta dilindungi.</p>
              <p className="text-[10px] text-slate-400/80">Simulasi demo prototype platform donasi digital.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
