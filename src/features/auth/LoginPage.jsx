// Halaman Masuk / Login Pengguna OpenDonasi (/login).
// Karakteristik desain OpenDonasi: font Inter, biru utama #2E7DFA, latar putih & netral lembut.

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { useDonation } from '../../hooks/useDonation';
import logoImg from '../../assets/logo/logo.png';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useDonation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const targetRedirect = location.state?.from || '/profil';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Silakan masukkan email atau nomor ponsel Anda.');
      return;
    }
    if (!password) {
      setErrorMsg('Silakan masukkan kata sandi Anda.');
      return;
    }

    login({
      name: identifier.includes('@') ? identifier.split('@')[0] : 'Donatur Demo',
      email: identifier.includes('@') ? identifier : 'donatur.demo@opendonasi.id.demo',
    });
    navigate(targetRedirect, { replace: true });
  };

  const handleQuickDemoLogin = () => {
    login({
      name: 'Donatur Demo',
      email: 'donatur.demo@opendonasi.id.demo',
    });
    navigate(targetRedirect, { replace: true });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-10 sm:py-16 flex flex-col items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto w-full space-y-4">
          {/* Tombol Kembali ke Beranda */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors py-1 cursor-pointer"
          >
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Card Form Login */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header Brand */}
            <div className="text-center space-y-2">
              <Link to="/" className="inline-block">
                <img src={logoImg} alt="OpenDonasi" className="h-9 w-auto mx-auto object-contain" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
                Masuk ke Akun
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Yuk masuk untuk nikmati kemudahan berdonasi dan akses fitur lainnya.
              </p>
            </div>

            {/* Notifikasi Error */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Email atau Nomor Ponsel
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Contoh: donatur@email.com atau 0812..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Masukkan kata sandi Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary"
                  />
                  <span>Ingat saya</span>
                </label>
                <span className="text-text-secondary hover:text-primary cursor-pointer">
                  Lupa sandi?
                </span>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isFullWidth
                  className="font-bold py-3 text-sm shadow-xs"
                >
                  Masuk Sekarang
                </Button>
              </div>
            </form>

            {/* Opsi Akses Cepat Akun Demo Prototype */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400">Atau untuk demonstrasi</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-primary/40 bg-primary-soft hover:bg-blue-100/70 text-primary font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Masuk Cepat sebagai Donatur Demo</span>
              </button>
            </div>

            {/* Tautan ke Sign In / Daftar */}
            <div className="text-center pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              <span>Belum punya akun? </span>
              <Link to="/signin" className="font-semibold text-primary hover:underline">
                Yuk daftar sekarang
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage;
