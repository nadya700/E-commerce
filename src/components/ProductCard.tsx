import React from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container with Badges */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
              Yeni
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.stock <= 10 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Son {product.stock} ədəd
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600'
          }`}
          title={isWishlisted ? 'Bəyənmədən çıxar' : 'Bəyənilənlərə əlavə et'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Ətraflı Baxış</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, product.sizes[0], product.colors[0]);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md transition-colors"
            title="Sürətli səbətə əlavə et"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Category & Gender Pill */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-medium text-blue-600 uppercase tracking-wider">{product.category}</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{product.gender}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-semibold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Color Dots & Sizes Preview */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
          <div className="text-[11px] text-slate-500">
            {product.sizes.join(' · ')}
          </div>
        </div>

        {/* Price & Primary Action */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-blue-900">
                {product.price.toFixed(2)} ₼
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {product.originalPrice.toFixed(2)} ₼
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product, product.sizes[0], product.colors[0])}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Səbətə</span>
          </button>
        </div>
      </div>
    </div>
  );
};
