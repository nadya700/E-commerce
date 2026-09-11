import React from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Code2, 
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenLaravel: () => void;
  onOpenAdmin: () => void;
  onOpenAccount: () => void;
  currentUser: UserProfile | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenLaravel,
  onOpenAdmin,
  onOpenAccount,
  currentUser,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
      {/* Top Notification Bar in Deep Indigo/Blue */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600/80 text-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Mavi Mövsüm
            </span>
            <span>80 ₼ üzəri bütün sifarişlərdə çatdırılma <strong>PULSUZ!</strong></span>
          </div>
          <div className="flex items-center gap-4 text-blue-200 text-xs">
            <button 
              onClick={onOpenLaravel}
              className="hover:text-white flex items-center gap-1.5 transition-colors font-medium bg-blue-700/50 hover:bg-blue-600 px-2.5 py-0.5 rounded-md text-[11px]"
              title="Laravel 11 PHP backend kodlarını gör"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-300" />
              <span>Laravel 11 Backend Kodları</span>
            </button>
            <span className="hidden sm:inline">Müştəri Dəstəyi: *0880</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <a href="#" className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-1">
                MAVI<span className="text-blue-600">.</span>AZ
              </a>
              <p className="text-[10px] tracking-widest uppercase text-blue-600 font-semibold -mt-1">
                Geyim & Dəb Evi
              </p>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Mavi palto, köynək, şalvar axtarın..."
                className="w-full pl-11 pr-4 py-2.5 bg-blue-50/50 border border-blue-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-blue-500 absolute left-4 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin / Management Button */}
            <button
              id="admin-panel-btn"
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
              title="Məhsul İdarəetməsi və API-lər"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>İdarəetmə (Admin)</span>
            </button>

            {/* Laravel Code Viewer Quick Trigger */}
            <button
              id="laravel-btn"
              onClick={onOpenLaravel}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-white bg-blue-700 hover:bg-blue-800 shadow-sm shadow-blue-700/30 transition-colors"
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Laravel Kodları</span>
            </button>

            {/* Account */}
            <button
              id="user-account-btn"
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Hesabım"
            >
              <User className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-medium hidden sm:inline">
                {currentUser ? currentUser.name.split(' ')[0] : 'Giriş'}
              </span>
            </button>

            {/* Wishlist */}
            <div className="relative">
              <button
                id="wishlist-btn"
                className="p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Bəyənilənlər"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute 1 top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

            {/* Cart Button */}
            <button
              id="cart-drawer-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl font-medium text-sm transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-semibold">{cartCount}</span>
              <span className="hidden sm:inline text-xs font-normal border-l border-blue-400 pl-2">Səbət</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Geyim axtarışı..."
              className="w-full pl-10 pr-4 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white"
            />
            <Search className="w-4 h-4 text-blue-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 border-t border-blue-50 no-scrollbar text-xs font-medium">
          {[
            { id: 'all', label: 'Bütün Kolleksiya' },
            { id: 'Köynək', label: 'Köynəklər' },
            { id: 'Pencək', label: 'Pencək & Palto' },
            { id: 'Don', label: 'Donlar' },
            { id: 'Sviter', label: 'Sviter & Hudi' },
            { id: 'Şalvar', label: 'Şalvarlar' },
            { id: 'Ayaqqabı', label: 'Ayaqqabılar' },
            { id: 'Aksessuar', label: 'Aksessuarlar' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
