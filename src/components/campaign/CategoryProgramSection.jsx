import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, CAMPAIGNS } from '../../data/campaigns';
import { CampaignCard } from './CampaignCard';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { useClickOutside } from '../../hooks/useClickOutside';

/**
 * CategoryProgramSection
 * Spesifikasi OPENDONASI_SPEC:
 * - Kategori ikon: Desktop satu baris (Semua + maks 4 kategori lain + popover 'Lainnya').
 * - Mobile: Carousel horizontal kategori dengan ~3 item terlihat di awal.
 * - Memfilter program secara reaktif.
 * - Grid desktop 3 kolom, 2 baris awal (6 kartu) + tombol 'Lihat Selengkapnya'.
 * - Mobile: Kartu program berformat horizontal dengan gambar rasio 16:9 separuh lebar.
 */
export function CategoryProgramSection({ className = '' }) {
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [showAllCards, setShowAllCards] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const morePopoverRef = useRef(null);

  useClickOutside(morePopoverRef, () => setIsMoreOpen(false));

  // Desktop kategori: 'Semua' + 4 kategori pertama (indeks 1..4), sisanya di popover 'Lainnya'
  const desktopMainCategories = CATEGORIES.slice(0, 5); // semua, pendidikan, kemanusiaan, bencana, zakat
  const desktopMoreCategories = CATEGORIES.slice(5); // lainnya dst

  // Filter kampanye
  const filteredCampaigns =
    selectedCategory === 'semua'
      ? CAMPAIGNS
      : CAMPAIGNS.filter((c) => c.category === selectedCategory);

  const initialLimit = 6;
  const displayedCampaigns = showAllCards
    ? filteredCampaigns
    : filteredCampaigns.slice(0, initialLimit);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setShowAllCards(false);
    setIsMoreOpen(false);
  };

  return (
    <section aria-labelledby="program-section-title" className={`w-full ${className}`}>
      {/* Header Seksi */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <SectionHeading
          title="Program Donasi Pilihan"
          subtitle="Pilih kategori kebaikan dan salurkan bantuan langsung kepada mereka yang paling membutuhkan."
        />
      </div>

      {/* Baris Kategori Ikon */}
      <div className="mb-8">
        {/* Mobile View: Horizontal Scrollable List (~3 item terlihat di awal) */}
        <div className="flex md:hidden gap-2.5 overflow-x-auto snap-x scrollbar-none pb-2 px-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`snap-start shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-text-primary border-border hover:border-primary/40'
                }`}
              >
                <img
                  src={cat.icon}
                  alt=""
                  aria-hidden="true"
                  className={`w-4 h-4 object-contain ${isSelected ? 'brightness-0 invert' : ''}`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop View: Satu Baris (Semua + 4 Kategori + Popover 'Lainnya') */}
        <div className="hidden md:flex items-center gap-3 flex-wrap">
          {desktopMainCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-text-primary border-border hover:border-primary/40 hover:bg-slate-50'
                }`}
              >
                <img
                  src={cat.icon}
                  alt=""
                  aria-hidden="true"
                  className={`w-5 h-5 object-contain ${isSelected ? 'brightness-0 invert' : ''}`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}

          {/* Popover Kategori Tambahan ('Lainnya') */}
          {desktopMoreCategories.length > 0 && (
            <div className="relative" ref={morePopoverRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen((prev) => !prev)}
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  desktopMoreCategories.some((c) => c.id === selectedCategory)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-primary border-border hover:border-primary/40'
                }`}
              >
                <span>Lainnya</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMoreOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-lg p-1.5 z-20">
                  {desktopMoreCategories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                          isSelected
                            ? 'bg-primary-soft text-primary'
                            : 'text-text-primary hover:bg-slate-50'
                        }`}
                      >
                        <img src={cat.icon} alt="" aria-hidden="true" className="w-4 h-4 object-contain" />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid Program */}
      {displayedCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              variant="responsive"
              className="h-full"
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-card border border-border p-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-text-secondary mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Belum ada program untuk kategori ini
          </h3>
          <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
            Silakan pilih kategori lainnya atau lihat seluruh program kebaikan kami.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => handleSelectCategory('semua')}
          >
            Tampilkan Semua Kategori
          </Button>
        </div>
      )}

      {/* Tombol Lihat Selengkapnya (Bila program > limit atau ingin navigasi ke katalog lengkap) */}
      <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
        {filteredCampaigns.length > initialLimit && !showAllCards && (
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowAllCards(true)}
            className="w-full sm:w-auto"
          >
            Lihat Lebih Banyak Program ({filteredCampaigns.length - initialLimit} tersisa)
          </Button>
        )}
        <Link to="/program" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full sm:w-auto">
            Buka Katalog Semua Program
          </Button>
        </Link>
      </div>
    </section>
  );
}
