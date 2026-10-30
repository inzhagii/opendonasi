// Halaman Pendaftaran / Sign In Pengguna OpenDonasi (/signin).
// Karakteristik desain OpenDonasi: font Inter, biru utama #2E7DFA, latar putih & netral lembut.

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { useDonation } from '../../hooks/useDonation';
import logoImg from '../../assets/logo/logo.png';

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useDonation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const targetRedirect = location.state?.from || '/profil';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Alamat email wajib diisi.');
      return;
    }
    if (!password) {
      setErrorMsg('Kata sandi wajib dibuat.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Anda harus menyetujui syarat & ketentuan layanan.');
      return;
    }

    login({
      name: name.trim(),
      email: email.trim(),
    });
    navigate(targetRedirect, { replace: true });
  };

  const handleQuickDemoRegister = () => {
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
          {/* Card Form Sign In / Daftar */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header Brand */}
            <div className="text-center space-y-2">
              <Link to="/" className="inline-block">
                <img src={logoImg} alt="OpenDonasi" className="h-9 w-auto mx-auto object-contain" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
                Daftar Akun Baru
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Bergabung bersama jutaan donatur untuk menyebarkan kebaikan nyata di pelosok negeri.
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
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Contoh: Muhammad Fulan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="fulan@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Kata Sandi <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary mt-0.5"
                  />
                  <span>
                    Saya menyetujui <span className="text-primary hover:underline">Syarat & Ketentuan</span> serta <span className="text-primary hover:underline">Kebijakan Privasi</span> OpenDonasi.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isFullWidth
                  className="font-bold py-3 text-sm shadow-xs"
                >
                  Daftar Sekarang
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
                onClick={handleQuickDemoRegister}
                className="w-full py-2.5 px-4 rounded-xl border border-primary/40 bg-primary-soft hover:bg-blue-100/70 text-primary font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Daftar Cepat sebagai Donatur Demo</span>
              </button>
            </div>

            {/* Tautan ke Login */}
            <div className="text-center pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              <span>Sudah memiliki akun? </span>
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default SignInPage;
