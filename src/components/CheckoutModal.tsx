import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Banknote, ShieldCheck, ArrowRight, FileText, Download, Eye, Sparkles } from 'lucide-react';
import { CartItem, ShippingAddress, Order } from '../types';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';
import { InvoiceModal } from './InvoiceModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  onPlaceOrder: (orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: 'card' | 'cash';
    userEmail: string;
  }) => Order;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  shippingFee,
  total,
  onPlaceOrder,
}) => {
  const [fullName, setFullName] = useState('Aydan Şərifova');
  const [email, setEmail] = useState('aydan@example.com');
  const [phone, setPhone] = useState('+994 50 123 45 67');
  const [city, setCity] = useState('Bakı');
  const [address, setAddress] = useState('Nizami küçəsi 45, mənzil 12');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceAutoDownloaded, setInvoiceAutoDownloaded] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const order = onPlaceOrder({
        shippingAddress: {
          fullName,
          phone,
          city,
          address,
          notes,
        },
        paymentMethod,
        userEmail: email,
      });
      setCompletedOrder(order);
      setIsSubmitting(false);

      // Sifariş təsdiq edildikdən sonra avtomatik olaraq PDF formatında 'Sifariş qaiməsi' (invoice) generasiya və yüklənməsi
      setTimeout(() => {
        try {
          generateInvoicePdf(order, true);
          setInvoiceAutoDownloaded(true);
        } catch (error) {
          console.error('Invoice PDF auto-generation error:', error);
        }
      }, 400);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-blue-100 my-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-blue-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {completedOrder ? 'Sifariş Təsdiqləndi' : 'Sifarişi Tamamla'}
            </h2>
            <p className="text-xs text-slate-500">
              {completedOrder
                ? 'Sifarişiniz uğurla qeydə alındı və kuryerə yönləndirilir'
                : 'Zəhmət olmasa çatdırılma və əlaqə məlumatlarını qeyd edin'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {completedOrder ? (
          <div className="py-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Sifariş № {completedOrder.orderNumber}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Təşəkkür edirik, {completedOrder.shippingAddress.fullName}!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Sifariş detalları <strong>{completedOrder.userEmail}</strong> ünvanına və <strong>{completedOrder.shippingAddress.phone}</strong> nömrəsinə SMS ilə göndərildi.
              </p>
            </div>

            {/* Order Tracking Preview */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-left space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Çatdırılma Statusu</span>
                <span className="text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded-md">
                  Gözləmədə (Hazırlanır)
                </span>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-lg bg-blue-600 text-white font-bold">1. Qəbul Edildi</div>
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800 font-medium">2. Hazırlanır</div>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-500 font-medium">3. Kuryerdə</div>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-500 font-medium">4. Çatdırıldı</div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-blue-200">
                <p><strong>Ünvan:</strong> {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.address}</p>
                <p><strong>Yekun Məbləğ:</strong> <span className="text-blue-900 font-bold">{completedOrder.total.toFixed(2)} ₼</span> ({completedOrder.paymentMethod === 'card' ? 'Bank Kartı ilə' : 'Qapıda Nağd'})</p>
              </div>
            </div>

            {/* Sifariş Qaiməsi (PDF Invoice) Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white text-left shadow-lg space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                        Sifariş Qaiməsi (Elektron Faktura)
                      </h4>
                      {invoiceAutoDownloaded && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                          <CheckCircle className="w-3 h-3" /> Avtomatik Yükləndi
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-blue-100/80 mt-0.5">
                      Rəsmi PDF sənədi tərtib edildi: <span className="font-mono text-white">Mavi_Boutique_Qaime_{completedOrder.orderNumber}.pdf</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 border-t border-blue-800/60">
                <button
                  type="button"
                  onClick={() => generateInvoicePdf(completedOrder, true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Qaiməni Yüklə</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoicePreview(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-white/10"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Qaiməyə Canlı Baxış</span>
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
            >
              Alış-Verişə Davam Et
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="pt-5 space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                1. Müştəri Məlumatları
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Ad və Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Əlaqə Nömrəsi *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    E-poçt ünvanı *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                2. Çatdırılma Ünvanı
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Şəhər / Region *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Bakı">Bakı</option>
                    <option value="Sumqayıt">Sumqayıt</option>
                    <option value="Xırdalan">Xırdalan</option>
                    <option value="Gəncə">Gəncə</option>
                    <option value="Naxçıvan">Naxçıvan</option>
                    <option value="Lənkəran">Lənkəran</option>
                    <option value="Digər">Digər Rayonlar</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Dəqiq Ünvan (Küçə, Bina, Mənzil) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Məsələn: Nizami küç. 14, mənzil 28"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Kuryer üçün Qeyd (İstəyə görə)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Məsələn: Blokun kodu 45, çatdırmazdan əvvəl zəng edin"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                3. Ödəniş Üsulu
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-blue-200 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold">Onlayn Bank Kartı</p>
                    <p className="text-[11px] text-slate-500">Visa, Mastercard, Birkart</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-blue-200 text-slate-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold">Qapıda Ödəniş</p>
                    <p className="text-[11px] text-slate-500">Nağd və ya Posterminal</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Order Review & Submit */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{items.reduce((s, i) => s + i.quantity, 0)} ədəd geyim məhsulu:</span>
                <span className="font-semibold">{subtotal.toFixed(2)} ₼</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Endirim:</span>
                  <span>-{(subtotal * discount / 100).toFixed(2)} ₼</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Çatdırılma:</span>
                <span className="font-semibold">{shippingFee === 0 ? 'PULSUZ' : `${shippingFee.toFixed(2)} ₼`}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-blue-950">
                <span>Yekun Ödəniləcək:</span>
                <span className="text-base font-black text-blue-900">{total.toFixed(2)} ₼</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {isSubmitting ? (
                <span>Sifariş təsdiqlənir...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sifarişi Təsdiq Et ({total.toFixed(2)} ₼)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Full Interactive Invoice Viewer */}
      {completedOrder && (
        <InvoiceModal
          isOpen={showInvoicePreview}
          onClose={() => setShowInvoicePreview(false)}
          order={completedOrder}
        />
      )}
    </div>
  );
};
