import React from 'react';
import { X, Download, Printer, CheckCircle2, Building2, Phone, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handleDownloadPdf = () => {
    generateInvoicePdf(order, true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-800">Elektron Sifariş Qaiməsi (Faktura)</h3>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Çap et"
              className="p-2 text-slate-600 hover:text-blue-700 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Çap</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-blue-600/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Yüklə</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 print:p-0">
          {/* Company Branding & Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black text-lg tracking-wider">
                  M
                </div>
                <div>
                  <h1 className="text-xl font-black text-blue-950 tracking-tight leading-none">MAVI BOUTIQUE</h1>
                  <p className="text-[11px] text-blue-600 font-semibold tracking-wide">Eksklyuziv Mavi Geyim Kolleksiyası</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500 space-y-0.5">
                <p className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Bakı ş., Nizami küçəsi 100, Mavi HQ
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  +994 12 555 20 26 | VÖEN: 1402894121
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  destek@mavi.az | www.mavi.az
                </p>
              </div>
            </div>

            <div className="sm:text-right bg-blue-50/60 sm:bg-transparent p-3 sm:p-0 rounded-2xl w-full sm:w-auto">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md mb-2">
                Rəsmi Qaimə-Faktura
              </span>
              <p className="text-base font-black text-slate-900">{order.orderNumber}</p>
              <p className="text-xs text-slate-500 flex items-center sm:justify-end gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                Tarix: {order.createdAt}
              </p>
              <p className="text-xs font-semibold text-emerald-700 flex items-center sm:justify-end gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ödəniş: {order.paymentMethod === 'card' ? 'Bank Kartı (Onlayn)' : 'Qapıda Nağd'}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-2">
                Müştəri Məlumatları
              </h4>
              <p className="font-bold text-slate-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600 mt-1">Əlaqə: {order.shippingAddress.phone}</p>
              <p className="text-slate-600">E-poçt: {order.userEmail}</p>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-2">
                Çatdırılma Təyinatı
              </h4>
              <p className="font-semibold text-slate-800">
                {order.shippingAddress.city}, {order.shippingAddress.address}
              </p>
              {order.shippingAddress.notes && (
                <p className="text-slate-500 italic mt-1 bg-white p-2 rounded-lg border border-slate-200 text-[11px]">
                  Qeyd: {order.shippingAddress.notes}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-hidden border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white text-[11px] font-bold uppercase">
                  <th className="p-3 pl-4">#</th>
                  <th className="p-3">Məhsul</th>
                  <th className="p-3">Ölçü / Rəng</th>
                  <th className="p-3 text-right">Qiymət</th>
                  <th className="p-3 text-center">Say</th>
                  <th className="p-3 pr-4 text-right">Cəm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-3 pl-4 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-800">{item.product.name}</td>
                    <td className="p-3 text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedSize} / {item.selectedColor.name}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-700 font-medium">
                      {item.product.price.toFixed(2)} ₼
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="p-3 pr-4 text-right font-bold text-slate-900">
                      {(item.product.price * item.quantity).toFixed(2)} ₼
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals and Footer Signatures */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-2 max-w-xs w-full">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                Rəsmi Zəmanət Şərtləri
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Hər bir məhsul 14 gün ərzində qəbz və etiket saxlanılmaqla geri qaytarıla və ya dəyişdirilə bilər.
              </p>
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-blue-800">
                <span>Elektron İmza:</span>
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                  MAVI-AZ-VERIFIED
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs w-full sm:w-72 ml-auto">
              <div className="flex justify-between text-slate-600">
                <span>Ara Cəm:</span>
                <span className="font-semibold">{order.subtotal.toFixed(2)} ₼</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Endirim:</span>
                  <span>-{order.discount.toFixed(2)} ₼</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Çatdırılma:</span>
                <span className="font-semibold">
                  {order.shippingFee === 0 ? 'PULSUZ (0.00 ₼)' : `${order.shippingFee.toFixed(2)} ₼`}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-blue-950">
                <span>Yekun Məbləğ:</span>
                <span className="text-base text-blue-900">{order.total.toFixed(2)} ₼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Sifariş qaiməsi PDF olaraq kompüterinizə və ya telefonunuza saxlanıla bilər.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-white text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Bağla
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Qaiməni Yüklə</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
