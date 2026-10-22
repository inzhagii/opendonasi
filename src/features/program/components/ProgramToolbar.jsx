// Komponen toolbar katalog program OpenDonasi: Kategori, Filter Popover, dan Urutkan Popover.
// Desain bilah 3 segmen horizontal sesuai referensi visual: [📁 Semua kategori] | [∇ Filter v] | [↓≡]

import { useState } from 'react';
import { CATEGORIES } from '../../../data/campaigns';
import {
  SORT_OPTIONS,
  TARGET_RANGE_OPTIONS,
  DAYS_RANGE_OPTIONS,
} from '../../../lib/campaignFilters';
import { useClickOutside } from '../../../hooks/useClickOutside';

export function ProgramToolbar({
  selectedCategory = 'semua',
  onSelectCategory,
  selectedSort = 'terbaru',
  onSelectSort,
  targetRange = 'all',
  onChangeTargetRange,
  daysRange = 'all',
  onChangeDaysRange,
  onResetFilters,
  serviceName,
  className = '',
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Hook click outside untuk popover kategori, filter, & sort
  const categoryRef = useClickOutside(() => setIsCategoryOpen(false), isCategoryOpen);
  const filterRef = useClickOutside(() => setIsFilterOpen(false), isFilterOpen);
  const sortRef = useClickOutside(() => setIsSortOpen(false), isSortOpen);

  // Hitung jumlah filter tambahan yang aktif (selain kategori)
  const activeFilterCount =
    (targetRange !== 'all' ? 1 : 0) + (daysRange !== 'all' ? 1 : 0);

  const currentSortObj =
    SORT_OPTIONS.find((s) => s.id === selectedSort) || SORT_OPTIONS[0];

  const currentCatObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const categoryLabel =
    serviceName
      ? `Layanan ${serviceName}`
      : !currentCatObj || currentCatObj.id === 'semua'
      ? 'Semua kategori'
      : currentCatObj.name;

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Bilah Toolbar 3 Segmen Horizontal */}
      <div className="relative w-full bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl shadow-2xs">
        <div className="flex items-center h-12 sm:h-13">
          {/* Segmen 1: Kategori (Ikon Folder + Label) */}
          <div className="relative flex-1 h-full min-w-0" ref={categoryRef}>
            <button
              type="button"
              onClick={() => {
                setIsCategoryOpen((prev) => !prev);
                setIsFilterOpen(false);
                setIsSortOpen(false);
              }}
              className="w-full h-full flex items-center justify-center gap-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-slate-700 hover:text-primary hover:bg-slate-50/75 rounded-l-xl sm:rounded-l-2xl transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={isCategoryOpen}
              aria-haspopup="listbox"
              aria-label="Pilih Kategori"
            >
              {/* Ikon Folder sesuai referensi visual */}
              <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="truncate">{categoryLabel}</span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 hidden sm:block ${
                  isCategoryOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Popover Kategori */}
            {isCategoryOpen && (
              <div
                role="listbox"
                aria-label="Pilih Kategori"
                className="absolute left-0 top-full mt-2 w-64 sm:w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Pilih Kategori
                </div>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-slate-700 hover:bg-slate-50 font-normal'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={cat.icon}
                          alt=""
                          aria-hidden="true"
                          className={`w-4 h-4 object-contain shrink-0 ${isSelected ? '' : 'opacity-70'}`}
                        />
                        <span className="truncate">
                          {cat.id === 'semua' ? 'Semua kategori' : cat.name}
                        </span>
                      </div>
                      {isSelected && (
                        <svg className="w-4 h-4 text-primary shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Garis Pembatas Vertikal 1 */}
          <div className="w-px h-6 bg-slate-200 shrink-0" aria-hidden="true" />

          {/* Segmen 2: Filter (Ikon Funnel + Teks 'Filter' + Chevron Down) */}
          <div className="relative flex-1 h-full min-w-0" ref={filterRef}>
            <button
              type="button"
              onClick={() => {
                setIsFilterOpen((prev) => !prev);
                setIsCategoryOpen(false);
                setIsSortOpen(false);
              }}
              className="w-full h-full flex items-center justify-center gap-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-slate-700 hover:text-primary hover:bg-slate-50/75 transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={isFilterOpen}
              aria-haspopup="dialog"
              aria-label="Filter Program"
            >
              {/* Ikon Funnel sesuai referensi visual */}
              <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {activeFilterCount}
                </span>
              )}
              {/* Chevron Down sesuai referensi visual */}
              <svg
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Popover Filter */}
            {isFilterOpen && (
              <div
                role="dialog"
                aria-label="Filter Program"
                className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-40 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h4 className="font-bold text-sm text-slate-900">Filter Program</h4>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onChangeTargetRange?.('all');
                        onChangeDaysRange?.('all');
                      }}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                {/* Sub-filter 1: Target Dana */}
                {onChangeTargetRange && (
                  <div className="space-y-1.5 mb-4">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Target Dana
                    </label>
                    <div className="space-y-1">
                      {TARGET_RANGE_OPTIONS.map((opt) => (
                        <label
                          key={opt.id}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                        >
                          <input
                            type="radio"
                            name="targetRange"
                            checked={targetRange === opt.id}
                            onChange={() => onChangeTargetRange(opt.id)}
                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-filter 2: Sisa Waktu */}
                {onChangeDaysRange && (
                  <div className="space-y-1.5 mb-4">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Sisa Waktu
                    </label>
                    <div className="space-y-1">
                      {DAYS_RANGE_OPTIONS.map((opt) => (
                        <label
                          key={opt.id}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                        >
                          <input
                            type="radio"
                            name="daysRange"
                            checked={daysRange === opt.id}
                            onChange={() => onChangeDaysRange(opt.id)}
                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Garis Pembatas Vertikal 2 */}
          <div className="w-px h-6 bg-slate-200 shrink-0" aria-hidden="true" />

          {/* Segmen 3: Urutkan (Seimbang flex-1 dengan label 'Urutkan') */}
          <div className="relative flex-1 h-full min-w-0" ref={sortRef}>
            <button
              type="button"
              onClick={() => {
                setIsSortOpen((prev) => !prev);
                setIsCategoryOpen(false);
                setIsFilterOpen(false);
              }}
              className="w-full h-full flex items-center justify-center gap-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-slate-700 hover:text-primary hover:bg-slate-50/75 rounded-r-xl sm:rounded-r-2xl transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={isSortOpen}
              aria-haspopup="listbox"
              aria-label={`Urutkan: ${currentSortObj.label}`}
              title={`Urutkan: ${currentSortObj.label}`}
            >
              {/* Ikon Sort sesuai referensi visual */}
              <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5v14m0 0l-3-3m3 3l3-3M11 6h10M11 12h7M11 18h4" />
              </svg>
              <span className="truncate">
                {selectedSort !== 'terbaru' ? currentSortObj.label : 'Urutkan'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 hidden sm:block ${
                  isSortOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Popover Urutkan */}
            {isSortOpen && (
              <div
                role="listbox"
                aria-label="Pilihan Urutan"
                className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Urutkan Berdasarkan
                </div>
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = selectedSort === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectSort(opt.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-slate-700 hover:bg-slate-50 font-normal'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <svg className="w-4 h-4 text-primary shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chip Filter Aktif (Opsional: Ditampilkan hanya jika ada filter tambahan yang aktif) */}
      {(targetRange !== 'all' || daysRange !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Filter aktif:</span>

          {targetRange !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              <span>{TARGET_RANGE_OPTIONS.find((t) => t.id === targetRange)?.label}</span>
              <button
                type="button"
                onClick={() => onChangeTargetRange?.('all')}
                className="hover:text-primary rounded-full"
                aria-label="Hapus filter target"
              >
                ×
              </button>
            </span>
          )}

          {daysRange !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              <span>{DAYS_RANGE_OPTIONS.find((d) => d.id === daysRange)?.label}</span>
              <button
                type="button"
                onClick={() => onChangeDaysRange?.('all')}
                className="hover:text-primary rounded-full"
                aria-label="Hapus filter sisa hari"
              >
                ×
              </button>
            </span>
          )}

          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-primary hover:underline font-semibold ml-1 cursor-pointer"
            >
              Hapus Semua
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgramToolbar;
