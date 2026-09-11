import React from 'react';
import { Filter, RotateCcw, ArrowUpDown } from 'lucide-react';
import { FilterState } from '../types';
import { CATEGORIES } from '../data/products';

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalProducts: number;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '36', '40', '42', '43'];
const AVAILABLE_COLORS = [
  { name: 'Hamısı', hex: '' },
  { name: 'Kral Mavi', hex: '#1e40af' },
  { name: 'Kobalt Mavi', hex: '#2563eb' },
  { name: 'Tünd Göy', hex: '#0f172a' },
  { name: 'Açıq Mavi', hex: '#93c5fd' },
  { name: 'Okean Mavisi', hex: '#0284c7' },
  { name: 'Buz Mavisi', hex: '#bfdbfe' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalProducts,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-50">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filtrlər</span>
          <span className="text-xs font-normal text-slate-500">({totalProducts} məhsul)</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Sıfırla</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
          <span>Sıralama</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
          className="w-full text-xs font-medium py-2.5 px-3 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
        >
          <option value="featured">Önə çıxanlar (Tövsiyə olunan)</option>
          <option value="newest">Ən yeni gələnlər</option>
          <option value="price-asc">Qiymət: Ucuzdan Bahaya</option>
          <option value="price-desc">Qiymət: Bahadan Ucuza</option>
          <option value="rating">Müştəri Reytinqi</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
          Kateqoriya
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChange({ ...filters, category: cat.id })}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <span className="text-[10px]">●</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Cins
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: '', label: 'Hamısı' },
            { id: 'Qadın', label: 'Qadın' },
            { id: 'Kişi', label: 'Kişi' },
            { id: 'Uniseks', label: 'Uniseks' },
          ].map((g) => {
            const isSelected = filters.gender === g.id;
            return (
              <button
                key={g.id}
                onClick={() => onChange({ ...filters, gender: g.id })}
                className={`py-1.5 px-2 text-xs rounded-lg font-medium border text-center transition-all ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border-blue-400 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:border-blue-200'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-700 uppercase tracking-wider">Maksimum Qiymət</span>
          <span className="font-bold text-blue-700 text-sm">{filters.maxPrice} ₼</span>
        </div>
        <input
          type="range"
          min="30"
          max="250"
          step="5"
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>30 ₼</span>
          <span>250 ₼</span>
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Ölçü
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onChange({ ...filters, selectedSize: '' })}
            className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
              filters.selectedSize === ''
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            Hamısı
          </button>
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => onChange({ ...filters, selectedSize: isSelected ? '' : size })}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Mavi Çalar
        </label>
        <div className="flex flex-wrap gap-2 items-center">
          {AVAILABLE_COLORS.map((col, idx) => {
            const isSelected = filters.selectedColor === col.name || (col.hex === '' && filters.selectedColor === '');
            return (
              <button
                key={idx}
                onClick={() => onChange({ ...filters, selectedColor: col.hex === '' ? '' : col.name })}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 text-slate-600 hover:border-blue-200'
                }`}
                title={col.name}
              >
                {col.hex ? (
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: col.hex }}
                  />
                ) : (
                  <span>🌈</span>
                )}
                <span>{col.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
