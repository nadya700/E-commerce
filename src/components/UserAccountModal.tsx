import React, { useState } from 'react';
import { X, User, Package, MapPin, ShieldCheck, LogOut, CheckCircle, FileText, Download, Eye } from 'lucide-react';
import { UserProfile, Order } from '../types';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';
import { InvoiceModal } from './InvoiceModal';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  orders: Order[];
  onSwitchRole: (newRole: 'customer' | 'admin') => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('orders');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-blue-100 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 border border-blue-400/40 flex items-center justify-center text-lg font-black">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{currentUser.name}</h3>
                <span className="text-[10px] uppercase font-bold bg-blue-400/20 text-blue-200 px-2 py-0.5 rounded-md border border-blue-300/30">
                  {currentUser.role === 'admin' ? 'Admin / Menecer' : 'Müştəri'}
                </span>
              </div>
              <p className="text-xs text-blue-200">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Sifariş Tarixçəsi ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Hesab Tənzimləmələri</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {activeTab === 'orders' ? (
            orders.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">Heç bir aktiv sifarişiniz yoxdur</p>
                <p className="text-xs text-slate-500">Mavi tonlardakı geyim kolleksiyamızdan sifariş edin.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl border border-blue-100 bg-blue-50/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
                          № {ord.orderNumber}
                        </span>
                        <span className="text-slate-400 ml-2">{ord.createdAt}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {ord.status === 'pending' && 'Gözləmədə'}
                        {ord.status === 'processing' && 'Hazırlanır'}
                        {ord.status === 'shipped' && 'Kuryerdə'}
                        {ord.status === 'delivered' && 'Çatdırıldı'}
                        {ord.status === 'cancelled' && 'Ləğv edildi'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {ord.items.map((i) => (
                        <div key={i.id} className="flex justify-between text-slate-700">
                          <span>
                            {i.product.name} ({i.selectedSize}, {i.selectedColor.name}) × {i.quantity}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {(i.product.price * i.quantity).toFixed(2)} ₼
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs">
                      <span className="text-slate-500">Çatdırılma: {ord.shippingAddress.city}, {ord.shippingAddress.address}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-extrabold text-blue-900">Yekun: {ord.total.toFixed(2)} ₼</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceOrder(ord)}
                            title="Qaiməyə bax"
                            className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Bax</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => generateInvoicePdf(ord, true)}
                            title="PDF Qaiməni Yüklə"
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 rounded-lg flex items-center gap-1 transition-all"
                          >
                            <Download className="w-3 h-3" />
                            <span>PDF Qaimə</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Şəxsi Məlumatlar</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 font-medium block">Ad və Soyad:</label>
                    <p className="font-bold text-slate-800 text-sm">{currentUser.name}</p>
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block">Telefon:</label>
                    <p className="font-bold text-slate-800 text-sm">{currentUser.phone}</p>
                  </div>
                </div>
              </div>

              {/* Role switcher for testing convenience */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <h4 className="font-bold text-blue-950 text-sm">İstifadəçi Rolu Testi (Step 4)</h4>
                <p className="text-slate-600">
                  Hazırkı rol: <strong>{currentUser.role === 'admin' ? 'Admin (Məhsul İdarəetməsi Açıq)' : 'Müştəri (Alış-veriş Rejimi)'}</strong>
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onSwitchRole('customer')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      currentUser.role === 'customer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    Müştəri Rolu
                  </button>
                  <button
                    onClick={() => onSwitchRole('admin')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      currentUser.role === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    Admin / Menecer Rolu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={selectedInvoiceOrder}
        />
      )}
    </div>
  );
};
