import React, { useState } from 'react';
import { X, Star, ShoppingBag, Truck, ShieldCheck, Heart, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Mavi', hex: '#2563eb' });
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-600 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Gallery Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 border border-blue-100 relative">
              <img
                src={activeImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white shadow-md transition-all text-slate-600"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-medium">{product.gender} Dəbi</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Stokda var ({product.stock} ədəd)
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-500">({product.reviewsCount} müsbət rəy)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-extrabold text-blue-950">
                  {product.price.toFixed(2)} ₼
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      {product.originalPrice.toFixed(2)} ₼
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      Qənaət: {(product.originalPrice - product.price).toFixed(2)} ₼
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Composition Info */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs space-y-1">
                <p className="text-slate-500 font-medium">Material və Tərkib:</p>
                <p className="text-slate-800 font-semibold">{product.composition}</p>
              </div>

              {/* Color Swatches */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Rəng: <span className="text-blue-700">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c, i) => {
                    const isSelected = selectedColor.name === c.name;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                            : 'border-slate-200 text-slate-700 hover:border-blue-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Ölçü Seçimi
                  </label>
                  <span className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">
                    Ölçü Cədvəli
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-11 h-10 px-3 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                            : 'border-slate-200 text-slate-700 hover:border-blue-400 bg-white'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Add To Cart Button */}
              <div className="flex items-center gap-3 pt-2">
                {/* Quantity */}
                <div className="flex items-center border border-blue-200 rounded-xl bg-blue-50/30 overflow-hidden h-12">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 text-slate-600 hover:text-blue-700 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-slate-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 text-slate-600 hover:text-blue-700 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add Button */}
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAdd}
                  className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Səbətə Əlavə Edildi!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Səbətə At ({(product.price * quantity).toFixed(2)} ₼)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Fast Delivery & Trust Highlights */}
            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>24 saat ərzində çatdırılma</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>14 gün rəsmi zəmanət</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
