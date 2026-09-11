import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  discount: number;
  onApplyPromo: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  discount,
  onApplyPromo,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const isFreeShipping = subtotal >= 80;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : 4.00;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const ok = onApplyPromo(promoCode.trim().toUpperCase());
    if (ok) {
      setPromoMessage({ text: 'Promokod uğurla tətbiq edildi! (-10%)', success: true });
    } else {
      setPromoMessage({ text: 'Yalnış promokod. "MAVI10" yoxlayın.', success: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-blue-100">
          {/* Header */}
          <div className="p-5 border-b border-blue-100 flex items-center justify-between bg-blue-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Alış-Veriş Səbəti</h3>
                <p className="text-xs text-slate-500">{items.length} fərqli məhsul</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-blue-900 text-white px-5 py-2.5 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-blue-200">
                <Truck className="w-3.5 h-3.5" />
                {isFreeShipping
                  ? 'Təbriklər! Çatdırılma PULSUZdur! 🎉'
                  : `Pulsuz çatdırılma üçün daha ${(80 - subtotal).toFixed(2)} ₼ əlavə edin`}
              </span>
            </div>
            <div className="w-full bg-blue-950 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / 80) * 100)}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">Səbətiniz boşdur</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Mavi tonlarda hazırlanmış ən yeni geyim kolleksiyamızdan bəyəndiyiniz məhsulları səbətə əlavə edin.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
                >
                  Kolleksiyaya Baxış
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Səbətdən sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-100">
                          Ölçü: {item.selectedSize}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-extrabold text-blue-950">
                        {(item.product.price * item.quantity).toFixed(2)} ₼
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-7 bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 text-xs font-bold text-slate-600 hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 text-xs font-bold text-slate-600 hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Summary & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-blue-100 bg-slate-50/70 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handlePromoSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promokod (məsələn: MAVI10)"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-blue-200 rounded-lg text-slate-800 uppercase focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />
                  <Tag className="w-3.5 h-3.5 text-blue-500 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold rounded-lg transition-colors"
                >
                  Tətbiq et
                </button>
              </form>

              {promoMessage && (
                <p className={`text-[11px] font-medium flex items-center gap-1 ${promoMessage.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {promoMessage.success && <Check className="w-3 h-3" />}
                  {promoMessage.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Məhsul məbləği:</span>
                  <span className="font-semibold text-slate-800">{subtotal.toFixed(2)} ₼</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Xüsusi Endirim ({discount}%):</span>
                    <span>-{discountAmount.toFixed(2)} ₼</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Çatdırılma:</span>
                  <span className="font-semibold text-slate-800">
                    {isFreeShipping ? <span className="text-emerald-600 font-bold">PULSUZ</span> : `${shippingFee.toFixed(2)} ₼`}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                  <span>Yekun Ödəniş:</span>
                  <span className="text-base text-blue-900 font-extrabold">{total.toFixed(2)} ₼</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="checkout-action-btn"
                onClick={onCheckout}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Sifarişi Rəsmiləşdir ({total.toFixed(2)} ₼)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
