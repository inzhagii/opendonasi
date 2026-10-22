// Komponen toolbar katalog program OpenDonasi: Kategori, Filter Popover, dan Urutkan Popover.

import { useState } from 'react';
import { CATEGORIES } from '../../../data/campaigns';
import {
  SORT_OPTIONS,
  TARGET_RANGE_OPTIONS,
  DAYS_RANGE_OPTIONS,
} from '../../../lib/campaignFilters';
import { useClickOutside } from '../../../hooks/useClickOutside';

export function ProgramToolbar({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  targetRange,
  onChangeTargetRange,
  daysRange,
  onChangeDaysRange,
  onResetFilters,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Hook click outside untuk popover filter & sort
  const filterRef = useClickOutside(() => setIsFilterOpen(false), isFilterOpen);
  const sortRef = useClickOutside(() => setIsSortOpen(false), isSortOpen);

  // Hitung jumlah filter tambahan yang aktif (selain kategori)
  const activeFilterCount =
    (targetRange !== 'all' ? 1 : 0) + (daysRange !== 'all' ? 1 : 0);

  const currentSortObj =
    SORT_OPTIONS.find((s) => s.id === selectedSort) || SORT_OPTIONS[0];

  return (
    <div className="w-full space-y-4">
      {/* Baris 1: Kategori Pills (Horizontal scrollable on mobile, flex wrap on desktop) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`snap-start shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white text-text-primary border-border hover:border-primary/40 hover:bg-slate-50'
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

      {/* Baris 2: Kontrol Toolbar (Filter Tambahan + Dropdown Urutkan) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Tombol Popover Filter */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => {
                setIsFilterOpen((prev) => !prev);
                setIsSortOpen(false);
              }}
              aria-expanded={isFilterOpen}
              aria-haspopup="dialog"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                activeFilterCount > 0
                  ? 'bg-primary/10 text-primary border-primary/30 font-semibold'
                  : 'bg-white text-slate-700 border-border hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Popover Filter Content */}
            {isFilterOpen && (
              <div
                role="dialog"
                aria-label="Filter Program"
                className="absolute left-0 mt-2 w-72 sm:w-80 bg-white border border-border rounded-2xl shadow-xl p-4 z-30 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                  <h4 className="font-bold text-sm text-text-primary">Filter Program</h4>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onChangeTargetRange('all');
                        onChangeDaysRange('all');
                      }}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                {/* Sub-filter 1: Rentang Target Dana */}
                <div className="space-y-1.5 mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
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

                {/* Sub-filter 2: Sisa Hari */}
                <div className="space-y-1.5 mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
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

                <div className="pt-2 border-t border-border flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tombol Popover Urutkan */}
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => {
              setIsSortOpen((prev) => !prev);
              setIsFilterOpen(false);
            }}
            aria-expanded={isSortOpen}
            aria-haspopup="listbox"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white text-slate-700 border border-border hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span className="text-slate-500 hidden sm:inline">Urutkan:</span>
            <span className="font-semibold text-slate-800">{currentSortObj.label}</span>
            <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Popover Urutkan Content */}
          {isSortOpen && (
            <div
              role="listbox"
              aria-label="Pilihan Urutan"
              className="absolute right-0 mt-2 w-56 sm:w-64 bg-white border border-border rounded-2xl shadow-xl p-2 z-30 animate-in fade-in zoom-in-95 duration-150"
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm text-left transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

      {/* Baris 3: Active Filter Chips (Bila ada filter aktif selain Semua) */}
      {(selectedCategory !== 'semua' || targetRange !== 'all' || daysRange !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-text-secondary font-medium">Filter aktif:</span>

          {selectedCategory !== 'semua' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              <span>{CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}</span>
              <button
                type="button"
                onClick={() => onSelectCategory('semua')}
                className="hover:text-primary rounded-full"
                aria-label="Hapus filter kategori"
              >
                ×
              </button>
            </span>
          )}

          {targetRange !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              <span>{TARGET_RANGE_OPTIONS.find((t) => t.id === targetRange)?.label}</span>
              <button
                type="button"
                onClick={() => onChangeTargetRange('all')}
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
                onClick={() => onChangeDaysRange('all')}
                className="hover:text-primary rounded-full"
                aria-label="Hapus filter sisa hari"
              >
                ×
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-primary hover:underline font-semibold ml-1"
          >
            Hapus Semua
          </button>
        </div>
      )}
    </div>
  );
}
