// Halaman FAQ (Tanya Jawab) OpenDonasi (/faq).

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FAQS } from '../../data/content';

export function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState('faq-1'); // Default pertanyaan pertama terbuka

  useEffect(() => {
    document.title = 'FAQ (Pertanyaan Umum) — OpenDonasi';
    window.scrollTo(0, 0);
  }, []);

  // Filter FAQ berdasarkan kata kunci pencarian (pertanyaan & jawaban)
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((item) => {
      const matchQuestion = item.question.toLowerCase().includes(q);
      const matchAnswer = item.answer.toLowerCase().includes(q);
      return matchQuestion || matchAnswer;
    });
  }, [searchQuery]);

  // Handler toggle accordion
  const handleToggle = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // Reset kolom pencarian
  const handleResetSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full py-6 md:py-12">
      <Container>
        {/* Kontainer Utama Terpusat (Maksimal 1320px di Desktop) */}
        <div className="max-w-desktop mx-auto w-full space-y-8">
          {/* Header Utama */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                Pusat Bantuan
              </Badge>
              <span className="text-xs text-text-secondary font-medium">
                Tanya Jawab
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Temukan jawaban seputar cara kerja platform OpenDonasi, panduan mencoba alur simulasi donasi, serta batasan prototype demonstrasi ini.
            </p>
          </div>

          {/* Kolom Pencarian FAQ */}
          <div className="relative">
            <label htmlFor="faq-search" className="sr-only">
              Cari pertanyaan FAQ
            </label>
            <div className="relative">
              <input
                id="faq-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan atau kata kunci (contoh: uang asli, simulasi, riwayat)..."
                className="w-full pl-11 pr-10 py-3 text-sm rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary shadow-xs placeholder:text-slate-400"
              />
              <svg
                className="w-5 h-5 text-primary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {searchQuery && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full text-xs"
                  aria-label="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Indikator Status Pencarian */}
            {searchQuery && (
              <div className="mt-2 flex items-center justify-between text-xs text-text-secondary px-1">
                <span>
                  Menampilkan {filteredFaqs.length} dari {FAQS.length} pertanyaan
                </span>
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="text-primary hover:underline font-semibold"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>

          {/* Daftar Accordion FAQ */}
          {filteredFaqs.length === 0 ? (
            /* Empty State Pencarian */
            <div className="bg-white rounded-2xl border border-border p-8 sm:p-12 text-center shadow-xs space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tidak Ditemukan Pertanyaan yang Cocok
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                Kata kunci <strong>"{searchQuery}"</strong> tidak cocok dengan pertanyaan maupun jawaban yang tersedia.
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={handleResetSearch}>
                  Tampilkan Semua Pertanyaan
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3" role="region" aria-label="Daftar FAQ">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaqId === faq.id;
                const headingId = `faq-head-${faq.id}`;
                const panelId = `faq-body-${faq.id}`;

                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs transition-colors"
                  >
                    <h3>
                      <button
                        type="button"
                        id={headingId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => handleToggle(faq.id)}
                        className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-slate-50/70 transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          <span className="text-primary font-semibold mr-2">{index + 1}.</span>
                          {faq.question}
                        </span>
                        <span
                          className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 bg-primary/10 text-primary' : ''
                          }`}
                          aria-hidden="true"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                    </h3>

                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={headingId}
                        className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40 animate-in fade-in duration-150"
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Seksi Bantuan Lanjutan (CTA Bawah) */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 sm:p-7 text-center space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Belum Menemukan Jawaban yang Anda Cari?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Pelajari panduan kendala umum atau ketahui status pengembangan prototype ini pada halaman panduan bantuan kami.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/kontak" className="w-full sm:w-auto">
                <Button variant="primary" size="md" isFullWidth className="font-bold">
                  Buka Panduan Bantuan
                </Button>
              </Link>
              <Link to="/program" className="w-full sm:w-auto">
                <Button variant="outline" size="md" isFullWidth>
                  Jelajahi Program Kebaikan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default FaqPage;
